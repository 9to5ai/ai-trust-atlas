import { advancePresence, reconcilePresence, motionStep, type Presence } from '../lib/universeMotion'
import { arcticAccents } from '../lib/nodeStyle'
import type { NodeSnapshot } from './UniverseOutline'
import { ArrowsOut, Eye, EyeSlash, Minus, Pause, Play, Plus, Target } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import type { GraphModel, GraphNode, GraphEdge } from '../types'

type Camera = { x: number; y: number; scale: number }
type Point3D = { x: number; y: number; z: number }
type Rotation = { yaw: number; pitch: number }
type ProjectedPoint = { x: number; y: number; depth: number; scale: number }
type AmbientParticle = Point3D & { opacity: number; phase: number; size: number; tone: number; speed: number }

type Props = {
  model: GraphModel
  selectedNodeId?: string
  onSelect: (nodeId?: string) => void
  showSourceLabels?: boolean
  snapshotRef?: RefObject<(() => NodeSnapshot) | null>
  inactive?: boolean
  focusRequest?: number
}

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value))
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount
// Preserve category identity with mineral accents tuned for the pale Arctic canvas.
const initialScale = 0.52
const initialRotation: Rotation = { yaw: -0.16, pitch: -0.1 }

const modelRadius = (model: GraphModel) => model.nodes.reduce((largest, node) => {
  if (node.kind === 'provision') return largest
  return Math.max(largest, Math.hypot(node.targetX, node.targetY, node.targetZ) + node.radius * 2)
}, 1)

const fitScaleForModel = (model: GraphModel, width: number, height: number) => {
  const extent = modelRadius(model) * 1.12
  return clamp((Math.min(width, height) * 1.02) / (extent * 2), 0.28, 1.02)
}

const seededRandom = (seed: number) => {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return value - Math.floor(value)
}

const ambientParticles: AmbientParticle[] = Array.from({ length: 260 }, (_, index) => {
  const azimuth = seededRandom(index + 1) * Math.PI * 2
  const elevation = Math.acos(seededRandom(index + 401) * 2 - 1)
  const radius = 0.54 + seededRandom(index + 821) * 0.54
  return {
    x: Math.sin(elevation) * Math.cos(azimuth) * radius,
    y: Math.cos(elevation) * radius,
    z: Math.sin(elevation) * Math.sin(azimuth) * radius,
    opacity: 0.12 + seededRandom(index + 1241) * 0.42,
    phase: seededRandom(index + 1661) * Math.PI * 2,
    size: 0.52 + seededRandom(index + 2081) * 1.2,
    tone: Math.floor(seededRandom(index + 2501) * 7),
    speed: 0.32 + seededRandom(index + 2921) * 0.68,
  }
})

const coreParticles: AmbientParticle[] = Array.from({ length: 190 }, (_, index) => {
  const azimuth = seededRandom(index + 3501) * Math.PI * 2
  const elevation = Math.acos(seededRandom(index + 3921) * 2 - 1)
  const radius = Math.pow(seededRandom(index + 4341), 1.45) * 0.37
  return {
    x: Math.sin(elevation) * Math.cos(azimuth) * radius,
    y: Math.cos(elevation) * radius,
    z: Math.sin(elevation) * Math.sin(azimuth) * radius,
    opacity: 0.22 + seededRandom(index + 4761) * 0.54,
    phase: seededRandom(index + 5181) * Math.PI * 2,
    size: 0.72 + seededRandom(index + 5601) * 1.65,
    tone: Math.floor(seededRandom(index + 6021) * 4),
    speed: 0.55 + seededRandom(index + 6441) * 0.9,
  }
})

const meshPoints: Point3D[] = Array.from({ length: 44 }, (_, index) => {
  const y = 1 - (index / 43) * 2
  const radius = Math.sqrt(1 - y * y)
  const theta = Math.PI * (3 - Math.sqrt(5)) * index
  return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius }
})

const meshEdges: [number, number][] = meshPoints.flatMap((point, index) => {
  const neighbours = meshPoints
    .map((candidate, candidateIndex) => ({ candidateIndex, distance: candidateIndex === index ? Number.POSITIVE_INFINITY : Math.hypot(point.x - candidate.x, point.y - candidate.y, point.z - candidate.z) }))
    .sort((left, right) => left.distance - right.distance)
    .slice(0, 3)
    .map(({ candidateIndex }) => candidateIndex)
  return neighbours.filter((candidateIndex) => candidateIndex > index).map((candidateIndex) => [index, candidateIndex] as [number, number])
})

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
  context.strokeStyle = `rgba(71, 108, 150, ${opacity * 1.7})`
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

function drawHexBackdrop(context: CanvasRenderingContext2D, width: number, height: number) {
  const radius = 34
  const columnWidth = radius * 1.5
  const rowHeight = Math.sqrt(3) * radius
  context.save()
  context.beginPath()
  for (let column = -1; column < width / columnWidth + 2; column += 1) {
    for (let row = -1; row < height / rowHeight + 2; row += 1) {
      const x = column * columnWidth
      const y = row * rowHeight + (column % 2 ? rowHeight / 2 : 0)
      for (let side = 0; side < 6; side += 1) {
        const angle = (Math.PI / 3) * side
        const px = x + Math.cos(angle) * radius
        const py = y + Math.sin(angle) * radius
        if (side === 0) context.moveTo(px, py)
        else context.lineTo(px, py)
      }
      context.closePath()
    }
  }
  const meshFade = context.createRadialGradient(width * 0.52, height * 0.48, Math.min(width, height) * 0.2, width * 0.52, height * 0.48, Math.max(width, height) * 0.72)
  meshFade.addColorStop(0, 'rgba(64, 99, 140, 0.105)')
  meshFade.addColorStop(0.58, 'rgba(64, 99, 140, 0.055)')
  meshFade.addColorStop(1, 'rgba(64, 99, 140, 0.01)')
  context.strokeStyle = meshFade
  context.lineWidth = 0.55
  context.stroke()
  context.restore()
}

function drawGeodesicMesh(context: CanvasRenderingContext2D, rotation: Rotation, radius: number, cameraScale: number) {
  const projected = meshPoints.map((point) => projectPoint({ x: point.x * radius, y: point.y * radius, z: point.z * radius }, rotation, radius))
  context.save()
  meshEdges.forEach(([sourceIndex, targetIndex]) => {
    const source = projected[sourceIndex]
    const target = projected[targetIndex]
    const depth = ((source.depth + target.depth) / 2 + radius) / (radius * 2)
    context.beginPath()
    context.moveTo(source.x, source.y)
    context.lineTo(target.x, target.y)
    context.strokeStyle = `rgba(68, 104, 145, ${0.022 + depth * 0.047})`
    context.lineWidth = 0.55 / cameraScale
    context.stroke()
  })
  context.restore()
}

function drawParticleField(
  context: CanvasRenderingContext2D,
  particles: AmbientParticle[],
  rotation: Rotation,
  radius: number,
  cameraScale: number,
  elapsed: number,
  core: boolean,
  reducedMotion: boolean,
) {
  const outerTones = ['72, 103, 137', '98, 130, 161', '70, 106, 158']
  const coreTones = ['74, 115, 179', '67, 113, 160']
  const time = reducedMotion ? 0 : elapsed * 0.00006
  context.save()
  context.globalCompositeOperation = 'source-over'
  particles.forEach((particle) => {
    const angle = time * particle.speed + particle.phase * 0.025
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const sourceX = particle.x * cos - particle.z * sin
    const sourceZ = particle.x * sin + particle.z * cos
    const point = projectPoint({ x: sourceX * radius, y: particle.y * radius, z: sourceZ * radius }, rotation, radius)
    const depth = clamp(0.46 + point.depth / Math.max(radius * 2.05, 1), 0.16, 0.98)
    const shimmer = reducedMotion ? 0.78 : 0.64 + Math.sin(elapsed * 0.0014 * particle.speed + particle.phase) * 0.26
    const alpha = particle.opacity * depth * shimmer * 0.3
    const tone = (core ? coreTones : outerTones)[particle.tone % (core ? coreTones.length : outerTones.length)]
    const particleRadius = particle.size * point.scale / cameraScale
    context.fillStyle = `rgba(${tone}, ${alpha})`
    context.beginPath()
    context.arc(point.x, point.y, particleRadius, 0, Math.PI * 2)
    context.fill()
    if (core && particle.size > 1.72) {
      context.fillStyle = `rgba(244, 255, 252, ${alpha * 0.38})`
      context.beginPath()
      context.arc(point.x, point.y, particleRadius * 2.35, 0, Math.PI * 2)
      context.fill()
    }
  })
  context.restore()
}

function drawTrustCore(context: CanvasRenderingContext2D, cameraScale: number, elapsed: number, reducedMotion: boolean, dark: boolean) {
  context.save()
  const radius = 30 / cameraScale
  const breath = reducedMotion ? 0.5 : (1 - Math.cos(elapsed * Math.PI * 2 / 6400)) / 2
  const haloRadius = radius + (10 + breath * 9) / cameraScale
  const halo = context.createRadialGradient(0, 0, radius, 0, 0, haloRadius + 12 / cameraScale)
  halo.addColorStop(0, `rgba(90, 147, 240, ${0.045 + breath * 0.045})`)
  halo.addColorStop(1, 'rgba(90, 147, 240, 0)')
  context.fillStyle = halo
  context.beginPath(); context.arc(0, 0, haloRadius + 12 / cameraScale, 0, Math.PI * 2); context.fill()
  context.strokeStyle = `rgba(100, 155, 235, ${0.1 + breath * 0.09})`
  context.lineWidth = 0.7 / cameraScale
  context.beginPath(); context.arc(0, 0, haloRadius, 0, Math.PI * 2); context.stroke()
  context.shadowColor = 'rgba(62, 99, 153, 0.14)'
  context.shadowBlur = 22 / cameraScale
  context.fillStyle = dark ? '#142a43' : '#ffffff'
  context.beginPath(); context.arc(0, 0, radius, 0, Math.PI * 2); context.fill()
  context.shadowBlur = 0
  context.strokeStyle = dark ? '#619be3' : '#b9ccec'; context.lineWidth = 1 / cameraScale; context.stroke()
  context.beginPath(); context.arc(0, 0, radius + 8 / cameraScale, 0, Math.PI * 2)
  context.strokeStyle = 'rgba(36, 94, 232, 0.09)'; context.stroke()
  context.fillStyle = dark ? '#b0d4ff' : '#245ee8'
  context.font = `600 ${10 / cameraScale}px "Helvetica Neue", Arial, sans-serif`
  context.textAlign = 'center'; context.textBaseline = 'middle'
  context.fillText('AI TRUST', 0, 0)
  context.restore()
}

export function GraphCanvas({ model, selectedNodeId, onSelect, showSourceLabels = false, inactive = false, snapshotRef, focusRequest = 0 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastSize = useRef({ width: 0, height: 0 })
  const modelRef = useRef(model)
  const nodePresenceRef = useRef(new Map<string, Presence<GraphNode>>())
  const edgePresenceRef = useRef(new Map<string, Presence<GraphEdge>>())
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
  const [showSynthesis, setShowSynthesis] = useState(true)
  const showSynthesisRef = useRef(true)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  const hoveredRef = useRef<string | undefined>(undefined)
  const sourceLabelsRef = useRef(showSourceLabels)
  sourceLabelsRef.current = showSourceLabels
  const selectedRef = useRef(selectedNodeId)
  const keyboardIndexRef = useRef(0)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  const selectedConnectionSummary = useMemo(() => {
    if (!selectedNodeId) return 'No node selected. Use arrow keys to select nodes, plus and minus to zoom, or 0 to reset the universe.'
    const selected = model.nodes.find((node) => node.id === selectedNodeId)
    const adjacentIds = new Set<string>()
    model.edges.forEach((edge) => {
      if (edge.sourceId === selectedNodeId) adjacentIds.add(edge.targetId)
      if (edge.targetId === selectedNodeId) adjacentIds.add(edge.sourceId)
    })
    const labels = [...adjacentIds].map((id) => model.nodes.find((node) => node.id === id)?.shortLabel).filter(Boolean).slice(0, 8)
    return `${selected?.label ?? selectedNodeId}. ${adjacentIds.size} immediate connections${labels.length ? `: ${labels.join(', ')}` : ''}.`
  }, [model, selectedNodeId])

  useEffect(() => {
    const previous = nodePositionsRef.current
    const next = new Map(previous)
    nodePresenceRef.current = reconcilePresence(nodePresenceRef.current, model.nodes)
    edgePresenceRef.current = reconcilePresence(edgePresenceRef.current, model.edges)
    model.nodes.forEach((node) => {
      const existing = previous.get(node.id)
      next.set(node.id, existing ?? {
        x: node.targetX,
        y: node.targetY,
        z: node.targetZ,
      })
    })
    nodePositionsRef.current = next
    modelRef.current = model
    if (hoveredRef.current && !model.nodes.some(node => node.id === hoveredRef.current)) {
      hoveredRef.current = undefined
      setHoveredNodeId(undefined)
    }
    if (!selectedRef.current && wrapRef.current) {
      const bounds = wrapRef.current.getBoundingClientRect()
      cameraTargetRef.current = { x: 0, y: 0, scale: fitScaleForModel(model, bounds.width, bounds.height) }
    }
  }, [model])

  useEffect(() => {
    selectedRef.current = selectedNodeId
  }, [selectedNodeId])

  useEffect(() => {
    if (inactive) return
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
      const scale = fitScaleForModel(modelRef.current, width, height)
      if (lastSize.current.width !== width || lastSize.current.height !== height) {
        cameraRef.current = { x: 0, y: 0, scale }
        cameraTargetRef.current = { x: 0, y: 0, scale }
        lastSize.current = { width, height }
      }
    }

    const observer = new ResizeObserver(resize)
    observer.observe(wrap)
    resize()

    let previousElapsed = 0
    let animationTime = 0
    let ambientYaw = 0
    let ambientTime = 0
    let lastActiveId: string | undefined
    let revealStarted = 0

    const render = (elapsed = 0) => {
      const context = canvas.getContext('2d')
      if (!context) return
      const camera = cameraRef.current
      const targetCamera = cameraTargetRef.current
      const rotation = rotationRef.current
      const targetRotation = rotationTargetRef.current
      const frameFactor = previousElapsed ? Math.min(2, (elapsed - previousElapsed) / 16.67) : 1
      const delta = previousElapsed ? elapsed - previousElapsed : 0
      previousElapsed = elapsed
      const step = motionStep(delta, pausedRef.current, reducedMotion, document.hidden, Boolean(dragRef.current.active || selectedRef.current || hoveredRef.current))
      animationTime += step.detail
      ambientTime += step.ambient
      elapsed = animationTime
      if (!pausedRef.current && !reducedMotion && !dragRef.current.active && !selectedRef.current && !hoveredRef.current) {
        const nextAmbientYaw = Math.sin(ambientTime * 0.00008) * 0.18
        targetRotation.yaw += nextAmbientYaw - ambientYaw
        ambientYaw = nextAmbientYaw
      }
      const cameraEase = reducedMotion ? 1 : 0.09
      const rotationEase = reducedMotion ? 1 : 0.075
      camera.x = lerp(camera.x, targetCamera.x, cameraEase)
      camera.y = lerp(camera.y, targetCamera.y, cameraEase)
      camera.scale = lerp(camera.scale, targetCamera.scale, cameraEase)
      rotation.yaw = lerp(rotation.yaw, targetRotation.yaw, rotationEase)
      rotation.pitch = lerp(rotation.pitch, targetRotation.pitch, rotationEase)

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)

      const dark = document.documentElement.dataset.theme === 'dark'
      const gradient = context.createRadialGradient(width * 0.5, height * 0.48, 0, width * 0.5, height * 0.48, Math.max(width, height) * 0.66)
      gradient.addColorStop(0, dark ? '#152941' : '#f9fbfe')
      gradient.addColorStop(0.46, dark ? '#0d1c2e' : '#edf3f9')
      gradient.addColorStop(1, dark ? '#080f1b' : '#e7eff7')
      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)
      // Keep the orbital field clean; the universe supplies its own structure.

      const screenCenterY = window.innerWidth <= 860 && selectedRef.current ? height * 0.4 : height / 2
      context.save()
      context.translate(width / 2, screenCenterY)
      context.scale(camera.scale, camera.scale)
      context.translate(camera.x, camera.y)

      const positions = nodePositionsRef.current
      const currentModel = modelRef.current
      const immediate = reducedMotion || pausedRef.current
      advancePresence(nodePresenceRef.current, delta, immediate)
      advancePresence(edgePresenceRef.current, delta, immediate)
      const renderNodes = [...nodePresenceRef.current.values()].map(entry => entry.value)
      const renderEdges = [...edgePresenceRef.current.values()].map(entry => entry.value)
      for (const id of positions.keys()) if (!nodePresenceRef.current.has(id)) positions.delete(id)
      const sphereRadius = modelRadius(currentModel) * 1.02
      renderNodes.forEach((node) => {
        const position = positions.get(node.id)
        if (!position) return
        const ease = reducedMotion ? 1 : 0.07
        position.x = lerp(position.x, node.targetX, ease)
        position.y = lerp(position.y, node.targetY, ease)
        position.z = lerp(position.z, node.targetZ, ease)
      })

      const projected = new Map<string, ProjectedPoint>()
      renderNodes.forEach((node) => {
        const position = positions.get(node.id)
        if (position) projected.set(node.id, projectPoint(position, rotation, sphereRadius))
      })
      projectedPositionsRef.current = projected

      drawParticleField(context, ambientParticles, rotation, sphereRadius, camera.scale, elapsed, false, reducedMotion)
      context.globalAlpha = 0.35
      drawGeodesicMesh(context, rotation, sphereRadius * 1.015, camera.scale)
      drawOrbitalGrid(context, rotation, sphereRadius, camera.scale)
      context.globalAlpha = 1
      drawParticleField(context, coreParticles, rotation, sphereRadius, camera.scale, elapsed, true, reducedMotion)

      const nodeMap = new Map(renderNodes.map((node) => [node.id, node]))
      const activeId = hoveredRef.current ?? selectedRef.current
      if (activeId !== lastActiveId) { lastActiveId = activeId; revealStarted = elapsed }
      const reveal = (elapsed - revealStarted) / 1500
      let revealedEdges = 0
      const activeNode = activeId ? nodeMap.get(activeId) : undefined
      const adjacent = new Set<string>()
      if (activeId) {
        adjacent.add(activeId)
        currentModel.edges.forEach((edge) => {
          if (edge.sourceId === activeId) adjacent.add(edge.targetId)
          if (edge.targetId === activeId) adjacent.add(edge.sourceId)
        })
      }

      renderEdges.forEach((edge) => {
        if (!showSynthesisRef.current && edge.basis === 'cross-framework-synthesis') return
        const sourceNode = nodeMap.get(edge.sourceId)
        const targetNode = nodeMap.get(edge.targetId)
        const source = projected.get(edge.sourceId)
        const target = projected.get(edge.targetId)
        if (!sourceNode || !targetNode || !source || !target) return
        const isActive = Boolean(activeId && (edge.sourceId === activeId || edge.targetId === activeId))
        // Overview retains the structural skeleton; focused paths reveal the detail.
        if (activeId ? !isActive : !['root', 'domain', 'risk-domain', 'control-family'].includes(sourceNode.kind)) return
        const isRelation = Boolean(edge.relationType)
        const isRiskMapping = edge.semanticFamily === 'risk'
        const isControlMapping = edge.semanticFamily === 'control'
        const averageDepth = (source.depth + target.depth) / 2
        const depthOpacity = clamp(0.52 + averageDepth / Math.max(sphereRadius * 2.1, 1), 0.26, 1)
        const baseOpacity = isRelation ? 0.105 : isRiskMapping || isControlMapping ? 0.075 : camera.scale > 1 ? 0.07 : 0.038
        context.globalAlpha = Math.min(edgePresenceRef.current.get(edge.id)?.opacity ?? 0, nodePresenceRef.current.get(edge.sourceId)?.opacity ?? 0, nodePresenceRef.current.get(edge.targetId)?.opacity ?? 0)
        context.strokeStyle = isActive ? (dark ? 'rgba(139, 185, 255, 0.95)' : 'rgba(36, 94, 232, 0.86)') : `rgba(70, 101, 143, ${baseOpacity * depthOpacity * 1.5})`
        context.lineWidth = (isActive ? 2.1 : isRelation ? 0.82 : 0.52) / camera.scale
        context.setLineDash(!isActive && (isRelation || isRiskMapping || isControlMapping) ? [5 / camera.scale, 7 / camera.scale] : [])
        context.lineDashOffset = 0
        context.beginPath()
        context.moveTo(source.x, source.y)

        let controlX = (source.x + target.x) / 2
        let controlY = (source.y + target.y) / 2
        if (isRelation || isRiskMapping || isControlMapping) {
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
        context.lineDashOffset = 0

        // A bounded selection cue, not a representation of semantic flow or live data.
        if (isActive && !reducedMotion && reveal > 0 && reveal < 1 && revealedEdges++ < 12) {
          const t = edge.sourceId === activeId ? reveal : 1 - reveal
          const x = (1-t)*(1-t)*source.x + 2*(1-t)*t*controlX + t*t*target.x
          const y = (1-t)*(1-t)*source.y + 2*(1-t)*t*controlY + t*t*target.y
          context.save()
          context.globalAlpha *= Math.sin(reveal * Math.PI) * 0.85
          context.fillStyle = dark ? '#d6e8ff' : '#397bd7'
          context.shadowColor = '#80b5ff'; context.shadowBlur = 7 / camera.scale
          context.beginPath(); context.arc(x, y, 2.4 / camera.scale, 0, Math.PI * 2); context.fill()
          context.restore()
        }
        const isProvisionEdge = sourceNode.kind === 'provision' || targetNode.kind === 'provision'
        if (isActive && camera.scale > 0.9 && (isRelation || isProvisionEdge || isRiskMapping || isControlMapping)) {
          const labelX = (source.x + target.x) / 2
          const labelY = (source.y + target.y) / 2
          context.font = `${10 / camera.scale}px ui-monospace, SFMono-Regular, Menlo, monospace`
          context.textAlign = 'center'
          context.textBaseline = 'middle'
          const label = edge.label.replaceAll('-', ' ')
          const labelWidth = context.measureText(label).width + 14 / camera.scale
          context.fillStyle = dark ? 'rgba(13, 28, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)'
          context.fillRect(labelX - labelWidth / 2, labelY - 9 / camera.scale, labelWidth, 18 / camera.scale)
          context.fillStyle = dark ? '#dcecff' : '#29465f'
          context.fillText(label, labelX, labelY)
        }
      })

      context.globalAlpha = 1
      drawTrustCore(context, camera.scale, elapsed, reducedMotion, dark)

      const orderedNodes = [...renderNodes].sort((left, right) => (projected.get(left.id)?.depth ?? 0) - (projected.get(right.id)?.depth ?? 0))
      const labelBoxes: { x: number; y: number; w: number; h: number }[] = []
      orderedNodes.forEach((node) => {
        const point = projected.get(node.id)
        if (!point) return
        const isSelected = selectedRef.current === node.id
        const isHovered = hoveredRef.current === node.id
        const nodeColor = dark ? node.color : arcticAccents[node.color.toLowerCase()] ?? '#68869e'
        const muted = Boolean(activeId && !adjacent.has(node.id))
        const depthOpacity = clamp(0.62 + point.depth / Math.max(sphereRadius * 2.2, 1), 0.42, 1)
        const presence = nodePresenceRef.current.get(node.id)?.opacity ?? 0
        context.globalAlpha = presence * (muted ? 0.18 : Math.max(.7, depthOpacity))
        const radius = node.radius * point.scale * (isSelected ? 1.34 : isHovered ? 1.2 : 1)

        if (isSelected) {
          const prismRadius = radius + 11 / camera.scale
          const prismColors = [`${nodeColor}d8`, 'rgba(36, 94, 232, 0.25)', 'rgba(36, 94, 232, 0.13)']
          prismColors.forEach((color, index) => {
            context.beginPath()
            context.arc(point.x, point.y, prismRadius + index * 4.2 / camera.scale, elapsed * 0.00018 + index * 2.1, elapsed * 0.00018 + index * 2.1 + Math.PI * 0.92)
            context.strokeStyle = color
            context.lineWidth = 0.8 / camera.scale
            context.stroke()
          })
        }

        if (isSelected || isHovered) {
          context.shadowColor = `${nodeColor}8a`
          context.shadowBlur = 12 / camera.scale
        }

        if (node.kind === 'domain') {
          context.strokeStyle = `${nodeColor}${isSelected || isHovered ? 'ff' : '9c'}`
          context.lineWidth = (isSelected || isHovered ? 2.2 : 1.05) / camera.scale
          context.beginPath()
          context.arc(point.x, point.y, radius + 6, 0, Math.PI * 2)
          context.stroke()
          context.fillStyle = `${nodeColor}26`
          context.beginPath()
          context.arc(point.x, point.y, radius, 0, Math.PI * 2)
          context.fill()
        } else if (node.kind === 'concept') {
          context.fillStyle = nodeColor
          context.beginPath()
          context.arc(point.x, point.y, radius, 0, Math.PI * 2)
          context.fill()
        } else if (node.kind === 'instrument') {
          polygonPath(context, point.x, point.y, radius, 6, Math.PI / 6)
          context.fillStyle = `${nodeColor}${node.region === 'Australia' ? 'f4' : 'b8'}`
          context.fill()
          context.strokeStyle = isSelected || isHovered ? (dark ? '#d7e9ff' : '#143ba4') : `${nodeColor}e8`
          context.lineWidth = (isSelected || isHovered ? 2.1 : 0.9) / camera.scale
          context.stroke()
          if (node.region === 'Australia') {
            context.beginPath()
            context.arc(point.x, point.y, radius + 4.5, 0, Math.PI * 2)
            context.strokeStyle = `${nodeColor}88`
            context.lineWidth = 0.75 / camera.scale
            context.stroke()
          }
        } else if (node.kind === 'risk-domain') {
          polygonPath(context, point.x, point.y, radius, 6, Math.PI / 6)
          context.fillStyle = `${nodeColor}22`
          context.fill()
          context.strokeStyle = `${nodeColor}${isSelected || isHovered ? 'ff' : 'b8'}`
          context.lineWidth = (isSelected || isHovered ? 2.2 : 1.05) / camera.scale
          context.stroke()
          context.beginPath()
          context.arc(point.x, point.y, radius + 6, 0, Math.PI * 2)
          context.strokeStyle = `${nodeColor}55`
          context.lineWidth = 0.7 / camera.scale
          context.stroke()
        } else if (node.kind === 'risk-subdomain') {
          polygonPath(context, point.x, point.y, radius, 4, Math.PI / 4)
          context.fillStyle = `${nodeColor}${isSelected || isHovered ? 'f5' : 'cc'}`
          context.fill()
          context.strokeStyle = isSelected || isHovered ? (dark ? '#d7e9ff' : '#143ba4') : `${nodeColor}ee`
          context.lineWidth = (isSelected || isHovered ? 2 : 0.75) / camera.scale
          context.stroke()
        } else if (node.kind === 'control-family') {
          polygonPath(context, point.x, point.y, radius, 8, Math.PI / 8)
          context.fillStyle = `${nodeColor}24`
          context.fill()
          context.strokeStyle = `${nodeColor}${isSelected || isHovered ? 'ff' : 'b8'}`
          context.lineWidth = (isSelected || isHovered ? 2.2 : 1.05) / camera.scale
          context.stroke()
          context.beginPath()
          context.arc(point.x, point.y, radius + 6, 0, Math.PI * 2)
          context.strokeStyle = `${nodeColor}55`
          context.lineWidth = 0.7 / camera.scale
          context.stroke()
        } else if (node.kind === 'control-objective') {
          polygonPath(context, point.x, point.y, radius, 8, Math.PI / 8)
          context.fillStyle = `${nodeColor}${isSelected || isHovered ? 'f2' : 'c4'}`
          context.fill()
          context.strokeStyle = isSelected || isHovered ? (dark ? '#d7e9ff' : '#143ba4') : `${nodeColor}e8`
          context.lineWidth = (isSelected || isHovered ? 2 : 0.8) / camera.scale
          context.stroke()
        } else {
          polygonPath(context, point.x, point.y, radius, 4, Math.PI / 4)
          context.fillStyle = nodeColor
          context.fill()
        }
        context.shadowBlur = 0

        const compactCanvas = width <= 560
        const showAdjacentRiskLabel = Boolean(!compactCanvas && activeNode && ['instrument', 'provision', 'domain', 'risk-domain', 'risk-subdomain', 'control-family', 'control-objective', 'concept'].includes(activeNode.kind) && adjacent.has(node.id))
        const filteredSourceLabel = sourceLabelsRef.current && node.kind === 'instrument'
        const showLabel = filteredSourceLabel || !muted && (isSelected
          || isHovered
          || (!compactCanvas && (
            node.kind === 'domain'
            || node.kind === 'risk-domain'
            || node.kind === 'control-family'
            || showAdjacentRiskLabel
            || (node.kind === 'concept' && camera.scale > 1.58)
            || (node.kind === 'instrument' && camera.scale > 2.05)
            || (node.kind === 'provision' && camera.scale > 1.66)
            || (node.kind === 'risk-subdomain' && camera.scale > 1.42)
            || (node.kind === 'control-objective' && camera.scale > 1.36)
          )))
        if (showLabel && nodePresenceRef.current.get(node.id)?.present) {
          const isGroup = node.kind === 'domain' || node.kind === 'risk-domain' || node.kind === 'control-family'
          const size = isSelected || isHovered ? 15 : isGroup ? 14 : 12
          context.font = `${isGroup ? 650 : 500} ${size / camera.scale}px "Arial Narrow", "Helvetica Neue", sans-serif`
          context.textAlign = 'center'
          context.textBaseline = 'top'
          context.globalAlpha = presence
          context.fillStyle = dark ? (isSelected || isHovered ? '#ffffff' : '#c2d5ea') : isSelected || isHovered ? '#17396a' : '#344f6b'
          const maxWidth = 140 / camera.scale
          const labelWidth = Math.min(maxWidth, context.measureText(node.shortLabel).width + 10 / camera.scale)
          const box = { x: point.x - labelWidth / 2, y: point.y + radius + 7 / camera.scale, w: labelWidth, h: (size + 2) * (labelWidth < maxWidth ? 1 : 2) / camera.scale }
          const collides = () => labelBoxes.some(b => box.x < b.x + b.w && box.x + box.w > b.x && box.y < b.y + b.h && box.y + box.h > b.y)
          if (filteredSourceLabel) {
            context.globalAlpha = presence
            let attempts = 0
            while (collides() && attempts++ < 12) box.y += (size + 5) / camera.scale
            if (attempts > 0) {
              context.beginPath()
              context.moveTo(point.x, point.y + radius + 3 / camera.scale)
              context.lineTo(point.x, box.y - 3 / camera.scale)
              context.strokeStyle = `${nodeColor}70`
              context.lineWidth = 0.6 / camera.scale
              context.stroke()
            }
          }
          const overlaps = collides()
          if (filteredSourceLabel || isSelected || isHovered || !overlaps) {
            drawWrappedLabel(context, node.shortLabel, point.x, box.y, maxWidth, (size + 2) / camera.scale)
            labelBoxes.push(box)
          }
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
  }, [reducedMotion, inactive])

  if (snapshotRef) snapshotRef.current = () => {
    const result: NodeSnapshot = new Map()
    const bounds = wrapRef.current?.getBoundingClientRect()
    if (!bounds) return result
    const camera = cameraRef.current
    const cy = window.innerWidth <= 860 && selectedRef.current ? bounds.height * .4 : bounds.height / 2
    modelRef.current.nodes.forEach(node => {
      const point = projectedPositionsRef.current.get(node.id)
      if (point) result.set(node.id, { x: bounds.left + bounds.width / 2 + (point.x + camera.x) * camera.scale, y: bounds.top + cy + (point.y + camera.y) * camera.scale, color: node.color, kind: node.kind, label: node.shortLabel })
    })
    return result
  }

  const nodeAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const bounds = canvas.getBoundingClientRect()
    const camera = cameraRef.current
    const worldX = (clientX - bounds.left - bounds.width / 2) / camera.scale - camera.x
    const screenCenterY = window.innerWidth <= 860 && selectedRef.current ? bounds.height * 0.4 : bounds.height / 2
    const worldY = (clientY - bounds.top - screenCenterY) / camera.scale - camera.y
    let nearest: GraphNode | undefined
    let distance = Number.POSITIVE_INFINITY
    for (const node of modelRef.current.nodes) {
      if ((nodePresenceRef.current.get(node.id)?.opacity ?? 0) < 0.15) continue
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

  const focusSelected = () => {
    const point = selectedRef.current ? projectedPositionsRef.current.get(selectedRef.current) : undefined
    if (!point) return
    cameraTargetRef.current = { x: -point.x, y: -point.y, scale: Math.max(cameraTargetRef.current.scale, 1.1) }
  }

  useEffect(() => {
    if (!focusRequest) return
    // Allow the selected source's layout and projected position to settle before focusing.
    const timer = window.setTimeout(focusSelected, 350)
    return () => window.clearTimeout(timer)
  }, [focusRequest])

  const resetCamera = () => {
    const bounds = wrapRef.current?.getBoundingClientRect()
    const scale = bounds ? fitScaleForModel(modelRef.current, bounds.width, bounds.height) : initialScale
    cameraTargetRef.current = { x: 0, y: 0, scale }
    rotationTargetRef.current = { ...initialRotation }
    onSelect(undefined)
  }

  const navigateByKeyboard = (direction: number) => {
    const nodes = modelRef.current.nodes
    if (nodes.length === 0) return
    const selectedIndex = selectedRef.current ? nodes.findIndex((node) => node.id === selectedRef.current) : keyboardIndexRef.current
    keyboardIndexRef.current = (Math.max(0, selectedIndex) + direction + nodes.length) % nodes.length
    onSelect(nodes[keyboardIndexRef.current]?.id)
  }

  return (
    <div className="graph-stage" ref={wrapRef} data-hovered={hoveredNodeId ?? ''} inert={inactive || undefined} aria-hidden={inactive || undefined}>
      <canvas
        ref={canvasRef}
        aria-label="Interactive orbital map of AI requirements, risks, controls, concepts and specific sections"
        aria-describedby="graph-accessible-description"
        tabIndex={inactive ? -1 : 0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); navigateByKeyboard(1) }
          if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); navigateByKeyboard(-1) }
          if (event.key === 'Home') { event.preventDefault(); keyboardIndexRef.current = 0; onSelect(modelRef.current.nodes[0]?.id) }
          if (event.key === 'End') { event.preventDefault(); keyboardIndexRef.current = Math.max(0, modelRef.current.nodes.length - 1); onSelect(modelRef.current.nodes.at(-1)?.id) }
          if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomBy(1.25) }
          if (event.key === '-') { event.preventDefault(); zoomBy(0.8) }
          if (event.key === '0') { event.preventDefault(); resetCamera() }
          if (event.key === 'Enter') { event.preventDefault(); focusSelected() }
          if (event.key === 'Escape') { event.preventDefault(); onSelect(undefined) }
        }}
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
        onPointerCancel={() => { finishOrbit(); updateHover(undefined) }}
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
          const screenCenterY = window.innerWidth <= 860 && selectedRef.current ? bounds.height * 0.4 : bounds.height / 2
          const beforeY = (event.clientY - bounds.top - screenCenterY) / target.scale - target.y
          const nextScale = clamp(target.scale * Math.exp(-event.deltaY * 0.0012), 0.26, 3.8)
          const afterX = (event.clientX - bounds.left - bounds.width / 2) / nextScale - target.x
          const afterY = (event.clientY - bounds.top - screenCenterY) / nextScale - target.y
          cameraTargetRef.current = { x: target.x + afterX - beforeX, y: target.y + afterY - beforeY, scale: nextScale }
        }}
      />
      <p className="sr-only" id="graph-accessible-description" aria-live="polite">{selectedConnectionSummary}</p>
      {hoveredNodeId && model.nodes.find(n => n.id === hoveredNodeId) && <div className="universe-hover-card" role="status"><span>{model.nodes.find(n => n.id === hoveredNodeId)!.kind.replaceAll('-', ' ')}</span><strong>{model.nodes.find(n => n.id === hoveredNodeId)!.label}</strong><small>Click to inspect sources and connections</small></div>}
      <div className="graph-controls" role="toolbar" aria-label="Graph view controls">
        <button type="button" disabled={!selectedNodeId} onClick={focusSelected} aria-label="Focus selected object" title="Focus selected object (Enter)"><Target /></button>
        <button type="button" aria-pressed={paused} onClick={() => { pausedRef.current = !paused; setPaused(!paused) }} aria-label={paused ? 'Resume ambient motion' : 'Pause ambient motion'} title={paused ? 'Resume ambient motion' : 'Pause ambient motion'}>{paused ? <Play /> : <Pause />}</button>
        <button className="source-lens-control" type="button" aria-pressed={!showSynthesis} onClick={() => { const next = !showSynthesis; setShowSynthesis(next); showSynthesisRef.current = next }} aria-label={showSynthesis ? 'Show source-explicit relationships only' : 'Show Atlas interpretation relationships'}>{showSynthesis ? <Eye /> : <EyeSlash />}</button>
        <button type="button" onClick={() => zoomBy(1.25)} aria-label="Zoom in"><Plus weight="bold" /></button>
        <button type="button" onClick={() => zoomBy(0.8)} aria-label="Zoom out"><Minus weight="bold" /></button>
        <button type="button" onClick={resetCamera} aria-label="Reset graph view"><ArrowsOut /></button>
      </div>
      <p className="graph-hint" aria-hidden="true">Drag to orbit · scroll to zoom · select to inspect · Enter to focus</p>
    </div>
  )
}
