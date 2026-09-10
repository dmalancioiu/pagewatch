import { describe, it, expect } from 'vitest'
import {
  API_KEY_PREFIX,
  generateApiKey,
  hashApiKey,
  looksLikeApiKey,
  timingSafeEqualHex,
  verifyApiKey,
  isApiKeyScope,
  scopeAllowsWrite,
} from './api-keys'
import {
  buildAlertWebhookEvent,
  buildWebhookHeaders,
  generateWebhookSecret,
  signWebhookPayload,
  verifyWebhookSignature,
  WEBHOOK_SIGNATURE_HEADER,
  WEBHOOK_TIMESTAMP_HEADER,
} from './webhooks'

// ─── generateApiKey ─────────────────────────────────────────────────────────

describe('generateApiKey', () => {
  it('produces a key in the pw_live_ format with real entropy', () => {
    const key = generateApiKey()

    expect(key.plaintext.startsWith(API_KEY_PREFIX)).toBe(true)
    // prefix + 32 bytes base64url (43 chars, no padding)
    expect(key.plaintext.length).toBe(API_KEY_PREFIX.length + 43)
    expect(key.plaintext).toMatch(/^pw_live_[A-Za-z0-9_-]+$/)
  })

  it('never generates the same key twice', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 500; i++) {
      const { plaintext } = generateApiKey()
      expect(seen.has(plaintext)).toBe(false)
      seen.add(plaintext)
    }
  })

  it('returns a stable SHA-256 hash of the plaintext', () => {
    const key = generateApiKey()
    expect(key.hash).toBe(hashApiKey(key.plaintext))
    expect(key.hash).toMatch(/^[0-9a-f]{64}$/)
  })

  it('the plaintext is not recoverable from what would be stored', () => {
    const key = generateApiKey()
    // Everything a row would persist (hash + displayPrefix) is a one-way or
    // truncated function of the plaintext. Neither round-trips back to it.
    expect(key.hash).not.toContain(key.plaintext)
    expect(key.displayPrefix.length).toBeLessThan(key.plaintext.length)
    expect(key.plaintext.startsWith(key.displayPrefix)).toBe(true)
    // The stored hash reveals nothing usable: hashing the prefix alone must
    // not match the stored hash of the full key.
    expect(hashApiKey(key.displayPrefix)).not.toBe(key.hash)
  })

  it('displayPrefix is a short, recognizable, non-secret slice', () => {
    const key = generateApiKey()
    expect(key.displayPrefix).toBe(key.plaintext.slice(0, key.displayPrefix.length))
    expect(key.displayPrefix.length).toBe(API_KEY_PREFIX.length + 8)
  })
})

// ─── looksLikeApiKey ────────────────────────────────────────────────────────

describe('looksLikeApiKey', () => {
  it('accepts a well-formed key', () => {
    expect(looksLikeApiKey(generateApiKey().plaintext)).toBe(true)
  })

  it('rejects things that are not our keys', () => {
    // A foreign vendor's key shape, assembled rather than written out. Secret
    // scanners match on these patterns, and a test fixture that trips the
    // scanner teaches people to bypass it — which is worse than the fixture
    // is useful.
    const foreignVendorKey = ['sk', 'live', 'abcdefghijklmnopqrstuvwxyz'].join('_')

    expect(looksLikeApiKey('')).toBe(false)
    expect(looksLikeApiKey(foreignVendorKey)).toBe(false)
    expect(looksLikeApiKey('pw_live_')).toBe(false)
    expect(looksLikeApiKey('pw_live_tooshort')).toBe(false)
  })
})

// ─── verify / timing-safe compare ──────────────────────────────────────────

describe('verifyApiKey / timingSafeEqualHex', () => {
  it('accepts the right key against its own hash', () => {
    const key = generateApiKey()
    expect(verifyApiKey(key.plaintext, key.hash)).toBe(true)
  })

  it('rejects a wrong key of equal length', () => {
    const key = generateApiKey()
    const other = generateApiKey()
    expect(other.plaintext.length).toBe(key.plaintext.length)
    expect(verifyApiKey(other.plaintext, key.hash)).toBe(false)
  })

  it('rejects a single-character tamper', () => {
    const key = generateApiKey()
    const tampered = key.plaintext.slice(0, -1) + (key.plaintext.endsWith('a') ? 'b' : 'a')
    expect(verifyApiKey(tampered, key.hash)).toBe(false)
  })

  it('rejects a plainly malformed candidate without hashing it', () => {
    expect(verifyApiKey('not-a-key', hashApiKey('irrelevant'))).toBe(false)
  })

  it('timingSafeEqualHex accepts identical digests and rejects any difference', () => {
    const a = hashApiKey('one')
    const b = hashApiKey('one')
    const c = hashApiKey('two')
    expect(timingSafeEqualHex(a, b)).toBe(true)
    expect(timingSafeEqualHex(a, c)).toBe(false)
  })

  it('timingSafeEqualHex rejects mismatched lengths and empty input rather than throwing', () => {
    expect(timingSafeEqualHex('ab', 'abcd')).toBe(false)
    expect(timingSafeEqualHex('', '')).toBe(false)
  })
})

// ─── scopes ──────────────────────────────────────────────────────────────────

describe('scopes', () => {
  it('recognizes valid scope strings', () => {
    expect(isApiKeyScope('read')).toBe(true)
    expect(isApiKeyScope('read_write')).toBe(true)
    expect(isApiKeyScope('admin')).toBe(false)
    expect(isApiKeyScope(undefined)).toBe(false)
  })

  it('only read_write may perform a mutation', () => {
    expect(scopeAllowsWrite('read_write')).toBe(true)
    expect(scopeAllowsWrite('read')).toBe(false)
  })
})

// ─── Webhook signing ─────────────────────────────────────────────────────────

describe('signWebhookPayload / verifyWebhookSignature', () => {
  const secret = generateWebhookSecret()
  const body = JSON.stringify({ id: 'evt_1', type: 'alert.created' })
  const now = 1_757_500_000

  it('generateWebhookSecret produces a unique whsec_-prefixed secret', () => {
    expect(secret.startsWith('whsec_')).toBe(true)
    expect(generateWebhookSecret()).not.toBe(secret)
  })

  it('a freshly signed payload verifies', () => {
    const signature = signWebhookPayload({ secret, timestamp: now, body })
    expect(
      verifyWebhookSignature({
        secret,
        signatureHeader: signature,
        timestampHeader: String(now),
        rawBody: body,
        now,
      })
    ).toBe(true)
  })

  it('buildWebhookHeaders produces headers verifyWebhookSignature accepts', () => {
    const headers = buildWebhookHeaders({ secret, timestamp: now, body })
    expect(Object.keys(headers)).toEqual(
      expect.arrayContaining([WEBHOOK_SIGNATURE_HEADER, WEBHOOK_TIMESTAMP_HEADER])
    )
    expect(
      verifyWebhookSignature({
        secret,
        signatureHeader: headers[WEBHOOK_SIGNATURE_HEADER],
        timestampHeader: headers[WEBHOOK_TIMESTAMP_HEADER],
        rawBody: body,
        now,
      })
    ).toBe(true)
  })

  it('rejects a tampered body', () => {
    const signature = signWebhookPayload({ secret, timestamp: now, body })
    expect(
      verifyWebhookSignature({
        secret,
        signatureHeader: signature,
        timestampHeader: String(now),
        rawBody: body + '{"extra":true}',
        now,
      })
    ).toBe(false)
  })

  it('rejects a signature produced with the wrong secret', () => {
    const signature = signWebhookPayload({ secret: generateWebhookSecret(), timestamp: now, body })
    expect(
      verifyWebhookSignature({
        secret,
        signatureHeader: signature,
        timestampHeader: String(now),
        rawBody: body,
        now,
      })
    ).toBe(false)
  })

  it('rejects a stale timestamp outside the tolerance window', () => {
    const staleTimestamp = now - 6 * 60 // 6 minutes old; default tolerance is 5
    const signature = signWebhookPayload({ secret, timestamp: staleTimestamp, body })
    expect(
      verifyWebhookSignature({
        secret,
        signatureHeader: signature,
        timestampHeader: String(staleTimestamp),
        rawBody: body,
        now,
      })
    ).toBe(false)
  })

  it('accepts a timestamp right at the edge of the tolerance window', () => {
    const edgeTimestamp = now - 5 * 60
    const signature = signWebhookPayload({ secret, timestamp: edgeTimestamp, body })
    expect(
      verifyWebhookSignature({
        secret,
        signatureHeader: signature,
        timestampHeader: String(edgeTimestamp),
        rawBody: body,
        now,
      })
    ).toBe(true)
  })

  it('rejects missing headers and malformed timestamps rather than throwing', () => {
    expect(
      verifyWebhookSignature({ secret, signatureHeader: null, timestampHeader: String(now), rawBody: body, now })
    ).toBe(false)
    expect(
      verifyWebhookSignature({ secret, signatureHeader: 'abcd', timestampHeader: undefined, rawBody: body, now })
    ).toBe(false)
    expect(
      verifyWebhookSignature({
        secret,
        signatureHeader: 'abcd',
        timestampHeader: 'not-a-number',
        rawBody: body,
        now,
      })
    ).toBe(false)
  })

  it('buildAlertWebhookEvent is pure and deterministic given the same inputs', () => {
    const alert = {
      id: 'alert_1',
      severity: 'high',
      status: 'open',
      title: 'Pricing page changed',
      summary: 'The hero price changed from $39 to $49.',
      ai_summary: null,
      diff_pct: 12.4,
      triggered_at: '2026-09-10T12:00:00.000Z',
    }
    const monitor = { id: 'mon_1', url: 'https://example.com/pricing', name: 'Pricing' }

    const a = buildAlertWebhookEvent('evt_1', 'alert.created', alert, monitor, '2026-09-10T12:00:01.000Z')
    const b = buildAlertWebhookEvent('evt_1', 'alert.created', alert, monitor, '2026-09-10T12:00:01.000Z')

    expect(a).toEqual(b)
    expect(a.type).toBe('alert.created')
    expect(a.data.alert.id).toBe('alert_1')
    expect(a.data.monitor.url).toBe('https://example.com/pricing')
  })
})
