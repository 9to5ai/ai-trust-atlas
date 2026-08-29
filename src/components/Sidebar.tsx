import { Atom, Funnel, MagnifyingGlass, Rows } from '@phosphor-icons/react'
import { authorityLabels, authorityOrder, regionOrder } from '../lib/labels'
import type { LayoutMode } from '../lib/graphModel'
import type { AuthorityClass, Instrument } from '../types'

type Props = {
  query: string
  onQueryChange: (query: string) => void
  layout: LayoutMode
  onLayoutChange: (layout: LayoutMode) => void
  authorityClasses: Set<AuthorityClass>
  onToggleAuthority: (authority: AuthorityClass) => void
  regions: Set<Instrument['region']>
  onToggleRegion: (region: Instrument['region']) => void
  results: Instrument[]
  onSelectInstrument: (instrumentId: string) => void
  totalInstruments: number
}

export function Sidebar({ query, onQueryChange, layout, onLayoutChange, authorityClasses, onToggleAuthority, regions, onToggleRegion, results, onSelectInstrument, totalInstruments }: Props) {
  return (
    <aside className="sidebar" aria-label="Atlas controls">
      <div className="search-wrap">
        <MagnifyingGlass aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Find an instrument or issuer"
          aria-label="Search the atlas"
        />
        {query && <kbd>{results.length}</kbd>}
      </div>

      {query && (
        <div className="search-results" aria-label="Search results">
          {results.slice(0, 8).map((instrument) => (
            <button type="button" key={instrument.id} onClick={() => onSelectInstrument(instrument.id)}>
              <strong>{instrument.shortTitle}</strong>
              <span>{instrument.issuer}</span>
            </button>
          ))}
          {results.length === 0 && <p>No matching instruments.</p>}
        </div>
      )}

      <section className="control-section">
        <div className="control-title"><Atom /> <span>Spatial logic</span></div>
        <div className="segment-control">
          <button type="button" className={layout === 'ontology' ? 'active' : ''} onClick={() => onLayoutChange('ontology')}><Atom /> Ontology</button>
          <button type="button" className={layout === 'authority' ? 'active' : ''} onClick={() => onLayoutChange('authority')}><Rows /> Authority</button>
        </div>
        <p className="control-note">Ontology groups by meaning. Authority separates legal force and reference type.</p>
      </section>

      <section className="control-section filter-section">
        <div className="control-title"><Funnel /> <span>Authority class</span><small>{authorityClasses.size || 'all'}</small></div>
        <div className="filter-list">
          {authorityOrder.map((authority) => (
            <label key={authority}>
              <input type="checkbox" checked={authorityClasses.has(authority)} onChange={() => onToggleAuthority(authority)} />
              <span>{authorityLabels[authority]}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="control-section filter-section region-filters">
        <div className="control-title"><span>Jurisdiction</span><small>{regions.size || 'all'}</small></div>
        <div className="filter-list">
          {regionOrder.map((region) => (
            <label key={region}>
              <input type="checkbox" checked={regions.has(region)} onChange={() => onToggleRegion(region)} />
              <span>{region}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="sidebar-foot">
        <strong>{results.length}</strong>
        <span>of {totalInstruments} instruments visible</span>
      </div>
    </aside>
  )
}
