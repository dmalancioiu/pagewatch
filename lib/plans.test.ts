import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  PLANS,
  PLAN_ORDER,
  PLAN_IDS,
  effectivePlan,
  allowsFrequency,
  tightestFrequency,
  cheapestPlanWith,
  cheapestPlanWithMonitors,
  FEATURE_LABELS,
  FREQUENCY_LABELS,
  isPlanId,
  type PlanFeatures,
  type FeatureKey,
} from './plans'
import type { CheckFrequency } from './types/database.types'

// A fixed "now" so trial-expiry assertions can't flip a month from now.
const NOW = new Date('2026-09-10T12:00:00.000Z')

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('isPlanId', () => {
  it('accepts every real plan id', () => {
    for (const id of PLAN_IDS) {
      expect(isPlanId(id)).toBe(true)
    }
  })

  it('rejects garbage', () => {
    expect(isPlanId('starter')).toBe(false)
    expect(isPlanId('')).toBe(false)
    expect(isPlanId(null)).toBe(false)
    expect(isPlanId(undefined)).toBe(false)
    expect(isPlanId(42)).toBe(false)
  })
})

describe('effectivePlan', () => {
  it('active gives the plan its own limits', () => {
    expect(effectivePlan('business', 'active')).toBe(PLANS.business)
    expect(effectivePlan('pro', 'active')).toBe(PLANS.pro)
    expect(effectivePlan('agency', 'active')).toBe(PLANS.agency)
    expect(effectivePlan('free', 'active')).toBe(PLANS.free)
  })

  it('defaults status to active when omitted', () => {
    expect(effectivePlan('business')).toBe(PLANS.business)
  })

  it('canceled degrades to free regardless of the underlying plan', () => {
    expect(effectivePlan('business', 'canceled')).toBe(PLANS.free)
    expect(effectivePlan('agency', 'canceled')).toBe(PLANS.free)
    expect(effectivePlan('pro', 'canceled')).toBe(PLANS.free)
  })

  it('past_due degrades to free', () => {
    expect(effectivePlan('business', 'past_due')).toBe(PLANS.free)
  })

  it('trialing gives full plan limits while trialEndsAt is in the future', () => {
    const future = new Date(NOW.getTime() + 1000 * 60 * 60 * 24).toISOString()
    expect(effectivePlan('business', 'trialing', future)).toBe(PLANS.business)
  })

  it('trialing degrades to free the instant trialEndsAt has passed', () => {
    const past = new Date(NOW.getTime() - 1000).toISOString()
    expect(effectivePlan('business', 'trialing', past)).toBe(PLANS.free)
  })

  it('trialing at exactly the boundary instant is treated as lapsed', () => {
    // ends.getTime() > Date.now() — equal times do not satisfy "in the future".
    expect(effectivePlan('business', 'trialing', NOW.toISOString())).toBe(PLANS.free)
  })

  it('trialing with a null trialEndsAt keeps the plan', () => {
    expect(effectivePlan('business', 'trialing', null)).toBe(PLANS.business)
  })

  it('trialing with an undefined trialEndsAt keeps the plan', () => {
    expect(effectivePlan('business', 'trialing', undefined)).toBe(PLANS.business)
  })

  it('trialing accepts a Date instance directly, not just a string', () => {
    const future = new Date(NOW.getTime() + 1000 * 60 * 60 * 24)
    expect(effectivePlan('business', 'trialing', future)).toBe(PLANS.business)
    const past = new Date(NOW.getTime() - 1000)
    expect(effectivePlan('business', 'trialing', past)).toBe(PLANS.free)
  })

  it('unknown/garbage plan id falls back to free, for every status', () => {
    expect(effectivePlan('nonsense', 'active')).toBe(PLANS.free)
    expect(effectivePlan(undefined, 'active')).toBe(PLANS.free)
    expect(effectivePlan(123, 'active')).toBe(PLANS.free)
    expect(effectivePlan('nonsense', 'canceled')).toBe(PLANS.free)
    expect(effectivePlan('nonsense', 'trialing', null)).toBe(PLANS.free)
  })
})

describe('allowsFrequency', () => {
  const cases: Array<[keyof typeof PLANS, CheckFrequency, boolean]> = [
    ['free', 'weekly', true],
    ['free', 'daily', true],
    ['free', 'hourly', false],
    ['pro', 'weekly', true],
    ['pro', 'daily', true],
    ['pro', 'hourly', true],
    ['business', 'hourly', true],
    ['agency', 'hourly', true],
  ]

  it.each(cases)('%s allows %s => %s', (planId, frequency, expected) => {
    expect(allowsFrequency(PLANS[planId], frequency)).toBe(expected)
  })
})

describe('tightestFrequency', () => {
  it('free (no hourly) is tightest at daily', () => {
    expect(tightestFrequency(PLANS.free)).toBe('daily')
  })

  it('pro/business/agency (hourly allowed) are tightest at hourly', () => {
    expect(tightestFrequency(PLANS.pro)).toBe('hourly')
    expect(tightestFrequency(PLANS.business)).toBe('hourly')
    expect(tightestFrequency(PLANS.agency)).toBe('hourly')
  })

  it('falls back to weekly for a plan with no allowed frequencies at all', () => {
    const bare = { ...PLANS.free, limits: { ...PLANS.free.limits, allowedFrequencies: [] } }
    expect(tightestFrequency(bare)).toBe('weekly')
  })
})

describe('cheapestPlanWith', () => {
  it('returns the lowest tier in PLAN_ORDER that has the feature', () => {
    expect(cheapestPlanWith('aiSummaries')).toBe(PLANS.pro)
    expect(cheapestPlanWith('slack')).toBe(PLANS.pro)
    expect(cheapestPlanWith('zones')).toBe(PLANS.pro)
    expect(cheapestPlanWith('structuredExtraction')).toBe(PLANS.business)
    expect(cheapestPlanWith('api')).toBe(PLANS.business)
    expect(cheapestPlanWith('weeklyBriefing')).toBe(PLANS.business)
    expect(cheapestPlanWith('authenticatedCapture')).toBe(PLANS.agency)
    expect(cheapestPlanWith('whiteLabel')).toBe(PLANS.agency)
  })

  it('respects PLAN_ORDER rather than object insertion order', () => {
    // Sanity: PLAN_ORDER is the ascending-capability order the function walks.
    expect(PLAN_ORDER).toEqual(['free', 'pro', 'business', 'agency'])
  })
})

describe('cheapestPlanWithMonitors', () => {
  it('returns the plan itself at its exact maxMonitors boundary', () => {
    expect(cheapestPlanWithMonitors(PLANS.free.limits.maxMonitors)).toBe(PLANS.free)
    expect(cheapestPlanWithMonitors(PLANS.pro.limits.maxMonitors)).toBe(PLANS.pro)
    expect(cheapestPlanWithMonitors(PLANS.business.limits.maxMonitors)).toBe(PLANS.business)
    expect(cheapestPlanWithMonitors(PLANS.agency.limits.maxMonitors)).toBe(PLANS.agency)
  })

  it('bumps to the next tier one monitor above the boundary', () => {
    expect(cheapestPlanWithMonitors(PLANS.free.limits.maxMonitors + 1)).toBe(PLANS.pro)
    expect(cheapestPlanWithMonitors(PLANS.pro.limits.maxMonitors + 1)).toBe(PLANS.business)
    expect(cheapestPlanWithMonitors(PLANS.business.limits.maxMonitors + 1)).toBe(PLANS.agency)
  })

  it('returns null when no plan goes that high', () => {
    expect(cheapestPlanWithMonitors(PLANS.agency.limits.maxMonitors + 1)).toBeNull()
  })
})

describe('label completeness invariants', () => {
  it('every PlanFeatures key has a FEATURE_LABELS entry', () => {
    // Derive the actual key set from a real plan's features object rather than
    // hardcoding a list, so a newly added feature flag fails this test until
    // it gets a label.
    const featureKeys = Object.keys(PLANS.agency.features) as FeatureKey[]
    for (const key of featureKeys) {
      expect(FEATURE_LABELS).toHaveProperty(key)
      expect(typeof FEATURE_LABELS[key]).toBe('string')
      expect(FEATURE_LABELS[key].length).toBeGreaterThan(0)
    }
    // And no orphaned labels for keys that aren't real features.
    expect(Object.keys(FEATURE_LABELS).sort()).toEqual(featureKeys.sort())
  })

  it('every CheckFrequency appears in FREQUENCY_LABELS', () => {
    const frequencies: CheckFrequency[] = ['hourly', 'daily', 'weekly']
    for (const frequency of frequencies) {
      expect(FREQUENCY_LABELS).toHaveProperty(frequency)
      expect(typeof FREQUENCY_LABELS[frequency]).toBe('string')
      expect(FREQUENCY_LABELS[frequency].length).toBeGreaterThan(0)
    }
    expect(Object.keys(FREQUENCY_LABELS).sort()).toEqual([...frequencies].sort())
  })

  it('every plan in PLANS declares every PlanFeatures key (no silently-missing flags)', () => {
    const featureKeys = Object.keys(PLANS.agency.features) as (keyof PlanFeatures)[]
    for (const planId of PLAN_IDS) {
      const plan = PLANS[planId]
      for (const key of featureKeys) {
        expect(plan.features).toHaveProperty(key)
        expect(typeof plan.features[key]).toBe('boolean')
      }
    }
  })
})
