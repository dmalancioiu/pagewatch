import { createHmac, timingSafeEqual } from 'node:crypto'
import { severityLabel } from './severity'
import type { AlertSeverity } from './types/database.types'

/**
 * Slack support — message building and request verification.
 *
 * Deliberately pure: no Supabase, no `fetch`, no Next imports. Everything
 * that actually talks to Slack or the database lives in
 * `trigger/lib/slack-notify.ts` (posting a new alert) or the API routes
 * under `app/api/slack/` (OAuth, button interactions). Keeping this module
 * pure is what makes it possible to unit-test the two things in this file
 * that are genuinely security- or correctness-critical — signature
 * verification and Block Kit construction — without a database or a network.
 */

// ─── OAuth state (CSRF) ──────────────────────────────────────────────────────

/**
 * What `/api/slack/install` signs into the OAuth `state` param and
 * `/api/slack/callback` verifies before doing anything else.
 *
 * There is no database row backing this — the signature and `issuedAt` are
 * the whole mechanism. That is deliberate: a lost or duplicated state row
 * would either lock an install out or leave a forgeable id lying around,
 * where a signed, self-expiring token has neither failure mode.
 */
export interface SlackOAuthState {
  workspaceId: string
  issuedAt: number
}

const DEFAULT_STATE_TTL_MS = 10 * 60 * 1000 // 10 minutes — long enough for a real OAuth consent screen, short enough that a leaked URL goes stale fast.

/** Signs a `state` param binding the OAuth flow to one workspace. */
export function signState(
  payload: Pick<SlackOAuthState, 'workspaceId'>,
  secret: string,
  issuedAt: number = Date.now()
): string {
  const full: SlackOAuthState = { workspaceId: payload.workspaceId, issuedAt }
  const body = Buffer.from(JSON.stringify(full), 'utf8').toString('base64url')
  const signature = createHmac('sha256', secret).update(body).digest('base64url')
  return `${body}.${signature}`
}

/**
 * Verifies a `state` param: valid signature, well-formed payload, not expired.
 * Returns null on any failure — callers should treat every failure mode
 * identically (reject the callback) rather than branch on which check failed.
 */
export function verifyState(
  state: string | null | undefined,
  secret: string,
  maxAgeMs: number = DEFAULT_STATE_TTL_MS,
  now: number = Date.now()
): SlackOAuthState | null {
  if (!state) return null
  const dot = state.indexOf('.')
  if (dot <= 0 || dot === state.length - 1) return null

  const body = state.slice(0, dot)
  const signature = state.slice(dot + 1)
  const expected = createHmac('sha256', secret).update(body).digest('base64url')

  if (!safeEqual(signature, expected)) return null

  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Partial<SlackOAuthState>
    if (typeof parsed.workspaceId !== 'string' || !parsed.workspaceId) return null
    if (typeof parsed.issuedAt !== 'number' || !Number.isFinite(parsed.issuedAt)) return null
    if (now - parsed.issuedAt > maxAgeMs) return null
    if (parsed.issuedAt > now + 60_000) return null // clock-skew guard against a state "issued" in the future
    return { workspaceId: parsed.workspaceId, issuedAt: parsed.issuedAt }
  } catch {
    return null
  }
}

// ─── Request signature verification ──────────────────────────────────────────

const MAX_REQUEST_AGE_MS = 5 * 60 * 1000 // Slack's own recommended replay window.

export interface VerifySlackSignatureInput {
  signingSecret: string | null | undefined
  /** The raw `x-slack-signature` header, unmodified. */
  signature: string | null | undefined
  /** The raw `x-slack-request-timestamp` header, unmodified. */
  timestamp: string | null | undefined
  /** The exact request body bytes, as text — must not be re-serialized JSON. */
  rawBody: string
  now?: number
}

/**
 * Verifies Slack's request signature (HMAC-SHA256 of `v0:{timestamp}:{body}`)
 * and rejects a stale timestamp, per Slack's documented replay-attack
 * mitigation. Every one of `signingSecret`/`signature`/`timestamp` missing is
 * a hard fail, not a pass — there is no legitimate Slack request missing any
 * of these.
 */
export function verifySlackSignature(input: VerifySlackSignatureInput): boolean {
  const { signingSecret, signature, timestamp, rawBody } = input
  if (!signingSecret || !signature || !timestamp) return false
  if (!/^\d+$/.test(timestamp)) return false

  const now = input.now ?? Date.now()
  const timestampMs = Number(timestamp) * 1000
  if (Math.abs(now - timestampMs) > MAX_REQUEST_AGE_MS) return false

  const base = `v0:${timestamp}:${rawBody}`
  const expected = `v0=${createHmac('sha256', signingSecret).update(base).digest('hex')}`

  return safeEqual(signature, expected)
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

// ─── Stored Slack channel config ─────────────────────────────────────────────

/**
 * Shape of the `slack` row's `notification_channels.config`. Written by
 * `/api/slack/callback` (team + bot token, channel fields null) and completed
 * by `setSlackChannel` (`lib/actions/integrations.ts`) once a channel is
 * confirmed reachable. `channelId`/`channelName` are null in between — a
 * connected-but-not-yet-configured state the settings UI shows explicitly.
 */
export interface SlackChannelConfig {
  teamId: string
  teamName: string
  botToken: string
  channelId: string | null
  channelName: string | null
}

/** Validates and narrows a `notification_channels.config` value. Never throws. */
export function parseSlackConfig(config: unknown): SlackChannelConfig | null {
  if (!config || typeof config !== 'object') return null
  const c = config as Record<string, unknown>

  if (typeof c.team_id !== 'string' || !c.team_id) return null
  if (typeof c.team_name !== 'string' || !c.team_name) return null
  if (typeof c.bot_token !== 'string' || !c.bot_token) return null

  return {
    teamId: c.team_id,
    teamName: c.team_name,
    botToken: c.bot_token,
    channelId: typeof c.channel_id === 'string' && c.channel_id ? c.channel_id : null,
    channelName: typeof c.channel_name === 'string' && c.channel_name ? c.channel_name : null,
  }
}

// ─── Button values ───────────────────────────────────────────────────────────

export type SlackAlertAction = 'acknowledge' | 'snooze' | 'mute'

/**
 * What each action button's `value` encodes. `workspaceId` is included
 * alongside `alertId` so `app/api/slack/interactions/route.ts` can confirm
 * the alert it loads actually belongs to the workspace the button claims —
 * Slack's signature proves the request came from Slack, not that the payload
 * inside it is honest.
 */
export interface SlackButtonPayload {
  workspaceId: string
  alertId: string
  monitoredUrlId: string
  action: SlackAlertAction
}

export function encodeButtonValue(payload: SlackButtonPayload): string {
  return JSON.stringify(payload)
}

/** Decodes a button `value`. Returns null for anything malformed rather than throwing. */
export function decodeButtonValue(raw: unknown): SlackButtonPayload | null {
  if (typeof raw !== 'string' || !raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<SlackButtonPayload>
    if (
      typeof parsed.workspaceId === 'string' &&
      typeof parsed.alertId === 'string' &&
      typeof parsed.monitoredUrlId === 'string' &&
      (parsed.action === 'acknowledge' || parsed.action === 'snooze' || parsed.action === 'mute')
    ) {
      return {
        workspaceId: parsed.workspaceId,
        alertId: parsed.alertId,
        monitoredUrlId: parsed.monitoredUrlId,
        action: parsed.action,
      }
    }
    return null
  } catch {
    return null
  }
}

// ─── Block Kit ────────────────────────────────────────────────────────────────

/** Slack Block Kit types are not worth vendoring for this — every builder here returns plain objects matching Slack's documented shapes. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SlackBlock = Record<string, any>

/** Everything `buildAlertBlocks`/`buildResolvedBlocks` need, independent of the DB row shape. */
export interface SlackAlertInput {
  id: string
  workspace_id: string
  monitored_url_id: string
  title: string
  summary: string
  ai_summary: string | null
  severity: AlertSeverity
  diff_pct: number | null
  monitor_name: string
  monitor_url: string
  /** A signed, time-limited URL to the diff or current screenshot. Omit when none is available. */
  image_url?: string | null
}

const SEVERITY_EMOJI: Record<AlertSeverity, string> = {
  critical: '🔴',
  high: '🟡',
  medium: '🔵',
  low: '⚪',
}

/**
 * The plain-English headline. `ai_summary` first — that is Claude's actual
 * change description and what design-system §7 means by "what changed" — and
 * `summary` as the fallback for the alerts a workspace on a plan without AI
 * summaries can still receive. Never the raw diff percentage.
 */
function headline(alert: SlackAlertInput): string {
  const aiSummary = alert.ai_summary?.trim()
  if (aiSummary) return aiSummary
  const summary = alert.summary?.trim()
  if (summary) return summary
  return alert.title
}

function commonBlocks(alert: SlackAlertInput, appUrl: string): SlackBlock[] {
  const monitorLink = `${appUrl.replace(/\/$/, '')}/dashboard/urls/${alert.monitored_url_id}`

  const blocks: SlackBlock[] = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${SEVERITY_EMOJI[alert.severity]} *<${monitorLink}|${escapeSlackText(alert.monitor_name)}>*\n${escapeSlackText(
          headline(alert)
        )}`,
      },
    },
  ]

  // The percentage is secondary metadata (design system §7) — it rides in the
  // context line under the headline, never as the headline itself.
  const contextElements: SlackBlock[] = [
    { type: 'mrkdwn', text: `*Severity:* ${severityLabel(alert.severity)}` },
  ]
  if (alert.diff_pct !== null && alert.diff_pct !== undefined) {
    contextElements.push({ type: 'mrkdwn', text: `${Number(alert.diff_pct).toFixed(1)}% of the page changed` })
  }
  blocks.push({ type: 'context', elements: contextElements })

  if (alert.image_url) {
    blocks.push({
      type: 'image',
      image_url: alert.image_url,
      alt_text: `What changed on ${alert.monitor_name}`,
    })
  }

  return blocks
}

/** Fallback `text` for notifications and clients that don't render blocks. */
function fallbackText(alert: SlackAlertInput): string {
  return `${headline(alert)} — ${alert.monitor_name}`
}

/** The message posted for a new high/critical alert: headline, severity, image, action buttons. */
export function buildAlertBlocks(alert: SlackAlertInput, appUrl: string): { blocks: SlackBlock[]; text: string } {
  const blocks: SlackBlock[] = [
    ...commonBlocks(alert, appUrl),
    {
      type: 'actions',
      block_id: 'alert_actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Acknowledge', emoji: true },
          style: 'primary',
          action_id: 'alert_acknowledge',
          value: encodeButtonValue({
            workspaceId: alert.workspace_id,
            alertId: alert.id,
            monitoredUrlId: alert.monitored_url_id,
            action: 'acknowledge',
          }),
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Snooze 24h', emoji: true },
          action_id: 'alert_snooze',
          value: encodeButtonValue({
            workspaceId: alert.workspace_id,
            alertId: alert.id,
            monitoredUrlId: alert.monitored_url_id,
            action: 'snooze',
          }),
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Mute this monitor', emoji: true },
          style: 'danger',
          action_id: 'alert_mute',
          value: encodeButtonValue({
            workspaceId: alert.workspace_id,
            alertId: alert.id,
            monitoredUrlId: alert.monitored_url_id,
            action: 'mute',
          }),
        },
      ],
    },
  ]

  return { blocks, text: fallbackText(alert) }
}

/**
 * The same message with its action buttons replaced by a plain-text line
 * saying what happened — used to update the original message in place after
 * a button is pressed, so a click changes what the message *shows*, not just
 * what it *does*.
 */
export function buildResolvedBlocks(
  alert: SlackAlertInput,
  appUrl: string,
  resolutionText: string
): { blocks: SlackBlock[]; text: string } {
  const blocks: SlackBlock[] = [
    ...commonBlocks(alert, appUrl),
    { type: 'context', elements: [{ type: 'mrkdwn', text: resolutionText }] },
  ]

  return { blocks, text: fallbackText(alert) }
}

function escapeSlackText(input: string): string {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
