import { ArrowRight } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, navigate } from '../../app/router'
import { timelineEvents, timelineKindLabels, type TimelineEvent, type TimelineKind } from '../../data/timeline'
import { eventTime, formatEventDate, horizonRing, horizonRingLabels, recentEvents, upcomingEvents } from '../../lib/horizon'
import { Badge, Chip, ChipGroup, DraftBadge } from '../../ui/Kit'
import { Page, PageHero } from '../../ui/Page'
import styles from './Horizon.module.css'

const obligationKinds: TimelineKind[] = ['applies', 'in-force', 'transition-ends', 'expected']
const kindClass: Record<TimelineKind, string> = { applies: styles.kApplies, 'in-force': styles.kInForce, 'transition-ends': styles.kTransition, expected: styles.kExpected, published: styles.kPublished, development: styles.kDevelopment }
const lanes = ['Australia', 'Europe', 'Global', 'United States', 'United Kingdom', 'Singapore', 'Canada'] as const
const sectors = [
  { label: 'Australia', regions: ['Australia'] },
  { label: 'Europe', regions: ['Europe'] },
  { label: 'International', regions: ['Global'] },
  { label: 'Americas', regions: ['United States', 'Canada'] },
  { label: 'UK & Asia', regions: ['United Kingdom', 'Singapore'] },
] as const
const todayIso = () => new Date().toISOString().slice(0, 10)
const eventLink = (event: TimelineEvent) => event.instrumentId ? `/library/${event.instrumentId}` : undefined

type Hover = { event: TimelineEvent; x: number; y: number }

function Tooltip({ hover }: { hover?: Hover }) {
  if (!hover) return null
  return (
    <div className={styles.tooltip} style={{ transform: `translate(${Math.round(hover.x)}px, ${Math.round(hover.y)}px)` }} role="status">
      <span>{formatEventDate(hover.event)} · {timelineKindLabels[hover.event.kind]}</span>
      <strong>{hover.event.title}</strong>
      <small>{hover.event.region}{hover.event.editorialStatus === 'draft' ? ' · draft for review' : ''}</small>
    </div>
  )
}

function Radar({ events, today, onHover }: { events: TimelineEvent[]; today: string; onHover: (hover?: Hover) => void }) {
  const size = 440, center = size / 2
  const radii = { now: 70, near: 130, far: 190 }
  const inner = { now: 18, near: 70, far: 130 }
  const placed = events.map((event, index) => {
    const ring = horizonRing(event, today) as 'now' | 'near' | 'far'
    const sectorIndex = Math.max(0, sectors.findIndex((sector) => (sector.regions as readonly string[]).includes(event.region)))
    const sameCell = events.filter((other, otherIndex) => otherIndex < index && horizonRing(other, today) === ring && sectors.findIndex((sector) => (sector.regions as readonly string[]).includes(other.region)) === sectorIndex).length
    const start = (sectorIndex / sectors.length) * Math.PI * 2 - Math.PI / 2
    const span = (Math.PI * 2) / sectors.length
    const angle = start + span * (0.2 + ((sameCell * 0.23) % 0.6))
    const radius = inner[ring] + (radii[ring] - inner[ring]) * (0.35 + ((sameCell * 0.37) % 0.5))
    return { event, x: center + Math.cos(angle) * radius, y: center + Math.sin(angle) * radius }
  })
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={styles.radar} role="group" aria-label={`Radar of ${events.length} upcoming dated events by region and time`}>
      {(['far', 'near', 'now'] as const).map((ring) => <circle key={ring} cx={center} cy={center} r={radii[ring]} className={styles.ring} data-ring={ring} />)}
      {sectors.map((sector, index) => {
        const angle = (index / sectors.length) * Math.PI * 2 - Math.PI / 2
        const labelAngle = angle + Math.PI / sectors.length
        return (
          <g key={sector.label}>
            <line x1={center} y1={center} x2={center + Math.cos(angle) * radii.far} y2={center + Math.sin(angle) * radii.far} className={styles.spoke} />
            <text x={center + Math.cos(labelAngle) * (radii.far + 20)} y={center + Math.sin(labelAngle) * (radii.far + 20)} className={styles.sectorLabel} textAnchor="middle" dominantBaseline="middle">{sector.label}</text>
          </g>
        )
      })}
      {(['now', 'near', 'far'] as const).map((ring) => <text key={ring} x={center + 4} y={center - radii[ring] + 12} className={styles.ringLabel}>{horizonRingLabels[ring]}</text>)}
      <circle cx={center} cy={center} r={6} className={styles.today} />
      {placed.map(({ event, x, y }) => (
        <circle key={event.id} cx={x} cy={y} r={7} className={`${styles.dot} ${kindClass[event.kind]}`} tabIndex={0} role="link" aria-label={`${formatEventDate(event)}: ${event.title}`}
          onMouseEnter={(mouse) => { const box = (mouse.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect(); onHover({ event, x: (x / size) * box.width + 12, y: (y / size) * box.height + 12 }) }}
          onMouseLeave={() => onHover(undefined)}
          onFocus={(focus) => { const box = (focus.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect(); onHover({ event, x: (x / size) * box.width + 12, y: (y / size) * box.height + 12 }) }}
          onBlur={() => onHover(undefined)}
          onClick={() => { const to = eventLink(event); if (to) navigate(to) }}
          onKeyDown={(key) => { if (key.key === 'Enter') { const to = eventLink(event); if (to) navigate(to) } }}
        />
      ))}
    </svg>
  )
}

function Swimlanes({ events, today, onHover }: { events: TimelineEvent[]; today: string; onHover: (hover?: Hover) => void }) {
  const start = Date.parse('2023-07-01T00:00:00Z'), end = Date.parse('2028-12-31T00:00:00Z')
  const width = 1100, laneHeight = 38, top = 28, left = 132
  const x = (time: number) => left + ((time - start) / (end - start)) * (width - left - 16)
  const years = [2024, 2025, 2026, 2027, 2028]
  const visible = events.filter((event) => eventTime(event) >= start && eventTime(event) <= end)
  const height = top + lanes.length * laneHeight + 10
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={styles.lanes} role="group" aria-label={`Timeline of ${visible.length} events by region from 2023 to 2028`}>
      {years.map((year) => { const position = x(Date.parse(`${year}-01-01T00:00:00Z`)); return <g key={year}><line x1={position} x2={position} y1={top - 6} y2={height - 6} className={styles.gridline} /><text x={position + 4} y={16} className={styles.axis}>{year}</text></g> })}
      {lanes.map((lane, index) => (
        <g key={lane}>
          <text x={0} y={top + index * laneHeight + laneHeight / 2} className={styles.laneLabel} dominantBaseline="middle">{lane}</text>
          <line x1={left} x2={width - 16} y1={top + index * laneHeight + laneHeight / 2} y2={top + index * laneHeight + laneHeight / 2} className={styles.laneLine} />
        </g>
      ))}
      <g>
        <line x1={x(Date.parse(`${today}T00:00:00Z`))} x2={x(Date.parse(`${today}T00:00:00Z`))} y1={top - 10} y2={height - 6} className={styles.todayLine} />
        <text x={x(Date.parse(`${today}T00:00:00Z`)) + 5} y={top - 12} className={styles.todayLabel}>Today</text>
      </g>
      {visible.map((event) => {
        const lane = Math.max(0, lanes.indexOf(event.region as typeof lanes[number]))
        const cx = x(eventTime(event)), cy = top + lane * laneHeight + laneHeight / 2
        const major = obligationKinds.includes(event.kind)
        return (
          <circle key={event.id} cx={cx} cy={cy} r={major ? 6.5 : 3.5} className={`${styles.mark} ${kindClass[event.kind]}`} tabIndex={major ? 0 : -1} role={major ? 'link' : undefined} aria-label={major ? `${formatEventDate(event)}: ${event.title}` : undefined}
            onMouseEnter={(mouse) => { const box = (mouse.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect(); onHover({ event, x: (cx / width) * box.width + 12, y: (cy / height) * box.height + 12 }) }}
            onMouseLeave={() => onHover(undefined)}
            onClick={() => { const to = eventLink(event); if (to) navigate(to) }}
          />
        )
      })}
    </svg>
  )
}

export function HorizonPage() {
  const today = todayIso()
  const [radarHover, setRadarHover] = useState<Hover>()
  const [laneHover, setLaneHover] = useState<Hover>()
  const [show, setShow] = useState<Set<string>>(new Set(['obligations', 'published']))
  const upcoming = useMemo(() => upcomingEvents(today), [today])
  const recent = useMemo(() => recentEvents(today, 12).filter((event) => event.kind !== 'published' || event.editorialStatus !== 'draft').slice(0, 12), [today])
  const laneEvents = timelineEvents.filter((event) => (show.has('obligations') && obligationKinds.includes(event.kind)) || (show.has('published') && event.kind === 'published') || (show.has('developments') && event.kind === 'development'))
  const toggle = (value: string) => setShow((current) => { const next = new Set(current); if (next.has(value)) next.delete(value); else next.add(value); return next })

  return (
    <Page labelledBy="horizon-title" wide>
      <PageHero id="horizon-title" eyebrow="Horizon" title="What’s coming, and when" lede="Dated obligations, commencements and transitions across the jurisdictions in the Atlas — Australia first, with the global rules your clients will meet." />

      <section className={styles.top}>
        <div className={styles.radarWrap}>
          <Radar events={upcoming} today={today} onHover={setRadarHover} />
          <Tooltip hover={radarHover} />
          <ul className={styles.legend} aria-label="Event types">
            {obligationKinds.map((kind) => <li key={kind}><i className={kindClass[kind]} />{timelineKindLabels[kind]}</li>)}
          </ul>
        </div>
        <div className={styles.upcoming}>
          <h2>Next on the horizon</h2>
          <ol>
            {upcoming.map((event) => {
              const to = eventLink(event)
              const body = <>
                <span className={styles.date}><i className={kindClass[event.kind]} />{formatEventDate(event)}</span>
                <strong>{event.title}</strong>
                <span className={styles.summary}>{event.summary}</span>
                <span className={styles.meta}><Badge>{event.region}</Badge><Badge tone={event.certainty === 'expected' ? 'caution' : 'neutral'}>{event.certainty === 'enacted' ? 'Enacted' : event.certainty === 'scheduled' ? 'Scheduled' : 'Expected'}</Badge>{horizonRing(event, today) !== 'past' && <Badge tone="signal">{horizonRingLabels[horizonRing(event, today) as 'now']}</Badge>}{event.editorialStatus === 'draft' && <DraftBadge />}</span>
              </>
              return <li key={event.id}>{to ? <Link to={to} className={styles.item}>{body}<ArrowRight size={16} className={styles.arrow} /></Link> : <div className={styles.item}>{body}</div>}</li>
            })}
          </ol>
        </div>
      </section>

      <section className={styles.laneSection} aria-labelledby="timeline-title">
        <div className={styles.laneHead}>
          <h2 id="timeline-title">The long view</h2>
          <ChipGroup label="Show">
            <Chip pressed={show.has('obligations')} onClick={() => toggle('obligations')}>Obligations and milestones</Chip>
            <Chip pressed={show.has('published')} onClick={() => toggle('published')}>Publications</Chip>
            <Chip pressed={show.has('developments')} onClick={() => toggle('developments')}>Developments</Chip>
          </ChipGroup>
        </div>
        <div className={styles.laneWrap}>
          <Swimlanes events={laneEvents} today={today} onHover={setLaneHover} />
          <Tooltip hover={laneHover} />
        </div>
      </section>

      <section className={styles.recent} aria-labelledby="recent-title">
        <h2 id="recent-title">The last twelve months</h2>
        <ul>
          {recent.map((event) => <li key={event.id}><span className={styles.date}><i className={kindClass[event.kind]} />{formatEventDate(event)}</span>{eventLink(event) ? <Link to={eventLink(event)!}>{event.title}</Link> : <span>{event.title}</span>}<small>{timelineKindLabels[event.kind]} · {event.region}</small></li>)}
        </ul>
      </section>
    </Page>
  )
}
