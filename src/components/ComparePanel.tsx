import { ArrowsLeftRight, X } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { concepts } from '../data/concepts'
import { instrumentById } from '../data/instruments'
import { authorityLabels } from '../lib/labels'

type Props = {
  compareIds: string[]
  onRemove: (instrumentId: string) => void
  onClear: () => void
}

export function ComparePanel({ compareIds, onRemove, onClear }: Props) {
  const selected = compareIds.map((id) => instrumentById.get(id)).filter(Boolean)
  if (selected.length === 0) return null
  const shared = selected.length === 2 ? selected[0]!.conceptIds.filter((id) => selected[1]!.conceptIds.includes(id)) : []

  return (
    <AnimatePresence>
      <motion.section className="compare-panel" initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 34 }} aria-label="Instrument comparison">
        <div className="compare-head">
          <div><ArrowsLeftRight /><strong>Concept comparison</strong><span>{selected.length === 1 ? 'Select one more instrument' : `${shared.length} shared concepts`}</span></div>
          <button type="button" onClick={onClear} aria-label="Close comparison"><X /></button>
        </div>
        <div className={`compare-grid compare-grid-${selected.length}`}>
          {selected.map((instrument) => instrument && (
            <article key={instrument.id}>
              <button className="compare-remove" type="button" onClick={() => onRemove(instrument.id)} aria-label={`Remove ${instrument.shortTitle}`}><X /></button>
              <span>{authorityLabels[instrument.authorityClass]}</span>
              <h3>{instrument.shortTitle}</h3>
              <p>{instrument.issuer}</p>
              <div className="compare-concepts">
                {instrument.conceptIds.map((id) => {
                  const concept = concepts.find((candidate) => candidate.id === id)
                  return concept ? <span className={shared.includes(id) ? 'shared' : ''} key={id}>{concept.name}</span> : null
                })}
              </div>
            </article>
          ))}
        </div>
      </motion.section>
    </AnimatePresence>
  )
}
