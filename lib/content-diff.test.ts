import { describe, it, expect } from 'vitest'
import { diffExtracts, type PageExtract, type ExtractedPrice, type ExtractedHeading } from './content-diff'

function price(overrides: Partial<ExtractedPrice> = {}): ExtractedPrice {
  return { raw: '$29', amount: 29, currency: 'USD', label: '', ...overrides }
}

function heading(overrides: Partial<ExtractedHeading> = {}): ExtractedHeading {
  return { level: 2, text: 'Heading', ...overrides }
}

function extract(overrides: Partial<PageExtract> = {}): PageExtract {
  return {
    title: 'PageWatch',
    metaDescription: 'Visual monitoring for the web',
    canonical: 'https://example.com/',
    lang: 'en',
    headings: [],
    text: '',
    jsonLd: [],
    prices: [],
    links: [],
    structureHash: 'stable-hash',
    truncated: false,
    extractedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('diffExtracts', () => {
  it('matches a price change by label', () => {
    const before = extract({ prices: [price({ raw: '$29', amount: 29, label: 'Pro' })] })
    const after = extract({ prices: [price({ raw: '$39', amount: 39, label: 'Pro' })] })

    const result = diffExtracts(before, after)

    expect(result.changes).toEqual([{ kind: 'price', label: 'Pro', from: '$29', to: '$39' }])
    expect(result.summary.priceChanges).toBe(1)
    expect(result.isEmpty).toBe(false)
  })

  it('still matches by label when the price also moved position', () => {
    const before = extract({
      prices: [price({ raw: '$14', amount: 14, label: 'Starter' }), price({ raw: '$29', amount: 29, label: 'Pro' })],
    })
    // Order reversed - Pro is now first. A positional-only match would wrongly
    // pair Starter($14) with Pro($29's new slot); label matching must not.
    const after = extract({
      prices: [price({ raw: '$39', amount: 39, label: 'Pro' }), price({ raw: '$14', amount: 14, label: 'Starter' })],
    })

    const result = diffExtracts(before, after)

    expect(result.changes).toEqual([{ kind: 'price', label: 'Pro', from: '$29', to: '$39' }])
  })

  it('reports a brand-new tier as price_added, not a false price match', () => {
    const before = extract({ prices: [price({ raw: '$29', amount: 29, label: 'Pro' })] })
    const after = extract({
      prices: [
        price({ raw: '$29', amount: 29, label: 'Pro' }),
        price({ raw: '$99', amount: 99, currency: 'USD', label: 'Enterprise' }),
      ],
    })

    const result = diffExtracts(before, after)

    expect(result.changes).toEqual([{ kind: 'price_added', label: 'Enterprise', value: '$99' }])
    expect(result.summary.priceChanges).toBe(1)
  })

  it('reports a removed trial line as a text_removed change', () => {
    const before = extract({ text: 'Start your 14-day free trial today. Cancel anytime.' })
    const after = extract({ text: 'Cancel anytime.' })

    const result = diffExtracts(before, after)

    expect(result.changes).toContainEqual({ kind: 'text_removed', text: 'Start your 14-day free trial today.' })
    expect(result.summary.textChanges).toBe(1)
  })

  it('reports a heading rename as heading_changed', () => {
    const before = extract({ headings: [heading({ level: 2, text: 'Enterprise Plan' })] })
    const after = extract({ headings: [heading({ level: 2, text: 'Enterprise Tier' })] })

    const result = diffExtracts(before, after)

    expect(result.changes).toEqual([{ kind: 'heading_changed', from: 'Enterprise Plan', to: 'Enterprise Tier' }])
    expect(result.summary.headingChanges).toBe(1)
  })

  it('produces no changes when only a relative timestamp differs', () => {
    const before = extract({ text: 'Updated 3 minutes ago. Welcome to our site.' })
    const after = extract({ text: 'Updated 10 minutes ago. Welcome to our site.' })

    const result = diffExtracts(before, after)

    expect(result.changes).toEqual([])
    expect(result.isEmpty).toBe(true)
  })

  it('produces no changes when only whitespace differs', () => {
    const before = extract({
      title: 'PageWatch',
      text: 'Hello   world.\n\nSecond   line.',
    })
    const after = extract({
      title: 'PageWatch ',
      text: 'Hello world.\nSecond line.',
    })

    const result = diffExtracts(before, after)

    expect(result.changes).toEqual([])
    expect(result.isEmpty).toBe(true)
  })

  it('treats a trailing-punctuation-only difference as unchanged', () => {
    const before = extract({ text: 'Contact us now' })
    const after = extract({ text: 'Contact us now!' })

    const result = diffExtracts(before, after)

    expect(result.changes).toEqual([])
  })

  it('caps reported text changes and flags the overflow', () => {
    const beforeSentences = Array.from({ length: 25 }, (_, i) => `Old line number ${i}.`).join(' ')
    const afterSentences = Array.from({ length: 25 }, (_, i) => `New line number ${i}.`).join(' ')

    const before = extract({ text: beforeSentences })
    const after = extract({ text: afterSentences })

    const result = diffExtracts(before, after)

    expect(result.changes.length).toBeLessThanOrEqual(20)
    expect(result.summary.textChangesTruncated).toBe(true)
  })

  it('detects a structure-only change independently of text/prices', () => {
    const before = extract({ structureHash: 'hash-a', text: 'Same copy.' })
    const after = extract({ structureHash: 'hash-b', text: 'Same copy.' })

    const result = diffExtracts(before, after)

    expect(result.changes).toEqual([{ kind: 'structure_changed' }])
    expect(result.summary.structureChanged).toBe(true)
  })

  it('degrades to empty when the previous extract is null (first-ever capture)', () => {
    const after = extract({ text: 'Anything at all.' })

    const result = diffExtracts(null, after)

    expect(result.changes).toEqual([])
    expect(result.isEmpty).toBe(true)
  })

  it('degrades to empty when the current extract is null (extraction failed)', () => {
    const before = extract({ text: 'Anything at all.' })

    const result = diffExtracts(before, null)

    expect(result.changes).toEqual([])
    expect(result.isEmpty).toBe(true)
  })

  it('degrades to empty when both extracts are null', () => {
    const result = diffExtracts(null, null)

    expect(result.changes).toEqual([])
    expect(result.isEmpty).toBe(true)
  })
})
