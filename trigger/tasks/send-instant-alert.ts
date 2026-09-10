import { task, logger } from '@trigger.dev/sdk/v3'
import { createClient } from '@supabase/supabase-js'
import { resolveWorkspacePlan } from '../lib/entitlements'
import { sendEmail, resolveAppUrl, manageNotificationsUrl } from '../lib/notify'
import { renderInstantAlertEmail } from '../../emails/InstantAlert'

export interface SendInstantAlertPayload {
  alertId: string
}

/**
 * Emails one alert the moment it fires, instead of waiting for the next
 * `send-alert-digest` run — which fires once a day and, for an alert raised
 * minutes after the last digest, can sit on real news for up to 24 hours.
 *
 * Deliberately narrow: only `high`/`critical` severities, and only on plans
 * whose `instantAlerts` feature is on (everyone else still gets it in the
 * daily digest). This task is triggered by id (`tasks.trigger('send-instant-alert', ...)`)
 * from `trigger/lib/notify.ts#triggerInstantAlert` — see that file for why,
 * and for the note that the call site inside `processUrl` (which creates the
 * alert) is intentionally not wired up here.
 */
export const sendInstantAlertTask = task({
  id: 'send-instant-alert',
  maxDuration: 30,
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 3_000,
    maxTimeoutInMs: 15_000,
  },
  run: async (payload: SendInstantAlertPayload) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: alert, error } = await supabase
      .from('alerts')
      .select('*, monitored_urls(url, name, alerts_muted, alerts_snoozed_until)')
      .eq('id', payload.alertId)
      .maybeSingle()

    if (error) throw new Error(`Failed to load alert: ${error.message}`)
    if (!alert) {
      logger.warn('Instant alert skipped — alert not found', { alertId: payload.alertId })
      return { sent: false, reason: 'not_found' as const }
    }

    // Mute and snooze are set from the Slack action buttons, but they are a
    // statement about the MONITOR, not about Slack. Someone who mutes a noisy
    // monitor and then keeps getting emails about it has not been listened to.
    const monitor = alert.monitored_urls as
      | { alerts_muted?: boolean | null; alerts_snoozed_until?: string | null }
      | null

    if (monitor?.alerts_muted) {
      logger.info('Instant alert skipped — monitor is muted', { alertId: alert.id })
      return { sent: false, reason: 'muted' as const }
    }

    if (monitor?.alerts_snoozed_until && new Date(monitor.alerts_snoozed_until) > new Date()) {
      logger.info('Instant alert skipped — monitor is snoozed', {
        alertId: alert.id,
        until: monitor.alerts_snoozed_until,
      })
      return { sent: false, reason: 'snoozed' as const }
    }

    if (alert.severity !== 'high' && alert.severity !== 'critical') {
      logger.info('Instant alert skipped — severity stays in the digest', {
        alertId: alert.id,
        severity: alert.severity,
      })
      return { sent: false, reason: 'severity' as const }
    }

    const plan = await resolveWorkspacePlan(supabase, alert.workspace_id)
    if (!plan.features.instantAlerts) {
      logger.info('Instant alert skipped — plan lacks instantAlerts', {
        alertId: alert.id,
        plan: plan.id,
      })
      return { sent: false, reason: 'plan' as const }
    }

    // De-dupe: `run-single-url`'s retries, or a re-trigger of this task
    // itself, must not double-email the same alert.
    const { data: existing } = await supabase
      .from('notification_events')
      .select('id')
      .eq('alert_id', alert.id)
      .eq('channel_type', 'email')
      .limit(1)
      .maybeSingle()

    if (existing) {
      logger.info('Instant alert skipped — already sent', { alertId: alert.id })
      return { sent: false, reason: 'duplicate' as const }
    }

    const { html, text } = buildInstantAlertEmail(alert)

    await sendEmail({
      workspaceId: alert.workspace_id,
      subject: `${alert.severity === 'critical' ? '\u{1F534}' : '\u{1F7E1}'} ${alert.title}`,
      html,
      text,
      alertId: alert.id,
      metadata: { kind: 'instant_alert', severity: alert.severity },
    })

    logger.info('Instant alert sent', { alertId: alert.id, severity: alert.severity })
    return { sent: true as const }
  },
})

function buildInstantAlertEmail(alert: any): { html: string; text: string } {
  const appUrl = resolveAppUrl()
  const pageLabel = alert.monitored_urls?.name ?? alert.monitored_urls?.url ?? ''
  const pageUrl = alert.monitored_urls?.url ?? ''
  const diffPct = alert.diff_pct !== null ? Number(alert.diff_pct) : null
  const summary = alert.ai_summary || alert.summary

  return renderInstantAlertEmail({
    title: alert.title,
    summary,
    severity: alert.severity,
    pageLabel,
    pageUrl,
    diffPct,
    monitoredUrlId: alert.monitored_url_id,
    appUrl,
    manageUrl: manageNotificationsUrl(appUrl),
  })
}
