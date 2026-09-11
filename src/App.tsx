import { Methodology } from './components/Methodology'
import { ThemeToggle } from './components/ThemeToggle'
import { QuestionsProvider } from './components/LeadershipQuestions'
import { UniverseOutline, UniverseMorph, type NodeSnapshot, type OutlineHandle, type Morph } from './components/UniverseOutline'
import { CaretLeft, CaretRight, ClockCounterClockwise, GithubLogo, Info, List, MagnifyingGlass, X } from '@phosphor-icons/react'
import { AnimatePresence } from 'motion/react'
import { useEffect, useMemo, useState, useRef } from 'react'
import { SearchDialog } from './components/SearchDialog'
import { AtlasMark } from './components/AtlasMark'
import { describeNode } from './components/DossierPanel'
import { FocusList } from './components/FocusList'
import { GraphCanvas } from './components/GraphCanvas'
import { Inspector } from './components/Inspector'
import { Sidebar } from './components/Sidebar'
import { TemporalLens } from './components/TemporalLens'
import { concepts, domains } from './data/concepts'
import { mappingAssertions } from './data/assertions'
import { controlObjectives } from './data/controls'
import { instruments } from './data/instruments'
import { countForCausalLens, mappedRiskRecordCount, riskDomainById, riskSubdomains, type CausalLens } from './data/mitRiskTaxonomy'
import { buildGraphModel, defaultFilters, type LayoutMode } from './lib/graphModel'
import type { AuthorityClass, Instrument } from './types'

const initialHashSelection = () => {
  const hash = window.location.hash.replace('#/', '')
  if (!hash) return undefined
  const [kind, ...rest] = hash.split('/')
  const normalizedKind = kind === 'clause' ? 'provision' : kind
  const candidate = `${normalizedKind}:${rest.join('/')}`
  return rest.length && describeNode(candidate) ? candidate : undefined
}

const initialLayout = (): LayoutMode => window.location.hash.includes('/risk-') ? 'risk' : window.location.hash.includes('/control-') ? 'controls' : 'ontology'

const publicationYears = instruments.map((instrument) => Number.parseInt(instrument.published, 10)).filter(Number.isFinite)
const minimumPublicationYear = Math.min(...publicationYears)
const maximumPublicationYear = Math.max(...publicationYears)

function AtlasApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [layout, setLayout] = useState<LayoutMode>(initialLayout)
  const causalLens: CausalLens = 'all'
  const [query, setQuery] = useState('')
  const [authorityClasses, setAuthorityClasses] = useState<Set<AuthorityClass>>(() => defaultFilters().authorityClasses)
  const [regions, setRegions] = useState<Set<Instrument['region']>>(() => defaultFilters().regions)
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(initialHashSelection)
  const [mobileControls, setMobileControls] = useState(false)
  const [showMethod, setShowMethod] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [newsFocus, setNewsFocus] = useState(0)
  const [timeCutoff, setTimeCutoff] = useState(maximumPublicationYear)
  const [projection, setProjection] = useState<'atlas' | 'focus' | 'list'>('atlas')
  const graphSnapshot = useRef<(() => NodeSnapshot) | null>(null)
  const outlineHandle = useRef<OutlineHandle | null>(null)
  const morphOrigin = useRef<NodeSnapshot>(new Map())
  const morphPending = useRef(false)
  const morphTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [morph, setMorph] = useState<Morph[]>([])
  const [reverseMorph, setReverseMorph] = useState(false)
  const clearMorph = () => { clearTimeout(morphTimer.current); setMorph([]); morphPending.current = false }
  useEffect(() => () => clearTimeout(morphTimer.current), [])
  const playMorph = (from: NodeSnapshot, to: NodeSnapshot, reverse: boolean) => {
    clearTimeout(morphTimer.current)
    setReverseMorph(reverse)
    const targets = [...to.values()]
    setMorph([...from].slice(0, 180).flatMap(([id, origin]) => {
      const destination = to.get(id) ?? targets.find(p => p.color === origin.color)
      return destination ? [{ id, from: origin, to: destination }] : []
    }))
    morphTimer.current = setTimeout(() => setMorph([]), 860)
  }
  const changeProjection = (next: 'atlas' | 'list') => {
    if (next === projection) return
    clearMorph()
    if (next === 'list') {
      morphOrigin.current = graphSnapshot.current?.() ?? new Map()
      morphPending.current = true
    } else {
      if (selectedNodeId && !graphModel.nodes.some(n => n.id === selectedNodeId)) setLayout(selectedNodeId.startsWith('risk-') ? 'risk' : selectedNodeId.startsWith('control-') ? 'controls' : 'ontology')
      playMorph(outlineHandle.current?.capture() ?? new Map(), graphSnapshot.current?.() ?? new Map(), true)
    }
    setProjection(next)
  }
  const outlineReady = (points: NodeSnapshot) => {
    if (!morphPending.current) return
    clearTimeout(morphTimer.current)
    morphTimer.current = setTimeout(() => {
      morphPending.current = false
      playMorph(morphOrigin.current, outlineHandle.current?.capture() ?? points, false)
    }, 40)
  }
  const [focusAnchorId, setFocusAnchorId] = useState<string | undefined>(initialHashSelection)
  const [mobileInspectorExpanded, setMobileInspectorExpanded] = useState(false)

  const filteredInstruments = useMemo(() => {
    const normalized = query.toLowerCase().trim()
    return instruments.filter((instrument) => {
      const matchesQuery = !normalized || [instrument.title, instrument.shortTitle, instrument.issuer, instrument.jurisdiction, instrument.summary, ...instrument.sectors].join(' ').toLowerCase().includes(normalized)
      const matchesAuthority = authorityClasses.size === 0 || authorityClasses.has(instrument.authorityClass)
      const matchesRegion = regions.size === 0 || regions.has(instrument.region)
      const year = Number.parseInt(instrument.published, 10)
      const matchesTime = !Number.isFinite(year) || year <= timeCutoff
      return matchesQuery && matchesAuthority && matchesRegion && matchesTime
    })
  }, [authorityClasses, query, regions, timeCutoff])

  const focusEligibleInstruments = useMemo(() => instruments.filter((instrument) => {
    const matchesAuthority = authorityClasses.size === 0 || authorityClasses.has(instrument.authorityClass)
    const matchesRegion = regions.size === 0 || regions.has(instrument.region)
    const year = Number.parseInt(instrument.published, 10)
    const matchesTime = !Number.isFinite(year) || year <= timeCutoff
    return matchesAuthority && matchesRegion && matchesTime
  }), [authorityClasses, regions, timeCutoff])

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

  const graphModel = useMemo(() => buildGraphModel(layout, { query, authorityClasses, regions, publishedThrough: timeCutoff }, selectedNodeId, causalLens), [authorityClasses, causalLens, layout, query, regions, selectedNodeId, timeCutoff])

  const selectNode = (nodeId?: string) => {
    if (!nodeId) {
      setSelectedNodeId(undefined)
      setFocusAnchorId(undefined)
      setProjection(current => current === 'list' ? 'list' : 'atlas')
      setMobileInspectorExpanded(false)
      return
    }
    if (projection !== 'list') {
    if (nodeId?.startsWith('risk-')) setLayout('risk')
    if (nodeId?.startsWith('control-')) setLayout('controls')
    if ((layout === 'risk' || layout === 'controls') && (nodeId?.startsWith('instrument:') || nodeId?.startsWith('provision:') || nodeId?.startsWith('concept:') || nodeId?.startsWith('domain:'))) setLayout('ontology')
    }
    setSelectedNodeId(nodeId)
    setFocusAnchorId(nodeId)
    setProjection(current => current === 'list' ? 'list' : 'atlas')
  }

  const selectFocusItem = (nodeId: string) => {
    if (nodeId.startsWith('instrument:') || nodeId.startsWith('provision:')) setLayout('ontology')
    setSelectedNodeId(nodeId)
  }

  const changeLayout = (nextLayout: LayoutMode) => {
    setLayout(nextLayout)
    setQuery('')
    setSelectedNodeId(undefined)
    setFocusAnchorId(undefined)
    setProjection(current => current === 'list' ? 'list' : 'atlas')
    setMobileInspectorExpanded(false)
  }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(open => !open) }
      if (event.key === 'Escape') { setShowMethod(false); setShowTime(false); setMobileControls(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  const openFromSearch = (nodeId: string) => {
    setQuery(''); setAuthorityClasses(new Set()); setRegions(new Set()); setTimeCutoff(maximumPublicationYear)
    if (projection === 'list') setLayout(nodeId.startsWith('risk-') ? 'risk' : nodeId.startsWith('control-') ? 'controls' : 'ontology')
    setSearchOpen(false); selectNode(nodeId)
  }
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

  const selectedGraphNode = selectedNodeId ? graphModel.nodes.find((node) => node.id === selectedNodeId) : undefined
  const temporalActive = timeCutoff < maximumPublicationYear

  return (
    <main className={`atlas-shell${sidebarCollapsed ? ' sidebar-collapsed' : ''}`} id="main-content">
      <a className="skip-link" href="#atlas-graph">Skip to the map</a>
      <header className="atlas-header">
        <div className="brand-block">
<div className="brand-mark" aria-hidden="true"><AtlasMark /></div>
          <div>
            <h1>AI Trust <i>Atlas</i></h1>
          </div>
        </div>
        <div className="corpus-stats" role="group" aria-label="Corpus statistics">
          <div><strong>{filteredInstruments.length}</strong><span>Sources</span></div>
          <div><strong>{concepts.length}</strong><span>Trust Concepts</span></div>
          <div className="edition-cell"><strong>{mappingAssertions.length}</strong><span>Connections</span></div>
        </div>
        <nav className="header-actions" aria-label="Atlas resources"><button type="button" onClick={() => setSearchOpen(true)} aria-label="Search everything"><MagnifyingGlass/> Search</button>
          <button className={temporalActive ? 'header-active' : ''} type="button" onClick={() => setShowTime((open) => !open)}><ClockCounterClockwise /> What’s new{temporalActive ? ` · ${timeCutoff}` : ''}</button>
          <button className="method-trigger" type="button" title="Methodology" aria-label="Methodology" onClick={() => setShowMethod(true)}><Info /><span>Methodology</span></button>
          <a href="https://github.com/9to5ai/ai-trust-atlas" target="_blank" rel="noreferrer"><GithubLogo /> Source</a>
          <ThemeToggle />
          <button className="mobile-control-button" aria-label="Explore" type="button" onClick={() => setMobileControls((open) => !open)}>{mobileControls ? <X /> : <List />}<span>Explore</span></button>
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
            onSelectRisk={(id) => { selectNode(`risk-subdomain:${id}`); setMobileControls(false) }}
            onSelectControl={(id) => { selectNode(`control-objective:${id}`); setMobileControls(false) }}
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
          onSelectRisk={(id) => selectNode(`risk-subdomain:${id}`)}
          onSelectControl={(id) => selectNode(`control-objective:${id}`)}
        />

        <section className={`graph-region${projection === 'focus' ? ' is-focus-list' : ''}${projection === 'list' ? ' is-outline' : ''}${morph.length ? ' is-morphing' : ''}`} id="atlas-graph" aria-label="AI Trust ontology graph">
          <div className="observatory-frame" aria-hidden="true"><i /><i /><i /></div>
          <button className="sidebar-collapse" type="button" aria-label={sidebarCollapsed ? 'Expand left panel' : 'Collapse left panel'} aria-expanded={!sidebarCollapsed} onClick={() => setSidebarCollapsed(value => !value)}>{sidebarCollapsed ? <CaretRight /> : <CaretLeft />}</button>
          {selectedNodeId && selectedGraphNode && projection === 'atlas' && <div className="path-narrative" aria-live="polite">
            <span>You’re exploring</span><strong>{selectedGraphNode.shortLabel}</strong><small>Connected items are highlighted. Open an item to learn more.</small>
          </div>}
          <GraphCanvas focusRequest={newsFocus} snapshotRef={graphSnapshot} showSourceLabels={authorityClasses.size > 0 && (layout === 'ontology' || layout === 'authority')} model={graphModel} selectedNodeId={selectedNodeId} onSelect={selectNode} inactive={projection !== 'atlas'} />
          <div className="projection-switch" role="group" aria-label="Universe display"><button type="button" aria-pressed={projection === 'atlas'} onClick={() => changeProjection('atlas')}>Universe</button><button type="button" aria-pressed={projection === 'list'} onClick={() => changeProjection('list')}>List</button></div>
          <UniverseOutline mode={layout} sources={focusEligibleInstruments} query={query} selected={selectedNodeId} onSelect={selectNode} active={projection === 'list'} handle={outlineHandle} onReady={outlineReady} />
          {morph.length > 0 && <UniverseMorph key={reverseMorph ? 'reverse' : 'forward'} nodes={morph} edges={graphModel.edges} reverse={reverseMorph} selected={selectedNodeId} />}
          <AnimatePresence mode="wait">
            {projection === 'focus' && focusAnchorId && (
              <FocusList
                key={focusAnchorId}
                anchorId={focusAnchorId}
                instruments={focusEligibleInstruments}
                selectedNodeId={selectedNodeId}
                onSelectNode={selectFocusItem}
                onReturnToAtlas={() => setProjection(current => current === 'list' ? 'list' : 'atlas')}
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
              <span><i className="shape-domain" />Topic</span>
              <span><i className="shape-concept" />Concept</span>
              <span><i className="shape-instrument" />Source</span>
              <span><i className="shape-provision" />Section</span>
            </>}
          </div>
          <div className="mobile-atlas-tools" role="group" aria-label="Atlas tools">
            <button className={temporalActive ? 'active' : ''} type="button" onClick={() => setShowTime(true)}><ClockCounterClockwise /><span>What’s new</span></button>
          </div>
        </section>

        <Inspector
          selectedNodeId={selectedNodeId}
          onClose={() => selectNode(undefined)}
          onSelectNode={selectNode}
          causalLens={causalLens}
          onShowRelated={selectedNodeId ? () => { setFocusAnchorId(selectedNodeId); setProjection('focus'); setMobileInspectorExpanded(false) } : undefined}
          mobileExpanded={mobileInspectorExpanded}
          onMobileExpandedChange={setMobileInspectorExpanded}
        />
      </div>

      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} onSelect={openFromSearch}/>}

      <TemporalLens onSelect={(id) => { setQuery(''); setAuthorityClasses(new Set()); setRegions(new Set()); setTimeCutoff(maximumPublicationYear); setLayout('ontology'); setProjection('atlas'); setSelectedNodeId(id); setFocusAnchorId(id); setNewsFocus(n => n + 1) }} open={showTime} cutoff={timeCutoff} minYear={minimumPublicationYear} maxYear={maximumPublicationYear} instruments={instruments} onChange={setTimeCutoff} onClose={() => setShowTime(false)} onReset={() => setTimeCutoff(maximumPublicationYear)} />

      {showMethod && <Methodology onClose={() => setShowMethod(false)} />}
    </main>
  )
}

export default function App() { return <QuestionsProvider><AtlasApp /></QuestionsProvider> }
