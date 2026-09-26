import { Printer } from '@phosphor-icons/react'
import { useMemo, type CSSProperties } from 'react'
import { Link } from '../../app/router'
import { compileEvidencePack } from '../core/evidence'
import { domainIds, domains, maturityLevels } from '../core/facets'
import { keyDateApplies } from '../core/roadmap'
import { useCorpus } from '../PracticeApp'
import { useWorkspace } from '../store'
import { domainColors } from './PracticeMap'
import styles from './BoardSummary.module.css'

/*
 * A one-to-two page board summary, designed to print cleanly or be saved as a PDF from the browser's print dialog.
 */
export function BoardSummary() {
  const corpus = useCorpus()
  const workspace = useWorkspace()
  const today = new Date().toISOString().slice(0, 10)
  const pack = useMemo(() => compileEvidencePack(corpus, workspace, { today, practiceIds: corpus.practices.map((practice) => practice.id) }), [corpus, workspace, today])
  const { result, roadmap } = pack
  const now = roadmap.filter((item) => item.bucket === 'now')
  const horizon = new Date(Date.parse(`${today}T00:00:00Z`) + 365 * 86_400_000).toISOString().slice(0, 10)
  // One line per date, with the practices it affects; agency and WA dates only when the profile says they apply.
  const applies = (label: string) => keyDateApplies(label, workspace.profile)
  const byDate = new Map<string, { date: string; label: string; practiceIds: string[] }>()
  for (const practice of corpus.practices) for (const keyDate of practice.australia.keyDates) {
    if (keyDate.date < today || keyDate.date > horizon || !applies(keyDate.label)) continue
    const entry = byDate.get(keyDate.date)
    if (!entry) byDate.set(keyDate.date, { date: keyDate.date, label: keyDate.label, practiceIds: [practice.id] })
    else {
      if (!entry.practiceIds.includes(practice.id)) entry.practiceIds.push(practice.id)
      if (keyDate.label.length < entry.label.length) entry.label = keyDate.label
    }
  }
  const dates = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))
  const organisation = workspace.profile.orgName || 'Our organisation'
  const formatted = new Date(`${today}T00:00:00Z`).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  const total = pack.counts.none + pack.counts.planned + pack.counts.collected + pack.counts.reviewed

  return (
    <main id="main-content" className={styles.page} aria-labelledby="board-title">
      <div className={styles.toolbar}>
        <Link to="/practice/roadmap">← Back to the roadmap</Link>
        <button type="button" className={styles.print} onClick={() => window.print()}><Printer size={16} /> Print or save as PDF</button>
      </div>
      <article className={styles.sheet}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>AI trust · board summary</span>
          <h1 id="board-title">{organisation}</h1>
          <p>{formatted}. Prepared with AI Trust Practice from the organisation's own self-assessment. General information, not legal or professional advice.</p>
        </header>

        <section className={styles.headline}>
          <div><span className={styles.big}>{result.overall.score?.toFixed(1) ?? '—'}</span><span>Average maturity (of 4)</span></div>
          <div><span className={styles.big}>{result.overall.rated}/{result.overall.total}</span><span>Practices assessed</span></div>
          <div><span className={styles.big}>{now.length}</span><span>Priorities now</span></div>
          <div><span className={styles.big}>{total ? Math.round(((pack.counts.reviewed + pack.counts.collected) / total) * 100) : 0}%</span><span>Evidence collected or reviewed</span></div>
        </section>

        <section>
          <h2>Maturity by domain</h2>
          <table className={styles.table}>
            <thead><tr><th scope="col">Domain</th><th scope="col">Average level</th><th scope="col">Rated</th></tr></thead>
            <tbody>
              {domainIds.filter((domain) => result.domains[domain].total).map((domain) => {
                const aggregate = result.domains[domain]
                return (
                  <tr key={domain} style={{ '--c': domainColors[domain] } as CSSProperties}>
                    <th scope="row"><span className={styles.dot} />{domains[domain].name}</th>
                    <td><span className={styles.meter}><span style={{ width: `${((aggregate.score ?? 0) / 4) * 100}%` }} /></span>{aggregate.score ? `${aggregate.score.toFixed(1)} · ${maturityLevels[Math.max(0, Math.round(aggregate.score) - 1)].name}` : 'Not rated'}</td>
                    <td>{aggregate.rated} of {aggregate.total}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>

        <section>
          <h2>Priorities now</h2>
          {now.length ? (
            <ol className={styles.list}>
              {now.map((item) => <li key={item.practiceId}><strong>{item.practiceId} {item.title}</strong> — {item.current ? maturityLevels[item.current - 1].name : 'not assessed'} to {maturityLevels[item.target - 1].name}. Owner: {item.owner}. <span className={styles.why}>{item.reasons.slice(1, 3).join(' ')}</span></li>)}
            </ol>
          ) : <p>No practices below target.</p>}
        </section>

        {dates.length > 0 && (
          <section>
            <h2>Australian dates in the next 12 months</h2>
            <ul className={styles.list}>{dates.map((keyDate) => <li key={keyDate.date}><strong>{new Date(`${keyDate.date}T00:00:00Z`).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</strong>: {keyDate.label} <span className={styles.why}>({keyDate.practiceIds.join(', ')})</span></li>)}</ul>
          </section>
        )}

        <section>
          <h2>Decisions for the board</h2>
          <ul className={styles.list}>
            <li>Note the maturity position and the priorities now.</li>
            <li>Confirm the owners named against each priority.</li>
            <li>Agree when the board next receives an update on progress and evidence.</li>
          </ul>
        </section>
        <footer className={styles.footer}>Self-assessed ratings are not independently verified. Ratings above "Operating" require a named person to attest. Evidence status reflects records kept by the organisation.</footer>
      </article>
    </main>
  )
}
