import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import type { sendInstantAlertTask } from '../tasks/send-instant-alert'
import { captureError } from './observability'

/**
 * `NEXT_PUBLIC_APP_URL`, resolved once here so every template gets the same
 * fallback the rest of this file already used inline
 * (`process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'`).
 */
export function resolveAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
}

/**
 * Every template's unsubscribe/manage-notifications link. There is no
 * per-email unsubscribe token/route yet (that would live in
 * `app/dashboard/**`, out of scope here) — this points at the same settings
 * page the pre-existing digest and instant-alert emails already linked
 * "Manage notifications" to.
 */
export function manageNotificationsUrl(appUrl: string = resolveAppUrl()): string {
  return `${appUrl}/dashboard/settings`
}

/**
 * The one place in the worker that sends email.
 *
 * Everything that wants to notify a workspace — the instant-alert task, and
 * `run-single-url`'s monitor-health checks — goes through `sendEmail` here
 * instead of calling Resend directly, so recipient resolution, the
 * `notification_events` audit trail, and "never let a failed send break the
 * caller" are each implemented exactly once.
 */

// ─── Recipient resolution ──────────────────────────────────────────────────────

interface Recipient {
  email: string
  name: string | null
}

/**
 * Resolves who a workspace's email notifications go to.
 *
 * Prefers the workspace's own `notification_channels` row (what the
 * onboarding wizard writes, and what a user can repoint from settings). Falls
 * back to the workspace owner's `profiles.email` when no such row exists.
 *
 * The fallback is the point, not a nicety: `createWorkspace` now seeds a
 * default channel (see `lib/actions/workspace.ts`), but workspaces created
 * before that fix — or a row a user deleted without replacing it — would
 * otherwise go completely dark. A monitoring product that silently stops
 * notifying its owner is the exact failure this migration exists to close.
 */
async function resolveRecipient(
  supabase: SupabaseClient,
  workspaceId: string
): Promise<Recipient | null> {
  const { data: channel } = await supabase
    .from('notification_channels')
    .select('config')
    .eq('workspace_id', workspaceId)
    .eq('channel_type', 'email')
    .eq('is_active', true)
    .maybeSingle()

  const configEmail = (channel?.config as { email?: string } | null)?.email
  if (configEmail) {
    return { email: configEmail, name: null }
  }

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('owner_user_id')
    .eq('id', workspaceId)
    .maybeSingle()

  if (!workspace?.owner_user_id) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name')
    .eq('id', workspace.owner_user_id)
    .maybeSingle()

  if (!profile?.email) return null

  return { email: profile.email, name: profile.full_name ?? null }
}

// ─── Sending ────────────────────────────────────────────────────────────────

export interface SendEmailInput {
  workspaceId: string
  subject: string
  html: string
  /** Plain-text alternative. Every template in `emails/` renders one alongside its HTML — pass it through so mail clients that prefer/require text get it. */
  text?: string
  /** Ties the send to an alert for the audit trail. Omit for health emails. */
  alertId?: string
  /** Stored alongside the `notification_events` row, e.g. `{ kind: 'monitor_failing' }`. */
  metadata?: Record<string, unknown>
}

/**
 * Sends one email for a workspace and records it. Never throws.
 *
 * A capture that just finished succeeding — or is mid-retry after failing —
 * must never be failed by a downstream email provider outage. Every failure
 * path here logs and returns; nothing propagates.
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const recipient = await resolveRecipient(supabase, input.workspaceId)
    if (!recipient) {
      console.warn('[notify] no recipient for workspace', input.workspaceId)
      return
    }

    const resend = new Resend(process.env.RESEND_API_KEY!)
    const fromDomain = process.env.EMAIL_FROM_DOMAIN ?? 'yourdomain.com'

    const { error } = await resend.emails.send({
      from: `PageWatch <alerts@${fromDomain}>`,
      to: recipient.email,
      subject: input.subject,
      html: input.html,
      ...(input.text ? { text: input.text } : {}),
    })

    if (error) {
      console.warn('[notify] send failed', input.workspaceId, error.message)
      captureError(new Error(`Resend send failed: ${error.message}`), {
        workspaceId: input.workspaceId,
        alertId: input.alertId,
      })
      return
    }

    // Recorded only on a confirmed send, matching `send-alert-digest`'s
    // pattern — a row here is a promise that mail actually left the building,
    // not that we merely attempted it.
    const { error: insertErr } = await supabase.from('notification_events').insert({
      workspace_id: input.workspaceId,
      alert_id: input.alertId ?? null,
      channel_type: 'email',
      sent_at: new Date().toISOString(),
      status: 'sent',
      metadata: input.metadata ?? null,
    })

    if (insertErr) {
      console.warn('[notify] failed to record notification_event', insertErr.message)
    }
  } catch (err) {
    // Defence in depth beneath the two try points above — resolveRecipient or
    // the Resend client throwing outright (bad env, network) must land here,
    // not bubble into the caller's capture task.
    console.warn('[notify] sendEmail threw', err instanceof Error ? err.message : err)
    captureError(err, { workspaceId: input.workspaceId, alertId: input.alertId })
  }
}

// ─── Instant alerts ─────────────────────────────────────────────────────────

/**
 * Enqueues `send-instant-alert` for one alert.
 *
 * `take-screenshot.ts` (owned by another agent) is where alerts are created
 * and is the natural call site for this — it is intentionally NOT wired in
 * here. Call `triggerInstantAlert(alert.id)` right after the `alerts` insert
 * in `processUrl` once that integration is ready.
 *
 * Triggered by task id rather than importing `sendInstantAlertTask` directly
 * (only its type is imported, which erases at compile time) so this module
 * and `tasks/send-instant-alert.ts`, which imports `sendEmail` from here,
 * don't form a runtime import cycle.
 */
export async function triggerInstantAlert(alertId: string): Promise<void> {
  try {
    const { tasks } = await import('@trigger.dev/sdk/v3')
    await tasks.trigger<typeof sendInstantAlertTask>('send-instant-alert', { alertId })
  } catch (err) {
    // Same rule as sendEmail: failing to enqueue a notification must never
    // fail the capture that produced the alert. The digest still catches it.
    console.warn('[notify] triggerInstantAlert failed', alertId, err instanceof Error ? err.message : err)
    captureError(err, { alertId })
  }
}
