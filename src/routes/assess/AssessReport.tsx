import { FilePpt, FileXls, PencilSimple, Printer } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from '../../app/router'
import { assessmentDisclaimer, assessmentFamilies, evidenceLabels, levels } from '../../assess/content'
import { formatScore, obligationsForGaps, scoreAssessment } from '../../assess/score'
import { useAssessment } from '../../assess/store'
import { useBrief } from '../../components/LeadershipQuestions'
import { Badge, Button, Callout } from '../../ui/Kit'
import { Page } from '../../ui/Page'
import { NotFound } from '../NotFound'
import styles from './Report.module.css'

function Dumbbell({ families }: { families: ReturnType<typeof scoreAssessment>['families'] }) {
  const width = 640, rowHeight = 44, left = 190, right = 40, top = 30
  const x = (value: number) => left + (value / 5) * (width - left - right)
  const height = top + families.length * rowHeight + 10
  return (
    <figure className={styles.figure}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Current and target maturity by control family, on a scale of 0 to 5" className={styles.dumbbell}>
        {levels.map((level) => <g key={level.level}><line x1={x(level.level)} x2={x(level.level)} y1={top - 8} y2={height - 6} className={styles.grid} /><text x={x(level.level)} y={14} textAnchor="middle" className={styles.axis}>{level.level}</text></g>)}
        {families.map((row, index) => {
          const y = top + index * rowHeight + rowHeight / 2
          return (
            <g key={row.family.id}>
              <text x={0} y={y} dominantBaseline="middle" className={styles.rowLabel}>{row.family.name}</text>
              {row.current !== undefined && row.target !== undefined && <line x1={x(row.current)} x2={x(row.target)} y1={y} y2={y} className={styles.span} />}
              {row.current !== undefined && <><circle cx={x(row.current)} cy={y} r={7} className={styles.current} /><text x={x(row.current)} y={y - 13} textAnchor="middle" className={styles.value}>{formatScore(row.current)}</text></>}
              {row.target !== undefined && <><circle cx={x(row.target)} cy={y} r={7} className={styles.target} /><text x={x(row.target)} y={y + 22} textAnchor="middle" className={styles.value}>{formatScore(row.target)}</text></>}
            </g>
          )
        })}
      </svg>
      <figcaption className={styles.legend}><span><i className={styles.currentKey} />Current (average)</span><span><i className={styles.targetKey} />Target (average)</span></figcaption>
    </figure>
  )
}

export function AssessReport({ id }: { id: string }) {
  const assessment = useAssessment(id)
  const { selected } = useBrief()
  const [busy, setBusy] = useState<string>()
  if (!assessment) return <NotFound />
  const score = scoreAssessment(assessment)
  const obligations = obligationsForGaps(score.gaps)
  const reviewed = score.evidence.filter((entry) => entry.status === 'reviewed').length
  const today = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })

  const exportPptx = async () => { setBusy('pptx'); try { const { downloadBoardPack } = await import('../../exports/boardPack'); await downloadBoardPack(assessment, selected) } finally { setBusy(undefined) } }
  const exportXlsx = async () => { setBusy('xlsx'); try { const { downloadAssessmentWorkbook } = await import('../../exports/assessmentWorkbook'); await downloadAssessmentWorkbook(assessment) } finally { setBusy(undefined) } }

  return (
    <Page labelledBy="report-title" wide>
      <header className={styles.head}>
        <div>
          <nav className={styles.crumbs} aria-label="Breadcrumb"><Link to="/assess">Assess</Link><span>/</span><Link to={`/assess/${id}`}>Questionnaire</Link><span>/</span><span>Report</span></nav>
          <span className={styles.eyebrow}>AI readiness report · {today}</span>
          <h1 id="report-title">{assessment.name}</h1>
          <p>{assessment.scope}</p>
          {assessment.example && <Badge tone="aurora">Example data — illustrative only</Badge>}
        </div>
        <div className={styles.actions}>
          <Button onClick={exportPptx} variant="primary" disabled={!!busy}><FilePpt size={18} /> {busy === 'pptx' ? 'Building…' : 'Board pack (PowerPoint)'}</Button>
          <Button onClick={exportXlsx} variant="secondary" disabled={!!busy}><FileXls size={18} /> {busy === 'xlsx' ? 'Building…' : 'Workbook (Excel)'}</Button>
          <Button onClick={() => window.print()} variant="secondary"><Printer size={18} /> Print or save PDF</Button>
          <Button to={`/assess/${id}`} variant="ghost"><PencilSimple size={18} /> Edit answers</Button>
        </div>
      </header>

      <dl className={styles.tiles}>
        <div><dt>Controls rated</dt><dd className="tabular">{score.rated}<small>/{score.total}</small></dd></div>
        <div><dt>Current maturity</dt><dd className="tabular">{formatScore(score.current)}<small>/5</small></dd></div>
        <div><dt>Target maturity</dt><dd className="tabular">{formatScore(score.target)}<small>/5</small></dd></div>
        <div><dt>Controls below target</dt><dd className="tabular">{score.gaps.length}</dd></div>
        <div><dt>Evidence reviewed</dt><dd className="tabular">{reviewed}<small>/{score.total}</small></dd></div>
      </dl>

      <div className={styles.twoCol}>
        <section className={styles.panel} aria-labelledby="family-title">
          <h2 id="family-title">Maturity by control family</h2>
          <Dumbbell families={score.families} />
        </section>
        <section className={styles.panel} aria-labelledby="strip-title">
          <h2 id="strip-title">All 24 control objectives</h2>
          <div className={styles.strip}>
            {assessmentFamilies.map(({ family, items }) => (
              <div key={family.id} className={styles.stripFamily}>
                <span className={styles.stripLabel}><i style={{ background: family.color }} />{family.shortName}</span>
                {items.map((item) => {
                  const response = assessment.responses[item.control.id]
                  return (
                    <Link key={item.control.id} to={`/crosswalk/${item.control.id}`} className={styles.bullet} title={`${item.control.code} ${item.control.name}: current ${response?.current ?? '—'}, target ${response?.target ?? '—'}`}>
                      <span className="tabular">{item.control.code.replace('ATC-', '')}</span>
                      <span className={styles.segments} aria-hidden="true">{[1, 2, 3, 4, 5].map((step) => <i key={step} data-filled={response?.current !== undefined && step <= response.current} data-target={response?.target === step} />)}</span>
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>
          <p className={styles.note}>Filled segments show current maturity; the outlined segment marks the target.</p>
        </section>
      </div>

      <section className={styles.panel} aria-labelledby="gaps-title">
        <h2 id="gaps-title">Priority gaps</h2>
        <p className={styles.note}>Ordered by the size of the gap, weighted by how many risks and mapped obligations each control connects to.</p>
        {score.gaps.length === 0 ? <p>No control is rated below its target.</p> : (
          <ol className={styles.gaps}>
            {score.gaps.slice(0, 6).map((gap) => (
              <li key={gap.item.control.id}>
                <div className={styles.gapHead}>
                  <Link to={`/crosswalk/${gap.item.control.id}`}><span className="tabular">{gap.item.control.code}</span> {gap.item.control.name}</Link>
                  <span className={`${styles.gapScore} tabular`}>{gap.current} → {gap.target}</span>
                </div>
                <p>First step to consider: {gap.item.control.implementationExamples[0]}.</p>
                {gap.links.length > 0 && <div className={styles.chips}>{gap.links.slice(0, 6).map((link) => <Link key={link.assertion.id} to={`/library/${link.instrument.id}#section-${link.provision.id}`}>{link.instrument.shortTitle} · {link.provision.ref}</Link>)}{gap.links.length > 6 && <span>+{gap.links.length - 6} more</span>}</div>}
              </li>
            ))}
          </ol>
        )}
      </section>

      {obligations.length > 0 && (
        <section className={styles.panel} aria-labelledby="obligations-title">
          <h2 id="obligations-title">Obligations touched by the top gaps</h2>
          <p className={styles.note}>From the Atlas crosswalk — Atlas interpretations, drafted for review. A mapping indicates relevance, not that closing the gap satisfies the provision.</p>
          <div className={styles.obligations}>
            {obligations.map((entry) => (
              <div key={entry.framework}>
                <h3>{entry.framework}</h3>
                <ul>{entry.provisions.map((link) => <li key={link.provision.id}><Link to={`/library/${link.instrument.id}#section-${link.provision.id}`}>{link.provision.ref}</Link> {link.provision.title}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.panel} aria-labelledby="evidence-title">
        <h2 id="evidence-title">Evidence requests</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th scope="col">Control</th><th scope="col">Evidence to request</th><th scope="col">Status</th></tr></thead>
            <tbody>
              {score.evidence.map(({ item, status }) => (
                <tr key={item.control.id}><th scope="row"><span className="tabular">{item.control.code}</span> {item.control.shortName}</th><td>{item.evidenceRequests.join('; ')}</td><td><Badge tone={status === 'reviewed' ? 'positive' : status === 'received' ? 'signal' : status === 'requested' ? 'caution' : 'neutral'}>{evidenceLabels[status]}</Badge></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="caution" title="About this report">{assessmentDisclaimer} Obligation mappings come from the Atlas crosswalk and are Atlas interpretations; they do not establish legal applicability.</Callout>
    </Page>
  )
}
