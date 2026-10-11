import { describe, expect, it } from 'vitest'
import { depthScale, nodeEnvelope, sourcePosition } from './universeLayout'

describe('bounded source layout', () => {
  it('handles a much larger corpus without growing the globe or moving existing sources', () => {
    const original = Array.from({ length: 100 }, (_, index) => sourcePosition(`source-${index}`, 0, 0.4))
    const expanded = Array.from({ length: 5000 }, (_, index) => sourcePosition(`source-${index}`, 0, 0.4))
    expect(expanded.slice(0, original.length)).toEqual(original)
    for (const point of expanded) {
      expect(Math.hypot(point.x, point.y, point.z * depthScale)).toBeLessThanOrEqual(nodeEnvelope)
      expect(Math.abs(Math.atan2(point.y, point.x))).toBeLessThanOrEqual(0.2)
    }
    // The sources use the volume rather than collapsing into an equatorial disc or a single rim.
    for (const sign of [-1, 1]) expect(expanded.filter(point => point.z * depthScale * sign > 200).length).toBeGreaterThan(800)
    expect(Math.min(...expanded.map(point => Math.hypot(point.x, point.y, point.z * depthScale)))).toBeLessThan(470)
  })
})
