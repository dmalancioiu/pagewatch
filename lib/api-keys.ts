import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

/**
 * API key generation, hashing and verification.
 *
 * Pure — no Supabase, no Next imports — so it can be unit-tested without a
 * database and reused identically by `lib/api-auth.ts` (verifying inbound
 * requests) and `lib/actions/api-keys.ts` (minting new keys from the
 * dashboard).
 *
 * ## Why the plaintext key is unrecoverable
 *
 * `generateApiKey()` returns the plaintext exactly once, at the call site
 * that creates the row. Nothing downstream of that call ever sees it again:
 * `lib/actions/api-keys.ts` stores only `hash` and `displayPrefix` in the
 * `api_keys` table (see `supabase/migrations/011_api_keys_webhooks.sql`) —
 * the full plaintext is never written anywhere, not to a column, not to a
 * log line, not to `notification_events`. SHA-256 is a one-way function, so
 * even a full database compromise recovers only hashes, not usable keys.
 * There is deliberately no "reveal" endpoint or column to reveal from — the
 * plaintext simply does not exist anywhere after the response that created
 * it is sent.
 */

// ─── Shape ───────────────────────────────────────────────────────────────────

export type ApiKeyScope = 'read' | 'read_write'

export const API_KEY_SCOPES: readonly ApiKeyScope[] = ['read', 'read_write']

/** Prefix every live key starts with — also what a bearer token is matched against before doing any database work. */
export const API_KEY_PREFIX = 'pw_live_'

/** Bytes of randomness in the secret portion. 32 bytes = 256 bits, base64url-encoded. */
const SECRET_BYTES = 32

/** Characters of the plaintext (prefix included) kept for display, e.g. `pw_live_a1b2c3d4`. Long enough to tell keys apart, short enough that it carries none of the entropy. */
const DISPLAY_PREFIX_LENGTH = API_KEY_PREFIX.length + 8

export interface GeneratedApiKey {
  /** The full secret key. Hand this to the caller once; never store it. */
  plaintext: string
  /** SHA-256 hex digest of `plaintext`. The only form persisted. */
  hash: string
  /** Short, non-secret prefix safe to display forever in the dashboard. */
  displayPrefix: string
}

// ─── Generation ──────────────────────────────────────────────────────────────

/** Mints a new key. Call exactly once per key; the plaintext is not derivable from anything stored afterward. */
export function generateApiKey(): GeneratedApiKey {
  const secret = randomBytes(SECRET_BYTES).toString('base64url')
  const plaintext = `${API_KEY_PREFIX}${secret}`
  return {
    plaintext,
    hash: hashApiKey(plaintext),
    displayPrefix: plaintext.slice(0, DISPLAY_PREFIX_LENGTH),
  }
}

// ─── Hashing & verification ──────────────────────────────────────────────────

export function hashApiKey(plaintext: string): string {
  return createHash('sha256').update(plaintext, 'utf8').digest('hex')
}

/** Cheap shape check before touching the database — rejects tokens that plainly aren't ours. */
export function looksLikeApiKey(value: string): boolean {
  return (
    typeof value === 'string' &&
    value.startsWith(API_KEY_PREFIX) &&
    value.length >= API_KEY_PREFIX.length + 20
  )
}

/**
 * Constant-time equality of two hex-encoded SHA-256 digests.
 *
 * A plain `===` short-circuits on the first differing byte, which leaks
 * timing information about how many leading bytes matched — a real oracle
 * against a secret compared directly. Hashing first already destroys that
 * signal for the underlying key (SHA-256 is not length- or
 * prefix-continuous), but this still compares the digests themselves in
 * constant time so no comparison of secret-derived material in this module
 * ever branches on a mismatch position.
 */
export function timingSafeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'hex')
  const bufB = Buffer.from(b, 'hex')
  if (bufA.length === 0 || bufB.length === 0) return false
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

/** Hashes `plaintext` and compares it to `storedHash` in constant time. */
export function verifyApiKey(plaintext: string, storedHash: string): boolean {
  if (!looksLikeApiKey(plaintext)) return false
  return timingSafeEqualHex(hashApiKey(plaintext), storedHash)
}

// ─── Scopes ──────────────────────────────────────────────────────────────────

export function isApiKeyScope(value: unknown): value is ApiKeyScope {
  return typeof value === 'string' && (API_KEY_SCOPES as readonly string[]).includes(value)
}

/** True when `scope` may perform a mutating request (POST/PATCH/DELETE). */
export function scopeAllowsWrite(scope: ApiKeyScope): boolean {
  return scope === 'read_write'
}
