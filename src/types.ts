export type AuthorityClass =
  | 'law'
  | 'regulatory-expectation'
  | 'government-guidance'
  | 'government-policy'
  | 'international-treaty'
  | 'international-standard'
  | 'risk-framework'
  | 'financial-sector-guidance'
  | 'analytical-report'
  | 'testing-framework'
  | 'threat-knowledge'

export type InstrumentStatus =
  | 'in-force'
  | 'active'
  | 'phased'
  | 'voluntary'
  | 'consultation'
  | 'closed-consultation'
  | 'future-effective'
  | 'not-in-force'
  | 'superseded'
  | 'living'

export type RelationType =
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
  | 'supersedes'

export type EvidenceBasis = 'explicit' | 'cross-framework-synthesis'
export type Confidence = 'high' | 'medium'

export type ConceptDomain = {
  id: string
  name: string
  shortName: string
  question: string
  definition: string
  color: string
}

export type Concept = {
  id: string
  name: string
  domainId: string
  definition: string
  aliases?: string[]
}

export type Clause = {
  id: string
  ref: string
  title: string
  summary: string
  conceptIds: string[]
  sourceUrl?: string
  note?: string
}

export type Instrument = {
  id: string
  title: string
  shortTitle: string
  issuer: string
  jurisdiction: string
  region: 'Australia' | 'Global' | 'Europe' | 'United States' | 'United Kingdom' | 'Singapore' | 'Canada'
  authorityClass: AuthorityClass
  status: InstrumentStatus
  published: string
  effective?: string
  lastVerified: string
  officialUrl: string
  summary: string
  applicability: string
  sectors: string[]
  conceptIds: string[]
  clauses: Clause[]
  detailAvailability: 'full-public-text' | 'public-summary' | 'licensed-standard'
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
}

export type GraphNodeKind = 'domain' | 'concept' | 'instrument' | 'clause'

export type GraphNode = {
  id: string
  label: string
  shortLabel: string
  kind: GraphNodeKind
  domainId: string
  instrumentId?: string
  authorityClass?: AuthorityClass
  region?: Instrument['region']
  x: number
  y: number
  targetX: number
  targetY: number
  radius: number
  color: string
}

export type GraphEdge = {
  id: string
  sourceId: string
  targetId: string
  label: string
  relationType?: RelationType
  basis?: EvidenceBasis
  confidence?: Confidence
  explanation?: string
}

export type GraphModel = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}
