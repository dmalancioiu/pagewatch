import { schedules, logger } from '@trigger.dev/sdk/v3'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { resolveWorkspacePlan } from '../lib/entitlements'

/**
 * Nightly retention.
 *
 * Nothing else in the repo ever deletes a screenshot, a diff, or a storage
 * object — the pricing page sells 14/90/365-day retention as a tier feature,
 * and until this task existed every plan actually got "forever". This runs
 * once a night and enforces two independent windows:
 *
 *   1. Per-workspace: `screenshot_snapshots` older than the workspace's
 *      plan's `retentionDays`, except any snapshot an alert still points at
 *      — evidence must outlive routine history, or "why did this fire" stops
 *      being answerable the moment the routine cleanup runs.
 *   2. Soft-deleted monitors: once `deleted_at` is more than 30 days old, the
 *      monitor row itself (and everything under it) is hard-purged,
 *      regardless of plan — a deleted monitor's history has no owner left to
 *      show it to, whatever the plan's window says.
 *
 * Storage objects are always removed before the database rows that name
 * them. A crash between the two leaves orphaned ROWS pointing at storage
 * that no longer exists — harmless, and the next night's run tries the same
 * workspace again. The other order would leave orphaned OBJECTS with no row
 * left anywhere to say they exist: invisible in the product, unbillable,
 * and permanent.
 */

const BUCKET = 'screenshots'

/** Supabase Storage's `.remove()` takes an array; keep every call under this. */
const STORAGE_REMOVE_BATCH = 100

/** Page size for reading snapshots/monitors/workspaces — keeps one workspace
 *  with an enormous history from holding a single request open indefinitely. */
const PAGE_SIZE = 500

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Grace period after a soft delete before the monitor and its history are
 *  hard-purged. Independent of plan — see module doc above. */
const DELETED_MONITOR_GRACE_DAYS = 30

interface RetentionSummary {
  workspacesScanned: number
  snapshotsDeleted: number
  objectsDeleted: number
  bytesReclaimed: number
  monitorsPurged: number
}

export const enforceRetentionTask = schedules.task({
  id: 'enforce-retention',
  cron: '0 3 * * *',
  maxDuration: 300,
  run: async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    logger.info('Retention started')

    const summary: RetentionSummary = {
      workspacesScanned: 0,
      snapshotsDeleted: 0,
      objectsDeleted: 0,
      bytesReclaimed: 0,
      monitorsPurged: 0,
    }

    await enforceWorkspaceWindows(supabase, summary)
    await purgeDeletedMonitors(supabase, summary)

    logger.info('Retention complete', { ...summary })
    return summary
  },
})

// ─── Per-workspace window ───────────────────────────────────────────────────

async function enforceWorkspaceWindows(supabase: SupabaseClient, summary: RetentionSummary): Promise<void> {
  let from = 0

  while (true) {
    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select('id')
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      logger.error('Failed to list workspaces for retention', { error: error.message })
      return
    }
    if (!workspaces?.length) break

    for (const ws of workspaces) {
      summary.workspacesScanned++
      await enforceOneWorkspace(supabase, ws.id, summary)
    }

    if (workspaces.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }
}

async function enforceOneWorkspace(
  supabase: SupabaseClient,
  workspaceId: string,
  summary: RetentionSummary
): Promise<void> {
  const plan = await resolveWorkspacePlan(supabase, workspaceId)
  const cutoff = new Date(Date.now() - plan.limits.retentionDays * MS_PER_DAY).toISOString()

  const protectedIds = await loadProtectedSnapshotIds(supabase, workspaceId)

  // Every page fetched here gets fully deleted before the next fetch, so
  // repeatedly asking for "the oldest PAGE_SIZE eligible rows" naturally
  // advances — there is no offset to keep in sync with rows disappearing out
  // from under it. Protected snapshots are excluded in the query itself
  // (rather than filtered out client-side after fetching) for the same
  // reason: if they were fetched but left undeleted, a page built entirely
  // of protected rows would never shrink and the loop would spin forever.
  while (true) {
    let query = supabase
      .from('screenshot_snapshots')
      .select('id, storage_path, file_size_bytes, metadata')
      .eq('workspace_id', workspaceId)
      .lt('taken_at', cutoff)
      .order('taken_at', { ascending: true })
      .limit(PAGE_SIZE)

    if (protectedIds.size > 0) {
      query = query.not('id', 'in', `(${[...protectedIds].join(',')})`)
    }

    const { data: page, error } = await query

    if (error) {
      logger.error('Failed to load snapshots for retention', { workspaceId, error: error.message })
      return
    }
    if (!page?.length) break

    await purgeSnapshots(supabase, workspaceId, page, summary)

    if (page.length < PAGE_SIZE) break
  }
}

/** Every snapshot id an alert (in this workspace) currently points at, as
 *  either the current or the previous side of the diff it recorded. */
async function loadProtectedSnapshotIds(supabase: SupabaseClient, workspaceId: string): Promise<Set<string>> {
  const ids = new Set<string>()
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from('alerts')
      .select('current_snapshot_id, previous_snapshot_id')
      .eq('workspace_id', workspaceId)
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      logger.error('Failed to load alert-protected snapshots', { workspaceId, error: error.message })
      break
    }
    if (!data?.length) break

    for (const row of data as { current_snapshot_id: string | null; previous_snapshot_id: string | null }[]) {
      if (row.current_snapshot_id) ids.add(row.current_snapshot_id)
      if (row.previous_snapshot_id) ids.add(row.previous_snapshot_id)
    }

    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  return ids
}

// ─── Soft-deleted monitor purge ─────────────────────────────────────────────

async function purgeDeletedMonitors(supabase: SupabaseClient, summary: RetentionSummary): Promise<void> {
  const cutoff = new Date(Date.now() - DELETED_MONITOR_GRACE_DAYS * MS_PER_DAY).toISOString()

  // Same "always take the top of what's left" shape as the window loop above
  // — each monitor found here is fully purged (rows and all) before the next
  // fetch, so no offset is needed.
  while (true) {
    const { data: monitors, error } = await supabase
      .from('monitored_urls')
      .select('id, workspace_id')
      .not('deleted_at', 'is', null)
      .lt('deleted_at', cutoff)
      .order('deleted_at', { ascending: true })
      .limit(PAGE_SIZE)

    if (error) {
      logger.error('Failed to list soft-deleted monitors for purge', { error: error.message })
      return
    }
    if (!monitors?.length) break

    for (const monitor of monitors as { id: string; workspace_id: string }[]) {
      await purgeMonitor(supabase, monitor, summary)
    }

    if (monitors.length < PAGE_SIZE) break
  }
}

async function purgeMonitor(
  supabase: SupabaseClient,
  monitor: { id: string; workspace_id: string },
  summary: RetentionSummary
): Promise<void> {
  const paths: string[] = []
  let bytesReclaimed = 0
  let snapshotCount = 0
  let from = 0

  // Every snapshot for this monitor, full stop — alert protection doesn't
  // apply here. Once the monitor itself is gone there is no context left for
  // "why did this alert fire" to be answered against, so its evidence goes
  // with it.
  while (true) {
    const { data: snaps, error } = await supabase
      .from('screenshot_snapshots')
      .select('id, storage_path, file_size_bytes, metadata')
      .eq('monitored_url_id', monitor.id)
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      logger.error('Failed to load snapshots for monitor purge', { monitorId: monitor.id, error: error.message })
      return
    }
    if (!snaps?.length) break

    for (const s of snaps as { id: string; storage_path: string | null; file_size_bytes: number | null; metadata: Record<string, unknown> | null }[]) {
      collectSnapshotPaths(s, paths)
      bytesReclaimed += s.file_size_bytes ?? 0
    }
    snapshotCount += snaps.length

    if (snaps.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  const { data: diffs, error: diffErr } = await supabase
    .from('screenshot_diffs')
    .select('diff_storage_path')
    .eq('monitored_url_id', monitor.id)

  if (diffErr) {
    logger.error('Failed to load diff storage paths for monitor purge', { monitorId: monitor.id, error: diffErr.message })
  } else {
    for (const d of (diffs ?? []) as { diff_storage_path: string | null }[]) {
      if (d.diff_storage_path) paths.push(d.diff_storage_path)
    }
  }

  const storageOk = await removeStorageObjects(supabase, paths, summary)
  if (!storageOk) {
    // Leave the monitor row (and everything under it) exactly as it is —
    // still soft-deleted, still past its grace period — so tomorrow's run
    // finds it again and retries. The alternative, deleting the row anyway,
    // would strand whatever objects the failed batch left behind with no row
    // anywhere left to name them: invisible, unbillable, permanent.
    logger.warn('Skipping monitor purge after storage removal failure — will retry next run', { monitorId: monitor.id })
    return
  }

  // Hard delete. `screenshot_snapshots`, `screenshot_diffs` and `alerts` all
  // reference `monitored_urls(id)` with `on delete cascade`, so this one
  // statement retires every row the storage pass above just cleared objects
  // for — deliberately the last thing this function does.
  const { error: delErr } = await supabase.from('monitored_urls').delete().eq('id', monitor.id)
  if (delErr) {
    logger.error('Failed to purge monitor row', { monitorId: monitor.id, error: delErr.message })
    return
  }

  summary.monitorsPurged++
  summary.snapshotsDeleted += snapshotCount
  summary.bytesReclaimed += bytesReclaimed

  logger.info('Purged soft-deleted monitor', { monitorId: monitor.id, workspaceId: monitor.workspace_id, snapshots: snapshotCount })
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

interface SnapshotRow {
  id: string
  storage_path: string | null
  file_size_bytes: number | null
  metadata: Record<string, unknown> | null
}

function collectSnapshotPaths(snapshot: SnapshotRow, into: string[]): void {
  if (snapshot.storage_path) into.push(snapshot.storage_path)

  // Written by the capture path as `thumbs/{ws}/{monitor}/{ts}.webp` — not
  // every snapshot has one (older rows predate thumbnails), so this is
  // read defensively and simply skipped when absent.
  const thumbPath = snapshot.metadata?.thumb_path
  if (typeof thumbPath === 'string' && thumbPath) into.push(thumbPath)
}

async function purgeSnapshots(
  supabase: SupabaseClient,
  workspaceId: string,
  snapshots: SnapshotRow[],
  summary: RetentionSummary
): Promise<void> {
  const ids = snapshots.map((s) => s.id)
  const paths: string[] = []
  let bytesReclaimed = 0

  for (const s of snapshots) {
    collectSnapshotPaths(s, paths)
    bytesReclaimed += s.file_size_bytes ?? 0
  }

  // Diff images live in `screenshot_diffs`, keyed by `current_snapshot_id`,
  // and their storage path isn't reachable from the snapshot row itself — so
  // it has to be fetched now, before the delete below cascades that table's
  // rows away and takes the only record of the path with them.
  for (let i = 0; i < ids.length; i += 100) {
    const chunk = ids.slice(i, i + 100)
    const { data: diffs, error } = await supabase
      .from('screenshot_diffs')
      .select('diff_storage_path')
      .in('current_snapshot_id', chunk)

    if (error) {
      logger.error('Failed to load diff storage paths for retention', { workspaceId, error: error.message })
      continue
    }
    for (const d of (diffs ?? []) as { diff_storage_path: string | null }[]) {
      if (d.diff_storage_path) paths.push(d.diff_storage_path)
    }
  }

  // Storage before rows — see the module doc for why. If any batch fails,
  // skip deleting these rows rather than push on: the rows are the only
  // record of which objects still need removing, and every one of them is
  // still older than the cutoff, so leaving them in place just means
  // tomorrow's run picks the same batch back up.
  const storageOk = await removeStorageObjects(supabase, paths, summary)
  if (!storageOk) {
    logger.warn('Skipping snapshot row deletion after storage removal failure — will retry next run', {
      workspaceId,
      count: ids.length,
    })
    return
  }

  const { error: delErr } = await supabase.from('screenshot_snapshots').delete().in('id', ids)
  if (delErr) {
    logger.error('Failed to delete snapshot rows', { workspaceId, error: delErr.message })
    return
  }

  summary.snapshotsDeleted += ids.length
  summary.bytesReclaimed += bytesReclaimed
}

/**
 * Removes storage objects in batches of at most `STORAGE_REMOVE_BATCH`.
 *
 * Returns whether every batch succeeded. Callers use this to decide whether
 * it's safe to delete the DB rows that named these objects — deleting rows
 * after a failed removal would stray from "storage before rows" into
 * "storage sometimes, rows always", which is exactly the ordering that
 * produces invisible, unbillable, permanent orphaned objects. A batch that
 * fails here is simply left for tomorrow's run: the row that named it hasn't
 * been deleted, so it will be found and retried.
 */
async function removeStorageObjects(
  supabase: SupabaseClient,
  paths: string[],
  summary: RetentionSummary
): Promise<boolean> {
  const unique = [...new Set(paths.filter((p): p is string => Boolean(p)))]
  let ok = true

  for (let i = 0; i < unique.length; i += STORAGE_REMOVE_BATCH) {
    const batch = unique.slice(i, i + STORAGE_REMOVE_BATCH)
    const { data, error } = await supabase.storage.from(BUCKET).remove(batch)

    if (error) {
      logger.error('Storage removal failed', { error: error.message, count: batch.length })
      ok = false
      continue
    }

    summary.objectsDeleted += data?.length ?? batch.length
  }

  return ok
}
