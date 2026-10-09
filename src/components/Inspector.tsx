import { UseCaseDetail } from './UseCaseDetail'
import { RequirementList } from './RequirementList'
import { requirementsForConcept, requirementsForControl, requirementsForSource } from '../data/requirements'
import { crosswalkLinks, publishedCrosswalks } from '../data/crosswalks'
import { issuerTypeLabels, legalEffectLabels, sectorLabels } from '../data/sourceMetadata'
import { useCaseById, useCasesForNode } from '../data/useCases'
import { IncidentDetail } from './IncidentDetail'
import { incidentById, incidentsForNode } from '../data/incidents'
import type { ReactNode } from 'react'
import { useSheetDismiss } from '../hooks/useSheetDismiss'
import { QuestionsPanel } from './LeadershipQuestions'
import { ArrowRight, ArrowSquareOut, CaretDown, CaretUp, CheckCircle, GitBranch, ShieldCheck, WarningDiamond, X } from '@phosphor-icons/react'
import { TracePanel } from './TracePanel'
import { DraftBadge } from '../ui/Kit'
import { AnimatePresence, motion } from 'motion/react'
import { assertionsForNode, inferProvisionGranularity, riskPathsForInstrument, riskPathsForProvision, specificConceptIds } from '../data/assertions'
import { concepts, domainById, domains } from '../data/concepts'
import { CONTROL_MODEL_VERSION, controlFamilies, controlFamilyById, controlObjectiveById, controlObjectives, controlsForConcept, controlsForRisk } from '../data/controls'
import { instrumentById, instruments } from '../data/instruments'
import { MIT_RISK_DATABASE_URL, MIT_RISK_LICENSE, MIT_RISK_PROVENANCE, MIT_RISK_SOURCE_URL, MIT_RISK_UPDATED, causalLensOptions, countForCausalLens, riskDomainById, riskSubdomainById, riskSubdomains, type CausalLens } from '../data/mitRiskTaxonomy'
import { relations } from '../data/relations'
import { authorityLabels, legalRelationLabel, relationFamilyFor, relationLabels } from '../lib/labels'
import type { AuthorityClass, ControlObjective, MappingAssertion } from '../types'

type Props = {
  selectedNodeId?: string
  onClose: () => void
  onSelectNode: (nodeId: string) => void
  causalLens: CausalLens
  onShowRelated?: () => void
  onTrace?: (nodeIds: string[]) => void
  mobileExpanded?: boolean
  navigation?: ReactNode
  onBack?: () => void
  onMobileExpandedChange?: (expanded: boolean) => void
}

const reviewPurpose: Record<AuthorityClass, string> = {
  law: 'Use the selected sections to identify obligations that may need to be considered in a review. Confirm the entity, activity and effective version in scope.',
  treaty: 'Use this to understand international commitments and the questions to check against domestic implementation.',
  'policy-guidance': 'Use this to understand the issuer’s expectations and practical advice, then check which parts concern your organisation.',
  standard: 'Use this to structure questions about management practices and technical requirements. Consult the full standard for the exact requirements.',
  'assurance-standard': 'Use this to understand how an independent practitioner would plan, perform and report an engagement. The standard governs the practitioner; it does not itself set criteria for your AI systems.',
  framework: 'Use this to organise a review and identify areas to investigate. The framework does not establish that controls are operating.',
  'testing-tool': 'Use this to develop evaluation questions and possible tests. Check the tool’s scope and limitations before adopting it.',
  'research-database': 'Use this to find documented risks, examples and research leads. Validate their relevance to the system you are reviewing.',
}

const domainRoleLabels = {
  'trust-outcome': 'Trust outcome',
  'governance-capability': 'Governance capability',
} as const

const conceptRoleLabels = {
  'trust-objective': 'Trust objective',
  'governance-capability': 'Governance capability',
} as const

function CausalProfileBars({ values, total }: { values: Record<string, number>; total: number }) {
  return <div className="causal-profile">
    {Object.entries(values).filter(([, value]) => value > 0).sort((left, right) => right[1] - left[1]).map(([label, value]) => (
      <div className="causal-profile-row" key={label}><div><span>{label}</span><strong>{value}</strong></div><i><b style={{ width: `${Math.max(3, (value / total) * 100)}%` }} /></i></div>
    ))}
  </div>
}

function AssertionMeta({ assertion }: { assertion: MappingAssertion }) {
  return <div className="assertion-meta">
    <div><strong>{assertion.predicate.replaceAll('-', ' ')}</strong><span>{assertion.basis === 'atlas-synthesis' ? 'Atlas interpretation' : assertion.basis === 'source-authored' ? 'Stated in the source' : assertion.basis.replaceAll('-', ' ')} · {assertion.confidence} confidence</span></div>
    <p>{assertion.rationale}</p>
    {assertion.citations.slice(0, 2).map((citation) => <a key={`${citation.url}:${citation.locator}`} href={citation.url} target="_blank" rel="noreferrer">{citation.sourceTitle} · {citation.locator} <ArrowSquareOut /></a>)}
  </div>
}

function ControlCards({ controls, onSelectNode, note }: { controls: ControlObjective[]; onSelectNode: (nodeId: string) => void; note?: string }) {
  return <>
    {note && <p className="section-boundary">{note}</p>}
    <div className="control-card-list">
      {controls.map((control) => <button type="button" key={control.id} onClick={() => onSelectNode(`control-objective:${control.id}`)}>
        <span style={{ color: controlFamilyById.get(control.familyId)?.color }}>{control.code}</span>
        <strong>{control.name}</strong>
        <p>{control.objective}</p>
        <small>{controlFamilyById.get(control.familyId)?.name}</small>
      </button>)}
    </div>
  </>
}

export function Inspector({ selectedNodeId, onClose, onSelectNode, causalLens, onShowRelated, onTrace, mobileExpanded = false, onMobileExpandedChange, navigation, onBack }: Props) {
  const sheet = useSheetDismiss(onClose)
  const [kind, rawId] = selectedNodeId?.split(':') ?? []
  const useCase = kind==='use-case'?useCaseById.get(rawId):undefined
  const linkedUseCases=useCasesForNode(kind,rawId)
  const incident = kind==='incident'?incidentById.get(rawId):undefined
  const linkedIncidents=incidentsForNode(kind,rawId)
  const instrument = kind === 'instrument' ? instrumentById.get(rawId) : kind === 'provision' ? instruments.find((candidate) => candidate.provisions.some((provision) => provision.id === rawId)) : undefined
  const provision = kind === 'provision' ? instrument?.provisions.find((candidate) => candidate.id === rawId) : undefined
  const concept = kind === 'concept' ? concepts.find((candidate) => candidate.id === rawId) : undefined
  const riskDomain = kind === 'risk-domain' ? riskDomainById.get(rawId) : kind === 'risk-subdomain' ? riskDomainById.get(riskSubdomainById.get(rawId)?.riskDomainId ?? '') : undefined
  const riskSubdomain = kind === 'risk-subdomain' ? riskSubdomainById.get(rawId) : undefined
  const controlFamily = kind === 'control-family' ? controlFamilyById.get(rawId) : kind === 'control-objective' ? controlFamilyById.get(controlObjectiveById.get(rawId)?.familyId ?? '') : undefined
  const control = kind === 'control-objective' ? controlObjectiveById.get(rawId) : undefined
  const domain = kind === 'domain' ? domains.find((candidate) => candidate.id === rawId) : concept ? domainById.get(concept.domainId) : instrument ? domainById.get(concepts.find((candidate) => instrument.conceptIds.includes(candidate.id))?.domainId ?? '') : undefined

  const instrumentRelations = instrument ? relations.filter((relation) => relation.sourceId === instrument.id || relation.targetId === instrument.id) : []
  const legalRelationTypes = new Set(['made-under', 'issuer-governed-by'])
  const relatedInstruments = instrumentRelations.map((relation) => ({ relation, instrument: instrumentById.get(relation.sourceId === instrument?.id ? relation.targetId : relation.sourceId) })).filter((entry) => entry.instrument)
  const legalFoundations = relatedInstruments.filter(({ relation }) => legalRelationTypes.has(relation.type))
  const otherRelations = relatedInstruments.filter(({ relation }) => !legalRelationTypes.has(relation.type))
  const conceptInstruments = concept ? instruments.filter((candidate) => candidate.conceptIds.includes(concept.id)) : []
  const sourceRequirements = instrument && !provision ? requirementsForSource(instrument.id) : []
  const sectionRequirements = instrument && provision ? requirementsForSource(instrument.id, provision.id) : []
  const controlRequirements = control ? requirementsForControl(control.id) : []
  const conceptRequirements = concept ? requirementsForConcept(concept.id) : []
  const sectionCrosswalks = provision ? crosswalkLinks.filter((link) => link.from.provisionId === provision.id || link.to.provisionId === provision.id).map((link) => {
    const other = link.from.provisionId === provision.id ? link.to : link.from
    const otherSource = instruments.find((candidate) => candidate.id === other.instrumentId)
    return { link, crosswalk: publishedCrosswalks.find((item) => item.id === link.crosswalkId), otherSource, otherSection: otherSource?.provisions.find((section) => section.id === other.provisionId) }
  }) : []
  const conceptRisks = concept ? riskSubdomains.filter((risk) => risk.conceptIds.includes(concept.id)) : []
  const instrumentRiskPaths = instrument ? riskPathsForInstrument(instrument.id).slice(0, 5) : []
  const provisionRiskPaths = provision ? riskPathsForProvision(provision.id).slice(0, 5) : []
  const instrumentControls = instrument ? controlObjectives.map((candidate) => ({ control: candidate, shared: candidate.conceptIds.filter((conceptId) => instrument.conceptIds.includes(conceptId)) })).filter((entry) => entry.control.sourceRefs.some(ref => ref.instrumentId === instrument.id) || specificConceptIds(entry.shared).some(id => instrument.provisions.some(p => p.conceptIds.includes(id)))).sort((left, right) => right.shared.length - left.shared.length || left.control.code.localeCompare(right.control.code)).slice(0, 5) : []
  const allNodeAssertions = selectedNodeId ? assertionsForNode(selectedNodeId).filter((assertion) => assertion.predicate !== 'contains') : []
  const nodeAssertions = allNodeAssertions.slice(0, 4)
  const directAssertionCount = allNodeAssertions.filter((assertion) => assertion.basis === 'source-authored' || assertion.basis === 'published-crosswalk').length
  const synthesisAssertionCount = allNodeAssertions.filter((assertion) => assertion.basis === 'atlas-synthesis').length
  const activeCausalLabel = causalLensOptions.find((option) => option.id === causalLens)?.label ?? 'All records'
  const mobileTitle = useCase ? `${useCase.company} · ${useCase.title}` : incident?.shortTitle ?? provision?.title ?? instrument?.shortTitle ?? concept?.name ?? riskSubdomain?.name ?? riskDomain?.name ?? control?.name ?? controlFamily?.name ?? domain?.name ?? 'Selected node'
  const mobileKind = useCase ? 'Use case' : incident ? 'Incident' : provision ? `Source ${inferProvisionGranularity(provision)}` : instrument ? authorityLabels[instrument.authorityClass] : concept ? conceptRoleLabels[concept.role] : riskSubdomain ? 'MIT risk type' : riskDomain ? 'MIT risk domain' : control ? 'Control objective' : controlFamily ? 'Control family' : domain ? domainRoleLabels[domain.role] : 'Atlas detail'

  return <AnimatePresence mode="wait">
    {selectedNodeId && <motion.aside ref={sheet.ref} style={{ y: sheet.y }} className={mobileExpanded ? 'inspector mobile-expanded' : 'inspector'} key={selectedNodeId} initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 28 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }} aria-label="Selected node details">
      <button className="mobile-inspector-peek" type="button" aria-expanded={mobileExpanded} onClick={() => onMobileExpandedChange?.(!mobileExpanded)}>
        <i aria-hidden="true" />
        <span><small>{mobileKind}</small><strong>{mobileTitle}</strong></span>
        <b>{mobileExpanded ? 'Preview' : 'Read details'} {mobileExpanded ? <CaretDown /> : <CaretUp />}</b>
      </button>
      <button className="inspector-close" type="button" onClick={onClose} aria-label="Close details"><X /></button>
      <div className="detail-navigation">{onBack&&<button type="button" onClick={onBack}>← Back</button>}{navigation}</div>
      {!incident&&!useCase&&<div className="evidence-spine-head">
        <span><i />Evidence behind this item</span>
        <div className="evidence-split" role="img" aria-label={`${directAssertionCount} source-based and ${synthesisAssertionCount} Atlas interpretation links`}><i className="is-source" style={{ flexGrow: directAssertionCount || 0.02 }} /><i className="is-synthesis" style={{ flexGrow: synthesisAssertionCount || 0.02 }} /></div>
        <div><small><b className="is-source" />{directAssertionCount} source-based</small><small><b className="is-synthesis" />{synthesisAssertionCount} Atlas interpretation</small>{(instrument?.editorialStatus === 'draft' || provision?.editorialStatus === 'draft') && <DraftBadge />}</div>
      </div>}

      {useCase&&<UseCaseDetail item={useCase} onSelect={onSelectNode}/>}
      {linkedUseCases.length>0&&<details className="inspector-section incident-links"><summary>Use cases <small>{linkedUseCases.length}</small></summary>{linkedUseCases.map(i=><button key={i.id} onClick={()=>onSelectNode(`use-case:${i.id}`)}>{i.company} · {i.title} →</button>)}</details>}
      {incident&&<IncidentDetail item={incident} onSelect={onSelectNode}/>}
      {linkedIncidents.length>0&&<section className="inspector-section incident-links"><h3>Related incidents</h3>{linkedIncidents.map(i=><button key={i.id} onClick={()=>onSelectNode(`incident:${i.id}`)}>{i.shortTitle} →</button>)}</section>}
      {!incident&&!useCase&&onShowRelated && <button className="inspector-related" type="button" onClick={onShowRelated}>Related items <ArrowRight /></button>}
      {!incident&&!useCase&&selectedNodeId&&onTrace&&<TracePanel key={selectedNodeId} from={selectedNodeId} onShow={onTrace} onSelect={onSelectNode} />}

      {riskSubdomain?.controlScope === 'societal' && <p className="section-boundary societal-risk">Largely outside a single organisation’s control. This is a societal-scale risk: the Atlas lists no organisational control objectives for it, though related concepts may still inform policy and engagement.</p>}
      {(kind === 'risk-domain' || kind === 'risk-subdomain') && <p className="section-boundary">Counts use the bundled December 2025 snapshot. MIT’s website describes 1,700+ risks as of our 7 September 2026 review; that newer database has not been imported. <a href={MIT_RISK_SOURCE_URL} target="_blank" rel="noreferrer">See current MIT repository</a>.</p>}
      {instrument && !provision && <>
        <div className="inspector-kicker">{authorityLabels[instrument.authorityClass]}</div>
        <h2>{instrument.shortTitle}</h2><p className="inspector-full-title">{instrument.title}</p>

        <section className="source-overview"><h3>What this says</h3><p>{instrument.summary}</p><h3>Who it concerns</h3><p>{instrument.jurisdiction} · {instrument.sectorIds.map((id) => sectorLabels[id]).join(' · ')}</p><p className="legal-effect"><strong>{legalEffectLabels[instrument.legalEffect]}</strong> · {issuerTypeLabels[instrument.issuerType]}</p><h3>Why it matters</h3><p>{instrument.id === 'apra-cps-234' ? 'Use this when reviewing how an APRA-regulated entity protects information assets, tests security controls and handles incidents involving AI systems or providers.' : reviewPurpose[instrument.authorityClass]}</p></section>

        <div className="inspector-actions"><a href={instrument.officialUrl} target="_blank" rel="noreferrer">Official source <ArrowSquareOut /></a></div>
        {sourceRequirements.length > 0 && <details className="inspector-section requirements-section" open><summary>What it requires <small>{sourceRequirements.length}</small></summary><p className="section-boundary">Paraphrased from the source; check the original wording. Control links are Atlas suggestions, not findings.</p><RequirementList items={sourceRequirements} onSelectNode={onSelectNode} /></details>}
        <QuestionsPanel kind="instrument" id={instrument.id} />
        <details className="inspector-section"><summary>Scope, dates and authority</summary>        <div className="metadata-grid"><div><span>Issuer</span><strong>{instrument.issuer}</strong></div><div><span>Country or region</span><strong>{instrument.jurisdiction}</strong></div><div><span>Status</span><strong>{instrument.status.replaceAll('-', ' ')}</strong></div><div><span>Legal effect</span><strong>{legalEffectLabels[instrument.legalEffect]}</strong></div><div><span>Issuer type</span><strong>{issuerTypeLabels[instrument.issuerType]}</strong></div><div><span>Last verified</span><strong>{instrument.lastVerified}</strong></div></div>        <div className="boundary-note"><CheckCircle /><span><strong>{instrument.authorityNote}</strong><br />{instrument.applicability}</span></div><p className="section-boundary">Published: {instrument.published}{instrument.effective ? ` · Effective: ${instrument.effective}` : ''}. Last verified refers to the substantive summary; later targeted checks are recorded separately in Dates & changes.</p>{instrument.supersedes && <div className="supersedes"><h4>Replaces</h4><ul>{instrument.supersedes.map((prior) => <li key={prior.title}><strong>{prior.url ? <a href={prior.url} target="_blank" rel="noreferrer">{prior.title}</a> : prior.title}</strong> — {prior.note}</li>)}</ul></div>}</details>
        {legalFoundations.length > 0 && <details className="inspector-section legal-foundations" aria-label="Legal foundations"><summary>Legal foundations</summary><div className="relation-list">{legalFoundations.map(({ relation, instrument: related }) => <div key={relation.id}><button type="button" onClick={() => related && onSelectNode(`instrument:${related.id}`)}><span>{legalRelationLabel(relation.type, relation.sourceId === instrument.id)}</span><strong>{related?.shortTitle}</strong><p>{relation.explanation}</p></button>{relation.citations?.map((citation, index) => <a key={index} className="text-button" href={citation.url} target="_blank" rel="noreferrer">{citation.locator} <ArrowSquareOut /></a>)}</div>)}</div></details>}
        <details className="inspector-section"><summary>Associated trust concepts <small>{instrument.conceptIds.length}</small></summary><p className="section-boundary">Atlas mappings, not claims that the source fully covers each concept.</p><div className="concept-chips">{instrument.conceptIds.map((conceptId) => { const item = concepts.find((candidate) => candidate.id === conceptId); return item ? <button type="button" key={conceptId} onClick={() => onSelectNode(`concept:${conceptId}`)}>{item.name}</button> : null })}</div></details>
        <details className="inspector-section"><summary>Explained source relationships <small>{otherRelations.length}</small></summary><div className="relation-list">{otherRelations.map(({ relation, instrument: related }) => <button type="button" key={relation.id} onClick={() => related && onSelectNode(`instrument:${related.id}`)}><span><GitBranch /> {relationFamilyFor(relation.type)}</span><strong>{related?.shortTitle}</strong><p>{relation.explanation}</p><small>{relationLabels[relation.type]} · {relation.basis.replaceAll('-', ' ')} · {relation.confidence} confidence</small><small>Anchors: {relation.sourceAnchors.join(' / ')}</small></button>)}{otherRelations.length === 0 && <p className="empty-copy">No curated cross-source relationship is recorded yet.</p>}</div></details>
        <details className="inspector-section"><summary>Suggested risks to explore <small>{instrumentRiskPaths.length} shown</small></summary><p className="section-boundary">Suggestions require a specific shared concept and a supporting source section. Broad governance links alone are excluded; these are Atlas interpretations.</p><div className="path-list">{instrumentRiskPaths.map((path) => { const risk = riskSubdomainById.get(path.riskId); return risk ? <button type="button" key={path.riskId} onClick={() => onSelectNode(`risk-subdomain:${risk.id}`)}><strong>{risk.ref} · {risk.name}</strong><span className="path-route"><b>{instrument.shortTitle}</b><ArrowRight /><b>{path.conceptIds.slice(0, 2).map((id) => concepts.find((candidate) => candidate.id === id)?.name).join(' + ')}</b><ArrowRight /><b>{risk.ref}</b></span><small>{path.conceptIds.length} shared concepts · {path.provisionIds.length} supporting provisions · Atlas suggestion</small></button> : null })}</div></details>
        <details className="inspector-section"><summary>Candidate control objectives <small>{instrumentControls.length} shown</small></summary><p className="section-boundary">Based on a recorded source reference or a specific concept supported by a source section. These are candidate objectives for review.</p><div className="control-card-list">{instrumentControls.map(({ control: item, shared }) => <button type="button" key={item.id} onClick={() => onSelectNode(`control-objective:${item.id}`)}><span>{item.code}</span><strong>{item.name}</strong><p>Connected through {shared.slice(0, 2).map((id) => concepts.find((candidate) => candidate.id === id)?.name).join(' and ')}.</p><small>{controlFamilyById.get(item.familyId)?.name}</small></button>)}</div></details>
        <details className="inspector-section"><summary>Specific sections <small>{instrument.provisions.length}</small></summary><div className="provision-list">{instrument.provisions.map((item) => <button type="button" key={item.id} onClick={() => onSelectNode(`provision:${item.id}`)}><span>{inferProvisionGranularity(item)} · {item.ref}</span><strong>{item.title}</strong><p>{item.summary}</p></button>)}</div>{instrument.detailAvailability === 'licensed-standard' && <p className="licence-note">Provision guides are original paraphrases. The full standard is licensed by the issuing body.</p>}</details>
      </>}

      {provision && instrument && <>
        <button className="breadcrumb-button" type="button" onClick={() => onSelectNode(`instrument:${instrument.id}`)}>{instrument.shortTitle}</button><div className="inspector-kicker">Source {inferProvisionGranularity(provision)} · {provision.ref}</div><h2>{provision.title}</h2><p className="inspector-summary">{provision.summary}</p>{provision.note && <div className="boundary-note"><span>{provision.note}</span></div>}
        {sectionRequirements.length > 0 && <section className="inspector-section requirements-section"><h3>What this section requires <small>{sectionRequirements.length}</small></h3><RequirementList items={sectionRequirements} onSelectNode={onSelectNode} /></section>}
        {sectionCrosswalks.length > 0 && <section className="inspector-section"><h3>Published crosswalk <small>{sectionCrosswalks.length}</small></h3><p className="section-boundary">Pairings taken from a published crosswalk{sectionCrosswalks[0].crosswalk ? ` (${sectionCrosswalks[0].crosswalk.publisher})` : ''}, not Atlas interpretation.</p><div className="instrument-link-list">{sectionCrosswalks.map(({ link, otherSource, otherSection }) => otherSource && otherSection ? <button type="button" key={link.id} onClick={() => onSelectNode(`provision:${otherSection.id}`)}><strong>{otherSource.shortTitle} · {otherSection.ref}</strong><span>{otherSection.title}</span></button> : null)}</div>{sectionCrosswalks[0].crosswalk && <a className="text-button" href={sectionCrosswalks[0].crosswalk.url} target="_blank" rel="noreferrer">{sectionCrosswalks[0].crosswalk.title} <ArrowSquareOut /></a>}</section>}
        <QuestionsPanel kind="provision" id={provision.id} />
        <section className="inspector-section"><h3>Associated concepts</h3><div className="concept-chips">{provision.conceptIds.map((conceptId) => { const item = concepts.find((candidate) => candidate.id === conceptId); return item ? <button type="button" key={conceptId} onClick={() => onSelectNode(`concept:${conceptId}`)}>{item.name}</button> : null })}</div></section>
        <section className="inspector-section"><h3>Explainable MIT risk paths <small>{provisionRiskPaths.length} shown</small></h3><p className="section-boundary">Provision → shared concept → MIT risk. This does not claim the provision covers or controls the risk.</p><div className="path-list">{provisionRiskPaths.map((path) => { const risk = riskSubdomainById.get(path.riskId); return risk ? <button type="button" key={risk.id} onClick={() => onSelectNode(`risk-subdomain:${risk.id}`)}><strong>{risk.ref} · {risk.name}</strong><span className="path-route"><b>{provision.ref}</b><ArrowRight /><b>{path.conceptIds.map((id) => concepts.find((candidate) => candidate.id === id)?.name).join(' + ')}</b><ArrowRight /><b>{risk.ref}</b></span><small>Atlas suggestion</small></button> : null })}</div></section>
        <a className="source-button" href={provision.sourceUrl ?? instrument.officialUrl} target="_blank" rel="noreferrer">Open source <ArrowSquareOut /></a>
      </>}

      {concept && domain && <>
        <button className="breadcrumb-button" type="button" onClick={() => onSelectNode(`domain:${domain.id}`)}>{domain.name}</button><div className="inspector-kicker">{conceptRoleLabels[concept.role]}</div><h2>{concept.name}</h2><p className="inspector-summary">{concept.definition}</p><div className="role-band"><span>Primary visual theme</span><strong>{domain.name}</strong><small>{domainRoleLabels[domain.role]}; concepts may span other themes.</small></div>
        <QuestionsPanel kind="concept" id={concept.id} />{conceptRequirements.length > 0 && <details className="inspector-section requirements-section"><summary>Requirements that state this <small>{conceptRequirements.length}</small></summary><RequirementList items={conceptRequirements} onSelectNode={onSelectNode} showSource /></details>}<section className="inspector-section"><h3>Related sources <small>{conceptInstruments.length}</small></h3><div className="instrument-link-list">{conceptInstruments.map((item) => <button type="button" key={item.id} onClick={() => onSelectNode(`instrument:${item.id}`)}><strong>{item.shortTitle}</strong><span>{authorityLabels[item.authorityClass]}</span></button>)}</div></section>
        <section className="inspector-section"><h3>Relevant MIT risk types <small>{conceptRisks.length}</small></h3><p className="section-boundary">Individual assertion mappings express relevance or a threatened objective, never coverage or mitigation.</p><div className="instrument-link-list">{conceptRisks.map((risk) => <button type="button" key={risk.id} onClick={() => onSelectNode(`risk-subdomain:${risk.id}`)}><strong>{risk.ref} · {risk.name}</strong><span>{risk.mappingConfidence} confidence</span></button>)}</div></section>
        <section className="inspector-section"><h3>Candidate controls <small>{controlsForConcept(concept.id).length}</small></h3><ControlCards controls={controlsForConcept(concept.id)} onSelectNode={onSelectNode} note="Controls are intended to support this concept; effectiveness requires organisation-specific evidence and human assessment." /></section>
      </>}

      {domain && kind === 'domain' && <><div className="inspector-kicker">{domainRoleLabels[domain.role]} · visual theme</div><h2>{domain.name}</h2><p className="domain-question">{domain.question}</p><p className="inspector-summary">{domain.definition}</p><div className="boundary-note"><WarningDiamond /><span>This is a primary navigation theme, not an exclusive ontological parent. Agentic AI and third-party are context facets across other outcomes and capabilities.</span></div><QuestionsPanel kind="domain" id={domain.id} /><section className="inspector-section"><h3>Constituent concepts</h3><div className="instrument-link-list">{concepts.filter((item) => item.domainId === domain.id).map((item) => <button type="button" key={item.id} onClick={() => onSelectNode(`concept:${item.id}`)}><strong>{item.name}</strong><span>{conceptRoleLabels[item.role]}</span></button>)}</div></section></>}

      {riskDomain && kind === 'risk-domain' && <><div className="inspector-kicker">MIT risk taxonomy</div><h2>{riskDomain.name}</h2><p className="inspector-summary">{riskDomain.definition}</p><div className="metadata-grid"><div><span>Source</span><strong>MIT AI Risk Initiative</strong></div><div><span>Updated</span><strong>{MIT_RISK_UPDATED}</strong></div><div><span>Licence</span><strong>{MIT_RISK_LICENSE}</strong></div><div><span>Transform</span><strong>Aggregate profile</strong></div></div><div className="boundary-note"><WarningDiamond /><span>This domain describes documented risk—not likelihood, impact, organisational exposure, mitigation or an assurance conclusion.</span></div><QuestionsPanel kind="risk-domain" id={riskDomain.id} /><section className="inspector-section"><h3>Constituent risk types <small>{riskSubdomains.filter((risk) => risk.riskDomainId === riskDomain.id).length}</small></h3><div className="instrument-link-list">{riskSubdomains.filter((risk) => risk.riskDomainId === riskDomain.id).map((risk) => <button type="button" key={risk.id} onClick={() => onSelectNode(`risk-subdomain:${risk.id}`)}><strong>{risk.ref} · {risk.name}</strong><span>{countForCausalLens(risk, causalLens)} {activeCausalLabel.toLowerCase()}</span></button>)}</div></section><p className="provenance-manifest">{MIT_RISK_PROVENANCE.transformation}</p><a className="source-button" href={MIT_RISK_SOURCE_URL} target="_blank" rel="noreferrer">Open MIT taxonomy <ArrowSquareOut /></a></>}

      {riskSubdomain && riskDomain && <><button className="breadcrumb-button" type="button" onClick={() => onSelectNode(`risk-domain:${riskDomain.id}`)}>{riskDomain.name}</button><div className="inspector-kicker">MIT risk type · {riskSubdomain.ref}</div><h2>{riskSubdomain.name}</h2><p className="inspector-summary">{riskSubdomain.definition}</p><div className="risk-record-callout"><strong>{countForCausalLens(riskSubdomain, causalLens).toLocaleString()}</strong><span>{activeCausalLabel.toLowerCase()} in this risk type</span>{causalLens !== 'all' && <small>{riskSubdomain.recordCount} total mapped source records</small>}</div><div className="boundary-note"><WarningDiamond /><span>Record count is source prevalence, not severity, likelihood or exposure. Candidate controls do not imply that this risk is mitigated.</span></div>
        <QuestionsPanel kind="risk-subdomain" id={riskSubdomain.id} />
        <section className="inspector-section"><h3>Relevant trust concepts <small>{riskSubdomain.conceptIds.length}</small></h3><div className="concept-chips">{riskSubdomain.conceptIds.map((conceptId) => { const item = concepts.find((candidate) => candidate.id === conceptId); return item ? <button type="button" key={conceptId} onClick={() => onSelectNode(`concept:${conceptId}`)}>{item.name}</button> : null })}</div><p className="mapping-meta">Individual Atlas assertions · {riskSubdomain.mappingConfidence} confidence · MIT taxonomy retained separately</p></section>
        <section className="inspector-section"><h3>Candidate control objectives <small>{controlsForRisk(riskSubdomain.id).length}</small></h3><ControlCards controls={controlsForRisk(riskSubdomain.id)} onSelectNode={onSelectNode} note="These objectives may help prevent, detect, respond to or recover from the risk. The graph makes no implementation or effectiveness claim." /></section>
        <section className="inspector-section causal-breakdown"><h3>Causal profile <small>{riskSubdomain.recordCount} records</small></h3><h4>Entity</h4><CausalProfileBars values={riskSubdomain.causalProfile.entity} total={riskSubdomain.recordCount} /><h4>Intent</h4><CausalProfileBars values={riskSubdomain.causalProfile.intent} total={riskSubdomain.recordCount} /><h4>Timing</h4><CausalProfileBars values={riskSubdomain.causalProfile.timing} total={riskSubdomain.recordCount} /></section><div className="inspector-actions"><a href={MIT_RISK_SOURCE_URL} target="_blank" rel="noreferrer">MIT taxonomy <ArrowSquareOut /></a><a href={MIT_RISK_DATABASE_URL} target="_blank" rel="noreferrer">Source database <ArrowSquareOut /></a></div>
      </>}

      {controlFamily && kind === 'control-family' && <><div className="inspector-kicker">Atlas control family · {controlFamily.code}</div><h2>{controlFamily.name}</h2><p className="domain-question">{controlFamily.question}</p><p className="inspector-summary">{controlFamily.definition}</p><div className="boundary-note"><ShieldCheck /><span>This family organises candidate responses. It is not a compliance framework or assessment result.</span></div><QuestionsPanel kind="control-family" id={controlFamily.id} /><section className="inspector-section"><h3>Control objectives <small>4</small></h3><ControlCards controls={controlObjectives.filter((item) => item.familyId === controlFamily.id)} onSelectNode={onSelectNode} /></section></>}

      {control && controlFamily && <><button className="breadcrumb-button" type="button" onClick={() => onSelectNode(`control-family:${controlFamily.id}`)}>{controlFamily.name}</button><div className="inspector-kicker">Atlas control objective · {control.code}</div><h2>{control.name}</h2><p className="control-objective-copy">{control.objective}</p><p className="inspector-summary">{control.purpose}</p><div className="boundary-note"><WarningDiamond /><span>This is a source-grounded candidate objective. The Atlas does not determine applicability, design adequacy, implementation, operating effectiveness, residual risk, compliance or assurance.</span></div>
        <QuestionsPanel kind="control-objective" id={control.id} />
        {controlRequirements.length > 0 && <details className="inspector-section requirements-section"><summary>Requirements it could help meet <small>{controlRequirements.length}</small></summary><p className="section-boundary">Atlas suggestions: meeting a requirement depends on design, implementation and scope.</p><RequirementList items={controlRequirements} onSelectNode={onSelectNode} showSource /></details>}
        <div className="control-taxonomy"><div><span>Control type</span><strong>{control.controlTypes.join(' · ')}</strong></div><div><span>Lifecycle</span><strong>{control.lifecycleStages.join(' · ')}</strong></div><div><span>Possible owners</span><strong>{control.roleArchetypes.join(' · ')}</strong></div><div><span>Model version</span><strong>{CONTROL_MODEL_VERSION}</strong></div></div>
        <section className="inspector-section"><h3>Implementation patterns <small>{control.implementationExamples.length}</small></h3><ul className="plain-list">{control.implementationExamples.map((example) => <li key={example}>{example}</li>)}</ul></section>
        <section className="inspector-section"><h3>Possible evidence <small>{control.evidenceExamples.length}</small></h3><p className="section-boundary">Evidence may support assessment; possession of an artefact does not prove control operation or effectiveness.</p><ul className="plain-list evidence-list">{control.evidenceExamples.map((example) => <li key={example}>{example}</li>)}</ul></section>
        <section className="inspector-section"><h3>Risks it may address <small>{control.riskIds.length}</small></h3><div className="instrument-link-list">{control.riskIds.map((riskId) => { const risk = riskSubdomainById.get(riskId); return risk ? <button type="button" key={risk.id} onClick={() => onSelectNode(`risk-subdomain:${risk.id}`)}><strong>{risk.ref} · {risk.name}</strong><span>may address</span></button> : null })}</div></section>
        <section className="inspector-section"><h3>Trust concepts supported <small>{control.conceptIds.length}</small></h3><div className="concept-chips">{control.conceptIds.map((conceptId) => { const item = concepts.find((candidate) => candidate.id === conceptId); return item ? <button type="button" key={item.id} onClick={() => onSelectNode(`concept:${item.id}`)}>{item.name}</button> : null })}</div></section>
        <section className="inspector-section"><h3>Source foundations <small>{control.sourceRefs.length}</small></h3><div className="source-ref-list">{control.sourceRefs.map((source, index) => <a href={source.url} target="_blank" rel="noreferrer" key={`${source.instrumentId}:${source.locator}:${index}`}><span>{source.sourceKind.replaceAll('-', ' ')}</span><strong>{source.sourceTitle}</strong><p>{source.locator}</p><ArrowSquareOut /></a>)}</div></section>
      </>}

      {nodeAssertions.length > 0 && !control && <details className="inspector-section assertion-section"><summary>How these connections were made <small>{nodeAssertions.length} shown</small></summary><p className="section-boundary">See why these items are connected, who made the connection and which sources support it.</p>{nodeAssertions.map((assertion) => <AssertionMeta assertion={assertion} key={assertion.id} />)}</details>}
    </motion.aside>}
  </AnimatePresence>
}
