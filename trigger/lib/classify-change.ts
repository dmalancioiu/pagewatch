/**
 * Deterministic-first classification of a set of `ContentChange`s into a
 * `ChangeType` (see `lib/change-types.ts` for the taxonomy).
 *
 * Deliberately pure: no Playwright, no Supabase, no Anthropic SDK, no
 * `@trigger.dev/sdk` import — a check per capture is exactly the cost
 * problem this codebase has been fighting (see backlog B4/D2), so the
 * common case must resolve without a network call. `classifyChange` only
 * ever returns `needsModel: true` when none of the cheap rules below fired;
 * the caller (`trigger/lib/take-screenshot.ts`) decides whether to actually
 * spend a model call on that ambiguity, gated on `plan.features.aiSummaries`
 * — this module has no opinion on plans and imports nothing from `lib/plans`.
 *
 * When the caller does call the model, it extends the EXISTING structured
 * output call in `trigger/lib/analyze-diff-with-ai.ts` with a `change_type`
 * field rather than making a second call — see that file's doc comment.
 */

import type { ContentChange } from '../../lib/content-diff'
import {
  CLASSIFICATION_KEYWORDS,
  MIN_EXTRACT_TEXT_LENGTH,
  matchesKeywordPattern,
  type ChangeType,
} from '../../lib/change-types'

export interface ClassifyContext {
  /** The monitor's URL. Checked against `CLASSIFICATION_KEYWORDS.legalPage`. */
  url: string
  /** Current (or, failing that, previous) extract's `<title>`. Checked against `legalPage` and `errorPage`. */
  pageTitle?: string | null
  /**
   * Current extract's normalized visible text, used for the `broken`
   * heuristic. `null`/`undefined` means "extraction didn't run or the
   * current extract is unavailable" — deliberately distinct from `''`,
   * which means "extraction ran and found nothing" (the actual broken-page
   * signal). Passing `null` here never triggers the empty-text branch of
   * the `broken` check, only the error-page-phrasing branch (against title).
   */
  afterText?: string | null
}

export interface ClassificationResult {
  /** Non-null when a deterministic rule matched confidently. */
  type: ChangeType | null
  /** Why this result was reached — logged by the caller, asserted on in tests. */
  reason: string
  /**
   * True when nothing below matched and this is genuinely ambiguous. The
   * caller decides whether to spend a model call on it; when it doesn't
   * (plan lacks `aiSummaries`, or the model call fails), `'other'` is the
   * correct fallback, not a third state here.
   */
  needsModel: boolean
}

/** Textual content of one `ContentChange`, for offer/availability keyword matching. */
function changeText(c: ContentChange): string {
  switch (c.kind) {
    case 'price':
      return `${c.label} ${c.from} ${c.to}`
    case 'price_added':
    case 'price_removed':
      return `${c.label} ${c.value}`
    case 'heading_added':
    case 'heading_removed':
      return c.text
    case 'heading_changed':
      return `${c.from} ${c.to}`
    case 'text_added':
    case 'text_removed':
      return c.text
    case 'meta_changed':
      return `${c.from} ${c.to}`
    case 'structure_changed':
      return ''
  }
}

function looksBroken(context: ClassifyContext): boolean {
  // Extraction ran and found next to nothing — the strongest broken signal.
  // `!= null` (not `!context.afterText`) so an actually-empty string counts
  // but "we don't know" (null/undefined) does not.
  if (context.afterText != null && context.afterText.trim().length < MIN_EXTRACT_TEXT_LENGTH) {
    return true
  }
  if (matchesKeywordPattern(context.afterText, CLASSIFICATION_KEYWORDS.errorPage)) return true
  if (matchesKeywordPattern(context.pageTitle, CLASSIFICATION_KEYWORDS.errorPage)) return true
  return false
}

/**
 * Classifies a set of structured content changes.
 *
 * Rule order (first match wins), mirroring the priority list in the D2 spec:
 *  1. price      — any price/price_added/price_removed change
 *  2. plan_structure — a tier-like heading added or removed
 *  3. offer      — trial/discount/guarantee language anywhere in the changes
 *  4. legal      — the page itself looks like terms/privacy/policy
 *  5. availability — stock/waitlist/"coming soon" phrasing
 *  6. layout     — `structure_changed` and nothing else
 *  7. broken     — the current extract looks empty or like an error page
 *  8. otherwise  — ambiguous; caller may ask the model
 */
export function classifyChange(changes: ContentChange[], context: ClassifyContext): ClassificationResult {
  if (changes.length === 0) {
    return { type: 'other', needsModel: false, reason: 'No content changes were provided to classify.' }
  }

  // 1. price — the highest-value field in the whole feature (see
  // analyze-diff-with-ai.ts's CHANGE_PRIORITY), and unambiguous by kind
  // alone: no keyword matching needed.
  if (changes.some((c) => c.kind === 'price' || c.kind === 'price_added' || c.kind === 'price_removed')) {
    return { type: 'price', needsModel: false, reason: 'A price changed, was added, or was removed.' }
  }

  // 2. plan_structure — a tier/column/package appeared or disappeared.
  // Renames (`heading_changed`) don't fit "added or removed" and are left
  // for the model/`copy` fallback.
  const tierHeading = changes.find(
    (c) =>
      (c.kind === 'heading_added' || c.kind === 'heading_removed') &&
      matchesKeywordPattern(c.text, CLASSIFICATION_KEYWORDS.tier)
  )
  if (tierHeading && (tierHeading.kind === 'heading_added' || tierHeading.kind === 'heading_removed')) {
    const verb = tierHeading.kind === 'heading_added' ? 'added' : 'removed'
    return { type: 'plan_structure', needsModel: false, reason: `A tier-like heading was ${verb}: "${tierHeading.text}".` }
  }

  // 3. offer — trial/discount/guarantee language changed anywhere.
  const offerChange = changes.find((c) => matchesKeywordPattern(changeText(c), CLASSIFICATION_KEYWORDS.offer))
  if (offerChange) {
    return { type: 'offer', needsModel: false, reason: 'Trial, discount, or guarantee language changed.' }
  }

  // 4. legal — the page itself is a terms/privacy/policy page, regardless
  // of which specific words changed on it.
  if (
    matchesKeywordPattern(context.url, CLASSIFICATION_KEYWORDS.legalPage) ||
    matchesKeywordPattern(context.pageTitle, CLASSIFICATION_KEYWORDS.legalPage)
  ) {
    return { type: 'legal', needsModel: false, reason: 'The change occurred on a terms/privacy/policy page.' }
  }

  // 5. availability — stock/waitlist/"coming soon" phrasing changed.
  const availabilityChange = changes.find((c) => matchesKeywordPattern(changeText(c), CLASSIFICATION_KEYWORDS.availability))
  if (availabilityChange) {
    return { type: 'availability', needsModel: false, reason: 'Stock or availability phrasing changed.' }
  }

  // 6. layout — only the DOM outline moved; nothing describable in words.
  if (changes.length === 1 && changes[0].kind === 'structure_changed') {
    return { type: 'layout', needsModel: false, reason: 'Only the page structure changed — no text or price difference.' }
  }

  // 7. broken — the current page barely has any text, or reads like an
  // error page.
  if (looksBroken(context)) {
    return { type: 'broken', needsModel: false, reason: 'The current extract looks empty or like an error page.' }
  }

  // Nothing matched confidently — genuinely ambiguous (this is where most
  // `copy` changes land, since "changed wording without changing meaning"
  // vs. something more material is a judgement call no keyword list can
  // make safely).
  return { type: null, needsModel: true, reason: 'No deterministic rule matched; needs model judgement.' }
}
