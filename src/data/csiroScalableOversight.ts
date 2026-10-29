import type { InstrumentRelation, SourceRecord } from '../types'
import type { RoleQuestions } from './nodeQuestionPrompts'

// Bibliographic metadata and original Atlas prompts only; detailed report reuse is not cleared.
export const csiroOversightSource: SourceRecord = {
  "id": "au-csiro-epistemic-oversight",
  "title": "Epistemic Safety in Scalable Oversight",
  "shortTitle": "CSIRO Scalable Oversight",
  "issuer": "CSIRO",
  "jurisdiction": "Australia - research reference",
  "region": "Australia",
  "authorityClass": "research-database",
  "legalEffect": "informational",
  "authorityNote": "Research reference; not regulatory guidance or an assurance opinion",
  "status": "active",
  "published": "2026-10",
  "publicationTimeline": false,
  "lastVerified": "2026-10-26",
  "editorialStatus": "reviewed",
  "officialUrl": "https://www.csiro.au/en/research/technology-space/ai/Scalable-AI-Oversight",
  "summary": "October 2026 research report by CSIRO, commissioned by the Australian AI Safety Institute.",
  "applicability": "Bibliographic research reference with original Atlas discussion questions. The report cover is dated 8 October 2026; the producer’s page says updated 7 October. Exact release day is unresolved. Selected pages and research limitations were reviewed on 26 October; this is not a complete report, proof, code or benchmark review. It establishes no legal duty, operating effectiveness or assurance conclusion. Copyright CSIRO, 2026; detailed content reuse is not cleared. No adapted report narrative, figures, formulas, statistics or case studies are reproduced. No endorsement is implied.",
  "sectors": [
    "Cross-sector",
    "Financial services"
  ],
  "detailAvailability": "full-public-text",
  "conceptIds": [
    "evaluation",
    "human-oversight",
    "evidence-quality"
  ],
  "provisions": [
    {
      "id": "csiro-oversight-reading",
      "ref": "Sections 6.1 and 6.4",
      "title": "Scalable oversight — reading reference",
      "summary": "Read the original report for its research methods and limitations. Questions and concept links here are Atlas-authored.",
      "sourceUrl": "https://www.csiro.au/-/media/D61/Files/Epistemic_Safety_in_Scalable_Oversight.pdf#page=39",
      "conceptIds": [
        "evaluation",
        "human-oversight",
        "evidence-quality"
      ],
      "granularity": "section",
      "editorialStatus": "reviewed",
      "reviewedAt": "2026-10-26",
      "note": "Bibliographic reading locator only. Report content and detailed methods are not adapted. Questions and concept links are Atlas interpretations, not source-authored crosswalks or evidence of effective oversight."
    }
  ]
}

export const csiroOversightSourceQuestions: RoleQuestions = {
  "board": "Would we make the same decision if the same verified facts were presented with a different emphasis?",
  "executive": "Which parts of the reviewer’s evidence can be checked without relying on the AI-generated summary?",
  "regulator": "How does the firm test whether accurate information is presented in a way that serves an undisclosed objective?",
  "assurance": "Can we separate factual correctness from the effect that presentation has on a reviewer’s judgement?"
}

export const csiroOversightReadingQuestions: RoleQuestions = {
  "board": "Who decides which effects on customer understanding are acceptable for this AI service?",
  "executive": "Do repeated interactions change what customers believe beyond the purpose they authorised?",
  "regulator": "What evidence distinguishes an illustrative financial scenario from an effect measured in deployed services?",
  "assurance": "Does the evaluation result depend on access or training control that the real threat actor would not have?"
}

export const enisaLayerQuestions: RoleQuestions = {
  "board": "Which layer of the AI service has no demonstrated security owner: its host, its AI components or its sector-specific workflow?",
  "executive": "Where have AI security tests omitted a dependency in the surrounding infrastructure?",
  "regulator": "Can the entity distinguish its general cyber controls from the additional controls selected for this AI use?",
  "assurance": "What evidence connects tests of individual AI components with the security of the service around them?"
}

export const csiroTuringRelation: InstrumentRelation = {
  "id": "csiro-turing-evaluation-context",
  "sourceId": "au-csiro-epistemic-oversight",
  "targetId": "uk-turing-agentic-assurance",
  "type": "aligns-with",
  "explanation": "Atlas thematic link: both are research references for evaluation discussions; research scope, provenance and rights remain distinct. No equivalent methods or obligations inferred.",
  "basis": "cross-framework-synthesis",
  "confidence": "medium",
  "sourceAnchors": [
    "CSIRO report title and research scope",
    "Turing report title and research scope",
    "Atlas thematic interpretation only"
  ],
  "citations": [
    {
      "sourceTitle": "Epistemic Safety in Scalable Oversight",
      "url": "https://www.csiro.au/en/research/technology-space/ai/Scalable-AI-Oversight",
      "locator": "Bibliographic title and research scope",
      "accessedAt": "2026-10-26"
    },
    {
      "sourceTitle": "Evaluation for Assurance of Agentic AI Systems in Financial Services",
      "url": "https://www.turing.ac.uk/news/publications/evaluation-assurance-agentic-ai-systems-financial-services",
      "locator": "Previously admitted bibliographic reference; no new detailed report review claimed",
      "accessedAt": "2026-10-24"
    }
  ]
}
