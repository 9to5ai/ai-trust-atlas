import type { GraphNode, GraphNodeKind } from '../types'

/* Pure helpers shared by the WebGL engine and its tests. */

export type Vec3 = { x: number; y: number; z: number }
export type NodeShape = 0 | 1 | 2 | 3 | 4 // circle, hexagon, diamond, octagon, triangle

export const depthScale = 1.4
export const worldPosition = (node: Pick<GraphNode, 'targetX' | 'targetY' | 'targetZ'>): Vec3 => ({ x: node.targetX, y: -node.targetY, z: node.targetZ * depthScale })

export const nodeStyle: Record<GraphNodeKind, { shape: NodeShape; ring: boolean; size: number; rank: number }> = {
  domain: { shape: 0, ring: true, size: 30, rank: 0 },
  'risk-domain': { shape: 1, ring: true, size: 28, rank: 0 },
  'control-family': { shape: 3, ring: true, size: 28, rank: 0 },
  concept: { shape: 0, ring: false, size: 13, rank: 1 },
  'risk-subdomain': { shape: 2, ring: false, size: 14, rank: 1 },
  'control-objective': { shape: 3, ring: false, size: 13, rank: 1 },
  instrument: { shape: 1, ring: false, size: 11, rank: 2 },
  incident: { shape: 4, ring: false, size: 13, rank: 2 },
  'use-case': { shape: 2, ring: false, size: 12, rank: 2 },
  provision: { shape: 2, ring: false, size: 7, rank: 3 },
}

/* Node size grows gently with its number of connections so hubs read as hubs. */
export const nodeSize = (kind: GraphNodeKind, degree: number) => nodeStyle[kind].size + Math.min(10, Math.sqrt(degree) * 1.4)

/* Quadratic curve bowed toward the centre, which bundles long links into arcs. */
export function curvePoints(from: Vec3, to: Vec3, segments = 12, bow = 0.22): Vec3[] {
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2, z: (from.z + to.z) / 2 }
  const control = { x: mid.x * (1 - bow), y: mid.y * (1 - bow), z: mid.z + Math.hypot(to.x - from.x, to.y - from.y) * 0.06 }
  const points: Vec3[] = []
  for (let index = 0; index <= segments; index++) {
    const t = index / segments
    const a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t
    points.push({ x: a * from.x + b * control.x + c * to.x, y: a * from.y + b * control.y + c * to.y, z: a * from.z + b * control.z + c * to.z })
  }
  return points
}

export type ScreenNode = { id: string; x: number; y: number; radius: number; depth: number; alpha: number; visible: boolean }

/* Nearest visible node under the pointer, favouring the one closest to the camera on ties. */
export function pickNode(nodes: ScreenNode[], x: number, y: number, slop = 8): string | undefined {
  let best: ScreenNode | undefined
  let bestDistance = Infinity
  for (const node of nodes) {
    if (!node.visible || node.alpha < 0.2) continue
    const distance = Math.hypot(node.x - x, node.y - y)
    const reach = Math.max(node.radius + slop, 12)
    if (distance > reach) continue
    const score = distance - node.depth * 0.001
    if (score < bestDistance) { best = node; bestDistance = score }
  }
  return best?.id
}

export type LabelCandidate = { id: string; x: number; y: number; radius: number; text: string; priority: number; charWidth?: number }
export type PlacedLabel = LabelCandidate & { width: number; height: number }

/* Greedy placement: highest priority first, skipping labels that would overlap one already placed. */
export function placeLabels(candidates: LabelCandidate[], maxCount: number, charWidth = 7, height = 18): PlacedLabel[] {
  const placed: PlacedLabel[] = []
  for (const candidate of [...candidates].sort((a, b) => b.priority - a.priority)) {
    if (placed.length >= maxCount) break
    const width = Math.min(260, candidate.text.length * (candidate.charWidth ?? charWidth) + 14)
    const box = { left: candidate.x - width / 2, right: candidate.x + width / 2, top: candidate.y + candidate.radius + 4, bottom: candidate.y + candidate.radius + 4 + height }
    const collides = placed.some((label) => {
      const other = { left: label.x - label.width / 2, right: label.x + label.width / 2, top: label.y + label.radius + 4, bottom: label.y + label.radius + 4 + label.height }
      return box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top
    })
    if (!collides) placed.push({ ...candidate, width, height })
  }
  return placed
}

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
