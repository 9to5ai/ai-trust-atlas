import { citationSource, type AtlasLinks, type Practice, type Source } from './schema'

/*
 * Cross-record checks the schema can't express: references between practices, citations,
 * Atlas links and the quality bar a practice must meet before an editor may approve it.
 */
export type AtlasIdSets = { controls: Set<string>; sections: Set<string>; sources: Set<string>; concepts: Set<string>; requirements: Set<string> }
export type Finding = { practice?: string; message: string }

export function validateCorpus(practices: Practice[], sources: Source[], atlas?: AtlasIdSets) {
  const errors: Finding[] = []
  const warnings: Finding[] = []
  const ids = new Set<string>()
  const sourceIds = new Set(sources.map((source) => source.id))
  const seenSources = new Set<string>()
  for (const source of sources) {
    if (seenSources.has(source.id)) errors.push({ message: `Duplicate source ${source.id}` })
    seenSources.add(source.id)
    if (atlas && source.atlasSource && !atlas.sources.has(source.atlasSource)) errors.push({ message: `Source ${source.id}: unknown Atlas source ${source.atlasSource}` })
  }

  for (const practice of practices) {
    const error = (message: string) => errors.push({ practice: practice.id, message })
    if (ids.has(practice.id)) error('duplicate practice ID')
    ids.add(practice.id)

    for (const id of citedSourceIds(practice)) if (!sourceIds.has(id)) error(`unknown source ${id}`)

    const checkpointIds = new Set(practice.checkpoints.map((checkpoint) => checkpoint.id))
    for (const id of practice.agent.stopAt) if (!checkpointIds.has(id)) error(`agent.stopAt refers to missing checkpoint ${id}`)
    const stepIds = [...practice.steps.foundations, ...practice.steps.implementation].map((step) => step.id)
    if (new Set(stepIds).size !== stepIds.length) error('duplicate step IDs')
    if (practice.steps.foundations.some((step) => !step.id.startsWith('F')) || practice.steps.implementation.some((step) => !step.id.startsWith('I'))) error('Foundations steps use F ids and Implementation steps use I ids')
    const [latest] = [...practice.changelog].sort((a, b) => compareVersions(b.version, a.version))
    if (latest.version !== practice.version) error(`version ${practice.version} has no changelog entry (latest is ${latest.version})`)

    if (atlas) {
      const links: Partial<AtlasLinks>[] = [practice.atlas, ...practice.australia.obligations.map((item) => item.atlas ?? {})]
      for (const set of links) for (const kind of ['controls', 'sections', 'sources', 'concepts', 'requirements'] as const) {
        for (const id of set[kind] ?? []) if (!atlas[kind].has(id)) error(`unknown Atlas ${kind.slice(0, -1)} ${id}`)
      }
    }

    if (practice.status === 'approved') for (const gap of qualityGaps(practice)) error(`approved but ${gap}`)
  }

  for (const practice of practices) for (const prerequisite of practice.prerequisites) {
    if (!ids.has(prerequisite)) warnings.push({ practice: practice.id, message: `prerequisite ${prerequisite} is not in this corpus` })
  }
  const cycle = findCycle(practices)
  if (cycle) errors.push({ message: `Prerequisite cycle: ${cycle.join(' → ')}` })
  return { errors, warnings }
}

/* Every source ID a practice cites, in steps, the Australian panel and its own source list. */
export function citedSourceIds(practice: Practice) {
  return new Set([
    ...practice.steps.foundations, ...practice.steps.implementation,
    ...practice.australia.obligations, ...practice.australia.sectorNotes, ...practice.australia.keyDates,
  ].flatMap((item) => item.sources).concat(practice.sources).map(citationSource))
}

/* The spec's quality bar for going live. Drafts may have gaps; approved practices may not. */
export function qualityGaps(practice: Practice): string[] {
  const gaps: string[] = []
  const prompts = Object.entries(practice.prompts)
  const untested = prompts.filter(([, prompt]) => new Set(prompt.testedIn.map((entry) => entry.tool.toLowerCase())).size < 2).map(([type]) => type)
  if (untested.length) gaps.push(`prompts not tested in two AI tools: ${untested.join(', ')}`)
  if (practice.wave === 1 && !practice.practitionerReview) gaps.push('no external practitioner read-through recorded')
  if (!practice.lastReviewed) gaps.push('no editor review date')
  return gaps
}

export function compareVersions(a: string, b: string) {
  const [x, y] = [a.split('.').map(Number), b.split('.').map(Number)]
  for (let index = 0; index < 3; index++) if (x[index] !== y[index]) return x[index] - y[index]
  return 0
}

function findCycle(practices: Practice[]): string[] | undefined {
  const byId = new Map(practices.map((practice) => [practice.id, practice]))
  const state = new Map<string, 'visiting' | 'done'>()
  const path: string[] = []
  const visit = (id: string): string[] | undefined => {
    if (state.get(id) === 'done') return undefined
    if (state.get(id) === 'visiting') return [...path.slice(path.indexOf(id)), id]
    state.set(id, 'visiting')
    path.push(id)
    for (const next of byId.get(id)?.prerequisites ?? []) { if (byId.has(next)) { const found = visit(next); if (found) return found } }
    path.pop()
    state.set(id, 'done')
    return undefined
  }
  for (const practice of practices) { const found = visit(practice.id); if (found) return found }
  return undefined
}
