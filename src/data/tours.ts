import type { LayoutMode } from '../lib/graphModel'

/*
 * Guided tours for live demonstrations. Each step drives the real Universe:
 * a selection, a layout and optionally a recorded path to highlight. Narration
 * is Atlas-authored framing, not a summary of any regulator's position.
 */
export type TourStep = {
  title: string
  narration: string
  select?: string
  layout?: LayoutMode
  projection?: 'atlas' | 'list' | 'questions'
  trace?: [string, string]
  dwellMs?: number
}
export type Tour = { id: string; title: string; audience: string; summary: string; minutes: number; steps: TourStep[] }

export const tours: Tour[] = [
  {
    id: 'apra-to-controls',
    title: 'From APRA’s expectations to controls',
    audience: 'Boards and executives in APRA-regulated entities',
    summary: 'Follow a supervisory letter into prudential standards, the concepts they share, the risks in play and candidate controls.',
    minutes: 3,
    steps: [
      { title: 'One universe, every link sourced', narration: 'Each point is a law, standard, guidance source or trust concept. Colours group twelve trust domains; every line records who said it — the source itself, a published crosswalk, or an Atlas interpretation.', layout: 'ontology' },
      { title: 'Start with the supervisor', narration: 'APRA’s 2026 letter on AI sets expectations for regulated entities. Selecting it lights up the concepts it touches and the prudential standards it points back to.', select: 'instrument:apra-ai-letter-2026' },
      { title: 'Into the binding standard', narration: 'CPS 230 is where operational risk, business continuity and service-provider management become enforceable. Its sections fan out around it, each linked to the concepts it engages.', select: 'instrument:apra-cps-230' },
      { title: 'Trace a recorded route', narration: 'The Atlas can walk a recorded path from CPS 230 to a candidate control objective. Every step keeps its own basis, so interpretation is never presented as a regulator’s words.', select: 'instrument:apra-cps-230', trace: ['instrument:apra-cps-230', 'control-objective:third-party-assessment'] },
      { title: 'See the risk side', narration: 'Switch lenses to the MIT AI Risk Repository. Security vulnerabilities and attacks connect back to the same trust concepts — the shared language between risk and requirement.', select: 'risk-subdomain:mit-risk-2-2' },
      { title: 'Land on a control objective', narration: 'ATC-08 frames what a third-party assessment should achieve, with implementation and evidence examples. It is a candidate for your control set, not a claim about any organisation’s controls.', select: 'control-objective:third-party-assessment' },
      { title: 'Take it into the room', narration: 'Every item carries role-specific questions for boards, executives and regulators. Shortlist them into a meeting brief and export it for the next conversation.', projection: 'questions' },
    ],
  },
  {
    id: 'eu-ai-act-reach',
    title: 'The EU AI Act, seen from Australia',
    audience: 'Executives with European customers, products or operations',
    summary: 'See how the Act’s risk-management and oversight duties sit beside ISO/IEC 42001, NIST and Australian guidance.',
    minutes: 2,
    steps: [
      { title: 'A law with extraterritorial reach', narration: 'The EU AI Act can apply to providers and deployers outside the EU when AI systems or their outputs reach the EU market. Selecting it shows the articles modelled in the Atlas.', select: 'instrument:eu-ai-act' },
      { title: 'Human oversight as a shared idea', narration: 'Article 14’s human-oversight duties meet the same concept that guidance and standards use elsewhere. Shared concepts help comparison; they never make instruments equivalent.', select: 'concept:human-oversight' },
      { title: 'The management-system view', narration: 'ISO/IEC 42001 describes an AI management system. The Atlas records its clauses as metadata and original summaries, because the standard’s text is licensed.', select: 'instrument:iso-42001' },
      { title: 'A voluntary framework', narration: 'The NIST AI RMF organises the same territory into Govern, Map, Measure and Manage. Its Playbook suggestions seed many of the Atlas’s candidate controls.', select: 'instrument:nist-ai-rmf' },
      { title: 'From duty to design', narration: 'Human intervention and safe stop is the candidate control objective where oversight becomes an operating capability you can test.', select: 'control-objective:human-intervention-safe-stop' },
    ],
  },
  {
    id: 'agentic-board',
    title: 'What a board should ask about agentic AI',
    audience: 'Directors and audit committees',
    summary: 'From agent authority and runtime guardrails to the questions a board should be able to answer.',
    minutes: 2,
    steps: [
      { title: 'Agents change the risk surface', narration: 'Agentic systems act, not just advise. The Agentic AI domain groups authority, runtime guardrails, tool use and intervention.', select: 'domain:agentic' },
      { title: 'Who authorised this agent?', narration: 'Agent authority and mandate asks what an agent may do, on whose behalf, and with which limits — the first question when something goes wrong.', select: 'concept:agent-authority' },
      { title: 'What government security agencies say', narration: 'Australian Signals Directorate guidance on agentic harnesses describes practical containment patterns for agents using tools and credentials.', select: 'instrument:asd-agentic-harnesses' },
      { title: 'Constraints at runtime', narration: 'ATC-12 frames runtime constraints for agents: permissions, approvals and monitoring that operate while the agent is working, not only before release.', select: 'control-objective:agent-runtime-constraints' },
      { title: 'Questions for the board', narration: 'The Questions workspace turns this into a brief: select the Board audience, add the agentic questions, and export them for the next meeting.', projection: 'questions' },
    ],
  },
  {
    id: 'insurers-and-super',
    title: 'AI for insurers and super funds',
    audience: 'Boards and executives in APRA-regulated insurers and superannuation funds',
    summary: 'From customer outcomes and model risk to prudential standards and the controls that could evidence them.',
    minutes: 3,
    steps: [
      { title: 'Filter to what applies', narration: 'The Atlas records who each source applies to and its legal effect. Filtering to insurers or super funds separates binding prudential standards from supervisory expectations and voluntary guidance.', layout: 'ontology' },
      { title: 'Customer outcomes first', narration: 'Insurance supervisors judge AI by its outcomes for policyholders. The IAIS applies its core principles to AI, with fair treatment, explainability and routes to challenge at the centre.', select: 'instrument:iais-ai-application-paper' },
      { title: 'The binding floor in Australia', narration: 'CPS 230 applies to insurers and super funds alike. Its service-provider and continuity requirements reach AI vendors that support critical operations.', select: 'instrument:apra-cps-230' },
      { title: 'Model risk has moved', narration: 'Model risk management now spans generative AI. Some supervisors place generative and agentic AI outside traditional model guidance, so governance has to be explicit rather than assumed.', select: 'concept:model-risk' },
      { title: 'What would show it works', narration: 'Fairness and human-impact testing is a candidate control objective. It lists the evidence an assessor might ask for, not a claim that any organisation has it.', select: 'control-objective:fairness-rights-testing' },
      { title: 'Prepare the conversation', narration: 'Every item carries questions for boards, executives, regulators and internal audit. Shortlist them into a meeting brief.', projection: 'questions' },
    ],
  },
  {
    id: 'assurance-over-ai',
    title: 'Assurance over AI',
    audience: 'Internal audit, risk and assurance practitioners',
    summary: 'How an engagement moves from criteria to controls to evidence, and what a report can and cannot conclude.',
    minutes: 3,
    steps: [
      { title: 'Start with the question of assurance', narration: 'Independent assurance is a scoped conclusion by a sufficiently independent practitioner. The Atlas separates it from certification, testing tools and management assertions.', select: 'concept:assurance' },
      { title: 'The engagement standard', narration: 'ISAE 3000 (Revised), and ASAE 3000 in Australia, set how assurance engagements on non-financial subject matter are planned, performed and reported, including the need for suitable criteria.', select: 'instrument:isae-3000' },
      { title: 'Assurance on controls', narration: 'ASAE 3150 covers the design, implementation and operating effectiveness of controls against defined objectives — a natural fit for AI control environments.', select: 'instrument:asae-3150' },
      { title: 'Criteria from requirements', narration: 'Requirements recorded against sources show what is expected, of whom and by when. Candidate controls link to them, which helps frame suitable criteria.', select: 'control-objective:records-traceability' },
      { title: 'Certification is different', narration: 'ISO/IEC 42006 sets requirements for bodies that certify AI management systems against ISO/IEC 42001. Certification and assurance answer different questions.', select: 'instrument:iso-42006' },
      { title: 'Questions for the audit committee', narration: 'Switch to Questions and choose Assurance to see what internal auditors and practitioners would ask for each item.', projection: 'questions' },
    ],
  },
]

export const tourById = new Map(tours.map((tour) => [tour.id, tour]))
