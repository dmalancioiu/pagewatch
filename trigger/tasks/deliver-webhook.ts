import { task, logger } from '@trigger.dev/sdk/v3'
import { createClient } from '@supabase/supabase-js'
import { buildAlertWebhookEvent, deliverToEndpoint } from '../lib/webhook-delivery'
import type { WebhookEventType } from '../../lib/webhooks'

export interface DeliverWebhookPayload {
  endpointId: string
  alertId: string
  eventType: WebhookEventType
}

/**
 * Delivers one alert event to one webhook endpoint.
 *
 * One task run per (endpoint, alert) pair — `trigger/lib/webhook-delivery.ts#triggerWebhookDeliveries`
 * fans a single alert out into one of these per active endpoint, mirroring
 * how `send-slack-alert` and `send-instant-alert` are each one task per
 * alert rather than one task looping over recipients: a slow or failing
 * endpoint gets its own retry schedule and cannot delay or fail delivery to
 * any other endpoint.
 *
 * Retries and gives up: on a failed delivery this throws, so Trigger.dev's
 * own retry/backoff (below) drives the next attempt; after `maxAttempts` it
 * stops retrying and the run itself shows as failed in the Trigger.dev
 * dashboard. Either way, every attempt — success or failure — was already
 * recorded to `webhook_deliveries` before this throws, which is what lets
 * the settings UI show delivery failures without needing to inspect
 * Trigger.dev's own run history.
 */
export const deliverWebhookTask = task({
  id: 'deliver-webhook',
  maxDuration: 30,
  retry: {
    maxAttempts: 6,
    factor: 3,
    minTimeoutInMs: 10_000,
    maxTimeoutInMs: 30 * 60 * 1000,
  },
  run: async (payload: DeliverWebhookPayload, { ctx }) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: endpoint, error: endpointErr } = await supabase
      .from('webhook_endpoints')
      .select('id, workspace_id, url, secret, is_active')
      .eq('id', payload.endpointId)
      .maybeSingle()

    if (endpointErr) throw new Error(`Failed to load webhook endpoint: ${endpointErr.message}`)

    if (!endpoint || !endpoint.is_active) {
      logger.info('Webhook delivery skipped — endpoint missing or disabled', {
        endpointId: payload.endpointId,
      })
      return { delivered: false, reason: 'endpoint_unavailable' as const }
    }

    // Loaded scoped to the endpoint's OWN workspace — the same
    // never-trust-the-payload-alone rule `app/api/slack/interactions/route.ts`
    // applies to a button's claimed alert id. `endpointId` and `alertId`
    // arrive together in one `tasks.trigger` call this worker made itself
    // (see `triggerWebhookDeliveries`), but re-deriving the workspace from
    // the endpoint rather than trusting the payload's pairing costs nothing
    // and closes the same class of mistake.
    const { data: alert, error: alertErr } = await supabase
      .from('alerts')
      .select(
        'id, severity, status, title, summary, ai_summary, diff_pct, triggered_at, monitored_urls(id, url, name)'
      )
      .eq('id', payload.alertId)
      .eq('workspace_id', endpoint.workspace_id)
      .maybeSingle()

    if (alertErr) throw new Error(`Failed to load alert: ${alertErr.message}`)

    if (!alert) {
      logger.info('Webhook delivery skipped — alert not found in this endpoint’s workspace', {
        alertId: payload.alertId,
        endpointId: endpoint.id,
      })
      return { delivered: false, reason: 'alert_not_found' as const }
    }

    const monitor = alert.monitored_urls as unknown as { id: string; url: string; name: string } | null

    const event = buildAlertWebhookEvent(
      // Deterministic per (endpoint, alert, type): every retry of the same
      // logical delivery carries the same event id, so a customer's
      // receiver can de-duplicate retried deliveries the same way Stripe's
      // webhook events do.
      `evt_${endpoint.id}_${alert.id}_${payload.eventType}`,
      payload.eventType,
      {
        id: alert.id,
        severity: alert.severity,
        status: alert.status,
        title: alert.title,
        summary: alert.summary,
        ai_summary: alert.ai_summary,
        diff_pct: alert.diff_pct,
        triggered_at: alert.triggered_at,
      },
      { id: monitor?.id ?? '', url: monitor?.url ?? '', name: monitor?.name ?? '' }
    )

    const result = await deliverToEndpoint(supabase, endpoint, event, ctx.attempt.number)

    if (!result.delivered) {
      logger.warn('Webhook delivery failed', {
        endpointId: endpoint.id,
        alertId: alert.id,
        status: result.status,
        error: result.error,
        attempt: ctx.attempt.number,
      })
      throw new Error(result.error ?? `Webhook endpoint responded with HTTP ${result.status}`)
    }

    logger.info('Webhook delivered', { endpointId: endpoint.id, alertId: alert.id, status: result.status })
    return { delivered: true, status: result.status }
  },
})
