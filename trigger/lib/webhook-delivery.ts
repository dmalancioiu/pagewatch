import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { buildAlertWebhookEvent, buildWebhookHeaders, type WebhookEventPayload, type WebhookEventType } from '../../lib/webhooks'
import type { deliverWebhookTask } from '../tasks/deliver-webhook'

/**
 * Fans an alert event out to every active webhook endpoint in its workspace,
 * and performs one signed delivery attempt against a single endpoint.
 *
 * Mirrors `trigger/lib/notify.ts#triggerInstantAlert`'s own note exactly:
 * `trigger/lib/take-screenshot.ts` (owned by another agent this pass) is
 * where alerts are created and is the natural call site for
 * `triggerWebhookDeliveries`, and is intentionally NOT wired up here. Call
 * `triggerWebhookDeliveries(alert.id)` right after the `alerts` insert in
 * `processUrl`, alongside `triggerInstantAlert(alert.id)`, once that
 * integration is ready.
 */

const DELIVERY_TIMEOUT_MS = 10_000

// ─── Fan-out ──────────────────────────────────────────────────────────────────

/**
 * Enqueues one `deliver-webhook` run per active endpoint in the alert's
 * workspace. Never throws — same rule as `triggerInstantAlert`: failing to
 * enqueue a webhook delivery must never fail the capture that produced the
 * alert.
 */
export async function triggerWebhookDeliveries(
  alertId: string,
  eventType: WebhookEventType = 'alert.created'
): Promise<void> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: alert } = await supabase
      .from('alerts')
      .select('id, workspace_id')
      .eq('id', alertId)
      .maybeSingle()

    if (!alert) return

    const { data: endpoints } = await supabase
      .from('webhook_endpoints')
      .select('id')
      .eq('workspace_id', alert.workspace_id)
      .eq('is_active', true)

    if (!endpoints?.length) return

    const { tasks } = await import('@trigger.dev/sdk/v3')

    await Promise.all(
      endpoints.map((endpoint) =>
        tasks.trigger<typeof deliverWebhookTask>('deliver-webhook', {
          endpointId: endpoint.id,
          alertId,
          eventType,
        })
      )
    )
  } catch (err) {
    console.warn(
      '[webhook-delivery] triggerWebhookDeliveries failed',
      alertId,
      err instanceof Error ? err.message : err
    )
  }
}

// ─── One delivery attempt ────────────────────────────────────────────────────

export interface WebhookEndpointForDelivery {
  id: string
  workspace_id: string
  url: string
  secret: string
}

export interface DeliveryResult {
  delivered: boolean
  status?: number
  error?: string
}

/**
 * Signs and POSTs one event to one endpoint, then records the attempt in
 * `webhook_deliveries` regardless of outcome — success and failure are both
 * durable rows, which is what lets the settings UI show a real attempt
 * history rather than just the latest state.
 *
 * Does not retry internally: `trigger/tasks/deliver-webhook.ts` throws on a
 * failed result so Trigger.dev's own retry/backoff drives the next attempt,
 * the same pattern every other task in this directory uses.
 */
export async function deliverToEndpoint(
  supabase: SupabaseClient,
  endpoint: WebhookEndpointForDelivery,
  event: WebhookEventPayload,
  attemptNumber: number
): Promise<DeliveryResult> {
  const body = JSON.stringify(event)
  const timestamp = Math.floor(Date.now() / 1000)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'PageWatch-Webhooks/1.0',
    ...buildWebhookHeaders({ secret: endpoint.secret, timestamp, body }),
  }

  let status: number | undefined
  let errorMessage: string | undefined
  let delivered = false

  try {
    const controller = new AbortController()
    const timeoutHandle = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS)

    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers,
        body,
        signal: controller.signal,
      })
      status = response.status
      delivered = response.ok
      if (!delivered) errorMessage = `Endpoint responded with HTTP ${response.status}`
    } finally {
      clearTimeout(timeoutHandle)
    }
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Request failed'
  }

  const { error: insertErr } = await supabase.from('webhook_deliveries').insert({
    workspace_id: endpoint.workspace_id,
    endpoint_id: endpoint.id,
    event_type: event.type,
    alert_id: event.data.alert.id,
    attempt_number: attemptNumber,
    status: delivered ? 'success' : 'failed',
    response_status: status ?? null,
    error: errorMessage ?? null,
  })

  if (insertErr) {
    // The delivery outcome itself is still returned below and drives
    // retry/backoff either way — a failed audit-trail write must not also
    // swallow or duplicate the actual delivery result.
    console.warn('[webhook-delivery] failed to record delivery attempt', insertErr.message)
  }

  return { delivered, status, error: errorMessage }
}

export { buildAlertWebhookEvent }
