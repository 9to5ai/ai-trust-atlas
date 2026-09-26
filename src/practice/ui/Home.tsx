import { useMemo, useState } from 'react'
import { Link } from '../../app/router'
import { Chip, ChipGroup, DraftBadge } from '../../ui/Kit'
import { Page, PageHero, Section } from '../../ui/Page'
import { domainIds, domains, roleIds, roles, stageIds, stages, systemTypeIds, systemTypes, type RoleId, type SystemTypeId } from '../core/facets'
import type { Practice } from '../core/schema'
import { listChanges, matchesFilters } from '../core/search'
import { useCorpus } from '../PracticeApp'
import { useWorkspace } from '../store'
import styles from './Practice.module.css'

/* Home: every practice on the domain × lifecycle matrix, with system-type and role filters. */
export function Home() {
  const corpus = useCorpus()
  const workspace = useWorkspace()
  const [systemType, setSystemType] = useState<SystemTypeId>()
  const [role, setRole] = useState<RoleId>()
  const visible = useMemo(() => new Set(corpus.practices.filter((practice) => matchesFilters(practice, { systemType, role })).map((practice) => practice.id)), [corpus, systemType, role])
  const changes = listChanges(corpus).slice(0, 6)
  const draft = (practice: Practice) => corpus.includesDrafts && practice.status !== 'approved'
  const progress = (practice: Practice) => {
    const done = workspace.steps[practice.id]?.length ?? 0
    const total = practice.steps.foundations.length + practice.steps.implementation.length
    return done ? `${done} of ${total} steps done` : undefined
  }
  const chip = (practice: Practice) => (
    <Link key={practice.id} to={`/practice/p/${practice.id}`} className={styles.cellLink} data-dim={!visible.has(practice.id) || undefined} title={[practice.summary, progress(practice)].filter(Boolean).join(' · ')}>
      <span className={styles.cellId}>{practice.id}</span>
      <span className={styles.cellTitle}>{practice.title}</span>
      {!!workspace.steps[practice.id]?.length && <span className={styles.cellProgress} aria-label={progress(practice)} />}
    </Link>
  )

  return (
    <Page labelledBy="practice-home-title" wide>
      <PageHero
        id="practice-home-title"
        eyebrow="AI Trust Practice"
        title="Practices by domain and lifecycle stage"
        lede={`${corpus.practices.length} ${corpus.practices.length === 1 ? 'practice' : 'practices'}, each with steps for organisations starting out and for mature programs, evidence tests, maturity levels and prompts for drafting your own artefacts. Australian obligations and guidance are covered in depth.`}
      />
      <div className={styles.filters}>
        <ChipGroup label="AI system type">
          {systemTypeIds.map((id) => <Chip key={id} pressed={systemType === id} onClick={() => setSystemType(systemType === id ? undefined : id)}>{systemTypes[id].name}</Chip>)}
        </ChipGroup>
        <ChipGroup label="Role">
          {roleIds.map((id) => <Chip key={id} pressed={role === id} onClick={() => setRole(role === id ? undefined : id)}>{roles[id].name}</Chip>)}
        </ChipGroup>
      </div>

      <div className={styles.matrixWrap}>
        <table className={styles.matrix}>
          <caption className={styles.srOnly}>Practices by trust domain (rows) and lifecycle stage (columns)</caption>
          <thead>
            <tr>
              <th scope="col" className={styles.corner}>Domain</th>
              {stageIds.map((stage) => <th key={stage} scope="col">{stages[stage].name}</th>)}
            </tr>
          </thead>
          <tbody>
            {domainIds.map((domain) => (
              <tr key={domain}>
                <th scope="row"><span className={styles.domainCode}>{domains[domain].code}</span>{domains[domain].name}</th>
                {stageIds.map((stage) => {
                  const members = corpus.practices.filter((practice) => practice.domain === domain && practice.stages.includes(stage))
                  return <td key={stage}>{members.map(chip)}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.domainList}>
        {domainIds.map((domain) => {
          const members = corpus.practices.filter((practice) => practice.domain === domain)
          return (
            <section key={domain} aria-labelledby={`domain-${domain}`}>
              <h2 id={`domain-${domain}`} className={styles.domainHeading}><span className={styles.domainCode}>{domains[domain].code}</span>{domains[domain].name}</h2>
              {members.length ? <ul>{members.map((practice) => <li key={practice.id} data-dim={!visible.has(practice.id) || undefined}>
                <Link to={`/practice/p/${practice.id}`}><span className={styles.cellId}>{practice.id}</span> {practice.title}</Link>
                {draft(practice) && <DraftBadge />}
                <p>{practice.summary}</p>
              </li>)}</ul> : <p className={styles.muted}>Practices in this domain are being written.</p>}
            </section>
          )
        })}
      </div>

      <Section id="practice-changes" eyebrow="Changelog" title="Recent changes">
        <ul className={styles.changes}>
          {changes.map((change) => (
            <li key={`${change.practiceId}-${change.version}`}>
              <time dateTime={change.date}>{change.date}</time>
              <Link to={`/practice/p/${change.practiceId}`}>{change.practiceId} {change.title}</Link>
              <span className={styles.version}>v{change.version}</span>
              <span>{change.summary}</span>
            </li>
          ))}
        </ul>
      </Section>
      <p className={styles.disclaimer}>General information, not legal or professional advice. Every claim links to its source so you can check it. Corpus {corpus.version}{corpus.includesDrafts ? ', including drafts awaiting editorial review' : ''}.</p>
    </Page>
  )
}
