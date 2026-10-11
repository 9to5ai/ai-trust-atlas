import type { GraphNode } from '../types'

// The envelope includes room for glyphs and their glow. It never depends on the corpus size.
export const universeRadius = 600
export const nodeEnvelope = 520
export const depthScale = 1.4

const fraction = (id: string, salt: string) => {
  let value = 2166136261
  for (const char of `${salt}:${id}`) value = Math.imul(value ^ char.charCodeAt(0), 16777619)
  return (value >>> 0) / 4294967296
}

// Stable longitude within the topic, equal-area latitude, and a small inward layer.
// No count, index or sort order enters the coordinates: adding or filtering sources cannot move existing ones.
export function sourcePosition(id: string, topicAngle: number, sectorWidth: number, radius = 510, latitudeBias = 0) {
  const shell = Math.min(nodeEnvelope, radius) - fraction(id, 'shell') * 50
  const z = Math.max(-0.9, Math.min(0.9, fraction(id, 'latitude') * 1.5 - 0.75 + latitudeBias)) * shell
  const angle = topicAngle + (fraction(id, 'longitude') - 0.5) * sectorWidth
  const radial = Math.sqrt(shell * shell - z * z)
  return { x: Math.cos(angle) * radial, y: Math.sin(angle) * radial, z: z / depthScale }
}

export function boundNode(node: GraphNode) {
  const length = Math.hypot(node.targetX, node.targetY, node.targetZ * depthScale)
  if (length <= nodeEnvelope) return
  const scale = nodeEnvelope / length
  node.x = node.targetX *= scale
  node.y = node.targetY *= scale
  node.z = node.targetZ *= scale
}
