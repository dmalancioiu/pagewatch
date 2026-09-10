import { describe, it, expect } from 'vitest'
import {
  aggregateStatus,
  evaluateRecency,
  safeCheck,
  type ComponentCheckResult,
  type RecencyThresholds,
} from './status'

function component(status: ComponentCheckResult['status'], name = 'Test'): ComponentCheckResult {
  return { name, status, message: `${name}: ${status}` }
}

describe('aggregateStatus', () => {
  it('reports operational when every component is operational', () => {
    expect(
      aggregateStatus([component('operational', 'Database'), component('operational', 'Storage')])
    ).toBe('operational')
  })

  it('reports degraded when one component is degraded and none are down', () => {
    expect(
      aggregateStatus([
        component('operational', 'Database'),
        component('degraded', 'Monitoring'),
        component('operational', 'Storage'),
      ])
    ).toBe('degraded')
  })

  it('reports down when one component is down, even alongside degraded ones', () => {
    expect(
      aggregateStatus([
        component('operational', 'Database'),
        component('degraded', 'Monitoring'),
        component('down', 'Storage'),
      ])
    ).toBe('down')
  })

  it('down takes precedence over degraded regardless of order', () => {
    expect(aggregateStatus([component('down'), component('degraded'), component('operational')])).toBe(
      'down'
    )
    expect(aggregateStatus([component('degraded'), component('operational'), component('down')])).toBe(
      'down'
    )
  })

  it('an empty component list is operational (nothing is failing)', () => {
    expect(aggregateStatus([])).toBe('operational')
  })
})

describe('evaluateRecency', () => {
  const thresholds: RecencyThresholds = { degradedAfterMs: 1_000, downAfterMs: 5_000 }

  it('null age (never observed) is always down', () => {
    expect(evaluateRecency(null, thresholds)).toBe('down')
  })

  it('is operational well within the degraded threshold', () => {
    expect(evaluateRecency(0, thresholds)).toBe('operational')
    expect(evaluateRecency(500, thresholds)).toBe('operational')
  })

  it('is operational exactly at the degraded boundary (inclusive)', () => {
    expect(evaluateRecency(1_000, thresholds)).toBe('operational')
  })

  it('is degraded just past the degraded boundary', () => {
    expect(evaluateRecency(1_001, thresholds)).toBe('degraded')
  })

  it('is degraded exactly at the down boundary (inclusive)', () => {
    expect(evaluateRecency(5_000, thresholds)).toBe('degraded')
  })

  it('is down just past the down boundary', () => {
    expect(evaluateRecency(5_001, thresholds)).toBe('down')
  })

  it('treats a future timestamp (negative age / clock skew) as operational, not a crash', () => {
    expect(evaluateRecency(-1_000, thresholds)).toBe('operational')
  })
})

describe('safeCheck', () => {
  it('returns the check result on success', async () => {
    const result = await safeCheck('Widget', async () => component('operational', 'Widget'))
    expect(result).toEqual(component('operational', 'Widget'))
  })

  it('reports down, not a rejection, when the check throws', async () => {
    await expect(
      safeCheck('Widget', async () => {
        throw new Error('connection string: postgres://user:pass@host/db')
      })
    ).resolves.toEqual({ name: 'Widget', status: 'down', message: 'Widget: unavailable' })
  })

  it('reports down when the check throws a non-Error value', async () => {
    await expect(
      safeCheck('Widget', async () => {
        throw 'boom'
      })
    ).resolves.toEqual({ name: 'Widget', status: 'down', message: 'Widget: unavailable' })
  })

  it('never leaks the thrown error into the reported message', async () => {
    const result = await safeCheck('Database', async () => {
      throw new Error('password authentication failed for user "admin" at 10.0.0.4:5432')
    })
    expect(result.message).toBe('Database: unavailable')
    expect(result.message).not.toContain('password')
    expect(result.message).not.toContain('10.0.0.4')
  })
})
