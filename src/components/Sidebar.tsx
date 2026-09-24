import { Atom, Compass, Funnel, MagnifyingGlass, ShieldCheck, WarningDiamond } from '@phosphor-icons/react'
import { tours } from '../data/tours'
import { authorityLabels, authorityOrder, regionOrder } from '../lib/labels'
import type { LayoutMode } from '../lib/graphModel'
import type { AuthorityClass, ControlObjective, Instrument, RiskSubdomain } from '../types'

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
  riskResults: RiskSubdomain[]
  controlResults: ControlObjective[]
  onSelectRisk: (riskSubdomainId: string) => void
  onSelectControl: (controlId: string) => void
  onStartTour: (tourId: string) => void
}

export function Sidebar({ query, onQueryChange, layout, onLayoutChange, authorityClasses, onToggleAuthority, regions, onToggleRegion, results, onSelectInstrument, riskResults, controlResults, onSelectRisk, onSelectControl, onStartTour }: Props) {
  const isRiskView = layout === 'risk'
  const isControlView = layout === 'controls'
  const resultCount = isRiskView ? riskResults.length : isControlView ? controlResults.length : results.length
  const placeholder = isRiskView ? 'Search risks' : isControlView ? 'Search controls' : 'Search sources'

  return (
    <aside className="sidebar" aria-label="Atlas controls">
      <div className="search-wrap">
        <MagnifyingGlass aria-hidden="true" />
        <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={placeholder} aria-label="Search the atlas" />
        {query && <kbd>{resultCount}</kbd>}
      </div>

      {query && (
        <div className="search-results" aria-label="Search results">
          {isRiskView ? riskResults.slice(0, 8).map((risk) => (
            <button type="button" key={risk.id} onClick={() => onSelectRisk(risk.id)}><strong>{risk.ref} · {risk.name}</strong><span>{risk.recordCount} mapped MIT records</span></button>
          )) : isControlView ? controlResults.slice(0, 8).map((control) => (
            <button type="button" key={control.id} onClick={() => onSelectControl(control.id)}><strong>{control.code} · {control.name}</strong><span>{control.objective}</span></button>
          )) : results.slice(0, 8).map((instrument) => (
            <button type="button" key={instrument.id} onClick={() => onSelectInstrument(instrument.id)}><strong>{instrument.shortTitle}</strong><span>{instrument.issuer}</span></button>
          ))}
          {resultCount === 0 && <p>No matching {isRiskView ? 'risk types' : isControlView ? 'control objectives' : 'instruments'}.</p>}
        </div>
      )}

      <section className="control-section tour-section">
        <div className="control-title"><Compass /> <span>Guided tours</span></div>
        <div className="tour-list">
          {tours.map((tour) => (
            <button type="button" key={tour.id} onClick={() => onStartTour(tour.id)}>
              <strong>{tour.title}</strong>
              <small>{tour.steps.length} steps · about {tour.minutes} min</small>
            </button>
          ))}
        </div>
      </section>

      <section className="control-section">
        <div className="control-title"><Atom /> <span>Explore by</span></div>
        <div className="segment-control segment-control-three lens-control">
          <button type="button" className={layout === 'ontology' || layout === 'authority' ? 'active' : ''} onClick={() => onLayoutChange('ontology')}><Atom /> Sources</button>
          <button type="button" className={layout === 'risk' ? 'active' : ''} onClick={() => onLayoutChange('risk')}><WarningDiamond /> Risks</button>
          <button type="button" className={layout === 'controls' ? 'active' : ''} onClick={() => onLayoutChange('controls')}><ShieldCheck /> Controls</button>
        </div>
        {(isRiskView || isControlView) && <p className="control-note">{isRiskView ? 'MIT describes what can go wrong. Select a risk to reveal candidate controls.' : 'Explore safeguards that could help manage risk. Select a control to see examples and supporting sources.'}</p>}
      </section>

      {!isRiskView && !isControlView && (
        <section className="control-section filter-section">
          <div className="control-title"><Funnel /> <span>Source type</span><small>{authorityClasses.size || 'all'}</small></div>
          <div className="filter-list">
            {authorityOrder.map((authority) => (
              <label key={authority}><input type="checkbox" checked={authorityClasses.has(authority)} onChange={() => onToggleAuthority(authority)} /><span>{authorityLabels[authority]}</span></label>
            ))}
          </div>
        </section>
      )}

      {!isRiskView && !isControlView && <section className="control-section filter-section region-filters">
        <div className="control-title"><span>Country or region</span><small>{regions.size || 'all'}</small></div>
        <div className="filter-list">
          {regionOrder.map((region) => (
            <label key={region}><input type="checkbox" checked={regions.has(region)} onChange={() => onToggleRegion(region)} /><span>{region}</span></label>
          ))}
        </div>
      </section>}


    </aside>
  )
}
