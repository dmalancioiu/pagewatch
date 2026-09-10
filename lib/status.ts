/**
 * Status checks shared by `app/api/health/route.ts` (JSON, for uptime
 * monitors) and `app/status/page.tsx` (the public status page).
 *
 * Design goals, in order:
 *   1. Never throw. A check that fails is reported `down`, not an unhandled
 *      rejection — the status page's whole reason to exist is answering
 *      "is this us or them" during exactly the moment something is broken,
 *      including when the database itself is unreachable.
 *   2. Never leak anything about the deployment beyond up/down/degraded and
 *      a short fixed human reason: no connection strings, table names, row
 *      counts, or stack traces. "Database: operational" is the entire
 *      message — see `MESSAGES` below, the only place check text is written.
 *   3. Keep the pure aggregation/threshold logic (what `lib/status.test.ts`
 *      covers) separate from the Supabase-backed checks, so it's testable
 *      with plain values and fakes, no network or database required.
 */
import { createAdminClient } from './supabase/admin'

// ─── Types ──────────────────────────────────────────────────────────────────

export type ComponentStatus = 'operational' | 'degraded' | 'down'

export interface ComponentCheckResult {
  name: string
  status: ComponentStatus
  message: string
}

export interface StatusReport {
  status: ComponentStatus
  checkedAt: string
  components: ComponentCheckResult[]
}

// ─── Pure aggregation (unit-tested) ────────────────────────────────────────

/** Worst-of: any `down` makes the whole report `down`; otherwise any `degraded` makes it `degraded`; otherwise `operational`. */
export function aggregateStatus(components: ComponentCheckResult[]): ComponentStatus {
  if (components.some((c) => c.status === 'down')) return 'down'
  if (components.some((c) => c.status === 'degraded')) return 'degraded'
  return 'operational'
}

export interface RecencyThresholds {
  /** At or below this age, operational. */
  degradedAfterMs: number
  /** Above `degradedAfterMs` and at or below this age, degraded. Above it, down. */
  downAfterMs: number
}

/**
 * Classifies how stale a "last seen" timestamp is. `ageMs === null` means
 * "never observed" (no matching row, or the query itself came back empty)
 * and is always `down` — there's no successful-enough state to fall back to.
 * A negative age (the timestamp is in the future — clock skew, or a
 * just-completed check racing the read) is treated as fresh rather than
 * penalised.
 */
export function evaluateRecency(ageMs: number | null, thresholds: RecencyThresholds): ComponentStatus {
  if (ageMs === null) return 'down'
  if (ageMs <= thresholds.degradedAfterMs) return 'operational'
  if (ageMs <= thresholds.downAfterMs) return 'degraded'
  return 'down'
}

/**
 * Runs a check that might throw and guarantees a `ComponentCheckResult`
 * comes back regardless — this is what keeps one broken check (a query that
 * throws, a client that can't even be constructed because an env var is
 * missing) from crashing `getStatusReport` or the page that calls it. The
 * caught error itself is deliberately discarded, not logged with detail:
 * anything it contains (a connection string, a hostname) is exactly what
 * this file promises never to surface.
 */
export async function safeCheck(
  name: string,
  fn: () => Promise<ComponentCheckResult>
): Promise<ComponentCheckResult> {
  try {
    return await fn()
  } catch {
    return { name, status: 'down', message: `${name}: unavailable` }
  }
}

function formatAge(ageMs: number): string {
  const minutes = Math.round(ageMs / 60_000)
  if (minutes < 1) return 'less than a minute ago'
  if (minutes === 1) return '1 minute ago'
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.round(minutes / 60)
  return hours === 1 ? '1 hour ago' : `${hours} hours ago`
}

// ─── Thresholds ─────────────────────────────────────────────────────────────

/**
 * "Monitoring" tracks `monitored_urls.last_success_at` — set only when
 * `run-single-url` completes a capture without throwing (see migration
 * 006). A wide window on purpose: workspaces mix hourly/daily/weekly
 * monitors, so the platform-wide most-recent success can legitimately be an
 * hour or two old even when everything is healthy. What this actually
 * detects is the pipeline going fully dark (Playwright broken, Chromium
 * missing, every capture erroring) — that shows up as this timestamp
 * freezing while `Dispatch` below keeps moving.
 */
export const MONITORING_THRESHOLDS: RecencyThresholds = {
  degradedAfterMs: 2 * 60 * 60 * 1000, // 2h
  downAfterMs: 6 * 60 * 60 * 1000, // 6h
}

/**
 * "Dispatch" tracks `monitored_urls.last_checked_at` — set as soon as a
 * capture's screenshot phase completes, before the diff/alert steps that can
 * still fail afterward (see `trigger/lib/take-screenshot.ts`). Tighter
 * thresholds than Monitoring's because this is pinned to the dispatcher's
 * hourly cron (`trigger/tasks/screenshot-monitor.ts`'s `0 * * * *`): if the
 * scheduler or the worker fleet stops picking up work at all, this is the
 * first thing to go stale, well before Monitoring's wider window would
 * notice.
 *
 * Known limitation: there is no dedicated dispatch-log table, so this is a
 * proxy over the same `monitored_urls` rows rather than a direct read of
 * "did the cron fire" — see `checkDispatch`'s comment.
 */
export const DISPATCH_THRESHOLDS: RecencyThresholds = {
  degradedAfterMs: 75 * 60 * 1000, // 75 min — one hourly tick plus grace
  downAfterMs: 3 * 60 * 60 * 1000, // 3h — several missed ticks in a row
}

// ─── Supabase-backed checks ─────────────────────────────────────────────────

/**
 * `createAdminClient()` throws synchronously when `SUPABASE_SERVICE_ROLE_KEY`
 * is unset (see `lib/supabase/admin.ts`) — exactly the fresh-clone/no-env-vars
 * case this file must survive. `safeCheck` catches that throw the same way it
 * catches a real query failure, so both paths end up `down` with the same
 * generic message rather than one of them crashing the caller.
 */
export async function checkDatabase(): Promise<ComponentCheckResult> {
  return safeCheck('Database', async () => {
    const supabase = createAdminClient()
    const { error } = await supabase.from('workspaces').select('id', { head: true, count: 'exact' })
    if (error) throw error
    return { name: 'Database', status: 'operational', message: 'Database: operational' }
  })
}

export async function checkStorage(): Promise<ComponentCheckResult> {
  return safeCheck('Storage', async () => {
    const supabase = createAdminClient()
    const { error } = await supabase.storage.from('screenshots').list('', { limit: 1 })
    if (error) throw error
    return { name: 'Storage', status: 'operational', message: 'Storage: operational' }
  })
}

/** Most recent successful capture across all active, non-deleted monitors — see `MONITORING_THRESHOLDS`. */
export async function checkMonitoring(now: Date): Promise<ComponentCheckResult> {
  return safeCheck('Monitoring', async () => {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('monitored_urls')
      .select('last_success_at')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('last_success_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle()
    if (error) throw error

    const lastSuccess = data?.last_success_at ?? null
    const ageMs = lastSuccess ? now.getTime() - new Date(lastSuccess).getTime() : null
    const status = evaluateRecency(ageMs, MONITORING_THRESHOLDS)
    const message =
      status === 'operational' && ageMs !== null
        ? `Monitoring: operational (most recent successful check ${formatAge(ageMs)})`
        : status === 'down'
          ? 'Monitoring: no recent successful checks'
          : `Monitoring: degraded (most recent successful check ${ageMs !== null ? formatAge(ageMs) : 'unknown'})`

    return { name: 'Monitoring', status, message }
  })
}

/** Most recent capture attempt (screenshot phase completed) across all active, non-deleted monitors — see `DISPATCH_THRESHOLDS`. */
export async function checkDispatch(now: Date): Promise<ComponentCheckResult> {
  return safeCheck('Dispatch', async () => {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('monitored_urls')
      .select('last_checked_at')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('last_checked_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle()
    if (error) throw error

    const lastChecked = data?.last_checked_at ?? null
    const ageMs = lastChecked ? now.getTime() - new Date(lastChecked).getTime() : null
    const status = evaluateRecency(ageMs, DISPATCH_THRESHOLDS)
    const message =
      status === 'operational' && ageMs !== null
        ? `Dispatch: operational (most recent capture ${formatAge(ageMs)})`
        : status === 'down'
          ? 'Dispatch: no recent capture activity'
          : `Dispatch: degraded (most recent capture ${ageMs !== null ? formatAge(ageMs) : 'unknown'})`

    return { name: 'Dispatch', status, message }
  })
}

// ─── Orchestrator ───────────────────────────────────────────────────────────

/**
 * Runs every check and aggregates the result. Never throws — each check is
 * already wrapped in `safeCheck`, so `Promise.all` here can't reject.
 */
export async function getStatusReport(now: Date = new Date()): Promise<StatusReport> {
  const components = await Promise.all([checkDatabase(), checkStorage(), checkMonitoring(now), checkDispatch(now)])

  return {
    status: aggregateStatus(components),
    checkedAt: now.toISOString(),
    components,
  }
}
