import { Check, Copy } from '@phosphor-icons/react'
import { Fragment, useId, useMemo, useState, type ReactNode } from 'react'
import { Link } from '../../app/router'
import { Badge, DraftBadge } from '../../ui/Kit'
import { Eyebrow, Page } from '../../ui/Page'
import { atlasRefs } from '../atlasRefs'
import { domains, maturityLevels, promptTypeNames, promptTypes, roles, sixPractices, stages, systemTypeIds, systemTypes, type PromptType, type RoleId } from '../core/facets'
import { assemblePrompt } from '../core/prompts'
import { citationLocator, citationSource, type Citation, type Practice } from '../core/schema'
import { useCorpus } from '../PracticeApp'
import { toggleStep, useWorkspace } from '../store'
import styles from './Practice.module.css'

/* One practice, rendered from its structured record. The same record is served to agents as JSON and Markdown. */
const sections = [
  ['why', 'Why it matters'], ['steps', 'Steps'], ['checkpoints', 'Human checkpoints'], ['roles', 'Roles'], ['artefacts', 'Artefacts'],
  ['evidence', 'Evidence tests'], ['maturity', 'Maturity levels'], ['variations', 'Variations'], ['australia', 'In Australia'],
  ['crosswalks', 'Crosswalks'], ['prompts', 'Prompt kit'], ['agents', 'For agents'], ['sources', 'Sources'],
] as const

const roleName = (who: string) => (who in roles ? roles[who as RoleId].name : who)
const methodNames = { inspect: 'Inspect', reperform: 'Re-perform', inquire: 'Inquire', observe: 'Observe', analyse: 'Analyse' } as const

export function PracticePage({ practice }: { practice: Practice }) {
  const corpus = useCorpus()
  const workspace = useWorkspace()
  const [tier, setTier] = useState<'foundations' | 'implementation'>('foundations')
  const sourceById = useMemo(() => new Map(corpus.sources.map((source) => [source.id, source])), [corpus])
  const byId = useMemo(() => new Map(corpus.practices.map((item) => [item.id, item])), [corpus])
  const done = new Set(workspace.steps[practice.id] ?? [])
  const totalSteps = practice.steps.foundations.length + practice.steps.implementation.length
  const draft = corpus.includesDrafts && practice.status !== 'approved'
  const refs = atlasRefs(practice.atlas)

  const cite = (citations: Citation[]) => (
    <span className={styles.cites}>
      {citations.map((citation, index) => {
        const source = sourceById.get(citationSource(citation))
        const locator = citationLocator(citation)
        return source ? <a key={index} href={source.url} target="_blank" rel="noreferrer" className={styles.cite} title={`${source.title} (${source.publisher}). Last verified ${source.lastVerified}.`}>{source.short ?? source.title}{locator ? `, ${locator}` : ''}</a> : null
      })}
    </span>
  )

  return (
    <Page labelledBy="practice-title" wide>
      <nav className={styles.crumbs} aria-label="Breadcrumb"><Link to="/practice">Practices</Link><span aria-hidden="true">/</span><span>{domains[practice.domain].name}</span></nav>
      <div className={styles.layout}>
        <article className={styles.article}>
          <header className={styles.practiceHead}>
            <Eyebrow>{practice.id} · {domains[practice.domain].name}</Eyebrow>
            <h1 id="practice-title" className={styles.practiceTitle}>{practice.title}</h1>
            <p className={styles.summary}>{practice.summary}</p>
            <div className={styles.badges}>
              {draft && <DraftBadge />}
              {practice.flagship && <Badge tone="signal">Flagship</Badge>}
              <Badge>Version {practice.version}</Badge>
              <Badge>Last verified {practice.lastVerified}</Badge>
            </div>
          </header>

          <Block id="why" title="Why it matters">
            <p className={styles.lead}>{practice.purpose}</p>
            <h3 className={styles.minor}>When it is done well</h3>
            <p>{practice.outcome}</p>
            {practice.prerequisites.length > 0 && <p className={styles.muted}>Builds on {practice.prerequisites.map((id, index) => <span key={id}>{index > 0 && ', '}{byId.has(id) ? <Link to={`/practice/p/${id}`}>{id} {byId.get(id)!.title}</Link> : id}</span>)}.</p>}
          </Block>

          <Block id="steps" title="Steps" aside={<span className={styles.muted}>{done.size} of {totalSteps} marked done in this browser</span>}>
            <div className={styles.tabs} role="tablist" aria-label="Step tier">
              {(['foundations', 'implementation'] as const).map((key) => (
                <button key={key} type="button" role="tab" id={`tab-${key}`} aria-selected={tier === key} aria-controls="steps-panel" className={styles.tab} onClick={() => setTier(key)}>
                  {key === 'foundations' ? 'Foundations' : 'Implementation'}
                  <span className={styles.tabNote}>{key === 'foundations' ? 'Starting out, or lower-risk use' : 'Mature programs, or higher-risk use'}</span>
                </button>
              ))}
            </div>
            <ol id="steps-panel" role="tabpanel" aria-labelledby={`tab-${tier}`} className={styles.steps}>
              {practice.steps[tier].map((step) => (
                <li key={step.id} className={styles.step} data-done={done.has(step.id) || undefined}>
                  <label className={styles.stepCheck}>
                    <input type="checkbox" checked={done.has(step.id)} onChange={() => toggleStep(practice.id, step.id)} />
                    <span className={styles.srOnly}>Mark step {step.id} done</span>
                  </label>
                  <div>
                    <h3 className={styles.stepTitle}><span className={styles.stepId}>{step.id}</span>{step.title}</h3>
                    <p>{step.detail}</p>
                    {cite(step.sources)}
                  </div>
                </li>
              ))}
            </ol>
          </Block>

          <Block id="checkpoints" title="Human checkpoints" intro="Decisions that need a named person, whoever (or whatever) does the legwork.">
            <ul className={styles.cards}>
              {practice.checkpoints.map((checkpoint) => (
                <li key={checkpoint.id}><span className={styles.stepId}>{checkpoint.id}</span><strong>{checkpoint.decision}</strong><span className={styles.muted}>{roleName(checkpoint.who)}</span><p>{checkpoint.why}</p></li>
              ))}
            </ul>
          </Block>

          <Block id="roles" title="Roles">
            <dl className={styles.roles}>
              <dt>Accountable</dt><dd>{practice.roles.accountableTitle} <span className={styles.muted}>({roles[practice.roles.accountable].name})</span></dd>
              {practice.roles.contributors.map((contributor) => <Fragment key={contributor.title}><dt>Contributes</dt><dd>{contributor.title} <span className={styles.muted}>({roles[contributor.role].name})</span></dd></Fragment>)}
            </dl>
          </Block>

          <Block id="artefacts" title="Artefacts" intro="What the practice produces. Use a credible external template where one exists, or the prompt kit below.">
            <ul className={styles.list}>
              {practice.artefacts.map((artefact) => (
                <li key={artefact.name}><strong>{artefact.name}.</strong> {artefact.description}
                  {artefact.templates.map((template) => <a key={template.url} className={styles.template} href={template.url} target="_blank" rel="noreferrer">Template: {template.title} ({template.publisher}){template.note ? ` — ${template.note}` : ''}</a>)}
                </li>
              ))}
            </ul>
          </Block>

          <Block id="evidence" title="Evidence tests" intro="How you would prove the practice operates, written the way an auditor would test it.">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th scope="col">Test</th><th scope="col">Method</th><th scope="col">Evidence</th></tr></thead>
                <tbody>{practice.evidenceTests.map((test) => <tr key={test.id}><td><span className={styles.stepId}>{test.id}</span>{test.test}</td><td>{methodNames[test.method]}</td><td>{test.evidence}</td></tr>)}</tbody>
              </table>
            </div>
          </Block>

          <Block id="maturity" title="Maturity levels" intro="Observable criteria for each level. These are the assessment questions.">
            <ol className={styles.maturity}>
              {practice.maturity.map((entry) => (
                <li key={entry.level}>
                  <span className={styles.levelNumber}>{entry.level}</span>
                  <strong>{maturityLevels[entry.level - 1].name}</strong>
                  <span className={styles.muted}>{maturityLevels[entry.level - 1].meaning}</span>
                  <ul>{entry.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
                </li>
              ))}
            </ol>
          </Block>

          <Block id="variations" title="Variations" intro="What changes by type of AI system.">
            <div className={styles.variations}>
              {systemTypeIds.filter((type) => practice.variations[type]?.length).map((type) => (
                <section key={type} data-yours={workspace.profile.systemTypes.includes(type) || undefined}>
                  <h3 className={styles.minor}>{systemTypes[type].name}{workspace.profile.systemTypes.includes(type) && <Badge tone="signal">In your profile</Badge>}</h3>
                  <ul>{practice.variations[type]!.map((line) => <li key={line}>{line}</li>)}</ul>
                </section>
              ))}
            </div>
          </Block>

          <Block id="australia" title="In Australia">
            <div className={styles.australia}>
              <p className={styles.sixLine}>Helps evidence the Guidance for AI Adoption: {practice.australia.sixPractices.map((id) => <Badge key={id} tone="aurora">Practice {id}: {sixPractices[id].name}</Badge>)}
                {practice.australia.guardrails.length > 0 && <span className={styles.muted}> Voluntary AI Safety Standard guardrails {practice.australia.guardrails.join(', ')}.</span>}</p>
              <h3 className={styles.minor}>Obligations and regulator expectations</h3>
              <ul className={styles.obligations}>
                {practice.australia.obligations.map((item, index) => (
                  <li key={index}><Badge tone={item.kind === 'obligation' ? 'caution' : 'neutral'}>{item.kind === 'obligation' ? 'Obligation' : item.kind === 'expectation' ? 'Expectation' : 'Guidance'}</Badge>
                    <p>{item.text}</p>{cite(item.sources)}
                    {item.atlas && <AtlasChips links={item.atlas} />}
                  </li>
                ))}
              </ul>
              {practice.australia.sectorNotes.length > 0 && <>
                <h3 className={styles.minor}>Sector notes</h3>
                <ul className={styles.list}>{practice.australia.sectorNotes.map((note) => <li key={note.sector}><strong>{note.sector}.</strong> {note.note} {cite(note.sources)}</li>)}</ul>
              </>}
              {practice.australia.keyDates.length > 0 && <>
                <h3 className={styles.minor}>Key dates</h3>
                <ul className={styles.dates}>{practice.australia.keyDates.map((keyDate) => <li key={keyDate.date + keyDate.label}><time dateTime={keyDate.date}>{formatDate(keyDate.date)}</time><span>{keyDate.label}</span></li>)}</ul>
              </>}
              {practice.australia.templates.length > 0 && <>
                <h3 className={styles.minor}>Australian templates and tools</h3>
                <ul className={styles.list}>{practice.australia.templates.map((template) => <li key={template.url}><a href={template.url} target="_blank" rel="noreferrer">{template.title}</a> <span className={styles.muted}>{template.publisher}</span></li>)}</ul>
              </>}
            </div>
          </Block>

          <Block id="crosswalks" title="Crosswalks">
            <dl className={styles.roles}>
              {practice.crosswalks.nistAiRmf.length > 0 && <><dt>NIST AI RMF</dt><dd>{practice.crosswalks.nistAiRmf.join(' · ')}</dd></>}
              {practice.crosswalks.iso42001.length > 0 && <><dt>ISO/IEC 42001</dt><dd>{practice.crosswalks.iso42001.join(' · ')}</dd></>}
              {practice.crosswalks.other.map((entry) => <Fragment key={entry.framework}><dt>{entry.framework}</dt><dd>{entry.refs.join(' · ')}</dd></Fragment>)}
            </dl>
            <h3 className={styles.minor}>In the Atlas</h3>
            <ul className={styles.atlasRefs}>
              {refs.map((ref) => <li key={`${ref.kind}-${ref.id}`}><Link to={ref.href}><span className={styles.refKind}>{ref.kind}</span>{ref.label}</Link>{ref.detail && <span className={styles.muted}>{ref.detail}</span>}</li>)}
            </ul>
          </Block>

          <Block id="prompts" title="Prompt kit" intro="Prompts that turn this practice into your own artefacts in the AI tool you use. Your profile is filled in here, in your browser; nothing is sent to this site.">
            <PromptKit practice={practice} />
          </Block>

          <Block id="agents" title="For agents" intro="The contract an AI agent follows when it works on this practice with you.">
            <div className={styles.agentGrid}>
              <section><h3 className={styles.minor}>Interview first</h3><ol className={styles.list}>{practice.agent.interview.map((question) => <li key={question}>{question}</li>)}</ol></section>
              <section><h3 className={styles.minor}>Stop for a person at</h3><ul className={styles.list}>{practice.agent.stopAt.map((id) => <li key={id}>{id}: {practice.checkpoints.find((checkpoint) => checkpoint.id === id)?.decision}</li>)}</ul>
                <p className={styles.muted}>An agent never rates its own work above Operating.</p></section>
              <section><h3 className={styles.minor}>Done when</h3><ul className={styles.list}>{practice.agent.done.map((line) => <li key={line}>{line}</li>)}</ul></section>
            </div>
          </Block>

          <Block id="sources" title="Sources">
            <ul className={styles.sources}>
              {practice.sources.map(citationSource).map((id) => sourceById.get(id)).filter((source) => !!source).map((source) => (
                <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a><span className={styles.muted}>{source.publisher}{source.published ? ` · ${source.published}` : ''} · verified {source.lastVerified}</span>{source.note && <span className={styles.sourceNote}>{source.note}</span>}</li>
              ))}
            </ul>
            <h3 className={styles.minor}>Changelog</h3>
            <ul className={styles.dates}>{practice.changelog.map((entry) => <li key={entry.version}><time dateTime={entry.date}>{entry.date}</time><span>v{entry.version} — {entry.summary}</span></li>)}</ul>
          </Block>
        </article>

        <aside className={styles.rail} aria-label="About this practice">
          <dl className={styles.facts}>
            <dt>Domain</dt><dd>{domains[practice.domain].name}</dd>
            <dt>Lifecycle</dt><dd>{practice.stages.map((stage) => stages[stage].name).join(', ')}</dd>
            <dt>Applies to</dt><dd>{practice.systemTypes.map((type) => systemTypes[type].name).join(', ')}</dd>
            <dt>Owner</dt><dd>{practice.roles.accountableTitle}</dd>
            <dt>Progress</dt><dd>{done.size} of {totalSteps} steps</dd>
          </dl>
          <nav aria-label="On this page" className={styles.toc}>
            <span className={styles.tocLabel}>On this page</span>
            {sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </nav>
        </aside>
      </div>
    </Page>
  )
}

function Block({ id, title, intro, aside, children }: { id: string; title: string; intro?: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className={styles.block} aria-labelledby={`${id}-heading`}>
      <div className={styles.blockHead}><h2 id={`${id}-heading`}>{title}</h2>{aside}</div>
      {intro && <p className={styles.intro}>{intro}</p>}
      {children}
    </section>
  )
}

function AtlasChips({ links }: { links: Parameters<typeof atlasRefs>[0] }) {
  const refs = atlasRefs(links)
  return refs.length ? <span className={styles.atlasChips}>{refs.map((ref) => <Link key={ref.id} to={ref.href} className={styles.atlasChip}>Atlas: {ref.label}</Link>)}</span> : null
}

function PromptKit({ practice }: { practice: Practice }) {
  const workspace = useWorkspace()
  const [type, setType] = useState<PromptType>('draft')
  const [copied, setCopied] = useState(false)
  const id = useId()
  const hasProfile = !!(workspace.profile.sector || workspace.profile.orgName || workspace.profile.systemTypes.length)
  const prompt = assemblePrompt(practice, type, hasProfile ? workspace.profile : undefined)
  const copy = async () => {
    try { await navigator.clipboard.writeText(prompt.text); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { setCopied(false) }
  }
  return (
    <div className={styles.promptKit}>
      <div className={styles.tabs} role="tablist" aria-label="Prompt type">
        {promptTypes.map((key) => <button key={key} type="button" role="tab" id={`${id}-${key}`} aria-selected={type === key} aria-controls={`${id}-panel`} className={styles.tab} onClick={() => { setType(key); setCopied(false) }}>{promptTypeNames[key]}<span className={styles.tabNote}>{practice.prompts[key].title}</span></button>)}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${type}`}>
        {!hasProfile && <p className={styles.muted}>No organisation profile yet, so the prompt asks the AI tool to confirm your context. A profile screen is coming to AI Trust Practice.</p>}
        <div className={styles.promptBox}>
          <button type="button" className={styles.copy} onClick={copy} aria-live="polite">{copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy prompt</>}</button>
          <pre tabIndex={0} aria-label={`${prompt.title} prompt text`}>{prompt.text}</pre>
        </div>
        <div className={styles.promptMeta}>
          <section><h3 className={styles.minor}>Check the output</h3><ul className={styles.checklist}>{prompt.checklist.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h3 className={styles.minor}>What is safe to paste</h3><p>{prompt.sensitivity}</p>
            <p className={styles.muted}>Prompt version {prompt.version}{practice.prompts[type].lastTested ? `, last tested ${practice.prompts[type].lastTested}` : ', not yet tested across AI tools'}.</p></section>
        </div>
      </div>
    </div>
  )
}

const formatDate = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
