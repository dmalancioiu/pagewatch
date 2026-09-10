/**
 * Content for `/for/[slug]` — use-case landing pages. These are where real
 * intent lands (per the launch brief), so they're concrete: what you'd
 * monitor, what an alert actually looks like, what it saves you. Every
 * feature and plan reference here comes from `lib/plans.ts`.
 */

import { cheapestPlanWith, cheapestPlanWithMonitors, PLANS, type FeatureKey } from '@/lib/plans'
import type { AlertSeverity } from '@/lib/types/database.types'

export type UseCaseSlug =
  | 'competitor-price-tracking'
  | 'agencies'
  | 'compliance-monitoring'
  | 'deploy-qa'

export interface AlertExample {
  title: string
  summary: string
  severity: AlertSeverity
  /** Short "what changed" line shown as secondary metadata, per design system §7. */
  meta: string
}

export interface UseCase {
  slug: UseCaseSlug
  eyebrow: string
  title: string
  description: string
  intro: string
  whatToMonitor: string[]
  alertExample: AlertExample
  whatItSaves: string[]
  /** Feature keys worth calling out for this use case, in the order to show them. */
  relevantFeatures: FeatureKey[]
  faqs: { question: string; answer: string }[]
}

export const USE_CASES: UseCase[] = [
  {
    slug: 'competitor-price-tracking',
    eyebrow: 'Competitor price tracking',
    title: 'Know the moment a competitor moves their price',
    description:
      'Monitor competitor pricing pages on a schedule and get an alert that already explains what changed — not a percentage you have to go interpret yourself.',
    intro:
      "Pricing pages are the highest-signal page a competitor has, and the easiest to miss a change on — nobody refreshes five competitor pricing pages every Monday for long. PageWatch does it on a schedule and tells you what moved, not just that something did.",
    whatToMonitor: [
      'Pricing tables and per-seat or per-unit costs',
      'Free trial length and "card required" copy',
      'Feature-comparison and plan-limit copy',
      'Promotional banners and time-limited offers',
      'New or removed plan tiers',
    ],
    alertExample: {
      title: 'Pricing changed',
      summary:
        'The monthly price moved from $49 to $79 and the free trial shortened from 14 days to 7.',
      severity: 'high',
      meta: '22% of the page changed',
    },
    whatItSaves: [
      'No more manually refreshing competitor pricing pages on a recurring calendar reminder',
      'A dated history of every pricing move, not just whatever the page says today',
      'An alert that already explains what changed instead of a raw diff you have to interpret yourself',
    ],
    relevantFeatures: ['zones', 'aiSummaries', 'structuredExtraction', 'slack'],
    faqs: [
      {
        question: 'Can I track more than one competitor at once?',
        answer:
          'Yes — each competitor page is its own monitor with its own schedule and watch description, so you can prioritize the ones that move often over the ones that rarely change.',
      },
      {
        question: 'Will I get an alert for a cosmetic redesign that keeps the same price?',
        answer:
          "Only if you ask for it. A watch description like \"only alert me if the price, plan names, or trial length change\" tells Claude to weigh the diff against that intent before deciding whether it's worth telling you.",
      },
      {
        question: 'Can I see price history over time, not just the most recent change?',
        answer:
          `Yes — structured extraction (${PLANS.business.name} and up) captures the price as data alongside the screenshot, so you get a chartable history instead of only a stack of images.`,
      },
    ],
  },
  {
    slug: 'agencies',
    eyebrow: 'Agency client monitoring',
    title: 'One dashboard for every client site you manage',
    description:
      'Monitor every client property from a single workspace, catch unauthorized edits and visual regressions early, and hand clients a record of what changed and when.',
    intro:
      "Managing monitoring per-client, in whatever tool each client happens to already have, doesn't scale past a handful of accounts. PageWatch gives an agency one workspace, seats for the whole team, and reporting that's ready to forward.",
    whatToMonitor: [
      'Every client homepage and key landing page after a deploy',
      'Client-supplied copy, for edits made outside your review process',
      'Third-party plugin, theme, or tag-manager visual regressions',
      "Client competitors' pages, as a value-add service",
    ],
    alertExample: {
      title: 'Homepage changed',
      summary:
        'The hero headline and primary CTA button text both changed. No pricing or navigation changes detected.',
      severity: 'medium',
      meta: '9% of the page changed',
    },
    whatItSaves: [
      'One workspace across every client property instead of a different login per site',
      "Proof of what changed and when, ready to forward as part of client reporting",
      `Seats for the whole team (up to ${PLANS.business.limits.maxSeats} on ${PLANS.business.name}) instead of a separate tool license per person`,
    ],
    relevantFeatures: ['whiteLabel', 'api', 'weeklyBriefing', 'structuredExtraction'],
    faqs: [
      {
        question: 'Can I white-label reports for clients?',
        answer: `Yes, on ${cheapestPlanWith('whiteLabel')?.name ?? 'Agency'} — alert emails and reports drop PageWatch branding so what your client sees looks like it came from you.`,
      },
      {
        question: 'How many client sites can one workspace cover?',
        answer: `That depends on plan — up to ${PLANS.business.limits.maxMonitors} monitors on ${PLANS.business.name}, and ${PLANS.agency.name} is metered for agencies running many more client properties than that.`,
      },
      {
        question: 'Can I give each teammate their own view without sharing logins?',
        answer: `Yes — ${PLANS.business.name} and up include multiple seats, so each teammate signs in with their own account rather than sharing one login.`,
      },
    ],
  },
  {
    slug: 'compliance-monitoring',
    eyebrow: 'Compliance & policy monitoring',
    title: 'A defensible record of what your policy pages said, and when',
    description:
      'Monitor terms, privacy, and disclosure pages on a schedule and keep a retained, dated history — with an alert that flags the clause that changed, not just that the page did.',
    intro:
      "A policy change that goes live quietly and gets noticed by a customer or a regulator first is a bad way to find out. PageWatch checks the pages that actually carry legal or regulatory weight on a schedule, and keeps the history to prove what changed and when.",
    whatToMonitor: [
      'Terms of service and privacy policy pages',
      'Regulatory disclosure and disclaimer pages',
      'Published pricing or fee schedules subject to disclosure requirements',
      'Any page a compliance team has flagged as "must not change quietly"',
    ],
    alertExample: {
      title: 'Privacy policy changed',
      summary:
        'A new clause was added under "Data sharing" describing a third-party analytics partner. No other sections changed.',
      severity: 'critical',
      meta: '4% of the page changed',
    },
    whatItSaves: [
      "A dated, retained screenshot history you can produce on request instead of reconstructing one after the fact",
      'Structured text extraction of the exact clause that changed, not just a picture of the whole page',
      "Confidence you'd catch a quiet policy change instead of finding out from a customer or a regulator first",
    ],
    relevantFeatures: ['structuredExtraction', 'weeklyBriefing', 'api'],
    faqs: [
      {
        question: 'How long is history retained?',
        answer: `Retention scales with plan — ${PLANS.free.limits.retentionDays} days on Free up to ${PLANS.business.limits.retentionDays} days on ${PLANS.business.name}, and ${PLANS.agency.name} retention is negotiated for teams that need years, not months.`,
      },
      {
        question: 'Does this replace a legal review process?',
        answer:
          "No — PageWatch tells you that a page changed and roughly what changed, fast enough to route it to the right person. It's a detection and record-keeping layer, not a substitute for legal review.",
      },
      {
        question: 'Can I get a written summary across all my compliance monitors?',
        answer: `Yes — the weekly briefing (${cheapestPlanWith('weeklyBriefing')?.name ?? 'Business'} and up) is a written, cross-monitor summary rather than a list of individual alerts.`,
      },
    ],
  },
  {
    slug: 'deploy-qa',
    eyebrow: 'Release & deploy QA',
    title: 'Catch a visual regression before a customer does',
    description:
      'Monitor key pages right after a release — checkout, pricing, the pages a bad deploy actually breaks — and get flagged the moment something looks wrong.',
    intro:
      "Most visual regressions get found by a customer, not by QA. PageWatch checks the pages that matter most on a tight schedule, so a broken checkout or a layout regression gets caught in minutes instead of after a support ticket.",
    whatToMonitor: [
      'Checkout and pricing flow rendering',
      'Key conversion pages immediately after a release',
      'Third-party script or tag-manager regressions',
      'Production appearance generally, on an hourly cadence around deploys',
    ],
    alertExample: {
      title: 'Checkout page changed',
      summary:
        'The payment form lost its submit button. This looks like a layout regression, not a content update.',
      severity: 'critical',
      meta: '18% of the page changed',
    },
    whatItSaves: [
      'Catching a visual regression before a customer reports it',
      'A record of exactly what a page looked like before and after each release',
      "Faster triage — the alert already names the region that changed instead of a raw diff you have to inspect",
    ],
    relevantFeatures: ['zones', 'instantAlerts', 'aiSummaries'],
    faqs: [
      {
        question: 'How fast can PageWatch check after a deploy?',
        answer: `Hourly checks are available from ${cheapestPlanWith('instantAlerts')?.name ?? 'Pro'}, and instant alerts fire on high/critical severity immediately rather than waiting for a digest.`,
      },
      {
        question: 'Can I monitor a checkout flow that requires login?',
        answer: `Yes — authenticated capture (${cheapestPlanWith('authenticatedCapture')?.name ?? 'Agency'}) signs in and runs a short scripted flow before the screenshot, so logged-in flows are covered too.`,
      },
      {
        question: 'How is this different from a synthetic monitoring or uptime tool?',
        answer:
          "An uptime monitor tells you the server responded. PageWatch tells you what the page actually looks like now versus the last check — a deploy can return 200 and still render broken.",
      },
    ],
  },
]

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug)
}

/** The plan this use case most naturally lands on, purely for a "starts on" line — never invented, always derived. */
export function recommendedPlanFor(useCase: UseCase) {
  for (const feature of useCase.relevantFeatures) {
    const plan = cheapestPlanWith(feature)
    if (plan && plan.id !== 'free') return plan
  }
  return cheapestPlanWithMonitors(1) ?? PLANS.free
}
