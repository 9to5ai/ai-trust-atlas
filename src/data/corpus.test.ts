import { describe, expect, it } from 'vitest'
import { concepts, domains } from './concepts'
import { mappingAssertions, riskPathsForInstrument } from './assertions'
import { controlFamilies, controlObjectives } from './controls'
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
      expect(instrument.provisions.length, instrument.id).toBeGreaterThan(0)
    }
  })

  it('resolves all instrument and source-provision concept references', () => {
    const conceptIds = new Set(concepts.map((concept) => concept.id))
    for (const instrument of instruments) {
      for (const conceptId of instrument.conceptIds) expect(conceptIds.has(conceptId), `${instrument.id}:${conceptId}`).toBe(true)
      for (const provision of instrument.provisions) {
        for (const conceptId of provision.conceptIds) expect(conceptIds.has(conceptId), `${provision.id}:${conceptId}`).toBe(true)
      }
    }
  })

  it('uses original synopses instead of licensed standards text', () => {
    const licensed = instruments.filter((instrument) => instrument.detailAvailability === 'licensed-standard')
    expect(licensed.length).toBeGreaterThan(0)
    for (const instrument of licensed) {
      expect(instrument.applicability.toLowerCase(), instrument.id).toContain('licensed')
      for (const provision of instrument.provisions) expect(provision.summary.length, provision.id).toBeLessThan(360)
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

  it('keeps domain and concept roles explicit instead of mixing ontological levels silently', () => {
    expect(domains.filter((domain) => domain.role === 'trust-outcome')).toHaveLength(5)
    expect(domains.filter((domain) => domain.role === 'governance-capability')).toHaveLength(5)
    expect(domains.filter((domain) => domain.role === 'context-facet')).toHaveLength(2)
    expect(concepts.every((concept) => Boolean(concept.role))).toBe(true)
  })

  it('validates the neutral control spine and every source mapping', () => {
    expect(controlFamilies).toHaveLength(6)
    expect(controlObjectives).toHaveLength(24)
    expect(duplicates(controlObjectives.map((control) => control.id))).toEqual([])
    expect(duplicates(controlObjectives.map((control) => control.code))).toEqual([])
    const conceptIds = new Set(concepts.map((concept) => concept.id))
    const riskIds = new Set(riskSubdomains.map((risk) => risk.id))
    const instrumentIds = new Set(instruments.map((instrument) => instrument.id))
    const familyIds = new Set(controlFamilies.map((family) => family.id))
    for (const control of controlObjectives) {
      expect(familyIds.has(control.familyId), control.id).toBe(true)
      expect(control.conceptIds.length, control.id).toBeGreaterThan(0)
      expect(control.riskIds.length, control.id).toBeGreaterThan(0)
      expect(control.sourceRefs.length, control.id).toBeGreaterThan(1)
      expect(control.implementationExamples.length, control.id).toBeGreaterThan(1)
      expect(control.evidenceExamples.length, control.id).toBeGreaterThan(1)
      for (const conceptId of control.conceptIds) expect(conceptIds.has(conceptId), `${control.id}:${conceptId}`).toBe(true)
      for (const riskId of control.riskIds) expect(riskIds.has(riskId), `${control.id}:${riskId}`).toBe(true)
      for (const source of control.sourceRefs) {
        expect(instrumentIds.has(source.instrumentId), `${control.id}:${source.instrumentId}`).toBe(true)
        expect(source.url).toMatch(/^https:\/\//)
      }
    }
  })

  it('uses unique, typed and inspectable mapping assertions', () => {
    expect(duplicates(mappingAssertions.map((assertion) => assertion.id))).toEqual([])
    expect(mappingAssertions.length).toBeGreaterThan(700)
    for (const assertion of mappingAssertions) {
      expect(assertion.rationale.length, assertion.id).toBeGreaterThan(20)
      expect(assertion.verifiedAt, assertion.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(['source-authored', 'published-crosswalk', 'atlas-synthesis']).toContain(assertion.basis)
      expect(['high', 'medium']).toContain(assertion.confidence)
      if (!assertion.id.startsWith('map:domain:')) expect(assertion.citations.length, assertion.id).toBeGreaterThan(0)
    }
    expect(mappingAssertions.some((assertion) => assertion.sourceNodeId.startsWith('instrument:') && assertion.targetNodeId.startsWith('risk-subdomain:'))).toBe(false)
  })

  it('makes inferred instrument-risk paths explicit and ranked', () => {
    const paths = riskPathsForInstrument('apra-cps-234')
    expect(paths.length).toBeGreaterThan(0)
    expect(paths.every((path) => path.conceptIds.length > 0)).toBe(true)
    expect(paths.every((path, index) => index === 0 || paths[index - 1]!.score >= path.score)).toBe(true)
  })
})
