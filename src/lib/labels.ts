import type { AuthorityClass, Instrument, RelationType } from '../types'

export const authorityOrder: AuthorityClass[] = [
  'law',
  'treaty',
  'policy-guidance',
  'standard',
  'assurance-standard',
  'framework',
  'testing-tool',
  'research-database',
]

export const authorityLabels: Record<AuthorityClass, string> = {
  'law': 'Laws & regulations',
  'treaty': 'Treaties',
  'policy-guidance': 'Policy & guidance',
  'standard': 'Standards',
  'assurance-standard': 'Assurance standards',
  'framework': 'Frameworks',
  'testing-tool': 'Testing & tools',
  'research-database': 'Research & databases',
}

export type RelationFamily = 'Authority' | 'Alignment' | 'Implementation' | 'Testing and evidence' | 'Evolution'

export const relationFamilyFor = (type: RelationType): RelationFamily => {
  if (['made-under', 'issuer-governed-by', 'requires', 'applies-to', 'interprets', 'co-applies-with'].includes(type)) return 'Authority'
  if (['aligns-with', 'complements', 'maps-to'].includes(type)) return 'Alignment'
  if (['operationalises', 'guides-implementation-of', 'implements', 'profiles'].includes(type)) return 'Implementation'
  if (['provides-testing-for', 'provides-threat-knowledge-for', 'supports-evidence-for', 'evidence-base-for', 'certifies-against', 'provides-assurance-basis-for'].includes(type)) return 'Testing and evidence'
  return 'Evolution'
}

export const relationLabels: Record<RelationType, string> = {
  'made-under': 'Made under',
  'issuer-governed-by': 'APRA’s governing legislation',
  requires: 'Requires',
  operationalises: 'Operationalises',
  'guides-implementation-of': 'Guides implementation of',
  'aligns-with': 'Aligns with',
  extends: 'Extends',
  'provides-testing-for': 'Provides testing for',
  'provides-threat-knowledge-for': 'Provides threat knowledge for',
  'supports-evidence-for': 'Supports evidence for',
  'applies-to': 'Applies to',
  complements: 'Complements',
  interprets: 'Interprets',
  implements: 'Implements',
  profiles: 'Profiles',
  'maps-to': 'Maps to',
  'co-applies-with': 'Co-applies with',
  'evidence-base-for': 'Evidence base for',
  supersedes: 'Supersedes',
  'certifies-against': 'Certifies against',
  'provides-assurance-basis-for': 'Provides an assurance basis for',
}

export const regionOrder: Instrument['region'][] = ['Australia', 'Global', 'Europe', 'United States', 'United Kingdom', 'Singapore', 'Hong Kong', 'Japan', 'Canada']

export const legalRelationLabel = (type: RelationType, outgoing: boolean): string => {
  if (type === 'made-under') return outgoing ? 'Made under' : 'Authorises'
  return outgoing ? 'APRA’s governing legislation' : 'Standard issued by APRA'
}
