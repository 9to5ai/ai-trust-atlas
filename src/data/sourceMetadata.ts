import type { IssuerType, LegalEffect, PriorVersion, SectorId, SourceRecord } from '../types.js'

/*
 * Structured source metadata added in the September 2026 ontology review.
 * Legal effect and issuer type are recorded per source rather than inferred from
 * free text, and sector labels are normalised to one controlled vocabulary.
 */

export const legalEffectLabels: Record<LegalEffect, string> = {
  'binding-law': 'Binding law or regulation',
  'mandatory-policy': 'Mandatory for those it covers (non-legislative)',
  'supervisory-expectation': 'Supervisory expectation',
  voluntary: 'Voluntary',
  informational: 'Informational',
}
export const legalEffectOrder: LegalEffect[] = ['binding-law', 'mandatory-policy', 'supervisory-expectation', 'voluntary', 'informational']

export const issuerTypeLabels: Record<IssuerType, string> = {
  legislature: 'Legislature',
  regulator: 'Regulator or supervisor',
  government: 'Government agency',
  'standard-setter': 'Standard-setting body',
  intergovernmental: 'Intergovernmental organisation',
  'industry-body': 'Industry or open community body',
  'professional-body': 'Professional body',
  research: 'Research institution',
}

export const sectorLabels: Record<SectorId, string> = {
  'cross-sector': 'Cross-sector',
  'financial-services': 'Financial services',
  banking: 'Banking',
  insurance: 'Insurance',
  superannuation: 'Superannuation and pensions',
  'capital-markets': 'Capital markets and investment',
  payments: 'Payments',
  'financial-advice': 'Financial advice',
  credit: 'Credit',
  'public-sector': 'Public sector',
  'technology-providers': 'AI and technology providers',
  'critical-infrastructure': 'Critical infrastructure',
  telecommunications: 'Telecommunications',
  'digital-platforms': 'Digital platforms',
  media: 'Media',
  corporations: 'Companies and directors',
  consumer: 'Consumers',
}
/* Sector filter chips, in display order. Financial-services sub-sectors also match sources tagged "Financial services". */
export const sectorFilterOrder: SectorId[] = ['banking', 'insurance', 'superannuation', 'capital-markets', 'payments', 'public-sector', 'technology-providers']
export const financialSubsectors = new Set<SectorId>(['banking', 'insurance', 'superannuation', 'capital-markets', 'payments', 'financial-advice', 'credit'])

const sectorAliases: Record<string, SectorId> = {
  'cross-sector': 'cross-sector', 'cross-sector reference': 'cross-sector',
  'financial services': 'financial-services', 'retail financial services': 'financial-services',
  banking: 'banking',
  insurance: 'insurance', 'general insurance': 'insurance', 'life insurance': 'insurance', 'private health insurance': 'insurance',
  superannuation: 'superannuation', pensions: 'superannuation',
  'capital markets': 'capital-markets', 'asset management': 'capital-markets', 'investment services': 'capital-markets',
  payments: 'payments', 'financial advice': 'financial-advice', credit: 'credit',
  government: 'public-sector', 'public sector': 'public-sector',
  'ai providers': 'technology-providers', 'cloud services': 'technology-providers', 'software development': 'technology-providers', technology: 'technology-providers',
  'critical infrastructure': 'critical-infrastructure', telecommunications: 'telecommunications', 'digital platforms': 'digital-platforms',
  media: 'media', corporations: 'corporations', consumer: 'consumer', consumers: 'consumer',
}
export function normaliseSectors(labels: string[]): SectorId[] {
  const ids = labels.map((label) => {
    const id = sectorAliases[label.trim().toLowerCase()]
    if (!id) throw new Error(`Unknown sector label "${label}". Add it to sectorAliases in sourceMetadata.ts.`)
    return id
  })
  return [...new Set(ids)]
}

/* Legal effect by source. Every source must appear here; the corpus test enforces it. */
const effect = (ids: string, value: LegalEffect) => ids.split(/\s+/).filter(Boolean).map((id) => [id, value] as const)
export const legalEffectById: Record<string, LegalEffect> = Object.fromEntries([
  ...effect(`au-privacy-act apra-cps-230 apra-cps-234 apra-cps-220 eu-ai-act au-apra-act au-banking-act au-insurance-act au-life-insurance-act au-phips-act au-sis-act
    au-corporations-act au-asic-act au-far-act eu-gdpr eu-dora coe-ai-convention au-scams-prevention-framework`, 'binding-law'),
  ...effect(`dta-ai-policy nsw-ai-assessment-framework isae-3000 asae-3000 asae-3150 isae-3402 iia-gias`, 'mandatory-policy'),
  ...effect(`apra-ai-letter-2026 apra-cpg-230 apra-cpg-234 asic-ai-cyber-letter asic-rg-234 oaic-commercial-ai oaic-genai-training uk-pra-ss1-23 uk-ico-ai-guidance
    osfi-e23 us-sr-26-2 mas-airm-guidelines-cp hkma-genai-consumer-protection sfc-genai-circular eiopa-ai-opinion esma-ai-statement naic-ai-model-bulletin
    eu-ai-transparency-guidelines`, 'supervisory-expectation'),
  ...effect(`nist-ai-rmf nist-genai-profile iso-42001 iso-23894 iso-42005 iso-38507 iso-5338 iso-42006 oecd-ai-principles unesco-ai-ethics singapore-ai-verify
    owasp-agent-control-standard owasp-aisvs nist-aite au-ai-adoption-guidance dta-agentic-addendum dta-ai-technical-standard asd-secure-ai-development asd-ai-supply-chain
    asd-frontier-board asd-unexpected-agent-actions asd-ai-enabled-attacks asd-agentic-harnesses eu-gpai-code mas-feat mas-mindforge imda-agentic-framework csa-aicm-1-1
    nist-ai-rmf-playbook nist-sp-800-218a c2pa-2-4 enisa-ai-cyber-framework uk-aisi-inspect aicpa-soc2-tsc aicd-hti-director-guide`, 'voluntary'),
  ...effect(`nist-agent-security-responses mitre-atlas owasp-genai-crosswalk nist-critical-infrastructure-concept nist-tevv-athlon nist-public-ai-documentation
    edpb-anonymisation-2026 asic-rep-798 uk-ai-white-paper mas-ai-mrm fsb-ai-stability fsb-ai-sound-practices mit-ai-risk-mitigations nist-adversarial-ml
    nist-synthetic-content owasp-llm-top-10 owasp-agentic-top-10 au-national-ai-plan oaic-adm-transparency treasury-ai-acl-review iosco-ai-toolkit
    iais-ai-application-paper fca-mills-review eba-ai-act-mapping boe-fsif-ai japan-fsa-ai-discussion-paper`, 'informational'),
])

/* Issuer type, matched on the issuer name. The first matching rule wins. */
const issuerRules: [RegExp, IssuerType][] = [
  [/Parliament|National Assembly|^European Union$/, 'legislature'],
  [/Institute of Company Directors|Institute of Internal Auditors|AICPA/, 'professional-body'],
  [/ISO and IEC|IAASB|AUASB|International Organization of Securities Commissions|International Association of Insurance Supervisors|Financial Stability Board|Basel Committee/, 'standard-setter'],
  [/OECD|Organisation for Economic Co-operation|UNESCO|Council of Europe|Five Eyes/, 'intergovernmental'],
  [/Prudential Regulation Authority|Securities and Investments Commission|Information Commissioner|Superintendent of Financial Institutions|Monetary Authority|Federal Reserve|Hong Kong Monetary|Securities and Futures Commission|European Insurance|European Banking Authority|European Securities|Financial Conduct Authority|Insurance Commissioners|Financial Services Agency|Bank of England|Data Protection Board|Privacy Commissioner|Reserve Bank|Financial Services Commission/, 'regulator'],
  [/MITRE|MIT AI Risk|University|Research/, 'research'],
  [/OWASP|Cloud Security Alliance|Coalition for Content Provenance|AI Verify Foundation/, 'industry-body'],
  [/.*/, 'government'],
]
export const issuerTypeFor = (issuer: string): IssuerType => issuerRules.find(([pattern]) => pattern.test(issuer))![1]

/* Earlier versions a source replaces when the earlier version is not itself in the corpus. */
export const supersededVersions: Record<string, PriorVersion[]> = {
  'au-ai-adoption-guidance': [{ title: 'Voluntary AI Safety Standard (September 2024)', note: 'The ten guardrails were consolidated into the six essential practices of the Guidance for AI Adoption.', url: 'https://www.industry.gov.au/publications/voluntary-ai-safety-standard' }],
  'us-sr-26-2': [{ title: 'SR 11-7 Guidance on Model Risk Management (2011)', note: 'Superseded and replaced by SR 26-2 on 17 April 2026.' }, { title: 'SR 21-8 (2021)', note: 'Superseded and replaced by SR 26-2 on 17 April 2026.' }],
  'asic-rg-234': [{ title: 'RG 53 The use of past performance in promotional material', note: 'Withdrawn on 9 June 2026; its guidance was consolidated into RG 234.' }],
  'apra-cps-230': [{ title: 'CPS 231 Outsourcing, CPS 232 Business Continuity Management and the equivalent SPS and HPS standards', note: 'Replaced when CPS 230 commenced on 1 July 2025.' }],
}

export function enrichSource(record: SourceRecord) {
  const legalEffect = record.legalEffect ?? legalEffectById[record.id]
  if (!legalEffect) throw new Error(`No legal effect recorded for source "${record.id}". Add it to legalEffectById in sourceMetadata.ts.`)
  return { ...record, legalEffect, issuerType: issuerTypeFor(record.issuer), sectorIds: normaliseSectors(record.sectors), ...(supersededVersions[record.id] ? { supersedes: supersededVersions[record.id] } : {}) }
}

/* Source facet filters. A financial-services sub-sector also matches sources tagged "Financial services" as a whole; cross-sector sources are not included. */
export function matchesSourceFacets(source: { legalEffect: LegalEffect; sectorIds: SectorId[] }, effects: ReadonlySet<LegalEffect>, sectors: ReadonlySet<SectorId>) {
  const effectMatch = effects.size === 0 || effects.has(source.legalEffect)
  const sectorMatch = sectors.size === 0 || source.sectorIds.some((id) => sectors.has(id) || (id === 'financial-services' && [...sectors].some((sector) => financialSubsectors.has(sector))))
  return effectMatch && sectorMatch
}
