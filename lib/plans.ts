/**
 * Plan catalog — the single source of truth for what each tier allows.
 *
 * This module is deliberately pure: no `use server`, no Supabase, no Next
 * imports. Both the Next app and the Trigger.dev worker import it, and the
 * pricing page renders from it, so the numbers on the marketing site and the
 * numbers the server enforces can never drift apart.
 *
 * Adding a feature flag here is the only place a feature needs registering —
 * `lib/entitlements.ts` turns this into per-workspace answers.
 */

import type { CheckFrequency } from './types/database.types'

// ─── Identity ────────────────────────────────────────────────────────────────

export const PLAN_IDS = ['free', 'pro', 'business', 'agency'] as const
export type PlanId = (typeof PLAN_IDS)[number]

/** Lifecycle of the subscription, independent of which plan it points at. */
export type PlanStatus = 'trialing' | 'active' | 'past_due' | 'canceled'

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === 'string' && (PLAN_IDS as readonly string[]).includes(value)
}

// ─── Feature flags ───────────────────────────────────────────────────────────

/**
 * Every gated capability in the product. Keep this list flat and boolean —
 * anything with a number attached belongs in `PlanLimits` instead.
 */
export interface PlanFeatures {
  /** Claude writes the plain-English change summary and can veto noisy alerts. */
  aiSummaries: boolean
  /** Email fires immediately on high/critical instead of waiting for the digest. */
  instantAlerts: boolean
  /** Per-zone tracking regions rather than whole-page diffing only. */
  zones: boolean
  /** Slack delivery with inline before/after and triage buttons. */
  slack: boolean
  /** Text / DOM / JSON-LD extraction alongside the screenshot. */
  structuredExtraction: boolean
  /** REST API keys and outbound webhooks. */
  api: boolean
  /** Cross-monitor written briefing, sent weekly. */
  weeklyBriefing: boolean
  /** Capture behind a login, and short scripted flows before the shot. */
  authenticatedCapture: boolean
  /** Remove PageWatch branding from reports and alert emails. */
  whiteLabel: boolean
}

export type FeatureKey = keyof PlanFeatures

// ─── Limits ──────────────────────────────────────────────────────────────────

export interface PlanLimits {
  /** Monitors that are not soft-deleted. `Infinity` means metered, not free. */
  maxMonitors: number
  /** Capture cadences this plan may select. Ordered loosest → tightest. */
  allowedFrequencies: readonly CheckFrequency[]
  /** Days of snapshot history kept before the retention job deletes it. */
  retentionDays: number
  /** Hard ceiling on captures per billing period, across all monitors. */
  maxChecksPerMonth: number
  /** Tracking regions per monitor. 0 when the `zones` feature is off. */
  maxZonesPerMonitor: number
  /** Workspace members, including the owner. */
  maxSeats: number
  /** Manual "run now" presses per hour, per workspace. Abuse ceiling. */
  manualRunsPerHour: number
}

export interface Plan {
  id: PlanId
  /** Shown in the UI. */
  name: string
  /** One line for pricing cards and upgrade prompts. */
  tagline: string
  /** Monthly price in whole USD. `null` means "contact sales". */
  monthlyUsd: number | null
  /** Per-month price in whole USD when billed annually. */
  annualUsd: number | null
  limits: PlanLimits
  features: PlanFeatures
  /** False for tiers that can't be self-served through checkout. */
  selfServe: boolean
}

// ─── Catalog ─────────────────────────────────────────────────────────────────

/**
 * Frequencies in ascending cost order. Used to validate that a requested
 * cadence is within a plan's allowance.
 */
const FREQUENCY_COST_ORDER: readonly CheckFrequency[] = ['weekly', 'daily', 'hourly']

const NO_FEATURES: PlanFeatures = {
  aiSummaries: false,
  instantAlerts: false,
  zones: false,
  slack: false,
  structuredExtraction: false,
  api: false,
  weeklyBriefing: false,
  authenticatedCapture: false,
  whiteLabel: false,
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    tagline: 'Prove it catches something real.',
    monthlyUsd: 0,
    annualUsd: 0,
    selfServe: true,
    limits: {
      maxMonitors: 2,
      allowedFrequencies: ['weekly', 'daily'],
      retentionDays: 14,
      maxChecksPerMonth: 100,
      maxZonesPerMonitor: 0,
      maxSeats: 1,
      manualRunsPerHour: 5,
    },
    features: { ...NO_FEATURES },
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    tagline: 'For one operator watching what matters.',
    monthlyUsd: 39,
    annualUsd: 31,
    selfServe: true,
    limits: {
      maxMonitors: 15,
      allowedFrequencies: ['weekly', 'daily', 'hourly'],
      retentionDays: 90,
      maxChecksPerMonth: 12_000,
      maxZonesPerMonitor: 5,
      maxSeats: 1,
      manualRunsPerHour: 30,
    },
    features: {
      ...NO_FEATURES,
      aiSummaries: true,
      instantAlerts: true,
      zones: true,
      slack: true,
    },
  },

  business: {
    id: 'business',
    name: 'Business',
    tagline: 'For teams who act on what changed.',
    monthlyUsd: 129,
    annualUsd: 103,
    selfServe: true,
    limits: {
      maxMonitors: 60,
      allowedFrequencies: ['weekly', 'daily', 'hourly'],
      retentionDays: 365,
      maxChecksPerMonth: 60_000,
      maxZonesPerMonitor: 12,
      maxSeats: 10,
      manualRunsPerHour: 120,
    },
    features: {
      ...NO_FEATURES,
      aiSummaries: true,
      instantAlerts: true,
      zones: true,
      slack: true,
      structuredExtraction: true,
      api: true,
      weeklyBriefing: true,
    },
  },

  agency: {
    id: 'agency',
    name: 'Agency',
    tagline: 'Client properties at scale, under your brand.',
    monthlyUsd: null,
    annualUsd: null,
    selfServe: false,
    limits: {
      // Metered rather than unlimited — the ceiling exists, it is just
      // negotiated. Never advertise "unlimited" against a per-unit cost.
      maxMonitors: 500,
      allowedFrequencies: ['weekly', 'daily', 'hourly'],
      retentionDays: 1095,
      maxChecksPerMonth: 500_000,
      maxZonesPerMonitor: 24,
      maxSeats: 50,
      manualRunsPerHour: 500,
    },
    features: {
      aiSummaries: true,
      instantAlerts: true,
      zones: true,
      slack: true,
      structuredExtraction: true,
      api: true,
      weeklyBriefing: true,
      authenticatedCapture: true,
      whiteLabel: true,
    },
  },
}

/** Ascending order of capability. Drives upgrade suggestions. */
export const PLAN_ORDER: readonly PlanId[] = ['free', 'pro', 'business', 'agency']

// ─── Lookups ─────────────────────────────────────────────────────────────────

/** Resolves any stored value to a real plan, falling back to `free`. */
export function planFor(id: unknown): Plan {
  return isPlanId(id) ? PLANS[id] : PLANS.free
}

/**
 * The plan whose entitlements actually apply right now.
 *
 * A subscription can point at `business` while being `canceled` — in that case
 * the workspace keeps its data but gets `free` allowances. A trial grants the
 * full plan until it lapses.
 */
export function effectivePlan(
  planId: unknown,
  status: PlanStatus = 'active',
  trialEndsAt?: string | Date | null
): Plan {
  const plan = planFor(planId)

  switch (status) {
    case 'active':
      return plan
    case 'trialing': {
      if (!trialEndsAt) return plan
      const ends = trialEndsAt instanceof Date ? trialEndsAt : new Date(trialEndsAt)
      return ends.getTime() > Date.now() ? plan : PLANS.free
    }
    // Dunning and cancellation both degrade to free rather than cutting access
    // off. Read access is never revoked by entitlements — only new work is.
    case 'past_due':
    case 'canceled':
      return PLANS.free
  }
}

export function hasFeature(plan: Plan, feature: FeatureKey): boolean {
  return plan.features[feature]
}

/** True when `frequency` is within what this plan allows. */
export function allowsFrequency(plan: Plan, frequency: CheckFrequency): boolean {
  return plan.limits.allowedFrequencies.includes(frequency)
}

/**
 * The tightest cadence a plan permits — what to fall back to when a downgrade
 * leaves existing monitors running faster than the new plan allows.
 */
export function tightestFrequency(plan: Plan): CheckFrequency {
  const allowed = plan.limits.allowedFrequencies
  for (let i = FREQUENCY_COST_ORDER.length - 1; i >= 0; i--) {
    const frequency = FREQUENCY_COST_ORDER[i]
    if (allowed.includes(frequency)) return frequency
  }
  return 'weekly'
}

/**
 * The cheapest plan that unlocks `feature`, for "upgrade to X" prompts.
 * Returns null if no plan offers it.
 */
export function cheapestPlanWith(feature: FeatureKey): Plan | null {
  for (const id of PLAN_ORDER) {
    if (PLANS[id].features[feature]) return PLANS[id]
  }
  return null
}

/**
 * The cheapest plan that allows at least `count` monitors. Used to tell someone
 * who hit their ceiling exactly which tier solves it.
 */
export function cheapestPlanWithMonitors(count: number): Plan | null {
  for (const id of PLAN_ORDER) {
    if (PLANS[id].limits.maxMonitors >= count) return PLANS[id]
  }
  return null
}

/** Human-readable feature labels, for pricing cards and gate messaging. */
export const FEATURE_LABELS: Record<FeatureKey, string> = {
  aiSummaries: 'AI change summaries',
  instantAlerts: 'Instant alerts',
  zones: 'Tracking zones',
  slack: 'Slack delivery',
  structuredExtraction: 'Structured data extraction',
  api: 'API & webhooks',
  weeklyBriefing: 'Weekly briefing',
  authenticatedCapture: 'Authenticated capture',
  whiteLabel: 'White-label reports',
}

export const FREQUENCY_LABELS: Record<CheckFrequency, string> = {
  hourly: 'Hourly',
  daily: 'Daily',
  weekly: 'Weekly',
}
