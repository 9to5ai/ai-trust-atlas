import { ArrowRight, ArrowUpRight, Bank, CalendarDots, GridFour, PlayCircle, SealCheck, ChatsCircle, Fingerprint, GlobeHemisphereWest, MagnifyingGlass, Scales, TreeStructure, UserFocus } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { openSearch } from '../../app/AppShell'
import { Link } from '../../app/router'
import { mappingAssertions } from '../../data/assertions'
import { concepts } from '../../data/concepts'
import { controlObjectives } from '../../data/controls'
import { developments } from '../../data/developments'
import { instruments } from '../../data/instruments'
import { riskSubdomains } from '../../data/mitRiskTaxonomy'
import { authorityLabels, authorityOrder, regionOrder } from '../../lib/labels'
import { HeroConstellation } from './HeroConstellation'
import styles from './Home.module.css'

const instrumentIds = new Set(instruments.map((instrument) => instrument.id))
const regionCounts = regionOrder.map((region) => ({ key: region, label: region, count: instruments.filter((item) => item.region === region).length, to: `/universe?region=${encodeURIComponent(region)}` })).filter((row) => row.count > 0).sort((a, b) => b.count - a.count)
const authorityCounts = authorityOrder.map((authority) => ({ key: authority, label: authorityLabels[authority], count: instruments.filter((item) => item.authorityClass === authority).length, to: `/universe?type=${authority}` })).filter((row) => row.count > 0).sort((a, b) => b.count - a.count)
const latest = [...developments].sort((a, b) => b.published.localeCompare(a.published)).slice(0, 4)

const stats = [
  { value: instruments.length, label: 'Sources' },
  { value: regionCounts.length, label: 'Jurisdictions' },
  { value: concepts.length, label: 'Trust concepts' },
  { value: riskSubdomains.length, label: 'Risk types' },
  { value: controlObjectives.length, label: 'Control objectives' },
  { value: mappingAssertions.length, label: 'Traceable links' },
]

const journeys: { icon: Icon; question: string; detail: string; to: string; cta: string }[] = [
  { icon: Bank, question: 'What does APRA expect when we use AI?', detail: 'Follow the 2026 AI letter into CPS 230, CPS 234 and the Acts they are made under.', to: '/universe#/instrument/apra-ai-letter-2026', cta: 'Trace APRA’s expectations' },
  { icon: GlobeHemisphereWest, question: 'How far does the EU AI Act reach?', detail: 'Sixteen articles mapped, with application dates as amended in 2026.', to: '/library/eu-ai-act', cta: 'Open the EU AI Act' },
  { icon: GridFour, question: 'Which controls answer which obligations?', detail: 'Twenty-four control objectives crosswalked to the EU AI Act, ISO/IEC 42001, NIST, APRA and Australia’s six practices.', to: '/crosswalk', cta: 'Open the crosswalk' },
  { icon: CalendarDots, question: 'What’s coming in the next 18 months?', detail: 'A radar and timeline of dated obligations, commencements and transitions.', to: '/horizon', cta: 'See the horizon' },
  { icon: SealCheck, question: 'How would AI governance be assured?', detail: 'ISAE and ASAE 3000, ASAE 3150, SOC 2, ISO/IEC 42006 and the IIA Standards — and how they differ.', to: '/library?type=assurance-standard', cta: 'Explore assurance standards' },
  { icon: ChatsCircle, question: 'What should the board be asking?', detail: 'Build a meeting brief from role-specific questions for boards, executives and regulators.', to: '/questions', cta: 'Prepare a conversation' },
]

const principles: { icon: Icon; title: string; body: string }[] = [
  { icon: Fingerprint, title: 'Every link is traceable', body: 'Connections carry their basis — source-authored, published crosswalk or Atlas interpretation — with citations.' },
  { icon: TreeStructure, title: 'Interpretation is labelled', body: 'Atlas syntheses are marked as such and never presented as the words of a regulator or standard.' },
  { icon: UserFocus, title: 'Judgement stays human', body: 'The Atlas informs conversations. Applicability, compliance and assurance conclusions belong to accountable people.' },
]

const dateLabel = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

function CoverageChart({ id, title, rows, total }: { id: string; title: string; rows: { key: string; label: string; count: number; to: string }[]; total: number }) {
  const max = Math.max(...rows.map((row) => row.count))
  return (
    <figure className={styles.chart} aria-labelledby={id}>
      <figcaption id={id} className={styles.chartTitle}>{title}</figcaption>
      <ul className={styles.bars}>
        {rows.map((row) => (
          <li key={row.key}>
            <Link to={row.to} className={styles.barRow} aria-label={`${row.label}: ${row.count} sources. Open in the Universe`}>
              <span className={styles.barLabel}>{row.label}</span>
              <span className={styles.barTrack}><i style={{ width: `${(row.count / max) * 100}%` }} /></span>
              <span className={`${styles.barValue} tabular`}>{row.count}</span>
              <span className={styles.barTip} role="presentation">{row.count} of {total} sources · {Math.round((row.count / total) * 100)}%<br />Open filtered Universe →</span>
            </Link>
          </li>
        ))}
      </ul>
    </figure>
  )
}

export function Home() {
  return (
    <main id="main-content" className={styles.home} aria-labelledby="home-title">
      <section className={styles.hero}>
        <HeroConstellation />
        <div className={styles.heroCopy}>
          <span className={styles.kicker}><i />Australia-first · globally connected · edition 2026.09</span>
          <h1 id="home-title" className={styles.title}>The map of <em>trustworthy AI</em>.</h1>
          <p className={styles.lede}>Laws, standards, guidance, risks and controls in one navigable universe — so you can trace what applies, what could go wrong and what good looks like, with every connection linked to its source.</p>
          <div className={styles.ctas}>
            <Link to="/universe" className={styles.primary}>Enter the Universe <ArrowRight size={18} weight="bold" /></Link>
            <Link to="/questions" className={styles.secondary}>Prepare a board conversation</Link>
          </div>
          <Link to="/universe?tour=apra-to-controls&step=0" className={styles.tourLink}><PlayCircle size={22} weight="duotone" /> <span><strong>Take the three-minute guided tour</strong> From APRA’s expectations to candidate controls</span></Link>
          <button type="button" className={styles.searchTrigger} onClick={openSearch}>
            <MagnifyingGlass size={18} />
            <span>Search sources, risks and controls — try “CPS 230” or “Who is accountable?”</span>
            <kbd>⌘K</kbd>
          </button>
        </div>
        <dl className={styles.stats}>
          {stats.map((stat) => <div key={stat.label}><dt>{stat.label}</dt><dd className="tabular">{stat.value.toLocaleString('en-AU')}</dd></div>)}
        </dl>
      </section>

      <section className={styles.band} aria-labelledby="journeys-title">
        <header className={styles.bandHead}>
          <span className={styles.eyebrow}>Start with a question</span>
          <h2 id="journeys-title">Six ways into the Atlas</h2>
        </header>
        <div className={styles.journeys}>
          {journeys.map(({ icon: JourneyIcon, question, detail, to, cta }) => (
            <Link key={to} to={to} className={styles.journey}>
              <span className={styles.journeyIcon}><JourneyIcon size={22} weight="duotone" /></span>
              <h3>{question}</h3>
              <p>{detail}</p>
              <span className={styles.journeyCta}>{cta} <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className={`${styles.band} ${styles.split}`} aria-labelledby="changing-title">
        <header className={styles.bandHead}>
          <span className={styles.eyebrow}>What’s changing</span>
          <h2 id="changing-title">The latest reviewed developments</h2>
          <p>Publications, findings and supervisory signals — each with what it means and a question to ask.</p>
          <Link to="/universe?panel=news" className={styles.textLink}>Open the full briefing <ArrowRight size={14} /></Link>
        </header>
        <ol className={styles.feed}>
          {latest.map((item) => {
            const target = item.sourceId && instrumentIds.has(item.sourceId) ? `/universe#/instrument/${item.sourceId}` : undefined
            const body = <>
              <div className={styles.feedMeta}><time dateTime={item.published} className="tabular">{dateLabel(item.published)}</time><span>{item.issuer}</span></div>
              <h3>{item.title}</h3>
              <p>{item.implication}</p>
            </>
            return <li key={item.id}>{target ? <Link to={target} className={styles.feedItem}>{body}<ArrowRight size={16} className={styles.feedArrow} /></Link> : <a href={item.url} target="_blank" rel="noreferrer" className={styles.feedItem}>{body}<ArrowUpRight size={16} className={styles.feedArrow} /></a>}</li>
          })}
        </ol>
      </section>

      <section className={styles.band} aria-labelledby="coverage-title">
        <header className={styles.bandHead}>
          <span className={styles.eyebrow}>Coverage</span>
          <h2 id="coverage-title">Deepest where Australian decisions are made</h2>
          <p>Counts of reviewed sources. Coverage reflects editorial priorities, not the relative importance of any jurisdiction or instrument.</p>
        </header>
        <div className={styles.charts}>
          <CoverageChart id="coverage-region" title="By jurisdiction" rows={regionCounts} total={instruments.length} />
          <CoverageChart id="coverage-type" title="By type of source" rows={authorityCounts} total={instruments.length} />
        </div>
      </section>

      <section className={styles.band} aria-labelledby="principles-title">
        <header className={styles.bandHead}>
          <span className={styles.eyebrow}>Evidence first</span>
          <h2 id="principles-title">Built to be defensible</h2>
        </header>
        <div className={styles.principles}>
          {principles.map(({ icon: PrincipleIcon, title, body }) => <article key={title}><PrincipleIcon size={24} weight="duotone" /><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <strong>AI Trust Atlas</strong>
          <p>A reference and planning tool. Connections do not establish legal applicability, compliance, implemented controls, operating effectiveness or assurance. Those judgements belong to accountable people.</p>
        </div>
        <nav aria-label="Footer">
          <Link to="/methodology"><Scales size={16} /> Methodology</Link>
          <Link to="/universe?view=list">Browse as a list</Link>
          <Link to="/cases">Production use cases</Link>
          <a href="https://github.com/9to5ai/ai-trust-atlas" target="_blank" rel="noreferrer">Source code</a>
        </nav>
      </footer>
    </main>
  )
}
