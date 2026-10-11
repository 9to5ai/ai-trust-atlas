import { describe, expect, it } from 'vitest'
import { groupSources, paintClusters } from './sourceClusters'

describe('source detail through zoom', () => {
  const points = Array.from({ length: 12 }, (_, index) => ({ id: `source-${index}`, domainId: 'governance', x: 100 + index, y: 100 }))
  it('groups crowded sources by topic and retains every member', () => {
    const groups = groupSources([...points, ...points.map(point => ({ ...point, id: `other-${point.id}`, domainId: 'security', x: point.x + 64 }))])
    expect(groups).toHaveLength(2)
    expect(groups.flatMap(group => group.members)).toHaveLength(24)
    expect(groupSources(points.map(point => ({ ...point, x: point.x * 32 })))).toEqual([])
  })
  it('merges adjacent same-topic groups and avoids overlapping badge targets', () => {
    const groups = groupSources([...points.map(point => ({ ...point, x: 126 })), ...points.map(point => ({ ...point, id: `next-${point.id}`, x: 130 }))])
    expect(groups).toHaveLength(1)
    expect(groups[0].members).toHaveLength(24)
    const differentTopics = groupSources([...points, ...points.map(point => ({ ...point, id: `next-${point.id}`, domainId: 'security' }))])
    expect(differentTopics).toHaveLength(1)
    expect(differentTopics[0].members).toHaveLength(12)
  })
  it('makes a group keyboard accessible and removes the aggregate after zoom', () => {
    const container = document.createElement('div')
    const groups = groupSources(points)
    let selected: string[] = []
    paintClusters(container, groups, group => `Explore ${group.members.length} governance sources`, group => { selected = group.members })
    const button = container.querySelector('button')!
    expect(button.getAttribute('aria-label')).toBe('Explore 12 governance sources')
    button.click()
    expect(selected).toEqual(points.map(point => point.id))
    paintClusters(container, [], () => '', () => {})
    expect(container.children).toHaveLength(0)
  })
})
