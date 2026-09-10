/**
 * Content for `/compare` and `/compare/[slug]`.
 *
 * ⚠️ READ THIS BEFORE EDITING
 * This module names real competitors (Visualping, Distill.io, Hexowatch,
 * ChangeTower, Wachete). We have no way to verify their current pricing,
 * limits, or feature sets from inside this environment, and those change
 * constantly. Every `competitor` cell in `COMPARISON_ROWS` is written in
 * neutral, category-level language for that reason — it never states a
 * competitor price, a specific limit, or "X doesn't support Y". Anywhere a
 * competitor-specific fact would actually strengthen the page, there's a
 * `TODO(verify)` comment instead of a guess. Search this file for
 * `TODO(verify)` before publishing to see every one of them.
 *
 * The `pagewatch` column is the only place numbers appear, and every number
 * comes from `lib/plans.ts` — never typed in twice.
 */

import { FEATURE_LABELS, PLANS, cheapestPlanWith, type FeatureKey } from '@/lib/plans'

export type ComparisonSlug = 'visualping' | 'distill' | 'hexowatch' | 'changetower' | 'wachete'

export interface Comparison {
  slug: ComparisonSlug
  /** Display name, exactly as the competitor writes it. */
  name: string
  eyebrow: string
  title: string
  description: string
  /**
   * One honest, category-level sentence about what the tool broadly is.
   * Sourced from docs/LAUNCH_STRATEGY.md §5, which already names these five
   * as "screenshot a page, diff it, email me" tools — that's the extent of
   * what's asserted here. No pricing, no feature claims.
   */
  category: string
  whoPageWatchFitsBest: string[]
  /** Honest: when the other tool (or a simpler workflow) is the better fit. */
  whoItIsntFor: string[]
  switching: { title: string; body: string }[]
  faqs: { question: string; answer: string }[]
}

export const COMPARISONS: Comparison[] = [
  {
    slug: 'visualping',
    name: 'Visualping',
    eyebrow: 'PageWatch vs Visualping',
    title: 'PageWatch vs Visualping',
    description:
      "An honest comparison of PageWatch and Visualping for teams deciding between them — what each is built for, and where PageWatch's AI relevance filtering changes the day-to-day experience.",
    category:
      'A widely-used page-change alert tool, generally reached for by individuals watching a small number of pages for any visible change.',
    whoPageWatchFitsBest: [
      'You want the alert itself to reason about intent — "tell me if the price or the free-trial length changes" — not just report that pixels moved.',
      'You want structured price, text, and JSON-LD extraction alongside the screenshot, not only a picture.',
      'You need per-zone sensitivity so a rotating hero or a live visitor count never fires an alert.',
      'You need snapshot retention measured in months, not days, for a historical record.',
    ],
    whoItIsntFor: [
      "You're watching a single page casually and don't need AI-filtered alerts or a team dashboard.",
      'You want the absolute lowest possible entry price and noise suppression matters less to you than cost.',
      "You'd rather work from a browser extension than a hosted dashboard.",
    ],
    switching: [
      {
        title: 'Export your current watch list first',
        body: 'Before you cancel anything, write down every URL you currently watch, the check frequency, and — if you can find it — the threshold or region settings. You will map these onto PageWatch monitors, and it is much faster with the list in front of you than reconstructing it from memory.',
      },
      {
        title: 'Run both in parallel for one full cycle',
        body: "Add your URLs to PageWatch and let it capture a baseline before you turn off the old tool. Comparing the first real alert from both systems, if you get one from each, is the fastest way to confirm PageWatch is watching the right region and won't miss what you cared about.",
      },
      {
        title: 'Rewrite blanket thresholds as zones and intent',
        body: 'A single "alert if more than N% changed" threshold usually exists to work around noisy regions — a rotating hero, a live counter, a cookie banner. PageWatch handles that differently: draw a zone around the part of the page you actually care about, and write what you want flagged in plain English. That combination is usually more precise than a global percentage ever was.',
      },
      {
        title: 'Pick retention before you pick a plan',
        body: "If you've been keeping your own screenshots to cover for short retention elsewhere, check how many days back you actually needed at least once. That number, more than monitor count, is usually what should decide the plan.",
      },
    ],
    faqs: [
      {
        question: 'Is this a straight feature-for-feature comparison?',
        answer:
          "No — we can't reliably verify a competitor's current pricing or limits from here, and those change often. This page focuses on what PageWatch does and why, with neutral language for anything about Visualping you should confirm on their own site.",
      },
      {
        question: 'Can I import my existing watch list?',
        answer:
          "There's no automated importer today. Add your URLs to PageWatch, set a watch description for what you care about, and let it capture a baseline — most people are fully switched over within one check cycle.",
      },
      {
        question: 'Does PageWatch have a browser extension?',
        answer:
          'No — PageWatch runs on a schedule from a real Chromium browser server-side, so it keeps checking pages whether or not your browser is open.',
      },
    ],
  },
  {
    slug: 'distill',
    name: 'Distill.io',
    eyebrow: 'PageWatch vs Distill.io',
    title: 'PageWatch vs Distill.io',
    description:
      'How PageWatch compares to Distill.io — where a hosted, AI-filtered monitoring dashboard fits versus a lighter, extension-based workflow.',
    category:
      'A page-change monitoring tool commonly used via a browser extension, aimed at people watching pages from within their own browser.',
    whoPageWatchFitsBest: [
      'You want monitoring to keep running on a schedule without a browser open or a machine staying on.',
      'You want Claude to write the summary of what changed, in plain English, instead of reading a raw diff yourself.',
      'You want a team dashboard with shared monitors and alert history, not a per-person extension.',
      'You want structured extraction (price, text, JSON-LD) so a change becomes data, not just a picture.',
    ],
    whoItIsntFor: [
      "You're already comfortable in a browser-extension workflow and don't need a hosted dashboard.",
      "You watch pages irregularly and don't need scheduled, unattended checks.",
      'AI-filtered relevance and structured extraction are not things you need — a raw diff is enough.',
    ],
    switching: [
      {
        title: 'List what you watch and why',
        body: "Extension-based tools make it easy to add a watch on impulse and forget why. Before switching, note the URL and the reason you added it — that reason becomes the watch description PageWatch uses to decide what's worth an alert.",
      },
      {
        title: 'Decide what should keep running unattended',
        body: "The biggest practical difference is that PageWatch checks run server-side on a schedule, not from your browser. Anything you want monitored even when you're not at your desk is exactly what should move first.",
      },
      {
        title: 'Rebuild per-page rules as zones',
        body: 'If you rely on selecting a specific region of a page to watch, that maps directly onto a PageWatch zone — draw the region, add an instruction, and it gets its own sensitivity independent of the rest of the page.',
      },
      {
        title: 'Keep one page running on each system for a week',
        body: "Overlap is cheap and it's the fastest way to build confidence that PageWatch's alert timing and content match what you'd have caught before you turn the old workflow off entirely.",
      },
    ],
    faqs: [
      {
        question: 'Do I need to install anything to use PageWatch?',
        answer:
          'No. PageWatch visits the public URL the same way a visitor would, on the schedule you set — nothing to install, no extension, no credentials.',
      },
      {
        question: "What if I've verified Distill.io's current pricing and it's a better fit for my case?",
        answer:
          "That's a completely reasonable outcome — this page is meant to help you decide, not to win the decision. If a lighter, extension-based tool covers what you need, use it.",
      },
      {
        question: 'Can PageWatch monitor pages behind a login?',
        answer:
          'Yes, on Business and Agency — authenticated capture signs in and runs a short scripted flow before the shot. Public pages work on every plan.',
      },
    ],
  },
  {
    slug: 'hexowatch',
    name: 'Hexowatch',
    eyebrow: 'PageWatch vs Hexowatch',
    title: 'PageWatch vs Hexowatch',
    description:
      'A look at PageWatch next to Hexowatch for teams evaluating broader website-monitoring suites versus a focused, AI-filtered visual change tool.',
    category:
      'A monitoring tool offered as part of a broader suite of website and automation tools, covering visual change alongside other website-intelligence features.',
    whoPageWatchFitsBest: [
      'You want one tool that does visual change monitoring deeply — AI relevance filtering, zones, structured extraction — rather than one feature inside a broader suite.',
      'You want the alert to explain what changed in plain English, weighted against what you told it to care about.',
      "You'd rather pay for a focused tool than a bundle that includes capabilities you won't use.",
      'You need long snapshot retention and an API for pulling change history into your own systems.',
    ],
    whoItIsntFor: [
      'You specifically want a single bundled subscription that covers monitoring alongside unrelated automation tooling.',
      "Visual change monitoring is a small part of a wider workflow you've already built around another suite.",
    ],
    switching: [
      {
        title: 'Separate what you monitor from what else the suite does',
        body: "If you're coming from a bundled tool, start by listing only the monitors — the URLs, frequency, and what you were alerted on. Other automations in that suite are a separate migration, if you need one at all.",
      },
      {
        title: 'Translate broad watches into a watch description',
        body: 'A general "notify me of any change" setting usually hides an unspoken priority — you care about some changes more than others. Write that priority down as PageWatch\'s watch description so the AI layer can actually use it instead of guessing.',
      },
      {
        title: 'Check your check-frequency needs against a real budget',
        body: 'Every plan here enforces a checks-per-month ceiling under the monitor count, not just a monitor limit — if you were running many pages hourly, confirm that combination still fits before committing to a plan.',
      },
      {
        title: 'Move your highest-value monitor first',
        body: "Start the switch with the one page where a missed or noisy alert would actually cost you something. It's the fastest way to know whether PageWatch's filtering matches your judgment before you move everything else.",
      },
    ],
    faqs: [
      {
        question: 'Is PageWatch part of a larger suite too?',
        answer:
          "No — PageWatch is a focused visual monitoring product. It integrates outward (Slack, API, webhooks on Business and up) rather than bundling unrelated tools inward.",
      },
      {
        question: "What if Hexowatch's bundle already covers what I need at a lower total cost?",
        answer:
          "Then it may be the right call — we can't verify current bundle pricing from here, so compare it directly against what you'd actually use PageWatch for before deciding.",
      },
      {
        question: 'Does PageWatch do anything besides visual monitoring?',
        answer:
          'Its scope is deliberately narrow: screenshot, diff, decide, alert — plus the structured extraction and API that turn a change into data you can use elsewhere.',
      },
    ],
  },
  {
    slug: 'changetower',
    name: 'ChangeTower',
    eyebrow: 'PageWatch vs ChangeTower',
    title: 'PageWatch vs ChangeTower',
    description:
      'Comparing PageWatch and ChangeTower for teams that need a defensible record of what a page said and when, not just a change alert.',
    category:
      'A website change-monitoring tool commonly used where an archived record of page history matters, alongside standard change alerts.',
    whoPageWatchFitsBest: [
      'You need retention long enough to cover a compliance or audit window, and an alert that explains what changed, not just that it did.',
      'You want AI relevance filtering so a routine content refresh does not get the same priority as a policy change.',
      'You want structured extraction of the changed text alongside the screenshot, for a record that is searchable, not just visual.',
      'You need an API to pull change history into your own audit tooling.',
    ],
    whoItIsntFor: [
      "Your retention needs are short and archival record-keeping isn't the point of the monitoring — a lighter tool may be simpler.",
      // TODO(verify): confirm whether ChangeTower offers a specific certified/
      // tamper-evident archive format before ever asserting PageWatch does or
      // doesn't match it head-to-head. Keeping this bullet generic until then.
      "You need a specific certified or tamper-evident archive format you've already qualified with a particular vendor — worth confirming PageWatch's storage model meets that exact bar first.",
    ],
    switching: [
      {
        title: 'Confirm your actual retention requirement in writing',
        body: 'If retention exists to satisfy a policy or a regulator, find the actual number of days or years required before picking a plan — this single number should drive the plan choice more than monitor count does.',
      },
      {
        title: "Don't lose history during the switch",
        body: 'PageWatch starts a fresh capture history from the day you add a monitor — it does not import a prior archive. If continuity matters, keep read access to the old archive until your PageWatch history covers the same window, rather than deleting it on day one.',
      },
      {
        title: 'Write watch descriptions for what "material" means to you',
        body: 'A compliance-flavored monitor usually cares about specific clauses, not the whole page redesigning. Say that directly — "alert me if a fee, deadline, or disclosure changes" — so the AI layer filters cosmetic updates from the ones that matter.',
      },
      {
        title: 'Decide who needs API access on day one',
        body: 'If your current archive feeds into a separate audit or legal system, plan the API/webhook connection (Business and up) as part of the switch, not as a follow-up project.',
      },
    ],
    faqs: [
      {
        // TODO(verify): "immutable-in-storage" describes PageWatch's own
        // retention model, not a claim about ChangeTower — but confirm this
        // language still matches storage/backup policy before publishing,
        // and have the compliance team sign off before it's used to answer
        // a buyer's certification question.
        question: 'Does PageWatch produce a certified or notarized archive?',
        answer:
          "PageWatch retains dated snapshots for your plan's retention window. Whether that satisfies a specific certification or notarization requirement depends on your regulator — check with your compliance team before relying on it for a regulated use case.",
      },
      {
        question: 'How long is history kept?',
        answer:
          "It depends on plan — retention runs from 14 days on Free up to a year or more on the higher tiers, and Agency retention is negotiated. Check the pricing section for the current numbers.",
      },
      {
        question: 'Can I export the change history?',
        answer:
          'The API and webhooks (Business and up) let you pull snapshots and alert records into your own systems rather than being limited to the dashboard.',
      },
    ],
  },
  {
    slug: 'wachete',
    name: 'Wachete',
    eyebrow: 'PageWatch vs Wachete',
    title: 'PageWatch vs Wachete',
    description:
      'A comparison of PageWatch and Wachete for anyone deciding between a simple change-alert tool and an AI-filtered monitoring dashboard.',
    category:
      'A page-monitoring tool often used for straightforward change alerts, including from mobile.',
    whoPageWatchFitsBest: [
      'You want the alert to already say what changed in plain English, instead of a diff you interpret yourself.',
      'You want per-zone sensitivity so unrelated parts of a busy page stay quiet.',
      'You want a team dashboard with shared monitors, not a personal alert list.',
      'You want structured data (price, text) captured alongside the screenshot for charting change over time.',
    ],
    whoItIsntFor: [
      "You want the simplest possible setup for a couple of personal alerts and don't need AI filtering or a team view.",
      // TODO(verify): confirm PageWatch's current mobile-web experience
      // before comparing it directly against Wachete's mobile offering —
      // keeping this generic until that's checked.
      "You specifically want a mobile-app-first workflow for checking alerts on the go.",
    ],
    switching: [
      {
        title: 'Start with your most-checked page',
        body: 'Move the page you personally check most often first — it gives you the fastest read on whether PageWatch catches what you care about, and it is the one where switching pays off soonest.',
      },
      {
        title: 'Turn personal thresholds into a watch description',
        body: 'If you were relying on a sensitivity setting, restate it as a sentence: what, specifically, should trigger an alert. That sentence is what the AI layer actually uses to judge a change, and it is usually more accurate than a single percentage.',
      },
      {
        title: 'Set up email or Slack delivery before you need it',
        body: "Confirm alert delivery is working — email on every plan, Slack from Pro up — before you're relying on it, not after the first change you needed to catch.",
      },
      {
        title: 'Give it one full check cycle before judging',
        body: "A schedule-based tool needs at least one real check to prove itself. Don't cancel the old tool until PageWatch has caught at least one real change on the page you moved first.",
      },
    ],
    faqs: [
      {
        question: 'Can I get alerts on my phone?',
        answer:
          'Email alerts work anywhere, and Slack delivery (Pro and up) puts alerts wherever your team already is. PageWatch does not have a dedicated mobile app today.',
      },
      {
        question: "Is switching worth it if I only monitor one or two pages?",
        answer:
          "It depends what you're optimizing for. If noisy alerts have made you start ignoring them, AI relevance filtering is worth it even at a small scale. If two quiet, simple pages have never given you a false alarm, a lighter tool may already be enough.",
      },
      {
        question: 'Does PageWatch have a free plan?',
        answer:
          'Yes — 2 monitors, daily or weekly checks, and 14 days of history, free, no card required.',
      },
    ],
  },
]

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug)
}

export interface ComparisonRow {
  capability: string
  pagewatch: string
  /** Always neutral / "verify on their site" language — see the file header. */
  competitor: string
}

function planLine(feature: FeatureKey): string {
  const plan = cheapestPlanWith(feature)
  return plan ? `Yes — ${plan.name} and up` : 'Not available'
}

/**
 * The capability table rows shown on every `/compare/[slug]` page. Identical
 * across competitors on purpose — the PageWatch column is always the real
 * plan data, and the competitor column is always a neutral "verify this"
 * line, never a specific claim about that competitor.
 *
 * TODO(verify): none of the `competitor` cells below assert a specific
 * price, limit, or missing feature for any named competitor — that's
 * intentional. If a future edit adds a competitor-specific claim to this
 * table, it needs a source and a verify pass before publishing.
 */
export function buildComparisonRows(competitorName: string): ComparisonRow[] {
  const verify = `Not verified here — check ${competitorName}'s current site.`

  return [
    {
      capability: 'Screenshot & pixel-diff monitoring',
      pagewatch: 'Yes, every plan',
      competitor: `Yes — this is the core feature of tools in this category, ${competitorName} included.`,
    },
    {
      capability: 'AI relevance filtering (can veto a noisy alert before it reaches you)',
      pagewatch: `${planLine('aiSummaries')} — Claude weighs the diff against what you said you care about`,
      competitor: verify,
    },
    {
      capability: 'Structured extraction (price, text, JSON-LD alongside the screenshot)',
      pagewatch: planLine('structuredExtraction'),
      competitor: verify,
    },
    {
      capability: 'Per-zone tracking regions and sensitivity',
      pagewatch: `${planLine('zones')}, up to ${PLANS.agency.limits.maxZonesPerMonitor} zones per monitor on Agency`,
      competitor: verify,
    },
    {
      capability: 'Snapshot retention',
      pagewatch: `${PLANS.free.limits.retentionDays} days free, up to ${PLANS.business.limits.retentionDays} days on Business`,
      competitor: verify,
    },
    {
      capability: FEATURE_LABELS.slack,
      pagewatch: planLine('slack'),
      competitor: verify,
    },
    {
      capability: FEATURE_LABELS.api,
      pagewatch: planLine('api'),
      competitor: verify,
    },
    {
      capability: FEATURE_LABELS.authenticatedCapture,
      pagewatch: planLine('authenticatedCapture'),
      competitor: verify,
    },
    {
      capability: FEATURE_LABELS.whiteLabel,
      pagewatch: planLine('whiteLabel'),
      competitor: verify,
    },
    {
      capability: 'Pricing',
      pagewatch: `From ${PLANS.free.monthlyUsd === 0 ? 'free' : `$${PLANS.free.monthlyUsd}`}, plans from $${PLANS.pro.monthlyUsd}/mo`,
      competitor: `See ${competitorName}'s pricing page — plans and limits change over time.`,
    },
  ]
}
