import { schedules, logger } from '@trigger.dev/sdk/v3'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const sendAlertDigestTask = schedules.task({
  id: 'send-alert-digest',
  cron: '0 8 * * *', // daily at 8 AM UTC
  maxDuration: 120,
  run: async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const resend = new Resend(process.env.RESEND_API_KEY!)

    logger.info('Alert digest started')

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data: alerts } = await supabase
      .from('alerts')
      .select('*, monitored_urls(url, name, check_frequency), workspaces(domain, owner_user_id)')
      .eq('status', 'open')
      .gte('triggered_at', since)
      .order('severity', { ascending: false })

    if (!alerts?.length) {
      logger.info('No new alerts to send')
      return
    }

    // Group by workspace
    const byWorkspace: Record<string, typeof alerts> = {}
    for (const alert of alerts) {
      const wsId = alert.workspace_id
      if (!byWorkspace[wsId]) byWorkspace[wsId] = []
      byWorkspace[wsId].push(alert)
    }

    for (const [wsId, wsAlerts] of Object.entries(byWorkspace)) {
      const { data: channels } = await supabase
        .from('notification_channels')
        .select('*')
        .eq('workspace_id', wsId)
        .eq('channel_type', 'email')
        .eq('is_active', true)

      if (!channels?.length) continue

      const ownerUserId = (wsAlerts[0] as any).workspaces?.owner_user_id
      if (!ownerUserId) continue

      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', ownerUserId)
        .single()

      if (!profile?.email) continue

      const criticalCount = wsAlerts.filter((a) => a.severity === 'critical').length
      const highCount     = wsAlerts.filter((a) => a.severity === 'high').length

      const severityBg: Record<string, string> = {
        critical: '#fee2e2',
        high:     '#fef3c7',
        medium:   '#fefce8',
        low:      '#f0fdf4',
      }
      const severityColor: Record<string, string> = {
        critical: '#dc2626',
        high:     '#d97706',
        medium:   '#ca8a04',
        low:      '#16a34a',
      }

      const alertRows = wsAlerts
        .slice(0, 10)
        .map((a: any) => {
          const diffLabel = a.diff_pct !== null ? `${Number(a.diff_pct).toFixed(1)}% changed` : ''
          const pageLabel = a.monitored_urls?.name ?? a.monitored_urls?.url ?? ''
          return `
          <tr>
            <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;">
              <div style="font-weight:600;color:#0f172a;font-size:14px;">${a.title}</div>
              <div style="color:#64748b;font-size:13px;margin-top:2px;">${a.summary}</div>
              ${pageLabel ? `<div style="color:#94a3b8;font-size:11px;margin-top:4px;font-family:monospace;">${pageLabel}</div>` : ''}
            </td>
            <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;text-align:center;white-space:nowrap;vertical-align:top;">
              <span style="background:${severityBg[a.severity] ?? '#f8fafc'};color:${severityColor[a.severity] ?? '#374151'};padding:3px 10px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:0.05em;display:block;margin-bottom:4px;">${a.severity.toUpperCase()}</span>
              ${diffLabel ? `<span style="color:#94a3b8;font-size:11px;">${diffLabel}</span>` : ''}
            </td>
          </tr>`
        })
        .join('')

      const domain   = (wsAlerts[0] as any).workspaces?.domain ?? ''
      const appUrl   = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
      const fromDomain = process.env.EMAIL_FROM_DOMAIN ?? 'yourdomain.com'

      const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#0f172a;padding:24px 32px;">
      <div style="color:white;font-size:20px;font-weight:700;margin:0;">PageWatch</div>
      <div style="color:#94a3b8;font-size:13px;margin-top:4px;">Visual Change Digest</div>
    </div>
    <div style="padding:32px;">
      <p style="color:#374151;font-size:15px;margin:0 0 8px;">Hi ${profile.full_name ?? 'there'},</p>
      <p style="color:#374151;font-size:15px;margin:0 0 24px;">
        You have <strong>${wsAlerts.length} page change alert${wsAlerts.length > 1 ? 's' : ''}</strong> in the last 24 hours${criticalCount > 0 ? ` — including <strong style="color:#dc2626;">${criticalCount} critical</strong>` : ''}.
      </p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:10px 16px;text-align:left;font-size:12px;color:#64748b;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">Change</th>
            <th style="padding:10px 16px;text-align:center;font-size:12px;color:#64748b;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;width:110px;">Severity</th>
          </tr>
        </thead>
        <tbody>${alertRows}</tbody>
      </table>
      <div style="margin-top:28px;">
        <a href="${appUrl}/dashboard/alerts" style="display:inline-block;background:#0f172a;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">View All Alerts &rarr;</a>
      </div>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #f1f5f9;">
      <p style="color:#94a3b8;font-size:12px;margin:0;">
        PageWatch &middot; monitoring <strong>${domain}</strong> &middot;
        <a href="${appUrl}/dashboard/settings" style="color:#94a3b8;text-decoration:underline;">Manage notifications</a>
      </p>
    </div>
  </div>
</body>
</html>`

      try {
        await resend.emails.send({
          from:    `PageWatch <alerts@${fromDomain}>`,
          to:      profile.email,
          subject: `${criticalCount > 0 ? '🔴' : highCount > 0 ? '🟡' : '👁'} ${wsAlerts.length} page change alert${wsAlerts.length > 1 ? 's' : ''} — ${domain}`,
          html,
        })

        await supabase.from('notification_events').insert(
          wsAlerts.map((a: any) => ({
            workspace_id: wsId,
            alert_id:     a.id,
            channel_type: 'email',
            sent_at:      new Date().toISOString(),
            status:       'sent',
          }))
        )

        logger.info('Digest sent', { workspace: wsId, alertCount: wsAlerts.length })
      } catch (err) {
        logger.error('Failed to send digest', { workspace: wsId, err })
      }
    }

    logger.info('Alert digest complete')
  },
})
