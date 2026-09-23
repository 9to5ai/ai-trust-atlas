import { ArrowRight, CaretDown } from '@phosphor-icons/react'
import { Link } from '../../app/router'
import { assessmentFamilies, evidenceLabels, levels, type EvidenceStatus, type Level } from '../../assess/content'
import { scoreAssessment } from '../../assess/score'
import { updateAssessment, updateResponse, useAssessment, type ItemResponse } from '../../assess/store'
import { Badge } from '../../ui/Kit'
import { Page } from '../../ui/Page'
import { NotFound } from '../NotFound'
import styles from './Assess.module.css'

function LevelPicker({ name, label, value, onChange }: { name: string; label: string; value?: Level; onChange: (level: Level) => void }) {
  return (
    <fieldset className={styles.levels}>
      <legend>{label}</legend>
      <div>
        {levels.map((level) => (
          <label key={level.level} title={`${level.name}: ${level.description}`} className={value === level.level ? styles.levelOn : undefined}>
            <input type="radio" name={name} value={level.level} checked={value === level.level} onChange={() => onChange(level.level)} />
            <span className="tabular">{level.level}</span>
          </label>
        ))}
      </div>
      <small>{value === undefined ? 'Not rated' : levels[value].name}</small>
    </fieldset>
  )
}

export function AssessEditor({ id }: { id: string }) {
  const assessment = useAssessment(id)
  if (!assessment) return <NotFound />
  const score = scoreAssessment(assessment)
  const response = (objectiveId: string): ItemResponse => assessment.responses[objectiveId] ?? { notes: '', evidence: 'not-requested' }

  return (
    <Page labelledBy="editor-title" wide>
      <header className={styles.editorHead}>
        <div>
          <nav className={styles.crumbs} aria-label="Breadcrumb"><Link to="/assess">Assess</Link><span>/</span><span>Questionnaire</span></nav>
          <input id="editor-title" className={styles.titleInput} value={assessment.name} onChange={(event) => updateAssessment(id, { name: event.target.value })} aria-label="Assessment name" />
          <input className={styles.scopeInput} value={assessment.scope} onChange={(event) => updateAssessment(id, { scope: event.target.value })} placeholder="Add a scope…" aria-label="Assessment scope" />
          {assessment.example && <Badge tone="aurora">Example data</Badge>}
        </div>
        <div className={styles.editorStatus}>
          <strong className="tabular">{score.rated}<small>/{score.total}</small></strong>
          <span>rated</span>
          <div className={styles.progress}><i style={{ width: `${(score.rated / score.total) * 100}%` }} /></div>
          <Link to={`/assess/${id}/report`} className={styles.primary}>View report <ArrowRight size={16} /></Link>
        </div>
      </header>

      <details className={styles.scale}>
        <summary>The maturity scale <CaretDown size={14} /></summary>
        <ol>{levels.map((level) => <li key={level.level}><strong className="tabular">{level.level} · {level.name}</strong> {level.description}</li>)}</ol>
      </details>

      {assessmentFamilies.map(({ family, items }) => (
        <section key={family.id} className={styles.family} aria-labelledby={`family-${family.id}`}>
          <h2 id={`family-${family.id}`}><i style={{ background: family.color }} />{family.name}<small>{family.question}</small></h2>
          {items.map((item) => {
            const value = response(item.control.id)
            return (
              <article key={item.control.id} className={styles.itemCard} aria-labelledby={`item-${item.control.id}`}>
                <div className={styles.itemHead}>
                  <span className={styles.code}>{item.control.code}</span>
                  <h3 id={`item-${item.control.id}`}>{item.control.name}</h3>
                  <p>{item.control.objective}</p>
                </div>
                <div className={styles.ratings}>
                  <LevelPicker name={`${item.control.id}-current`} label="Current" value={value.current} onChange={(level) => updateResponse(id, item.control.id, { current: level })} />
                  <LevelPicker name={`${item.control.id}-target`} label="Target" value={value.target} onChange={(level) => updateResponse(id, item.control.id, { target: level })} />
                  <label className={styles.evidence}>Evidence
                    <select value={value.evidence} onChange={(event) => updateResponse(id, item.control.id, { evidence: event.target.value as EvidenceStatus })}>
                      {Object.entries(evidenceLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                    </select>
                  </label>
                </div>
                <textarea className={styles.notes} rows={2} value={value.notes} onChange={(event) => updateResponse(id, item.control.id, { notes: event.target.value })} placeholder="Notes, owners, open questions…" aria-label={`Notes for ${item.control.code}`} />
                <details className={styles.guide}>
                  <summary>What good looks like, procedures and evidence</summary>
                  <p>{item.lookFor}</p>
                  <div className={styles.guideGrid}>
                    <div><h4>Design procedures to consider</h4><ul>{item.designProcedures.map((step) => <li key={step}>{step}</li>)}</ul></div>
                    <div><h4>Operating procedures to consider</h4><ul>{item.operatingProcedures.map((step) => <li key={step}>{step}</li>)}</ul></div>
                    <div><h4>Evidence to request</h4><ul>{item.evidenceRequests.map((request) => <li key={request}>{request}</li>)}</ul></div>
                  </div>
                  <Link to={`/crosswalk/${item.control.id}`}>See the obligations this control maps to →</Link>
                </details>
              </article>
            )
          })}
        </section>
      ))}
    </Page>
  )
}
