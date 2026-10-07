import { describe, expect, it } from 'vitest'
import { instruments } from './instruments'
import { requirementsForSource } from './requirements'

describe('MAS final-guideline transition', () => {
  it('preserves shared IDs while replacing draft references and separating implementation dates', () => {
    const source = instruments.find(item => item.id === 'mas-airm-guidelines-cp')!
    expect(source).toMatchObject({ status: 'future-effective', legalEffect: 'supervisory-expectation', published: '2026-10-07' })
    expect(source.supersedes?.[0].title).toContain('P017-2025')
    expect(source.provisions.every(item => !/proposed/i.test(item.ref + item.summary))).toBe(true)
    const requirements = requirementsForSource(source.id)
    expect(requirements).toHaveLength(7)
    for (const item of requirements) {
      const lifecycle = ['req-mas-airm-independent-validation', 'req-mas-airm-monitoring'].includes(item.id)
      expect(item.appliesFrom).toBe(lifecycle ? '2028-10-07' : '2027-10-07')
      expect(item.sourceUrl).not.toContain('/consultations/')
      expect(item.ref).toContain('Final Guidelines')
    }
    expect(requirements.find(item => item.id === 'req-mas-airm-basic-policies')?.summary).toContain('meeting paragraph 2.3')
  })
})
