import { ArrowsOut, DownloadSimple, Eye, EyeSlash, Minus, Pause, Play, Plus, Target } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { GraphModel } from '../types'
import { UniverseEngine } from './engine'
import { nodeStyle, placeLabels, type LabelCandidate } from './geometry'
import { connectionSummary, type UniverseProps } from './shared'
import './universe.css'

const prefersReducedMotion = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function neighbourIds(model: GraphModel, id?: string) {
  const set = new Set<string>()
  if (!id) return set
  for (const edge of model.edges) {
    if (edge.sourceId === id) set.add(edge.targetId)
    if (edge.targetId === id) set.add(edge.sourceId)
  }
  return set
}

export default function WebGLUniverse({ model, selectedNodeId, onSelect, showSourceLabels = false, inactive = false, snapshotRef, navigationRef, focusRequest = 0, highlightIds = [], onContextLost }: UniverseProps & { onContextLost?: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelsRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<UniverseEngine | null>(null)
  const labelPool = useRef(new Map<string, HTMLSpanElement>())
  const pointer = useRef({ x: 0, y: 0, down: false, moved: false })
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | undefined>()
  const [paused, setPaused] = useState(false)
  const [showSynthesis, setShowSynthesis] = useState(true)
  const nodeById = useMemo(() => new Map(model.nodes.map((node) => [node.id, node])), [model])
  const state = useRef({ model, nodeById, selectedNodeId, showSourceLabels, highlightIds })
  state.current = { model, nodeById, selectedNodeId, showSourceLabels, highlightIds }
  const summary = useMemo(() => connectionSummary(model, selectedNodeId), [model, selectedNodeId])

  /* Engine lifecycle */
  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current
    if (!canvas || !wrap) return
    const engine = new UniverseEngine(canvas, { reducedMotion: prefersReducedMotion() })
    engineRef.current = engine
    // Layout size, not getBoundingClientRect: the List transition scales the stage with a CSS transform.
    const resize = () => engine.resize(wrap.clientWidth, wrap.clientHeight)
    resize()
    engine.setModel(state.current.model)
    engine.setSelection(state.current.selectedNodeId)
    engine.fit(false)
    engine.onFrame = () => drawLabels(engine)
    const observer = new ResizeObserver(resize)
    observer.observe(wrap)
    const motion = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : undefined
    const onMotion = () => engine.setReducedMotion(prefersReducedMotion())
    motion?.addEventListener('change', onMotion)
    const lost = (event: Event) => { event.preventDefault(); onContextLost?.() }
    canvas.addEventListener('webglcontextlost', lost)
    return () => {
      observer.disconnect(); motion?.removeEventListener('change', onMotion); canvas.removeEventListener('webglcontextlost', lost)
      engine.dispose(); engineRef.current = null
      labelPool.current.forEach((label) => label.remove()); labelPool.current.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { engineRef.current?.setModel(model) }, [model])
  useEffect(() => { engineRef.current?.setHighlight(highlightIds) }, [highlightIds])
  useEffect(() => { engineRef.current?.setEmphasiseSources(showSourceLabels) }, [showSourceLabels])
  useEffect(() => { engineRef.current?.setInactive(inactive) }, [inactive])
  useEffect(() => { engineRef.current?.setPaused(paused) }, [paused])
  useEffect(() => { engineRef.current?.setShowSynthesis(showSynthesis) }, [showSynthesis])

  /* Selection: emphasise, then travel to it once the layout has moved; return to the overview when cleared. */
  const firstSelection = useRef(true)
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return
    engine.setSelection(selectedNodeId)
    const initial = firstSelection.current
    firstSelection.current = false
    const timer = window.setTimeout(() => { if (selectedNodeId) engine.flyTo(selectedNodeId); else if (!initial) engine.fit() }, initial ? 450 : 260)
    return () => window.clearTimeout(timer)
  }, [selectedNodeId])

  useEffect(() => {
    if (!focusRequest) return
    const timer = window.setTimeout(() => { const id = state.current.selectedNodeId; if (id) engineRef.current?.flyTo(id) }, 350)
    return () => window.clearTimeout(timer)
  }, [focusRequest])

  useEffect(() => {
    if (!navigationRef) return
    navigationRef.current = { capture: () => engineRef.current?.capture(), restore: (pose) => engineRef.current?.restore(pose) }
    return () => { navigationRef.current = null }
  }, [navigationRef])

  if (snapshotRef) snapshotRef.current = () => {
    const result = new Map()
    const engine = engineRef.current, bounds = wrapRef.current?.getBoundingClientRect()
    if (!engine || !bounds) return result
    for (const point of engine.project()) {
      const node = nodeById.get(point.id)
      if (node && point.visible) result.set(point.id, { x: bounds.left + point.x, y: bounds.top + point.y, color: node.color, kind: node.kind, label: node.shortLabel })
    }
    return result
  }

  /* Labels are positioned imperatively every frame to avoid React renders at 60fps. */
  function drawLabels(engine: UniverseEngine) {
    const container = labelsRef.current
    if (!container) return
    const core = coreRef.current
    if (core) {
      const origin = engine.projectPoint({ x: 0, y: 0, z: 0 })
      const size = Math.max(44, Math.min(140, origin.unit * 70))
      core.hidden = !origin.visible
      core.style.transform = `translate(${Math.round(origin.x - size / 2)}px, ${Math.round(origin.y - size / 2)}px)`
      core.style.width = core.style.height = `${Math.round(size)}px`
      core.style.fontSize = `${Math.round(Math.max(9, size * 0.14))}px`
    }
    const { model: current, nodeById: nodes, selectedNodeId: selected, showSourceLabels: sources, highlightIds: path } = state.current
    const near = neighbourIds(current, selected)
    const pathSet = new Set(path)
    const distance = engine.cameraDistance()
    const candidates: LabelCandidate[] = []
    const hovered = hoverRef.current
    // Presenting enlarges type for projectors; narrow screens show fewer labels and none cut off at the edge.
    const scale = document.documentElement.hasAttribute('data-stage') ? 1.25 : 1
    const viewWidth = wrapRef.current?.clientWidth ?? 0
    const narrow = viewWidth < 640
    for (const point of engine.project()) {
      if (!point.visible || point.alpha < 0.35) continue
      const node = nodes.get(point.id)
      if (!node) continue
      const rank = nodeStyle[node.kind].rank
      let priority = -1
      if (node.id === selected) priority = 1000
      else if (node.id === hovered) priority = 950
      else if (pathSet.has(node.id)) priority = 900
      else if (near.has(node.id)) priority = 600 - rank * 50
      else if (rank === 0) priority = 500
      else if (rank === 1 && distance < 1500) priority = 300
      else if (rank === 2 && (sources || distance < 720)) priority = 200
      else if (rank === 3 && distance < 520) priority = 100
      if (priority < 0) continue
      const charWidth = (rank === 0 || node.id === selected ? 8.2 : 6.6) * scale
      const halfWidth = (node.shortLabel.length * charWidth + 14) / 2
      if (priority < 900 && (point.x - halfWidth < 4 || point.x + halfWidth > viewWidth - 4)) continue
      candidates.push({ id: node.id, x: point.x, y: point.y, radius: point.radius, text: node.shortLabel, priority: priority + point.radius, charWidth })
    }
    const placed = placeLabels(candidates, narrow ? 16 : scale > 1 ? 34 : 46, 7 * scale, 18 * scale)
    const seen = new Set<string>()
    for (const label of placed) {
      seen.add(label.id)
      let element = labelPool.current.get(label.id)
      if (!element) {
        element = document.createElement('span')
        element.className = 'universe-label'
        container.appendChild(element)
        labelPool.current.set(label.id, element)
      }
      const node = nodes.get(label.id)!
      element.textContent = label.text
      element.dataset.rank = String(nodeStyle[node.kind].rank)
      element.dataset.state = label.id === selected ? 'selected' : pathSet.has(label.id) ? 'path' : label.id === hovered ? 'hover' : near.has(label.id) ? 'near' : ''
      element.style.transform = `translate(${Math.round(label.x - label.width / 2)}px, ${Math.round(label.y + label.radius + 4)}px)`
      element.hidden = false
    }
    labelPool.current.forEach((element, id) => { if (!seen.has(id)) element.hidden = true })
  }

  const hoverRef = useRef<string | undefined>(undefined)
  const updateHover = (id: string | undefined, x = 0, y = 0) => {
    const changed = hoverRef.current !== id
    hoverRef.current = id
    engineRef.current?.setHover(id)
    if (changed || id) setHover(id ? { id, x, y } : undefined)
  }

  const localPoint = (event: { clientX: number; clientY: number }) => {
    const bounds = canvasRef.current!.getBoundingClientRect()
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
  }

  const cycle = (direction: number) => {
    const engine = engineRef.current
    if (!engine) return
    const selected = state.current.selectedNodeId
    const near = [...neighbourIds(model, selected)]
    const pool = near.length ? near : model.nodes.map((node) => node.id)
    const projected = new Map(engine.project().map((point) => [point.id, point]))
    const origin = selected ? projected.get(selected) : undefined
    const ordered = origin ? [...pool].sort((a, b) => {
      const pa = projected.get(a), pb = projected.get(b)
      return Math.atan2((pa?.y ?? 0) - origin.y, (pa?.x ?? 0) - origin.x) - Math.atan2((pb?.y ?? 0) - origin.y, (pb?.x ?? 0) - origin.x)
    }) : pool
    const current = keyboardCursor.current && ordered.includes(keyboardCursor.current) ? ordered.indexOf(keyboardCursor.current) : -1
    const next = ordered[(current + direction + ordered.length) % ordered.length]
    keyboardCursor.current = next
    if (near.length) { updateHover(next); const point = projected.get(next); if (point) setHover({ id: next, x: point.x, y: point.y }) }
    else onSelect(next)
  }
  const keyboardCursor = useRef<string | undefined>(undefined)

  const download = () => {
    const engine = engineRef.current
    if (!engine) return
    const title = selectedNodeId ? nodeById.get(selectedNodeId)?.label ?? 'AI Trust Atlas' : 'The AI Trust universe'
    const link = document.createElement('a')
    link.href = engine.snapshot(title)
    link.download = `ai-trust-atlas-${(selectedNodeId ?? 'universe').replace(/[^a-z0-9]+/gi, '-')}.png`
    link.click()
  }

  const hoverNode = hover ? nodeById.get(hover.id) : undefined

  return (
    <div className="graph-stage universe-webgl" ref={wrapRef} inert={inactive || undefined} aria-hidden={inactive || undefined} data-hovered={hover?.id ?? ''}>
      <canvas
        ref={canvasRef}
        aria-label="Interactive orbital map of AI requirements, risks, controls, concepts and specific sections"
        aria-describedby="graph-accessible-description"
        role="application"
        tabIndex={inactive ? -1 : 0}
        style={{ cursor: hover ? 'pointer' : 'grab' }}
        onKeyDown={(event) => {
          const engine = engineRef.current
          if (!engine) return
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); cycle(1) }
          if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); cycle(-1) }
          if (event.key === 'Enter') { event.preventDefault(); if (hoverRef.current && hoverRef.current !== selectedNodeId) onSelect(hoverRef.current); else if (selectedNodeId) engine.flyTo(selectedNodeId) }
          if (event.key === '+' || event.key === '=') { event.preventDefault(); engine.zoomBy(1.3) }
          if (event.key === '-') { event.preventDefault(); engine.zoomBy(0.77) }
          if (event.key === '0') { event.preventDefault(); engine.fit() }
          if (event.key === 'Escape') { event.preventDefault(); updateHover(undefined); onSelect(undefined) }
        }}
        onPointerDown={(event) => { pointer.current = { x: event.clientX, y: event.clientY, down: true, moved: false } }}
        onPointerMove={(event) => {
          const engine = engineRef.current
          if (!engine) return
          if (pointer.current.down && Math.hypot(event.clientX - pointer.current.x, event.clientY - pointer.current.y) > 5) pointer.current.moved = true
          if (pointer.current.down) return
          const point = localPoint(event)
          updateHover(engine.pick(point.x, point.y), point.x, point.y)
        }}
        onPointerUp={(event) => {
          const engine = engineRef.current
          const wasClick = pointer.current.down && !pointer.current.moved
          pointer.current.down = false
          if (!engine || !wasClick || event.button !== 0) return
          const point = localPoint(event)
          const id = engine.pick(point.x, point.y)
          if (id || selectedNodeId) onSelect(id)
        }}
        onPointerLeave={() => { pointer.current.down = false; updateHover(undefined) }}
        onDoubleClick={(event) => {
          const engine = engineRef.current
          if (!engine) return
          const point = localPoint(event)
          const id = engine.pick(point.x, point.y)
          if (id) { onSelect(id); engine.flyTo(id) }
        }}
      />
      <div className="universe-labels" ref={labelsRef} aria-hidden="true"><div className="universe-core" ref={coreRef}><span>AI Trust</span></div></div>
      <p className="sr-only" id="graph-accessible-description" aria-live="polite">{summary}</p>
      {hoverNode && hover && (
        <div className="universe-tooltip" role="status" style={{ transform: `translate(${Math.round(hover.x + 16)}px, ${Math.round(hover.y + 16)}px)` }}>
          <span>{hoverNode.kind.replaceAll('-', ' ')}</span>
          <strong>{hoverNode.label}</strong>
          <small>{hoverNode.id === selectedNodeId ? 'Selected · Enter to focus' : 'Click to inspect'}</small>
        </div>
      )}
      <div className="graph-controls" role="toolbar" aria-label="Graph view controls">
        <button type="button" disabled={!selectedNodeId} onClick={() => selectedNodeId && engineRef.current?.flyTo(selectedNodeId)} aria-label="Focus selected object" title="Focus selected (Enter)"><Target /></button>
        <button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Resume ambient motion' : 'Pause ambient motion'} title={paused ? 'Resume motion' : 'Pause motion'}>{paused ? <Play /> : <Pause />}</button>
        <button className="source-lens-control" type="button" aria-pressed={!showSynthesis} onClick={() => setShowSynthesis((value) => !value)} aria-label={showSynthesis ? 'Show source-explicit relationships only' : 'Show Atlas interpretation relationships'} title={showSynthesis ? 'Showing all links · hide Atlas interpretations' : 'Source-explicit links only'}>{showSynthesis ? <Eye /> : <EyeSlash />}</button>
        <button type="button" onClick={() => engineRef.current?.zoomBy(1.3)} aria-label="Zoom in" title="Zoom in (+)"><Plus weight="bold" /></button>
        <button type="button" onClick={() => engineRef.current?.zoomBy(0.77)} aria-label="Zoom out" title="Zoom out (−)"><Minus weight="bold" /></button>
        <button type="button" onClick={() => { engineRef.current?.fit(); onSelect(undefined) }} aria-label="Reset graph view" title="Reset view (0)"><ArrowsOut /></button>
        <button type="button" onClick={download} aria-label="Download image of this view" title="Download PNG"><DownloadSimple /></button>
      </div>
      <p className="universe-hint" aria-hidden="true">Drag to orbit · right-drag or two fingers to pan · scroll or pinch to zoom · click to inspect</p>
    </div>
  )
}
