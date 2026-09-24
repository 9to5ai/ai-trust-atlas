import { legalEffectLabels, matchesSourceFacets, sectorLabels } from '../../data/sourceMetadata'
import type { LegalEffect, SectorId } from '../../types'
import { UseCasesView } from '../../components/UseCasesView'
import { QuestionsView } from '../../components/QuestionsView'
import { pathForView, readView, viewUrl, type AtlasView } from '../../lib/viewState'
import { RouteActions, universeRoutes } from '../../app/AppShell'
import { authorityLabels } from '../../lib/labels'
import { objectById } from '../../lib/workspace'
import { UniverseOutline } from '../../components/UniverseOutline'
import { CaretLeft, CaretRight, ClockCounterClockwise, Faders, MagnifyingGlass, X } from '@phosphor-icons/react'
import { AnimatePresence } from 'motion/react'
import { useEffect, useMemo, useState, useRef } from 'react'
import { SearchDialog } from '../../components/SearchDialog'
import { FocusList } from '../../components/FocusList'
import { Universe } from '../../universe/Universe'
import { TourPlayer } from '../../tour/TourPlayer'
import { PresenterDock } from '../../tour/PresenterDock'
import { setPresenting, usePresenting } from '../../app/presenting'
import { tourById } from '../../data/tours'
import { findPaths } from '../../lib/workspace'
import type { UniverseNavigation } from '../../universe/shared'
import { Inspector } from '../../components/Inspector'
import { Sidebar } from '../../components/Sidebar'
import { TemporalLens } from '../../components/TemporalLens'
import { controlObjectives } from '../../data/controls'
import { instruments } from '../../data/instruments'
import { countForCausalLens, mappedRiskRecordCount, riskDomainById, riskSubdomains, type CausalLens } from '../../data/mitRiskTaxonomy'
import { buildGraphModel, type LayoutMode } from '../../lib/graphModel'
import type { AuthorityClass, Instrument } from '../../types'

const publicationYears = instruments.map((instrument) => Number.parseInt(instrument.published, 10)).filter(Number.isFinite)
const maximumPublicationYear = Math.max(...publicationYears)

export function UniverseWorkspace() {
  const [initialView] = useState(() => readView(new URL(window.location.href), maximumPublicationYear))
  const readTour = (url: URL) => { const id = url.searchParams.get('tour'); const tour = id ? tourById.get(id) : undefined; if (!tour) return undefined; const step = Number(url.searchParams.get('step') ?? 0); return { id: tour.id, step: Number.isInteger(step) && step >= 0 && step < tour.steps.length ? step : 0 } }
  const [tour, setTour] = useState(() => readTour(new URL(window.location.href)))
  const [trail, setTrail] = useState<(AtlasView & { scroll: number; pose?: unknown })[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const presenting = usePresenting()
  const [searchOpen, setSearchOpen] = useState(false)
  const [layout, setLayout] = useState<LayoutMode>(initialView.layout)
  const causalLens: CausalLens = 'all'
  const [query, setQuery] = useState(initialView.query)
  const [authorityClasses, setAuthorityClasses] = useState<Set<AuthorityClass>>(() => new Set(initialView.authorities))
  const [regions, setRegions] = useState<Set<Instrument['region']>>(() => new Set(initialView.regions))
  const [effects, setEffects] = useState<Set<LegalEffect>>(() => new Set(initialView.effects ?? []))
  const [sectors, setSectors] = useState<Set<SectorId>>(() => new Set(initialView.sectors ?? []))
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(initialView.selected)
  const [mobileControls, setMobileControls] = useState(false)
  const [showTime, setShowTime] = useState(() => new URLSearchParams(window.location.search).get('panel') === 'news')
  const [showUseCases,setShowUseCases]=useState(initialView.useCases??false)
  const [showIncidents,setShowIncidents]=useState(initialView.incidents??initialView.selected?.startsWith('incident:')??false)
  useEffect(()=>{if(selectedNodeId?.startsWith('incident:'))setShowIncidents(true)},[selectedNodeId])
  const [newsFocus, setNewsFocus] = useState(0)
  const [timeCutoff, setTimeCutoff] = useState(initialView.year)
  const [projection, setProjection] = useState<'atlas' | 'focus' | 'list' | 'questions' | 'use-cases'>(initialView.projection)
  const graphNavigation = useRef<UniverseNavigation | null>(null)
  const changeProjection = (next: 'atlas' | 'list' | 'questions' | 'use-cases') => {
    if (next === projection) return
    rememberView()
    if(next==='questions'||projection==='questions'||next==='use-cases'||projection==='use-cases'){setProjection(next);setMobileInspectorExpanded(false);setMobileControls(false);return}
    if (next !== 'list' && selectedNodeId && !graphModel.nodes.some(n => n.id === selectedNodeId)) setLayout(selectedNodeId.startsWith('risk-') ? 'risk' : selectedNodeId.startsWith('control-') ? 'controls' : 'ontology')
    setProjection(next)
  }
  const [focusAnchorId, setFocusAnchorId] = useState<string | undefined>(initialView.anchor)
  const [mobileInspectorExpanded, setMobileInspectorExpanded] = useState(false)

  const filteredInstruments = useMemo(() => {
    const normalized = query.toLowerCase().trim()
    return instruments.filter((instrument) => {
      const matchesQuery = !normalized || [instrument.title, instrument.shortTitle, instrument.issuer, instrument.jurisdiction, instrument.summary, ...instrument.sectors].join(' ').toLowerCase().includes(normalized)
      const matchesAuthority = authorityClasses.size === 0 || authorityClasses.has(instrument.authorityClass)
      const matchesRegion = regions.size === 0 || regions.has(instrument.region)
      const year = Number.parseInt(instrument.published, 10)
      const matchesTime = !Number.isFinite(year) || year <= timeCutoff
      return matchesQuery && matchesAuthority && matchesRegion && matchesTime && matchesSourceFacets(instrument, effects, sectors)
    })
  }, [authorityClasses, query, regions, timeCutoff, effects, sectors])

  const focusEligibleInstruments = useMemo(() => instruments.filter((instrument) => {
    const matchesAuthority = authorityClasses.size === 0 || authorityClasses.has(instrument.authorityClass)
    const matchesRegion = regions.size === 0 || regions.has(instrument.region)
    const year = Number.parseInt(instrument.published, 10)
    const matchesTime = !Number.isFinite(year) || year <= timeCutoff
    return matchesAuthority && matchesRegion && matchesTime && matchesSourceFacets(instrument, effects, sectors)
  }), [authorityClasses, regions, timeCutoff, effects, sectors])

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

  const graphModel = useMemo(() => buildGraphModel(layout, { query, authorityClasses, regions, effects, sectors, publishedThrough: timeCutoff }, selectedNodeId, causalLens, showIncidents, showUseCases), [effects, sectors, showUseCases, showIncidents, authorityClasses, causalLens, layout, query, regions, selectedNodeId, timeCutoff])

  const currentView = (): AtlasView => ({useCases:showUseCases,incidents:showIncidents,selected:selectedNodeId, layout, projection, query, authorities:[...authorityClasses], regions:[...regions], effects:[...effects], sectors:[...sectors], year:timeCutoff, anchor:focusAnchorId})
  const rememberView = () => setTrail(items => [...items, {...currentView(), scroll:document.querySelector('.outline-scroll')?.scrollTop ?? 0, pose:graphNavigation.current?.capture()}].slice(-30))
  const restoreView = (view: AtlasView) => {
    setShowUseCases(view.useCases??false); setShowIncidents(view.incidents??false); setSelectedNodeId(view.selected); setLayout(view.layout); setProjection(view.projection); setQuery(view.query)
    setAuthorityClasses(new Set(view.authorities)); setRegions(new Set(view.regions)); setEffects(new Set(view.effects ?? [])); setSectors(new Set(view.sectors ?? [])); setTimeCutoff(view.year); setFocusAnchorId(view.anchor); setMobileInspectorExpanded(false)
  }
  const goBack = (index = trail.length-1) => {
    const view=trail[index]; if(!view)return
    restoreView(view); setTrail(items=>items.slice(0,index))
    requestAnimationFrame(()=>{ if(view.pose)graphNavigation.current?.restore(view.pose); const list=document.querySelector('.outline-scroll'); if(list)list.scrollTop=view.scroll })
  }
  const clearFilters = () => {setQuery('');setAuthorityClasses(new Set());setRegions(new Set());setEffects(new Set());setSectors(new Set());setTimeCutoff(maximumPublicationYear)}
  const selectNode = (nodeId?: string) => {
    if(nodeId !== selectedNodeId) rememberView()
    if(nodeId?.startsWith('use-case:')){setLayout('ontology');setProjection('atlas');setNewsFocus(n=>n+1)}
    if(nodeId?.startsWith('incident:')){setShowIncidents(true);setLayout('ontology');setProjection('atlas')}
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
    setProjection(current => (nodeId.startsWith('incident:')||nodeId.startsWith('use-case:'))?'atlas':current === 'list' ? 'list' : 'atlas')
  }

  const selectFocusItem = (nodeId: string) => {
    if(nodeId !== selectedNodeId)rememberView()
    if (nodeId.startsWith('instrument:') || nodeId.startsWith('provision:')) setLayout('ontology')
    setSelectedNodeId(nodeId)
  }

  const changeLayout = (nextLayout: LayoutMode) => {
    if(nextLayout!==layout)rememberView()
    setLayout(nextLayout)
    setQuery('')
    setSelectedNodeId(undefined)
    setFocusAnchorId(undefined)
    setProjection(current => current === 'list' ? 'list' : 'atlas')
    setMobileInspectorExpanded(false)
  }

  // Guided tours drive the real selection, layout and a highlighted recorded path.
  const activeTour = tour ? tourById.get(tour.id) : undefined
  const tourStep = activeTour && tour ? activeTour.steps[tour.step] : undefined
  const [tracePath, setTracePath] = useState<string[]>(() => (new URLSearchParams(window.location.search).get('highlight') ?? '').split(',').filter((id) => objectById.has(id)).slice(0, 24))
  const highlightFromUrl = useRef(tracePath.length > 0)
  const tourPath = useMemo(() => (tourStep?.trace ? findPaths(tourStep.trace[0], tourStep.trace[1], 'all', 4)[0]?.nodeIds ?? [] : []), [tourStep])
  const highlightIds = tourPath.length ? tourPath : tracePath
  useEffect(() => { if (highlightFromUrl.current) { highlightFromUrl.current = false; return } setTracePath([]) }, [selectedNodeId])
  useEffect(() => {
    if (!tourStep) return
    clearFilters()
    if (tourStep.projection === 'questions') { setProjection('questions'); return }
    if (tourStep.select) { if (tourStep.select !== selectedNodeId) selectNode(tourStep.select); else setProjection('atlas') }
    else { setSelectedNodeId(undefined); setFocusAnchorId(undefined); setLayout(tourStep.layout ?? 'ontology'); setProjection('atlas') }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour?.id, tour?.step])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(open => !open) }
      if (event.key === 'Escape') { setShowTime(false); setMobileControls(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  const openFromSearch = (nodeId: string) => {
    setQuery(''); setAuthorityClasses(new Set()); setRegions(new Set());setEffects(new Set());setSectors(new Set()); setTimeCutoff(maximumPublicationYear)
    if (projection === 'list') setLayout(nodeId.startsWith('risk-') ? 'risk' : nodeId.startsWith('control-') ? 'controls' : 'ontology')
    setSearchOpen(false); selectNode(nodeId)
  }
  useEffect(() => setMobileInspectorExpanded(false), [selectedNodeId])

  // Selections and display changes become browser history entries; filter tweaks replace the current entry.
  const lastNavigation = useRef<string | undefined>(undefined)
  const restoringFromUrl = useRef(false)
  useEffect(() => {
    const view = currentView()
    const base = pathForView(view) + viewUrl(view)
    const [beforeHash, hash = ''] = base.split('#')
    const tourQuery = tour ? `tour=${tour.id}&step=${tour.step}` : ''
    const next = tourQuery ? `${beforeHash}${beforeHash.includes('?') ? '&' : '?'}${tourQuery}${hash ? `#${hash}` : ''}` : base
    const navigation = `${view.projection}|${view.selected ?? ''}|${tour ? `${tour.id}:${tour.step}` : ''}`
    const push = lastNavigation.current !== undefined && navigation !== lastNavigation.current && !restoringFromUrl.current
    lastNavigation.current = navigation
    restoringFromUrl.current = false
    if (next === window.location.pathname + window.location.search + window.location.hash) return
    window.history[push ? 'pushState' : 'replaceState'](null, '', next)
  }, [selectedNodeId, layout, projection, query, authorityClasses, regions, effects, sectors, timeCutoff, focusAnchorId, showIncidents, showUseCases, tour])
  useEffect(() => {
    const restore=()=>{if(!universeRoutes.includes(window.location.pathname))return;restoringFromUrl.current=true;restoreView(readView(new URL(window.location.href),maximumPublicationYear));setTour(readTour(new URL(window.location.href)));setTrail([])}
    window.addEventListener('popstate',restore);window.addEventListener('hashchange',restore)
    return()=>{window.removeEventListener('popstate',restore);window.removeEventListener('hashchange',restore)}
  }, [])

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
  const toggleIn = <T,>(set: (update: (current: Set<T>) => Set<T>) => void) => (value: T) => set((current) => { const next = new Set(current); if (next.has(value)) next.delete(value); else next.add(value); return next })
  const toggleEffect = toggleIn<LegalEffect>(setEffects)
  const toggleSector = toggleIn<SectorId>(setSectors)

  const selectedGraphNode = selectedNodeId ? graphModel.nodes.find((node) => node.id === selectedNodeId) : undefined
  const temporalActive = timeCutoff < maximumPublicationYear

  return (
    <main className={`atlas-shell${sidebarCollapsed || presenting ? ' sidebar-collapsed' : ''}${presenting ? ' is-presenting' : ''}${activeTour ? ' is-touring' : ''}${projection==='questions'||projection==='use-cases'?' questions-mode':''}${projection==='use-cases'?' use-cases-mode':''}`} id="main-content">
      <a className="skip-link" href="#atlas-graph">Skip to the map</a>
      <RouteActions>
        <button className="shell-action" type="button" onClick={() => setSearchOpen(true)} aria-label="Search everything"><MagnifyingGlass size={16}/><span>Search</span><kbd>⌘K</kbd></button>
        <button className={`shell-action${temporalActive ? ' header-active' : ''}`} aria-pressed={showTime} aria-label={`What’s new${temporalActive ? ` · ${timeCutoff}` : ''}`} type="button" onClick={() => setShowTime((open) => !open)}><ClockCounterClockwise size={16}/><span>What’s new{temporalActive ? ` · ${timeCutoff}` : ''}</span></button>
        {projection!=='questions'&&projection!=='use-cases'&&<button className="shell-action mobile-control-button" aria-label="Explore" aria-expanded={mobileControls} type="button" onClick={() => setMobileControls((open) => !open)}>{mobileControls ? <X size={16}/> : <Faders size={16}/>}</button>}
      </RouteActions>

      <div className={selectedNodeId && projection!=='questions' && projection!=='use-cases' ? `atlas-workspace has-selection${mobileInspectorExpanded ? ' mobile-details-open' : ''}` : 'atlas-workspace'}>
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
            effects={effects}
            onToggleEffect={toggleEffect}
            sectors={sectors}
            onToggleSector={toggleSector}
            results={filteredInstruments}
            onSelectInstrument={(id) => { selectNode(`instrument:${id}`); setMobileControls(false) }}
            riskResults={filteredRiskSubdomains}
            controlResults={filteredControls}
            onSelectRisk={(id) => { selectNode(`risk-subdomain:${id}`); setMobileControls(false) }}
            onSelectControl={(id) => { selectNode(`control-objective:${id}`); setMobileControls(false) }}
            onStartTour={(id) => { setTour({ id, step: 0 }); setMobileControls(false) }}
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
          effects={effects}
          onToggleEffect={toggleEffect}
          sectors={sectors}
          onToggleSector={toggleSector}
          results={filteredInstruments}
          onSelectInstrument={(id) => selectNode(`instrument:${id}`)}
          riskResults={filteredRiskSubdomains}
          controlResults={filteredControls}
          onSelectRisk={(id) => selectNode(`risk-subdomain:${id}`)}
          onSelectControl={(id) => selectNode(`control-objective:${id}`)}
          onStartTour={(id) => setTour({ id, step: 0 })}
        />

        <section className={`graph-region${projection === 'focus' ? ' is-focus-list' : ''}${projection === 'list' ? ' is-outline' : ''}`} id="atlas-graph" aria-label="AI Trust ontology graph">
          <div className="view-actions">
            {trail.length>0&&<button type="button" onClick={()=>goBack()} aria-label="Back to previous view"><CaretLeft/>Back</button>}
          </div>
          {(query||((layout==='ontology'||layout==='authority')&&(authorityClasses.size>0||regions.size>0||effects.size>0||sectors.size>0||temporalActive)))&&<div className="active-filters" aria-label="Active filters">
            {query&&<button onClick={()=>setQuery('')} aria-label="Remove search filter">“{query}” <X/></button>}
            {(layout==='ontology'||layout==='authority')&&<>
              {[...authorityClasses].map(a=><button key={a} onClick={()=>toggleAuthority(a)} aria-label={`Remove ${authorityLabels[a]} filter`}>{authorityLabels[a]} <X/></button>)}
              {[...regions].map(r=><button key={r} onClick={()=>toggleRegion(r)} aria-label={`Remove ${r} filter`}>{r} <X/></button>)}
              {[...effects].map(e=><button key={e} onClick={()=>toggleEffect(e)} aria-label={`Remove ${legalEffectLabels[e]} filter`}>{legalEffectLabels[e]} <X/></button>)}
              {[...sectors].map(x=><button key={x} onClick={()=>toggleSector(x)} aria-label={`Remove ${sectorLabels[x]} filter`}>{sectorLabels[x]} <X/></button>)}
              {temporalActive&&<button onClick={()=>setTimeCutoff(maximumPublicationYear)}>Through {timeCutoff} <X/></button>}
            </>}
            <button onClick={clearFilters}>Clear all</button>
          </div>}
          {(layout==='risk'?filteredRiskSubdomains.length===0:layout==='controls'?filteredControls.length===0:filteredInstruments.length===0)&&<div className="atlas-empty" role="status"><strong>No {layout==='risk'?'risks':layout==='controls'?'controls':'sources'} match these filters</strong><p>Remove a filter above or clear them to explore again.</p><button onClick={clearFilters}>Clear filters</button></div>}
          <div className="observatory-frame" aria-hidden="true"><i /><i /><i /></div>
          <button className="sidebar-collapse" type="button" aria-label={sidebarCollapsed ? 'Expand left panel' : 'Collapse left panel'} aria-expanded={!sidebarCollapsed} onClick={() => setSidebarCollapsed(value => !value)}>{sidebarCollapsed ? <CaretRight /> : <CaretLeft />}</button>
          {!activeTour && selectedNodeId && selectedGraphNode && projection === 'atlas' && <div className="path-narrative" aria-live="polite">
            <span>You’re exploring</span><strong>{selectedGraphNode.shortLabel}</strong><small>Connected items are highlighted. Open an item to learn more.</small>
          </div>}
          <Universe navigationRef={graphNavigation} focusRequest={newsFocus} showSourceLabels={authorityClasses.size > 0 && (layout === 'ontology' || layout === 'authority')} model={graphModel} selectedNodeId={selectedNodeId} onSelect={selectNode} inactive={projection !== 'atlas'} highlightIds={highlightIds} />
          {presenting && !activeTour && projection === 'atlas' && <PresenterDock onStart={(id) => setTour({ id, step: 0 })} onExit={() => setPresenting(false)} />}
          {activeTour && tour && <TourPlayer tour={activeTour} step={tour.step} onStep={(step) => setTour({ id: activeTour.id, step: Math.max(0, Math.min(activeTour.steps.length - 1, step)) })} onExit={() => setTour(undefined)} />}
          {projection!=='questions'&&projection!=='use-cases'&&<div className="projection-switch" role="group" aria-label="Universe display"><button type="button" aria-pressed={projection === 'atlas'} onClick={() => changeProjection('atlas')}>Universe</button><button type="button" aria-pressed={projection === 'list'} onClick={() => changeProjection('list')}>List</button></div>}
          <UseCasesView active={projection==='use-cases'} onExplore={id=>{clearFilters();selectNode(id)}} onShowUniverse={()=>{clearFilters();setSelectedNodeId(undefined);setShowUseCases(true);setLayout('ontology');changeProjection('atlas')}}/>
          <QuestionsView active={projection==='questions'} onExplore={id=>{setQuery('');setAuthorityClasses(new Set());setRegions(new Set());setEffects(new Set());setSectors(new Set());setTimeCutoff(maximumPublicationYear);selectNode(id)}}/>
          <UniverseOutline mode={layout} sources={focusEligibleInstruments} query={query} selected={selectedNodeId} onSelect={selectNode} active={projection === 'list'} />
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
            {(showUseCases||selectedNodeId?.startsWith('use-case:'))&&<span><i className="shape-use-case"/>Use case</span>}
            {showIncidents && <span><i className="shape-incident" />Incident</span>}
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

        {projection!=='questions'&&projection!=='use-cases'&&<Inspector
          navigation={<nav className="detail-trail" aria-label="Recently explored">{trail.filter(v=>v.selected&&v.selected!==selectedNodeId).slice(-2).map((v)=>{const index=trail.indexOf(v);return <button key={index} onClick={()=>goBack(index)}>{objectById.get(v.selected!)?.name}<CaretRight/></button>})}<span>{selectedNodeId?objectById.get(selectedNodeId)?.name:''}</span></nav>}
          onBack={trail.length?()=>goBack():undefined}
          selectedNodeId={selectedNodeId}
          onClose={() => selectNode(undefined)}
          onSelectNode={selectNode}
          causalLens={causalLens}
          onTrace={setTracePath}
          onShowRelated={selectedNodeId ? () => { rememberView(); setFocusAnchorId(selectedNodeId); setProjection('focus'); setMobileInspectorExpanded(false) } : undefined}
          mobileExpanded={mobileInspectorExpanded}
          onMobileExpandedChange={setMobileInspectorExpanded}
        />}
      </div>

      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} onSelect={openFromSearch}/>}

      <TemporalLens onSelect={(id) => { rememberView(); setQuery(''); setAuthorityClasses(new Set()); setRegions(new Set());setEffects(new Set());setSectors(new Set()); setTimeCutoff(maximumPublicationYear); setLayout('ontology'); setProjection('atlas'); setSelectedNodeId(id); setFocusAnchorId(id); setNewsFocus(n => n + 1) }} open={showTime} instruments={instruments} onClose={() => setShowTime(false)} />

    </main>
  )
}

