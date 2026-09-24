import MiniSearch from 'minisearch'
import { concepts, domains } from '../../src/data/concepts'
import { controlFamilies, controlObjectives } from '../../src/data/controls'
import { developments } from '../../src/data/developments'
import { incidents } from '../../src/data/incidents'
import { instruments } from '../../src/data/instruments'
import { riskDomains, riskSubdomains } from '../../src/data/mitRiskTaxonomy'
import { relations } from '../../src/data/relations'
import { timelineEvents } from '../../src/data/timeline'
import { useCases } from '../../src/data/useCases'
import { authorityLabels, relationLabels } from '../../src/lib/labels'
import { searchAliases } from '../../src/lib/workspace'

/*
 * Retrieval corpus for Ask the Atlas, assembled from the same reviewed data
 * the app renders. Each chunk's id is a citable Atlas node id that the client
 * can deep-link, so the model can only point at real records.
 */
export type Chunk = { id: string; kind: string; title: string; text: string; url?: string; draft?: boolean; interpretation?: boolean }

const instrumentTitle = new Map(instruments.map((instrument) => [instrument.id, instrument.shortTitle]))

const instrumentChunks: Chunk[] = instruments.map((instrument) => {
  const related = relations.filter((relation) => relation.sourceId === instrument.id || relation.targetId === instrument.id).map((relation) => relation.sourceId === instrument.id ? `${relationLabels[relation.type]} ${instrumentTitle.get(relation.targetId)}` : `${instrumentTitle.get(relation.sourceId)} ${relationLabels[relation.type].toLowerCase()} this source`)
  const dates = timelineEvents.filter((event) => event.instrumentId === instrument.id && event.kind !== 'development').map((event) => `${event.date}: ${event.title}`)
  const news = developments.filter((item) => item.sourceId === instrument.id).map((item) => `${item.published} development: ${item.title}. ${item.implication}`)
  return {
    id: `instrument:${instrument.id}`,
    kind: 'Source',
    title: `${instrument.shortTitle} — ${instrument.title}`,
    text: [`${authorityLabels[instrument.authorityClass]} issued by ${instrument.issuer} (${instrument.jurisdiction}). Status: ${instrument.status}. Published ${instrument.published}${instrument.effective ? `; effective ${instrument.effective}` : ''}.`, instrument.summary, `Applicability: ${instrument.applicability}`, `Authority: ${instrument.authorityNote}`, related.length ? `Related: ${related.join('; ')}.` : '', dates.length ? `Key dates: ${dates.join('; ')}.` : '', ...news].filter(Boolean).join(' '),
    url: instrument.officialUrl,
    draft: instrument.editorialStatus === 'draft',
  }
})

const provisionChunks: Chunk[] = instruments.flatMap((instrument) => instrument.provisions.map((provision) => ({
  id: `provision:${provision.id}`,
  kind: 'Section',
  title: `${instrument.shortTitle} ${provision.ref} — ${provision.title}`,
  text: [provision.summary, provision.note ?? ''].filter(Boolean).join(' '),
  url: provision.sourceUrl ?? instrument.officialUrl,
  draft: provision.editorialStatus === 'draft',
})))

const conceptChunks: Chunk[] = concepts.map((concept) => ({ id: `concept:${concept.id}`, kind: 'Trust concept', title: concept.name, text: `${concept.definition} Theme: ${domains.find((domain) => domain.id === concept.domainId)?.name}.`, interpretation: true }))
const domainChunks: Chunk[] = domains.map((domain) => ({ id: `domain:${domain.id}`, kind: 'Trust theme', title: domain.name, text: domain.definition, interpretation: true }))
const controlChunks: Chunk[] = controlObjectives.map((control) => ({
  id: `control-objective:${control.id}`,
  kind: 'Candidate control objective',
  title: `${control.code} ${control.name}`,
  text: `${control.objective} Purpose: ${control.purpose} Family: ${controlFamilies.find((family) => family.id === control.familyId)?.name}. Implementation examples: ${control.implementationExamples.join('; ')}. Evidence examples: ${control.evidenceExamples.join('; ')}.`,
  interpretation: true,
}))
const riskChunks: Chunk[] = [
  ...riskDomains.map((risk) => ({ id: `risk-domain:${risk.id}`, kind: 'MIT risk domain', title: risk.name, text: risk.definition })),
  ...riskSubdomains.map((risk) => ({ id: `risk-subdomain:${risk.id}`, kind: 'MIT risk type', title: `${risk.ref} ${risk.name}`, text: risk.definition })),
]
const caseChunks: Chunk[] = [
  ...useCases.map((item) => ({ id: `use-case:${item.id}`, kind: 'Production use case (company-reported)', title: `${item.company} — ${item.title}`, text: `${item.summary} Reported value: ${item.value} Limitations: ${item.limitations}` })),
  ...incidents.map((item) => ({ id: `incident:${item.id}`, kind: 'Incident', title: item.title, text: item.summary })),
]

export const chunks: Chunk[] = [...instrumentChunks, ...provisionChunks, ...conceptChunks, ...domainChunks, ...controlChunks, ...riskChunks, ...caseChunks]
export const chunkById = new Map(chunks.map((chunk) => [chunk.id, chunk]))

const index = new MiniSearch<Chunk>({ fields: ['title', 'text', 'kind'], storeFields: ['id'], searchOptions: { boost: { title: 3, kind: 0.5 }, fuzzy: 0.15, prefix: true, combineWith: 'OR' } })
index.addAll(chunks)

const stopwords = new Set(['what', 'how', 'do', 'does', 'the', 'a', 'an', 'we', 'our', 'can', 'should', 'to', 'ask', 'about', 'is', 'are', 'i', 'of', 'for', 'in', 'on', 'and', 'or', 'with', 'my', 'me', 'us', 'which', 'who', 'when', 'why', 'tell'])

/* Top records for a question, within a character budget for the prompt. */
export function retrieve(question: string, limit = 24, budget = 26000): Chunk[] {
  let expanded = question.toLowerCase()
  for (const [pattern, replacement] of searchAliases) expanded = expanded.replace(pattern, ` ${replacement} `)
  const terms = expanded.replace(/[^a-z0-9./ -]+/g, ' ').split(/\s+/).filter((term) => term && !stopwords.has(term))
  if (!terms.length) return []
  const results = index.search(terms.join(' '))
  const picked: Chunk[] = []
  let used = 0
  for (const result of results) {
    const chunk = chunkById.get(result.id as string)
    if (!chunk) continue
    const size = chunk.title.length + chunk.text.length + 40
    if (used + size > budget) continue
    picked.push(chunk)
    used += size
    if (picked.length >= limit) break
  }
  return picked
}

/* A compact map of the Atlas so the model can suggest where to look. */
export const atlasMap = [
  `The Atlas holds ${instruments.length} sources, ${concepts.length} trust concepts in ${domains.length} themes, ${riskSubdomains.length} MIT risk types and ${controlObjectives.length} candidate control objectives.`,
  `Themes: ${domains.map((domain) => domain.name).join('; ')}.`,
  'Areas: Universe (map), Library (sources), Questions (role-based questions), Use cases.',
].join(' ')
