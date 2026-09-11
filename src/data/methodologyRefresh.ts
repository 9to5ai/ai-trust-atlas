import type { Instrument } from '../types.js'
import type { Development } from './developments.js'
// Individually verified changes. Full monitoring coverage is recorded separately.
export const methodologySources: Instrument[] = [
  {
    "id": "nist-agent-security-responses",
    "title": "Security Considerations for AI Agents: Summary Analysis of RFI Responses",
    "shortTitle": "NIST Agent Security Findings",
    "issuer": "National Institute of Standards and Technology",
    "jurisdiction": "United States",
    "region": "United States",
    "authorityClass": "research-database",
    "authorityNote": "Research synthesis of consultation responses; not a binding standard or independent effectiveness test.",
    "status": "active",
    "published": "2026-05-18",
    "lastVerified": "2026-09-10",
    "officialUrl": "https://www.nist.gov/publications/summary-analysis-responses-request-information-regarding-security-considerations-ai",
    "summary": "Summarises consultation responses on AI agent threats, adaptations to cybersecurity practices and proposed roles for government.",
    "applicability": "Official abstract reviewed. Findings describe consultation responses, not a representative survey or validation of individual mitigations.",
    "sectors": [
      "Cross-sector"
    ],
    "conceptIds": [
      "agent-authority",
      "ai-security",
      "runtime-guardrails",
      "evaluation"
    ],
    "detailAvailability": "public-summary",
    "provisions": [
      {
        "id": "nist-agent-security-responses-overview",
        "ref": "Official overview",
        "title": "NIST Agent Security Findings",
        "summary": "Summarises consultation responses on AI agent threats, adaptations to cybersecurity practices and proposed roles for government.",
        "conceptIds": [
          "agent-authority",
          "ai-security",
          "runtime-guardrails",
          "evaluation"
        ],
        "sourceUrl": "https://www.nist.gov/publications/summary-analysis-responses-request-information-regarding-security-considerations-ai",
        "reviewedAt": "2026-09-10",
        "note": "Original synopsis of the official overview. Detailed report content and control effectiveness have not been assessed."
      }
    ]
  },
  {
    "id": "oaic-commercial-ai",
    "title": "Guidance on privacy and the use of commercially available AI products",
    "shortTitle": "OAIC Commercial AI Privacy",
    "issuer": "Office of the Australian Information Commissioner",
    "jurisdiction": "Australia",
    "region": "Australia",
    "authorityClass": "policy-guidance",
    "authorityNote": "Regulator guidance; read alongside the Privacy Act and its scope.",
    "status": "active",
    "published": "2024-10-21",
    "lastVerified": "2026-09-10",
    "officialUrl": "https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/guidance-on-privacy-and-the-use-of-commercially-available-ai-products",
    "summary": "Explains privacy considerations when choosing and using AI products, including personal information in inputs and outputs, due diligence, notices and human oversight.",
    "applicability": "Official takeaways and quick reference reviewed; updated 17 January 2025. Read with the Privacy Act and APP guidelines. This summary is not a full review of every guidance section.",
    "sectors": [
      "Cross-sector"
    ],
    "conceptIds": [
      "privacy",
      "data-governance",
      "third-party-risk",
      "human-oversight",
      "transparency-disclosure"
    ],
    "detailAvailability": "public-summary",
    "provisions": [
      {
        "id": "oaic-commercial-ai-overview",
        "ref": "Official overview",
        "title": "OAIC Commercial AI Privacy",
        "summary": "Explains privacy considerations when choosing and using AI products, including personal information in inputs and outputs, due diligence, notices and human oversight.",
        "conceptIds": [
          "privacy",
          "data-governance",
          "third-party-risk",
          "human-oversight",
          "transparency-disclosure"
        ],
        "sourceUrl": "https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/guidance-on-privacy-and-the-use-of-commercially-available-ai-products",
        "reviewedAt": "2026-09-10",
        "note": "Original synopsis of the official overview. Detailed report content and control effectiveness have not been assessed."
      }
    ]
  }
]
export const methodologyDevelopments: Development[] = [
  {
    "id": "apra-super-ceo-september",
    "published": "2026-09-01",
    "reviewed": "2026-09-10",
    "added": "2026-09-10",
    "status": "Supervisory discussion",
    "issuer": "APRA and ASIC",
    "title": "Superannuation CEOs focus on crisis exercises and shared dependencies",
    "summary": "Published notes from June roundtables connect frontier AI with board capability, supplier concentration and preparation for concurrent disruptions.",
    "implication": "Use crisis exercises to test escalation, delegation and supplier dependencies together. Discussion findings do not introduce a new prudential standard.",
    "question": "Would our crisis exercise expose unclear authority and shared supplier failures at the same time?",
    "topics": [
      "governance",
      "resilience",
      "third-party"
    ],
    "sourceId": "apra-cps-230",
    "backgroundSourceId": "apra-asic-frontier-roundtables-2026",
    "url": "https://www.apra.gov.au/news-and-publications/apra-and-asic-host-superannuation-ceo-roundtables-june-2026"
  },
  {
    "id": "nist-agent-security-findings",
    "published": "2026-05-18",
    "reviewed": "2026-09-10",
    "added": "2026-09-10",
    "status": "Research findings",
    "issuer": "National Institute of Standards and Technology",
    "title": "NIST gathers evidence on security gaps in AI agents",
    "summary": "NIST summarises responses identifying agent security threats and the need to adapt established cybersecurity practices.",
    "implication": "Ask which agent behaviours existing security controls fail to constrain. Stakeholder agreement is a research lead, not proof that a proposed safeguard works.",
    "question": "Which agent-specific threats have we tested beyond our usual application security checks?",
    "topics": [
      "agentic",
      "security",
      "testing"
    ],
    "sourceId": "nist-agent-security-responses",
    "url": "https://www.nist.gov/publications/summary-analysis-responses-request-information-regarding-security-considerations-ai"
  }
]
export const methodologyCorrections: Record<string, Partial<Instrument>> = {
  "nist-critical-infrastructure-concept": {
    "published": "2026-04-06"
  },
  "uk-ai-white-paper": {
    "summary": "A 2023 policy paper proposing five cross-sector principles and a non-statutory approach through existing UK regulators.",
    "authorityNote": "Historical policy proposal; not a statement of the complete current UK regulatory position.",
    "effective": "Paper updated 2023-08-03"
  },
  "uk-ico-ai-guidance": {
    "authorityNote": "Regulator guidance under review following the Data (Use and Access) Act; check current ICO updates.",
    "summary": "Explains AI and UK data protection. The ICO flags this guidance as under review following legislative changes."
  }
}
