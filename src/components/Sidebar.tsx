import { Atom, Funnel, MagnifyingGlass, Rows, ShieldCheck, WarningDiamond } from '@phosphor-icons/react'
import { controlFamilies } from '../data/controls'
import { causalLensOptions, mappedRiskRecordCount, type CausalLens } from '../data/mitRiskTaxonomy'
import { authorityLabels, authorityOrder, regionOrder } from '../lib/labels'
import type { LayoutMode } from '../lib/graphModel'
import type { AuthorityClass, ControlObjective, Instrument, RiskSubdomain } from '../types'
import { LiquidSurface } from './LiquidSurface'

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
  causalLens: CausalLens
  onCausalLensChange: (lens: CausalLens) => void
  onSelectRisk: (riskSubdomainId: string) => void
  onSelectControl: (controlId: string) => void
  totalInstruments: number
}

export function Sidebar({ query, onQueryChange, layout, onLayoutChange, authorityClasses, onToggleAuthority, regions, onToggleRegion, results, onSelectInstrument, riskResults, controlResults, causalLens, onCausalLensChange, onSelectRisk, onSelectControl, totalInstruments }: Props) {
  const isRiskView = layout === 'risk'
  const isControlView = layout === 'controls'
  const resultCount = isRiskView ? riskResults.length : isControlView ? controlResults.length : results.length
  const placeholder = isRiskView ? 'Find a risk type or domain' : isControlView ? 'Find a control objective' : 'Find an instrument or issuer'

  return (
    <aside className="sidebar" aria-label="Atlas controls">
      <LiquidSurface className="sidebar-search-liquid" cornerRadius={11} displacementScale={22} blurAmount={0.11} elasticity={0.035}>
        <div className="search-wrap">
          <MagnifyingGlass aria-hidden="true" />
          <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={placeholder} aria-label="Search the atlas" />
          {query && <kbd>{resultCount}</kbd>}
        </div>
      </LiquidSurface>

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

      <section className="control-section">
        <div className="control-title"><Atom /> <span>Explore by</span></div>
        <LiquidSurface className="sidebar-lens-liquid" cornerRadius={11} displacementScale={24} blurAmount={0.12} elasticity={0.035}>
          <div className="segment-control segment-control-three lens-control">
            <button type="button" className={layout === 'ontology' || layout === 'authority' ? 'active' : ''} onClick={() => onLayoutChange('ontology')}><Atom /> Requirements</button>
            <button type="button" className={layout === 'risk' ? 'active' : ''} onClick={() => onLayoutChange('risk')}><WarningDiamond /> Risks</button>
            <button type="button" className={layout === 'controls' ? 'active' : ''} onClick={() => onLayoutChange('controls')}><ShieldCheck /> Controls</button>
          </div>
        </LiquidSurface>
        {(layout === 'ontology' || layout === 'authority') && <>
          <div className="projection-label">Group requirements by</div>
          <LiquidSurface className="sidebar-projection-liquid" cornerRadius={10} displacementScale={20} blurAmount={0.1} elasticity={0.03}>
            <div className="segment-control projection-control">
              <button type="button" className={layout === 'ontology' ? 'active' : ''} onClick={() => onLayoutChange('ontology')}><Atom /> Meaning</button>
              <button type="button" className={layout === 'authority' ? 'active' : ''} onClick={() => onLayoutChange('authority')}><Rows /> Authority</button>
            </div>
          </LiquidSurface>
        </>}
        <p className="control-note">{isRiskView ? 'MIT describes what can go wrong. Select a risk to reveal candidate controls.' : isControlView ? 'Atlas-normalised objectives show what an organisation might do—never whether it has done it effectively.' : 'Requirements are source instruments and provisions. Meaning and authority are alternate projections of the same corpus.'}</p>
      </section>

      {isRiskView ? (
        <section className="control-section causal-section">
          <div className="control-title"><Funnel /> <span>Causal lens</span></div>
          <p className="control-note causal-note">Filter source-record counts by one MIT causal dimension. Counts describe the literature, not severity or exposure.</p>
          <div className="causal-list">
            {causalLensOptions.map((option) => (
              <button type="button" key={option.id} className={causalLens === option.id ? 'active' : ''} onClick={() => onCausalLensChange(option.id)}><span>{option.label}</span><small>{option.group}</small></button>
            ))}
          </div>
        </section>
      ) : isControlView ? (
        <section className="control-section control-family-key">
          <div className="control-title"><ShieldCheck /> <span>Six control families</span></div>
          <div className="family-key-list">
            {controlFamilies.map((family) => <div key={family.id}><i style={{ backgroundColor: family.color }} /><span>{family.name}</span><small>4</small></div>)}
          </div>
          <p className="control-note">Detailed source catalogues remain in the inspector and search. Only the neutral control spine appears in the universe.</p>
        </section>
      ) : (
        <section className="control-section filter-section">
          <div className="control-title"><Funnel /> <span>Authority class</span><small>{authorityClasses.size || 'all'}</small></div>
          <div className="filter-list">
            {authorityOrder.map((authority) => (
              <label key={authority}><input type="checkbox" checked={authorityClasses.has(authority)} onChange={() => onToggleAuthority(authority)} /><span>{authorityLabels[authority]}</span></label>
            ))}
          </div>
        </section>
      )}

      {!isRiskView && !isControlView && <section className="control-section filter-section region-filters">
        <div className="control-title"><span>Jurisdiction</span><small>{regions.size || 'all'}</small></div>
        <div className="filter-list">
          {regionOrder.map((region) => (
            <label key={region}><input type="checkbox" checked={regions.has(region)} onChange={() => onToggleRegion(region)} /><span>{region}</span></label>
          ))}
        </div>
      </section>}

      <div className="sidebar-foot">
        <strong>{resultCount}</strong>
        <span>{isRiskView ? `of 24 types · ${mappedRiskRecordCount.toLocaleString()} mapped records` : isControlView ? 'of 24 neutral control objectives' : `of ${totalInstruments} instruments visible`}</span>
      </div>
    </aside>
  )
}
