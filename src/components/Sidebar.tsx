import { Atom, Funnel, MagnifyingGlass, Rows, WarningDiamond } from '@phosphor-icons/react'
import { causalLensOptions, mappedRiskRecordCount, type CausalLens } from '../data/mitRiskTaxonomy'
import { authorityLabels, authorityOrder, regionOrder } from '../lib/labels'
import type { LayoutMode } from '../lib/graphModel'
import type { AuthorityClass, Instrument, RiskSubdomain } from '../types'

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
  causalLens: CausalLens
  onCausalLensChange: (lens: CausalLens) => void
  onSelectRisk: (riskSubdomainId: string) => void
  totalInstruments: number
}

export function Sidebar({ query, onQueryChange, layout, onLayoutChange, authorityClasses, onToggleAuthority, regions, onToggleRegion, results, onSelectInstrument, riskResults, causalLens, onCausalLensChange, onSelectRisk, totalInstruments }: Props) {
  const isRiskView = layout === 'risk'
  return (
    <aside className="sidebar" aria-label="Atlas controls">
      <div className="search-wrap">
        <MagnifyingGlass aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={isRiskView ? 'Find a risk type or domain' : 'Find an instrument or issuer'}
          aria-label="Search the atlas"
        />
        {query && <kbd>{isRiskView ? riskResults.length : results.length}</kbd>}
      </div>

      {query && (
        <div className="search-results" aria-label="Search results">
          {isRiskView ? riskResults.slice(0, 8).map((risk) => (
            <button type="button" key={risk.id} onClick={() => onSelectRisk(risk.id)}>
              <strong>{risk.ref} · {risk.name}</strong>
              <span>{risk.recordCount} mapped MIT records</span>
            </button>
          )) : results.slice(0, 8).map((instrument) => (
            <button type="button" key={instrument.id} onClick={() => onSelectInstrument(instrument.id)}>
              <strong>{instrument.shortTitle}</strong>
              <span>{instrument.issuer}</span>
            </button>
          ))}
          {(isRiskView ? riskResults.length : results.length) === 0 && <p>No matching {isRiskView ? 'risk types' : 'instruments'}.</p>}
        </div>
      )}

      <section className="control-section">
        <div className="control-title"><Atom /> <span>Spatial logic</span></div>
        <div className="segment-control segment-control-three">
          <button type="button" className={layout === 'ontology' ? 'active' : ''} onClick={() => onLayoutChange('ontology')}><Atom /> Ontology</button>
          <button type="button" className={layout === 'authority' ? 'active' : ''} onClick={() => onLayoutChange('authority')}><Rows /> Authority</button>
          <button type="button" className={layout === 'risk' ? 'active' : ''} onClick={() => onLayoutChange('risk')}><WarningDiamond /> Risk</button>
        </div>
        <p className="control-note">{isRiskView ? 'Risk connects MIT risk types to the trust concepts relevant to their governance and evaluation.' : 'Ontology groups by meaning. Authority separates legal force and reference type.'}</p>
      </section>

      {isRiskView ? (
        <section className="control-section causal-section">
          <div className="control-title"><Funnel /> <span>Causal lens</span></div>
          <p className="control-note causal-note">Filter the MIT record counts by one causal dimension. Other and uncoded records remain visible only in “All records”.</p>
          <div className="causal-list">
            {causalLensOptions.map((option) => (
              <button type="button" key={option.id} className={causalLens === option.id ? 'active' : ''} onClick={() => onCausalLensChange(option.id)}>
                <span>{option.label}</span><small>{option.group}</small>
              </button>
            ))}
          </div>
        </section>
      ) : (
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
      )}

      {!isRiskView && <section className="control-section filter-section region-filters">
        <div className="control-title"><span>Jurisdiction</span><small>{regions.size || 'all'}</small></div>
        <div className="filter-list">
          {regionOrder.map((region) => (
            <label key={region}>
              <input type="checkbox" checked={regions.has(region)} onChange={() => onToggleRegion(region)} />
              <span>{region}</span>
            </label>
          ))}
        </div>
      </section>}

      <div className="sidebar-foot">
        <strong>{isRiskView ? riskResults.length : results.length}</strong>
        <span>{isRiskView ? `of 24 types · ${mappedRiskRecordCount.toLocaleString()} mapped records` : `of ${totalInstruments} instruments visible`}</span>
      </div>
    </aside>
  )
}
