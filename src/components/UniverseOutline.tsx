import { arcticAccents as accents } from '../lib/nodeStyle'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { CaretRight, ArrowsOutLineVertical, Crosshair } from '@phosphor-icons/react'
import { buildOutline, buildSourceDirectory, outlineTrail, flattenOutline, pathToNode } from '../lib/outlineModel'
import type { Instrument, GraphEdge } from '../types'
import type { LayoutMode } from '../lib/graphModel'
export type NodePoint = { x: number; y: number; color: string; kind: string; label: string }
export type NodeSnapshot = Map<string, NodePoint>
export type OutlineHandle = { capture: () => NodeSnapshot }
export type Morph = { from: NodePoint; to: NodePoint; id: string }
export const NodeSymbol = ({ kind, color }: { kind: string; color: string }) => <i aria-hidden="true" className={`outline-symbol kind-${kind}`} style={{ '--node-color': accents[color] ?? color } as CSSProperties}><b /></i>

export function UniverseOutline({ mode, sources, query, selected, onSelect, active, handle, onReady }: { mode: LayoutMode; sources: Instrument[]; query: string; selected?: string; onSelect: (id: string) => void; active: boolean; handle: RefObject<OutlineHandle | null>; onReady: (points: NodeSnapshot) => void }) {
  const [browse, setBrowse] = useState<'topics' | 'sources'>('topics')
  const sourceMode = mode === 'ontology' || mode === 'authority'
  const tree = useMemo(() => sourceMode && browse === 'sources' ? buildSourceDirectory(sources) : buildOutline(mode, sources), [mode, sources, browse, sourceMode])
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [focused, setFocused] = useState('')
  const scroll = useRef<HTMLDivElement>(null)
  const savedScroll = useRef<Record<string, number>>({})
  const root = useRef<HTMLElement>(null)
  const chosenPath = useRef<{ id: string; path: string[] } | undefined>(undefined)
  const trail = selected ? outlineTrail(tree, selected, chosenPath.current?.id === selected ? chosenPath.current.path : undefined) : []
  const shouldScroll = useRef(false)
  const previousSelected = useRef<string | undefined>(undefined)
  const ready = useRef(onReady); ready.current = onReady
  const rows = useMemo(() => flattenOutline(tree, expanded, query), [tree, expanded, query])
  const reveal = () => {
    if (!selected) return
    const path = chosenPath.current?.id === selected ? chosenPath.current.path : pathToNode(tree, selected)
    if (path) { shouldScroll.current = true; setExpanded(old => new Set([...old, ...path.slice(0, -1)])); setFocused(path.at(-1)!); }
  }
  useEffect(() => {
    if (active) reveal()
    previousSelected.current = selected
  }, [selected, tree, active])
  useLayoutEffect(() => {
    const capture = (): NodeSnapshot => {
      const points: NodeSnapshot = new Map()
      const bounds = scroll.current?.getBoundingClientRect()
      root.current?.querySelectorAll<HTMLElement>('[data-outline-node]').forEach(el => {
        const rect = el.getBoundingClientRect(); const id = el.dataset.outlineNode!
        if (!points.has(id) && bounds && rect.top >= bounds.top && rect.bottom <= bounds.bottom) points.set(id, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, color: el.dataset.color!, kind: el.dataset.kind!, label: el.dataset.label! })
      })
      return points
    }
    handle.current = { capture }
    if (active) {
      const target = root.current?.querySelector<HTMLElement>('[data-current="true"]')
      if (target && selected && shouldScroll.current) { shouldScroll.current = false; target.scrollIntoView({ block: 'nearest' }) }
      ready.current(capture())
    }
  }, [active, rows, selected, handle])
  useLayoutEffect(() => {
    if (active && scroll.current) scroll.current.scrollTop = savedScroll.current[mode] ?? 0
  }, [active, mode])
  const toggle = (key: string) => setExpanded(old => { const next = new Set(old); next.has(key) ? next.delete(key) : next.add(key); return next })
  const focusRow = (index: number) => { const row = rows[Math.max(0, Math.min(rows.length - 1, index))]; if (!row) return; setFocused(row.key); root.current?.querySelectorAll<HTMLElement>('[role="treeitem"]')[rows.indexOf(row)]?.focus() }
  return <section ref={root} className={`universe-outline${sourceMode && browse === 'sources' ? ' source-directory' : ''}`} aria-label="Universe list" hidden={!active}>
    <header className="outline-heading"><div><span className="outline-eyebrow">AI TRUST ATLAS</span><h2>{mode === 'risk' ? 'Explore risks' : mode === 'controls' ? 'Explore controls' : 'Explore sources'}</h2><p>{mode === 'ontology' || mode === 'authority' ? browse === 'sources' ? 'Browse sources directly or expand one to read its sections' : 'Topics, concepts and linked sources' : 'Expand a branch to explore its connections'}</p></div><div className="outline-actions"><button type="button" onClick={() => setExpanded(new Set())} aria-label="Collapse all branches"><ArrowsOutLineVertical /></button>{selected && <button type="button" onClick={reveal} aria-label="Reveal selected item"><Crosshair /></button>}</div></header>
    {sourceMode && <div className="outline-browse" aria-label="Browse sources"><button aria-pressed={browse === 'topics'} onClick={() => { chosenPath.current = undefined; setBrowse('topics') }}>By topic</button><button aria-pressed={browse === 'sources'} onClick={() => { chosenPath.current = undefined; setBrowse('sources') }}>All sources · {sources.length}</button><span>{browse === 'topics' ? 'Sources with more supporting sections appear first within each concept.' : 'Alphabetical · one entry per source'}</span></div>}
    {trail.length > 0 && <nav className="outline-breadcrumb" aria-label="Selected item location">{trail.map((node, i) => <span key={node.id}>{i > 0 && <span aria-hidden="true"> / </span>}<button onClick={() => onSelect(node.id)} aria-current={node.id === selected ? 'page' : undefined}>{node.label}</button></span>)}</nav>}
    <div className="outline-scroll" ref={scroll} onScroll={e => { savedScroll.current[mode] = e.currentTarget.scrollTop }}>
      <div role="tree" aria-label="Atlas hierarchy">
        {rows.map((row, index) => { const n = row.node; const open = expanded.has(row.key) || !!query; const isSelected = n.id === selected; const canSelect = n.kind !== 'group'; return <div key={row.key} role="treeitem" aria-level={row.depth + 1} aria-expanded={n.children.length ? open : undefined} aria-selected={canSelect ? isSelected : undefined} tabIndex={(rows.some(r => r.key === focused) ? focused === row.key : index === 0) ? 0 : -1} className={`outline-row depth-${Math.min(row.depth, 3)}${isSelected ? ' selected' : ''}${n.kind === 'group' ? ' relation-group' : ''}`} data-current={focused === row.key && isSelected || undefined} style={{ '--depth': Math.min(row.depth, 5), '--node-color': accents[n.color] ?? n.color } as CSSProperties} onFocus={() => setFocused(row.key)} onKeyDown={e => {
          if (e.key === 'ArrowDown') { e.preventDefault(); focusRow(index + 1) }
          if (e.key === 'ArrowUp') { e.preventDefault(); focusRow(index - 1) }
          if (e.key === 'Home') { e.preventDefault(); focusRow(0) }
          if (e.key === 'End') { e.preventDefault(); focusRow(rows.length - 1) }
          if (e.key === 'ArrowRight') { e.preventDefault(); if (n.children.length && !open) toggle(row.key); else if (n.children.length) focusRow(index + 1) }
          if (e.key === 'ArrowLeft') { e.preventDefault(); if (n.children.length && open) toggle(row.key); else { const parent = rows.findIndex(r => r.key === row.ancestors.at(-1)); if (parent >= 0) focusRow(parent) } }
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); canSelect ? (chosenPath.current = { id: n.id, path: [...row.ancestors, row.key] }, setFocused(row.key), onSelect(n.id)) : toggle(row.key) }
        }}>
          <button tabIndex={-1} className="outline-expand" disabled={!n.children.length} aria-label={`${open ? 'Collapse' : 'Expand'} ${n.label}`} onClick={() => toggle(row.key)}>{n.children.length > 0 && <CaretRight style={{ transform: open ? 'rotate(90deg)' : undefined }} />}</button>
          <button tabIndex={-1} className="outline-select" onClick={() => canSelect ? (chosenPath.current = { id: n.id, path: [...row.ancestors, row.key] }, setFocused(row.key), onSelect(n.id)) : toggle(row.key)} aria-label={n.label}>
            <span className="outline-node-anchor" data-outline-node={n.id} data-color={n.color} data-kind={n.kind} data-label={n.label}><NodeSymbol kind={n.kind} color={n.color} /></span>
            <span className="outline-copy"><strong>{n.label}</strong>{n.meta && <small>{n.meta}</small>}{n.description && <span>{n.description}</span>}</span>
          </button>
          {n.children.length > 0 && <span className="outline-child-count" aria-label={`${n.children.length} children`}>{n.children.length}</span>}
        </div> })}
      </div>
      {!rows.length && <div className="outline-empty">No matching items. Try another search or broaden the filters.</div>}
      {selected && !pathToNode(tree, selected) && <p className="outline-empty">Your selected item is outside these filters. Its details remain open.</p>}
    </div>
  </section>
}

export function UniverseMorph({ nodes, reverse, selected, edges }: { nodes: Morph[]; reverse: boolean; selected?: string; edges: GraphEdge[] }) {
  const reduced = useReducedMotion()
  if (reduced) return null
  const bounds = document.getElementById('atlas-graph')?.getBoundingClientRect()
  const clip = bounds ? { clipPath: `inset(${Math.max(0, bounds.top)}px ${Math.max(0, window.innerWidth - bounds.right)}px ${Math.max(0, window.innerHeight - bounds.bottom)}px ${Math.max(0, bounds.left)}px)` } : undefined
  return <div className="universe-morph" aria-hidden="true" style={clip}><svg className="morph-connections">{edges.flatMap(edge => { const n = nodes.find(n => n.id === edge.targetId); const parent = nodes.find(n => n.id === edge.sourceId); if (!n || !parent) return []; return <motion.path key={edge.id} fill="none" stroke="#9dbad5" strokeWidth=".7" initial={{ d: `M ${parent.from.x} ${parent.from.y} Q ${parent.from.x} ${n.from.y} ${n.from.x} ${n.from.y}`, opacity: .25 }} animate={{ d: `M ${parent.to.x} ${parent.to.y} Q ${parent.to.x} ${n.to.y} ${n.to.x} ${n.to.y}`, opacity: 0 }} transition={{ duration: .75, ease: [.22, 1, .36, 1] }} /> })}</svg>{nodes.map((n, index) => <motion.div key={n.id} className={`morph-node${n.id === selected ? ' selected' : ''}`} initial={{ x: n.from.x - 12, y: n.from.y - 12, opacity: 1, scale: reverse ? 1 : .8 }} animate={{ x: n.to.x - 12, y: n.to.y - 12, opacity: [1, 1, 0], scale: 1 }} transition={{ duration: .72, delay: Math.min(index, 8) * .012, ease: [.22, 1, .36, 1], opacity: { times: [0, .87, 1] } }}><NodeSymbol kind={n.to.kind} color={n.to.color} />{n.id === selected && <span className="morph-selected-label">{n.to.label}</span>}</motion.div>)}</div>
}
