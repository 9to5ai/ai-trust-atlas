import { ChartBar, DownloadSimple, Flask, PencilSimple, Plus, Trash, UploadSimple } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { Link, navigate } from '../../app/router'
import { assessmentDisclaimer } from '../../assess/content'
import { formatScore, scoreAssessment } from '../../assess/score'
import { assessmentStorageFailed, createAssessment, createExampleAssessment, deleteAssessment, exportAssessmentJson, importAssessmentJson, useAssessments } from '../../assess/store'
import { Badge, Button, Callout, EmptyState } from '../../ui/Kit'
import { Page, PageHero } from '../../ui/Page'
import styles from './Assess.module.css'

const download = (filename: string, text: string) => {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function AssessHome() {
  const assessments = useAssessments()
  const [name, setName] = useState('')
  const [scope, setScope] = useState('')
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <Page labelledBy="assess-title" wide>
      <PageHero id="assess-title" eyebrow="Assess" title="Readiness, measured against the controls that matter" lede="Rate current and target maturity for the 24 candidate control objectives, then see the gaps, the obligations they touch and a board-ready pack — without your answers ever leaving this browser." />

      <Callout title="Private by design">Assessments are saved only in this browser. Nothing is sent to a server or to Ask the Atlas. Export a file to keep or share your work. {assessmentDisclaimer}</Callout>
      {assessmentStorageFailed() && <Callout tone="caution" title="Browser storage is unavailable">Your answers will be lost when you close this page. Export before leaving.</Callout>}

      <section className={styles.start} aria-labelledby="new-title">
        <form className={styles.newCard} onSubmit={(event) => { event.preventDefault(); const id = createAssessment(name, scope); navigate(`/assess/${id}`) }}>
          <h2 id="new-title"><Plus size={18} /> New assessment</h2>
          <label>Name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Retail bank — customer-facing AI" required maxLength={120} /></label>
          <label>Scope<textarea value={scope} onChange={(event) => setScope(event.target.value)} rows={3} maxLength={400} placeholder="Which AI systems, business units or use cases are in scope?" /></label>
          <button type="submit" className={styles.primary}>Start assessment</button>
        </form>
        <div className={styles.sideActions}>
          <button type="button" className={styles.tile} onClick={() => { const id = createExampleAssessment(); navigate(`/assess/${id}/report`) }}>
            <Flask size={22} weight="duotone" /><strong>Load an example</strong><span>An illustrative regional bank, fully rated — ideal for a demonstration.</span>
          </button>
          <button type="button" className={styles.tile} onClick={() => fileRef.current?.click()}>
            <UploadSimple size={22} weight="duotone" /><strong>Import a file</strong><span>Open an assessment exported from the Atlas.</span>
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; const id = importAssessmentJson(await file.text()); setMessage(id ? 'Assessment imported.' : 'That file is not an Atlas assessment.'); if (id) navigate(`/assess/${id}`); event.target.value = '' }} />
          <p role="status" className={styles.status}>{message}</p>
        </div>
      </section>

      <section aria-labelledby="saved-title">
        <h2 id="saved-title" className={styles.sectionTitle}>Your assessments</h2>
        {assessments.length === 0 ? <EmptyState title="No assessments yet"><p>Start one above, or load the example to see the report.</p></EmptyState> : (
          <ul className={styles.list}>
            {assessments.map((assessment) => {
              const score = scoreAssessment(assessment)
              return (
                <li key={assessment.id} className={styles.item}>
                  <div className={styles.itemMain}>
                    <div className={styles.itemTitle}><Link to={`/assess/${assessment.id}`}>{assessment.name}</Link>{assessment.example && <Badge tone="aurora">Example data</Badge>}</div>
                    <p>{assessment.scope || 'No scope recorded.'}</p>
                    <div className={styles.progress} aria-label={`${score.rated} of ${score.total} rated`}><i style={{ width: `${(score.rated / score.total) * 100}%` }} /></div>
                    <small className="tabular">{score.rated}/{score.total} rated · current {formatScore(score.current)} → target {formatScore(score.target)} · updated {new Date(assessment.updatedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</small>
                  </div>
                  <div className={styles.itemActions}>
                    <Button to={`/assess/${assessment.id}`} variant="secondary"><PencilSimple size={16} /> Continue</Button>
                    <Button to={`/assess/${assessment.id}/report`} variant="primary"><ChartBar size={16} /> Report</Button>
                    <button type="button" className={styles.iconButton} onClick={() => download(`${assessment.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.atlas-assessment.json`, exportAssessmentJson(assessment))} aria-label={`Export ${assessment.name}`}><DownloadSimple size={16} /></button>
                    <button type="button" className={styles.iconButton} onClick={() => { if (window.confirm(`Delete “${assessment.name}” from this browser?`)) deleteAssessment(assessment.id) }} aria-label={`Delete ${assessment.name}`}><Trash size={16} /></button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </Page>
  )
}
