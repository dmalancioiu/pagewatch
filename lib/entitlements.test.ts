import { describe, it, expect } from 'vitest'
import {
  assertCanAddMonitors,
  assertFrequencyAllowed,
  assertFeature,
  assertZoneCount,
  assertCheckQuota,
  startOfBillingPeriod,
  EntitlementError,
  type Entitlements,
  type UsageSnapshot,
} from './entitlements'
import { PLANS, cheapestPlanWithMonitors } from './plans'

/**
 * Only the pure assertion functions and startOfBillingPeriod are covered
 * here. getEntitlements/requireEntitlements/loadUsage are Supabase-backed and
 * out of scope — see the task instructions this suite was written against.
 */

function usage(overrides: Partial<UsageSnapshot> = {}): UsageSnapshot {
  return {
    monitors: 0,
    activeMonitors: 0,
    checksThisPeriod: 0,
    seats: 1,
    ...overrides,
  }
}

function fixture(overrides: Partial<Entitlements> = {}): Entitlements {
  const effective = overrides.effective ?? PLANS.pro
  const usageSnapshot = overrides.usage ?? usage()
  return {
    workspaceId: 'ws_test',
    plan: overrides.plan ?? effective,
    effective,
    status: overrides.status ?? 'active',
    trialEndsAt: overrides.trialEndsAt ?? null,
    usage: usageSnapshot,
    remaining: overrides.remaining ?? {
      monitors: Math.max(0, effective.limits.maxMonitors - usageSnapshot.monitors),
      checksThisPeriod: Math.max(
        0,
        effective.limits.maxChecksPerMonth - usageSnapshot.checksThisPeriod
      ),
      seats: Math.max(0, effective.limits.maxSeats - usageSnapshot.seats),
    },
  }
}

function expectEntitlementError(
  fn: () => void,
  code: EntitlementError['code'],
  upgradeTo: string | null
) {
  try {
    fn()
    throw new Error('expected fn to throw EntitlementError, but it did not throw')
  } catch (err) {
    expect(err).toBeInstanceOf(EntitlementError)
    const e = err as EntitlementError
    expect(e.code).toBe(code)
    expect(e.upgradeTo).toBe(upgradeTo)
  }
}

describe('assertCanAddMonitors', () => {
  it('passes under the limit', () => {
    const e = fixture({ effective: PLANS.pro, usage: usage({ monitors: 5 }) })
    expect(() => assertCanAddMonitors(e)).not.toThrow()
  })

  it('passes exactly at the limit minus the count being added', () => {
    const e = fixture({
      effective: PLANS.pro,
      usage: usage({ monitors: PLANS.pro.limits.maxMonitors - 1 }),
    })
    expect(() => assertCanAddMonitors(e, 1)).not.toThrow()
  })

  it('throws at the exact ceiling (adding one more when already at max)', () => {
    const e = fixture({
      effective: PLANS.pro,
      usage: usage({ monitors: PLANS.pro.limits.maxMonitors }),
    })
    const upgrade = cheapestPlanWithMonitors(PLANS.pro.limits.maxMonitors + 1)
    expectEntitlementError(() => assertCanAddMonitors(e, 1), 'limit_reached', upgrade!.id)
  })

  it('throws over the limit and carries the correct upgradeTo', () => {
    const e = fixture({
      effective: PLANS.free,
      usage: usage({ monitors: PLANS.free.limits.maxMonitors }),
    })
    expectEntitlementError(() => assertCanAddMonitors(e, 1), 'limit_reached', 'pro')
  })

  it('supports adding more than one monitor at once', () => {
    const e = fixture({ effective: PLANS.free, usage: usage({ monitors: 0 }) })
    // free.maxMonitors is 2; adding 3 at once exceeds it.
    expectEntitlementError(() => assertCanAddMonitors(e, 3), 'limit_reached', 'pro')
  })

  it('upgradeTo is null when even the top plan could not fit the requested count', () => {
    const e = fixture({ effective: PLANS.agency, usage: usage({ monitors: 0 }) })
    expectEntitlementError(
      () => assertCanAddMonitors(e, PLANS.agency.limits.maxMonitors + 1),
      'limit_reached',
      null
    )
  })
})

describe('assertFrequencyAllowed', () => {
  it('passes for a frequency the plan allows', () => {
    const e = fixture({ effective: PLANS.pro })
    expect(() => assertFrequencyAllowed(e, 'hourly')).not.toThrow()
    expect(() => assertFrequencyAllowed(e, 'daily')).not.toThrow()
    expect(() => assertFrequencyAllowed(e, 'weekly')).not.toThrow()
  })

  it('throws for a frequency outside the plan, with the correct upgrade target', () => {
    const e = fixture({ effective: PLANS.free })
    expectEntitlementError(() => assertFrequencyAllowed(e, 'hourly'), 'frequency_locked', 'pro')
  })

  it('free still allows daily/weekly', () => {
    const e = fixture({ effective: PLANS.free })
    expect(() => assertFrequencyAllowed(e, 'daily')).not.toThrow()
    expect(() => assertFrequencyAllowed(e, 'weekly')).not.toThrow()
  })
})

describe('assertFeature', () => {
  it('passes when the plan has the feature', () => {
    const e = fixture({ effective: PLANS.business })
    expect(() => assertFeature(e, 'api')).not.toThrow()
  })

  it('throws when the plan lacks the feature, with the cheapest upgrade', () => {
    const e = fixture({ effective: PLANS.free })
    expectEntitlementError(() => assertFeature(e, 'aiSummaries'), 'feature_locked', 'pro')
  })

  it('throws for an agency-only feature on a business plan', () => {
    const e = fixture({ effective: PLANS.business })
    expectEntitlementError(() => assertFeature(e, 'whiteLabel'), 'feature_locked', 'agency')
  })
})

describe('assertZoneCount', () => {
  it('never throws for zero zones, even on a plan without the zones feature', () => {
    const e = fixture({ effective: PLANS.free })
    expect(() => assertZoneCount(e, 0)).not.toThrow()
  })

  it('throws feature_locked when zones are used on a plan without the feature', () => {
    const e = fixture({ effective: PLANS.free })
    expectEntitlementError(() => assertZoneCount(e, 1), 'feature_locked', 'pro')
  })

  it('passes at exactly maxZonesPerMonitor', () => {
    const e = fixture({ effective: PLANS.pro })
    expect(() => assertZoneCount(e, PLANS.pro.limits.maxZonesPerMonitor)).not.toThrow()
  })

  it('throws limit_reached one above maxZonesPerMonitor, with no upgrade suggested', () => {
    const e = fixture({ effective: PLANS.pro })
    expectEntitlementError(
      () => assertZoneCount(e, PLANS.pro.limits.maxZonesPerMonitor + 1),
      'limit_reached',
      null
    )
  })
})

describe('assertCheckQuota', () => {
  it('passes when checks remain this period', () => {
    const e = fixture({
      effective: PLANS.pro,
      usage: usage({ checksThisPeriod: PLANS.pro.limits.maxChecksPerMonth - 1 }),
    })
    expect(() => assertCheckQuota(e)).not.toThrow()
  })

  it('throws once remaining hits zero (usage === limit)', () => {
    const e = fixture({
      effective: PLANS.pro,
      usage: usage({
        checksThisPeriod: PLANS.pro.limits.maxChecksPerMonth,
        monitors: 3,
      }),
    })
    const upgrade = cheapestPlanWithMonitors(4)
    expectEntitlementError(() => assertCheckQuota(e), 'limit_reached', upgrade!.id)
  })

  it('throws when usage has gone over the limit', () => {
    const e = fixture({
      effective: PLANS.free,
      usage: usage({
        checksThisPeriod: PLANS.free.limits.maxChecksPerMonth + 50,
        monitors: 1,
      }),
    })
    expectEntitlementError(() => assertCheckQuota(e), 'limit_reached', 'free')
  })
})

describe('startOfBillingPeriod', () => {
  it('returns midnight UTC on the 1st of the month for a mid-month date', () => {
    const now = new Date('2026-09-17T23:59:59.000Z')
    const start = startOfBillingPeriod(now)
    expect(start.toISOString()).toBe('2026-09-01T00:00:00.000Z')
  })

  it('is idempotent when given the 1st itself', () => {
    const now = new Date('2026-09-01T00:00:00.000Z')
    expect(startOfBillingPeriod(now).toISOString()).toBe('2026-09-01T00:00:00.000Z')
  })

  it('handles year rollover (December -> next January stays within December)', () => {
    const now = new Date('2026-12-31T12:00:00.000Z')
    expect(startOfBillingPeriod(now).toISOString()).toBe('2026-12-01T00:00:00.000Z')
  })

  it('defaults to the current time when no argument is given', () => {
    const start = startOfBillingPeriod()
    expect(start.getUTCDate()).toBe(1)
    expect(start.getUTCHours()).toBe(0)
  })
})
