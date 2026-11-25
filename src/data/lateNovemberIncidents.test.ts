import { describe, it, expect } from 'vitest'
import { incidents, incidentQuestion } from './incidents'
import { inDateWindow } from './developments'

describe('approved November inference incidents', () => {
 it('uses disclosure dates for discovery without inventing occurrence dates', () => {
  const together = incidents.find(x => x.id === 'together-prompt-sample-theft-2026')!
  const novita = incidents.find(x => x.id === 'novita-minimax-routing-2026')!
  expect(together.occurred).toContain('undisclosed')
  expect(together.updated).toBe('2026-11-21')
  expect(novita.updated).toBe('2026-11-22')
  expect(inDateWindow(together.updated, 30, '2026-11-25')).toBe(true)
  expect(novita.limitations).toContain('Malicious theft')
  for (const item of [together, novita]) for (const role of ['board','executive','regulator','assurance'] as const) {
   expect(incidentQuestion(item, role).text).toBe(item.prompts[role]!.text)
  }
 })
})
