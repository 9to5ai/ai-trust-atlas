import { ArrowSquareOut } from '@phosphor-icons/react'
import type { Addressee, Modality, Requirement } from '../types'
import { controlObjectiveById } from '../data/controls'
import { instrumentById } from '../data/instruments'
import { DraftBadge } from '../ui/Kit'
import styles from './RequirementList.module.css'

export const modalityLabels: Record<Modality, string> = { must: 'Must', should: 'Should', may: 'May' }
export const addresseeLabels: Record<Addressee, string> = {
  provider: 'Providers',
  deployer: 'Deployers',
  'regulated-entity': 'Regulated entities',
  board: 'Boards',
  'senior-management': 'Senior management',
  'accountable-person': 'Accountable persons',
  'government-agency': 'Government agencies',
  supervisor: 'Supervisors',
  'any-organisation': 'Any organisation',
}
const dateLabel = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00Z`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : date

type Props = { items: Requirement[]; onSelectNode: (id: string) => void; showSource?: boolean }

/* What a source expects, of whom and by when. The requirement is paraphrased from the source; control links are Atlas suggestions. */
export function RequirementList({ items, onSelectNode, showSource = false }: Props) {
  return (
    <ul className={styles.list}>
      {items.map((item) => {
        const source = instrumentById.get(item.instrumentId)
        return (
          <li key={item.id} className={styles.item}>
            <div className={styles.head}>
              <span className={`${styles.modality} ${styles[item.modality]}`}>{modalityLabels[item.modality]}</span>
              {showSource && source ? <button type="button" className={styles.source} onClick={() => onSelectNode(item.provisionId ? `provision:${item.provisionId}` : `instrument:${source.id}`)}>{source.shortTitle} · {item.ref}</button> : <span className={styles.ref}>{item.ref}</span>}
              {item.appliesFrom && <span className={styles.date}>From {dateLabel(item.appliesFrom)}</span>}
            </div>
            <strong className={styles.title}>{item.title}</strong>
            <p className={styles.summary}>{item.summary}</p>
            <p className={styles.meta}>Applies to {item.addressees.map((addressee) => addresseeLabels[addressee].toLowerCase()).join(', ')}</p>
            {item.controlIds.length > 0 && (
              <div className={styles.controls} aria-label="Candidate control objectives">
                {item.controlIds.map((id) => { const control = controlObjectiveById.get(id); return control ? <button type="button" key={id} onClick={() => onSelectNode(`control-objective:${id}`)}>{control.code} {control.shortName}</button> : null })}
              </div>
            )}
            <div className={styles.foot}>
              <a href={item.sourceUrl} target="_blank" rel="noreferrer">Source text <ArrowSquareOut size={12} /></a>
              {item.editorialStatus === 'draft' && <DraftBadge />}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
