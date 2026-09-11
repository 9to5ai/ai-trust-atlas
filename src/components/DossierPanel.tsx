import { ArrowRight, DownloadSimple, FileText, Path, Trash, X } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { assertionsForNode } from '../data/assertions'
import { concepts, domains } from '../data/concepts'
import { controlFamilies, controlObjectives } from '../data/controls'
import { instrumentById, instruments } from '../data/instruments'
import { riskDomainById, riskSubdomainById } from '../data/mitRiskTaxonomy'

type Props = {
  open: boolean
  nodeIds: string[]
  onClose: () => void
  onSelect: (nodeId: string) => void
  onRemove: (nodeId: string) => void
  onClear: () => void
}

export const describeNode = (nodeId: string) => {
  const [kind, rawId] = nodeId.split(':')
  if (kind === 'instrument') {
    const item = instrumentById.get(rawId)
    return item ? { label: item.shortTitle, detail: item.title, kind: 'Source' } : undefined
  }
  if (kind === 'provision') {
    const owner = instruments.find((instrument) => instrument.provisions.some((provision) => provision.id === rawId))
    const item = owner?.provisions.find((provision) => provision.id === rawId)
    return item ? { label: item.ref, detail: item.title, kind: 'Source provision' } : undefined
  }
  if (kind === 'concept') {
    const item = concepts.find((concept) => concept.id === rawId)
    return item ? { label: item.name, detail: item.definition, kind: 'Trust concept' } : undefined
  }
  if (kind === 'domain') {
    const item = domains.find((domain) => domain.id === rawId)
    return item ? { label: item.name, detail: item.question, kind: 'Visual theme' } : undefined
  }
  if (kind === 'risk-domain') {
    const item = riskDomainById.get(rawId)
    return item ? { label: item.name, detail: item.definition, kind: 'MIT risk domain' } : undefined
  }
  if (kind === 'risk-subdomain') {
    const item = riskSubdomainById.get(rawId)
    return item ? { label: `${item.ref} · ${item.name}`, detail: item.definition, kind: 'MIT risk type' } : undefined
  }
  if (kind === 'control-family') {
    const item = controlFamilies.find((family) => family.id === rawId)
    return item ? { label: item.name, detail: item.definition, kind: 'Control family' } : undefined
  }
  if (kind === 'control-objective') {
    const item = controlObjectives.find((control) => control.id === rawId)
    return item ? { label: `${item.code} · ${item.name}`, detail: item.objective, kind: 'Control objective' } : undefined
  }
  return undefined
}

export function exportDossier(nodeIds: string[]) {
  return ['# AI Trust Atlas — saved items', '', `Exported: ${new Date().toISOString().slice(0,10)}`, '', 'A navigational record of a curated corpus. Mappings are not findings of applicability, compliance or effectiveness. Human assessment is required.', '', ...nodeIds.flatMap((nodeId, index) => {
    const item = describeNode(nodeId)
    if (!item) return []
    const assertions = assertionsForNode(nodeId)
    const references = [...new Set(assertions.flatMap(a => a.citations.map(c => `- ${c.sourceTitle} — ${c.locator}: ${c.url} (accessed ${c.accessedAt})`)))]
    const source = nodeId.startsWith('instrument:') ? instrumentById.get(nodeId.split(':')[1]) : undefined
    return [`## ${index + 1}. ${item.label}`, '', `Type: ${item.kind}`, '', item.detail, '', `Atlas: https://ai-trust-atlas.vercel.app/#/${nodeId.replace(':','/')}`, ...(source ? ['', `Official source: ${source.officialUrl}`, `Corpus verification date: ${source.lastVerified}`] : []), '', `Mapping basis: ${assertions.filter(a=>a.basis==='atlas-synthesis').length} Atlas interpretation; ${assertions.filter(a=>a.basis!=='atlas-synthesis').length} source-authored or published-crosswalk assertions.`, '', '### Source references', ...(references.length ? references : ['No citation-bearing assertions recorded for this object.']), '']
  })].join('\n')
}

export function DossierPanel({ open, nodeIds, onClose, onSelect, onRemove, onClear }: Props) {
  const entries = nodeIds.map((nodeId) => ({ nodeId, descriptor: describeNode(nodeId) })).filter((entry) => entry.descriptor)
  return <AnimatePresence>
    {open && <motion.aside className="dossier-panel" initial={{ opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 34 }} aria-label="Saved items">
      <header>
        <div><Path /><span>Saved items</span></div>
        <button type="button" onClick={onClose} aria-label="Close saved items"><X /></button>
      </header>
      <div className="dossier-intro"><span>Saved as you explore</span><h2>Your saved items</h2><p>The last 40 items you explore are saved automatically in this browser. Revisit them or export them with their sources. Saving an item does not mean it has been assessed or approved.</p></div>
      <div className="dossier-route">
        {entries.map(({ nodeId, descriptor }, index) => descriptor && <article key={nodeId}>
          <span className="dossier-index">{String(index + 1).padStart(2, '0')}</span>
          <button className="dossier-entry" type="button" onClick={() => onSelect(nodeId)}>
            <small>{descriptor.kind}</small><strong>{descriptor.label}</strong><p>{descriptor.detail}</p>
          </button>
          <button className="dossier-remove" type="button" onClick={() => onRemove(nodeId)} aria-label={`Remove ${descriptor.label} from saved items`}><X /></button>
          {index < entries.length - 1 && <ArrowRight className="dossier-arrow" aria-hidden="true" />}
        </article>)}
        {entries.length === 0 && <div className="dossier-empty"><FileText /><strong>No saved items yet.</strong><p>Select a topic, source, risk or control to save it here automatically.</p></div>}
      </div>
      {entries.length > 0 && <button className="dossier-export" type="button" onClick={() => { const url = URL.createObjectURL(new Blob([exportDossier(nodeIds)], {type:'text/markdown;charset=utf-8'})); const link = document.createElement('a'); link.href=url; link.download='ai-trust-atlas-dossier.md'; link.click(); window.setTimeout(()=>URL.revokeObjectURL(url),1000) }}><DownloadSimple/> Export saved items with sources</button>}
      {entries.length > 0 && <button className="dossier-clear" type="button" onClick={onClear}><Trash /> Clear saved items</button>}
    </motion.aside>}
  </AnimatePresence>
}
