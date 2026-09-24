import { describe, expect, it } from 'vitest'
import { concepts } from '../concepts'
import { controlObjectives } from '../controls'
import { crosswalkLinks, publishedCrosswalks } from '../crosswalks'
import { instruments } from '../instruments'
import { mappingAssertionById, mappingAssertions } from '../assertions'
import { requirements } from '.'

const conceptIds = new Set(concepts.map((concept) => concept.id))
const controlIds = new Set(controlObjectives.map((control) => control.id))

describe('requirement layer', () => {
  it('records valid, uniquely identified requirements tied to real sources and sections', () => {
    expect(new Set(requirements.map((item) => item.id)).size).toBe(requirements.length)
    for (const item of requirements) {
      const source = instruments.find((candidate) => candidate.id === item.instrumentId)
      expect(source, item.id).toBeTruthy()
      if (item.provisionId) expect(source?.provisions.some((section) => section.id === item.provisionId), `${item.id} → ${item.provisionId}`).toBe(true)
      expect(item.conceptIds.length, item.id).toBeGreaterThan(0)
      for (const id of item.conceptIds) expect(conceptIds.has(id), `${item.id} concept ${id}`).toBe(true)
      for (const id of item.controlIds) expect(controlIds.has(id), `${item.id} control ${id}`).toBe(true)
      expect(item.addressees.length, item.id).toBeGreaterThan(0)
      expect(item.summary.length, item.id).toBeLessThan(320)
      expect(item.sourceUrl, item.id).toMatch(/^https:\/\//)
      if (item.appliesFrom) expect(item.appliesFrom, item.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('makes a section-to-concept link source-authored when a requirement in that section states it', () => {
    for (const item of requirements.filter((requirement) => requirement.provisionId)) {
      const source = instruments.find((candidate) => candidate.id === item.instrumentId)!
      const section = source.provisions.find((candidate) => candidate.id === item.provisionId)!
      for (const conceptId of item.conceptIds) {
        const assertion = section.conceptIds.includes(conceptId)
          ? mappingAssertionById.get(`map:provision:${section.id}:concept:${conceptId}`)
          : mappingAssertionById.get(`map:requirement:${item.id}:concept:${conceptId}`)
        expect(assertion?.basis, `${item.id} ${conceptId}`).toBe('source-authored')
        expect(assertion?.predicate).toBe('requires')
      }
    }
  })

  it('links crosswalk pairs only between existing sections of a recorded crosswalk', () => {
    const crosswalkIds = new Set(publishedCrosswalks.map((item) => item.id))
    expect(new Set(crosswalkLinks.map((link) => link.id)).size).toBe(crosswalkLinks.length)
    for (const link of crosswalkLinks) {
      expect(crosswalkIds.has(link.crosswalkId), link.id).toBe(true)
      for (const end of [link.from, link.to]) {
        const source = instruments.find((candidate) => candidate.id === end.instrumentId)
        expect(source?.provisions.some((section) => section.id === end.provisionId), `${link.id} → ${end.provisionId}`).toBe(true)
      }
    }
    expect(mappingAssertions.filter((assertion) => assertion.basis === 'published-crosswalk').length).toBeGreaterThanOrEqual(crosswalkLinks.length)
  })
})
