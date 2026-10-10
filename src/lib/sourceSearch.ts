import type { Instrument } from '../types'

/** Search each source once, retaining matching passages without expanding the ontology. */
export function searchSources(sources: Instrument[], query: string) {
  const q = query.trim().toLocaleLowerCase()
  return sources.flatMap(source => {
    const passages = source.provisions.filter(p => `${p.ref} ${p.title} ${p.summary}`.toLocaleLowerCase().includes(q))
    const matches = [source.title, source.shortTitle, source.issuer, source.jurisdiction, source.summary, ...source.sectors].join(' ').toLocaleLowerCase().includes(q)
    return matches || passages.length ? [{ source, passages }] : []
  }).sort((a, b) => a.source.shortTitle.localeCompare(b.source.shortTitle))
}
