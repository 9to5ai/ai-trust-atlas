export type SourcePoint = { id: string; domainId: string; x: number; y: number; color?: string }
export type SourceCluster = SourcePoint & { members: string[] }

// Fixed screen-space cells: source volume changes the count, never the envelope.
export function groupSources(points: SourcePoint[], cellSize = 32): SourceCluster[] {
  const cells = new Map<string, SourcePoint[]>()
  for (const point of points) {
    const key = `${point.domainId}:${Math.floor(point.x / cellSize)}:${Math.floor(point.y / cellSize)}`
    const cell = cells.get(key) ?? []
    cell.push(point)
    cells.set(key, cell)
  }
  const groups = [...cells].filter(([, members]) => members.length >= 5).map(([id, members]) => ({
    id, domainId: members[0].domainId, color: members[0].color, members: members.map(point => point.id),
    x: members.reduce((sum, point) => sum + point.x, 0) / members.length,
    y: members.reduce((sum, point) => sum + point.y, 0) / members.length,
  }))
  // Adjacent cells can meet at their edges. Merge their badges instead of stacking tap targets.
  for (let index = 0; index < groups.length; index++) {
    for (let other = index + 1; other < groups.length; other++) {
      const a = groups[index], b = groups[other]
      if (a.domainId !== b.domainId || Math.hypot(a.x - b.x, a.y - b.y) >= cellSize * 1.2) continue
      const count = a.members.length + b.members.length
      a.x = (a.x * a.members.length + b.x * b.members.length) / count
      a.y = (a.y * a.members.length + b.y * b.members.length) / count
      a.members.push(...b.members)
      groups.splice(other, 1)
      other = index // Check the merged centre against the remaining neighbours.
    }
  }
  // Different topics retain separate identities; if badges collide, show those sources individually.
  return groups.filter((group, index) => !groups.slice(0, index).some(other => Math.hypot(group.x - other.x, group.y - other.y) < cellSize * 1.1))
}

export function paintClusters(container: HTMLDivElement, clusters: SourceCluster[], describe: (cluster: SourceCluster) => string, focus: (cluster: SourceCluster) => void) {
  const existing = new Map([...container.children].map(child => [(child as HTMLButtonElement).dataset.cluster, child as HTMLButtonElement]))
  for (const cluster of clusters) {
    const button = existing.get(cluster.id) ?? document.createElement('button')
    existing.delete(cluster.id)
    button.type = 'button'
    button.dataset.cluster = cluster.id
    button.className = 'universe-source-cluster'
    button.textContent = String(cluster.members.length)
    button.setAttribute('aria-label', describe(cluster))
    button.style.borderColor = cluster.color ?? ''
    button.style.transform = `translate(${Math.round(cluster.x)}px, ${Math.round(cluster.y)}px) translate(-50%, -50%)`
    button.onclick = () => focus(cluster)
    if (!button.parentNode) container.appendChild(button)
  }
  existing.forEach(button => button.remove())
}
