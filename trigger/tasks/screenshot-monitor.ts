import { schedules, logger } from '@trigger.dev/sdk/v3'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { runSingleUrlTask } from './run-single-url'

/**
 * Hourly dispatcher.
 *
 * Selects the monitors due this hour and fans them out — one `run-single-url`
 * run per monitor — instead of capturing them in a loop.
 *
 * This used to be a sequential for-loop inside a single 600-second task, which
 * capped the entire product at roughly 30 monitors per hour: past that the task
 * hit `maxDuration` and the tail of the list was dropped with nothing recorded.
 * Fanning out hands scheduling to Trigger.dev, which gives each monitor its own
 * timeout, its own retries, and isolation from a hanging site.
 *
 * The dispatcher itself now only does queries and enqueues, so it finishes in
 * seconds regardless of how many monitors are due.
 */

/** Enqueue in chunks so one oversized batch can't be rejected wholesale. */
const BATCH_SIZE = 100

/** Safety valve: refuse to enqueue an implausible number of runs in one hour. */
const MAX_RUNS_PER_DISPATCH = 10_000

export const screenshotMonitorTask = schedules.task({
  id: 'screenshot-monitor',
  cron: '0 * * * *',
  maxDuration: 300,
  run: async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const now = new Date()
    const due = await loadDueMonitors(supabase, now)

    if (!due.length) {
      logger.info('No monitors due this hour')
      return { dispatched: 0 }
    }

    const toDispatch = due.slice(0, MAX_RUNS_PER_DISPATCH)
    if (due.length > toDispatch.length) {
      logger.warn('Dispatch capped', { due: due.length, cap: MAX_RUNS_PER_DISPATCH })
    }

    logger.info('Dispatching captures', { count: toDispatch.length })

    let dispatched = 0

    for (let i = 0; i < toDispatch.length; i += BATCH_SIZE) {
      const batch = toDispatch.slice(i, i + BATCH_SIZE)

      try {
        await runSingleUrlTask.batchTrigger(
          batch.map((monitor) => ({
            payload: { urlId: monitor.id, trigger: 'scheduled' as const },
            options: {
              // Keeps one workspace with hundreds of monitors from starving
              // everyone else's checks for the hour.
              concurrencyKey: monitor.workspace_id,
              // Deduplicates if the dispatcher is retried within the same hour.
              idempotencyKey: `${monitor.id}:${hourKey(now)}`,
            },
          }))
        )
        dispatched += batch.length
      } catch (err) {
        logger.error('Batch dispatch failed', {
          offset: i,
          size: batch.length,
          err,
        })
      }
    }

    logger.info('Dispatch complete', { dispatched, due: due.length })
    return { dispatched }
  },
})

// ─── Due selection ───────────────────────────────────────────────────────────

interface DueMonitor {
  id: string
  workspace_id: string
}

/**
 * Monitors that should be captured during the current hour.
 *
 * Selection stays in the dispatcher (rather than in each run) so the fan-out
 * width is known up front and a single query answers "how much work is there".
 */
async function loadDueMonitors(
  supabase: SupabaseClient,
  now: Date
): Promise<DueMonitor[]> {
  const { data, error } = await supabase
    .from('monitored_urls')
    .select('id, workspace_id, check_frequency, check_hour, last_checked_at')
    .eq('is_active', true)
    .is('deleted_at', null)

  if (error) throw new Error(`Failed to load monitors: ${error.message}`)
  if (!data?.length) return []

  return data.filter((monitor) => isDue(monitor, now))
}

/**
 * Whether a monitor is due right now.
 *
 * Two scheduling modes coexist:
 *   - `check_hour` set   → run during that UTC hour, at most once per hour.
 *   - `check_hour` null  → run whenever enough time has elapsed.
 *
 * Hourly monitors ignore `check_hour` entirely.
 */
export function isDue(
  monitor: {
    check_frequency: string
    check_hour: number | null
    last_checked_at: string | null
  },
  now: Date
): boolean {
  const lastChecked = monitor.last_checked_at ? new Date(monitor.last_checked_at) : null
  const elapsed = lastChecked ? now.getTime() - lastChecked.getTime() : Infinity

  const HOUR = 60 * 60 * 1000
  const DAY = 24 * HOUR
  const WEEK = 7 * DAY

  if (monitor.check_frequency === 'hourly') {
    return elapsed >= HOUR
  }

  if (monitor.check_hour != null) {
    if (now.getUTCHours() !== monitor.check_hour) return false
    // Guard against running twice inside the same preferred hour.
    if (lastChecked && sameUtcHour(lastChecked, now)) return false
    if (monitor.check_frequency === 'weekly') return elapsed >= WEEK
    return true
  }

  if (monitor.check_frequency === 'daily') return elapsed >= DAY
  if (monitor.check_frequency === 'weekly') return elapsed >= WEEK

  return false
}

function sameUtcHour(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate() &&
    a.getUTCHours() === b.getUTCHours()
  )
}

/** Stable per-hour token used to build idempotency keys. */
function hourKey(now: Date): string {
  return now.toISOString().slice(0, 13) // YYYY-MM-DDTHH
}
