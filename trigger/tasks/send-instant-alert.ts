import { task, logger } from '@trigger.dev/sdk/v3'
import { createClient } from '@supabase/supabase-js'
import { resolveWorkspacePlan } from '../lib/entitlements'
import { sendEmail } from '../lib/notify'

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
      .select('*, monitored_urls(url, name)')
      .eq('id', payload.alertId)
      .maybeSingle()

    if (error) throw new Error(`Failed to load alert: ${error.message}`)
    if (!alert) {
      logger.warn('Instant alert skipped — alert not found', { alertId: payload.alertId })
      return { sent: false, reason: 'not_found' as const }
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

    const html = buildInstantAlertHtml(alert)

    await sendEmail({
      workspaceId: alert.workspace_id,
      subject: `${alert.severity === 'critical' ? '\u{1F534}' : '\u{1F7E1}'} ${alert.title}`,
      html,
      alertId: alert.id,
      metadata: { kind: 'instant_alert', severity: alert.severity },
    })

    logger.info('Instant alert sent', { alertId: alert.id, severity: alert.severity })
    return { sent: true as const }
  },
})

function buildInstantAlertHtml(alert: any): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const pageLabel = alert.monitored_urls?.name ?? alert.monitored_urls?.url ?? ''
  const pageUrl = alert.monitored_urls?.url ?? ''
  const diffLabel = alert.diff_pct !== null ? `${Number(alert.diff_pct).toFixed(1)}% of the page changed` : ''
  const summary = alert.ai_summary || alert.summary

  const severityBg: Record<string, string> = {
    critical: '#fee2e2',
    high: '#fef3c7',
    medium: '#fefce8',
    low: '#f0fdf4',
  }
  const severityColor: Record<string, string> = {
    critical: '#dc2626',
    high: '#d97706',
    medium: '#ca8a04',
    low: '#16a34a',
  }

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#0f172a;padding:24px 32px;">
      <div style="color:white;font-size:20px;font-weight:700;margin:0;">PageWatch</div>
      <div style="color:#94a3b8;font-size:13px;margin-top:4px;">Instant Alert</div>
    </div>
    <div style="padding:32px;">
      <span style="background:${severityBg[alert.severity] ?? '#f8fafc'};color:${severityColor[alert.severity] ?? '#374151'};padding:3px 10px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:0.05em;">${String(alert.severity).toUpperCase()}</span>
      <h1 style="color:#0f172a;font-size:19px;font-weight:700;margin:16px 0 8px;">${alert.title}</h1>
      ${pageLabel ? `<div style="color:#94a3b8;font-size:12px;margin-bottom:16px;font-family:monospace;">${pageLabel}${pageUrl && pageUrl !== pageLabel ? ` &middot; ${pageUrl}` : ''}</div>` : ''}
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 8px;">${summary}</p>
      ${diffLabel ? `<p style="color:#94a3b8;font-size:13px;margin:0 0 24px;">${diffLabel}</p>` : ''}
      <div style="margin-top:24px;">
        <a href="${appUrl}/dashboard/urls/${alert.monitored_url_id}" style="display:inline-block;background:#0f172a;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">View Change &rarr;</a>
      </div>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #f1f5f9;">
      <p style="color:#94a3b8;font-size:12px;margin:0;">
        PageWatch &middot; sent instantly because this alert is ${alert.severity} &middot;
        <a href="${appUrl}/dashboard/settings" style="color:#94a3b8;text-decoration:underline;">Manage notifications</a>
      </p>
    </div>
  </div>
</body>
</html>`
}
