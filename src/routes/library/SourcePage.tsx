import { ArrowSquareOut, Planet, Scales } from '@phosphor-icons/react'
import { useMemo } from 'react'
import { Link } from '../../app/router'
import { QuestionsPanel } from '../../components/LeadershipQuestions'
import { conceptById } from '../../data/concepts'
import { controlObjectives } from '../../data/controls'
import { instrumentById } from '../../data/instruments'
import { relations } from '../../data/relations'
import { timelineEvents, timelineKindLabels } from '../../data/timeline'
import { crosswalkForInstrument } from '../../lib/crosswalk'
import { formatEventDate } from '../../lib/horizon'
import { authorityLabels, relationLabels } from '../../lib/labels'
import { Badge, Button, Callout, DraftBadge } from '../../ui/Kit'
import { Page } from '../../ui/Page'
import { NotFound } from '../NotFound'
import { authorityIcons } from './authorityIcons'
import { statusLabels } from './LibraryPage'
import styles from './Library.module.css'

const controlById = new Map(controlObjectives.map((control) => [control.id, control]))
const detailLabels = { 'full-public-text': 'Full public text reviewed', 'public-summary': 'Public summary reviewed', 'licensed-standard': 'Licensed standard — metadata and original synopses only' }

/* Natural order for references such as "Article 9" before "Article 14". */
const refKey = (ref: string) => ref.replace(/\d+/g, (digits) => digits.padStart(4, '0'))

export function SourcePage({ id }: { id: string }) {
  const instrument = instrumentById.get(id)
  const links = useMemo(() => (instrument ? crosswalkForInstrument(instrument.id) : []), [instrument])
  if (!instrument) return <NotFound />
  const Icon = authorityIcons[instrument.authorityClass]
  const provisions = [...instrument.provisions].sort((a, b) => refKey(a.ref).localeCompare(refKey(b.ref)))
  const related = relations.filter((relation) => relation.sourceId === instrument.id || relation.targetId === instrument.id)
  const events = timelineEvents.filter((event) => event.instrumentId === instrument.id && event.kind !== 'development')
  const controlsFor = (provisionId: string) => links.filter((link) => link.provision.id === provisionId)

  return (
    <Page labelledBy="source-title" wide>
      <nav className={styles.crumbs} aria-label="Breadcrumb"><Link to="/library">Library</Link><span>/</span><Link to={`/library?region=${encodeURIComponent(instrument.region)}`}>{instrument.region}</Link></nav>
      <header className={styles.sourceHero}>
        <div className={styles.badges}>
          <Badge tone="signal"><Icon size={13} /> {authorityLabels[instrument.authorityClass]}</Badge>
          <Badge tone={instrument.status === 'in-force' ? 'positive' : instrument.status === 'future-effective' || instrument.status === 'phased' ? 'aurora' : 'neutral'}>{statusLabels[instrument.status]}</Badge>
          <Badge>{instrument.jurisdiction}</Badge>
          {instrument.editorialStatus === 'draft' && <DraftBadge />}
        </div>
        <h1 id="source-title" className={styles.sourceTitle}>{instrument.shortTitle}</h1>
        <p className={styles.sourceSubtitle}>{instrument.title} · {instrument.issuer}</p>
        <div className={styles.actions}>
          <Button to={`/universe#/instrument/${instrument.id}`} variant="primary"><Planet size={18} /> Open in the Universe</Button>
          <Button href={instrument.officialUrl} variant="secondary"><ArrowSquareOut size={18} /> Official source</Button>
          <Button to={`/library/compare?ids=${instrument.id}`} variant="ghost"><Scales size={18} /> Compare with…</Button>
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.main}>
          <section className={styles.block} aria-labelledby="about-title">
            <h2 id="about-title">What it is</h2>
            <p className={styles.lead}>{instrument.summary}</p>
            <Callout title="Who it concerns">{instrument.applicability}</Callout>
          </section>

          <section className={styles.block} aria-labelledby="sections-title">
            <h2 id="sections-title">Sections the Atlas maps <span className="tabular" style={{ color: 'var(--text-tertiary)', fontSize: '0.6em' }}>{provisions.length}</span></h2>
            <ol className={styles.provisions}>
              {provisions.map((provision) => (
                <li key={provision.id} className={styles.provision} id={`section-${provision.id}`}>
                  <span className={styles.provisionRef}>{provision.ref}</span>
                  <div>
                    <h3>{provision.title}{provision.editorialStatus === 'draft' && <DraftBadge />}</h3>
                    <p>{provision.summary}</p>
                    <div className={styles.tags}>
                      {provision.conceptIds.map((conceptId) => <Link key={conceptId} to={`/universe#/concept/${conceptId}`}>{conceptById.get(conceptId)?.name ?? conceptId}</Link>)}
                      {controlsFor(provision.id).map((link) => { const control = controlById.get(link.assertion.sourceNodeId.replace('control-objective:', '')); return control ? <Link key={link.assertion.id} className={styles.control} to={`/crosswalk/${control.id}`} title={link.assertion.rationale}>{control.code} · {control.shortName}</Link> : null })}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className={`${styles.block} ${styles.questions}`} aria-labelledby="questions-title">
            <h2 id="questions-title">Questions to ask</h2>
            <QuestionsPanel kind="instrument" id={instrument.id} />
          </section>
        </div>

        <aside className={styles.side} aria-label="Source facts">
          <div className={styles.panel}>
            <h2>At a glance</h2>
            <dl className={styles.facts}>
              <div><dt>Issuer</dt><dd>{instrument.issuer}</dd></div>
              <div><dt>Authority</dt><dd>{instrument.authorityNote}</dd></div>
              <div><dt>Published</dt><dd className="tabular">{instrument.published}</dd></div>
              {instrument.effective && <div><dt>Effective</dt><dd>{instrument.effective}</dd></div>}
              <div><dt>Sectors</dt><dd>{instrument.sectors.join(' · ')}</dd></div>
              <div><dt>Evidence depth</dt><dd>{detailLabels[instrument.detailAvailability]}</dd></div>
              <div><dt>Last verified</dt><dd className="tabular">{instrument.lastVerified}</dd></div>
            </dl>
          </div>
          {events.length > 0 && (
            <div className={styles.panel}>
              <h2>Key dates</h2>
              <ul className={styles.miniList}>
                {events.map((event) => <li key={event.id}><small>{formatEventDate(event)} · {timelineKindLabels[event.kind]}</small><span>{event.title}</span></li>)}
              </ul>
              <p style={{ margin: 'var(--space-3) 0 0' }}><Link to="/horizon">See the full horizon →</Link></p>
            </div>
          )}
          {related.length > 0 && (
            <div className={styles.panel}>
              <h2>Related sources</h2>
              <ul className={styles.miniList}>
                {related.map((relation) => {
                  const otherId = relation.sourceId === instrument.id ? relation.targetId : relation.sourceId
                  const other = instrumentById.get(otherId)
                  const label = relation.sourceId === instrument.id ? `This source · ${relationLabels[relation.type].toLowerCase()}` : `${relationLabels[relation.type]} this source`
                  return <li key={relation.id}><small>{label} · {relation.basis === 'explicit' ? 'source-stated' : 'Atlas interpretation'}</small><Link to={`/library/${otherId}`}>{other?.shortTitle ?? otherId}</Link></li>
                })}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </Page>
  )
}
