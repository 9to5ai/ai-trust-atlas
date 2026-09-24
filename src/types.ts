export type AuthorityClass =
  | 'law'
  | 'treaty'
  | 'policy-guidance'
  | 'standard'
  | 'assurance-standard'
  | 'framework'
  | 'testing-tool'
  | 'research-database'

export type InstrumentStatus =
  | 'in-force'
  | 'active'
  | 'phased'
  | 'consultation'
  | 'closed-consultation'
  | 'future-effective'
  | 'not-in-force'
  | 'superseded'
  | 'living'

export type RelationType =
  | 'made-under'
  | 'issuer-governed-by'
  | 'requires'
  | 'operationalises'
  | 'guides-implementation-of'
  | 'aligns-with'
  | 'extends'
  | 'provides-testing-for'
  | 'provides-threat-knowledge-for'
  | 'supports-evidence-for'
  | 'applies-to'
  | 'complements'
  | 'interprets'
  | 'implements'
  | 'profiles'
  | 'maps-to'
  | 'co-applies-with'
  | 'evidence-base-for'
  | 'certifies-against'
  | 'provides-assurance-basis-for'
  | 'supersedes'

export type EvidenceBasis = 'explicit' | 'cross-framework-synthesis'
export type Confidence = 'high' | 'medium'

export type DomainRole = 'trust-outcome' | 'governance-capability'
export type ConceptRole = 'trust-objective' | 'governance-capability'
export type NavigationFamily = 'decide-and-govern' | 'protect-people-and-information' | 'build-and-operate-safely' | 'verify-and-assure'

export type ConceptDomain = {
  id: string
  name: string
  shortName: string
  question: string
  definition: string
  color: string
  role: DomainRole
  navigationFamily: NavigationFamily
}

export type Concept = {
  id: string
  name: string
  domainId: string
  definition: string
  role: ConceptRole
  aliases?: string[]
}

export type RiskDomain = {
  id: string
  ref: string
  name: string
  shortName: string
  definition: string
  color: string
}

export type CausalDimension = 'entity' | 'intent' | 'timing'

export type CausalProfile = {
  entity: Record<string, number>
  intent: Record<string, number>
  timing: Record<string, number>
}

export type RiskSubdomain = {
  id: string
  ref: string
  name: string
  riskDomainId: string
  definition: string
  conceptIds: string[]
  recordCount: number
  causalProfile: CausalProfile
  mappingBasis: 'atlas-synthesis'
  mappingConfidence: Confidence
  /* 'societal' risks are largely outside a single organisation's control; the Atlas lists no organisational control objectives for them. */
  controlScope?: 'organisational' | 'societal'
}

export type SourceGranularity = 'article' | 'clause' | 'section' | 'principle' | 'outcome' | 'practice' | 'summary'

export type SourceProvision = {
  id: string
  ref: string
  title: string
  summary: string
  conceptIds: string[]
  granularity?: SourceGranularity
  sourceUrl?: string
  reviewedAt?: string
  note?: string
  /* 'draft' records were prepared for editorial review and are shown with a Draft badge until approved. */
  editorialStatus?: EditorialStatus
}

export type EditorialStatus = 'draft' | 'reviewed'

/* Structured source metadata (2026-09 ontology review). */
export type LegalEffect = 'binding-law' | 'mandatory-policy' | 'supervisory-expectation' | 'voluntary' | 'informational'
export type IssuerType = 'legislature' | 'regulator' | 'government' | 'standard-setter' | 'intergovernmental' | 'industry-body' | 'professional-body' | 'research'
export type SectorId = 'cross-sector' | 'financial-services' | 'banking' | 'insurance' | 'superannuation' | 'capital-markets' | 'payments' | 'financial-advice' | 'credit' | 'public-sector' | 'technology-providers' | 'critical-infrastructure' | 'telecommunications' | 'digital-platforms' | 'media' | 'corporations' | 'consumer'
export type PriorVersion = { title: string; note: string; url?: string }

/* A source as authored in the data modules; `Instrument` adds derived, structured metadata. */
export type SourceRecord = {
  id: string
  title: string
  shortTitle: string
  issuer: string
  jurisdiction: string
  region: 'Australia' | 'Global' | 'Europe' | 'United States' | 'United Kingdom' | 'Singapore' | 'Hong Kong' | 'Japan' | 'New Zealand' | 'South Korea' | 'Canada'
  authorityClass: AuthorityClass
  authorityNote: string
  status: InstrumentStatus
  published: string
  effective?: string
  lastVerified: string
  officialUrl: string
  summary: string
  applicability: string
  sectors: string[]
  conceptIds: string[]
  provisions: SourceProvision[]
  detailAvailability: 'full-public-text' | 'public-summary' | 'licensed-standard'
  editorialStatus?: EditorialStatus
}

export type Instrument = SourceRecord & {
  legalEffect: LegalEffect
  issuerType: IssuerType
  sectorIds: SectorId[]
  supersedes?: PriorVersion[]
}

export type MappingBasis = 'source-authored' | 'published-crosswalk' | 'atlas-synthesis'
export type MappingStatus = 'active' | 'provisional' | 'retired'
export type MappingPredicate =
  | 'made-under'
  | 'issuer-governed-by'
  | 'contains'
  | 'requires'
  | 'addresses'
  | 'threatens'
  | 'relevant-to'
  | 'supports'
  | 'may-address'
  | 'synthesised-from'
  | 'implemented-by'
  | 'tested-by'
  | 'may-produce-evidence'
  | 'aligns-with'
  | 'operationalises'

export type SourceCitation = {
  sourceTitle: string
  locator: string
  url: string
  accessedAt: string
  sourceVersion?: string
}

export type MappingAssertion = {
  id: string
  sourceNodeId: string
  predicate: MappingPredicate
  targetNodeId: string
  rationale: string
  basis: MappingBasis
  confidence: Confidence
  citations: SourceCitation[]
  createdBy: 'source' | 'AI Trust Atlas'
  verifiedAt: string
  status: MappingStatus
  inferenceDepth: 0 | 1 | 2
}

export type ControlFamily = {
  id: string
  code: string
  name: string
  shortName: string
  question: string
  definition: string
  color: string
}

export type ControlSourceReference = {
  instrumentId: string
  sourceTitle: string
  locator: string
  url: string
  sourceKind: 'outcome' | 'suggested-action' | 'mitigation-pattern' | 'verification-requirement' | 'implementation-guidance' | 'crosswalk'
}

export type ControlObjective = {
  id: string
  code: string
  name: string
  shortName: string
  familyId: string
  objective: string
  purpose: string
  controlTypes: Array<'governance' | 'preventive' | 'detective' | 'corrective' | 'recovery'>
  lifecycleStages: string[]
  roleArchetypes: string[]
  conceptIds: string[]
  riskIds: string[]
  implementationExamples: string[]
  evidenceExamples: string[]
  sourceRefs: ControlSourceReference[]
}

export type InstrumentRelation = {
  id: string
  sourceId: string
  targetId: string
  type: RelationType
  explanation: string
  basis: EvidenceBasis
  confidence: Confidence
  sourceAnchors: string[]
  citations?: SourceCitation[]
}

export type GraphNodeKind = 'use-case' | 'incident' | 'domain' | 'concept' | 'instrument' | 'provision' | 'risk-domain' | 'risk-subdomain' | 'control-family' | 'control-objective'

export type GraphNode = {
  id: string
  label: string
  shortLabel: string
  kind: GraphNodeKind
  domainId: string
  instrumentId?: string
  authorityClass?: AuthorityClass
  region?: Instrument['region']
  riskDomainId?: string
  controlFamilyId?: string
  recordCount?: number
  x: number
  y: number
  z: number
  targetX: number
  targetY: number
  targetZ: number
  radius: number
  color: string
}

export type GraphEdge = {
  id: string
  sourceId: string
  targetId: string
  label: string
  relationType?: RelationType
  semanticFamily?: 'structure' | 'authority' | 'alignment' | 'implementation' | 'evidence' | 'risk' | 'control'
  basis?: EvidenceBasis
  confidence?: Confidence
  explanation?: string
}

export type GraphModel = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}
