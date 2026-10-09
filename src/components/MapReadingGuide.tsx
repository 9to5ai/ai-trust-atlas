import { Info } from '@phosphor-icons/react'
import styles from './MapReadingGuide.module.css'

/* What points, lines and traced routes mean, and what they do not establish. Sits with the map legend. */
export function MapReadingGuide({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <details className={styles.guide} open={defaultOpen || undefined}>
      <summary><Info size={13} /> How to read this map</summary>
      <div className={styles.panel}>
        <p><strong>Points</strong> are records: sources and their sections, trust concepts, MIT risk types and candidate control objectives.</p>
        <p><strong>Lines</strong> are recorded associations. Each keeps its basis: stated in the source, taken from a published crosswalk, or an Atlas interpretation. The eye button hides Atlas interpretations.</p>
        <p><strong>Traced routes</strong> (violet) follow recorded links step by step. They help navigation; they are not causal chains.</p>
        <p className={styles.limits}>A line or route does not show that a source applies to you, that a control exists or works, or that anything is compliant. A missing line does not prove a missing relationship. Position and glow aid navigation and do not rank importance.</p>
      </div>
    </details>
  )
}
