import { task, logger } from '@trigger.dev/sdk/v3'
import { createClient } from '@supabase/supabase-js'
import { processUrl } from '../lib/take-screenshot'
import { resolveWorkspacePlan, hasCheckQuota } from '../lib/entitlements'

export interface RunSingleUrlPayload {
  urlId: string
  /**
   * Where the run came from. `manual` runs are stamped onto the snapshot so the
   * rate limiter can count them; `scheduled` is the hourly dispatcher.
   */
  trigger?: 'manual' | 'scheduled'
}

/**
 * Captures and diffs one monitor.
 *
 * This is the unit of work for the whole product: the hourly dispatcher fans
 * out one of these per due monitor, and "run now" triggers a single one. Keeping
 * it as a task rather than a loop iteration means each monitor gets its own
 * timeout, its own retries, and its own failure — one hanging site can't take
 * everyone else's checks down with it.
 */
export const runSingleUrlTask = task({
  id: 'run-single-url',
  maxDuration: 120,
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 5_000,
    maxTimeoutInMs: 30_000,
  },
  run: async (payload: RunSingleUrlPayload) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const isManual = payload.trigger === 'manual'

    const { data: monitor, error } = await supabase
      .from('monitored_urls')
      .select('*')
      .eq('id', payload.urlId)
      .is('deleted_at', null)
      .maybeSingle()

    if (error) throw new Error(`Failed to load monitor: ${error.message}`)
    if (!monitor) throw new Error(`Monitor not found: ${payload.urlId}`)
    if (!monitor.is_active) throw new Error(`Monitor is paused: ${monitor.url}`)

    const plan = await resolveWorkspacePlan(supabase, monitor.workspace_id)

    // Quota is checked here rather than in the dispatcher so both entry points
    // are covered by one rule.
    if (!(await hasCheckQuota(supabase, monitor.workspace_id, plan))) {
      logger.warn('Check skipped — monthly quota exhausted', {
        url: monitor.url,
        plan: plan.id,
      })
      return { skipped: 'quota_exhausted' as const, diffPct: null, alerted: false }
    }

    logger.info('Capture started', { url: monitor.url, plan: plan.id, manual: isManual })

    const result = await processUrl({ ...monitor, _manual: isManual }, supabase, new Date(), plan)

    logger.info('Capture complete', {
      url: monitor.url,
      diffPct: result.diffPct != null ? `${result.diffPct.toFixed(1)}%` : 'baseline',
      alerted: result.alerted,
    })

    return result
  },
})
