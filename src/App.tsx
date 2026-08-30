import { GithubLogo, Info, List, Network, X } from '@phosphor-icons/react'
import { AnimatePresence } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AtlasMark } from './components/AtlasMark'
import { ComparePanel } from './components/ComparePanel'
import { FocusList } from './components/FocusList'
import { GraphCanvas } from './components/GraphCanvas'
import { Inspector } from './components/Inspector'
import { LiquidSurface } from './components/LiquidSurface'
import { Sidebar } from './components/Sidebar'
import { concepts, domains } from './data/concepts'
import { mappingAssertions } from './data/assertions'
import { CONTROL_MODEL_VERIFIED, controlObjectives } from './data/controls'
import { instruments } from './data/instruments'
import { countForCausalLens, mappedRiskRecordCount, riskDomainById, riskSubdomains, type CausalLens } from './data/mitRiskTaxonomy'
import { buildGraphModel, defaultFilters, type LayoutMode } from './lib/graphModel'
import type { AuthorityClass, Instrument } from './types'

const initialHashSelection = () => {
  const hash = window.location.hash.replace('#/', '')
  if (!hash) return undefined
  const [kind, ...rest] = hash.split('/')
  const normalizedKind = kind === 'clause' ? 'provision' : kind
  return ['instrument', 'concept', 'domain', 'provision', 'risk-domain', 'risk-subdomain', 'control-family', 'control-objective'].includes(normalizedKind) && rest.length ? `${normalizedKind}:${rest.join('/')}` : undefined
}

const initialLayout = (): LayoutMode => window.location.hash.includes('/risk-') ? 'risk' : window.location.hash.includes('/control-') ? 'controls' : 'ontology'

export default function App() {
  const [layout, setLayout] = useState<LayoutMode>(initialLayout)
  const [causalLens, setCausalLens] = useState<CausalLens>('all')
  const [query, setQuery] = useState('')
  const [authorityClasses, setAuthorityClasses] = useState<Set<AuthorityClass>>(() => defaultFilters().authorityClasses)
  const [regions, setRegions] = useState<Set<Instrument['region']>>(() => defaultFilters().regions)
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(initialHashSelection)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [mobileControls, setMobileControls] = useState(false)
  const [showMethod, setShowMethod] = useState(false)
  const [projection, setProjection] = useState<'atlas' | 'focus'>('atlas')
  const [focusAnchorId, setFocusAnchorId] = useState<string>()
  const [mobileInspectorExpanded, setMobileInspectorExpanded] = useState(false)
  const focusTimerRef = useRef<number | undefined>(undefined)

  const filteredInstruments = useMemo(() => {
    const normalized = query.toLowerCase().trim()
    return instruments.filter((instrument) => {
      const matchesQuery = !normalized || [instrument.title, instrument.shortTitle, instrument.issuer, instrument.jurisdiction, instrument.summary, ...instrument.sectors].join(' ').toLowerCase().includes(normalized)
      const matchesAuthority = authorityClasses.size === 0 || authorityClasses.has(instrument.authorityClass)
      const matchesRegion = regions.size === 0 || regions.has(instrument.region)
      return matchesQuery && matchesAuthority && matchesRegion
    })
  }, [authorityClasses, query, regions])

  const focusEligibleInstruments = useMemo(() => instruments.filter((instrument) => {
    const matchesAuthority = authorityClasses.size === 0 || authorityClasses.has(instrument.authorityClass)
    const matchesRegion = regions.size === 0 || regions.has(instrument.region)
    return matchesAuthority && matchesRegion
  }), [authorityClasses, regions])

  const filteredRiskSubdomains = useMemo(() => {
    const normalized = query.toLowerCase().trim()
    return riskSubdomains.filter((risk) => {
      const matchesQuery = !normalized || [risk.ref, risk.name, risk.definition, riskDomainById.get(risk.riskDomainId)?.name ?? ''].join(' ').toLowerCase().includes(normalized)
      return matchesQuery && countForCausalLens(risk, causalLens) > 0
    })
  }, [causalLens, query])

  const filteredControls = useMemo(() => {
    const normalized = query.toLowerCase().trim()
    return controlObjectives.filter((control) => !normalized || [control.code, control.name, control.objective, control.purpose, ...control.conceptIds].join(' ').toLowerCase().includes(normalized))
  }, [query])

  const graphModel = useMemo(() => buildGraphModel(layout, { query, authorityClasses, regions }, selectedNodeId, causalLens), [authorityClasses, causalLens, layout, query, regions, selectedNodeId])

  const clearFocusTimer = () => {
    if (focusTimerRef.current) window.clearTimeout(focusTimerRef.current)
    focusTimerRef.current = undefined
  }

  const selectNode = (nodeId?: string) => {
    clearFocusTimer()
    if (!nodeId) {
      setSelectedNodeId(undefined)
      setFocusAnchorId(undefined)
      setProjection('atlas')
      setMobileInspectorExpanded(false)
      return
    }
    if (nodeId?.startsWith('risk-')) setLayout('risk')
    if (nodeId?.startsWith('control-')) setLayout('controls')
    if ((layout === 'risk' || layout === 'controls') && (nodeId?.startsWith('instrument:') || nodeId?.startsWith('provision:') || nodeId?.startsWith('concept:') || nodeId?.startsWith('domain:'))) setLayout('ontology')
    setSelectedNodeId(nodeId)
    setFocusAnchorId(nodeId)
    setProjection('atlas')
    focusTimerRef.current = window.setTimeout(() => setProjection('focus'), 520)
  }

  const selectFocusItem = (nodeId: string) => {
    if (nodeId.startsWith('instrument:') || nodeId.startsWith('provision:')) setLayout('ontology')
    setSelectedNodeId(nodeId)
  }

  const changeLayout = (nextLayout: LayoutMode) => {
    clearFocusTimer()
    setLayout(nextLayout)
    setQuery('')
    setSelectedNodeId(undefined)
    setFocusAnchorId(undefined)
    setProjection('atlas')
    setMobileInspectorExpanded(false)
  }

  useEffect(() => () => clearFocusTimer(), [])

  useEffect(() => setMobileInspectorExpanded(false), [selectedNodeId])

  useEffect(() => {
    if (!selectedNodeId) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
      return
    }
    const [kind, id] = selectedNodeId.split(':')
    window.history.replaceState(null, '', `#/${kind}/${id}`)
  }, [selectedNodeId])

  const toggleAuthority = (authority: AuthorityClass) => setAuthorityClasses((current) => {
    const next = new Set(current)
    if (next.has(authority)) next.delete(authority)
    else next.add(authority)
    return next
  })

  const toggleRegion = (region: Instrument['region']) => setRegions((current) => {
    const next = new Set(current)
    if (next.has(region)) next.delete(region)
    else next.add(region)
    return next
  })

  const addCompare = (instrumentId: string) => setCompareIds((current) => {
    if (current.includes(instrumentId)) return current
    return [...current.slice(-1), instrumentId]
  })

  const totalProvisions = instruments.reduce((count, instrument) => count + instrument.provisions.length, 0)

  return (
    <main className="atlas-shell" id="main-content">
      <a className="skip-link" href="#atlas-graph">Skip to the Atlas universe</a>
      <header className="atlas-header">
        <div className="brand-block">
          <LiquidSurface className="brand-liquid" cornerRadius={12} displacementScale={24} blurAmount={0.08} elasticity={0.04}>
            <div className="brand-mark" aria-hidden="true"><AtlasMark /></div>
          </LiquidSurface>
          <div>
            <h1>AI Trust Atlas</h1>
            <p>Australia first. Global by design.</p>
          </div>
        </div>
        <div className="corpus-stats" role="group" aria-label="Corpus statistics">
          <div><strong>{instruments.length}</strong><span>instruments</span></div>
          <div><strong>{concepts.length}</strong><span>concepts</span></div>
          <div><strong>{riskSubdomains.length}</strong><span>risk types</span></div>
          <div><strong>{controlObjectives.length}</strong><span>controls</span></div>
          <div><strong>{totalProvisions}</strong><span>provisions</span></div>
        </div>
        <nav className="header-actions" aria-label="Atlas resources">
          <button type="button" onClick={() => setShowMethod(true)}><Info /> Method</button>
          <a href="https://github.com/9to5ai/ai-trust-atlas" target="_blank" rel="noreferrer"><GithubLogo /> Source</a>
          <button className="mobile-control-button" type="button" onClick={() => setMobileControls((open) => !open)}>{mobileControls ? <X /> : <List />}<span>Explore</span></button>
        </nav>
      </header>

      <div className={selectedNodeId ? `atlas-workspace has-selection${mobileInspectorExpanded ? ' mobile-details-open' : ''}` : 'atlas-workspace'}>
        <div className={mobileControls ? 'sidebar-mobile open' : 'sidebar-mobile'} inert={!mobileControls} aria-hidden={!mobileControls}>
          <Sidebar
            query={query}
            onQueryChange={setQuery}
            layout={layout}
            onLayoutChange={changeLayout}
            authorityClasses={authorityClasses}
            onToggleAuthority={toggleAuthority}
            regions={regions}
            onToggleRegion={toggleRegion}
            results={filteredInstruments}
            onSelectInstrument={(id) => { selectNode(`instrument:${id}`); setMobileControls(false) }}
            riskResults={filteredRiskSubdomains}
            controlResults={filteredControls}
            causalLens={causalLens}
            onCausalLensChange={setCausalLens}
            onSelectRisk={(id) => { selectNode(`risk-subdomain:${id}`); setMobileControls(false) }}
            onSelectControl={(id) => { selectNode(`control-objective:${id}`); setMobileControls(false) }}
            totalInstruments={instruments.length}
          />
        </div>
        <Sidebar
          query={query}
          onQueryChange={setQuery}
          layout={layout}
          onLayoutChange={changeLayout}
          authorityClasses={authorityClasses}
          onToggleAuthority={toggleAuthority}
          regions={regions}
          onToggleRegion={toggleRegion}
          results={filteredInstruments}
          onSelectInstrument={(id) => selectNode(`instrument:${id}`)}
          riskResults={filteredRiskSubdomains}
          controlResults={filteredControls}
          causalLens={causalLens}
          onCausalLensChange={setCausalLens}
          onSelectRisk={(id) => selectNode(`risk-subdomain:${id}`)}
          onSelectControl={(id) => selectNode(`control-objective:${id}`)}
          totalInstruments={instruments.length}
        />

        <section className={projection === 'focus' ? 'graph-region is-focus-list' : 'graph-region'} id="atlas-graph" aria-label="AI Trust ontology graph">
          <div className="graph-title">
            <span>{layout === 'risk' ? 'Risk universe' : layout === 'controls' ? 'Control architecture' : layout === 'ontology' ? 'Requirements by meaning' : 'Requirements by authority'}</span>
            <strong>{layout === 'risk' ? `${filteredRiskSubdomains.length} MIT risk types · ${causalLens === 'all' ? `${mappedRiskRecordCount.toLocaleString()} mapped` : `${filteredRiskSubdomains.reduce((sum, risk) => sum + countForCausalLens(risk, causalLens), 0).toLocaleString()} matching`} records` : layout === 'controls' ? `${filteredControls.length} Atlas-normalised objectives · six control families` : `${filteredInstruments.length} instruments connected through ${domains.length} visual themes`}</strong>
          </div>
          <LiquidSurface className="projection-liquid" cornerRadius={11} displacementScale={38} blurAmount={0.16}>
            <div className="projection-switch" role="group" aria-label="Atlas projection">
              <button type="button" aria-pressed={projection === 'atlas'} onClick={() => { clearFocusTimer(); setProjection('atlas') }}><Network /> Atlas</button>
              <button type="button" aria-pressed={projection === 'focus'} disabled={!focusAnchorId} onClick={() => focusAnchorId && setProjection('focus')}><List /> Focus list</button>
            </div>
          </LiquidSurface>
          <GraphCanvas model={graphModel} selectedNodeId={selectedNodeId} onSelect={selectNode} inactive={projection === 'focus'} />
          <AnimatePresence mode="wait">
            {projection === 'focus' && focusAnchorId && (
              <FocusList
                key={focusAnchorId}
                anchorId={focusAnchorId}
                instruments={focusEligibleInstruments}
                selectedNodeId={selectedNodeId}
                onSelectNode={selectFocusItem}
                onReturnToAtlas={() => setProjection('atlas')}
                inactive={mobileInspectorExpanded}
              />
            )}
          </AnimatePresence>
          <div className="semantic-key" role="group" aria-label="Graph legend">
            {layout === 'risk' ? <>
              <span><i className="shape-domain" />Trust domain</span>
              <span><i className="shape-concept" />Trust concept</span>
              <span><i className="shape-risk-domain" />MIT domain</span>
              <span><i className="shape-risk-subdomain" />MIT risk type</span>
            </> : layout === 'controls' ? <>
              <span><i className="shape-control-family" />Control family</span>
              <span><i className="shape-control" />Control objective</span>
              <span><i className="shape-concept" />Trust concept</span>
              <span><i className="shape-risk-subdomain" />Risk type</span>
            </> : <>
              <span><i className="shape-domain" />Visual theme</span>
              <span><i className="shape-concept" />Concept</span>
              <span><i className="shape-instrument" />Instrument</span>
              <span><i className="shape-provision" />Provision</span>
            </>}
          </div>
          <div className="corpus-status"><span>{layout === 'risk' ? 'MIT source · CC BY 4.0' : layout === 'controls' ? 'Atlas-normalised · public sources' : 'Curated public corpus'}</span><strong>{layout === 'risk' ? 'Database updated 03 December 2025' : layout === 'controls' ? `Verified ${CONTROL_MODEL_VERIFIED}` : 'Verified 28 August 2026'}</strong></div>
        </section>

        <Inspector
          selectedNodeId={selectedNodeId}
          onClose={() => selectNode(undefined)}
          onSelectNode={selectNode}
          onAddCompare={addCompare}
          compareIds={compareIds}
          causalLens={causalLens}
          mobileExpanded={mobileInspectorExpanded}
          onMobileExpandedChange={setMobileInspectorExpanded}
        />
      </div>

      <ComparePanel compareIds={compareIds} onRemove={(id) => setCompareIds((current) => current.filter((candidate) => candidate !== id))} onClear={() => setCompareIds([])} />

      {showMethod && (
        <div className="method-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowMethod(false) }}>
          <section className="method-dialog" role="dialog" aria-modal="true" aria-labelledby="method-title">
            <button className="inspector-close" type="button" onClick={() => setShowMethod(false)} aria-label="Close methodology"><X /></button>
            <span className="method-label">How to read the atlas</span>
            <h2 id="method-title">Relationships, not equivalence.</h2>
            <p>The Atlas separates authority, source provisions, trust objectives, risks and candidate control responses. Every semantic line is represented as an inspectable assertion.</p>
            <div className="method-columns">
              <div><strong>Authority stays visible</strong><p>Law, prudential expectations, standards, frameworks, testing resources and threat knowledge remain distinct.</p></div>
              <div><strong>Synthesis is labelled</strong><p>Some links are explicit in source material. Others are cross-framework synthesis with a stated confidence and explanation.</p></div>
              <div><strong>Risk paths are explainable</strong><p>Derived instrument–risk associations are shown through the exact shared concepts or source provisions, never as direct coverage.</p></div>
              <div><strong>Controls are candidate responses</strong><p>The {controlObjectives.length} Atlas objectives are normalised from public sources. “May address” never means implemented, effective or compliant.</p></div>
              <div><strong>Assertions carry provenance</strong><p>{mappingAssertions.length.toLocaleString()} typed assertions retain rationale, mapping basis, confidence, citations, version and verification date.</p></div>
              <div><strong>Evidence has limits</strong><p>A policy, configuration, certification or test result can support assessment but cannot establish operating effectiveness or an assurance conclusion by itself.</p></div>
              <div><strong>Human authority remains</strong><p>Accountable people retain materiality, risk appetite, approval, exceptions, residual-risk and assurance decisions.</p></div>
            </div>
            <button className="method-primary" type="button" onClick={() => setShowMethod(false)}>Enter the atlas</button>
          </section>
        </div>
      )}
    </main>
  )
}
