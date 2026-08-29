import { ArrowsOut, Minus, Plus } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { GraphModel, GraphNode } from '../types'

type Camera = { x: number; y: number; scale: number }

type Props = {
  model: GraphModel
  selectedNodeId?: string
  onSelect: (nodeId?: string) => void
}

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value))
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount
const initialScale = 0.34

const fitScaleForModel = (model: GraphModel, width: number, height: number) => {
  const extent = model.nodes.reduce((largest, node) => Math.max(largest, Math.abs(node.targetX) + node.radius * 2, Math.abs(node.targetY) + node.radius * 2), 1)
  return clamp((Math.min(width, height) * 0.96) / (extent * 2), 0.22, 0.86)
}

function polygonPath(context: CanvasRenderingContext2D, x: number, y: number, radius: number, sides: number, rotation = 0) {
  context.beginPath()
  for (let index = 0; index < sides; index += 1) {
    const angle = rotation + (index / sides) * Math.PI * 2
    const px = x + Math.cos(angle) * radius
    const py = y + Math.sin(angle) * radius
    if (index === 0) context.moveTo(px, py)
    else context.lineTo(px, py)
  }
  context.closePath()
}

function drawWrappedLabel(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (context.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else current = test
  }
  if (current) lines.push(current)
  lines.slice(0, 2).forEach((line, index) => context.fillText(line, x, y + index * lineHeight))
}

export function GraphCanvas({ model, selectedNodeId, onSelect }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const modelRef = useRef(model)
  const nodePositionsRef = useRef(new Map<string, { x: number; y: number }>())
  const cameraRef = useRef<Camera>({ x: 0, y: 0, scale: initialScale })
  const cameraTargetRef = useRef<Camera>({ x: 0, y: 0, scale: initialScale })
  const dragRef = useRef<{ active: boolean; moved: boolean; startX: number; startY: number; cameraX: number; cameraY: number }>({ active: false, moved: false, startX: 0, startY: 0, cameraX: 0, cameraY: 0 })
  const [hoveredNodeId, setHoveredNodeId] = useState<string>()
  const hoveredRef = useRef<string | undefined>(undefined)
  const selectedRef = useRef(selectedNodeId)
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  useEffect(() => {
    const previous = nodePositionsRef.current
    const next = new Map<string, { x: number; y: number }>()
    model.nodes.forEach((node) => {
      const existing = previous.get(node.id)
      next.set(node.id, existing ?? { x: node.kind === 'clause' ? node.targetX * 0.92 : node.targetX, y: node.kind === 'clause' ? node.targetY * 0.92 : node.targetY })
    })
    nodePositionsRef.current = next
    modelRef.current = model
    if (!selectedRef.current && wrapRef.current) {
      const bounds = wrapRef.current.getBoundingClientRect()
      cameraTargetRef.current = { x: 0, y: 0, scale: fitScaleForModel(model, bounds.width, bounds.height) }
    }
  }, [model])

  useEffect(() => {
    selectedRef.current = selectedNodeId
    if (!selectedNodeId) {
      const bounds = wrapRef.current?.getBoundingClientRect()
      if (bounds) cameraTargetRef.current = { x: 0, y: 0, scale: fitScaleForModel(model, bounds.width, bounds.height) }
      return
    }
    const node = model.nodes.find((candidate) => candidate.id === selectedNodeId)
    if (!node) return
    cameraTargetRef.current = {
      x: -node.targetX,
      y: -node.targetY,
      scale: node.kind === 'clause' ? 2.3 : node.kind === 'instrument' ? 1.45 : 1.1,
    }
  }, [model.nodes, selectedNodeId])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    let frame = 0
    let width = 1
    let height = 1
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const bounds = wrap.getBoundingClientRect()
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      if (!selectedRef.current) {
        const scale = fitScaleForModel(modelRef.current, width, height)
        cameraRef.current = { x: 0, y: 0, scale }
        cameraTargetRef.current = { x: 0, y: 0, scale }
      }
    }

    const observer = new ResizeObserver(resize)
    observer.observe(wrap)
    resize()

    const render = () => {
      const context = canvas.getContext('2d')
      if (!context) return
      const camera = cameraRef.current
      const targetCamera = cameraTargetRef.current
      const cameraEase = reducedMotion ? 1 : 0.09
      camera.x = lerp(camera.x, targetCamera.x, cameraEase)
      camera.y = lerp(camera.y, targetCamera.y, cameraEase)
      camera.scale = lerp(camera.scale, targetCamera.scale, cameraEase)

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)

      const gradient = context.createRadialGradient(width * 0.52, height * 0.48, 0, width * 0.52, height * 0.48, Math.max(width, height) * 0.68)
      gradient.addColorStop(0, 'rgba(31, 37, 52, 0.7)')
      gradient.addColorStop(0.48, 'rgba(12, 16, 24, 0.88)')
      gradient.addColorStop(1, 'rgba(5, 7, 11, 1)')
      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)

      context.save()
      context.translate(width / 2, height / 2)
      context.scale(camera.scale, camera.scale)
      context.translate(camera.x, camera.y)

      const positions = nodePositionsRef.current
      const currentModel = modelRef.current
      currentModel.nodes.forEach((node) => {
        const position = positions.get(node.id)
        if (!position) return
        const ease = reducedMotion ? 1 : 0.07
        position.x = lerp(position.x, node.targetX, ease)
        position.y = lerp(position.y, node.targetY, ease)
      })

      const nodeMap = new Map(currentModel.nodes.map((node) => [node.id, node]))
      const activeId = hoveredRef.current ?? selectedRef.current
      const adjacent = new Set<string>()
      if (activeId) {
        adjacent.add(activeId)
        currentModel.edges.forEach((edge) => {
          if (edge.sourceId === activeId) adjacent.add(edge.targetId)
          if (edge.targetId === activeId) adjacent.add(edge.sourceId)
        })
      }

      const worldRadius = Math.max(width, height) / camera.scale
      context.strokeStyle = 'rgba(150, 165, 192, 0.055)'
      context.lineWidth = 1 / camera.scale
      for (let ring = 140; ring < worldRadius; ring += 140) {
        context.beginPath()
        context.arc(0, 0, ring, 0, Math.PI * 2)
        context.stroke()
      }

      currentModel.edges.forEach((edge) => {
        const sourceNode = nodeMap.get(edge.sourceId)
        const targetNode = nodeMap.get(edge.targetId)
        const source = positions.get(edge.sourceId)
        const target = positions.get(edge.targetId)
        if (!sourceNode || !targetNode || !source || !target) return
        const isActive = Boolean(activeId && (edge.sourceId === activeId || edge.targetId === activeId))
        const isRelation = Boolean(edge.relationType)
        const baseOpacity = isRelation ? 0.12 : camera.scale > 1 ? 0.065 : 0.035
        context.strokeStyle = isActive ? `${sourceNode.color}cc` : `rgba(160, 175, 202, ${baseOpacity})`
        context.lineWidth = (isActive ? 1.65 : isRelation ? 0.9 : 0.55) / camera.scale
        context.setLineDash(isRelation && !isActive ? [5 / camera.scale, 7 / camera.scale] : [])
        context.beginPath()
        context.moveTo(source.x, source.y)
        const midX = (source.x + target.x) / 2
        const midY = (source.y + target.y) / 2
        const bend = isRelation ? 18 : 5
        const dx = target.x - source.x
        const dy = target.y - source.y
        const length = Math.max(1, Math.hypot(dx, dy))
        context.quadraticCurveTo(midX - (dy / length) * bend, midY + (dx / length) * bend, target.x, target.y)
        context.stroke()
        context.setLineDash([])

        if (isActive && camera.scale > 1.2) {
          context.font = `${10 / camera.scale}px ui-monospace, SFMono-Regular, Menlo, monospace`
          context.textAlign = 'center'
          context.textBaseline = 'middle'
          const labelWidth = context.measureText(edge.label.replaceAll('-', ' ')).width + 14 / camera.scale
          context.fillStyle = 'rgba(6, 9, 14, 0.92)'
          context.fillRect(midX - labelWidth / 2, midY - 9 / camera.scale, labelWidth, 18 / camera.scale)
          context.fillStyle = 'rgba(228, 234, 243, 0.9)'
          context.fillText(edge.label.replaceAll('-', ' '), midX, midY)
        }
      })

      currentModel.nodes.forEach((node) => {
        const position = positions.get(node.id)
        if (!position) return
        const isSelected = selectedRef.current === node.id
        const isHovered = hoveredRef.current === node.id
        const muted = Boolean(activeId && !adjacent.has(node.id))
        const opacity = muted ? 0.16 : 1
        context.globalAlpha = opacity
        const radius = node.radius * (isSelected ? 1.34 : isHovered ? 1.2 : 1)

        if (node.kind === 'domain') {
          context.strokeStyle = `${node.color}${isSelected || isHovered ? 'ff' : '8c'}`
          context.lineWidth = (isSelected || isHovered ? 2.2 : 1.1) / camera.scale
          context.beginPath()
          context.arc(position.x, position.y, radius + 6, 0, Math.PI * 2)
          context.stroke()
          context.fillStyle = `${node.color}22`
          context.beginPath()
          context.arc(position.x, position.y, radius, 0, Math.PI * 2)
          context.fill()
        } else if (node.kind === 'concept') {
          context.fillStyle = node.color
          context.beginPath()
          context.arc(position.x, position.y, radius, 0, Math.PI * 2)
          context.fill()
        } else if (node.kind === 'instrument') {
          polygonPath(context, position.x, position.y, radius, 6, Math.PI / 6)
          context.fillStyle = `${node.color}${node.region === 'Australia' ? 'f2' : 'b8'}`
          context.fill()
          context.strokeStyle = isSelected || isHovered ? '#f2f5f8' : `${node.color}e8`
          context.lineWidth = (isSelected || isHovered ? 2.1 : 0.9) / camera.scale
          context.stroke()
          if (node.region === 'Australia') {
            context.beginPath()
            context.arc(position.x, position.y, radius + 4.5, 0, Math.PI * 2)
            context.strokeStyle = `${node.color}86`
            context.lineWidth = 0.75 / camera.scale
            context.stroke()
          }
        } else {
          polygonPath(context, position.x, position.y, radius, 4, Math.PI / 4)
          context.fillStyle = node.color
          context.fill()
        }

        const showLabel = node.kind === 'domain'
          || isSelected
          || isHovered
          || (node.kind === 'concept' && camera.scale > 0.92)
          || (node.kind === 'instrument' && camera.scale > 1.42)
          || (node.kind === 'clause' && camera.scale > 1.75)
        if (showLabel) {
          const size = node.kind === 'domain' ? 11 : node.kind === 'instrument' ? 9.5 : 8.5
          context.font = `${node.kind === 'domain' ? 650 : 500} ${size / camera.scale}px "Arial Narrow", "Helvetica Neue", sans-serif`
          context.textAlign = 'center'
          context.textBaseline = 'top'
          context.fillStyle = isSelected || isHovered ? '#f5f7fa' : node.kind === 'domain' ? `${node.color}` : 'rgba(218, 225, 235, 0.8)'
          const maxWidth = node.kind === 'domain' ? 118 / camera.scale : 104 / camera.scale
          drawWrappedLabel(context, node.shortLabel, position.x, position.y + radius + 7 / camera.scale, maxWidth, 10.5 / camera.scale)
        }
        context.globalAlpha = 1
      })

      context.restore()
      frame = requestAnimationFrame(render)
    }

    frame = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [reducedMotion])

  const nodeAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const bounds = canvas.getBoundingClientRect()
    const camera = cameraRef.current
    const worldX = (clientX - bounds.left - bounds.width / 2) / camera.scale - camera.x
    const worldY = (clientY - bounds.top - bounds.height / 2) / camera.scale - camera.y
    let nearest: GraphNode | undefined
    let distance = Number.POSITIVE_INFINITY
    for (const node of modelRef.current.nodes) {
      const position = nodePositionsRef.current.get(node.id)
      if (!position) continue
      const candidate = Math.hypot(worldX - position.x, worldY - position.y)
      const hitRadius = Math.max(node.radius + 7 / camera.scale, 11 / camera.scale)
      if (candidate <= hitRadius && candidate < distance) {
        nearest = node
        distance = candidate
      }
    }
    return nearest
  }

  const updateHover = (nodeId?: string) => {
    if (hoveredRef.current === nodeId) return
    hoveredRef.current = nodeId
    setHoveredNodeId(nodeId)
  }

  const zoomBy = (factor: number) => {
    const target = cameraTargetRef.current
    cameraTargetRef.current = { ...target, scale: clamp(target.scale * factor, 0.22, 3.8) }
  }

  const resetCamera = () => {
    const bounds = wrapRef.current?.getBoundingClientRect()
    const scale = bounds ? fitScaleForModel(modelRef.current, bounds.width, bounds.height) : initialScale
    cameraTargetRef.current = { x: 0, y: 0, scale }
    onSelect(undefined)
  }

  return (
    <div className="graph-stage" ref={wrapRef} data-hovered={hoveredNodeId ?? ''}>
      <canvas
        ref={canvasRef}
        aria-label="Interactive map of AI regulations, standards, frameworks, concepts and clauses"
        tabIndex={0}
        onPointerDown={(event) => {
          const camera = cameraTargetRef.current
          dragRef.current = { active: true, moved: false, startX: event.clientX, startY: event.clientY, cameraX: camera.x, cameraY: camera.y }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current
          if (drag.active) {
            const dx = event.clientX - drag.startX
            const dy = event.clientY - drag.startY
            if (Math.hypot(dx, dy) > 3) drag.moved = true
            cameraTargetRef.current = { ...cameraTargetRef.current, x: drag.cameraX + dx / cameraTargetRef.current.scale, y: drag.cameraY + dy / cameraTargetRef.current.scale }
            updateHover(undefined)
            return
          }
          const node = nodeAt(event.clientX, event.clientY)
          updateHover(node?.id)
        }}
        onPointerUp={(event) => {
          const drag = dragRef.current
          drag.active = false
          event.currentTarget.releasePointerCapture(event.pointerId)
          if (!drag.moved) onSelect(nodeAt(event.clientX, event.clientY)?.id)
        }}
        onPointerLeave={() => {
          dragRef.current.active = false
          updateHover(undefined)
        }}
        onDoubleClick={(event) => {
          const node = nodeAt(event.clientX, event.clientY)
          if (node) onSelect(node.id)
          zoomBy(1.32)
        }}
        onWheel={(event) => {
          event.preventDefault()
          const canvas = canvasRef.current
          if (!canvas) return
          const bounds = canvas.getBoundingClientRect()
          const target = cameraTargetRef.current
          const beforeX = (event.clientX - bounds.left - bounds.width / 2) / target.scale - target.x
          const beforeY = (event.clientY - bounds.top - bounds.height / 2) / target.scale - target.y
          const nextScale = clamp(target.scale * Math.exp(-event.deltaY * 0.0012), 0.22, 3.8)
          const afterX = (event.clientX - bounds.left - bounds.width / 2) / nextScale - target.x
          const afterY = (event.clientY - bounds.top - bounds.height / 2) / nextScale - target.y
          cameraTargetRef.current = { x: target.x + afterX - beforeX, y: target.y + afterY - beforeY, scale: nextScale }
        }}
      />
      <div className="graph-controls" role="toolbar" aria-label="Graph view controls">
        <button type="button" onClick={() => zoomBy(1.25)} aria-label="Zoom in"><Plus weight="bold" /></button>
        <button type="button" onClick={() => zoomBy(0.8)} aria-label="Zoom out"><Minus weight="bold" /></button>
        <button type="button" onClick={resetCamera} aria-label="Reset graph view"><ArrowsOut /></button>
      </div>
      <p className="graph-hint" aria-hidden="true">Drag to move. Wheel to zoom. Select a node to reveal its structure.</p>
    </div>
  )
}
