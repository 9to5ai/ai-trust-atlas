import { ArrowSquareOut, CheckCircle, GitBranch, Plus, WarningDiamond, X } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { concepts, domainById, domains } from '../data/concepts'
import { instrumentById, instruments } from '../data/instruments'
import { MIT_RISK_DATABASE_URL, MIT_RISK_LICENSE, MIT_RISK_SOURCE_URL, MIT_RISK_UPDATED, causalLensOptions, countForCausalLens, riskDomainById, riskDomains, riskSubdomainById, riskSubdomains, type CausalLens } from '../data/mitRiskTaxonomy'
import { relations } from '../data/relations'
import { authorityLabels, relationLabels } from '../lib/labels'

type Props = {
  selectedNodeId?: string
  onClose: () => void
  onSelectNode: (nodeId: string) => void
  onAddCompare: (instrumentId: string) => void
  compareIds: string[]
  causalLens: CausalLens
}

function CausalProfileBars({ values, total }: { values: Record<string, number>; total: number }) {
  return <div className="causal-profile">
    {Object.entries(values).filter(([, value]) => value > 0).sort((left, right) => right[1] - left[1]).map(([label, value]) => (
      <div className="causal-profile-row" key={label}>
        <div><span>{label}</span><strong>{value}</strong></div>
        <i><b style={{ width: `${Math.max(3, (value / total) * 100)}%` }} /></i>
      </div>
    ))}
  </div>
}

export function Inspector({ selectedNodeId, onClose, onSelectNode, onAddCompare, compareIds, causalLens }: Props) {
  const [kind, rawId] = selectedNodeId?.split(':') ?? []
  const instrument = kind === 'instrument' ? instrumentById.get(rawId) : kind === 'clause' ? instruments.find((candidate) => candidate.clauses.some((clause) => clause.id === rawId)) : undefined
  const clause = kind === 'clause' ? instrument?.clauses.find((candidate) => candidate.id === rawId) : undefined
  const concept = kind === 'concept' ? concepts.find((candidate) => candidate.id === rawId) : undefined
  const riskDomain = kind === 'risk-domain' ? riskDomainById.get(rawId) : kind === 'risk-subdomain' ? riskDomainById.get(riskSubdomainById.get(rawId)?.riskDomainId ?? '') : undefined
  const riskSubdomain = kind === 'risk-subdomain' ? riskSubdomainById.get(rawId) : undefined
  const domain = kind === 'domain' ? domains.find((candidate) => candidate.id === rawId) : concept ? domainById.get(concept.domainId) : instrument ? domainById.get(concepts.find((candidate) => instrument.conceptIds.includes(candidate.id))?.domainId ?? '') : undefined

  const instrumentRelations = instrument
    ? relations.filter((relation) => relation.sourceId === instrument.id || relation.targetId === instrument.id)
    : []
  const relatedInstruments = instrumentRelations.map((relation) => {
    const relatedId = relation.sourceId === instrument?.id ? relation.targetId : relation.sourceId
    return { relation, instrument: instrumentById.get(relatedId) }
  }).filter((entry) => entry.instrument)

  const conceptInstruments = concept ? instruments.filter((candidate) => candidate.conceptIds.includes(concept.id)) : []
  const conceptRisks = concept ? riskSubdomains.filter((risk) => risk.conceptIds.includes(concept.id)) : []
  const relevantInstrumentRisks = instrument ? riskSubdomains.filter((risk) => risk.conceptIds.some((conceptId) => instrument.conceptIds.includes(conceptId))) : []
  const relevantClauseRisks = clause ? riskSubdomains.filter((risk) => risk.conceptIds.some((conceptId) => clause.conceptIds.includes(conceptId))) : []
  const activeCausalLabel = causalLensOptions.find((option) => option.id === causalLens)?.label ?? 'All records'

  return (
    <AnimatePresence mode="wait">
      {selectedNodeId && (
        <motion.aside
          className="inspector"
          key={selectedNodeId}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 28 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Selected node details"
        >
          <button className="inspector-close" type="button" onClick={onClose} aria-label="Close details"><X /></button>

          {instrument && !clause && (
            <>
              <div className="inspector-kicker">{authorityLabels[instrument.authorityClass]}</div>
              <h2>{instrument.shortTitle}</h2>
              <p className="inspector-full-title">{instrument.title}</p>
              <div className="metadata-grid">
                <div><span>Issuer</span><strong>{instrument.issuer}</strong></div>
                <div><span>Jurisdiction</span><strong>{instrument.jurisdiction}</strong></div>
                <div><span>Status</span><strong>{instrument.status.replaceAll('-', ' ')}</strong></div>
                <div><span>Last verified</span><strong>{instrument.lastVerified}</strong></div>
              </div>
              <p className="inspector-summary">{instrument.summary}</p>
              <div className="boundary-note"><CheckCircle /> <span>{instrument.applicability}</span></div>
              <div className="inspector-actions">
                <a href={instrument.officialUrl} target="_blank" rel="noreferrer">Official source <ArrowSquareOut /></a>
                <button type="button" onClick={() => onAddCompare(instrument.id)} disabled={compareIds.includes(instrument.id)}><Plus /> {compareIds.includes(instrument.id) ? 'In comparison' : 'Compare'}</button>
              </div>

              <section className="inspector-section">
                <h3>Concept coverage</h3>
                <div className="concept-chips">
                  {instrument.conceptIds.map((conceptId) => {
                    const item = concepts.find((candidate) => candidate.id === conceptId)
                    if (!item) return null
                    return <button type="button" key={conceptId} onClick={() => onSelectNode(`concept:${conceptId}`)}>{item.name}</button>
                  })}
                </div>
              </section>

              <section className="inspector-section">
                <h3>Explained relationships <small>{relatedInstruments.length}</small></h3>
                <div className="relation-list">
                  {relatedInstruments.map(({ relation, instrument: related }) => (
                    <button type="button" key={relation.id} onClick={() => related && onSelectNode(`instrument:${related.id}`)}>
                      <span><GitBranch /> {relation.sourceId === instrument.id ? 'Outgoing' : 'Incoming'} / {relationLabels[relation.type]}</span>
                      <strong>{related?.shortTitle}</strong>
                      <p>{relation.explanation}</p>
                      <small>{relation.basis.replaceAll('-', ' ')} / {relation.confidence} confidence</small>
                      <small>Anchors: {relation.sourceAnchors.join(' / ')}</small>
                    </button>
                  ))}
                  {relatedInstruments.length === 0 && <p className="empty-copy">No curated cross-instrument relationship is recorded yet.</p>}
                </div>
              </section>

              <section className="inspector-section">
                <h3>Relevant MIT risk types <small>{relevantInstrumentRisks.length}</small></h3>
                <p className="section-boundary">Atlas synthesis based on shared trust concepts. Relevance does not mean the instrument covers or mitigates the risk.</p>
                <div className="instrument-link-list">
                  {relevantInstrumentRisks.map((risk) => <button type="button" key={risk.id} onClick={() => onSelectNode(`risk-subdomain:${risk.id}`)}><strong>{risk.ref} · {risk.name}</strong><span>{risk.recordCount} source records</span></button>)}
                </div>
              </section>

              <section className="inspector-section">
                <h3>Clause-level detail <small>{instrument.clauses.length}</small></h3>
                <div className="clause-list">
                  {instrument.clauses.map((item) => (
                    <button type="button" key={item.id} onClick={() => onSelectNode(`clause:${item.id}`)}>
                      <span>{item.ref}</span>
                      <strong>{item.title}</strong>
                      <p>{item.summary}</p>
                    </button>
                  ))}
                </div>
                {instrument.detailAvailability === 'licensed-standard' && <p className="licence-note">Clause summaries are paraphrased. The full standard is licensed by the issuing body.</p>}
              </section>
            </>
          )}

          {clause && instrument && (
            <>
              <button className="breadcrumb-button" type="button" onClick={() => onSelectNode(`instrument:${instrument.id}`)}>{instrument.shortTitle}</button>
              <div className="inspector-kicker">{clause.ref}</div>
              <h2>{clause.title}</h2>
              <p className="inspector-summary">{clause.summary}</p>
              {clause.note && <div className="boundary-note"><span>{clause.note}</span></div>}
              <section className="inspector-section">
                <h3>Concepts addressed</h3>
                <div className="concept-chips">
                  {clause.conceptIds.map((conceptId) => {
                    const item = concepts.find((candidate) => candidate.id === conceptId)
                    return item ? <button type="button" key={conceptId} onClick={() => onSelectNode(`concept:${conceptId}`)}>{item.name}</button> : null
                  })}
                </div>
              </section>
              <section className="inspector-section">
                <h3>Relevant MIT risk types <small>{relevantClauseRisks.length}</small></h3>
                <p className="section-boundary">Concept-level Atlas synthesis, not a clause-level claim of risk coverage.</p>
                <div className="instrument-link-list">
                  {relevantClauseRisks.map((risk) => <button type="button" key={risk.id} onClick={() => onSelectNode(`risk-subdomain:${risk.id}`)}><strong>{risk.ref} · {risk.name}</strong><span>{risk.recordCount} source records</span></button>)}
                </div>
              </section>
              <a className="source-button" href={clause.sourceUrl ?? instrument.officialUrl} target="_blank" rel="noreferrer">Open source text <ArrowSquareOut /></a>
            </>
          )}

          {concept && domain && (
            <>
              <button className="breadcrumb-button" type="button" onClick={() => onSelectNode(`domain:${domain.id}`)}>{domain.name}</button>
              <div className="inspector-kicker">Ontology concept</div>
              <h2>{concept.name}</h2>
              <p className="inspector-summary">{concept.definition}</p>
              <section className="inspector-section">
                <h3>Connected instruments <small>{conceptInstruments.length}</small></h3>
                <div className="instrument-link-list">
                  {conceptInstruments.map((item) => <button type="button" key={item.id} onClick={() => onSelectNode(`instrument:${item.id}`)}><strong>{item.shortTitle}</strong><span>{authorityLabels[item.authorityClass]}</span></button>)}
                </div>
              </section>
              <section className="inspector-section">
                <h3>Relevant MIT risk types <small>{conceptRisks.length}</small></h3>
                <p className="section-boundary">These links are Atlas synthesis. They express relevance, not coverage, mitigation or control effectiveness.</p>
                <div className="instrument-link-list">
                  {conceptRisks.map((risk) => <button type="button" key={risk.id} onClick={() => onSelectNode(`risk-subdomain:${risk.id}`)}><strong>{risk.ref} · {risk.name}</strong><span>{risk.mappingConfidence} confidence</span></button>)}
                </div>
              </section>
            </>
          )}

          {domain && kind === 'domain' && (
            <>
              <div className="inspector-kicker">Concept universe</div>
              <h2>{domain.name}</h2>
              <p className="domain-question">{domain.question}</p>
              <p className="inspector-summary">{domain.definition}</p>
              <section className="inspector-section">
                <h3>Constituent concepts</h3>
                <div className="instrument-link-list">
                  {concepts.filter((item) => item.domainId === domain.id).map((item) => <button type="button" key={item.id} onClick={() => onSelectNode(`concept:${item.id}`)}><strong>{item.name}</strong><span>{instruments.filter((candidate) => candidate.conceptIds.includes(item.id)).length} instruments</span></button>)}
                </div>
              </section>
            </>
          )}

          {riskDomain && kind === 'risk-domain' && (
            <>
              <div className="inspector-kicker">MIT domain taxonomy</div>
              <h2>{riskDomain.name}</h2>
              <p className="inspector-summary">{riskDomain.definition}</p>
              <div className="metadata-grid">
                <div><span>Source</span><strong>MIT AI Risk Initiative</strong></div>
                <div><span>Last updated</span><strong>{MIT_RISK_UPDATED}</strong></div>
                <div><span>Licence</span><strong>{MIT_RISK_LICENSE}</strong></div>
                <div><span>Atlas relation</span><strong>Relevance synthesis</strong></div>
              </div>
              <div className="boundary-note"><WarningDiamond /><span>This domain describes documented risk—not likelihood, impact, organisational exposure, mitigation or an assurance conclusion.</span></div>
              <section className="inspector-section">
                <h3>Constituent risk types <small>{riskSubdomains.filter((risk) => risk.riskDomainId === riskDomain.id).length}</small></h3>
                <div className="instrument-link-list">
                  {riskSubdomains.filter((risk) => risk.riskDomainId === riskDomain.id).map((risk) => <button type="button" key={risk.id} onClick={() => onSelectNode(`risk-subdomain:${risk.id}`)}><strong>{risk.ref} · {risk.name}</strong><span>{countForCausalLens(risk, causalLens)} {activeCausalLabel.toLowerCase()}</span></button>)}
                </div>
              </section>
              <a className="source-button" href={MIT_RISK_SOURCE_URL} target="_blank" rel="noreferrer">Open MIT taxonomy <ArrowSquareOut /></a>
            </>
          )}

          {riskSubdomain && riskDomain && (
            <>
              <button className="breadcrumb-button" type="button" onClick={() => onSelectNode(`risk-domain:${riskDomain.id}`)}>{riskDomain.name}</button>
              <div className="inspector-kicker">MIT risk type · {riskSubdomain.ref}</div>
              <h2>{riskSubdomain.name}</h2>
              <p className="inspector-summary">{riskSubdomain.definition}</p>
              <div className="risk-record-callout">
                <strong>{countForCausalLens(riskSubdomain, causalLens).toLocaleString()}</strong>
                <span>{activeCausalLabel.toLowerCase()} in this risk type</span>
                {causalLens !== 'all' && <small>{riskSubdomain.recordCount} total mapped source records</small>}
              </div>
              <div className="boundary-note"><WarningDiamond /><span>MIT classifies documented risks; it does not determine likelihood, impact or applicability. Atlas concept links are synthesis and do not imply coverage or mitigation.</span></div>
              <section className="inspector-section">
                <h3>Relevant trust concepts <small>{riskSubdomain.conceptIds.length}</small></h3>
                <div className="concept-chips">
                  {riskSubdomain.conceptIds.map((conceptId) => {
                    const item = concepts.find((candidate) => candidate.id === conceptId)
                    return item ? <button type="button" key={conceptId} onClick={() => onSelectNode(`concept:${conceptId}`)}>{item.name}</button> : null
                  })}
                </div>
                <p className="mapping-meta">Atlas synthesis · {riskSubdomain.mappingConfidence} confidence · source taxonomy retained separately</p>
              </section>
              <section className="inspector-section causal-breakdown">
                <h3>Causal profile <small>{riskSubdomain.recordCount} records</small></h3>
                <h4>Entity</h4><CausalProfileBars values={riskSubdomain.causalProfile.entity} total={riskSubdomain.recordCount} />
                <h4>Intent</h4><CausalProfileBars values={riskSubdomain.causalProfile.intent} total={riskSubdomain.recordCount} />
                <h4>Timing</h4><CausalProfileBars values={riskSubdomain.causalProfile.timing} total={riskSubdomain.recordCount} />
              </section>
              <div className="inspector-actions">
                <a href={MIT_RISK_SOURCE_URL} target="_blank" rel="noreferrer">MIT taxonomy <ArrowSquareOut /></a>
                <a href={MIT_RISK_DATABASE_URL} target="_blank" rel="noreferrer">Source database <ArrowSquareOut /></a>
              </div>
            </>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
