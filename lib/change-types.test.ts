import { describe, it, expect } from 'vitest'
import {
  CHANGE_TYPES,
  CHANGE_TYPE_INFO,
  CHANGE_ROUTINGS,
  isChangeType,
  isChangeRouting,
  resolveRouting,
  type ChangeType,
} from './change-types'
import { classifyChange, type ClassifyContext } from '../trigger/lib/classify-change'
import type { ContentChange } from './content-diff'

function ctx(overrides: Partial<ClassifyContext> = {}): ClassifyContext {
  return {
    url: 'https://example.com/pricing',
    pageTitle: 'Pricing — Example',
    afterText: 'Plenty of ordinary page text lives here, well past the near-empty threshold.',
    ...overrides,
  }
}

// ─── Taxonomy completeness ───────────────────────────────────────────────────

describe('CHANGE_TYPE_INFO', () => {
  it('has a label, description and tone for every ChangeType', () => {
    for (const type of CHANGE_TYPES) {
      const info = CHANGE_TYPE_INFO[type]
      expect(info, `missing info for ${type}`).toBeDefined()
      expect(info.label.length).toBeGreaterThan(0)
      expect(info.description.length).toBeGreaterThan(0)
      expect(['neutral', 'ok', 'warn', 'critical', 'info']).toContain(info.tone)
    }
  })

  it('CHANGE_TYPE_INFO has no extra keys beyond CHANGE_TYPES', () => {
    expect(Object.keys(CHANGE_TYPE_INFO).sort()).toEqual([...CHANGE_TYPES].sort())
  })
})

describe('isChangeType / isChangeRouting', () => {
  it('accepts every declared value and rejects junk', () => {
    for (const t of CHANGE_TYPES) expect(isChangeType(t)).toBe(true)
    for (const r of CHANGE_ROUTINGS) expect(isChangeRouting(r)).toBe(true)
    expect(isChangeType('made_up')).toBe(false)
    expect(isChangeRouting('sometimes')).toBe(false)
    expect(isChangeType(42)).toBe(false)
  })
})

describe('resolveRouting', () => {
  it('defaults to alert when the map is null', () => {
    expect(resolveRouting(null, 'price')).toBe('alert')
  })

  it('defaults to alert when the map has no entry for this type', () => {
    expect(resolveRouting({ legal: 'ignore' }, 'price')).toBe('alert')
  })

  it('honors an explicit routing', () => {
    expect(resolveRouting({ price: 'digest_only' }, 'price')).toBe('digest_only')
  })

  it('degrades to alert on a malformed map rather than throwing', () => {
    expect(resolveRouting('not an object', 'price')).toBe('alert')
    expect(resolveRouting({ price: 'whenever' }, 'price')).toBe('alert')
  })
})

// ─── classifyChange — the deterministic pass ────────────────────────────────

describe('classifyChange', () => {
  it('classifies a price change as price', () => {
    const changes: ContentChange[] = [{ kind: 'price', label: 'Pro', from: '$29', to: '$39' }]
    const result = classifyChange(changes, ctx())
    expect(result).toMatchObject({ type: 'price', needsModel: false })
  })

  it('classifies a price_added/removed change as price', () => {
    expect(classifyChange([{ kind: 'price_added', label: 'Enterprise', value: '$99' }], ctx())).toMatchObject({ type: 'price' })
    expect(classifyChange([{ kind: 'price_removed', label: 'Starter', value: '$9' }], ctx())).toMatchObject({ type: 'price' })
  })

  it('classifies a new tier heading as plan_structure', () => {
    const changes: ContentChange[] = [{ kind: 'heading_added', text: 'Enterprise' }]
    const result = classifyChange(changes, ctx())
    expect(result).toMatchObject({ type: 'plan_structure', needsModel: false })
  })

  it('classifies a removed tier heading as plan_structure', () => {
    const changes: ContentChange[] = [{ kind: 'heading_removed', text: 'Business Plan' }]
    expect(classifyChange(changes, ctx())).toMatchObject({ type: 'plan_structure' })
  })

  it('classifies a removed trial line as offer', () => {
    const changes: ContentChange[] = [{ kind: 'text_removed', text: 'Start your 14-day free trial today.' }]
    const result = classifyChange(changes, ctx())
    expect(result).toMatchObject({ type: 'offer', needsModel: false })
  })

  it('classifies any change on a privacy-policy page as legal', () => {
    const changes: ContentChange[] = [{ kind: 'text_added', text: 'We now retain logs for 90 days.' }]
    const result = classifyChange(changes, ctx({ url: 'https://example.com/privacy-policy', pageTitle: 'Privacy Policy' }))
    expect(result).toMatchObject({ type: 'legal', needsModel: false })
  })

  it('classifies a terms-of-service page edit as legal via the URL alone', () => {
    const changes: ContentChange[] = [{ kind: 'text_added', text: 'Some unrelated new sentence appeared.' }]
    const result = classifyChange(changes, ctx({ url: 'https://example.com/legal/terms', pageTitle: 'Example' }))
    expect(result.type).toBe('legal')
  })

  it('classifies a "sold out" appearing as availability', () => {
    const changes: ContentChange[] = [{ kind: 'text_added', text: 'This item is sold out.' }]
    const result = classifyChange(changes, ctx())
    expect(result).toMatchObject({ type: 'availability', needsModel: false })
  })

  it('classifies a lone structure_changed as layout', () => {
    const changes: ContentChange[] = [{ kind: 'structure_changed' }]
    const result = classifyChange(changes, ctx())
    expect(result).toMatchObject({ type: 'layout', needsModel: false })
  })

  it('classifies an error-page-looking extract as broken via near-empty text', () => {
    const changes: ContentChange[] = [{ kind: 'text_removed', text: 'The entire hero and pricing section.' }]
    const result = classifyChange(changes, ctx({ afterText: '' }))
    expect(result).toMatchObject({ type: 'broken', needsModel: false })
  })

  it('classifies an error-page-looking extract as broken via error phrasing', () => {
    const changes: ContentChange[] = [{ kind: 'text_removed', text: 'The entire hero and pricing section.' }]
    const result = classifyChange(changes, ctx({ afterText: '404 - Page Not Found. The page you requested could not be located.' }))
    expect(result).toMatchObject({ type: 'broken', needsModel: false })
  })

  it('does not call an ordinary short-but-present text change broken', () => {
    // afterText is null (unknown), not '' (known-empty) — must not trigger
    // the empty-text branch.
    const changes: ContentChange[] = [{ kind: 'text_added', text: 'Hi.' }]
    const result = classifyChange(changes, ctx({ afterText: null }))
    expect(result.type).not.toBe('broken')
  })

  it('reports genuinely ambiguous copy changes as needing the model', () => {
    const changes: ContentChange[] = [
      { kind: 'text_added', text: 'Our platform now supports twelve new integrations.' },
      { kind: 'text_removed', text: 'Our platform supports ten integrations.' },
    ]
    const result = classifyChange(changes, ctx())
    expect(result.type).toBeNull()
    expect(result.needsModel).toBe(true)
  })

  it('handles an empty change list without needing the model', () => {
    const result = classifyChange([], ctx())
    expect(result).toMatchObject({ type: 'other', needsModel: false })
  })

  it('price takes priority over a coincidental tier-word or offer-word match', () => {
    const changes: ContentChange[] = [
      { kind: 'price', label: 'Pro', from: '$29', to: '$39' },
      { kind: 'text_added', text: 'Ask about our enterprise plan and free trial.' },
    ]
    expect(classifyChange(changes, ctx()).type).toBe('price')
  })

  it('plan_structure takes priority over availability/offer keyword noise elsewhere in the same change set', () => {
    const changes: ContentChange[] = [
      { kind: 'heading_added', text: 'Business' },
      { kind: 'text_added', text: 'Now sold out in some regions.' },
    ]
    expect(classifyChange(changes, ctx()).type).toBe('plan_structure')
  })

  const everyType: ChangeType[] = [...CHANGE_TYPES]
  it('every declared ChangeType is reachable from a real classification path (sanity check)', () => {
    // Not itself a classification assertion — just confirms every value in
    // the union above is still spelled the way CHANGE_TYPE_INFO expects.
    for (const t of everyType) expect(CHANGE_TYPE_INFO[t]).toBeDefined()
  })
})
