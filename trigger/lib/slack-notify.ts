import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { parseSlackConfig, type SlackChannelConfig } from '../../lib/slack'

/**
 * The one place in the worker that posts to Slack.
 *
 * Mirrors `trigger/lib/notify.ts`'s shape on purpose: channel resolution,
 * delivery, and the `notification_events` audit trail each happen exactly
 * once, and a failure here must never fail the capture that produced the
 * alert. `trigger/tasks/send-slack-alert.ts` is the only caller.
 */

// ─── Channel resolution ──────────────────────────────────────────────────────

/**
 * Loads the workspace's active Slack channel, if fully connected.
 *
 * Returns null when there is no `slack` row, the row is inactive, or the
 * connection hasn't had a channel confirmed yet (see `setSlackChannel` in
 * `lib/actions/integrations.ts`) — all three are "nothing to send to", not
 * errors.
 */
export async function resolveSlackChannel(
  supabase: SupabaseClient,
  workspaceId: string
): Promise<(SlackChannelConfig & { channelId: string; channelName: string }) | null> {
  const { data } = await supabase
    .from('notification_channels')
    .select('config')
    .eq('workspace_id', workspaceId)
    .eq('channel_type', 'slack')
    .eq('is_active', true)
    .maybeSingle()

  const config = parseSlackConfig(data?.config)
  if (!config || !config.channelId || !config.channelName) return null

  return { ...config, channelId: config.channelId, channelName: config.channelName }
}

/**
 * Deactivates a workspace's Slack channel row.
 *
 * Called when Slack tells us the bot token is dead (`invalid_auth`,
 * `token_revoked`, `account_inactive`) — retrying a dead token forever would
 * just keep failing, and leaving `is_active: true` would have the settings
 * page keep claiming a connection that no longer works.
 */
export async function deactivateSlackChannel(supabase: SupabaseClient, workspaceId: string): Promise<void> {
  const { error } = await supabase
    .from('notification_channels')
    .update({ is_active: false })
    .eq('workspace_id', workspaceId)
    .eq('channel_type', 'slack')

  if (error) {
    console.warn('[slack-notify] failed to deactivate channel', workspaceId, error.message)
  }
}

// ─── Sending ─────────────────────────────────────────────────────────────────

interface SlackApiResponse {
  ok: boolean
  error?: string
  channel?: string
  ts?: string
}

/** Tokens Slack returns that mean "this bot token no longer works, stop using it." */
const REVOKED_TOKEN_ERRORS = new Set(['invalid_auth', 'token_revoked', 'account_inactive', 'not_authed'])

/**
 * Calls `chat.postMessage`, retrying once on a rate limit.
 *
 * Slack signals rate limiting two ways depending on how the request fails —
 * an HTTP 429 with a `Retry-After` header, or (occasionally, from some
 * gateways) a 200 with `{ ok: false, error: 'ratelimited' }` — so both are
 * handled. One retry only: this runs inside a Trigger.dev task that already
 * has its own backoff/retry policy for anything that still fails after that.
 */
async function postMessageWithRetry(
  botToken: string,
  channel: string,
  blocks: unknown[],
  text: string,
  attempt = 0
): Promise<SlackApiResponse> {
  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${botToken}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ channel, blocks, text }),
  })

  if (res.status === 429 && attempt < 1) {
    const retryAfterSec = Number(res.headers.get('retry-after') ?? '1')
    const waitMs = Math.min(Math.max(retryAfterSec, 1) * 1000, 30_000)
    await new Promise((resolve) => setTimeout(resolve, waitMs))
    return postMessageWithRetry(botToken, channel, blocks, text, attempt + 1)
  }

  const json = (await res.json().catch(() => ({ ok: false, error: 'invalid_response' }))) as SlackApiResponse

  if (json.error === 'ratelimited' && attempt < 1) {
    await new Promise((resolve) => setTimeout(resolve, 2_000))
    return postMessageWithRetry(botToken, channel, blocks, text, attempt + 1)
  }

  return json
}

export interface SendSlackAlertInput {
  workspaceId: string
  alertId: string
  blocks: unknown[]
  text: string
}

export interface SendSlackAlertResult {
  sent: boolean
  reason?:
    | 'not_configured'
    | 'token_revoked'
    | 'channel_not_found'
    | 'slack_error'
    | 'exception'
}

/**
 * Sends one Slack alert and records it. Never throws — same rule as
 * `sendEmail` in `trigger/lib/notify.ts`: a capture that already succeeded
 * must never be failed by a downstream notification provider.
 */
export async function sendSlackAlert(input: SendSlackAlertInput): Promise<SendSlackAlertResult> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const channel = await resolveSlackChannel(supabase, input.workspaceId)
    if (!channel) {
      console.warn('[slack-notify] no active Slack channel for workspace', input.workspaceId)
      return { sent: false, reason: 'not_configured' }
    }

    const result = await postMessageWithRetry(channel.botToken, channel.channelId, input.blocks, input.text)

    if (!result.ok) {
      if (result.error && REVOKED_TOKEN_ERRORS.has(result.error)) {
        console.warn('[slack-notify] bot token revoked — deactivating channel', input.workspaceId)
        await deactivateSlackChannel(supabase, input.workspaceId)
        return { sent: false, reason: 'token_revoked' }
      }

      if (result.error === 'channel_not_found' || result.error === 'is_archived') {
        // Left active on purpose: the channel may come back (unarchived, or
        // this was transient), and email/digest delivery is unaffected —
        // only the next Slack send retries against the same channel id.
        console.warn('[slack-notify] channel not reachable', input.workspaceId, result.error)
        return { sent: false, reason: 'channel_not_found' }
      }

      console.warn('[slack-notify] send failed', input.workspaceId, result.error)
      return { sent: false, reason: 'slack_error' }
    }

    // Recorded only on a confirmed send — a row here is a promise the message
    // actually reached Slack, matching `sendEmail`'s own rule.
    const { error: insertErr } = await supabase.from('notification_events').insert({
      workspace_id: input.workspaceId,
      alert_id: input.alertId,
      channel_type: 'slack',
      sent_at: new Date().toISOString(),
      status: 'sent',
      metadata: { channel_id: result.channel, message_ts: result.ts },
    })

    if (insertErr) {
      console.warn('[slack-notify] failed to record notification_event', insertErr.message)
    }

    return { sent: true }
  } catch (err) {
    console.warn('[slack-notify] sendSlackAlert threw', err instanceof Error ? err.message : err)
    return { sent: false, reason: 'exception' }
  }
}
