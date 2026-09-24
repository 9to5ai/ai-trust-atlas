import type { InstrumentRelation, RelationType } from '../types.js'

/*
 * September 2026 ontology review: every source now has at least one curated
 * source-to-source relationship, and vague "complements" links were retyped
 * where a more specific relationship is supported.
 */
const synthesis = { basis: 'cross-framework-synthesis' as const, confidence: 'medium' as const, sourceAnchors: ['Atlas interpretation'] }

export const ontologyRelations: InstrumentRelation[] = [
  { id: 'nist-agent-rfi-owasp-agentic', sourceId: 'nist-agent-security-responses', targetId: 'owasp-agentic-top-10', type: 'complements', explanation: 'Both catalogue security threats specific to AI agents: NIST from consultation responses, OWASP as a prioritised community list.', ...synthesis },
  { id: 'owasp-acs-agentic-top-10', sourceId: 'owasp-agent-control-standard', targetId: 'owasp-agentic-top-10', type: 'operationalises', explanation: 'The Agent Control Standard turns agentic threats into enforceable runtime policies within the same OWASP project.', ...synthesis },
  { id: 'owasp-crosswalk-llm-top-10', sourceId: 'owasp-genai-crosswalk', targetId: 'owasp-llm-top-10', type: 'maps-to', explanation: 'The OWASP crosswalk maps its GenAI security risks to external security and governance frameworks.', basis: 'explicit', confidence: 'high', sourceAnchors: ['OWASP GenAI Security Industry Framework Crosswalk'] },
  { id: 'nist-ci-profile-rmf', sourceId: 'nist-critical-infrastructure-concept', targetId: 'nist-ai-rmf', type: 'profiles', explanation: 'The concept note proposes an AI RMF profile for trustworthy AI in critical infrastructure.', basis: 'explicit', confidence: 'high', sourceAnchors: ['Concept Note: AI RMF Profile on Trustworthy AI in Critical Infrastructure'] },
  { id: 'asd-agent-actions-harnesses', sourceId: 'asd-unexpected-agent-actions', targetId: 'asd-agentic-harnesses', type: 'complements', explanation: 'ASD’s account of unexpected agent actions illustrates the harness controls its later guidance describes.', ...synthesis },
  { id: 'nist-tevv-athlon-rmf', sourceId: 'nist-tevv-athlon', targetId: 'nist-ai-rmf', type: 'operationalises', explanation: 'The draft TEVV-Athlon method structures testing, evaluation, verification and validation work that supports the AI RMF MEASURE function.', ...synthesis },
  { id: 'nist-documentation-rmf', sourceId: 'nist-public-ai-documentation', targetId: 'nist-ai-rmf', type: 'guides-implementation-of', explanation: 'The draft documentation practices support the transparency and documentation outcomes described in the AI RMF.', ...synthesis },
  { id: 'nist-aite-rmf', sourceId: 'nist-aite', targetId: 'nist-ai-rmf', type: 'provides-testing-for', explanation: 'NIST’s AI test environment supplies evaluation capability that can evidence AI RMF MEASURE outcomes.', ...synthesis },
  { id: 'eu-transparency-guidelines-ai-act', sourceId: 'eu-ai-transparency-guidelines', targetId: 'eu-ai-act', type: 'interprets', explanation: 'The Commission’s guidelines explain how providers and deployers should meet the Article 50 transparency obligations.', basis: 'explicit', confidence: 'high', sourceAnchors: ['Guidelines on transparency obligations, Article 50'] },
  { id: 'edpb-anonymisation-gdpr', sourceId: 'edpb-anonymisation-2026', targetId: 'eu-gdpr', type: 'interprets', explanation: 'The draft EDPB guidelines explain when data is anonymised and therefore outside the GDPR.', basis: 'explicit', confidence: 'high', sourceAnchors: ['EDPB draft guidelines on anonymisation'] },
  { id: 'asd-attacks-frontier-board', sourceId: 'asd-ai-enabled-attacks', targetId: 'asd-frontier-board', type: 'complements', explanation: 'ASD’s view of AI-enabled attacks supplies the threat picture that its board guide asks directors to act on.', ...synthesis },
  { id: 'asd-harnesses-dta-agentic', sourceId: 'asd-agentic-harnesses', targetId: 'dta-agentic-addendum', type: 'complements', explanation: 'Both give Australian agencies practical controls for agentic AI: ASD from a security view, the DTA from a policy view.', ...synthesis },
  { id: 'nsw-aiaf-dta-policy', sourceId: 'nsw-ai-assessment-framework', targetId: 'dta-ai-policy', type: 'complements', explanation: 'State and Commonwealth agencies apply separate but comparable mandatory AI governance policies.', ...synthesis },
  { id: 'acl-review-national-plan', sourceId: 'treasury-ai-acl-review', targetId: 'au-national-ai-plan', type: 'evidence-base-for', explanation: 'The review’s finding that existing consumer law can adapt to AI is consistent with the Plan’s reliance on existing laws.', ...synthesis },
  { id: 'spf-cps234', sourceId: 'au-scams-prevention-framework', targetId: 'apra-cps-234', type: 'co-applies-with', explanation: 'For banks, duties to prevent, detect and disrupt scams sit alongside information-security obligations.', ...synthesis },
  { id: 'naic-iais', sourceId: 'naic-ai-model-bulletin', targetId: 'iais-ai-application-paper', type: 'aligns-with', explanation: 'Both apply existing insurance governance and fair-treatment expectations to insurers’ AI systems.', ...synthesis },
  { id: 'japan-fsa-fsb', sourceId: 'japan-fsa-ai-discussion-paper', targetId: 'fsb-ai-sound-practices', type: 'complements', explanation: 'A national supervisor’s discussion points alongside the FSB’s proposed cross-border sound practices.', ...synthesis },
]

/* More specific relationship types for links previously recorded as "complements". */
export const relationTypeOverrides: Record<string, { type: RelationType; explanation?: string }> = {
  'eu-nist': { type: 'guides-implementation-of' },
  'privacy-apra-ai': { type: 'co-applies-with' },
  'mit-mitigations-nist-playbook': { type: 'maps-to' },
  'far-apra-ai': { type: 'co-applies-with' },
  'frontier-apra-ai': { type: 'guides-implementation-of' },
  'frontier-asic-ai': { type: 'guides-implementation-of' },
  'dora-eu-ai': { type: 'co-applies-with' },
  'mindforge-agentic': { type: 'profiles' },
  'owasp-llm-atlas': { type: 'maps-to' },
  'esma-complements-ai-act': { type: 'co-applies-with' },
}
