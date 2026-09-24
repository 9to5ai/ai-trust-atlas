import type { RefObject } from 'react'
import type { GraphModel } from '../types'

/* Shared contract for the WebGL universe and the 2D fallback canvas. */
export type UniverseNavigation = { capture: () => unknown; restore: (pose: unknown) => void }
export type UniverseProps = {
  model: GraphModel
  selectedNodeId?: string
  onSelect: (nodeId?: string) => void
  showSourceLabels?: boolean
  navigationRef?: RefObject<UniverseNavigation | null>
  inactive?: boolean
  focusRequest?: number
  highlightIds?: string[]
}

export function connectionSummary(model: GraphModel, selectedNodeId?: string) {
  if (!selectedNodeId) return 'No node selected. Use arrow keys to select nodes, plus and minus to zoom, or 0 to reset the universe.'
  const selected = model.nodes.find((node) => node.id === selectedNodeId)
  const adjacentIds = new Set<string>()
  model.edges.forEach((edge) => {
    if (edge.sourceId === selectedNodeId) adjacentIds.add(edge.targetId)
    if (edge.targetId === selectedNodeId) adjacentIds.add(edge.sourceId)
  })
  const labels = [...adjacentIds].map((id) => model.nodes.find((node) => node.id === id)?.shortLabel).filter(Boolean).slice(0, 8)
  return `${selected?.label ?? selectedNodeId}. ${adjacentIds.size} immediate connections${labels.length ? `: ${labels.join(', ')}` : ''}. Arrow keys move between connected items.`
}

/* WebGL2 with a real context; jsdom and locked-down machines fall back to the 2D canvas. */
export function supportsWebGL() {
  if (typeof window === 'undefined' || typeof WebGL2RenderingContext === 'undefined') return false
  if (new URLSearchParams(window.location.search).get('renderer') === '2d') return false
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    const ok = !!context
    context?.getExtension('WEBGL_lose_context')?.loseContext()
    return ok
  } catch {
    return false
  }
}
