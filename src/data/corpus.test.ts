import { describe, expect, it } from 'vitest'
import { concepts, domains } from './concepts'
import { instruments } from './instruments'
import { mappedRiskRecordCount, riskDomains, riskSubdomains } from './mitRiskTaxonomy'
import { relations } from './relations'

const duplicates = (values: string[]) => values.filter((value, index) => values.indexOf(value) !== index)

describe('AI Trust Atlas corpus', () => {
  it('has a substantial, uniquely identified public-source corpus', () => {
    expect(instruments.length).toBeGreaterThanOrEqual(50)
    expect(duplicates(instruments.map((instrument) => instrument.id))).toEqual([])
    expect(duplicates(concepts.map((concept) => concept.id))).toEqual([])
    expect(duplicates(domains.map((domain) => domain.id))).toEqual([])
  })

  it('keeps every instrument traceable to a current official source', () => {
    for (const instrument of instruments) {
      expect(instrument.officialUrl, instrument.id).toMatch(/^https:\/\//)
      expect(instrument.lastVerified, instrument.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(instrument.summary.length, instrument.id).toBeGreaterThan(30)
      expect(instrument.applicability.length, instrument.id).toBeGreaterThan(20)
      expect(instrument.conceptIds.length, instrument.id).toBeGreaterThan(0)
      expect(instrument.clauses.length, instrument.id).toBeGreaterThan(0)
    }
  })

  it('resolves all instrument and clause concept references', () => {
    const conceptIds = new Set(concepts.map((concept) => concept.id))
    for (const instrument of instruments) {
      for (const conceptId of instrument.conceptIds) expect(conceptIds.has(conceptId), `${instrument.id}:${conceptId}`).toBe(true)
      for (const clause of instrument.clauses) {
        for (const conceptId of clause.conceptIds) expect(conceptIds.has(conceptId), `${clause.id}:${conceptId}`).toBe(true)
      }
    }
  })

  it('uses original synopses instead of licensed standards text', () => {
    const licensed = instruments.filter((instrument) => instrument.detailAvailability === 'licensed-standard')
    expect(licensed.length).toBeGreaterThan(0)
    for (const instrument of licensed) {
      expect(instrument.applicability.toLowerCase(), instrument.id).toContain('licensed')
      for (const clause of instrument.clauses) expect(clause.summary.length, clause.id).toBeLessThan(360)
    }
  })

  it('keeps relationships valid, explained and epistemically labelled', () => {
    const instrumentIds = new Set(instruments.map((instrument) => instrument.id))
    expect(duplicates(relations.map((relation) => relation.id))).toEqual([])
    for (const relation of relations) {
      expect(instrumentIds.has(relation.sourceId), relation.id).toBe(true)
      expect(instrumentIds.has(relation.targetId), relation.id).toBe(true)
      expect(relation.sourceId, relation.id).not.toBe(relation.targetId)
      expect(relation.explanation.length, relation.id).toBeGreaterThan(30)
      expect(relation.sourceAnchors.length, relation.id).toBeGreaterThan(0)
      expect(['explicit', 'cross-framework-synthesis']).toContain(relation.basis)
      expect(['high', 'medium']).toContain(relation.confidence)
    }
  })

  it('keeps the MIT risk taxonomy complete, traceable and distinct from Atlas synthesis', () => {
    expect(riskDomains).toHaveLength(7)
    expect(riskSubdomains).toHaveLength(24)
    expect(mappedRiskRecordCount).toBe(1511)
    expect(duplicates(riskDomains.map((domain) => domain.id))).toEqual([])
    expect(duplicates(riskSubdomains.map((subdomain) => subdomain.id))).toEqual([])

    const domainIds = new Set(riskDomains.map((domain) => domain.id))
    const conceptIds = new Set(concepts.map((concept) => concept.id))
    for (const risk of riskSubdomains) {
      expect(domainIds.has(risk.riskDomainId), risk.id).toBe(true)
      expect(risk.recordCount, risk.id).toBeGreaterThan(0)
      expect(risk.mappingBasis, risk.id).toBe('atlas-synthesis')
      expect(risk.conceptIds.length, risk.id).toBeGreaterThan(0)
      for (const conceptId of risk.conceptIds) expect(conceptIds.has(conceptId), `${risk.id}:${conceptId}`).toBe(true)
    }
  })
})
