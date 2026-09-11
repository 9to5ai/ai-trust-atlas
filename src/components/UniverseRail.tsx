import { Atom, Rows, ShieldCheck, WarningDiamond } from '@phosphor-icons/react'
import type { LayoutMode } from '../lib/graphModel'

type Props = {
  layout: LayoutMode
  onLayoutChange: (layout: LayoutMode) => void
}

const views: { id: LayoutMode; index: string; label: string; detail: string; icon: typeof Atom }[] = [
  { id: 'ontology', index: '01', label: 'By topic', detail: '', icon: Atom },
  { id: 'authority', index: '02', label: 'By source type', detail: '', icon: Rows },
  { id: 'risk', index: '03', label: 'Risks', detail: '24 risk types', icon: WarningDiamond },
  { id: 'controls', index: '04', label: 'Controls', detail: '24 objectives', icon: ShieldCheck },
]

export function UniverseRail({ layout, onLayoutChange }: Props) {
  return (
    <nav className="universe-rail" aria-label="Map views">
      <span className="universe-rail-label">Explore the map</span>
      <span className="universe-rail-line" aria-hidden="true" />
      {views.map((view) => {
        const Icon = view.icon
        const active = layout === view.id
        return (
          <button
            type="button"
            key={view.id}
            className={active ? 'active' : ''}
            aria-current={active ? 'page' : undefined}
            aria-label={view.detail ? `${view.label}: ${view.detail}` : view.label}
            onClick={() => onLayoutChange(view.id)}
          >
            <small className="plate-index">{view.index}</small>
            <span><Icon weight={active ? 'fill' : 'regular'} /></span>
            <span className="plate-copy"><strong>{view.label}</strong>{view.detail && <small>{view.detail}</small>}</span>
          </button>
        )
      })}
    </nav>
  )
}
