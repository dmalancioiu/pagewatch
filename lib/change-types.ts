/**
 * Change taxonomy — pure and isomorphic (no Playwright, no Supabase, no Next
 * imports), mirroring `lib/content-diff.ts`. Imported by the Trigger.dev
 * worker (`trigger/lib/classify-change.ts`, `trigger/lib/take-screenshot.ts`)
 * today, and is exactly the kind of thing a future dashboard filter, digest
 * grouping, or chart wants to recompute or render client-side, so it stays
 * dependency-free on purpose — same reasoning as `lib/content-diff.ts`.
 *
 * `ChangeType` answers "what KIND of change is this" (price, legal, layout,
 * ...). `AlertSeverity` (`lib/severity.ts`) answers "how much does it
 * matter" (critical/high/medium/low). The two axes are independent by
 * design — a price change from $29 to $30 is `type: 'price'` but likely low
 * severity; a `broken` page is critical severity practically by definition.
 * Severity mapping stays exactly where it is in `lib/severity.ts`; this file
 * never re-derives or duplicates it.
 */

// ─── The taxonomy ────────────────────────────────────────────────────────────

export type ChangeType =
  | 'price'          // a monetary amount changed, was added, or disappeared
  | 'plan_structure' // a tier/column/package added or removed
  | 'copy'           // wording changed without changing meaning materially
  | 'offer'          // a trial, discount, or guarantee changed or vanished
  | 'legal'          // terms, privacy, policy, compliance wording
  | 'availability'   // stock, "sold out", "waitlist", "coming soon"
  | 'layout'         // structure moved, no text or price change
  | 'broken'         // error page, empty render, key element missing
  | 'other'

/** Every `ChangeType`, in the display/priority order the classifier checks them. */
export const CHANGE_TYPES: readonly ChangeType[] = [
  'price',
  'plan_structure',
  'copy',
  'offer',
  'legal',
  'availability',
  'layout',
  'broken',
  'other',
]

export function isChangeType(value: unknown): value is ChangeType {
  return typeof value === 'string' && (CHANGE_TYPES as readonly string[]).includes(value)
}

/**
 * Semantic tone scale, matching `components/ui/badge.tsx`'s `tone` variant
 * minus `accent` (reserved for brand emphasis, not a change classification).
 * Deliberately NOT reusing `lib/severity.ts`'s narrower `Tone` — that type
 * exists only for the 4-value severity scale and would force `layout`
 * (genuinely informational, not a warning) into `warn` or `muted`.
 */
export type ChangeTone = 'neutral' | 'ok' | 'warn' | 'critical' | 'info'

export interface ChangeTypeInfo {
  /** Short label for badges, filters, chart legends. */
  label: string
  /** One line explaining what lands in this category. */
  description: string
  /** Design-system tone this category renders with by default. */
  tone: ChangeTone
}

export const CHANGE_TYPE_INFO: Record<ChangeType, ChangeTypeInfo> = {
  price: {
    label: 'Price',
    description: 'A monetary amount changed, was added, or disappeared.',
    tone: 'critical',
  },
  plan_structure: {
    label: 'Plan structure',
    description: 'A pricing tier, column, or package was added or removed.',
    tone: 'critical',
  },
  copy: {
    label: 'Copy',
    description: 'Wording changed without materially changing what it means.',
    tone: 'neutral',
  },
  offer: {
    label: 'Offer',
    description: 'A trial, discount, or guarantee changed or vanished.',
    tone: 'warn',
  },
  legal: {
    label: 'Legal',
    description: 'Terms, privacy, policy, or compliance wording changed.',
    tone: 'warn',
  },
  availability: {
    label: 'Availability',
    description: 'Stock, "sold out", waitlist, or "coming soon" status changed.',
    tone: 'warn',
  },
  layout: {
    label: 'Layout',
    description: 'The page structure moved, with no text or price change.',
    tone: 'info',
  },
  broken: {
    label: 'Broken',
    description: 'An error page, an empty render, or a key element went missing.',
    tone: 'critical',
  },
  other: {
    label: 'Other',
    description: "A change that doesn't fit a more specific category.",
    tone: 'neutral',
  },
}

export function changeTypeLabel(type: ChangeType): string {
  return CHANGE_TYPE_INFO[type].label
}

export function changeTypeDescription(type: ChangeType): string {
  return CHANGE_TYPE_INFO[type].description
}

export function changeTypeTone(type: ChangeType): ChangeTone {
  return CHANGE_TYPE_INFO[type].tone
}

// ─── Routing ─────────────────────────────────────────────────────────────────
// Per-monitor decision of what happens once a change has been typed. Stored
// on `monitored_urls.change_routing` (migration 010) as a
// `Partial<Record<ChangeType, ChangeRouting>>`; a monitor with no entry (or
// no `change_routing` row at all) behaves exactly as every monitor does
// today — every alert-worthy change alerts.

export type ChangeRouting = 'alert' | 'digest_only' | 'ignore'

export const CHANGE_ROUTINGS: readonly ChangeRouting[] = ['alert', 'digest_only', 'ignore']

export function isChangeRouting(value: unknown): value is ChangeRouting {
  return typeof value === 'string' && (CHANGE_ROUTINGS as readonly string[]).includes(value)
}

/** Per-monitor override map. Absent key or absent map both mean `'alert'`. */
export type ChangeRoutingMap = Partial<Record<ChangeType, ChangeRouting>>

/**
 * Resolves what should happen for a classified change on a given monitor.
 * `map` is read straight off `monitored_urls.change_routing` (jsonb, so it
 * arrives untyped) — anything that isn't a plain object, or a value under
 * `type` that isn't a recognised `ChangeRouting`, degrades to the default
 * rather than throwing, matching how `diffExtracts` degrades to "no changes"
 * on bad/missing input instead of raising.
 */
export function resolveRouting(map: unknown, type: ChangeType): ChangeRouting {
  if (!map || typeof map !== 'object') return 'alert'
  const value = (map as Record<string, unknown>)[type]
  return isChangeRouting(value) ? value : 'alert'
}

// ─── Deterministic classification keyword lists ─────────────────────────────
//
// One exported, commented constant so every tunable pattern lives in a
// single place instead of scattered across the classifier. Every pattern is
// case-insensitive (`i` flag) and uses `\b` word boundaries rather than
// substring matching, which is what makes them punctuation-insensitive too —
// "Free trial!", "FREE TRIAL", and "free-trial" all satisfy `\btrial\b`
// without any text normalization step. `trigger/lib/classify-change.ts` is
// the only reader; retune here, not there.
export const CLASSIFICATION_KEYWORDS = {
  /**
   * Tier/column/package naming — common SaaS pricing-table vocabulary, both
   * generic ("plan", "tier") and the tier names themselves ("starter",
   * "enterprise", ...). Matched against ADDED/REMOVED heading text only
   * (`plan_structure` means a tier appeared or disappeared, not that one was
   * renamed — see `heading_changed` handling in `lib/content-diff.ts`).
   */
  tier: /\b(plan|plans|tier|tiers|package|packages|pricing|bundle|edition|starter|basic|standard|pro|premium|enterprise|business|plus|growth|scale|free)\b/i,

  /**
   * Trial / discount / guarantee language. Matched against the textual
   * content of any change (heading, body text, or meta) — an offer can
   * appear or vanish from anywhere on the page, not just a heading.
   */
  offer: /\b(free trial|trial|discount|coupon|promo code|promotion|% ?off|percent off|money[- ]back|guarantee(d)?|limited time|limited-time|special offer|no credit card)\b/i,

  /**
   * URL path or page title indicating a terms/privacy/policy/compliance
   * page. Matched against page-level context, not the change text — a
   * change is "legal" because of WHERE it happened, not what word appears
   * in the diff.
   */
  legalPage: /\b(terms[-\s]?(of[-\s]?(service|use))?|tos|privacy([-\s]?policy)?|policy|legal|gdpr|ccpa|compliance|cookie[-\s]?policy)\b/i,

  /**
   * Stock / availability phrasing. Matched against the textual content of
   * any change, same as `offer`.
   */
  availability: /\b(sold out|out of stock|in stock|back in stock|low stock|waitlist|wait[- ]?list|coming soon|pre[- ]?order|notify me when available|currently unavailable|only \d+ (left|remaining))\b/i,

  /**
   * Error-page / broken-render phrasing. Matched against the current
   * extract's visible text and page title.
   */
  errorPage: /\b(404|page not found|not found|500|internal server error|service unavailable|something went wrong|access denied|forbidden|too many requests|rate limited|application error|an error occurred|oops)\b/i,
} as const

/**
 * "Extraction returned almost no text" threshold for the `broken` heuristic,
 * in characters of normalized visible text. Real marketing/product pages
 * clear this by a wide margin; a genuinely broken render (blank body, a bare
 * error component) does not. Tunable alongside the keyword lists above.
 */
export const MIN_EXTRACT_TEXT_LENGTH = 40

/** Case-/punctuation-insensitive test against one of the patterns above. Null/undefined/empty input never matches. */
export function matchesKeywordPattern(text: string | null | undefined, pattern: RegExp): boolean {
  if (!text) return false
  return pattern.test(text)
}
