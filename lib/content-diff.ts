/**
 * Pure diff logic over two `PageExtract` snapshots (see `trigger/lib/extract-content.ts`
 * for how those are produced).
 *
 * Deliberately isomorphic: no Playwright, no Supabase, no Next imports, no
 * external diff library. It is imported by the Trigger.dev worker today and
 * is exactly the kind of thing a future dashboard chart or API response wants
 * to recompute client-side, so it stays dependency-free on purpose.
 */

// ─── Public types ────────────────────────────────────────────────────────────

export interface ExtractedPrice {
  raw:      string          // the substring as it appeared on the page, e.g. "$1,299.00"
  amount:   number          // 1299
  currency: string          // "USD", "EUR", "GBP", ...
  label:    string          // nearest preceding heading/label, "" if none found
}

export interface ExtractedHeading {
  level: number   // 1-6
  text:  string
}

export interface ExtractedLink {
  href: string
  text: string
}

export interface PageExtract {
  title:            string
  metaDescription:  string
  canonical:        string
  lang:             string
  headings:         ExtractedHeading[]
  text:             string            // visible text, whitespace-normalized
  jsonLd:           unknown[]         // parsed application/ld+json blocks
  prices:           ExtractedPrice[]
  links:            ExtractedLink[]
  structureHash:    string            // stable hash of the DOM outline (tags + depth, no text)
  truncated:        boolean           // true if text or an array was capped
  extractedAt:      string            // ISO timestamp, set by the caller
}

export type ContentChange =
  | { kind: 'price'; label: string; from: string; to: string }
  | { kind: 'price_added' | 'price_removed'; label: string; value: string }
  | { kind: 'heading_added' | 'heading_removed'; text: string }
  | { kind: 'heading_changed'; from: string; to: string }
  | { kind: 'text_added' | 'text_removed'; text: string }
  | { kind: 'meta_changed'; field: 'title' | 'description' | 'canonical'; from: string; to: string }
  | { kind: 'structure_changed' }

export interface ContentDiffSummary {
  priceChanges:    number
  headingChanges:  number
  textChanges:     number
  metaChanges:     number
  structureChanged: boolean
  textChangesTruncated: boolean   // true if more sentence/line changes existed than were reported
}

export interface ContentDiffResult {
  changes: ContentChange[]
  summary: ContentDiffSummary
  isEmpty: boolean
}

// ─── Noise filters ───────────────────────────────────────────────────────────

/**
 * Volatile-content patterns to strip before comparing text, the same way the
 * pixel pipeline already strips cookie banners and chat widgets before
 * diffing pixels (see CSS_HIDE_SELECTORS in take-screenshot.ts). Without
 * this, a page with a "Last updated 3 minutes ago" footer or a live view
 * counter would produce a fresh "change" on every single check, and the
 * entire value proposition of this feature — alerts people actually trust —
 * is destroyed by exactly that kind of crying wolf.
 *
 * Exported (rather than buried) and commented per-pattern so a future reader
 * can retune or extend the list without having to reverse-engineer why a
 * given regex exists. Order does not matter; each is applied independently.
 */
export const VOLATILE_CONTENT_PATTERNS: { name: string; pattern: RegExp }[] = [
  // "3 minutes ago", "2 hours ago", "a moment ago", "in 5 days"
  { name: 'relative_time', pattern: /\b(a|an|\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago\b/gi },
  { name: 'relative_time_future', pattern: /\bin\s+\d+\s+(second|minute|hour|day|week|month|year)s?\b/gi },
  // "just now", "moments ago" phrasing variants not covered above
  { name: 'just_now', pattern: /\b(just now|moments? ago)\b/gi },
  // Absolute dates: "March 3, 2024", "2024-03-03", "03/03/2024" - a page's
  // "last updated" stamp changes every render even when nothing else did.
  { name: 'date_iso', pattern: /\b\d{4}-\d{2}-\d{2}\b/g },
  { name: 'date_slash', pattern: /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g },
  { name: 'date_long', pattern: /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4}\b/gi },
  // Clock times: "14:32:07", "2:32 PM"
  { name: 'clock_time', pattern: /\b\d{1,2}:\d{2}(:\d{2})?\s*(am|pm)?\b/gi },
  // View/like/share counters: "1,204 views", "42 likes", "3.2k comments"
  { name: 'counter', pattern: /\b[\d,.]+[kKmM]?\s+(views?|likes?|shares?|comments?|upvotes?|reactions?|followers?|subscribers?)\b/gi },
  // CSRF-looking tokens / nonces embedded in inline text (rare, but shows up
  // in server-rendered forms and some anti-bot challenge pages).
  { name: 'csrf_token', pattern: /\b(csrf|nonce|token)[=:][a-f0-9]{16,}\b/gi },
  // Long hex/base64-looking opaque IDs that aren't obviously a real word,
  // e.g. session identifiers rendered into the DOM.
  { name: 'opaque_id', pattern: /\b[a-f0-9]{24,}\b/gi },
]

/** Cache-busting query strings on otherwise-identical URLs (`?v=173208...`, `?t=...`). */
const CACHE_BUST_QUERY = /[?&](v|t|ts|_|cb|cache)=[^&#\s]+/gi

function stripVolatileContent(text: string): string {
  let out = text
  for (const { pattern } of VOLATILE_CONTENT_PATTERNS) out = out.replace(pattern, ' ')
  out = out.replace(CACHE_BUST_QUERY, '')
  return out
}

// ─── Normalization ───────────────────────────────────────────────────────────

/** Zero-width and BOM characters that render invisibly but break naive string equality. */
const ZERO_WIDTH_RE = /[​-‍﻿⁠]/g

/** Trailing punctuation, for the "only punctuation changed" equality rule below. */
const TRAILING_PUNCT_RE = /[.,;:!?…"'”’)\]]+$/

function normalizeWhitespace(s: string): string {
  return s.replace(ZERO_WIDTH_RE, '').replace(/\s+/g, ' ').trim()
}

/** Full normalization used before any equality check: whitespace + volatile content + case-insensitive punctuation trim. */
function normalizeForCompare(s: string): string {
  return normalizeWhitespace(stripVolatileContent(s))
}

/**
 * True when two strings are "the same" for alerting purposes: identical once
 * whitespace is collapsed and a difference confined to trailing punctuation
 * is ignored. "Contact us now" vs "Contact us now!" is not a content change
 * anyone wants an alert about.
 */
function isEquivalentText(a: string, b: string): boolean {
  const na = normalizeForCompare(a)
  const nb = normalizeForCompare(b)
  if (na === nb) return true
  return na.replace(TRAILING_PUNCT_RE, '') === nb.replace(TRAILING_PUNCT_RE, '')
}

// ─── Sentence/line splitting ─────────────────────────────────────────────────

const MAX_TEXT_CHANGES = 20

/**
 * Splits normalized text into comparison units at sentence/line granularity.
 * Word- or character-level diffing produces noise no user wants ("the" was
 * added); paragraph-level is too coarse to say what changed. A blank line or
 * sentence-ending punctuation followed by whitespace are both good enough
 * boundaries for the kind of marketing/product copy this product watches.
 */
function splitIntoUnits(text: string): string[] {
  const normalized = normalizeForCompare(text)
  if (!normalized) return []

  return normalized
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'“])|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

// ─── Price parsing helpers (used by callers, e.g. extract-content.ts) ────────

const CURRENCY_SYMBOL_TO_CODE: Record<string, string> = {
  '$': 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '¥': 'JPY',
  '₹': 'INR',
}

export function currencyCodeFromSymbol(symbol: string): string | null {
  return CURRENCY_SYMBOL_TO_CODE[symbol] ?? null
}

/**
 * Hash of the normalized visible text ALONE - not headings, prices, or
 * links, which move independently of body copy and would make the hash
 * change on every capture even when nothing a person would describe
 * actually did. Stored as `screenshot_snapshots.content_hash` (migration
 * 008) so "did anything change at all" is one indexed equality check
 * instead of downloading and diffing the previous extract on every capture.
 *
 * djb2 - cheap and deterministic; this only needs to be a stable
 * fingerprint, not a cryptographic hash.
 */
export function contentTextHash(text: string): string {
  const normalized = normalizeForCompare(text ?? '')
  let hash = 5381
  for (let i = 0; i < normalized.length; i++) hash = ((hash << 5) + hash + normalized.charCodeAt(i)) | 0
  return String(hash >>> 0)
}

// ─── Diff engine ─────────────────────────────────────────────────────────────

function diffMeta(before: PageExtract, after: PageExtract, changes: ContentChange[]): void {
  const fields: { field: 'title' | 'description' | 'canonical'; from: string; to: string }[] = [
    { field: 'title', from: before.title, to: after.title },
    { field: 'description', from: before.metaDescription, to: after.metaDescription },
    { field: 'canonical', from: before.canonical, to: after.canonical },
  ]

  for (const { field, from, to } of fields) {
    if (!isEquivalentText(from ?? '', to ?? '')) {
      changes.push({ kind: 'meta_changed', field, from: from ?? '', to: to ?? '' })
    }
  }
}

function diffHeadings(before: PageExtract, after: PageExtract, changes: ContentChange[]): void {
  const beforeHeadings = before.headings ?? []
  const afterHeadings = after.headings ?? []

  // Positional alignment first: a heading at the same index with the same
  // level and near-identical text is a rename, not an add+remove pair - this
  // mirrors the price-matching rule below and for the same reason (a rename
  // reads far better than two unrelated lines).
  const matchedAfter = new Set<number>()
  const matchedBefore = new Set<number>()

  for (let i = 0; i < beforeHeadings.length; i++) {
    const b = beforeHeadings[i]
    // Prefer an exact-text match anywhere first (heading reordered but unchanged).
    const exactIdx = afterHeadings.findIndex(
      (a, j) => !matchedAfter.has(j) && a.level === b.level && isEquivalentText(a.text, b.text)
    )
    if (exactIdx !== -1) {
      matchedBefore.add(i)
      matchedAfter.add(exactIdx)
    }
  }

  for (let i = 0; i < beforeHeadings.length; i++) {
    if (matchedBefore.has(i)) continue
    const b = beforeHeadings[i]
    // Look for a same-level heading at (roughly) the same position that
    // wasn't already claimed - that's a rename.
    const candidateIdx = afterHeadings.findIndex((a, j) => !matchedAfter.has(j) && a.level === b.level)
    if (candidateIdx !== -1 && Math.abs(candidateIdx - i) <= 2) {
      const a = afterHeadings[candidateIdx]
      matchedBefore.add(i)
      matchedAfter.add(candidateIdx)
      if (!isEquivalentText(a.text, b.text)) {
        changes.push({ kind: 'heading_changed', from: b.text, to: a.text })
      }
    }
  }

  for (let i = 0; i < beforeHeadings.length; i++) {
    if (!matchedBefore.has(i)) changes.push({ kind: 'heading_removed', text: beforeHeadings[i].text })
  }
  for (let j = 0; j < afterHeadings.length; j++) {
    if (!matchedAfter.has(j)) changes.push({ kind: 'heading_added', text: afterHeadings[j].text })
  }
}

/**
 * Price-matching rule (the highest-value and easiest-to-get-wrong part of
 * this diff): match by LABEL first, then fall back to position.
 *
 * A pricing table re-render often keeps every price's nearest heading intact
 * ("Business", "Pro", ...) even when amounts change - matching on label means
 * "Business: $14 -> $18" comes out as one `price` change instead of a
 * `price_removed` + `price_added` pair that loses the before/after
 * relationship entirely. Only when a label truly disappears (or a new one
 * appears with no prior counterpart) do we fall back to positional matching,
 * and only when there's exactly one unmatched-by-label price on each side at
 * the same index - anything more ambiguous is reported as adds/removes
 * rather than guessed at, because a wrong guess ("Pro went from $14 to $99")
 * is worse than two honest add/remove lines.
 */
function diffPrices(before: PageExtract, after: PageExtract, changes: ContentChange[]): void {
  const beforePrices = before.prices ?? []
  const afterPrices = after.prices ?? []

  const matchedBefore = new Set<number>()
  const matchedAfter = new Set<number>()

  // Pass 1: match by label (case/whitespace-normalized). A label match with
  // an unchanged amount+currency is simply not a change at all.
  for (let i = 0; i < beforePrices.length; i++) {
    const b = beforePrices[i]
    const label = normalizeForCompare(b.label)
    if (!label) continue
    const j = afterPrices.findIndex(
      (a, idx) => !matchedAfter.has(idx) && normalizeForCompare(a.label) === label
    )
    if (j !== -1) {
      matchedBefore.add(i)
      matchedAfter.add(j)
      const a = afterPrices[j]
      if (a.amount !== b.amount || a.currency !== b.currency) {
        changes.push({ kind: 'price', label: b.label, from: b.raw, to: a.raw })
      }
    }
  }

  // Pass 2: positional fallback, restricted to prices that never had a label
  // to match on. Only pair up when it's unambiguous - exactly one unlabeled
  // price left unmatched on each side - see the doc comment above for why:
  // anything more ambiguous falls through to honest add/remove lines below.
  const unmatchedBeforeUnlabeled = beforePrices
    .map((p, i) => ({ p, i }))
    .filter(({ p, i }) => !matchedBefore.has(i) && !normalizeForCompare(p.label))
  const unmatchedAfterUnlabeled = afterPrices
    .map((p, i) => ({ p, i }))
    .filter(({ p, i }) => !matchedAfter.has(i) && !normalizeForCompare(p.label))

  if (unmatchedBeforeUnlabeled.length === 1 && unmatchedAfterUnlabeled.length === 1) {
    const { p: b, i } = unmatchedBeforeUnlabeled[0]
    const { p: a, i: j } = unmatchedAfterUnlabeled[0]
    matchedBefore.add(i)
    matchedAfter.add(j)
    if (a.amount !== b.amount || a.currency !== b.currency) {
      changes.push({ kind: 'price', label: b.label || a.label, from: b.raw, to: a.raw })
    }
  }

  for (let i = 0; i < beforePrices.length; i++) {
    if (!matchedBefore.has(i)) changes.push({ kind: 'price_removed', label: beforePrices[i].label, value: beforePrices[i].raw })
  }
  for (let j = 0; j < afterPrices.length; j++) {
    if (!matchedAfter.has(j)) changes.push({ kind: 'price_added', label: afterPrices[j].label, value: afterPrices[j].raw })
  }
}

/**
 * Sentence/line-granularity text diff, capped at MAX_TEXT_CHANGES reported
 * changes (an overflow just means "and more" rather than flooding the alert
 * with dozens of lines). Uses simple set membership rather than an LCS/edit
 * distance algorithm on purpose - no diff library is a hard constraint, and
 * for the volumes involved (a capped ~40k chars of text) this is plenty fast
 * and gives the same practical result: units present in `after` but not
 * `before` are additions, and vice versa for removals.
 */
function diffText(before: PageExtract, after: PageExtract, changes: ContentChange[], summary: ContentDiffSummary): void {
  const beforeUnits = splitIntoUnits(before.text ?? '')
  const afterUnits = splitIntoUnits(after.text ?? '')

  // Key on the punctuation-trimmed form so "Contact us now" vs "Contact us
  // now!" is recognized as the same unit (see isEquivalentText) while the
  // reported text keeps the original, untrimmed wording.
  const keyOf = (u: string) => u.replace(TRAILING_PUNCT_RE, '')
  const beforeKeys = new Set(beforeUnits.map(keyOf))
  const afterKeys = new Set(afterUnits.map(keyOf))

  const removed: string[] = []
  const added: string[] = []

  for (const u of beforeUnits) if (!afterKeys.has(keyOf(u))) removed.push(u)
  for (const u of afterUnits) if (!beforeKeys.has(keyOf(u))) added.push(u)

  const combined = [
    ...removed.map((text) => ({ kind: 'text_removed' as const, text })),
    ...added.map((text) => ({ kind: 'text_added' as const, text })),
  ]

  if (combined.length > MAX_TEXT_CHANGES) {
    summary.textChangesTruncated = true
  }

  for (const c of combined.slice(0, MAX_TEXT_CHANGES)) changes.push(c)
}

/**
 * Compares two content extracts and returns typed, user-legible changes.
 *
 * Either extract may be null (extraction failed, or this is the first-ever
 * capture) - in that case there is nothing to compare, so this degrades to
 * "no content changes" rather than throwing. The pixel pipeline is the
 * fallback in that case, exactly as it was before this feature existed.
 */
export function diffExtracts(before: PageExtract | null, after: PageExtract | null): ContentDiffResult {
  const changes: ContentChange[] = []
  const summary: ContentDiffSummary = {
    priceChanges: 0,
    headingChanges: 0,
    textChanges: 0,
    metaChanges: 0,
    structureChanged: false,
    textChangesTruncated: false,
  }

  if (!before || !after) {
    return { changes, summary, isEmpty: true }
  }

  diffMeta(before, after, changes)
  diffHeadings(before, after, changes)
  diffPrices(before, after, changes)
  diffText(before, after, changes, summary)

  if (before.structureHash && after.structureHash && before.structureHash !== after.structureHash) {
    changes.push({ kind: 'structure_changed' })
  }

  for (const c of changes) {
    if (c.kind === 'price' || c.kind === 'price_added' || c.kind === 'price_removed') summary.priceChanges++
    else if (c.kind === 'heading_added' || c.kind === 'heading_removed' || c.kind === 'heading_changed') summary.headingChanges++
    else if (c.kind === 'text_added' || c.kind === 'text_removed') summary.textChanges++
    else if (c.kind === 'meta_changed') summary.metaChanges++
    else if (c.kind === 'structure_changed') summary.structureChanged = true
  }

  return { changes, summary, isEmpty: changes.length === 0 }
}
