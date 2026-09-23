import { describe, expect, it } from 'vitest'
import { curvePoints, nodeSize, pickNode, placeLabels, worldPosition } from './geometry'

describe('universe geometry', () => {
  it('flips the canvas y axis and lifts depth so the disc reads in 3D', () => {
    expect(worldPosition({ targetX: 10, targetY: 20, targetZ: 10 })).toEqual({ x: 10, y: -20, z: 14 })
  })
  it('draws curves that start and end on their nodes and bow toward the centre', () => {
    const points = curvePoints({ x: 100, y: 0, z: 0 }, { x: 0, y: 100, z: 0 }, 10)
    expect(points).toHaveLength(11)
    expect(points[0]).toEqual({ x: 100, y: 0, z: 0 })
    expect(points[10]).toEqual({ x: 0, y: 100, z: 0 })
    expect(Math.hypot(points[5].x, points[5].y)).toBeLessThan(Math.hypot(50, 50))
  })
  it('grows hubs but caps the bonus', () => {
    expect(nodeSize('concept', 0)).toBeLessThan(nodeSize('concept', 25))
    expect(nodeSize('concept', 10000) - nodeSize('concept', 0)).toBe(10)
  })
  it('picks the nearest visible node within reach', () => {
    const nodes = [
      { id: 'a', x: 100, y: 100, radius: 6, depth: 0.5, alpha: 1, visible: true },
      { id: 'b', x: 112, y: 100, radius: 6, depth: 0.5, alpha: 1, visible: true },
      { id: 'hidden', x: 104, y: 100, radius: 6, depth: 0.5, alpha: 0.05, visible: true },
    ]
    expect(pickNode(nodes, 104, 100)).toBe('a')
    expect(pickNode(nodes, 111, 100)).toBe('b')
    expect(pickNode(nodes, 300, 300)).toBeUndefined()
  })
  it('places labels by priority without overlaps', () => {
    const placed = placeLabels([
      { id: 'low', x: 100, y: 100, radius: 5, text: 'Overlapping label', priority: 1 },
      { id: 'high', x: 104, y: 102, radius: 5, text: 'Selected label', priority: 10 },
      { id: 'far', x: 400, y: 100, radius: 5, text: 'Far', priority: 2 },
    ], 10)
    expect(placed.map((label) => label.id)).toEqual(['high', 'far'])
  })
})
