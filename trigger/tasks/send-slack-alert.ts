import { task, logger } from '@trigger.dev/sdk/v3'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { resolveWorkspacePlan } from '../lib/entitlements'
import { sendSlackAlert } from '../lib/slack-notify'
import { buildAlertBlocks, type SlackAlertInput } from '../../lib/slack'

export interface SendSlackAlertPayload {
  alertId: string
}

const SCREENSHOTS_BUCKET = 'screenshots'
const IMAGE_SIGNED_URL_TTL = 60 * 60 * 24 // 24h — long enough that the image still renders if someone opens the Slack thread the next day.

/**
 * Posts one alert to Slack the moment it fires, mirroring
 * `send-instant-alert.ts`'s shape and rules exactly (see that file — this is
 * its Slack sibling, triggered the same way, by id, from the same call site
 * once `take-screenshot.ts` wires it up):
 *
 *  - only `high`/`critical` severities
 *  - only on plans whose `slack` feature is on
 *  - de-duplicated through `notification_events` (`channel_type: 'slack'`)
 *
 * Two gates this task adds that email doesn't need: a monitor that has been
 * muted or is within its 24h snooze window (both set from the message's own
 * action buttons — see `app/api/slack/interactions/route.ts`) is skipped
 * before anything is sent.
 */
export const sendSlackAlertTask = task({
  id: 'send-slack-alert',
  maxDuration: 30,
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 3_000,
    maxTimeoutInMs: 15_000,
  },
  run: async (payload: SendSlackAlertPayload) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: alert, error } = await supabase
      .from('alerts')
      .select(
        '*, monitored_urls(id, url, name, alerts_muted, alerts_snoozed_until)'
      )
      .eq('id', payload.alertId)
      .maybeSingle()

    if (error) throw new Error(`Failed to load alert: ${error.message}`)
    if (!alert) {
      logger.warn('Slack alert skipped — alert not found', { alertId: payload.alertId })
      return { sent: false, reason: 'not_found' as const }
    }

    if (alert.severity !== 'high' && alert.severity !== 'critical') {
      logger.info('Slack alert skipped — severity stays in the digest', {
        alertId: alert.id,
        severity: alert.severity,
      })
      return { sent: false, reason: 'severity' as const }
    }

    const plan = await resolveWorkspacePlan(supabase, alert.workspace_id)
    if (!plan.features.slack) {
      logger.info('Slack alert skipped — plan lacks slack', { alertId: alert.id, plan: plan.id })
      return { sent: false, reason: 'plan' as const }
    }

    const monitor = alert.monitored_urls as {
      id: string
      url: string
      name: string
      alerts_muted: boolean
      alerts_snoozed_until: string | null
    } | null

    if (monitor?.alerts_muted) {
      logger.info('Slack alert skipped — monitor muted', { alertId: alert.id, monitorId: monitor.id })
      return { sent: false, reason: 'muted' as const }
    }

    if (monitor?.alerts_snoozed_until && new Date(monitor.alerts_snoozed_until).getTime() > Date.now()) {
      logger.info('Slack alert skipped — monitor snoozed', {
        alertId: alert.id,
        monitorId: monitor.id,
        until: monitor.alerts_snoozed_until,
      })
      return { sent: false, reason: 'snoozed' as const }
    }

    // De-dupe: a re-trigger of this task, or a retry of whatever enqueued it,
    // must not double-post the same alert.
    const { data: existing } = await supabase
      .from('notification_events')
      .select('id')
      .eq('alert_id', alert.id)
      .eq('channel_type', 'slack')
      .limit(1)
      .maybeSingle()

    if (existing) {
      logger.info('Slack alert skipped — already sent', { alertId: alert.id })
      return { sent: false, reason: 'duplicate' as const }
    }

    const imageUrl = await resolveImageUrl(supabase, alert)

    const alertInput: SlackAlertInput = {
      id: alert.id,
      workspace_id: alert.workspace_id,
      monitored_url_id: alert.monitored_url_id,
      title: alert.title,
      summary: alert.summary,
      ai_summary: alert.ai_summary,
      severity: alert.severity,
      diff_pct: alert.diff_pct,
      monitor_name: monitor?.name ?? monitor?.url ?? 'Monitor',
      monitor_url: monitor?.url ?? '',
      image_url: imageUrl,
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const { blocks, text } = buildAlertBlocks(alertInput, appUrl)

    const result = await sendSlackAlert({
      workspaceId: alert.workspace_id,
      alertId: alert.id,
      blocks,
      text,
    })

    if (!result.sent) {
      logger.warn('Slack alert not sent', { alertId: alert.id, reason: result.reason })
      return { sent: false, reason: result.reason ?? ('slack_error' as const) }
    }

    logger.info('Slack alert sent', { alertId: alert.id, severity: alert.severity })
    return { sent: true as const }
  },
})

/**
 * Prefers the diff image (what actually changed) over a bare snapshot, and
 * returns undefined rather than throwing when neither is available or
 * signing fails — an image is a nice-to-have on this message, never a
 * reason to fail the send.
 */
async function resolveImageUrl(
  supabase: SupabaseClient,
  alert: { diff_storage_path: string | null; current_snapshot_id: string | null }
): Promise<string | null> {
  try {
    if (alert.diff_storage_path) {
      const { data, error } = await supabase.storage
        .from(SCREENSHOTS_BUCKET)
        .createSignedUrl(alert.diff_storage_path, IMAGE_SIGNED_URL_TTL)
      if (!error && data?.signedUrl) return data.signedUrl
    }

    if (alert.current_snapshot_id) {
      const { data: snapshot } = await supabase
        .from('screenshot_snapshots')
        .select('storage_path')
        .eq('id', alert.current_snapshot_id)
        .maybeSingle()

      if (snapshot?.storage_path) {
        const { data, error } = await supabase.storage
          .from(SCREENSHOTS_BUCKET)
          .createSignedUrl(snapshot.storage_path, IMAGE_SIGNED_URL_TTL)
        if (!error && data?.signedUrl) return data.signedUrl
      }
    }
  } catch (err) {
    console.warn('[send-slack-alert] failed to resolve image url', err instanceof Error ? err.message : err)
  }

  return null
}
