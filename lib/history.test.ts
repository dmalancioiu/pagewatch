import { describe, it, expect } from 'vitest'
import { buildPriceSeries, type HistoryAlert, type HistorySnapshot } from './history'
import type { ExtractedPrice, PageExtract } from './content-diff'

function price(overrides: Partial<ExtractedPrice> = {}): ExtractedPrice {
  return { raw: '$29', amount: 29, currency: 'USD', label: '', ...overrides }
}

function extract(prices: ExtractedPrice[]): PageExtract {
  return {
    title: '',
    metaDescription: '',
    canonical: '',
    lang: 'en',
    headings: [],
    text: '',
    jsonLd: [],
    prices,
    links: [],
    structureHash: '',
    truncated: false,
    extractedAt: '',
  }
}

function snap(id: string, takenAt: string, prices: ExtractedPrice[] | null): HistorySnapshot {
  return { id, taken_at: takenAt, extract: prices ? extract(prices) : null }
}

describe('buildPriceSeries', () => {
  it('returns no series for a monitor with no price history', () => {
    const snapshots = [snap('1', '2026-01-01T00:00:00Z', null), snap('2', '2026-01-02T00:00:00Z', null)]
    expect(buildPriceSeries(snapshots, {})).toEqual([])
  })

  it('drops a series with fewer than 2 real points', () => {
    const snapshots = [
      snap('1', '2026-01-01T00:00:00Z', [price({ label: 'Pro', amount: 29 })]),
      snap('2', '2026-01-02T00:00:00Z', []),
    ]
    expect(buildPriceSeries(snapshots, {})).toEqual([])
  })

  it('builds one series per label and sorts chronologically regardless of input order', () => {
    const snapshots = [
      snap('2', '2026-01-02T00:00:00Z', [price({ label: 'Pro', raw: '$39', amount: 39 })]),
      snap('1', '2026-01-01T00:00:00Z', [price({ label: 'Pro', raw: '$29', amount: 29 })]),
    ]
    const series = buildPriceSeries(snapshots, {})

    expect(series).toHaveLength(1)
    expect(series[0].label).toBe('Pro')
    expect(series[0].points.map((p) => p.amount)).toEqual([29, 39])
    expect(series[0].points.map((p) => p.snapshotId)).toEqual(['1', '2'])
  })

  it('separates multiple labeled prices into distinct series', () => {
    const snapshots = [
      snap('1', '2026-01-01T00:00:00Z', [
        price({ label: 'Pro', raw: '$29', amount: 29 }),
        price({ label: 'Business', raw: '$99', amount: 99 }),
      ]),
      snap('2', '2026-01-02T00:00:00Z', [
        price({ label: 'Pro', raw: '$39', amount: 39 }),
        price({ label: 'Business', raw: '$99', amount: 99 }),
      ]),
    ]
    const series = buildPriceSeries(snapshots, {})
    const labels = series.map((s) => s.label).sort()
    expect(labels).toEqual(['Business', 'Pro'])
  })

  it('matches unlabeled prices positionally and names the series "Price"', () => {
    const snapshots = [
      snap('1', '2026-01-01T00:00:00Z', [price({ label: '', raw: '$10', amount: 10 })]),
      snap('2', '2026-01-02T00:00:00Z', [price({ label: '', raw: '$12', amount: 12 })]),
    ]
    const series = buildPriceSeries(snapshots, {})
    expect(series).toHaveLength(1)
    expect(series[0].label).toBe('Price')
    expect(series[0].points.map((p) => p.amount)).toEqual([10, 12])
  })

  it('records a gap — not an interpolated value — when a price disappears and returns', () => {
    const snapshots = [
      snap('1', '2026-01-01T00:00:00Z', [price({ label: 'Pro', raw: '$29', amount: 29 })]),
      snap('2', '2026-01-02T00:00:00Z', []), // page redesign, price missing
      snap('3', '2026-01-03T00:00:00Z', [price({ label: 'Pro', raw: '$39', amount: 39 })]),
    ]
    const series = buildPriceSeries(snapshots, {})
    expect(series).toHaveLength(1)
    expect(series[0].points.map((p) => p.amount)).toEqual([29, null, 39])
    expect(series[0].points[1].raw).toBeNull()
  })

  it('backfills captures that predate a price label first appearing', () => {
    const snapshots = [
      snap('1', '2026-01-01T00:00:00Z', []),
      snap('2', '2026-01-02T00:00:00Z', [price({ label: 'Pro', raw: '$29', amount: 29 })]),
      snap('3', '2026-01-03T00:00:00Z', [price({ label: 'Pro', raw: '$39', amount: 39 })]),
    ]
    const series = buildPriceSeries(snapshots, {})
    expect(series[0].points).toHaveLength(3)
    expect(series[0].points[0].amount).toBeNull()
  })

  it('flags hasAlert only on the capture whose content_changes named that label', () => {
    const snapshots = [
      snap('1', '2026-01-01T00:00:00Z', [price({ label: 'Pro', raw: '$29', amount: 29 })]),
      snap('2', '2026-01-02T00:00:00Z', [price({ label: 'Pro', raw: '$39', amount: 39 })]),
    ]
    const alerts: Record<string, HistoryAlert> = {
      '2': { metadata: { content_changes: [{ kind: 'price', label: 'Pro', from: '$29', to: '$39' }] } },
    }
    const series = buildPriceSeries(snapshots, alerts)
    expect(series[0].points.map((p) => p.hasAlert)).toEqual([false, true])
  })

  it('does not flag hasAlert when the alert on that capture named a different label', () => {
    const snapshots = [
      snap('1', '2026-01-01T00:00:00Z', [price({ label: 'Pro', raw: '$29', amount: 29 })]),
      snap('2', '2026-01-02T00:00:00Z', [price({ label: 'Pro', raw: '$39', amount: 39 })]),
    ]
    const alerts: Record<string, HistoryAlert> = {
      '2': { metadata: { content_changes: [{ kind: 'heading_added', text: 'New section' }] } },
    }
    const series = buildPriceSeries(snapshots, alerts)
    expect(series[0].points.map((p) => p.hasAlert)).toEqual([false, false])
  })

  it('orders series by most-complete first, then label', () => {
    const snapshots = [
      snap('1', '2026-01-01T00:00:00Z', [
        price({ label: 'Business', raw: '$99', amount: 99 }),
        price({ label: 'Pro', raw: '$29', amount: 29 }),
      ]),
      snap('2', '2026-01-02T00:00:00Z', [price({ label: 'Pro', raw: '$39', amount: 39 })]),
      snap('3', '2026-01-03T00:00:00Z', [price({ label: 'Pro', raw: '$49', amount: 49 })]),
    ]
    const series = buildPriceSeries(snapshots, {})
    // Pro has 3 real points, Business only 1 (dropped entirely).
    expect(series.map((s) => s.label)).toEqual(['Pro'])
  })

  it('carries currency through onto the series', () => {
    const snapshots = [
      snap('1', '2026-01-01T00:00:00Z', [price({ label: 'Pro', raw: '€29', amount: 29, currency: 'EUR' })]),
      snap('2', '2026-01-02T00:00:00Z', [price({ label: 'Pro', raw: '€39', amount: 39, currency: 'EUR' })]),
    ]
    const series = buildPriceSeries(snapshots, {})
    expect(series[0].currency).toBe('EUR')
  })
})
