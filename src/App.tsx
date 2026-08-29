import { GithubLogo, Info, List, Network, X } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import { ComparePanel } from './components/ComparePanel'
import { GraphCanvas } from './components/GraphCanvas'
import { Inspector } from './components/Inspector'
import { Sidebar } from './components/Sidebar'
import { concepts, domains } from './data/concepts'
import { instruments } from './data/instruments'
import { relations } from './data/relations'
import { buildGraphModel, defaultFilters, type LayoutMode } from './lib/graphModel'
import type { AuthorityClass, Instrument } from './types'

const initialHashSelection = () => {
  const hash = window.location.hash.replace('#/', '')
  if (!hash) return undefined
  const [kind, ...rest] = hash.split('/')
  return ['instrument', 'concept', 'domain', 'clause'].includes(kind) && rest.length ? `${kind}:${rest.join('/')}` : undefined
}

export default function App() {
  const [layout, setLayout] = useState<LayoutMode>('ontology')
  const [query, setQuery] = useState('')
  const [authorityClasses, setAuthorityClasses] = useState<Set<AuthorityClass>>(() => defaultFilters().authorityClasses)
  const [regions, setRegions] = useState<Set<Instrument['region']>>(() => defaultFilters().regions)
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(initialHashSelection)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [mobileControls, setMobileControls] = useState(false)
  const [showMethod, setShowMethod] = useState(false)

  const filteredInstruments = useMemo(() => {
    const normalized = query.toLowerCase().trim()
    return instruments.filter((instrument) => {
      const matchesQuery = !normalized || [instrument.title, instrument.shortTitle, instrument.issuer, instrument.jurisdiction, instrument.summary, ...instrument.sectors].join(' ').toLowerCase().includes(normalized)
      const matchesAuthority = authorityClasses.size === 0 || authorityClasses.has(instrument.authorityClass)
      const matchesRegion = regions.size === 0 || regions.has(instrument.region)
      return matchesQuery && matchesAuthority && matchesRegion
    })
  }, [authorityClasses, query, regions])

  const selectedInstrumentId = useMemo(() => {
    if (!selectedNodeId) return undefined
    const [kind, id] = selectedNodeId.split(':')
    if (kind === 'instrument') return id
    if (kind === 'clause') return instruments.find((instrument) => instrument.clauses.some((clause) => clause.id === id))?.id
    return undefined
  }, [selectedNodeId])

  const graphModel = useMemo(() => buildGraphModel(layout, { query, authorityClasses, regions }), [authorityClasses, layout, query, regions])
  const selectedGraphNodeId = selectedNodeId?.startsWith('clause:') && selectedInstrumentId ? `instrument:${selectedInstrumentId}` : selectedNodeId

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

  const totalClauses = instruments.reduce((count, instrument) => count + instrument.clauses.length, 0)

  return (
    <main className="atlas-shell">
      <header className="atlas-header">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true"><Network weight="duotone" /></div>
          <div>
            <h1>AI Trust Atlas</h1>
            <p>Australia first. Global by design.</p>
          </div>
        </div>
        <div className="corpus-stats" role="group" aria-label="Corpus statistics">
          <div><strong>{instruments.length}</strong><span>instruments</span></div>
          <div><strong>{concepts.length}</strong><span>concepts</span></div>
          <div><strong>{relations.length}</strong><span>explained links</span></div>
          <div><strong>{totalClauses}</strong><span>clause guides</span></div>
        </div>
        <nav className="header-actions" aria-label="Atlas resources">
          <button type="button" onClick={() => setShowMethod(true)}><Info /> Method</button>
          <a href="https://github.com/9to5ai/ai-trust-atlas" target="_blank" rel="noreferrer"><GithubLogo /> Source</a>
          <button className="mobile-control-button" type="button" onClick={() => setMobileControls((open) => !open)}>{mobileControls ? <X /> : <List />}<span>Explore</span></button>
        </nav>
      </header>

      <div className={selectedNodeId ? 'atlas-workspace has-selection' : 'atlas-workspace'}>
        <div className={mobileControls ? 'sidebar-mobile open' : 'sidebar-mobile'} inert={!mobileControls} aria-hidden={!mobileControls}>
          <Sidebar
            query={query}
            onQueryChange={setQuery}
            layout={layout}
            onLayoutChange={setLayout}
            authorityClasses={authorityClasses}
            onToggleAuthority={toggleAuthority}
            regions={regions}
            onToggleRegion={toggleRegion}
            results={filteredInstruments}
            onSelectInstrument={(id) => { setSelectedNodeId(`instrument:${id}`); setMobileControls(false) }}
            totalInstruments={instruments.length}
          />
        </div>
        <Sidebar
          query={query}
          onQueryChange={setQuery}
          layout={layout}
          onLayoutChange={setLayout}
          authorityClasses={authorityClasses}
          onToggleAuthority={toggleAuthority}
          regions={regions}
          onToggleRegion={toggleRegion}
          results={filteredInstruments}
          onSelectInstrument={(id) => setSelectedNodeId(`instrument:${id}`)}
          totalInstruments={instruments.length}
        />

        <section className="graph-region" aria-label="AI Trust ontology graph">
          <div className="graph-title">
            <span>{layout === 'ontology' ? 'Orbital ontology' : 'Authority architecture'}</span>
            <strong>{filteredInstruments.length} instruments connected through {domains.length} trust domains</strong>
          </div>
          <GraphCanvas model={graphModel} selectedNodeId={selectedGraphNodeId} onSelect={setSelectedNodeId} />
          <div className="semantic-key" role="group" aria-label="Graph legend">
            <span><i className="shape-domain" />Domain</span>
            <span><i className="shape-concept" />Concept</span>
            <span><i className="shape-instrument" />Instrument</span>
            <span><i className="shape-clause" />Clause</span>
          </div>
          <div className="corpus-status"><span>Curated public corpus</span><strong>Verified 28 August 2026</strong></div>
        </section>

        <Inspector
          selectedNodeId={selectedNodeId}
          onClose={() => setSelectedNodeId(undefined)}
          onSelectNode={setSelectedNodeId}
          onAddCompare={addCompare}
          compareIds={compareIds}
        />
      </div>

      <ComparePanel compareIds={compareIds} onRemove={(id) => setCompareIds((current) => current.filter((candidate) => candidate !== id))} onClear={() => setCompareIds([])} />

      {showMethod && (
        <div className="method-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowMethod(false) }}>
          <section className="method-dialog" role="dialog" aria-modal="true" aria-labelledby="method-title">
            <button className="inspector-close" type="button" onClick={() => setShowMethod(false)} aria-label="Close methodology"><X /></button>
            <span className="method-label">How to read the atlas</span>
            <h2 id="method-title">Relationships, not equivalence.</h2>
            <p>The atlas decomposes each instrument into shared concepts, then records how instruments require, guide, extend, operationalise or support one another.</p>
            <div className="method-columns">
              <div><strong>Authority stays visible</strong><p>Law, prudential expectations, standards, frameworks, testing resources and threat knowledge remain distinct.</p></div>
              <div><strong>Synthesis is labelled</strong><p>Some links are explicit in source material. Others are cross-framework synthesis with a stated confidence and explanation.</p></div>
              <div><strong>Evidence has limits</strong><p>A framework, policy, certification or test result does not establish legal applicability, control effectiveness or an assurance conclusion.</p></div>
              <div><strong>Human authority remains</strong><p>Accountable people retain materiality, risk appetite, approval, exceptions, residual-risk and assurance decisions.</p></div>
            </div>
            <button className="method-primary" type="button" onClick={() => setShowMethod(false)}>Enter the atlas</button>
          </section>
        </div>
      )}
    </main>
  )
}
