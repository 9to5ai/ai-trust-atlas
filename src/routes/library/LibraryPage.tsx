import { ArrowRight, CheckSquare, MagnifyingGlass, Square, X } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, navigate } from '../../app/router'
import { instruments } from '../../data/instruments'
import { authorityLabels, authorityOrder, regionOrder } from '../../lib/labels'
import type { AuthorityClass, Instrument } from '../../types'
import { Badge, Chip, ChipGroup, DraftBadge, EmptyState } from '../../ui/Kit'
import { Page, PageHero } from '../../ui/Page'
import { authorityIcons } from './authorityIcons'
import styles from './Library.module.css'

type Sort = 'recent' | 'title' | 'authority'
const readParams = () => new URLSearchParams(window.location.search)
const yearOf = (instrument: Instrument) => instrument.published.slice(0, 4)

export const statusLabels: Record<Instrument['status'], string> = {
  'in-force': 'In force', active: 'Active', phased: 'Phased in', voluntary: 'Voluntary', consultation: 'Consultation', 'closed-consultation': 'Consultation closed', 'future-effective': 'Not yet effective', 'not-in-force': 'Not in force', superseded: 'Superseded', living: 'Living resource',
}

export function LibraryPage() {
  const [query, setQuery] = useState(() => readParams().get('q') ?? '')
  const [types, setTypes] = useState<Set<AuthorityClass>>(() => new Set(readParams().getAll('type').filter((value): value is AuthorityClass => authorityOrder.includes(value as AuthorityClass))))
  const [regions, setRegions] = useState<Set<string>>(() => new Set(readParams().getAll('region')))
  const [sort, setSort] = useState<Sort>(() => (readParams().get('sort') as Sort) || 'recent')
  const [compare, setCompare] = useState<string[]>([])

  const sync = (next: { q?: string; types?: Set<string>; regions?: Set<string>; sort?: Sort }) => {
    const params = new URLSearchParams()
    const q = next.q ?? query
    if (q) params.set('q', q)
    ;[...(next.types ?? types)].forEach((type) => params.append('type', type))
    ;[...(next.regions ?? regions)].forEach((region) => params.append('region', region))
    const s = next.sort ?? sort
    if (s !== 'recent') params.set('sort', s)
    navigate(`/library${params.size ? `?${params}` : ''}`, { replace: true })
  }
  const toggle = <T,>(set: Set<T>, value: T) => { const next = new Set(set); if (next.has(value)) next.delete(value); else next.add(value); return next }

  const results = useMemo(() => {
    const normalized = query.toLowerCase().trim()
    const filtered = instruments.filter((instrument) =>
      (!types.size || types.has(instrument.authorityClass)) &&
      (!regions.size || regions.has(instrument.region)) &&
      (!normalized || [instrument.title, instrument.shortTitle, instrument.issuer, instrument.summary, instrument.jurisdiction, ...instrument.sectors].join(' ').toLowerCase().includes(normalized)))
    return filtered.sort((a, b) => sort === 'title' ? a.shortTitle.localeCompare(b.shortTitle) : sort === 'authority' ? authorityOrder.indexOf(a.authorityClass) - authorityOrder.indexOf(b.authorityClass) || a.shortTitle.localeCompare(b.shortTitle) : b.published.localeCompare(a.published))
  }, [query, types, regions, sort])

  const countBy = (predicate: (instrument: Instrument) => boolean) => instruments.filter(predicate).length
  const drafts = instruments.filter((instrument) => instrument.editorialStatus === 'draft').length

  return (
    <Page labelledBy="library-title" wide>
      <PageHero id="library-title" eyebrow="Library" title="Every source, one shelf" lede={`${instruments.length} laws, standards, assurance standards, guidance and research sources — each with its authority, status and the sections the Atlas maps.`} />

      <section className={styles.toolbar} aria-label="Filter the library">
        <label className={styles.search}>
          <MagnifyingGlass size={18} />
          <input type="search" placeholder="Search titles, issuers, sectors…" aria-label="Search the library" value={query} onChange={(event) => { setQuery(event.target.value); sync({ q: event.target.value }) }} />
        </label>
        <ChipGroup label="Type">
          {authorityOrder.map((authority) => {
            const Icon = authorityIcons[authority]
            return <Chip key={authority} pressed={types.has(authority)} count={countBy((instrument) => instrument.authorityClass === authority)} onClick={() => { const next = toggle(types, authority); setTypes(next); sync({ types: next }) }}><Icon size={15} /> {authorityLabels[authority]}</Chip>
          })}
        </ChipGroup>
        <ChipGroup label="Jurisdiction">
          {regionOrder.map((region) => <Chip key={region} pressed={regions.has(region)} count={countBy((instrument) => instrument.region === region)} onClick={() => { const next = toggle(regions, region); setRegions(next); sync({ regions: next }) }}>{region}</Chip>)}
        </ChipGroup>
        <div className={styles.meta}>
          <span role="status" className="tabular">{results.length} of {instruments.length} sources{drafts ? ` · ${drafts} drafts awaiting review` : ''}</span>
          <label className={styles.sort}>Sort <select value={sort} onChange={(event) => { const value = event.target.value as Sort; setSort(value); sync({ sort: value }) }}><option value="recent">Most recent</option><option value="title">A–Z</option><option value="authority">By authority</option></select></label>
        </div>
      </section>

      {results.length === 0 ? <EmptyState title="No sources match these filters"><p>Clear a filter or search for a different term.</p></EmptyState> : (
        <ul className={styles.grid}>
          {results.map((instrument) => {
            const Icon = authorityIcons[instrument.authorityClass]
            const selected = compare.includes(instrument.id)
            return (
              <li key={instrument.id} className={`${styles.card}${selected ? ` ${styles.selected}` : ''}`}>
                <div className={styles.cardTop}>
                  <span className={styles.kind}><Icon size={16} weight="duotone" /> {authorityLabels[instrument.authorityClass]}</span>
                  <button type="button" className={styles.compareToggle} aria-pressed={selected} disabled={!selected && compare.length >= 3} onClick={() => setCompare((current) => selected ? current.filter((id) => id !== instrument.id) : [...current, instrument.id])} aria-label={`${selected ? 'Remove' : 'Add'} ${instrument.shortTitle} ${selected ? 'from' : 'to'} comparison`}>{selected ? <CheckSquare size={16} weight="fill" /> : <Square size={16} />} Compare</button>
                </div>
                <Link to={`/library/${instrument.id}`} className={styles.cardLink}>
                  <h2>{instrument.shortTitle}</h2>
                  <p className={styles.fullTitle}>{instrument.title}</p>
                  <p className={styles.summary}>{instrument.summary}</p>
                </Link>
                <div className={styles.cardFoot}>
                  <Badge>{instrument.region}</Badge>
                  <Badge tone={instrument.status === 'in-force' ? 'signal' : instrument.status === 'future-effective' || instrument.status === 'phased' ? 'aurora' : 'neutral'}>{statusLabels[instrument.status]}</Badge>
                  <span className={`${styles.year} tabular`}>{yearOf(instrument)} · {instrument.provisions.length} sections</span>
                  {instrument.editorialStatus === 'draft' && <DraftBadge />}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {compare.length > 0 && (
        <div className={styles.tray} role="region" aria-label="Comparison tray">
          <span className="tabular">{compare.length} of 3 selected</span>
          <div className={styles.trayItems}>{compare.map((id) => <button key={id} type="button" onClick={() => setCompare((current) => current.filter((item) => item !== id))} aria-label={`Remove ${instruments.find((item) => item.id === id)?.shortTitle}`}>{instruments.find((item) => item.id === id)?.shortTitle} <X size={12} /></button>)}</div>
          <Link to={`/library/compare?ids=${compare.join(',')}`} className={styles.trayGo} aria-disabled={compare.length < 2} onClick={(event) => { if (compare.length < 2) event.preventDefault() }}>Compare <ArrowRight size={16} /></Link>
        </div>
      )}
    </Page>
  )
}
