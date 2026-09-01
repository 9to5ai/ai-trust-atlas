import { Atom, Rows, ShieldCheck, WarningDiamond } from '@phosphor-icons/react'
import type { LayoutMode } from '../lib/graphModel'

type Props = {
  layout: LayoutMode
  onLayoutChange: (layout: LayoutMode) => void
}

const views: { id: LayoutMode; label: string; detail: string; icon: typeof Atom }[] = [
  { id: 'ontology', label: 'Meaning', detail: '12 themes', icon: Atom },
  { id: 'authority', label: 'Authority', detail: '12 classes', icon: Rows },
  { id: 'risk', label: 'Risks', detail: '24 types', icon: WarningDiamond },
  { id: 'controls', label: 'Controls', detail: '24 objectives', icon: ShieldCheck },
]

export function UniverseRail({ layout, onLayoutChange }: Props) {
  return (
    <nav className="universe-rail" aria-label="Universe views">
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
            aria-label={`${view.label}: ${view.detail}`}
            onClick={() => onLayoutChange(view.id)}
          >
            <span><Icon weight={active ? 'fill' : 'regular'} /></span>
            <strong>{view.label}</strong>
            <small>{view.detail}</small>
          </button>
        )
      })}
    </nav>
  )
}
