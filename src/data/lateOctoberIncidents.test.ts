import { describe, it, expect } from 'vitest'
import { lateOctoberIncidents } from './lateOctoberIncidents'
import { domains } from './concepts'
import { incidentQuestion, incidentsForNode } from './incidents'

describe('approved late October incident boundaries', () => {
 it('preserves source update dates separately from approval and review', () => {
  expect(lateOctoberIncidents.map(i => i.updated)).toEqual(['2026-10-30', '2026-10-30', '2026-10-26'])
  expect(lateOctoberIncidents.map(i => i.reviewed)).toEqual(['2026-11-03', '2026-11-03', '2026-10-28'])
  expect(lateOctoberIncidents[1].limitations).toContain('distinct from the South Korean finance case')
  expect(lateOctoberIncidents[2].limitations).toContain('provider assessments')
 })
 it('connects each incident to valid topics, controls and all audience questions', () => {
  for (const item of lateOctoberIncidents) {
   for (const topic of item.topics) expect(domains.some(d => d.id === topic)).toBe(true)
   for (const c of item.connections) expect(incidentsForNode('control-objective', c.controlId)).toContainEqual(item)
   for (const role of ['board', 'executive', 'regulator', 'assurance'] as const) {
    expect(incidentQuestion(item, role).text).toBe(item.prompts[role]!.text)
   }
  }
 })
})
