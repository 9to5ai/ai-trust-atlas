import { instruments } from '../src/data/instruments'
import { timelineEvents } from '../src/data/timeline'

/*
 * Build gate for editorial content. Fails on broken references or on draft
 * records that use conclusive language; reports how much drafted material is
 * still awaiting human review.
 */
const errors: string[] = []
const provisionIds = new Set(instruments.flatMap((instrument) => instrument.provisions.map((provision) => provision.id)))
const instrumentIds = new Set(instruments.map((instrument) => instrument.id))

for (const event of timelineEvents) {
  if (event.instrumentId && !instrumentIds.has(event.instrumentId)) errors.push(`${event.id}: unknown source ${event.instrumentId}`)
  for (const provision of event.provisionIds ?? []) if (!provisionIds.has(provision)) errors.push(`${event.id}: unknown provision ${provision}`)
}
const forbidden = /\b(ensures compliance|is compliant|proves|guarantees|certifies that)\b/i
for (const instrument of instruments) for (const provision of instrument.provisions) if (provision.editorialStatus === 'draft' && forbidden.test(provision.summary)) errors.push(`${provision.id}: draft summary uses conclusive language`)

if (errors.length) {
  console.error(`Content gates failed:\n- ${errors.join('\n- ')}`)
  process.exit(1)
}

const draftSources = instruments.filter((instrument) => instrument.editorialStatus === 'draft').length
const draftSections = instruments.flatMap((instrument) => instrument.provisions).filter((provision) => provision.editorialStatus === 'draft').length
const draftEvents = timelineEvents.filter((event) => event.editorialStatus === 'draft').length
console.log(`Content gates passed. Awaiting editorial review: ${draftSources} sources, ${draftSections} sections, ${draftEvents} dated events.`)
