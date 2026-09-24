import type { SourceRecord } from '../types.js'

/*
 * September 2026 ontology review: source-level mappings for the concepts added to
 * the model, and a stricter rule for "accountability", which had become a catch-all.
 * These are Atlas interpretations at source level; section-level mappings remain
 * in each source's provisions.
 */
export const conceptAdditions: Record<string, string[]> = {
  // Model risk management
  'us-sr-26-2': ['model-risk'],
  'uk-pra-ss1-23': ['model-risk', 'senior-accountability'],
  'osfi-e23': ['model-risk'],
  'mas-ai-mrm': ['model-risk'],
  'mas-airm-guidelines-cp': ['model-risk', 'senior-accountability', 'ai-policy-appetite', 'use-case-intake'],
  'iosco-ai-toolkit': ['model-risk'],
  'eiopa-ai-opinion': ['model-risk', 'consumer-outcomes'],
  // Senior accountability and board duties
  'au-far-act': ['senior-accountability'],
  'apra-ai-letter-2026': ['senior-accountability'],
  'apra-cps-220': ['senior-accountability', 'ai-policy-appetite'],
  'au-corporations-act': ['senior-accountability'],
  'aicd-hti-director-guide': ['senior-accountability', 'ai-policy-appetite', 'workforce-impact'],
  'asd-frontier-board': ['senior-accountability'],
  'iso-38507': ['senior-accountability', 'ai-policy-appetite'],
  'sfc-genai-circular': ['senior-accountability', 'consumer-outcomes'],
  // AI policy, risk appetite and intake
  'au-ai-adoption-guidance': ['ai-policy-appetite', 'use-case-intake'],
  'iso-42001': ['ai-policy-appetite'],
  'nist-ai-rmf': ['ai-policy-appetite'],
  'dta-ai-policy': ['ai-policy-appetite', 'use-case-intake'],
  'nsw-ai-assessment-framework': ['use-case-intake'],
  // Intellectual property
  'eu-gpai-code': ['intellectual-property', 'content-safety', 'environmental-impact'],
  'eu-ai-act': ['intellectual-property', 'content-authenticity'],
  'nist-genai-profile': ['intellectual-property', 'content-authenticity', 'content-safety', 'environmental-impact'],
  // Content authenticity
  'c2pa-2-4': ['content-authenticity'],
  'nist-synthetic-content': ['content-authenticity'],
  'eu-ai-transparency-guidelines': ['content-authenticity'],
  'au-scams-prevention-framework': ['content-authenticity', 'consumer-outcomes'],
  // Consumer outcomes
  'asic-rg-234': ['consumer-outcomes'],
  'fca-mills-review': ['consumer-outcomes'],
  'iais-ai-application-paper': ['consumer-outcomes'],
  'esma-ai-statement': ['consumer-outcomes'],
  'hkma-genai-consumer-protection': ['consumer-outcomes'],
  'mas-feat': ['consumer-outcomes'],
  'naic-ai-model-bulletin': ['consumer-outcomes'],
  'treasury-ai-acl-review': ['consumer-outcomes'],
  'asic-rep-798': ['consumer-outcomes'],
  'au-asic-act': ['consumer-outcomes'],
  // Content safety
  'uk-aisi-inspect': ['content-safety'],
  'singapore-ai-verify': ['content-safety'],
  // Secure AI development
  'asd-secure-ai-development': ['secure-development'],
  'nist-sp-800-218a': ['secure-development'],
  'owasp-aisvs': ['secure-development'],
  'enisa-ai-cyber-framework': ['secure-development'],
  'csa-aicm-1-1': ['secure-development'],
  'iso-5338': ['secure-development'],
  // Workforce and environmental impact
  'oecd-ai-principles': ['workforce-impact', 'environmental-impact'],
  'unesco-ai-ethics': ['workforce-impact', 'environmental-impact'],
  'au-national-ai-plan': ['workforce-impact'],
}

/*
 * "Accountability" now needs section-level support: a source keeps the
 * source-level link only if at least one of its sections maps to it.
 */
export function applyConceptModel(record: SourceRecord): SourceRecord {
  const sectionConcepts = new Set(record.provisions.flatMap((provision) => provision.conceptIds))
  const conceptIds = record.conceptIds.filter((id) => id !== 'accountability' || sectionConcepts.has('accountability'))
  for (const id of conceptAdditions[record.id] ?? []) if (!conceptIds.includes(id)) conceptIds.push(id)
  return { ...record, conceptIds }
}
