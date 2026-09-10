import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

/**
 * Outbound webhook signing — generation, signing and verification.
 *
 * Pure — no Supabase, no Next imports, no `fetch` — mirroring how
 * `lib/slack.ts` keeps its own signature scheme testable without a network.
 * `trigger/lib/webhook-delivery.ts` is the only caller that actually sends a
 * request; this module just proves a payload came from us (signing) and lets
 * a customer prove a payload came from us too (verification), using the same
 * scheme both directions.
 *
 * ## Scheme
 *
 * Same shape as Stripe's webhook signatures, and the same one
 * `app/api/slack/interactions/route.ts` already verifies inbound: HMAC-SHA256
 * over `${timestamp}.${rawBody}`, hex-encoded, sent in a `PageWatch-Signature`
 * header alongside a `PageWatch-Timestamp` header carrying the Unix seconds
 * the signature was computed at. The timestamp is folded into the signed
 * material (not just alongside it) so a captured request cannot be replayed
 * with a forged fresh timestamp — changing the timestamp invalidates the
 * signature.
 */

export const WEBHOOK_SIGNATURE_HEADER = 'PageWatch-Signature'
export const WEBHOOK_TIMESTAMP_HEADER = 'PageWatch-Timestamp'

/** How long a signature stays acceptable to `verifyWebhookSignature`, matching Slack's own inbound tolerance in `lib/slack.ts`. */
export const DEFAULT_TOLERANCE_SECONDS = 5 * 60

// ─── Secret generation ───────────────────────────────────────────────────────

/**
 * Mints a new signing secret for a webhook endpoint.
 *
 * Unlike an API key, this is stored in the clear (`webhook_endpoints.secret`
 * — see `supabase/migrations/011_api_keys_webhooks.sql`): the worker must be
 * able to read it back on every delivery to sign the request, and the
 * customer must be able to read it back from the dashboard to configure
 * their receiver. It is still random, still never logged, and the settings
 * UI still gates it behind a deliberate "reveal" action rather than showing
 * it inline.
 */
export function generateWebhookSecret(): string {
  return `whsec_${randomBytes(32).toString('base64url')}`
}

// ─── Signing ─────────────────────────────────────────────────────────────────

export interface SignWebhookInput {
  secret: string
  /** Unix seconds. */
  timestamp: number
  /** The exact request body bytes that will be sent, as a string. */
  body: string
}

/** Returns the hex-encoded HMAC-SHA256 signature for one delivery attempt. */
export function signWebhookPayload({ secret, timestamp, body }: SignWebhookInput): string {
  return createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')
}

/** Builds the two headers a delivery attempt sends alongside the signed body. */
export function buildWebhookHeaders(input: SignWebhookInput): Record<string, string> {
  return {
    [WEBHOOK_SIGNATURE_HEADER]: signWebhookPayload(input),
    [WEBHOOK_TIMESTAMP_HEADER]: String(input.timestamp),
  }
}

// ─── Verification ────────────────────────────────────────────────────────────

export interface VerifyWebhookInput {
  secret: string
  /** The raw `PageWatch-Signature` header value, unmodified. */
  signatureHeader: string | null | undefined
  /** The raw `PageWatch-Timestamp` header value, unmodified. */
  timestampHeader: string | null | undefined
  /** The exact bytes received, as text — must not be re-serialized JSON. */
  rawBody: string
  toleranceSeconds?: number
  /** Unix seconds "now". Defaults to the real clock; overridable for tests. */
  now?: number
}

/**
 * Verifies a delivery's signature and freshness. Returns `false` for every
 * failure mode uniformly (missing headers, bad signature, stale timestamp,
 * malformed timestamp) — a caller should treat them all as "reject", not
 * branch on which check failed.
 */
export function verifyWebhookSignature(input: VerifyWebhookInput): boolean {
  const { secret, signatureHeader, timestampHeader, rawBody } = input
  const tolerance = input.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS
  const now = input.now ?? Math.floor(Date.now() / 1000)

  if (!secret || !signatureHeader || !timestampHeader) return false

  const timestamp = Number(timestampHeader)
  if (!Number.isFinite(timestamp) || !Number.isInteger(timestamp)) return false
  if (Math.abs(now - timestamp) > tolerance) return false

  const expected = signWebhookPayload({ secret, timestamp, body: rawBody })
  return timingSafeEqualHexStrings(signatureHeader, expected)
}

function timingSafeEqualHexStrings(a: string, b: string): boolean {
  // A malformed (non-hex, wrong-length) header must fail closed rather than
  // throw out of Buffer.from — `hex` decoding silently drops trailing
  // invalid characters instead of throwing, so the length check below is
  // what actually catches most of that, not a try/catch.
  const bufA = Buffer.from(a, 'hex')
  const bufB = Buffer.from(b, 'hex')
  if (bufA.length === 0 || bufB.length === 0) return false
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

// ─── Event payload ───────────────────────────────────────────────────────────

/** Every event type a webhook endpoint can currently receive. Flat union so a new event type is a one-line addition. */
export type WebhookEventType = 'alert.created' | 'alert.acknowledged' | 'alert.dismissed'

export interface WebhookAlertEventData {
  alert: {
    id: string
    severity: string
    status: string
    title: string
    summary: string
    ai_summary: string | null
    diff_pct: number | null
    triggered_at: string
  }
  monitor: {
    id: string
    url: string
    name: string
  }
}

export interface WebhookEventPayload {
  id: string
  type: WebhookEventType
  created_at: string
  data: WebhookAlertEventData
}

/** Builds the JSON body sent to a customer's endpoint for one alert event. Pure — no I/O — so the exact bytes signed are the exact bytes serialized once, by the caller, and reused for both. */
export function buildAlertWebhookEvent(
  eventId: string,
  type: WebhookEventType,
  alert: WebhookAlertEventData['alert'],
  monitor: WebhookAlertEventData['monitor'],
  createdAt: string = new Date().toISOString()
): WebhookEventPayload {
  return {
    id: eventId,
    type,
    created_at: createdAt,
    data: { alert, monitor },
  }
}
