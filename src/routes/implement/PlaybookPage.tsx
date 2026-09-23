import { ArrowRight, ClipboardText } from '@phosphor-icons/react'
import { Link } from '../../app/router'
import { recordLink } from '../../ask/links'
import { controlObjectives } from '../../data/controls'
import { playbookById } from '../../data/implement'
import { objectById } from '../../lib/workspace'
import { Badge, Button, Callout, DraftBadge } from '../../ui/Kit'
import { Page } from '../../ui/Page'
import { NotFound } from '../NotFound'
import styles from './Implement.module.css'

const controlById = new Map(controlObjectives.map((control) => [control.id, control]))

export function PlaybookPage({ id }: { id: string }) {
  const playbook = playbookById.get(id)
  if (!playbook) return <NotFound />
  return (
    <Page labelledBy="playbook-title" wide>
      <nav className={styles.crumbs} aria-label="Breadcrumb"><Link to="/implement">Implement</Link><span>/</span><span>Playbook</span></nav>
      <header className={styles.hero}>
        <div className={styles.meta}><Badge tone="signal">Playbook</Badge><Badge>{playbook.timeframe}</Badge>{playbook.editorialStatus === 'draft' && <DraftBadge />}</div>
        <h1 id="playbook-title">{playbook.title}</h1>
        <p>{playbook.outcome}</p>
        <dl className={styles.facts}>
          <div><dt>For</dt><dd>{playbook.audience}</dd></div>
          <div><dt>Roles</dt><dd>{playbook.roles.join(' · ')}</dd></div>
        </dl>
        <div className={styles.meta}><Button to="/assess" variant="secondary"><ClipboardText size={16} /> Assess readiness first</Button></div>
      </header>
      <ol className={styles.steps}>
        {playbook.steps.map((step, index) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.stepNumber}>{index + 1}</span>
            <div className={styles.stepBody}>
              <h2>{step.title}</h2>
              <p>{step.guidance}</p>
              <div className={styles.stepGrid}>
                <div><h3>Controls built</h3><ul>{step.controlIds.map((controlId) => { const control = controlById.get(controlId)!; return <li key={controlId}><Link to={`/crosswalk/${controlId}`}><span>{control.code}</span> {control.name}</Link></li> })}</ul></div>
                <div><h3>Why — sources</h3><ul>{step.sourceIds.map((sourceId) => <li key={sourceId}><Link to={recordLink(sourceId)}>{objectById.get(sourceId)?.name ?? sourceId}</Link></li>)}</ul></div>
                <div><h3>Artefacts</h3><ul>{step.artefacts.map((artefact) => <li key={artefact}>{artefact}</li>)}</ul></div>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <Callout tone="caution">Atlas practice guidance drafted for review. Adapt it to your context; it does not establish what any organisation is required to do. <Link to="/implement">More playbooks <ArrowRight size={12} /></Link></Callout>
    </Page>
  )
}
