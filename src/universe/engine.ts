import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Color, Group, LineDashedMaterial, LineLoop, LineSegments, MathUtils, PerspectiveCamera,
  Points, Scene, ShaderMaterial, Sprite, SpriteMaterial, SRGBColorSpace, Vector2, Vector3, WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js'
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js'
import type { GraphEdge, GraphModel, GraphNode } from '../types'
import { curvePoints, easeInOutCubic, nodeSize, nodeStyle, pickNode, worldPosition, type ScreenNode, type Vec3 } from './geometry'

export type UniversePose = { kind: 'webgl'; position: [number, number, number]; target: [number, number, number] }
type NodeState = { node: GraphNode; pos: Vec3; target: Vec3; alpha: number; targetAlpha: number; size: number; emphasis: number; targetEmphasis: number; removing: boolean }
type Flight = { fromPos: Vector3; toPos: Vector3; fromTarget: Vector3; toTarget: Vector3; start: number; duration: number }

const synthesisBases = new Set(['atlas-synthesis', 'cross-framework-synthesis'])
const segments = 12
const polar = MathUtils.degToRad(40)

const nodeVertex = /* glsl */ `
  attribute float size; attribute vec3 color; attribute float alpha; attribute float shape; attribute float ring; attribute float emphasis;
  uniform float uScale;
  varying vec3 vColor; varying float vAlpha; varying float vShape; varying float vRing; varying float vEmphasis;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = min(size * (1.0 + emphasis * 0.45) * uScale / -mv.z * 2.6, 700.0);
    gl_Position = projectionMatrix * mv;
    vColor = color; vAlpha = alpha; vShape = shape; vRing = ring; vEmphasis = emphasis;
  }`
const nodeFragment = /* glsl */ `
  uniform float uGlow; uniform float uCoreLift; uniform float uRingFill; uniform float uEmphasisGlow;
  varying vec3 vColor; varying float vAlpha; varying float vShape; varying float vRing; varying float vEmphasis;
  float sdHex(vec2 p, float r) { p = abs(p); return max(dot(p, vec2(0.8660254, 0.5)), p.y) - r; }
  float sdOct(vec2 p, float r) { p = abs(p); return max(max(p.x, p.y), (p.x + p.y) * 0.7071) - r; }
  float sdTri(vec2 p, float r) { const float k = 1.7320508; p.x = abs(p.x) - r; p.y = p.y + r / k; if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0; p.x -= clamp(p.x, -2.0 * r, 0.0); return -length(p) * sign(p.y); }
  void main() {
    vec2 p = (gl_PointCoord * 2.0 - 1.0) * 2.6; p.y = -p.y;
    float d;
    if (vShape < 0.5) d = length(p) - 1.0;
    else if (vShape < 1.5) d = sdHex(p, 0.9);
    else if (vShape < 2.5) d = (abs(p.x) + abs(p.y)) - 1.2;
    else if (vShape < 3.5) d = sdOct(p, 0.92);
    else d = sdTri(p, 1.1);
    float aa = 0.09;
    float fill = 1.0 - smoothstep(-aa, aa, d);
    float edge = 1.0 - smoothstep(0.0, aa * 1.5, abs(d + 0.09) - 0.1);
    float core = vRing > 0.5 ? max(edge, fill * uRingFill) : fill;
    float glow = exp(-max(d, 0.0) * 1.9) * (uGlow + vEmphasis * uEmphasisGlow) * (1.0 - fill);
    vec3 color = vColor * (core * (1.0 + uCoreLift)) + vColor * glow + vec3(1.0) * fill * vEmphasis * 0.12;
    float a = max(core, glow) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(color, a);
  }`
const lineVertex = /* glsl */ `
  attribute vec3 color; attribute float alpha; varying vec3 vColor; varying float vAlpha;
  void main() { vColor = color; vAlpha = alpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
const lineFragment = /* glsl */ `
  varying vec3 vColor; varying float vAlpha;
  void main() { gl_FragColor = vec4(vColor, vAlpha); }`
const starVertex = /* glsl */ `
  attribute float size; attribute float phase; uniform float uTime; uniform float uPixelRatio; varying float vTwinkle;
  void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * uPixelRatio; gl_Position = projectionMatrix * mv; vTwinkle = 0.55 + 0.45 * sin(uTime * 0.0012 + phase); }`
const starFragment = /* glsl */ `
  uniform vec3 uColor; varying float vTwinkle;
  void main() { float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d) * vTwinkle * 0.8; if (a < 0.02) discard; gl_FragColor = vec4(uColor, a); }`

/* The composer path treats clear colours as linear values; convert from sRGB hex ourselves. */
const linear = (hex: string) => {
  const value = Number.parseInt(hex.slice(1), 16)
  const channel = (byte: number) => { const c = byte / 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
  return new Color(channel((value >> 16) & 255), channel((value >> 8) & 255), channel(value & 255))
}

/*
 * Writes attribute data into reusable GPU buffers. Buffers grow (and the old
 * geometry is disposed) only when capacity is exceeded; otherwise the draw
 * range shrinks, avoiding a new bufferData allocation every frame.
 */
function writeAttributes(object: { geometry: BufferGeometry }, count: number, data: Record<string, [Float32Array | number[], number]>) {
  let geometry = object.geometry
  const capacity = (geometry.getAttribute('position') as BufferAttribute | undefined)?.count ?? 0
  if (count > capacity || !geometry.getAttribute('position')) {
    const next = new BufferGeometry()
    const size = Math.max(64, Math.ceil(count * 1.5))
    for (const [name, [, itemSize]] of Object.entries(data)) next.setAttribute(name, new BufferAttribute(new Float32Array(size * itemSize), itemSize))
    geometry.dispose()
    object.geometry = geometry = next
  }
  for (const [name, [values, itemSize]] of Object.entries(data)) {
    const attribute = geometry.getAttribute(name) as BufferAttribute
    ;(attribute.array as Float32Array).set(values.length > count * itemSize ? values.slice(0, count * itemSize) : values)
    attribute.clearUpdateRanges()
    attribute.addUpdateRange(0, count * itemSize)
    attribute.needsUpdate = true
  }
  geometry.setDrawRange(0, count)
}

const glowTexture = (inner: string, outer: string) => {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const context = canvas.getContext('2d')!
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128)
  gradient.addColorStop(0, inner)
  gradient.addColorStop(1, outer)
  context.fillStyle = gradient
  context.fillRect(0, 0, 256, 256)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

export class UniverseEngine {
  onFrame?: () => void
  private renderer: WebGLRenderer
  private scene = new Scene()
  private camera: PerspectiveCamera
  private controls: OrbitControls
  private composer?: EffectComposer
  private bloom?: UnrealBloomPass
  private graph = new Group()
  private nodes = new Map<string, NodeState>()
  private order: NodeState[] = []
  private edges: GraphEdge[] = []
  private nodePoints: Points
  private nodeMaterial: ShaderMaterial
  private web: LineSegments
  private active: LineSegments2
  private activeMaterial: LineMaterial
  private pulses: Points
  private pulseMaterial: ShaderMaterial
  private stars: Points
  private starMaterial: ShaderMaterial
  private rings: LineLoop[] = []
  private nebulae: Sprite[] = []
  private core: Sprite
  private selected?: string
  private hovered?: string
  private highlight = new Set<string>()
  private showSynthesis = true
  private emphasiseSources = false
  private reducedMotion: boolean
  private paused = false
  private inactive = false
  private flight?: Flight
  private frame = 0
  private last = 0
  private dirty = true
  private settleUntil = 0
  private lastInteraction = 0
  private width = 1
  private height = 1
  private disposed = false
  private edgesDirty = true
  private pulseUntil = 0
  private ticking = false
  private activeCurves: { curve: Vec3[]; path: boolean; offset: number }[] = []

  constructor(canvas: HTMLCanvasElement, options: { reducedMotion: boolean }) {
    this.reducedMotion = options.reducedMotion
    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.camera = new PerspectiveCamera(42, 1, 10, 12000)
    this.camera.up.set(0, 0, 1)
    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.screenSpacePanning = true
    this.controls.zoomToCursor = true
    this.controls.minDistance = 90
    this.controls.maxDistance = 6000
    this.controls.maxPolarAngle = MathUtils.degToRad(82)
    this.controls.rotateSpeed = 0.55
    this.controls.autoRotateSpeed = 0.35
    this.controls.addEventListener('start', () => { this.lastInteraction = performance.now(); this.flight = undefined })
    this.controls.addEventListener('change', () => this.invalidate())

    this.nodeMaterial = new ShaderMaterial({ vertexShader: nodeVertex, fragmentShader: nodeFragment, transparent: true, depthWrite: false, uniforms: { uScale: { value: 1 }, uGlow: { value: 0.5 }, uCoreLift: { value: 0.2 }, uRingFill: { value: 0.22 }, uEmphasisGlow: { value: 0.45 } } })
    this.nodePoints = new Points(new BufferGeometry(), this.nodeMaterial)
    this.nodePoints.frustumCulled = false
    this.nodePoints.renderOrder = 3
    this.web = new LineSegments(new BufferGeometry(), new ShaderMaterial({ vertexShader: lineVertex, fragmentShader: lineFragment, transparent: true, depthWrite: false }))
    this.web.frustumCulled = false
    this.activeMaterial = new LineMaterial({ linewidth: 1.6, vertexColors: true, transparent: true, opacity: 0.7, depthWrite: false, worldUnits: false })
    this.active = new LineSegments2(new LineSegmentsGeometry(), this.activeMaterial)
    this.active.frustumCulled = false
    this.active.renderOrder = 2
    this.pulseMaterial = new ShaderMaterial({ vertexShader: nodeVertex, fragmentShader: nodeFragment, transparent: true, depthWrite: false, blending: AdditiveBlending, uniforms: { uScale: { value: 1 }, uGlow: { value: 1.2 }, uCoreLift: { value: 0.6 }, uRingFill: { value: 0.22 }, uEmphasisGlow: { value: 0.45 } } })
    this.pulses = new Points(new BufferGeometry(), this.pulseMaterial)
    this.pulses.frustumCulled = false
    this.pulses.renderOrder = 4
    this.graph.add(this.web, this.active, this.nodePoints, this.pulses)

    this.starMaterial = new ShaderMaterial({ vertexShader: starVertex, fragmentShader: starFragment, transparent: true, depthWrite: false, uniforms: { uTime: { value: 0 }, uPixelRatio: { value: this.renderer.getPixelRatio() }, uColor: { value: new Color('#cfe8ff') } } })
    this.stars = this.buildStars()
    this.core = new Sprite(new SpriteMaterial({ map: glowTexture('rgba(158,240,255,0.75)', 'rgba(112,89,224,0)'), transparent: true, depthWrite: false, blending: AdditiveBlending }))
    this.core.scale.set(110, 110, 1)
    for (const radius of [240, 400, 560]) {
      const points = Array.from({ length: 160 }, (_, index) => { const angle = (index / 160) * Math.PI * 2; return new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0) })
      const ring = new LineLoop(new BufferGeometry().setFromPoints(points), new LineDashedMaterial({ color: '#5c7bb0', dashSize: 6, gapSize: 14, transparent: true, opacity: 0.22, depthWrite: false }))
      ring.computeLineDistances()
      this.rings.push(ring)
    }
    const nebulaSpecs: [number, number, number, number, string][] = [[-900, 700, -700, 2600, 'rgba(112,89,224,0.5)'], [1100, -500, -900, 2400, 'rgba(34,198,240,0.35)'], [0, 0, -400, 1700, 'rgba(94,228,255,0.18)']]
    for (const [x, y, z, size, color] of nebulaSpecs) {
      const sprite = new Sprite(new SpriteMaterial({ map: glowTexture(color, 'rgba(0,0,0,0)'), transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0.55 }))
      sprite.position.set(x, y, z)
      sprite.scale.set(size, size, 1)
      sprite.material.opacity = 0.16
      this.nebulae.push(sprite)
    }
    this.scene.add(...this.nebulae, this.stars, ...this.rings, this.core, this.graph)
    this.applyTheme()
    this.fit(false)
  }

  /* ---------- public API ---------- */

  setModel(model: GraphModel) {
    const present = new Set(model.nodes.map((node) => node.id))
    const degree = new Map<string, number>()
    for (const edge of model.edges) { degree.set(edge.sourceId, (degree.get(edge.sourceId) ?? 0) + 1); degree.set(edge.targetId, (degree.get(edge.targetId) ?? 0) + 1) }
    for (const node of model.nodes) {
      const target = worldPosition(node)
      const size = nodeSize(node.kind, degree.get(node.id) ?? 0)
      const existing = this.nodes.get(node.id)
      if (existing) Object.assign(existing, { node, target, size, removing: false, targetAlpha: 1 })
      else {
        const parent = model.edges.find((edge) => edge.targetId === node.id && this.nodes.has(edge.sourceId))
        const origin = parent ? this.nodes.get(parent.sourceId)!.pos : { x: target.x * 0.6, y: target.y * 0.6, z: target.z }
        this.nodes.set(node.id, { node, pos: this.reducedMotion ? { ...target } : { ...origin }, target, alpha: this.reducedMotion ? 1 : 0, targetAlpha: 1, size, emphasis: 0, targetEmphasis: 0, removing: false })
      }
    }
    for (const state of this.nodes.values()) if (!present.has(state.node.id)) { state.removing = true; state.targetAlpha = 0 }
    this.edges = model.edges
    this.rebuildOrder()
    this.updateEmphasis()
    this.settle(1400)
  }

  setSelection(id?: string) { if (id === this.selected) return; this.selected = id; this.pulseUntil = performance.now() + 12000; this.updateEmphasis(); this.settle(900) }
  setHover(id?: string) { if (id === this.hovered) return; this.hovered = id; this.updateEmphasis(); this.settle(400) }
  setHighlight(ids: string[]) { if (ids.join('|') === [...this.highlight].join('|')) return; this.highlight = new Set(ids); this.pulseUntil = performance.now() + 12000; this.updateEmphasis(); this.settle(900) }
  setShowSynthesis(value: boolean) { this.showSynthesis = value; this.settle(200) }
  setEmphasiseSources(value: boolean) { this.emphasiseSources = value; this.settle(100) }
  setPaused(value: boolean) { this.paused = value; this.invalidate() }
  setInactive(value: boolean) { this.inactive = value; if (!value) this.invalidate() }
  setReducedMotion(value: boolean) { this.reducedMotion = value; this.invalidate() }

  resize(width: number, height: number) {
    this.width = Math.max(1, width)
    this.height = Math.max(1, height)
    this.renderer.setSize(this.width, this.height, false)
    this.composer?.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.activeMaterial.resolution.set(this.width, this.height)
    // Small screens get a gentler bloom so dense clusters stay legible.
    if (this.bloom) this.bloom.strength = this.width < 640 ? 0.38 : 0.62
    const scale = (this.height * this.renderer.getPixelRatio()) / (2 * Math.tan(MathUtils.degToRad(this.camera.fov / 2)))
    this.nodeMaterial.uniforms.uScale.value = scale
    this.pulseMaterial.uniforms.uScale.value = scale
    this.invalidate()
  }

  flyTo(id: string) {
    const state = this.nodes.get(id)
    if (!state) return
    const target = new Vector3(state.target.x, state.target.y, state.target.z)
    // Frame the node together with its immediate neighbourhood.
    let reach = 0
    for (const edge of this.edges) {
      const other = edge.sourceId === id ? edge.targetId : edge.targetId === id ? edge.sourceId : undefined
      const neighbour = other ? this.nodes.get(other) : undefined
      if (neighbour && !neighbour.removing) reach = Math.max(reach, Math.hypot(neighbour.target.x - target.x, neighbour.target.y - target.y, neighbour.target.z - target.z))
    }
    const vertical = MathUtils.degToRad(this.camera.fov / 2)
    const distance = MathUtils.clamp((reach * 1.15) / Math.tan(Math.min(vertical, Math.atan(Math.tan(vertical) * this.camera.aspect))), 420, 1500)
    const offset = this.camera.position.clone().sub(this.controls.target)
    if (offset.lengthSq() < 1) offset.set(0, -Math.sin(polar), Math.cos(polar))
    this.fly(target, target.clone().add(offset.setLength(distance)))
  }

  fit(animate = true) {
    let radius = 420
    for (const state of this.nodes.values()) if (!state.removing) radius = Math.max(radius, Math.hypot(state.target.x, state.target.y) + 40)
    const vertical = MathUtils.degToRad(this.camera.fov / 2)
    const horizontal = Math.atan(Math.tan(vertical) * this.camera.aspect)
    // Portrait phones frame the whole map edge to edge; wider screens crop the empty outer ring slightly.
    const distance = (radius / Math.sin(Math.min(vertical, horizontal))) * (this.camera.aspect < 0.8 ? 1 : 0.92)
    const target = new Vector3(0, 0, 0)
    const position = new Vector3(0, -Math.sin(polar) * distance, Math.cos(polar) * distance)
    if (animate) this.fly(target, position)
    else { this.controls.target.copy(target); this.camera.position.copy(position); this.controls.update(); this.invalidate() }
  }

  zoomBy(factor: number) {
    const offset = this.camera.position.clone().sub(this.controls.target)
    const length = MathUtils.clamp(offset.length() / factor, this.controls.minDistance, this.controls.maxDistance)
    this.fly(this.controls.target.clone(), this.controls.target.clone().add(offset.setLength(length)), 420)
  }

  capture(): UniversePose {
    const p = this.camera.position, t = this.controls.target
    return { kind: 'webgl', position: [p.x, p.y, p.z], target: [t.x, t.y, t.z] }
  }

  restore(pose: unknown) {
    const value = pose as UniversePose | undefined
    if (value?.kind !== 'webgl') return
    this.flight = undefined
    this.camera.position.set(...value.position)
    this.controls.target.set(...value.target)
    this.controls.update()
    this.invalidate()
  }

  /* Screen-space positions of every visible node, in CSS pixels relative to the canvas. */
  project(): ScreenNode[] {
    const result: ScreenNode[] = []
    const vector = new Vector3()
    const scale = this.height / (2 * Math.tan(MathUtils.degToRad(this.camera.fov / 2)))
    for (const state of this.order) {
      vector.set(state.pos.x, state.pos.y, state.pos.z)
      const distance = vector.distanceTo(this.camera.position)
      vector.project(this.camera)
      const visible = vector.z > -1 && vector.z < 1 && Math.abs(vector.x) < 1.2 && Math.abs(vector.y) < 1.2
      result.push({ id: state.node.id, x: (vector.x + 1) * 0.5 * this.width, y: (1 - vector.y) * 0.5 * this.height, radius: (state.size * (1 + state.emphasis * 0.45) * scale) / distance / 2, depth: vector.z, alpha: state.alpha, visible })
    }
    return result
  }

  pick(x: number, y: number) { return pickNode(this.project(), x, y) }

  /* Screen position of a world point and how many CSS pixels one world unit spans there. */
  projectPoint(point: Vec3) {
    const vector = new Vector3(point.x, point.y, point.z)
    const distance = vector.distanceTo(this.camera.position)
    vector.project(this.camera)
    const scale = this.height / (2 * Math.tan(MathUtils.degToRad(this.camera.fov / 2)))
    return { x: (vector.x + 1) * 0.5 * this.width, y: (1 - vector.y) * 0.5 * this.height, visible: vector.z > -1 && vector.z < 1, unit: scale / distance }
  }
  nodeState(id: string) { return this.nodes.get(id) }
  cameraDistance() { return this.camera.position.distanceTo(this.controls.target) }

  /* Renders one frame and returns it as a PNG data URL with a caption band. */
  snapshot(caption: string): string {
    this.render(performance.now())
    const source = this.renderer.domElement
    const out = document.createElement('canvas')
    out.width = source.width
    out.height = source.height + Math.round(64 * this.renderer.getPixelRatio())
    const context = out.getContext('2d')!
    const ratio = this.renderer.getPixelRatio()
    context.fillStyle = '#05080f'
    context.fillRect(0, 0, out.width, out.height)
    context.drawImage(source, 0, 0)
    context.fillStyle = '#eef2fb'
    context.font = `600 ${16 * ratio}px "Inter Variable", Inter, system-ui, sans-serif`
    context.fillText(caption, 20 * ratio, source.height + 28 * ratio)
    context.fillStyle = '#8b98b8'
    context.font = `${12 * ratio}px "JetBrains Mono Variable", ui-monospace, monospace`
    context.fillText('AI Trust Atlas · source-linked reference, not legal advice', 20 * ratio, source.height + 50 * ratio)
    return out.toDataURL('image/png')
  }

  /* Exactly one animation-frame loop: requests made during a tick are folded into the next frame. */
  invalidate() {
    this.dirty = true
    if (this.ticking || this.frame || this.disposed || this.inactive) return
    this.frame = requestAnimationFrame(this.tick)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.frame)
    this.controls.dispose()
    this.scene.traverse((object) => {
      const item = object as unknown as { geometry?: BufferGeometry; material?: { dispose(): void; map?: { dispose(): void } } }
      item.geometry?.dispose()
      item.material?.map?.dispose()
      item.material?.dispose()
    })
    this.composer?.dispose()
    this.renderer.dispose()
  }

  /* ---------- internals ---------- */

  private settle(ms: number) { this.edgesDirty = true; this.settleUntil = Math.max(this.settleUntil, performance.now() + ms); this.invalidate() }

  private fly(target: Vector3, position: Vector3, duration = 1100) {
    if (this.reducedMotion) {
      this.controls.target.copy(target); this.camera.position.copy(position); this.controls.update(); this.invalidate(); return
    }
    this.flight = { fromPos: this.camera.position.clone(), toPos: position, fromTarget: this.controls.target.clone(), toTarget: target, start: performance.now(), duration }
    this.invalidate()
  }

  private applyTheme() {
    // With the bloom composer the clear colour is encoded to sRGB twice (background, then OutputPass).
    const clear = linear('#05080f')
    clear.convertSRGBToLinear()
    this.renderer.setClearColor(clear, 1)
    this.nodeMaterial.blending = AdditiveBlending
    this.nodeMaterial.uniforms.uGlow.value = 0.32
    this.nodeMaterial.uniforms.uCoreLift.value = 0.05
    this.nodeMaterial.uniforms.uRingFill.value = 0.22
    this.nodeMaterial.uniforms.uEmphasisGlow.value = 0.45
    this.nodeMaterial.needsUpdate = true
    const webMaterial = this.web.material as ShaderMaterial
    webMaterial.blending = AdditiveBlending
    webMaterial.needsUpdate = true
    this.activeMaterial.blending = AdditiveBlending
    for (const ring of this.rings) (ring.material as LineDashedMaterial).color.set('#5c7bb0')
    if (!this.composer) {
      this.composer = new EffectComposer(this.renderer)
      this.composer.addPass(new RenderPass(this.scene, this.camera))
      this.bloom = new UnrealBloomPass(new Vector2(this.width, this.height), this.width < 640 ? 0.38 : 0.62, 0.42, 0.32)
      this.composer.addPass(this.bloom)
      this.composer.addPass(new OutputPass())
      this.composer.setSize(this.width, this.height)
    }
    this.rebuildColors()
  }

  private buildStars() {
    const count = 1400
    const positions = new Float32Array(count * 3), sizes = new Float32Array(count), phases = new Float32Array(count)
    for (let index = 0; index < count; index++) {
      const radius = 1800 + Math.random() * 3200, theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1)
      positions.set([radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi) * 0.7 - 400], index * 3)
      sizes[index] = 0.8 + Math.random() * Math.random() * 2.6
      phases[index] = Math.random() * Math.PI * 2
    }
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(positions, 3))
    geometry.setAttribute('size', new BufferAttribute(sizes, 1))
    geometry.setAttribute('phase', new BufferAttribute(phases, 1))
    const points = new Points(geometry, this.starMaterial)
    points.frustumCulled = false
    return points
  }

  private colorFor(node: GraphNode) {
    return new Color(node.color)
  }

  private neighbours() {
    const set = new Set<string>()
    if (!this.selected) return set
    for (const edge of this.edges) {
      if (edge.sourceId === this.selected) set.add(edge.targetId)
      if (edge.targetId === this.selected) set.add(edge.sourceId)
    }
    return set
  }

  private updateEmphasis() {
    const near = this.neighbours()
    for (const state of this.nodes.values()) {
      const id = state.node.id
      state.targetEmphasis = id === this.selected ? 1 : this.highlight.has(id) ? 0.8 : id === this.hovered ? 0.6 : near.has(id) ? 0.25 : 0
      if (!state.removing) state.targetAlpha = !this.selected && !this.highlight.size ? 1 : id === this.selected || near.has(id) || this.highlight.has(id) || id === this.hovered ? 1 : 0.28
    }
  }

  private rebuildOrder() {
    this.order = [...this.nodes.values()].sort((a, b) => nodeStyle[a.node.kind].rank - nodeStyle[b.node.kind].rank)
    const count = this.order.length
    const geometry = this.nodePoints.geometry
    for (const [name, size] of [['position', 3], ['color', 3], ['size', 1], ['alpha', 1], ['shape', 1], ['ring', 1], ['emphasis', 1]] as const) {
      geometry.setAttribute(name, new BufferAttribute(new Float32Array(count * size), size))
    }
    const shape = geometry.getAttribute('shape') as BufferAttribute, ring = geometry.getAttribute('ring') as BufferAttribute
    this.order.forEach((state, index) => { shape.setX(index, nodeStyle[state.node.kind].shape); ring.setX(index, nodeStyle[state.node.kind].ring ? 1 : 0) })
    this.rebuildColors()
  }

  private rebuildColors() {
    const color = this.nodePoints.geometry.getAttribute('color') as BufferAttribute | undefined
    if (!color) return
    this.order.forEach((state, index) => { const c = this.colorFor(state.node); color.setXYZ(index, c.r, c.g, c.b) })
    color.needsUpdate = true
  }

  private step(dt: number) {
    const k = this.reducedMotion ? 1 : 1 - Math.exp(-dt * 0.0065)
    const fade = this.reducedMotion ? 1 : 1 - Math.exp(-dt * 0.008)
    let moving = false
    for (const state of this.nodes.values()) {
      for (const axis of ['x', 'y', 'z'] as const) {
        const delta = state.target[axis] - state.pos[axis]
        if (Math.abs(delta) > 0.05) { state.pos[axis] += delta * k; moving = true } else state.pos[axis] = state.target[axis]
      }
      const alphaDelta = state.targetAlpha - state.alpha
      if (Math.abs(alphaDelta) > 0.004) { state.alpha += alphaDelta * fade; moving = true } else state.alpha = state.targetAlpha
      const emphasisDelta = state.targetEmphasis - state.emphasis
      if (Math.abs(emphasisDelta) > 0.004) { state.emphasis += emphasisDelta * fade; moving = true } else state.emphasis = state.targetEmphasis
    }
    let removed = false
    for (const [id, state] of this.nodes) if (state.removing && state.alpha <= 0.01) { this.nodes.delete(id); removed = true }
    if (removed) this.rebuildOrder()
    return moving
  }

  private writeNodes() {
    const geometry = this.nodePoints.geometry
    const position = geometry.getAttribute('position') as BufferAttribute
    const size = geometry.getAttribute('size') as BufferAttribute
    const alpha = geometry.getAttribute('alpha') as BufferAttribute
    const emphasis = geometry.getAttribute('emphasis') as BufferAttribute
    const sourceBoost = this.emphasiseSources
    this.order.forEach((state, index) => {
      position.setXYZ(index, state.pos.x, state.pos.y, state.pos.z)
      size.setX(index, state.size * (sourceBoost && state.node.kind === 'instrument' ? 1.35 : 1))
      alpha.setX(index, state.alpha)
      emphasis.setX(index, state.emphasis)
    })
    for (const attribute of [position, size, alpha, emphasis]) attribute.needsUpdate = true
  }

  private visibleEdges() {
    return this.edges.filter((edge) => this.showSynthesis || !edge.basis || !synthesisBases.has(edge.basis))
  }

  private buildEdges() {
    const focus = this.selected
    const highlightPairs = new Set<string>()
    const path = [...this.highlight]
    for (let index = 0; index < path.length - 1; index++) { highlightPairs.add(`${path[index]}|${path[index + 1]}`); highlightPairs.add(`${path[index + 1]}|${path[index]}`) }
    const webPositions: number[] = [], webColors: number[] = [], webAlpha: number[] = []
    const activePositions: number[] = [], activeColors: number[] = []
    this.activeCurves = []
    const baseAlpha = focus ? 0.035 : 0.075
    const a = new Color(), b = new Color(), c1 = new Color(), c2 = new Color()
    const accent = new Color('#5ee4ff'), aurora = new Color('#a78bfa')
    for (const edge of this.visibleEdges()) {
      const source = this.nodes.get(edge.sourceId), target = this.nodes.get(edge.targetId)
      if (!source || !target) continue
      const visibility = Math.min(source.alpha, target.alpha)
      if (visibility < 0.02) continue
      const isActive = !!focus && (edge.sourceId === focus || edge.targetId === focus)
      const isPath = highlightPairs.has(`${edge.sourceId}|${edge.targetId}`)
      const curve = curvePoints(source.pos, target.pos, segments)
      a.copy(this.colorFor(source.node)); b.copy(this.colorFor(target.node))
      if (isActive || isPath) {
        const tint = isPath ? aurora : accent
        for (let index = 0; index < segments; index++) {
          const p = curve[index], q = curve[index + 1]
          activePositions.push(p.x, p.y, p.z, q.x, q.y, q.z)
          c1.copy(a).lerp(tint, 0.35 + 0.3 * (index / segments)); c2.copy(a).lerp(tint, 0.35 + 0.3 * ((index + 1) / segments))
          activeColors.push(c1.r, c1.g, c1.b, c2.r, c2.g, c2.b)
        }
        this.activeCurves.push({ curve, path: isPath, offset: (edge.id.length * 0.137) % 1 })
      } else {
        const alpha = baseAlpha * visibility
        for (let index = 0; index < segments; index++) {
          const p = curve[index], q = curve[index + 1]
          webPositions.push(p.x, p.y, p.z, q.x, q.y, q.z)
          c1.copy(a).lerp(b, index / segments); c2.copy(a).lerp(b, (index + 1) / segments)
          webColors.push(c1.r, c1.g, c1.b, c2.r, c2.g, c2.b)
          webAlpha.push(alpha, alpha)
        }
      }
    }
    writeAttributes(this.web, webAlpha.length, { position: [webPositions, 3], color: [webColors, 3], alpha: [webAlpha, 1] })
    this.active.visible = activePositions.length > 0
    if (activePositions.length) {
      const geometry = new LineSegmentsGeometry()
      geometry.setPositions(activePositions)
      geometry.setColors(activeColors)
      this.active.geometry.dispose()
      this.active.geometry = geometry
    }
  }

  /* One travelling signal per highlighted edge; returns whether any are animating. */
  private writePulses(time: number) {
    const moving = !this.reducedMotion && !this.paused && time < this.pulseUntil
    const curves = moving ? this.activeCurves : []
    const count = curves.length
    const positions = new Float32Array(count * 3), colors = new Float32Array(count * 3)
    const accent = new Color('#9ef0ff'), aurora = new Color('#c4b5fd')
    curves.forEach(({ curve, path, offset }, item) => {
      const t = (time * 0.00032 + offset) % 1
      const index = Math.min(segments - 1, Math.floor(t * segments)), local = t * segments - index
      const p = curve[index], q = curve[index + 1]
      positions.set([p.x + (q.x - p.x) * local, p.y + (q.y - p.y) * local, p.z + (q.z - p.z) * local], item * 3)
      const color = path ? aurora : accent
      colors.set([color.r, color.g, color.b], item * 3)
    })
    if (count || this.pulses.geometry.drawRange.count) writeAttributes(this.pulses, count, {
      position: [positions, 3], color: [colors, 3], size: [new Float32Array(count).fill(5), 1], alpha: [new Float32Array(count).fill(1), 1],
      shape: [new Float32Array(count), 1], ring: [new Float32Array(count), 1], emphasis: [new Float32Array(count).fill(0.6), 1],
    })
    return count > 0
  }

  private tick = (time: number) => {
    this.frame = 0
    if (this.disposed || this.inactive) return
    this.ticking = true
    this.dirty = false
    const dt = this.last ? Math.min(64, time - this.last) : 16
    this.last = time
    let animating = false
    if (this.flight) {
      const progress = Math.min(1, (time - this.flight.start) / this.flight.duration)
      const eased = easeInOutCubic(progress)
      this.camera.position.lerpVectors(this.flight.fromPos, this.flight.toPos, eased)
      this.controls.target.lerpVectors(this.flight.fromTarget, this.flight.toTarget, eased)
      if (progress >= 1) this.flight = undefined
      animating = true
    }
    const idle = time - this.lastInteraction > 6000
    this.controls.autoRotate = !this.reducedMotion && !this.paused && !this.selected && !this.flight && idle && !document.hidden
    const controlsMoving = this.controls.update(dt / 1000)
    const nodesMoving = this.step(dt)
    if (nodesMoving) this.edgesDirty = true
    const pulsing = this.render(time)
    animating ||= controlsMoving || nodesMoving || this.controls.autoRotate || pulsing || time < this.settleUntil
    this.ticking = false
    if (animating || this.dirty) this.frame = requestAnimationFrame(this.tick)
    else this.last = 0
  }

  private render(time: number) {
    this.writeNodes()
    if (this.edgesDirty) { this.buildEdges(); this.edgesDirty = false }
    const pulsing = this.writePulses(time)
    this.starMaterial.uniforms.uTime.value = time
    this.core.scale.setScalar(110 + (this.reducedMotion || this.paused ? 0 : Math.sin(time * 0.0014) * 8))
    if (this.composer) this.composer.render()
    else this.renderer.render(this.scene, this.camera)
    this.onFrame?.()
    return pulsing
  }
}
