/**
 * Pure transforms from raw capture history (snapshots + the alerts that fired
 * on them) into chart-ready series. No React, no Supabase, no DOM — this is
 * exactly the kind of thing `ChangeChart.tsx` and a future export/API surface
 * both want, so it stays dependency-free on purpose (same rationale as
 * `lib/content-diff.ts`, which this file reads types from but never mutates).
 *
 * The real-data mess this handles:
 *  - a price's label can drift capture to capture ("Pro" vs "Pro plan")
 *  - a price can vanish for a while and come back — that is a GAP, not a
 *    straight line between the two points either side of it
 *  - a page can carry several prices at once (a pricing table), and some
 *    prices never carry a label at all
 *  - currency can differ between captures if a page geo-redirects
 */

import type { ContentChange, PageExtract } from './content-diff'

// ─── Input shapes ────────────────────────────────────────────────────────────

/** The slice of a snapshot this module needs — a subset of `ScreenshotSnapshot`. */
export interface HistorySnapshot {
  id: string
  taken_at: string
  extract: PageExtract | null
}

/**
 * The slice of an alert this module needs — a subset of `Alert`. Callers
 * already key the map by the alert's `current_snapshot_id` (see
 * `alertsBySnapshotId` below), so that field itself isn't needed here.
 */
export interface HistoryAlert {
  metadata?: { content_changes?: ContentChange[] | unknown } | null
}

// ─── Output shapes ───────────────────────────────────────────────────────────

export interface HistoryPoint {
  snapshotId: string
  takenAt: string
  /** `null` means this capture is a gap for this series — no price with this
   *  label was detected, so nothing should be drawn or interpolated through it. */
  amount: number | null
  raw: string | null
  /** True when the alert triggered by this capture named this series' price. */
  hasAlert: boolean
}

export interface PriceSeries {
  /** Stable identity for this series across renders (label + disambiguator). */
  key: string
  /** Display label — "Price" when the page never named this value. */
  label: string
  currency: string
  points: HistoryPoint[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeLabel(label: string | undefined | null): string {
  return (label ?? '').trim().replace(/\s+/g, ' ').toLowerCase()
}

function contentChangesOf(alert: HistoryAlert | undefined): ContentChange[] {
  const raw = alert?.metadata?.content_changes
  return Array.isArray(raw) ? (raw as ContentChange[]) : []
}

/** True if this capture's alert named a price change for `normalizedLabel`. */
function alertNamesLabel(changes: ContentChange[], normalizedLabel: string): boolean {
  return changes.some((c) => {
    if (c.kind !== 'price' && c.kind !== 'price_added' && c.kind !== 'price_removed') return false
    return normalizeLabel(c.label) === normalizedLabel
  })
}

/**
 * Builds one chart series per stable price label out of a monitor's full
 * capture history. Captures may be passed in any order; the result is always
 * chronological (oldest first — the order a chart draws left to right).
 *
 * Matching rule: prices are grouped by normalized label per capture, then
 * matched across captures by (label, position-within-that-label-group). A
 * page with one unlabeled price is the common case and yields one series
 * ("Price"); a page with several unlabeled prices in a stable order still
 * separates them by position. This mirrors the position-only fallback
 * `diffPrices` in lib/content-diff.ts already uses, extended across an
 * entire history instead of just two snapshots.
 *
 * Series with fewer than 2 real (non-gap) points are dropped — a single
 * price reading has no history to chart.
 */
export function buildPriceSeries(
  snapshots: HistorySnapshot[],
  alertsBySnapshotId: Record<string, HistoryAlert | undefined>
): PriceSeries[] {
  const chronological = [...snapshots].sort(
    (a, b) => new Date(a.taken_at).getTime() - new Date(b.taken_at).getTime()
  )

  function gapPoint(i: number): HistoryPoint {
    const snap = chronological[i]
    return { snapshotId: snap.id, takenAt: snap.taken_at, amount: null, raw: null, hasAlert: false }
  }

  // key -> series accumulator. Every series ends up with exactly
  // `chronological.length` points — one per capture, gaps included — so a
  // series' points stay index-aligned with `chronological` and with each
  // other, which is what lets the chart share one x scale across series.
  const seriesByKey = new Map<string, { label: string; currency: string; points: HistoryPoint[] }>()
  const seenKeysInOrder: string[] = []

  for (let i = 0; i < chronological.length; i++) {
    const snapshot = chronological[i]
    const prices = snapshot.extract?.prices ?? []
    const changes = contentChangesOf(alertsBySnapshotId[snapshot.id])

    // Group this capture's prices by normalized label, preserving order, so
    // repeated/unlabeled prices get a stable positional index.
    const groups = new Map<string, typeof prices>()
    for (const price of prices) {
      const norm = normalizeLabel(price.label)
      const bucket = groups.get(norm)
      if (bucket) bucket.push(price)
      else groups.set(norm, [price])
    }

    const keysPresentThisCapture = new Set<string>()

    for (const [norm, bucket] of groups) {
      bucket.forEach((price, idx) => {
        const key = `${norm}::${idx}`
        keysPresentThisCapture.add(key)

        if (!seriesByKey.has(key)) {
          const trimmed = price.label?.trim()
          const displayLabel = trimmed
            ? idx === 0
              ? trimmed
              : `${trimmed} (${idx + 1})`
            : idx === 0
              ? 'Price'
              : `Price (${idx + 1})`
          // Backfill every capture before this series' first appearance as a gap.
          const points: HistoryPoint[] = Array.from({ length: i }, (_, j) => gapPoint(j))
          seriesByKey.set(key, { label: displayLabel, currency: price.currency, points })
          seenKeysInOrder.push(key)
        }

        seriesByKey.get(key)!.points.push({
          snapshotId: snapshot.id,
          takenAt: snapshot.taken_at,
          amount: price.amount,
          raw: price.raw,
          hasAlert: alertNamesLabel(changes, norm),
        })
      })
    }

    // Every series that already exists but wasn't touched this capture gets
    // an explicit gap point, keeping every series' length equal to `i + 1`.
    for (const key of seenKeysInOrder) {
      if (keysPresentThisCapture.has(key)) continue
      seriesByKey.get(key)!.points.push(gapPoint(i))
    }
  }

  const result: PriceSeries[] = []
  for (const key of seenKeysInOrder) {
    const series = seriesByKey.get(key)!
    const realPoints = series.points.filter((p) => p.amount != null).length
    if (realPoints < 2) continue

    result.push({ key, label: series.label, currency: series.currency, points: series.points })
  }

  // Most-complete series first — that's almost always the one the page
  // actually cares about (a single tracked competitor price).
  result.sort((a, b) => {
    const ac = a.points.filter((p) => p.amount != null).length
    const bc = b.points.filter((p) => p.amount != null).length
    if (bc !== ac) return bc - ac
    return a.label.localeCompare(b.label)
  })

  return result
}
