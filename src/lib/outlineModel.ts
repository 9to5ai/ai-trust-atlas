import { riskPathsForInstrument } from '../data/assertions'
import { concepts, domains } from '../data/concepts'
import { controlFamilies, controlObjectives } from '../data/controls'
import { riskDomains, riskSubdomains } from '../data/mitRiskTaxonomy'
import { instrumentById } from '../data/instruments'
import { relations } from '../data/relations'
import { authorityLabels } from './labels'
import type { Instrument } from '../types'
import { primaryDomainFor, type LayoutMode } from './graphModel'

export type OutlineNode = { id: string; label: string; description: string; kind: string; color: string; meta?: string; children: OutlineNode[] }
export type OutlineRow = { node: OutlineNode; key: string; depth: number; ancestors: string[] }
const colorFor = (ids: string[]) => domains.find(d => d.id === concepts.find(c => ids.includes(c.id))?.domainId)?.color ?? '#7db9f5'
const group = (id: string, label: string, children: OutlineNode[], color: string): OutlineNode => ({ id, label, children, color, kind: 'group', description: '' })
const conceptNode = (id: string): OutlineNode[] => {
  const c = concepts.find(c => c.id === id)
  return c ? [{ id: `concept:${id}`, label: c.name, description: c.definition, kind: 'concept', color: colorFor([id]), children: [] }] : []
}
const sourceLeaf = (s: Instrument, meta?: string): OutlineNode => ({ id: `instrument:${s.id}`, label: s.shortTitle, description: s.summary, kind: 'instrument', color: domains.find(d => d.id === primaryDomainFor(s))?.color ?? colorFor(s.conceptIds), meta: meta ?? `${authorityLabels[s.authorityClass]} · ${s.status.replaceAll('-', ' ')}`, children: [] })
const sourceNode = (s: Instrument): OutlineNode => {
  const color = colorFor(s.conceptIds)
  const legal = relations.filter(r => r.sourceId === s.id && ['made-under', 'issuer-governed-by'].includes(r.type)).flatMap(r => {
    const act = instrumentById.get(r.targetId)
    return act ? [{ ...sourceLeaf(act, r.type === 'made-under' ? 'Made under' : 'APRA’s governing legislation'), description: r.explanation }] : []
  })
  return { ...sourceLeaf(s), children: [
    ...s.provisions.map(p => ({ id: `provision:${p.id}`, label: `${p.ref} · ${p.title}`, description: p.summary, kind: 'provision', color, children: [] })),
    ...(legal.length ? [group(`legal:${s.id}`, 'Legal foundations', legal, color)] : []),
  ] }
}
const controlLeaf = (c: typeof controlObjectives[number]): OutlineNode => ({ id: `control-objective:${c.id}`, label: `${c.code} · ${c.name}`, description: c.objective, kind: 'control-objective', color: controlFamilies.find(f => f.id === c.familyId)?.color ?? '#74b9a2', children: [] })
const riskLeaf = (r: typeof riskSubdomains[number]): OutlineNode => ({ id: `risk-subdomain:${r.id}`, label: `${r.ref} · ${r.name}`, description: r.definition, kind: 'risk-subdomain', color: riskDomains.find(d => d.id === r.riskDomainId)?.color ?? '#df83a7', children: [] })

export function buildOutline(mode: LayoutMode, sources: Instrument[]): OutlineNode[] {
  if (mode === 'risk') return riskDomains.map(d => ({ id: `risk-domain:${d.id}`, label: d.name, description: d.definition, kind: 'risk-domain', color: d.color, children: riskSubdomains.filter(r => r.riskDomainId === d.id).map(r => ({ ...riskLeaf(r), children: [
    group(`risk-concepts:${r.id}`, 'Related concepts', r.conceptIds.flatMap(conceptNode), d.color),
    group(`risk-sources:${r.id}`, 'Related sources', sources.map(s => ({ s, path: riskPathsForInstrument(s.id).find(p => p.riskId === r.id) })).filter(entry => entry.path).sort((a, b) => b.path!.score - a.path!.score).map(({ s }) => sourceNode(s)), d.color),
    group(`risk-controls:${r.id}`, 'Connected controls', controlObjectives.filter(c => c.riskIds.includes(r.id)).map(controlLeaf), d.color),
  ].filter(g => g.children.length) })) }))
  if (mode === 'controls') return controlFamilies.map(f => ({ id: `control-family:${f.id}`, label: f.name, description: f.definition, kind: 'control-family', color: f.color, children: controlObjectives.filter(c => c.familyId === f.id).map(c => ({ ...controlLeaf(c), children: [
    group(`control-concepts:${c.id}`, 'Related concepts', c.conceptIds.flatMap(conceptNode), f.color),
    group(`control-sources:${c.id}`, 'Supporting sources', sources.filter(s => c.sourceRefs.some(ref => ref.instrumentId === s.id)).map(sourceNode), f.color),
    group(`control-risks:${c.id}`, 'Related risks', riskSubdomains.filter(r => c.riskIds.includes(r.id)).map(riskLeaf), f.color),
  ].filter(g => g.children.length) })) }))
  return domains.map(d => ({ id: `domain:${d.id}`, label: d.name, description: d.definition, kind: 'domain', color: d.color, children: concepts.filter(c => c.domainId === d.id).map(c => ({ ...conceptNode(c.id)[0], children: sources.filter(s => s.conceptIds.includes(c.id)).sort((a, b) => b.provisions.filter(p => p.conceptIds.includes(c.id)).length - a.provisions.filter(p => p.conceptIds.includes(c.id)).length || a.shortTitle.localeCompare(b.shortTitle)).map(sourceNode) })) }))
}

// Each appearance has its own path; all appearances retain a single canonical node ID.
export function flattenOutline(nodes: OutlineNode[], expanded: Set<string>, query = '', parent = '', ancestors: string[] = [], includeAll = false): OutlineRow[] {
  const q = query.trim().toLowerCase()
  const matches = (n: OutlineNode): boolean => `${n.label} ${n.description} ${n.meta ?? ''}`.toLowerCase().includes(q) || n.children.some(matches)
  return nodes.flatMap(node => {
    if (q && !includeAll && !matches(node)) return []
    const key = `${parent}/${node.id}`
    const row = { node, key, depth: ancestors.length, ancestors }
    return [row, ...((expanded.has(key) || q) ? flattenOutline(node.children, expanded, query, key, [...ancestors, key], includeAll || (!!q && `${node.label} ${node.description} ${node.meta ?? ''}`.toLowerCase().includes(q))) : [])]
  })
}
export function pathToNode(nodes: OutlineNode[], id: string, parent = ''): string[] | undefined {
  for (const node of nodes) {
    const key = `${parent}/${node.id}`
    if (node.id === id) return [key]
    const child = pathToNode(node.children, id, key)
    if (child) return [key, ...child]
  }
}

export function buildSourceDirectory(sources: Instrument[]): OutlineNode[] {
  return [...sources].sort((a, b) => a.shortTitle.localeCompare(b.shortTitle)).map(sourceNode)
}
export function outlineTrail(nodes: OutlineNode[], id: string, appearance?: string[]): OutlineNode[] {
  if (appearance?.length) {
    const trail: OutlineNode[] = []
    let children = nodes
    for (const key of appearance) {
      const node = children.find(n => key.endsWith(`/${n.id}`))
      if (!node) return outlineTrail(nodes, id)
      trail.push(node); children = node.children
    }
    return trail
  }
  for (const node of nodes) {
    if (node.id === id) return [node]
    const child = outlineTrail(node.children, id)
    if (child.length) return [node, ...child]
  }
  return []
}
