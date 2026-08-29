import { ArrowsOut, Minus, Plus } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { GraphModel, GraphNode } from '../types'

type Camera = { x: number; y: number; scale: number }
type Point3D = { x: number; y: number; z: number }
type Rotation = { yaw: number; pitch: number }
type ProjectedPoint = { x: number; y: number; depth: number; scale: number }

type Props = {
  model: GraphModel
  selectedNodeId?: string
  onSelect: (nodeId?: string) => void
}

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value))
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount
const initialScale = 0.52
const initialRotation: Rotation = { yaw: -0.16, pitch: -0.1 }

const modelRadius = (model: GraphModel) => model.nodes.reduce((largest, node) => {
  if (node.kind === 'clause') return largest
  return Math.max(largest, Math.hypot(node.targetX, node.targetY, node.targetZ) + node.radius * 2)
}, 1)

const fitScaleForModel = (model: GraphModel, width: number, height: number) => {
  const extent = modelRadius(model) * 1.18
  return clamp((Math.min(width, height) * 0.9) / (extent * 2), 0.28, 0.92)
}

const projectPoint = (point: Point3D, rotation: Rotation, radius: number): ProjectedPoint => {
  const cosYaw = Math.cos(rotation.yaw)
  const sinYaw = Math.sin(rotation.yaw)
  const yawX = point.x * cosYaw + point.z * sinYaw
  const yawZ = -point.x * sinYaw + point.z * cosYaw
  const cosPitch = Math.cos(rotation.pitch)
  const sinPitch = Math.sin(rotation.pitch)
  const pitchY = point.y * cosPitch - yawZ * sinPitch
  const pitchZ = point.y * sinPitch + yawZ * cosPitch
  const perspective = 1 + clamp(pitchZ / Math.max(radius * 3.2, 1), -0.22, 0.22)
  return { x: yawX * perspective, y: pitchY * perspective, depth: pitchZ, scale: perspective }
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

function drawProjectedPath(
  context: CanvasRenderingContext2D,
  points: Point3D[],
  rotation: Rotation,
  radius: number,
  cameraScale: number,
  opacity: number,
) {
  context.beginPath()
  points.forEach((point, index) => {
    const projected = projectPoint(point, rotation, radius)
    if (index === 0) context.moveTo(projected.x, projected.y)
    else context.lineTo(projected.x, projected.y)
  })
  context.strokeStyle = `rgba(142, 158, 184, ${opacity})`
  context.lineWidth = 0.72 / cameraScale
  context.stroke()
}

function drawOrbitalGrid(context: CanvasRenderingContext2D, rotation: Rotation, radius: number, cameraScale: number) {
  const samples = 84
  const angles = Array.from({ length: samples + 1 }, (_, index) => (index / samples) * Math.PI * 2)

  for (const latitude of [-0.62, -0.3, 0, 0.3, 0.62]) {
    const ringRadius = radius * Math.cos(latitude)
    const y = radius * Math.sin(latitude)
    drawProjectedPath(context, angles.map((angle) => ({ x: Math.cos(angle) * ringRadius, y, z: Math.sin(angle) * ringRadius })), rotation, radius, cameraScale, latitude === 0 ? 0.12 : 0.06)
  }

  for (let longitude = 0; longitude < Math.PI; longitude += Math.PI / 6) {
    drawProjectedPath(context, angles.map((angle) => ({
      x: Math.cos(angle) * radius * Math.cos(longitude),
      y: Math.sin(angle) * radius,
      z: Math.cos(angle) * radius * Math.sin(longitude),
    })), rotation, radius, cameraScale, 0.052)
  }
}

function drawTrustCore(context: CanvasRenderingContext2D, cameraScale: number, elapsed: number, reducedMotion: boolean) {
  const pulse = reducedMotion ? 0.28 : (Math.sin(elapsed * 0.0022) + 1) / 2
  const coreRadius = 34
  const haloRadius = 53 + pulse * 10

  context.save()
  context.globalCompositeOperation = 'screen'

  const halo = context.createRadialGradient(0, 0, 0, 0, 0, haloRadius)
  halo.addColorStop(0, `rgba(138, 215, 208, ${0.28 + pulse * 0.1})`)
  halo.addColorStop(0.34, `rgba(72, 147, 144, ${0.18 + pulse * 0.08})`)
  halo.addColorStop(1, 'rgba(31, 81, 82, 0)')
  context.fillStyle = halo
  context.beginPath()
  context.arc(0, 0, haloRadius, 0, Math.PI * 2)
  context.fill()

  for (let ring = 0; ring < 2; ring += 1) {
    const radius = coreRadius + 8 + ring * 12 + pulse * (ring + 1) * 2.6
    context.beginPath()
    context.arc(0, 0, radius, 0, Math.PI * 2)
    context.strokeStyle = `rgba(138, 215, 208, ${0.2 - ring * 0.07})`
    context.lineWidth = 0.85 / cameraScale
    context.stroke()
  }

  context.shadowColor = 'rgba(138, 215, 208, 0.72)'
  context.shadowBlur = (16 + pulse * 8) / cameraScale
  const core = context.createRadialGradient(-9, -11, 1, 0, 0, coreRadius)
  core.addColorStop(0, '#d9fbf7')
  core.addColorStop(0.18, '#8ad7d0')
  core.addColorStop(0.56, '#1d6765')
  core.addColorStop(1, '#0a2022')
  context.fillStyle = core
  context.beginPath()
  context.arc(0, 0, coreRadius + pulse * 1.6, 0, Math.PI * 2)
  context.fill()
  context.shadowBlur = 0

  context.globalCompositeOperation = 'source-over'
  context.strokeStyle = 'rgba(213, 247, 243, 0.7)'
  context.lineWidth = 0.8 / cameraScale
  context.beginPath()
  context.arc(0, 0, coreRadius, 0, Math.PI * 2)
  context.stroke()

  context.fillStyle = '#f2fffd'
  context.font = `650 ${10.5 / cameraScale}px "Arial Narrow", "Helvetica Neue", sans-serif`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText('AI TRUST', 0, -1 / cameraScale)
  context.fillStyle = 'rgba(214, 246, 242, 0.64)'
  context.font = `${6.5 / cameraScale}px ui-monospace, "SFMono-Regular", Menlo, monospace`
  context.fillText('CENTRE', 0, 11 / cameraScale)
  context.restore()
}

export function GraphCanvas({ model, selectedNodeId, onSelect }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const modelRef = useRef(model)
  const nodePositionsRef = useRef(new Map<string, Point3D>())
  const projectedPositionsRef = useRef(new Map<string, ProjectedPoint>())
  const cameraRef = useRef<Camera>({ x: 0, y: 0, scale: initialScale })
  const cameraTargetRef = useRef<Camera>({ x: 0, y: 0, scale: initialScale })
  const rotationRef = useRef<Rotation>({ ...initialRotation })
  const rotationTargetRef = useRef<Rotation>({ ...initialRotation })
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    startYaw: initialRotation.yaw,
    startPitch: initialRotation.pitch,
    velocityYaw: 0,
    velocityPitch: 0,
  })
  const [hoveredNodeId, setHoveredNodeId] = useState<string>()
  const hoveredRef = useRef<string | undefined>(undefined)
  const selectedRef = useRef(selectedNodeId)
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  useEffect(() => {
    const previous = nodePositionsRef.current
    const next = new Map<string, Point3D>()
    model.nodes.forEach((node) => {
      const existing = previous.get(node.id)
      next.set(node.id, existing ?? {
        x: node.kind === 'clause' ? node.targetX * 0.94 : node.targetX,
        y: node.kind === 'clause' ? node.targetY * 0.94 : node.targetY,
        z: node.kind === 'clause' ? node.targetZ * 0.94 : node.targetZ,
      })
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
    const bounds = wrapRef.current?.getBoundingClientRect()
    if (bounds) cameraTargetRef.current = { x: 0, y: 0, scale: fitScaleForModel(model, bounds.width, bounds.height) }
  }, [model, selectedNodeId])

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

    const render = (elapsed = 0) => {
      const context = canvas.getContext('2d')
      if (!context) return
      const camera = cameraRef.current
      const targetCamera = cameraTargetRef.current
      const rotation = rotationRef.current
      const targetRotation = rotationTargetRef.current
      const cameraEase = reducedMotion ? 1 : 0.09
      const rotationEase = reducedMotion ? 1 : 0.075
      camera.x = lerp(camera.x, targetCamera.x, cameraEase)
      camera.y = lerp(camera.y, targetCamera.y, cameraEase)
      camera.scale = lerp(camera.scale, targetCamera.scale, cameraEase)
      rotation.yaw = lerp(rotation.yaw, targetRotation.yaw, rotationEase)
      rotation.pitch = lerp(rotation.pitch, targetRotation.pitch, rotationEase)

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)

      const gradient = context.createRadialGradient(width * 0.5, height * 0.48, 0, width * 0.5, height * 0.48, Math.max(width, height) * 0.66)
      gradient.addColorStop(0, 'rgba(29, 36, 51, 0.78)')
      gradient.addColorStop(0.46, 'rgba(11, 16, 24, 0.91)')
      gradient.addColorStop(1, 'rgba(5, 7, 11, 1)')
      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)

      context.save()
      context.translate(width / 2, height / 2)
      context.scale(camera.scale, camera.scale)
      context.translate(camera.x, camera.y)

      const positions = nodePositionsRef.current
      const currentModel = modelRef.current
      const sphereRadius = modelRadius(currentModel) * 1.02
      currentModel.nodes.forEach((node) => {
        const position = positions.get(node.id)
        if (!position) return
        const ease = reducedMotion ? 1 : 0.07
        position.x = lerp(position.x, node.targetX, ease)
        position.y = lerp(position.y, node.targetY, ease)
        position.z = lerp(position.z, node.targetZ, ease)
      })

      const projected = new Map<string, ProjectedPoint>()
      currentModel.nodes.forEach((node) => {
        const position = positions.get(node.id)
        if (position) projected.set(node.id, projectPoint(position, rotation, sphereRadius))
      })
      projectedPositionsRef.current = projected

      drawOrbitalGrid(context, rotation, sphereRadius, camera.scale)

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

      currentModel.edges.forEach((edge) => {
        const sourceNode = nodeMap.get(edge.sourceId)
        const targetNode = nodeMap.get(edge.targetId)
        const source = projected.get(edge.sourceId)
        const target = projected.get(edge.targetId)
        if (!sourceNode || !targetNode || !source || !target) return
        const isActive = Boolean(activeId && (edge.sourceId === activeId || edge.targetId === activeId))
        const isRelation = Boolean(edge.relationType)
        const averageDepth = (source.depth + target.depth) / 2
        const depthOpacity = clamp(0.52 + averageDepth / Math.max(sphereRadius * 2.1, 1), 0.26, 1)
        const baseOpacity = isRelation ? 0.105 : camera.scale > 1 ? 0.07 : 0.038
        context.strokeStyle = isActive ? `${sourceNode.color}dc` : `rgba(151, 169, 196, ${baseOpacity * depthOpacity})`
        context.lineWidth = (isActive ? 1.7 : isRelation ? 0.82 : 0.52) / camera.scale
        context.setLineDash(isRelation && !isActive ? [5 / camera.scale, 7 / camera.scale] : [])
        context.beginPath()
        context.moveTo(source.x, source.y)

        let controlX = (source.x + target.x) / 2
        let controlY = (source.y + target.y) / 2
        if (isRelation) {
          controlX *= 0.26
          controlY *= 0.26
        } else if (sourceNode.kind === 'instrument' || targetNode.kind === 'instrument') {
          const instrumentNode = sourceNode.kind === 'instrument' ? sourceNode : targetNode
          const bundle = projected.get(`domain:${instrumentNode.domainId}`)
          if (bundle) {
            controlX = bundle.x * 0.8
            controlY = bundle.y * 0.8
          }
        }
        context.quadraticCurveTo(controlX, controlY, target.x, target.y)
        context.stroke()
        context.setLineDash([])

        const isClauseEdge = sourceNode.kind === 'clause' || targetNode.kind === 'clause'
        if (isActive && camera.scale > 1 && (isRelation || isClauseEdge)) {
          const labelX = (source.x + target.x) / 2
          const labelY = (source.y + target.y) / 2
          context.font = `${10 / camera.scale}px ui-monospace, SFMono-Regular, Menlo, monospace`
          context.textAlign = 'center'
          context.textBaseline = 'middle'
          const label = edge.label.replaceAll('-', ' ')
          const labelWidth = context.measureText(label).width + 14 / camera.scale
          context.fillStyle = 'rgba(6, 9, 14, 0.93)'
          context.fillRect(labelX - labelWidth / 2, labelY - 9 / camera.scale, labelWidth, 18 / camera.scale)
          context.fillStyle = 'rgba(228, 234, 243, 0.92)'
          context.fillText(label, labelX, labelY)
        }
      })

      drawTrustCore(context, camera.scale, elapsed, reducedMotion)

      const orderedNodes = [...currentModel.nodes].sort((left, right) => (projected.get(left.id)?.depth ?? 0) - (projected.get(right.id)?.depth ?? 0))
      orderedNodes.forEach((node) => {
        const point = projected.get(node.id)
        if (!point) return
        const isSelected = selectedRef.current === node.id
        const isHovered = hoveredRef.current === node.id
        const muted = Boolean(activeId && !adjacent.has(node.id))
        const depthOpacity = clamp(0.62 + point.depth / Math.max(sphereRadius * 2.2, 1), 0.42, 1)
        context.globalAlpha = muted ? 0.12 : depthOpacity
        const radius = node.radius * point.scale * (isSelected ? 1.34 : isHovered ? 1.2 : 1)

        if (isSelected || isHovered) {
          context.shadowColor = `${node.color}8a`
          context.shadowBlur = 12 / camera.scale
        }

        if (node.kind === 'domain') {
          context.strokeStyle = `${node.color}${isSelected || isHovered ? 'ff' : '9c'}`
          context.lineWidth = (isSelected || isHovered ? 2.2 : 1.05) / camera.scale
          context.beginPath()
          context.arc(point.x, point.y, radius + 6, 0, Math.PI * 2)
          context.stroke()
          context.fillStyle = `${node.color}26`
          context.beginPath()
          context.arc(point.x, point.y, radius, 0, Math.PI * 2)
          context.fill()
        } else if (node.kind === 'concept') {
          context.fillStyle = node.color
          context.beginPath()
          context.arc(point.x, point.y, radius, 0, Math.PI * 2)
          context.fill()
        } else if (node.kind === 'instrument') {
          polygonPath(context, point.x, point.y, radius, 6, Math.PI / 6)
          context.fillStyle = `${node.color}${node.region === 'Australia' ? 'f4' : 'b8'}`
          context.fill()
          context.strokeStyle = isSelected || isHovered ? '#f2f5f8' : `${node.color}e8`
          context.lineWidth = (isSelected || isHovered ? 2.1 : 0.9) / camera.scale
          context.stroke()
          if (node.region === 'Australia') {
            context.beginPath()
            context.arc(point.x, point.y, radius + 4.5, 0, Math.PI * 2)
            context.strokeStyle = `${node.color}88`
            context.lineWidth = 0.75 / camera.scale
            context.stroke()
          }
        } else {
          polygonPath(context, point.x, point.y, radius, 4, Math.PI / 4)
          context.fillStyle = node.color
          context.fill()
        }
        context.shadowBlur = 0

        const showLabel = node.kind === 'domain'
          || isSelected
          || isHovered
          || (node.kind === 'concept' && camera.scale > 1.58)
          || (node.kind === 'instrument' && camera.scale > 2.05)
          || (node.kind === 'clause' && camera.scale > 1.66)
        if (showLabel) {
          const size = node.kind === 'domain' ? 11 : node.kind === 'instrument' ? 9.5 : 8.5
          context.font = `${node.kind === 'domain' ? 650 : 500} ${size / camera.scale}px "Arial Narrow", "Helvetica Neue", sans-serif`
          context.textAlign = 'center'
          context.textBaseline = 'top'
          context.fillStyle = isSelected || isHovered ? '#f5f7fa' : node.kind === 'domain' ? node.color : 'rgba(218, 225, 235, 0.82)'
          const maxWidth = node.kind === 'domain' ? 118 / camera.scale : 104 / camera.scale
          drawWrappedLabel(context, node.shortLabel, point.x, point.y + radius + 7 / camera.scale, maxWidth, 10.5 / camera.scale)
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
      const point = projectedPositionsRef.current.get(node.id)
      if (!point) continue
      const candidate = Math.hypot(worldX - point.x, worldY - point.y)
      const hitRadius = Math.max(node.radius * point.scale + 7 / camera.scale, 11 / camera.scale)
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
    cameraTargetRef.current = { ...target, scale: clamp(target.scale * factor, 0.26, 3.8) }
  }

  const finishOrbit = () => {
    const drag = dragRef.current
    drag.active = false
    if (!reducedMotion && drag.moved) {
      rotationTargetRef.current = {
        yaw: rotationTargetRef.current.yaw + drag.velocityYaw * 16,
        pitch: clamp(rotationTargetRef.current.pitch + drag.velocityPitch * 12, -0.96, 0.96),
      }
    }
  }

  const resetCamera = () => {
    const bounds = wrapRef.current?.getBoundingClientRect()
    const scale = bounds ? fitScaleForModel(modelRef.current, bounds.width, bounds.height) : initialScale
    cameraTargetRef.current = { x: 0, y: 0, scale }
    rotationTargetRef.current = { ...initialRotation }
    onSelect(undefined)
  }

  return (
    <div className="graph-stage" ref={wrapRef} data-hovered={hoveredNodeId ?? ''}>
      <canvas
        ref={canvasRef}
        aria-label="Interactive orbital map of AI regulations, standards, frameworks, concepts and clauses"
        tabIndex={0}
        onPointerDown={(event) => {
          const rotation = rotationTargetRef.current
          dragRef.current = {
            active: true,
            moved: false,
            startX: event.clientX,
            startY: event.clientY,
            lastX: event.clientX,
            lastY: event.clientY,
            startYaw: rotation.yaw,
            startPitch: rotation.pitch,
            velocityYaw: 0,
            velocityPitch: 0,
          }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current
          if (drag.active) {
            const dx = event.clientX - drag.startX
            const dy = event.clientY - drag.startY
            if (Math.hypot(dx, dy) > 3) drag.moved = true
            drag.velocityYaw = (event.clientX - drag.lastX) * 0.0025
            drag.velocityPitch = (event.clientY - drag.lastY) * 0.002
            drag.lastX = event.clientX
            drag.lastY = event.clientY
            rotationTargetRef.current = {
              yaw: drag.startYaw + dx * 0.004,
              pitch: clamp(drag.startPitch + dy * 0.0032, -0.96, 0.96),
            }
            updateHover(undefined)
            return
          }
          const node = nodeAt(event.clientX, event.clientY)
          updateHover(node?.id)
        }}
        onPointerUp={(event) => {
          const moved = dragRef.current.moved
          finishOrbit()
          event.currentTarget.releasePointerCapture(event.pointerId)
          if (!moved) onSelect(nodeAt(event.clientX, event.clientY)?.id)
        }}
        onPointerLeave={() => {
          finishOrbit()
          updateHover(undefined)
        }}
        onDoubleClick={(event) => {
          const node = nodeAt(event.clientX, event.clientY)
          if (node) onSelect(node.id)
          zoomBy(1.28)
        }}
        onWheel={(event) => {
          event.preventDefault()
          const canvas = canvasRef.current
          if (!canvas) return
          const bounds = canvas.getBoundingClientRect()
          const target = cameraTargetRef.current
          const beforeX = (event.clientX - bounds.left - bounds.width / 2) / target.scale - target.x
          const beforeY = (event.clientY - bounds.top - bounds.height / 2) / target.scale - target.y
          const nextScale = clamp(target.scale * Math.exp(-event.deltaY * 0.0012), 0.26, 3.8)
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
      <p className="graph-hint" aria-hidden="true">Drag to orbit. Wheel to zoom. Select a node to reveal its structure.</p>
    </div>
  )
}
