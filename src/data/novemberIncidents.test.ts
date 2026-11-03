import { expect, it } from 'vitest'
import { novemberIncidents } from './novemberIncidents'
import { domains } from './concepts'
import { incidentQuestion } from './incidents'
it('preserves event dates and evidence limits for approved November additions', () => {
 expect(novemberIncidents[0].occurred).toBe('27 August–9 September 2026')
 expect(novemberIncidents[0].findings[0].text).toContain('not 155 customers')
 expect(novemberIncidents[1].occurred).toContain('not established')
 for (const incident of novemberIncidents) {
  for (const topic of incident.topics) expect(domains.some(d => d.id === topic)).toBe(true)
  for (const role of ['board','executive','regulator','assurance'] as const) expect(incidentQuestion(incident,role).text).toBe(incident.prompts[role]!.text)
 }
})
