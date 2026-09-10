'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '../supabase/server'
import {
  requireEntitlements,
  assertCanAddMonitors,
  assertFrequencyAllowed,
  assertZoneCount,
  type Entitlements,
} from '../entitlements'
import { normalizeUrl, deriveMonitorName, UrlValidationError } from '../url'
import type { CheckFrequency, MonitoredUrlMode, Zone } from '../types/database.types'

/**
 * Monitor CRUD.
 *
 * Every mutation here runs through `requireEntitlements()` first. Supabase RLS
 * already guarantees a caller can only touch their own workspace's rows — these
 * checks are about plan limits, which RLS knows nothing about.
 */

export interface UrlInput {
  url: string
  name?: string
  check_frequency?: CheckFrequency
  /** 0–23 UTC. null falls back to elapsed-time scheduling. */
  check_hour?: number | null
  threshold_pct?: number
  /** What the user wants to be alerted about — passed to Claude as context. */
  watch_description?: string | null
  /** Full-page capture vs. visible area only. */
  full_page?: boolean
  mode?: MonitoredUrlMode
  /** Tracked regions. null or empty means whole-page diffing. */
  zones?: Zone[] | null
}

/** Fields a caller may change after creation. */
type MonitorUpdate = Partial<
  Pick<
    UrlInput,
    | 'name'
    | 'check_frequency'
    | 'check_hour'
    | 'threshold_pct'
    | 'watch_description'
    | 'full_page'
    | 'mode'
    | 'zones'
  >
>

// ─── Create ──────────────────────────────────────────────────────────────────

/**
 * Adds one or more monitors.
 *
 * All-or-nothing: if the batch would exceed the plan's monitor ceiling, nothing
 * is inserted. Partial success here would leave the user over quota with no
 * clear way back.
 */
export async function addMonitoredUrls(
  workspaceId: string,
  urls: UrlInput[]
): Promise<{ id: string }[]> {
  const entitlements = await requireEntitlements()
  assertWorkspaceMatches(entitlements, workspaceId)

  // Normalize first so invalid entries are rejected before they count toward
  // the quota check.
  const candidates = urls
    .map((input) => ({ input, url: safeNormalize(input.url) }))
    .filter((candidate): candidate is { input: UrlInput; url: string } =>
      Boolean(candidate.url)
    )

  if (!candidates.length) return []

  assertCanAddMonitors(entitlements, candidates.length)

  const rows = candidates.map(({ input, url }) => {
    const frequency = input.check_frequency ?? 'daily'
    const zones = input.zones ?? []

    assertFrequencyAllowed(entitlements, frequency)
    assertZoneCount(entitlements, zones.length)

    return {
      workspace_id: workspaceId,
      url,
      name: input.name?.trim() || deriveMonitorName(url),
      check_frequency: frequency,
      check_hour: input.check_hour ?? null,
      threshold_pct: input.threshold_pct ?? 5,
      is_active: true,
      watch_description: input.watch_description ?? null,
      full_page: input.full_page ?? true,
      mode: input.mode ?? 'watch',
      zones: zones.length ? zones : null,
    }
  })

  const supabase = await createServerClient()
  const { data, error } = await supabase.from('monitored_urls').insert(rows).select('id')

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/urls')
  revalidatePath('/dashboard')
  return data ?? []
}

// ─── Read ────────────────────────────────────────────────────────────────────

/** Active and paused monitors. Soft-deleted rows are excluded. */
export async function getMonitoredUrls(workspaceId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('monitored_urls')
    .select(
      `
      *,
      screenshot_snapshots (
        id,
        storage_path,
        taken_at
      )
    `
    )
    .eq('workspace_id', workspaceId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getMonitoredUrlById(urlId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('monitored_urls')
    .select(
      `
      *,
      screenshot_snapshots (
        id,
        storage_path,
        taken_at,
        file_size_bytes
      ),
      alerts (
        id,
        diff_pct,
        severity,
        status,
        created_at,
        diff_storage_path,
        current_snapshot_id,
        previous_snapshot_id
      )
    `
    )
    .eq('id', urlId)
    .is('deleted_at', null)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getLatestSnapshot(monitoredUrlId: string) {
  const supabase = await createServerClient()

  const { data } = await supabase
    .from('screenshot_snapshots')
    .select('*')
    .eq('monitored_url_id', monitoredUrlId)
    .order('taken_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data ?? null
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateMonitoredUrl(
  urlId: string,
  updates: MonitorUpdate
): Promise<void> {
  const entitlements = await requireEntitlements()

  // Only re-check the limits the caller is actually changing. Someone on a
  // downgraded plan should still be able to rename a monitor whose cadence is
  // now above their tier.
  if (updates.check_frequency) {
    assertFrequencyAllowed(entitlements, updates.check_frequency)
  }
  if (updates.zones !== undefined) {
    assertZoneCount(entitlements, updates.zones?.length ?? 0)
  }

  const supabase = await createServerClient()
  const { error } = await supabase
    .from('monitored_urls')
    .update(updates)
    .eq('id', urlId)
    .is('deleted_at', null)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/urls')
  revalidatePath(`/dashboard/urls/${urlId}`)
}

/** Pauses or resumes capture without affecting history. */
export async function pauseMonitoredUrl(urlId: string, paused: boolean): Promise<void> {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('monitored_urls')
    .update({ is_active: !paused })
    .eq('id', urlId)
    .is('deleted_at', null)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/urls')
  revalidatePath(`/dashboard/urls/${urlId}`)
}

// ─── Delete ──────────────────────────────────────────────────────────────────

/**
 * Soft-deletes a monitor.
 *
 * Hard deletion would cascade through `screenshot_snapshots`, `screenshot_diffs`
 * and `alerts` while leaving the PNG objects orphaned in storage forever. The
 * retention job reclaims both, on the plan's schedule.
 *
 * Freed quota is immediate: `getMonitoredUrls` and the usage count both filter
 * on `deleted_at`.
 */
export async function deleteMonitoredUrl(urlId: string): Promise<void> {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('monitored_urls')
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq('id', urlId)
    .is('deleted_at', null)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/urls')
  revalidatePath('/dashboard')
}

/**
 * Restores a soft-deleted monitor, provided the plan still has room. Only
 * possible until the retention job purges the underlying history.
 */
export async function restoreMonitoredUrl(urlId: string): Promise<void> {
  const entitlements = await requireEntitlements()
  assertCanAddMonitors(entitlements, 1)

  const supabase = await createServerClient()
  const { error } = await supabase
    .from('monitored_urls')
    .update({ deleted_at: null, is_active: true })
    .eq('id', urlId)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/urls')
}

// ─── Internals ───────────────────────────────────────────────────────────────

/**
 * Guards against a client passing someone else's workspace id. RLS would reject
 * the insert anyway, but failing here gives a clear error instead of an opaque
 * policy violation.
 */
function assertWorkspaceMatches(entitlements: Entitlements, workspaceId: string): void {
  if (entitlements.workspaceId !== workspaceId) {
    throw new Error('Workspace mismatch')
  }
}

/** Returns null for anything that fails validation, so a bad row is skipped. */
function safeNormalize(raw: string): string | null {
  try {
    return normalizeUrl(raw)
  } catch (error) {
    if (error instanceof UrlValidationError) return null
    throw error
  }
}
