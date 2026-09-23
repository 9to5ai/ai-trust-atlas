import { ArrowRight, Path } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { assertionById, basisLabel, findPaths, objectById, objects } from '../lib/workspace'

const destinations = [
  { label: 'Control objectives', kinds: ['Control'] },
  { label: 'Trust concepts', kinds: ['Concept'] },
  { label: 'Risks', kinds: ['Risk'] },
  { label: 'Sources', kinds: ['Source'] },
]

/* Walks recorded assertions from the selected item to a chosen destination and lights the route in the Universe. */
export function TracePanel({ from, onShow, onSelect }: { from: string; onShow: (nodeIds: string[]) => void; onSelect: (id: string) => void }) {
  const [to, setTo] = useState('')
  const [shown, setShown] = useState<number | undefined>()
  const routes = useMemo(() => (to ? findPaths(from, to, 'all', 4).slice(0, 3) : []), [from, to])
  const groups = useMemo(() => destinations.map((group) => ({ ...group, options: objects.filter((item) => group.kinds.includes(item.kind) && item.id !== from).sort((a, b) => a.name.localeCompare(b.name)) })), [from])
  return (
    <details className="inspector-section trace-section">
      <summary><Path size={16} weight="duotone" /> Trace a connection</summary>
      <p className="section-boundary">Follow recorded links from this item to another. Each step keeps its basis; a missing route does not prove a missing relationship.</p>
      <label className="trace-picker">
        <span>Destination</span>
        <select aria-label="Trace destination" value={to} onChange={(event) => { setTo(event.target.value); setShown(undefined); onShow([]) }}>
          <option value="">Choose where to go…</option>
          {groups.map((group) => <optgroup key={group.label} label={group.label}>{group.options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</optgroup>)}
        </select>
      </label>
      {to && !routes.length && <p className="trace-empty">No route within four recorded steps.</p>}
      <ol className="trace-routes">
        {routes.map((route, index) => (
          <li key={route.edgeIds.join('|')} className={shown === index ? 'is-shown' : undefined}>
            <div className="trace-chain">
              {route.nodeIds.map((id, step) => (
                <span key={id} className="trace-step">
                  <button type="button" onClick={() => onSelect(id)} title={objectById.get(id)?.kind}>{objectById.get(id)?.name ?? id}</button>
                  {step < route.edgeIds.length && <em title={assertionById.get(route.edgeIds[step])?.rationale}>{basisLabel[assertionById.get(route.edgeIds[step])?.basis ?? 'atlas-synthesis']}<ArrowRight size={11} /></em>}
                </span>
              ))}
            </div>
            <button type="button" className="trace-show" aria-pressed={shown === index} onClick={() => { const next = shown === index ? undefined : index; setShown(next); onShow(next === undefined ? [] : route.nodeIds) }}>{shown === index ? 'Hide route' : 'Show in Universe'}</button>
          </li>
        ))}
      </ol>
    </details>
  )
}
