import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { env } from '@/lib/env'
import { verifySlackSignature, decodeButtonValue, buildResolvedBlocks, type SlackAlertInput } from '@/lib/slack'
import type { AlertSeverity } from '@/lib/types/database.types'

/**
 * Slack button actions: Acknowledge, Snooze 24h, Mute this monitor.
 *
 * Two layers of trust, checked in order:
 *
 *  1. The request itself is really from Slack — `x-slack-signature` +
 *     `x-slack-request-timestamp`, HMAC-SHA256 verified in `lib/slack.ts`,
 *     with a stale timestamp rejected as a possible replay. Everything below
 *     this point assumes that check already ran.
 *  2. The payload inside the request is honest — a button's `value` names an
 *     alert id and a workspace id, and we still load the alert and confirm it
 *     actually belongs to that workspace before acting. Slack's signature
 *     proves *Slack* sent this; it says nothing about whether the `value` a
 *     compromised or buggy client attached to a button was truthful.
 *
 * Every action both changes the row AND rewrites the Slack message (via the
 * interaction's `response_url`) to say what happened — a button that posts a
 * confirmation but leaves the message looking unactioned is worse than no
 * button, per the task brief this was built against.
 */

export async function POST(request: Request) {
  const rawBody = await request.text()

  const signature = request.headers.get('x-slack-signature')
  const timestamp = request.headers.get('x-slack-request-timestamp')

  if (!env.SLACK_SIGNING_SECRET) {
    console.warn('[slack] interaction rejected — Slack is not configured')
    return NextResponse.json({ error: 'not_configured' }, { status: 503 })
  }

  const validSignature = verifySlackSignature({
    signingSecret: env.SLACK_SIGNING_SECRET,
    signature,
    timestamp,
    rawBody,
  })

  if (!validSignature) {
    console.warn('[slack] interaction rejected — invalid or missing signature')
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })
  }

  const rawPayload = new URLSearchParams(rawBody).get('payload')
  if (!rawPayload) {
    return NextResponse.json({ error: 'missing_payload' }, { status: 400 })
  }

  let payload: {
    actions?: { action_id?: string; value?: string }[]
    response_url?: string
  }
  try {
    payload = JSON.parse(rawPayload)
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  }

  const button = decodeButtonValue(payload.actions?.[0]?.value)
  const responseUrl = payload.response_url

  if (!button) {
    console.warn('[slack] interaction with an unrecognised or malformed button value')
    // 200, not 4xx: this is Slack retrying delivery of a webhook we already
    // received and can't do anything useful with a second time, not a
    // request we want retried.
    return NextResponse.json({})
  }

  const admin = createAdminClient()

  const { data: alert } = await admin
    .from('alerts')
    .select('id, workspace_id, monitored_url_id, title, summary, ai_summary, severity, diff_pct, monitored_urls(id, url, name)')
    .eq('id', button.alertId)
    .maybeSingle()

  if (
    !alert ||
    alert.workspace_id !== button.workspaceId ||
    alert.monitored_url_id !== button.monitoredUrlId
  ) {
    console.warn('[slack] interaction referenced an alert outside its claimed workspace')
    return NextResponse.json({})
  }

  let resolutionText: string

  switch (button.action) {
    case 'acknowledge': {
      await admin.from('alerts').update({ status: 'acknowledged' }).eq('id', alert.id)
      resolutionText = '✅ Acknowledged via Slack.'
      break
    }
    case 'snooze': {
      const until = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      await admin
        .from('monitored_urls')
        .update({ alerts_snoozed_until: until })
        .eq('id', button.monitoredUrlId)
      resolutionText = '😴 Snoozed — no more Slack alerts for this monitor for 24 hours.'
      break
    }
    case 'mute': {
      await admin.from('monitored_urls').update({ alerts_muted: true }).eq('id', button.monitoredUrlId)
      resolutionText = '🔇 Muted — this monitor will no longer post Slack alerts.'
      break
    }
  }

  if (responseUrl) {
    const monitor = alert.monitored_urls as unknown as { id: string; url: string; name: string } | null
    const alertInput: SlackAlertInput = {
      id: alert.id,
      workspace_id: alert.workspace_id,
      monitored_url_id: alert.monitored_url_id,
      title: alert.title,
      summary: alert.summary,
      ai_summary: alert.ai_summary,
      severity: alert.severity as AlertSeverity,
      diff_pct: alert.diff_pct,
      monitor_name: monitor?.name ?? monitor?.url ?? 'Monitor',
      monitor_url: monitor?.url ?? '',
    }

    const { blocks, text } = buildResolvedBlocks(alertInput, env.NEXT_PUBLIC_APP_URL, resolutionText)

    try {
      // `response_url` is Slack's own one-time-ish webhook for this specific
      // message — using it to update means the original message can be
      // rewritten without ever needing the bot token here, and it keeps
      // working even in the same request where a revoked token would
      // otherwise block a `chat.update` call.
      await fetch(responseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replace_original: true, blocks, text }),
      })
    } catch (err) {
      console.warn('[slack] failed to update message via response_url', err instanceof Error ? err.message : err)
    }
  }

  return NextResponse.json({})
}
