import { describe, it, expect } from 'vitest'
// Import only the pure predicate — importing the task itself pulls in the
// Trigger.dev SDK (schedules.task(...) runs registration side effects at
// module load time, which has no business happening under a unit test).
import { isDue } from './screenshot-monitor'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR
const WEEK = 7 * DAY

const NOW = new Date('2026-09-10T15:30:00.000Z') // UTC hour 15, not on the hour boundary
// (so "N minutes ago" fixtures below land in the same UTC hour as NOW)

function monitor(overrides: {
  check_frequency: string
  check_hour?: number | null
  last_checked_at?: string | null
}) {
  return {
    check_frequency: overrides.check_frequency,
    check_hour: overrides.check_hour ?? null,
    last_checked_at: overrides.last_checked_at ?? null,
  }
}

describe('isDue — hourly (ignores check_hour entirely)', () => {
  it('runs when last_checked_at is null, regardless of check_hour', () => {
    expect(
      isDue(monitor({ check_frequency: 'hourly', last_checked_at: null, check_hour: 9 }), NOW)
    ).toBe(true)
  })

  it('does not run before an hour has elapsed', () => {
    const last = new Date(NOW.getTime() - (HOUR - 1000)).toISOString()
    expect(isDue(monitor({ check_frequency: 'hourly', last_checked_at: last }), NOW)).toBe(
      false
    )
  })

  it('runs once at least an hour has elapsed', () => {
    const last = new Date(NOW.getTime() - HOUR - 1000).toISOString()
    expect(isDue(monitor({ check_frequency: 'hourly', last_checked_at: last }), NOW)).toBe(
      true
    )
  })

  it('ignores check_hour even when the current UTC hour does not match it', () => {
    // NOW is UTC hour 15; check_hour is 3. An hourly monitor must not care.
    const last = new Date(NOW.getTime() - HOUR - 1000).toISOString()
    expect(
      isDue(
        monitor({ check_frequency: 'hourly', check_hour: 3, last_checked_at: last }),
        NOW
      )
    ).toBe(true)
  })
})

describe('isDue — boundary: elapsed exactly equal to the interval', () => {
  it('elapsed === HOUR is treated as due (>= comparison, not strictly >)', () => {
    const last = new Date(NOW.getTime() - HOUR).toISOString()
    expect(isDue(monitor({ check_frequency: 'hourly', last_checked_at: last }), NOW)).toBe(
      true
    )
  })

  it('elapsed === DAY is treated as due for a daily monitor with no check_hour', () => {
    const last = new Date(NOW.getTime() - DAY).toISOString()
    expect(isDue(monitor({ check_frequency: 'daily', last_checked_at: last }), NOW)).toBe(
      true
    )
  })

  it('elapsed === WEEK is treated as due for a weekly monitor with no check_hour', () => {
    const last = new Date(NOW.getTime() - WEEK).toISOString()
    expect(isDue(monitor({ check_frequency: 'weekly', last_checked_at: last }), NOW)).toBe(
      true
    )
  })
})

describe('isDue — check_hour set', () => {
  it('does not run outside the preferred UTC hour', () => {
    const last = new Date(NOW.getTime() - WEEK).toISOString()
    expect(
      isDue(
        monitor({ check_frequency: 'daily', check_hour: 9, last_checked_at: last }),
        NOW // NOW is hour 15, check_hour is 9
      )
    ).toBe(false)
  })

  it('runs during the preferred UTC hour (daily, first run)', () => {
    expect(
      isDue(
        monitor({ check_frequency: 'daily', check_hour: 15, last_checked_at: null }),
        NOW
      )
    ).toBe(true)
  })

  it('does not run twice inside the same UTC hour', () => {
    const last = new Date(NOW.getTime() - 5 * 60 * 1000).toISOString() // 5 min ago, same hour
    expect(
      isDue(
        monitor({ check_frequency: 'daily', check_hour: 15, last_checked_at: last }),
        NOW
      )
    ).toBe(false)
  })

  it('runs again the following day during the same preferred hour', () => {
    const last = new Date(NOW.getTime() - DAY).toISOString() // exactly 24h ago, same UTC hour
    expect(
      isDue(
        monitor({ check_frequency: 'daily', check_hour: 15, last_checked_at: last }),
        NOW
      )
    ).toBe(true)
  })

  it('weekly with check_hour additionally requires 7 days elapsed', () => {
    const twoDaysAgoSameHour = new Date(NOW.getTime() - 2 * DAY).toISOString()
    expect(
      isDue(
        monitor({
          check_frequency: 'weekly',
          check_hour: 15,
          last_checked_at: twoDaysAgoSameHour,
        }),
        NOW
      )
    ).toBe(false)

    const sevenDaysAgoSameHour = new Date(NOW.getTime() - WEEK).toISOString()
    expect(
      isDue(
        monitor({
          check_frequency: 'weekly',
          check_hour: 15,
          last_checked_at: sevenDaysAgoSameHour,
        }),
        NOW
      )
    ).toBe(true)
  })
})

describe('isDue — check_hour null (elapsed-time only)', () => {
  it('daily needs 24 hours elapsed', () => {
    const almost = new Date(NOW.getTime() - (DAY - 1000)).toISOString()
    expect(isDue(monitor({ check_frequency: 'daily', last_checked_at: almost }), NOW)).toBe(
      false
    )

    const enough = new Date(NOW.getTime() - DAY - 1000).toISOString()
    expect(isDue(monitor({ check_frequency: 'daily', last_checked_at: enough }), NOW)).toBe(
      true
    )
  })

  it('weekly needs 7 days elapsed', () => {
    const almost = new Date(NOW.getTime() - (WEEK - 1000)).toISOString()
    expect(isDue(monitor({ check_frequency: 'weekly', last_checked_at: almost }), NOW)).toBe(
      false
    )

    const enough = new Date(NOW.getTime() - WEEK - 1000).toISOString()
    expect(isDue(monitor({ check_frequency: 'weekly', last_checked_at: enough }), NOW)).toBe(
      true
    )
  })

  it('daily/weekly always run when last_checked_at is null', () => {
    expect(isDue(monitor({ check_frequency: 'daily', last_checked_at: null }), NOW)).toBe(
      true
    )
    expect(isDue(monitor({ check_frequency: 'weekly', last_checked_at: null }), NOW)).toBe(
      true
    )
  })
})

describe('isDue — edge cases', () => {
  it('a last_checked_at in the future (clock skew) is not due', () => {
    const future = new Date(NOW.getTime() + HOUR).toISOString()
    expect(isDue(monitor({ check_frequency: 'hourly', last_checked_at: future }), NOW)).toBe(
      false
    )
    expect(isDue(monitor({ check_frequency: 'daily', last_checked_at: future }), NOW)).toBe(
      false
    )
  })

  it('an unknown check_frequency returns false (no check_hour set)', () => {
    expect(
      isDue(monitor({ check_frequency: 'fortnightly', last_checked_at: null }), NOW)
    ).toBe(false)
  })

  it('BUG-ish note: an unknown check_frequency WITH check_hour set falls through to true', () => {
    // With check_hour set, the function only special-cases 'weekly'
    // (elapsed >= WEEK); any other frequency — including a garbage/unknown
    // one — reaches the trailing `return true` once the preferred hour
    // matches and it hasn't already run this hour. Documenting current
    // behaviour, not asserting it's desirable; check_frequency is typed as
    // CheckFrequency at the DB boundary so this should be unreachable in
    // practice, but the predicate itself does not guard against it.
    expect(
      isDue(
        monitor({ check_frequency: 'fortnightly', check_hour: 15, last_checked_at: null }),
        NOW
      )
    ).toBe(true)
  })
})
