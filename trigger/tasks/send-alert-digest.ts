import { schedules, logger } from '@trigger.dev/sdk/v3'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { renderAlertDigestEmail, type DigestAlertItem } from '../../emails/AlertDigest'
import { resolveAppUrl, manageNotificationsUrl } from '../lib/notify'
import { captureError } from '../lib/observability'

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
      .select('*, monitored_urls(url, name, check_frequency, alerts_muted, alerts_snoozed_until), workspaces(domain, owner_user_id)')
      .eq('status', 'open')
      .gte('triggered_at', since)
      .order('severity', { ascending: false })

    // A muted or snoozed monitor is muted everywhere, not just in Slack where
    // the button lives. Filtering here rather than in the query keeps the
    // snooze comparison in one timezone-safe place.
    const deliverable = (alerts ?? []).filter((a: any) => {
      const monitor = a.monitored_urls
      if (monitor?.alerts_muted) return false
      if (monitor?.alerts_snoozed_until && new Date(monitor.alerts_snoozed_until) > new Date()) {
        return false
      }
      return true
    })

    if (!deliverable.length) {
      logger.info('No new alerts to send')
      return
    }

    // Group by workspace
    const byWorkspace: Record<string, typeof deliverable> = {}
    for (const alert of deliverable) {
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

      const domain   = (wsAlerts[0] as any).workspaces?.domain ?? ''
      const appUrl   = resolveAppUrl()
      const manageUrl = manageNotificationsUrl(appUrl)
      const fromDomain = process.env.EMAIL_FROM_DOMAIN ?? 'yourdomain.com'

      const digestAlerts: DigestAlertItem[] = wsAlerts.slice(0, 10).map((a: any) => ({
        id: a.id,
        title: a.title,
        summary: a.summary,
        severity: a.severity,
        diffPct: a.diff_pct !== null ? Number(a.diff_pct) : null,
        pageLabel: a.monitored_urls?.name ?? a.monitored_urls?.url ?? '',
      }))

      const { html, text } = renderAlertDigestEmail({
        recipientName: profile.full_name,
        domain,
        alerts: digestAlerts,
        totalCount: wsAlerts.length,
        criticalCount,
        highCount,
        appUrl,
        manageUrl,
      })

      try {
        await resend.emails.send({
          from:    `PageWatch <alerts@${fromDomain}>`,
          to:      profile.email,
          subject: `${criticalCount > 0 ? '🔴' : highCount > 0 ? '🟡' : '👁'} ${wsAlerts.length} page change alert${wsAlerts.length > 1 ? 's' : ''} — ${domain}`,
          html,
          text,
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
        // A failed digest send must never fail the schedule that produced it
        // (same rule `sendEmail`/`triggerInstantAlert` follow) — captured for
        // visibility, not rethrown.
        captureError(err, { workspaceId: wsId })
      }
    }

    logger.info('Alert digest complete')
  },
})
