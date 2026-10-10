import { concepts } from '../data/concepts'
import { authorityLabels } from '../lib/labels'
import { searchSources } from '../lib/sourceSearch'
import type { Instrument } from '../types'

export function SourceSearchResults({ sources, query, onSelect }: { sources: Instrument[]; query: string; onSelect: (id: string) => void }) {
  const results = searchSources(sources, query)
  return <div className="source-search-results" aria-label="Source search results">
    <p role="status">{results.length} matching {results.length === 1 ? 'source' : 'sources'} · one entry per source</p>
    {results.map(({ source, passages }) => <article key={source.id}>
      <span className="source-search-meta">{authorityLabels[source.authorityClass]} · {source.status.replaceAll('-', ' ')}</span>
      <h3><button onClick={() => onSelect(`instrument:${source.id}`)}>{source.shortTitle}</button></h3>
      <p className="source-search-meta">{source.issuer}</p><p>{source.summary}</p>
      {!!passages.length && <details><summary>Matching sections · {passages.length}</summary>{passages.map(p => <button className="search-passage" key={p.id} onClick={() => onSelect(`provision:${p.id}`)}><strong>{p.ref} · {p.title}</strong><span>{p.summary}</span></button>)}</details>}
      <details><summary>Connected topics</summary><p className="section-boundary">Atlas mappings; these do not establish complete coverage.</p><div className="concept-chips">{source.conceptIds.map(id => { const concept = concepts.find(c => c.id === id); return concept && <button key={id} onClick={() => onSelect(`concept:${id}`)}>{concept.name}</button> })}</div></details>
    </article>)}
    {!results.length && <p>No matching sources. Try another search or broaden the filters.</p>}
  </div>
}
