import { ArrowRight, ChatsCircle, Compass, MagnifyingGlass, X } from '@phosphor-icons/react'
import { instruments } from '../data/instruments'
import { audiences, audienceNames } from '../data/leadershipQuestions'
import { recommendedTour } from '../data/tours'
import { useBrief } from './LeadershipQuestions'
import styles from './StartHere.module.css'

export const START_HERE_STORAGE_KEY = 'atlas-start-here-dismissed-v1'
export const readStartHereDismissed = () => { try { return localStorage.getItem(START_HERE_STORAGE_KEY) === '1' } catch { return false } }
export const storeStartHereDismissed = () => { try { localStorage.setItem(START_HERE_STORAGE_KEY, '1') } catch { /* The card simply returns next visit. */ } }

const regionCount = new Set(instruments.map((source) => source.region)).size

type Props = { onStartTour: (id: string) => void; onPrepareQuestions: () => void; onSearch: () => void; onDismiss: () => void }

/* First-use task chooser over the map. The role choice is the shared question audience, saved on this device. */
export function StartHere({ onStartTour, onPrepareQuestions, onSearch, onDismiss }: Props) {
  const { audience, setAudience } = useBrief()
  const tour = recommendedTour(audience)
  return (
    <section className={styles.card} aria-labelledby="start-here-title">
      <button type="button" className={styles.close} onClick={onDismiss} aria-label="Close start here"><X size={14} /></button>
      <span className={styles.eyebrow}>Start here</span>
      <h2 id="start-here-title" className={styles.title}>What are you preparing for?</h2>
      <div className={styles.roles} role="group" aria-label="I am preparing as">
        {audiences.map((role) => <button key={role} type="button" aria-pressed={audience === role} onClick={() => setAudience(role)}>{role === 'assurance' ? 'Assurance' : audienceNames[role]}</button>)}
      </div>
      <ul className={styles.tasks}>
        <li><button type="button" className={styles.primary} onClick={() => onStartTour(tour.id)}><Compass size={18} weight="duotone" /><span><strong>Take the recommended tour</strong><small>{tour.title} · about {tour.minutes} min</small></span><ArrowRight size={14} /></button></li>
        <li><button type="button" onClick={onPrepareQuestions}><ChatsCircle size={18} weight="duotone" /><span><strong>Prepare questions for a meeting</strong><small>Discussion prompts for {audienceNames[audience]}</small></span><ArrowRight size={14} /></button></li>
        <li><button type="button" onClick={onSearch}><MagnifyingGlass size={18} /><span><strong>Look up a source or topic</strong><small>For example CPS 230, EU AI Act, human oversight</small></span><ArrowRight size={14} /></button></li>
      </ul>
      <button type="button" className={styles.secondary} onClick={onDismiss}>Explore the full Universe</button>
      <p className={styles.scope}>A reference map of {instruments.length} sources across {regionCount} regions, with particular attention to Australia and financial services. Lines are recorded associations, not findings that a source applies to you, compliance or legal advice.</p>
    </section>
  )
}
