'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { action } from './action'
import { assertFeature } from '../entitlements'
import { parseSlackConfig } from '../slack'

/**
 * Connect/disconnect server actions for third-party integrations. Slack is
 * the only one today.
 *
 * The OAuth install/callback round trip (`app/api/slack/install`,
 * `app/api/slack/callback`) is what actually connects a Slack team — it has
 * to be a redirect flow, not a server action, since the next step is sending
 * the browser to slack.com. What lands here is the step after: naming which
 * channel alerts should post to, and disconnecting.
 *
 * Every read of the stored config happens through the caller's session
 * client (`ctx.supabase`, RLS-scoped to workspace membership) and the bot
 * token never leaves this module — `setSlackChannel` returns only
 * `{ channelName, teamName }`, and `next/cache`'s `revalidatePath` re-renders
 * `/dashboard/settings` from the server, so the token is never part of any
 * value that crosses back into a client component or the browser.
 */

export const setSlackChannel = action
  .input(
    z.object({
      channel: z
        .string()
        .trim()
        .min(1, 'Enter a channel name.')
        .max(80)
        .transform((value) => value.replace(/^#/, '').trim()),
    })
  )
  .handler(async ({ input, ctx }) => {
    assertFeature(ctx.entitlements, 'slack')

    const { data: row, error: loadError } = await ctx.supabase
      .from('notification_channels')
      .select('config')
      .eq('workspace_id', ctx.workspaceId)
      .eq('channel_type', 'slack')
      .maybeSingle()

    if (loadError || !row) {
      throw new Error('Connect Slack before choosing a channel.')
    }

    const config = parseSlackConfig(row.config)
    if (!config) {
      throw new Error('Slack connection is incomplete. Reconnect from settings and try again.')
    }

    // Posting a real (short, disposable) message is the verification step:
    // it proves the bot token still works and that this exact channel name
    // resolves to a channel the bot can actually post to, before this
    // workspace's alerts start depending on it. `chat:write.public` covers
    // any public channel without an invite; a private channel needs the bot
    // invited first, which surfaces as `not_in_channel` below.
    const res = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.botToken}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        channel: `#${input.channel}`,
        text: 'PageWatch is connected. High and critical alerts will post here.',
      }),
    })

    const json = (await res.json().catch(() => ({ ok: false, error: 'invalid_response' }))) as {
      ok: boolean
      error?: string
      channel?: string
    }

    if (!json.ok || !json.channel) {
      if (json.error === 'channel_not_found') {
        throw new Error(`Could not find a Slack channel named "#${input.channel}". Check the name and try again.`)
      }
      if (json.error === 'not_in_channel') {
        throw new Error(
          `PageWatch can't post to a private channel it hasn't been invited to. Invite it with /invite in #${input.channel}, then try again.`
        )
      }
      // Never include `json` itself — Slack error payloads can echo request
      // fields back, and this message is shown to the user, not just logged.
      throw new Error(`Slack declined the connection (${json.error ?? 'unknown_error'}).`)
    }

    const { error: updateError } = await ctx.supabase
      .from('notification_channels')
      .update({
        config: {
          team_id: config.teamId,
          team_name: config.teamName,
          channel_id: json.channel,
          channel_name: input.channel,
          bot_token: config.botToken,
        },
        is_active: true,
      })
      .eq('workspace_id', ctx.workspaceId)
      .eq('channel_type', 'slack')

    if (updateError) throw new Error(updateError.message)

    revalidatePath('/dashboard/settings')
    return { channelName: input.channel, teamName: config.teamName }
  })

export const disconnectSlack = action.handler(async ({ ctx }) => {
  // Not feature-gated: removing a connection you already have must stay
  // available even after a downgrade takes the `slack` feature away, the
  // same reasoning `effectivePlan` uses everywhere else — entitlements gate
  // new work, never access to what already exists.
  const { error } = await ctx.supabase
    .from('notification_channels')
    .delete()
    .eq('workspace_id', ctx.workspaceId)
    .eq('channel_type', 'slack')

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/settings')
  return { disconnected: true as const }
})
