import { hashPath } from '../app/AppShell'
import { concepts } from '../data/concepts'
import { controlObjectiveById } from '../data/controls'
import { instruments } from '../data/instruments'
import { requirements } from '../data/requirements'
import type { AtlasLinks } from './core/schema'

/* Resolves a practice's Atlas links to labels and Universe deep links, using the public Atlas data. */
export type AtlasRef = { kind: string; id: string; label: string; detail?: string; href: string }

const provisions = new Map(instruments.flatMap((instrument) => instrument.provisions.map((provision) => [provision.id, { instrument, provision }] as const)))
const instrumentById = new Map(instruments.map((instrument) => [instrument.id, instrument]))
const conceptById = new Map(concepts.map((concept) => [concept.id, concept]))
const requirementById = new Map(requirements.map((requirement) => [requirement.id, requirement]))
const universe = (nodeId: string) => `/universe${hashPath(nodeId)}`

export function atlasRefs(links: Partial<AtlasLinks>): AtlasRef[] {
  const refs: AtlasRef[] = []
  for (const id of links.requirements ?? []) {
    const requirement = requirementById.get(id)
    if (requirement) refs.push({ kind: 'Requirement', id, label: requirement.title, detail: `${instrumentById.get(requirement.instrumentId)?.shortTitle ?? ''} · ${requirement.ref}`, href: universe(requirement.provisionId ? `provision:${requirement.provisionId}` : `instrument:${requirement.instrumentId}`) })
  }
  for (const id of links.sections ?? []) {
    const entry = provisions.get(id)
    if (entry) refs.push({ kind: 'Section', id, label: entry.provision.title, detail: `${entry.instrument.shortTitle} · ${entry.provision.ref}`, href: universe(`provision:${id}`) })
  }
  for (const id of links.sources ?? []) {
    const instrument = instrumentById.get(id)
    if (instrument) refs.push({ kind: 'Source', id, label: instrument.shortTitle, detail: instrument.issuer, href: universe(`instrument:${id}`) })
  }
  for (const id of links.controls ?? []) {
    const control = controlObjectiveById.get(id)
    if (control) refs.push({ kind: 'Control', id, label: control.name, detail: control.code, href: universe(`control-objective:${id}`) })
  }
  for (const id of links.concepts ?? []) {
    const concept = conceptById.get(id)
    if (concept) refs.push({ kind: 'Concept', id, label: concept.name, href: universe(`concept:${id}`) })
  }
  return refs
}
