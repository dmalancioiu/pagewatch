import { task, logger } from '@trigger.dev/sdk/v3'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { processUrl } from '../lib/take-screenshot'
import { resolveWorkspacePlan, hasCheckQuota } from '../lib/entitlements'
import { sendEmail, manageNotificationsUrl } from '../lib/notify'
import { renderMonitorFailingEmail } from '../../emails/MonitorFailing'
import { renderMonitorPausedEmail } from '../../emails/MonitorPaused'
import { captureError } from '../lib/observability'

/**
 * Consecutive-failure thresholds that trigger a notification.
 *
 * 3 is "this looks broken, someone should know" without paging on a single
 * blip a retry would have absorbed anyway. 10 is "this has been broken for
 * days" — at hourly cadence that's under half a day, at daily it's over a
 * week; past that point continuing to burn checks against a dead target
 * serves nobody, so the monitor is paused rather than left spinning forever.
 */
const FAILURE_NOTIFY_THRESHOLD = 3
const FAILURE_PAUSE_THRESHOLD = 10

/**
 * Turns whatever `processUrl` threw into a short, human-readable reason safe
 * to show the customer and email to them.
 *
 * Never returns the raw error message or stack trace: those can contain
 * internal hostnames, stack frames with file paths, or (for a fetch/DNS
 * failure) the full target URL — which, for a monitor whose whole purpose is
 * watching an address, can itself carry embedded credentials. Classifying
 * into a small fixed set of reasons is deliberately lossy in exchange for
 * being safe to store and send unreviewed.
 */
function sanitiseError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err)
  const lower = message.toLowerCase()

  if (lower.includes('timeout') || lower.includes('timed out')) {
    return 'Timed out waiting for the page to load'
  }
  if (lower.includes('err_name_not_resolved') || lower.includes('enotfound') || lower.includes('dns')) {
    return 'DNS lookup failed — the domain could not be resolved'
  }
  if (lower.includes('err_connection_refused') || lower.includes('econnrefused')) {
    return 'Connection refused by the server'
  }
  if (lower.includes('err_cert') || lower.includes('ssl') || lower.includes('tls') || lower.includes('certificate')) {
    return 'TLS/certificate error'
  }
  if (lower.includes('err_connection_reset') || lower.includes('econnreset')) {
    return 'Connection reset by the server'
  }
  if (/\b(4\d\d)\b/.test(message) && lower.includes('http')) {
    const status = message.match(/\b(4\d\d)\b/)?.[1]
    return `HTTP ${status}`
  }
  if (/\b(5\d\d)\b/.test(message) && lower.includes('http')) {
    const status = message.match(/\b(5\d\d)\b/)?.[1]
    return `Server error (HTTP ${status})`
  }
  if (lower.includes('private_host') || lower.includes('private host') || lower.includes('unsupported_protocol')) {
    return 'This address is no longer allowed to be monitored'
  }
  if (lower.includes('monitor is paused') || lower.includes('quota')) {
    // Not really a capture failure — surfaced separately, never emailed as one.
    return message
  }

  return 'Capture failed'
}

/**
 * Emails "we can't reach this page" once, and pauses + emails "monitoring
 * paused" once the workspace's plan gets no benefit from further retries.
 *
 * `newFailureCount` is the RETURN VALUE of `record_monitor_failure`'s atomic
 * increment, not a re-read of the row — the only safe way to fire exactly
 * once under Trigger.dev retries. Two concurrent/retried calls that both
 * increment will see two different counts (e.g. 3 and 4); only the call that
 * actually landed on the threshold sends.
 */
async function notifyOnFailureThreshold(
  supabase: SupabaseClient,
  monitor: { id: string; workspace_id: string; url: string; name: string },
  newFailureCount: number,
  reason: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const monitorLabel = monitor.name || monitor.url

  const manageUrl = manageNotificationsUrl(appUrl)

  if (newFailureCount === FAILURE_PAUSE_THRESHOLD) {
    await supabase.from('monitored_urls').update({ is_active: false }).eq('id', monitor.id)

    const { html, text } = renderMonitorPausedEmail({
      monitorLabel,
      reason,
      pauseThreshold: FAILURE_PAUSE_THRESHOLD,
      appUrl,
      manageUrl,
    })

    await sendEmail({
      workspaceId: monitor.workspace_id,
      subject: `Monitoring paused — ${monitorLabel}`,
      html,
      text,
      metadata: { kind: 'monitor_paused', monitored_url_id: monitor.id, consecutive_failures: newFailureCount },
    })

    logger.warn('Monitor paused after repeated failures', { url: monitor.url, failures: newFailureCount })
    return
  }

  if (newFailureCount === FAILURE_NOTIFY_THRESHOLD) {
    const { html, text } = renderMonitorFailingEmail({
      monitorLabel,
      reason,
      failureThreshold: FAILURE_NOTIFY_THRESHOLD,
      pauseThreshold: FAILURE_PAUSE_THRESHOLD,
      appUrl,
      manageUrl,
    })

    await sendEmail({
      workspaceId: monitor.workspace_id,
      subject: `We can't reach ${monitorLabel}`,
      html,
      text,
      metadata: { kind: 'monitor_failing', monitored_url_id: monitor.id, consecutive_failures: newFailureCount },
    })

    logger.warn('Monitor failing — notified', { url: monitor.url, failures: newFailureCount })
  }
}

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

    // Health is recorded around the capture itself, not around quota/plan
    // skips above — those aren't the monitor's fault and must not count
    // against it or reset a genuine failure streak either way.
    let result: { skipped?: string; diffPct: number | null; alerted: boolean }

    try {
      result = await processUrl({ ...monitor, _manual: isManual }, supabase, new Date(), plan)
    } catch (captureErr) {
      const reason = sanitiseError(captureErr)

      const { data: newFailureCount, error: rpcErr } = await supabase.rpc('record_monitor_failure', {
        monitor_id: monitor.id,
        reason,
      })

      if (rpcErr) {
        // The health write failing must not swallow the original capture
        // error — that's the one Trigger.dev's retry needs to see.
        logger.error('record_monitor_failure RPC failed', { url: monitor.url, error: rpcErr.message })
        captureError(new Error(`record_monitor_failure RPC failed: ${rpcErr.message}`), {
          monitorId: monitor.id,
          workspaceId: monitor.workspace_id,
        })
      } else if (typeof newFailureCount === 'number') {
        await notifyOnFailureThreshold(supabase, monitor, newFailureCount, reason)
      }

      logger.error('Capture failed', { url: monitor.url, reason })

      // The capture error itself, sanitised the same way it is before it's
      // ever shown to a customer or emailed to them: `reason` (never the raw
      // `captureErr`, whose message can carry the monitor's own URL — and
      // for a monitoring product, a URL can itself embed credentials) plus
      // IDs only. `captureError`'s own redaction is a backstop, not the
      // first line of defence.
      captureError(captureErr, { monitorId: monitor.id, workspaceId: monitor.workspace_id, reason })

      // Rethrow unchanged (not `reason`) so Trigger.dev's retry/backoff logic
      // and its own run log keep seeing the real error.
      throw captureErr
    }

    const { error: successRpcErr } = await supabase.rpc('record_monitor_success', { monitor_id: monitor.id })
    if (successRpcErr) {
      logger.warn('record_monitor_success RPC failed', { url: monitor.url, error: successRpcErr.message })
      captureError(new Error(`record_monitor_success RPC failed: ${successRpcErr.message}`), {
        monitorId: monitor.id,
        workspaceId: monitor.workspace_id,
      })
    }

    logger.info('Capture complete', {
      url: monitor.url,
      diffPct: result.diffPct != null ? `${result.diffPct.toFixed(1)}%` : 'baseline',
      alerted: result.alerted,
    })

    return result
  },
})
