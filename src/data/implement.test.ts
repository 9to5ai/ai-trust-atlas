import { describe, expect, it } from 'vitest'
import { controlObjectives } from './controls'
import { playbooks, tools } from './implement'
import { instrumentById } from './instruments'
import { objectById } from '../lib/workspace'

const controlIds = new Set(controlObjectives.map((control) => control.id))

describe('implementation playbooks and tools', () => {
  it('link every step to real control objectives and Atlas records', () => {
    for (const playbook of playbooks) {
      expect(playbook.steps.length, playbook.id).toBeGreaterThanOrEqual(4)
      for (const step of playbook.steps) {
        for (const id of step.controlIds) expect(controlIds.has(id), `${playbook.id}: ${id}`).toBe(true)
        for (const id of step.sourceIds) expect(objectById.has(id), `${playbook.id}: ${id}`).toBe(true)
        expect(step.artefacts.length).toBeGreaterThan(0)
      }
    }
  })
  it('lists only non-commercial tools with valid links', () => {
    for (const tool of tools) {
      expect(tool.url, tool.id).toMatch(/^https:\/\//)
      if (tool.instrumentId) expect(instrumentById.has(tool.instrumentId), tool.id).toBe(true)
      for (const id of tool.controlIds) expect(controlIds.has(id), `${tool.id}: ${id}`).toBe(true)
      expect(['Government', 'Standards body', 'Non-profit', 'Community open source']).toContain(tool.kind)
    }
  })
  it('never promises outcomes', () => {
    const text = playbooks.flatMap((playbook) => [playbook.outcome, ...playbook.steps.map((step) => step.guidance)]).join(' ').toLowerCase()
    expect(text).not.toMatch(/\b(ensures? compliance|guarantees?|makes you compliant|certif(y|ies) that)\b/)
  })
})
