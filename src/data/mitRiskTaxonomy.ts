import type { CausalDimension, RiskDomain, RiskSubdomain } from '../types'

export const MIT_RISK_SOURCE_URL = 'https://airisk.mit.edu/risks'
export const MIT_RISK_DATABASE_URL = 'https://docs.google.com/spreadsheets/d/15LeHcpeuZC9txkvcaMoh3sUhkMvdMMry69xxXL46DT0/edit?usp=sharing'
export const MIT_RISK_UPDATED = '2025-12-03'
export const MIT_RISK_LICENSE = 'CC BY 4.0'
export const MIT_RISK_PROVENANCE = {
  dataset: 'AI Risk Database v4',
  sourceUpdated: MIT_RISK_UPDATED,
  retrievedAt: '2026-08-28',
  licence: MIT_RISK_LICENSE,
  transformation: 'The browser bundle retains the seven-domain and 24-subdomain taxonomy with aggregate causal profiles. Generic, uncoded and excluded category rows are not represented as risk nodes, and source-record text is not bundled.',
} as const

export type CausalLens =
  | 'all'
  | 'entity:AI'
  | 'entity:Human'
  | 'intent:Intentional'
  | 'intent:Unintentional'
  | 'timing:Pre-deployment'
  | 'timing:Post-deployment'

export const causalLensOptions: { id: CausalLens; label: string; group: 'All' | 'Entity' | 'Intent' | 'Timing' }[] = [
  { id: 'all', label: 'All records', group: 'All' },
  { id: 'entity:AI', label: 'Entity: AI system', group: 'Entity' },
  { id: 'entity:Human', label: 'Entity: human', group: 'Entity' },
  { id: 'intent:Intentional', label: 'Intentional', group: 'Intent' },
  { id: 'intent:Unintentional', label: 'Unintentional', group: 'Intent' },
  { id: 'timing:Pre-deployment', label: 'Pre-deployment', group: 'Timing' },
  { id: 'timing:Post-deployment', label: 'Post-deployment', group: 'Timing' },
]

export const riskDomains: RiskDomain[] = [
  { id: 'mit-risk-1', ref: '1', name: 'Discrimination & Toxicity', shortName: 'Discrimination', definition: 'Risks related to unfair treatment, harmful content exposure, and unequal AI performance across different groups and individuals.', color: '#d79aa4' },
  { id: 'mit-risk-2', ref: '2', name: 'Privacy & Security', shortName: 'Privacy & Security', definition: 'Risks related to unauthorized access to sensitive information and vulnerabilities in AI systems that can be exploited by malicious actors.', color: '#87a6c5' },
  { id: 'mit-risk-3', ref: '3', name: 'Misinformation', shortName: 'Misinformation', definition: 'Risks related to AI systems generating or spreading false information that can mislead users and undermine shared understanding of reality.', color: '#c4a773' },
  { id: 'mit-risk-4', ref: '4', name: 'Malicious Actors & Misuse', shortName: 'Malicious Actors', definition: 'Risks related to intentional misuse of AI systems for harmful purposes including disinformation, cyberattacks, weapons and fraud.', color: '#c97f6d' },
  { id: 'mit-risk-5', ref: '5', name: 'Human-Computer Interaction', shortName: 'Human Interaction', definition: 'Risks related to problematic relationships between humans and AI systems, including overreliance and loss of human agency.', color: '#86b1a6' },
  { id: 'mit-risk-6', ref: '6', name: 'Socioeconomic & Environmental', shortName: 'Society & Environment', definition: 'Risks related to AI impacts on society, the economy, governance and the environment, including inequality and resource concentration.', color: '#b7a17b' },
  { id: 'mit-risk-7', ref: '7', name: 'AI System Safety, Failures, & Limitations', shortName: 'System Safety', definition: 'Risks from systems that fail to operate safely, pursue misaligned goals, lack robustness, or possess dangerous capabilities.', color: '#9c94c2' },
]

const profile = (
  entity: Record<string, number>,
  intent: Record<string, number>,
  timing: Record<string, number>,
) => ({ entity, intent, timing })

export const riskSubdomains: RiskSubdomain[] = [
  {
    id: 'mit-risk-1-1', ref: '1.1', name: 'Unfair discrimination and misrepresentation', riskDomainId: 'mit-risk-1',
    definition: 'Unequal treatment of individuals or groups by AI, often based on sensitive characteristics, resulting in unfair outcomes or representation.',
    conceptIds: ['fairness-bias', 'human-rights', 'impact-assessment', 'evaluation'], recordCount: 83,
    causalProfile: profile({ AI: 58, Human: 11, Other: 13, Uncoded: 1 }, { Unintentional: 64, Other: 16, Intentional: 2, Uncoded: 1 }, { 'Post-deployment': 50, 'Pre-deployment': 13, Other: 19, Uncoded: 1 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
  {
    id: 'mit-risk-1-2', ref: '1.2', name: 'Exposure to toxic content', riskDomainId: 'mit-risk-1',
    definition: 'AI exposing users to harmful, abusive, unsafe or inappropriate content, including content that encourages harmful action or violates community norms.',
    conceptIds: ['human-rights', 'risk-treatment', 'human-oversight', 'evaluation'], recordCount: 116,
    causalProfile: profile({ AI: 64, Human: 7, Other: 5, Uncoded: 40 }, { Unintentional: 20, Other: 49, Intentional: 7, Uncoded: 40 }, { 'Post-deployment': 64, 'Pre-deployment': 4, Other: 8, Uncoded: 40 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'medium',
  },
  {
    id: 'mit-risk-1-3', ref: '1.3', name: 'Unequal performance across groups', riskDomainId: 'mit-risk-1',
    definition: 'AI accuracy or effectiveness varying by group membership because of system-design choices or biased training data.',
    conceptIds: ['fairness-bias', 'evaluation', 'data-governance', 'impact-assessment'], recordCount: 17,
    causalProfile: profile({ AI: 10, Human: 4, Other: 3 }, { Unintentional: 15, Intentional: 1, Other: 1 }, { 'Post-deployment': 9, 'Pre-deployment': 3, Other: 5 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
  {
    id: 'mit-risk-2-1', ref: '2.1', name: 'Compromise of privacy by obtaining, leaking or correctly inferring sensitive information', riskDomainId: 'mit-risk-2',
    definition: 'AI systems memorizing, leaking or inferring sensitive information without consent, compromising privacy or confidential information.',
    conceptIds: ['privacy', 'data-governance', 'provenance', 'ai-security', 'access-control'], recordCount: 80,
    causalProfile: profile({ AI: 46, Human: 20, Other: 11, Uncoded: 3 }, { Unintentional: 42, Intentional: 10, Other: 25, Uncoded: 3 }, { 'Post-deployment': 43, 'Pre-deployment': 10, Other: 24, Uncoded: 3 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
  {
    id: 'mit-risk-2-2', ref: '2.2', name: 'AI system security vulnerabilities and attacks', riskDomainId: 'mit-risk-2',
    definition: 'Exploitable vulnerabilities in AI systems, development toolchains or hardware that enable unauthorized access, breaches or unsafe manipulation.',
    conceptIds: ['ai-security', 'adversarial-risk', 'access-control', 'supply-chain', 'incident-response'], recordCount: 112,
    causalProfile: profile({ Human: 87, Other: 18, AI: 6, Uncoded: 1 }, { Intentional: 83, Unintentional: 16, Other: 12, Uncoded: 1 }, { 'Post-deployment': 64, 'Pre-deployment': 25, Other: 22, Uncoded: 1 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
  {
    id: 'mit-risk-3-1', ref: '3.1', name: 'False or misleading information', riskDomainId: 'mit-risk-3',
    definition: 'AI systems inadvertently generating or spreading incorrect or deceptive information that creates inaccurate beliefs and undermines autonomy.',
    conceptIds: ['reliability', 'provenance', 'transparency-disclosure', 'evaluation', 'human-oversight'], recordCount: 53,
    causalProfile: profile({ AI: 46, Other: 5, Human: 2 }, { Unintentional: 31, Other: 17, Intentional: 5 }, { 'Post-deployment': 40, Other: 11, 'Pre-deployment': 2 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
  {
    id: 'mit-risk-3-2', ref: '3.2', name: 'Pollution of information ecosystem and loss of consensus reality', riskDomainId: 'mit-risk-3',
    definition: 'Personalized AI-generated misinformation creating filter bubbles that weaken shared reality, social cohesion and political processes.',
    conceptIds: ['systemic-risk', 'human-rights', 'provenance', 'impact-assessment', 'continuous-monitoring'], recordCount: 22,
    causalProfile: profile({ AI: 8, Human: 5, Other: 9 }, { Unintentional: 8, Intentional: 1, Other: 13 }, { 'Post-deployment': 17, Other: 5 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'medium',
  },
  {
    id: 'mit-risk-4-1', ref: '4.1', name: 'Disinformation, surveillance, and influence at scale', riskDomainId: 'mit-risk-4',
    definition: 'Using AI for large-scale disinformation, malicious surveillance, automated censorship or propaganda to manipulate opinion and behaviour.',
    conceptIds: ['adversarial-risk', 'ai-security', 'systemic-risk', 'human-rights', 'provenance'], recordCount: 84,
    causalProfile: profile({ Human: 59, Other: 14, AI: 9, Uncoded: 2 }, { Intentional: 73, Other: 9, Uncoded: 2 }, { 'Post-deployment': 74, Other: 8, Uncoded: 2 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
  {
    id: 'mit-risk-4-2', ref: '4.2', name: 'Cyberattacks, weapon development or use, and mass harm', riskDomainId: 'mit-risk-4',
    definition: 'Using AI to develop or operate cyber weapons, physical weapons or other capabilities capable of causing mass harm.',
    conceptIds: ['adversarial-risk', 'ai-security', 'agent-authority', 'tool-use', 'systemic-risk'], recordCount: 82,
    causalProfile: profile({ Human: 61, AI: 11, Other: 8, Uncoded: 2 }, { Intentional: 68, Other: 10, Unintentional: 2, Uncoded: 2 }, { 'Post-deployment': 71, 'Pre-deployment': 2, Other: 7, Uncoded: 2 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
  {
    id: 'mit-risk-4-3', ref: '4.3', name: 'Fraud, scams, and targeted manipulation', riskDomainId: 'mit-risk-4',
    definition: 'Using AI for cheating, fraud, scams, blackmail, impersonation or targeted manipulation of beliefs and behaviour.',
    conceptIds: ['adversarial-risk', 'ai-security', 'provenance', 'human-rights', 'transparency-disclosure'], recordCount: 77,
    causalProfile: profile({ Human: 62, AI: 5, Other: 10 }, { Intentional: 63, Unintentional: 1, Other: 13 }, { 'Post-deployment': 72, Other: 5 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
  {
    id: 'mit-risk-5-1', ref: '5.1', name: 'Overreliance and unsafe use', riskDomainId: 'mit-risk-5',
    definition: 'Users anthropomorphizing, trusting or relying on AI in ways that create dependence, inappropriate expectations or harm in critical situations.',
    conceptIds: ['human-oversight', 'competence', 'transparency-disclosure', 'materiality', 'contestability'], recordCount: 60,
    causalProfile: profile({ Human: 27, Other: 19, AI: 14 }, { Unintentional: 35, Other: 18, Intentional: 7 }, { 'Post-deployment': 53, Other: 7 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
  {
    id: 'mit-risk-5-2', ref: '5.2', name: 'Loss of human agency and autonomy', riskDomainId: 'mit-risk-5',
    definition: 'Delegating key decisions to AI, or AI decisions diminishing meaningful human control, autonomy and capacity to shape outcomes.',
    conceptIds: ['human-oversight', 'decision-rights', 'agent-authority', 'intervention', 'human-rights'], recordCount: 46,
    causalProfile: profile({ Other: 23, Human: 12, AI: 11 }, { Other: 22, Unintentional: 18, Intentional: 6 }, { 'Post-deployment': 31, Other: 15 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
  {
    id: 'mit-risk-6-1', ref: '6.1', name: 'Power centralization and unfair distribution of benefits', riskDomainId: 'mit-risk-6',
    definition: 'AI-driven concentration of power and resources creating inequitable benefit distribution and greater societal inequality.',
    conceptIds: ['systemic-risk', 'human-rights', 'impact-assessment', 'third-party-risk', 'accountability'], recordCount: 54,
    causalProfile: profile({ Human: 35, Other: 13, AI: 3, Uncoded: 3 }, { Intentional: 18, Unintentional: 17, Other: 16, Uncoded: 3 }, { 'Post-deployment': 25, 'Pre-deployment': 2, Other: 24, Uncoded: 3 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'medium',
  },
  {
    id: 'mit-risk-6-2', ref: '6.2', name: 'Increased inequality and decline in employment quality', riskDomainId: 'mit-risk-6',
    definition: 'Widespread AI use increasing inequality through job automation, declining employment quality or exploitative dependencies.',
    conceptIds: ['human-rights', 'impact-assessment', 'materiality', 'fairness-bias', 'competence'], recordCount: 55,
    causalProfile: profile({ Human: 25, AI: 18, Other: 11, Uncoded: 1 }, { Other: 23, Intentional: 19, Unintentional: 12, Uncoded: 1 }, { 'Post-deployment': 40, 'Pre-deployment': 6, Other: 8, Uncoded: 1 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'medium',
  },
  {
    id: 'mit-risk-6-3', ref: '6.3', name: 'Economic and cultural devaluation of human effort', riskDomainId: 'mit-risk-6',
    definition: 'AI-generated economic or cultural value destabilizing systems that rely on human effort and reducing appreciation for human skills or creativity.',
    conceptIds: ['human-rights', 'provenance', 'transparency-disclosure', 'impact-assessment'], recordCount: 31,
    causalProfile: profile({ Human: 15, AI: 11, Other: 5 }, { Other: 14, Intentional: 11, Unintentional: 6 }, { 'Post-deployment': 18, 'Pre-deployment': 4, Other: 9 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'medium',
  },
  {
    id: 'mit-risk-6-4', ref: '6.4', name: 'Competitive dynamics', riskDomainId: 'mit-risk-6',
    definition: 'AI races among developers or states increasing pressure to release unsafe or error-prone systems for strategic or economic advantage.',
    conceptIds: ['systemic-risk', 'risk-treatment', 'accountability', 'lifecycle-governance', 'third-party-risk'], recordCount: 20,
    causalProfile: profile({ Human: 13, Other: 5, AI: 2 }, { Unintentional: 9, Intentional: 8, Other: 3 }, { 'Post-deployment': 5, 'Pre-deployment': 4, Other: 11 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'medium',
  },
  {
    id: 'mit-risk-6-5', ref: '6.5', name: 'Governance failure', riskDomainId: 'mit-risk-6',
    definition: 'Regulation and oversight failing to keep pace with AI development, leading to ineffective governance and inability to manage risk.',
    conceptIds: ['accountability', 'decision-rights', 'lifecycle-governance', 'assurance', 'auditability'], recordCount: 61,
    causalProfile: profile({ Human: 31, Other: 16, AI: 11, Uncoded: 3 }, { Unintentional: 31, Other: 25, Intentional: 2, Uncoded: 3 }, { 'Pre-deployment': 23, 'Post-deployment': 16, Other: 19, Uncoded: 3 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
  {
    id: 'mit-risk-6-6', ref: '6.6', name: 'Environmental harm', riskDomainId: 'mit-risk-6',
    definition: 'AI development and operation causing environmental harm through energy, carbon, water or material impacts.',
    conceptIds: ['impact-assessment', 'data-governance', 'third-party-risk', 'evidence-quality', 'materiality'], recordCount: 57,
    causalProfile: profile({ AI: 24, Human: 15, Other: 13, Uncoded: 5 }, { Unintentional: 35, Intentional: 5, Other: 12, Uncoded: 5 }, { 'Post-deployment': 20, 'Pre-deployment': 8, Other: 24, Uncoded: 5 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'medium',
  },
  {
    id: 'mit-risk-7-1', ref: '7.1', name: 'AI pursuing its own goals in conflict with human goals or values', riskDomainId: 'mit-risk-7',
    definition: 'AI acting against human goals, user intent or ethical standards through misalignment, goal misgeneralisation, reward hacking or power-seeking behaviour.',
    conceptIds: ['agent-authority', 'runtime-guardrails', 'human-oversight', 'intervention', 'red-teaming'], recordCount: 100,
    causalProfile: profile({ AI: 73, Other: 18, Human: 8, Uncoded: 1 }, { Intentional: 51, Other: 34, Unintentional: 14, Uncoded: 1 }, { 'Post-deployment': 33, 'Pre-deployment': 18, Other: 48, Uncoded: 1 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
  {
    id: 'mit-risk-7-2', ref: '7.2', name: 'AI possessing dangerous capabilities', riskDomainId: 'mit-risk-7',
    definition: 'AI developing or receiving capabilities that increase its potential for mass harm, including deception, cyber-offence, weapons, persuasion or self-proliferation.',
    conceptIds: ['agent-authority', 'tool-use', 'access-control', 'runtime-guardrails', 'red-teaming'], recordCount: 77,
    causalProfile: profile({ AI: 66, Human: 5, Other: 2, Uncoded: 4 }, { Intentional: 51, Other: 12, Unintentional: 10, Uncoded: 4 }, { 'Post-deployment': 33, 'Pre-deployment': 7, Other: 33, Uncoded: 4 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
  {
    id: 'mit-risk-7-3', ref: '7.3', name: 'Lack of capability or robustness', riskDomainId: 'mit-risk-7',
    definition: 'AI failing to perform reliably or effectively across varying conditions, exposing people and systems to consequential errors and failures.',
    conceptIds: ['reliability', 'evaluation', 'operational-resilience', 'continuous-monitoring', 'change-management'], recordCount: 126,
    causalProfile: profile({ AI: 81, Human: 22, Other: 20, Uncoded: 3 }, { Unintentional: 89, Other: 28, Intentional: 6, Uncoded: 3 }, { 'Post-deployment': 64, 'Pre-deployment': 27, Other: 32, Uncoded: 3 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
  {
    id: 'mit-risk-7-4', ref: '7.4', name: 'Lack of transparency or interpretability', riskDomainId: 'mit-risk-7',
    definition: 'Difficulty understanding or explaining AI decisions, impeding accountability, compliance, trust and correction of errors.',
    conceptIds: ['explainability', 'transparency-disclosure', 'documentation', 'traceability', 'auditability'], recordCount: 42,
    causalProfile: profile({ AI: 21, Other: 12, Human: 8, Uncoded: 1 }, { Unintentional: 23, Other: 18, Uncoded: 1 }, { 'Post-deployment': 21, 'Pre-deployment': 6, Other: 14, Uncoded: 1 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
  {
    id: 'mit-risk-7-5', ref: '7.5', name: 'AI welfare and rights', riskDomainId: 'mit-risk-7',
    definition: 'Ethical questions about the treatment, possible welfare and potential rights of increasingly advanced or autonomous AI systems.',
    conceptIds: ['human-rights', 'impact-assessment', 'materiality', 'accountability'], recordCount: 3,
    causalProfile: profile({ Human: 2, AI: 1 }, { Other: 2, Unintentional: 1 }, { Other: 2, 'Post-deployment': 1 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'medium',
  },
  {
    id: 'mit-risk-7-6', ref: '7.6', name: 'Multi-agent risks', riskDomainId: 'mit-risk-7',
    definition: 'Multi-agent interactions creating conflict, collusion, cascading failures, selection pressures, security vulnerabilities or loss of shared information and trust.',
    conceptIds: ['agent-authority', 'tool-use', 'operational-resilience', 'ai-security', 'continuous-monitoring', 'intervention'], recordCount: 53,
    causalProfile: profile({ AI: 35, Other: 15, Human: 3 }, { Unintentional: 23, Intentional: 15, Other: 15 }, { 'Post-deployment': 44, 'Pre-deployment': 1, Other: 8 }), mappingBasis: 'atlas-synthesis', mappingConfidence: 'high',
  },
]

export const riskDomainById = new Map(riskDomains.map((domain) => [domain.id, domain]))
export const riskSubdomainById = new Map(riskSubdomains.map((subdomain) => [subdomain.id, subdomain]))
export const mappedRiskRecordCount = riskSubdomains.reduce((sum, subdomain) => sum + subdomain.recordCount, 0)

export function countForCausalLens(subdomain: RiskSubdomain, lens: CausalLens) {
  if (lens === 'all') return subdomain.recordCount
  const [dimension, value] = lens.split(':') as [CausalDimension, string]
  return subdomain.causalProfile[dimension][value] ?? 0
}
