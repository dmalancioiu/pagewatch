import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  verifySlackSignature,
  signState,
  verifyState,
  buildAlertBlocks,
  buildResolvedBlocks,
  encodeButtonValue,
  decodeButtonValue,
  parseSlackConfig,
  type SlackAlertInput,
} from './slack'
import { createHmac } from 'node:crypto'

const SIGNING_SECRET = 'test-signing-secret'
const NOW = new Date('2026-09-10T12:00:00.000Z')

function sign(secret: string, timestamp: string, body: string): string {
  return `v0=${createHmac('sha256', secret).update(`v0:${timestamp}:${body}`).digest('hex')}`
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

// ─── verifySlackSignature ────────────────────────────────────────────────────

describe('verifySlackSignature', () => {
  const rawBody = 'payload=%7B%22type%22%3A%22block_actions%22%7D'

  it('accepts a correctly signed, fresh request', () => {
    const timestamp = String(Math.floor(NOW.getTime() / 1000))
    const signature = sign(SIGNING_SECRET, timestamp, rawBody)

    expect(
      verifySlackSignature({ signingSecret: SIGNING_SECRET, signature, timestamp, rawBody })
    ).toBe(true)
  })

  it('rejects a tampered body', () => {
    const timestamp = String(Math.floor(NOW.getTime() / 1000))
    const signature = sign(SIGNING_SECRET, timestamp, rawBody)

    expect(
      verifySlackSignature({
        signingSecret: SIGNING_SECRET,
        signature,
        timestamp,
        rawBody: rawBody + 'extra',
      })
    ).toBe(false)
  })

  it('rejects a stale timestamp (older than 5 minutes)', () => {
    const staleTimestamp = String(Math.floor(NOW.getTime() / 1000) - 6 * 60)
    const signature = sign(SIGNING_SECRET, staleTimestamp, rawBody)

    expect(
      verifySlackSignature({ signingSecret: SIGNING_SECRET, signature, timestamp: staleTimestamp, rawBody })
    ).toBe(false)
  })

  it('rejects a timestamp too far in the future', () => {
    const futureTimestamp = String(Math.floor(NOW.getTime() / 1000) + 6 * 60)
    const signature = sign(SIGNING_SECRET, futureTimestamp, rawBody)

    expect(
      verifySlackSignature({ signingSecret: SIGNING_SECRET, signature, timestamp: futureTimestamp, rawBody })
    ).toBe(false)
  })

  it('rejects a missing signature header', () => {
    const timestamp = String(Math.floor(NOW.getTime() / 1000))
    expect(
      verifySlackSignature({ signingSecret: SIGNING_SECRET, signature: null, timestamp, rawBody })
    ).toBe(false)
  })

  it('rejects a missing timestamp header', () => {
    const signature = sign(SIGNING_SECRET, '1234', rawBody)
    expect(
      verifySlackSignature({ signingSecret: SIGNING_SECRET, signature, timestamp: null, rawBody })
    ).toBe(false)
  })

  it('rejects a missing signing secret', () => {
    const timestamp = String(Math.floor(NOW.getTime() / 1000))
    const signature = sign(SIGNING_SECRET, timestamp, rawBody)
    expect(
      verifySlackSignature({ signingSecret: undefined, signature, timestamp, rawBody })
    ).toBe(false)
  })

  it('rejects a non-numeric timestamp', () => {
    const signature = sign(SIGNING_SECRET, 'not-a-number', rawBody)
    expect(
      verifySlackSignature({
        signingSecret: SIGNING_SECRET,
        signature,
        timestamp: 'not-a-number',
        rawBody,
      })
    ).toBe(false)
  })

  it('rejects a signature computed with the wrong secret', () => {
    const timestamp = String(Math.floor(NOW.getTime() / 1000))
    const signature = sign('a-different-secret', timestamp, rawBody)
    expect(
      verifySlackSignature({ signingSecret: SIGNING_SECRET, signature, timestamp, rawBody })
    ).toBe(false)
  })
})

// ─── OAuth state ──────────────────────────────────────────────────────────────

describe('signState / verifyState', () => {
  const SECRET = 'oauth-secret'

  it('round-trips a freshly signed state', () => {
    const state = signState({ workspaceId: 'ws_123' }, SECRET)
    const verified = verifyState(state, SECRET)
    expect(verified).toEqual({ workspaceId: 'ws_123', issuedAt: NOW.getTime() })
  })

  it('rejects a tampered payload', () => {
    const state = signState({ workspaceId: 'ws_123' }, SECRET)
    const [, signature] = state.split('.')
    const forgedBody = Buffer.from(JSON.stringify({ workspaceId: 'ws_attacker', issuedAt: NOW.getTime() }), 'utf8').toString(
      'base64url'
    )
    expect(verifyState(`${forgedBody}.${signature}`, SECRET)).toBeNull()
  })

  it('rejects a state signed with the wrong secret', () => {
    const state = signState({ workspaceId: 'ws_123' }, 'other-secret')
    expect(verifyState(state, SECRET)).toBeNull()
  })

  it('rejects an expired state', () => {
    const state = signState({ workspaceId: 'ws_123' }, SECRET, NOW.getTime() - 11 * 60 * 1000)
    expect(verifyState(state, SECRET)).toBeNull()
  })

  it('rejects a malformed state', () => {
    expect(verifyState('not-a-valid-state', SECRET)).toBeNull()
    expect(verifyState(null, SECRET)).toBeNull()
    expect(verifyState('', SECRET)).toBeNull()
  })
})

// ─── Button values ────────────────────────────────────────────────────────────

describe('encodeButtonValue / decodeButtonValue', () => {
  it('round-trips a valid payload', () => {
    const payload = {
      workspaceId: 'ws_1',
      alertId: 'alert_1',
      monitoredUrlId: 'mon_1',
      action: 'acknowledge' as const,
    }
    expect(decodeButtonValue(encodeButtonValue(payload))).toEqual(payload)
  })

  it('rejects malformed JSON', () => {
    expect(decodeButtonValue('{not json')).toBeNull()
  })

  it('rejects a payload missing required fields', () => {
    expect(decodeButtonValue(JSON.stringify({ alertId: 'alert_1' }))).toBeNull()
  })

  it('rejects an unrecognised action', () => {
    expect(
      decodeButtonValue(
        JSON.stringify({ workspaceId: 'ws_1', alertId: 'a1', monitoredUrlId: 'm1', action: 'delete_everything' })
      )
    ).toBeNull()
  })

  it('rejects a non-string value', () => {
    expect(decodeButtonValue(undefined)).toBeNull()
    expect(decodeButtonValue(null)).toBeNull()
  })
})

// ─── parseSlackConfig ─────────────────────────────────────────────────────────

describe('parseSlackConfig', () => {
  it('accepts a fully connected config', () => {
    expect(
      parseSlackConfig({
        team_id: 'T1',
        team_name: 'Acme',
        bot_token: 'xoxb-secret',
        channel_id: 'C1',
        channel_name: 'alerts',
      })
    ).toEqual({ teamId: 'T1', teamName: 'Acme', botToken: 'xoxb-secret', channelId: 'C1', channelName: 'alerts' })
  })

  it('accepts a connected-but-no-channel config, with null channel fields', () => {
    expect(
      parseSlackConfig({ team_id: 'T1', team_name: 'Acme', bot_token: 'xoxb-secret', channel_id: null, channel_name: null })
    ).toEqual({ teamId: 'T1', teamName: 'Acme', botToken: 'xoxb-secret', channelId: null, channelName: null })
  })

  it('rejects a config missing the bot token', () => {
    expect(parseSlackConfig({ team_id: 'T1', team_name: 'Acme' })).toBeNull()
  })

  it('rejects null, undefined, and non-object config', () => {
    expect(parseSlackConfig(null)).toBeNull()
    expect(parseSlackConfig(undefined)).toBeNull()
    expect(parseSlackConfig('xoxb-secret')).toBeNull()
  })
})

// ─── Block Kit construction ───────────────────────────────────────────────────

function alertFixture(overrides: Partial<SlackAlertInput> = {}): SlackAlertInput {
  return {
    id: 'alert_1',
    workspace_id: 'ws_1',
    monitored_url_id: 'mon_1',
    title: 'Pricing page changed',
    summary: '4.2% of the page changed.',
    ai_summary: 'Pro moved from $29 to $39.',
    severity: 'high',
    diff_pct: 4.2,
    monitor_name: 'Pricing',
    monitor_url: 'https://example.com/pricing',
    image_url: null,
    ...overrides,
  }
}

describe('buildAlertBlocks', () => {
  it('uses ai_summary as the headline, links the monitor, and keeps the percentage secondary', () => {
    const { blocks, text } = buildAlertBlocks(alertFixture(), 'https://app.pagewatch.dev')

    const headlineBlock = blocks[0]
    expect(headlineBlock.type).toBe('section')
    expect(headlineBlock.text.text).toContain('Pro moved from $29 to $39.')
    expect(headlineBlock.text.text).toContain('<https://app.pagewatch.dev/dashboard/urls/mon_1|Pricing>')
    // The headline itself must never be the bare percentage.
    expect(headlineBlock.text.text.split('\n')[0]).not.toMatch(/^\d/)

    const contextBlock = blocks.find((b) => b.type === 'context')!
    expect(contextBlock.elements.some((el: { text: string }) => el.text.includes('4.2%'))).toBe(true)

    expect(text).toContain('Pro moved from $29 to $39.')
  })

  it('falls back to summary when ai_summary is null', () => {
    const { blocks } = buildAlertBlocks(alertFixture({ ai_summary: null }), 'https://app.pagewatch.dev')
    expect(blocks[0].text.text).toContain('4.2% of the page changed.')
    expect(blocks[0].text.text).not.toContain('null')
  })

  it('omits the image block when no image_url is available', () => {
    const { blocks } = buildAlertBlocks(alertFixture({ image_url: null }), 'https://app.pagewatch.dev')
    expect(blocks.some((b) => b.type === 'image')).toBe(false)
  })

  it('includes an image block when image_url is set', () => {
    const { blocks } = buildAlertBlocks(
      alertFixture({ image_url: 'https://signed.example/diff.png' }),
      'https://app.pagewatch.dev'
    )
    const imageBlock = blocks.find((b) => b.type === 'image')
    expect(imageBlock).toBeDefined()
    expect(imageBlock!.image_url).toBe('https://signed.example/diff.png')
  })

  it('includes three action buttons — Acknowledge, Snooze 24h, Mute this monitor', () => {
    const { blocks } = buildAlertBlocks(alertFixture(), 'https://app.pagewatch.dev')
    const actionsBlock = blocks.find((b) => b.type === 'actions')!
    expect(actionsBlock.elements).toHaveLength(3)
    const labels = actionsBlock.elements.map((el: { text: { text: string } }) => el.text.text)
    expect(labels).toEqual(['Acknowledge', 'Snooze 24h', 'Mute this monitor'])

    for (const element of actionsBlock.elements) {
      const decoded = decodeButtonValue(element.value)
      expect(decoded?.alertId).toBe('alert_1')
      expect(decoded?.workspaceId).toBe('ws_1')
      expect(decoded?.monitoredUrlId).toBe('mon_1')
    }
  })

  it('omits diff percentage context when diff_pct is null', () => {
    const { blocks } = buildAlertBlocks(alertFixture({ diff_pct: null }), 'https://app.pagewatch.dev')
    const contextBlock = blocks.find((b) => b.type === 'context')!
    expect(contextBlock.elements.some((el: { text: string }) => el.text.includes('%'))).toBe(false)
  })
})

describe('buildResolvedBlocks', () => {
  it('replaces the action buttons with the resolution text', () => {
    const { blocks } = buildResolvedBlocks(alertFixture(), 'https://app.pagewatch.dev', '✅ Acknowledged via Slack.')
    expect(blocks.some((b) => b.type === 'actions')).toBe(false)
    const lastBlock = blocks[blocks.length - 1]
    expect(lastBlock.type).toBe('context')
    expect(lastBlock.elements[0].text).toBe('✅ Acknowledged via Slack.')
  })

  it('still falls back to summary when ai_summary is null', () => {
    const { blocks } = buildResolvedBlocks(alertFixture({ ai_summary: null }), 'https://app.pagewatch.dev', 'Muted.')
    expect(blocks[0].text.text).toContain('4.2% of the page changed.')
  })
})
