import type { AuthorityClass, Instrument, RelationType } from '../types'

export const authorityOrder: AuthorityClass[] = [
  'law',
  'regulatory-expectation',
  'government-guidance',
  'government-policy',
  'international-treaty',
  'financial-sector-guidance',
  'analytical-report',
  'international-standard',
  'risk-framework',
  'control-framework',
  'testing-framework',
  'threat-knowledge',
]

export const authorityLabels: Record<AuthorityClass, string> = {
  law: 'Law',
  'regulatory-expectation': 'Regulatory expectation',
  'government-guidance': 'Government guidance',
  'government-policy': 'Government policy',
  'international-treaty': 'International treaty',
  'international-standard': 'International standard',
  'risk-framework': 'Risk framework',
  'control-framework': 'Control framework',
  'financial-sector-guidance': 'Financial-sector guidance',
  'analytical-report': 'Analytical report',
  'testing-framework': 'Testing framework',
  'threat-knowledge': 'Threat knowledge',
}

export type RelationFamily = 'Authority' | 'Alignment' | 'Implementation' | 'Testing and evidence' | 'Evolution'

export const relationFamilyFor = (type: RelationType): RelationFamily => {
  if (['requires', 'applies-to', 'interprets', 'co-applies-with'].includes(type)) return 'Authority'
  if (['aligns-with', 'complements', 'maps-to'].includes(type)) return 'Alignment'
  if (['operationalises', 'guides-implementation-of', 'implements', 'profiles'].includes(type)) return 'Implementation'
  if (['provides-testing-for', 'provides-threat-knowledge-for', 'supports-evidence-for', 'evidence-base-for'].includes(type)) return 'Testing and evidence'
  return 'Evolution'
}

export const relationLabels: Record<RelationType, string> = {
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
}

export const regionOrder: Instrument['region'][] = ['Australia', 'Global', 'Europe', 'United States', 'United Kingdom', 'Singapore', 'Canada']
