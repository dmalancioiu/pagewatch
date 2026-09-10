import { task, logger } from '@trigger.dev/sdk/v3'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { processUrl } from '../lib/take-screenshot'
import { resolveWorkspacePlan, hasCheckQuota } from '../lib/entitlements'
import { sendEmail } from '../lib/notify'

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

  if (newFailureCount === FAILURE_PAUSE_THRESHOLD) {
    await supabase.from('monitored_urls').update({ is_active: false }).eq('id', monitor.id)

    await sendEmail({
      workspaceId: monitor.workspace_id,
      subject: `Monitoring paused — ${monitorLabel}`,
      html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="max-width:560px;margin:40px auto;background:white;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <div style="background:#0f172a;padding:24px 32px;"><div style="color:white;font-size:20px;font-weight:700;">PageWatch</div></div>
          <div style="padding:32px;">
            <h1 style="color:#0f172a;font-size:18px;margin:0 0 12px;">We've paused monitoring for ${monitorLabel}</h1>
            <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
              ${FAILURE_PAUSE_THRESHOLD} checks in a row could not reach this page (most recently: <strong>${reason}</strong>),
              so we stopped trying rather than keep spending your check quota on a target that isn't responding.
            </p>
            <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px;">
              Fix the URL or the site, then resume monitoring from the dashboard whenever it's ready.
            </p>
            <a href="${appUrl}/dashboard/urls" style="display:inline-block;background:#0f172a;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Open Dashboard &rarr;</a>
          </div>
        </div>
      </body></html>`,
      metadata: { kind: 'monitor_paused', monitored_url_id: monitor.id, consecutive_failures: newFailureCount },
    })

    logger.warn('Monitor paused after repeated failures', { url: monitor.url, failures: newFailureCount })
    return
  }

  if (newFailureCount === FAILURE_NOTIFY_THRESHOLD) {
    await sendEmail({
      workspaceId: monitor.workspace_id,
      subject: `We can't reach ${monitorLabel}`,
      html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="max-width:560px;margin:40px auto;background:white;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <div style="background:#0f172a;padding:24px 32px;"><div style="color:white;font-size:20px;font-weight:700;">PageWatch</div></div>
          <div style="padding:32px;">
            <h1 style="color:#0f172a;font-size:18px;margin:0 0 12px;">We can't reach ${monitorLabel}</h1>
            <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 12px;">
              The last ${FAILURE_NOTIFY_THRESHOLD} checks in a row have failed. Most recent reason: <strong>${reason}</strong>.
            </p>
            <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px;">
              We'll keep retrying automatically. If this doesn't clear up, we'll pause monitoring after
              ${FAILURE_PAUSE_THRESHOLD} consecutive failures so it stops using your check quota.
            </p>
            <a href="${appUrl}/dashboard/urls" style="display:inline-block;background:#0f172a;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Open Dashboard &rarr;</a>
          </div>
        </div>
      </body></html>`,
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
      } else if (typeof newFailureCount === 'number') {
        await notifyOnFailureThreshold(supabase, monitor, newFailureCount, reason)
      }

      logger.error('Capture failed', { url: monitor.url, reason })

      // Rethrow unchanged (not `reason`) so Trigger.dev's retry/backoff logic
      // and its own run log keep seeing the real error.
      throw captureErr
    }

    const { error: successRpcErr } = await supabase.rpc('record_monitor_success', { monitor_id: monitor.id })
    if (successRpcErr) {
      logger.warn('record_monitor_success RPC failed', { url: monitor.url, error: successRpcErr.message })
    }

    logger.info('Capture complete', {
      url: monitor.url,
      diffPct: result.diffPct != null ? `${result.diffPct.toFixed(1)}%` : 'baseline',
      alerted: result.alerted,
    })

    return result
  },
})
