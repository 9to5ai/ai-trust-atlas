import { makeInstrument } from './makeInstrument.js'
export const octoberSources = [makeInstrument({
  "id": "nist-agent-identity-comments",
  "title": "Software and AI Agent Identity and Authorization: Summary of Comments",
  "shortTitle": "NIST Agent Identity Comments",
  "issuer": "National Institute of Standards and Technology (NCCoE)",
  "jurisdiction": "United States research reference",
  "region": "United States",
  "authorityClass": "research-database",
  "authorityNote": "Consultation findings; not a standard or implementation validation",
  "legalEffect": "informational",
  "status": "active",
  "published": "2026-09-29",
  "lastVerified": "2026-10-05",
  "editorialStatus": "reviewed",
  "officialUrl": "https://pages.nist.gov/nccoe-ai-identity/summary-of-comments.html",
  "summary": "NCCoE summarises consultation responses on agent identity, authorization and delegation, including persistent trust anchors, task credentials, narrowing authority and revocation.",
  "applicability": "Informational findings from consultation responses, not a representative survey or proof of control effectiveness. Proposed DevSecOps implementation work is prospective. Original Atlas synopsis of selected identity, delegation and enforcement findings; authors disclose AI-assisted analysis with verification.",
  "sectors": [
    "Cross-sector"
  ],
  "conceptIds": [
    "agent-authority",
    "access-control",
    "accountability",
    "traceability",
    "runtime-guardrails"
  ],
  "detailAvailability": "full-public-text",
  "provisions": [
    {
      "id": "nist-identity-delegation",
      "ref": "Delegation and accountability",
      "title": "Delegation and accountability",
      "summary": "Discusses attribution to sponsoring principals, downstream delegation and narrowing or revoking delegated authority.",
      "conceptIds": [
        "agent-authority",
        "accountability",
        "traceability"
      ],
      "granularity": "summary",
      "editorialStatus": "reviewed",
      "reviewedAt": "2026-10-05",
      "sourceUrl": "https://pages.nist.gov/nccoe-ai-identity/summary-of-comments.html",
      "note": "Selected consultation findings; conceptual mappings are Atlas interpretation, not tested controls."
    },
    {
      "id": "nist-identity-credentials",
      "ref": "Identity and enforcement",
      "title": "Identity and enforcement",
      "summary": "Discusses persistent identity anchors, limited task credentials and deterministic authorization enforcement separate from model reasoning.",
      "conceptIds": [
        "access-control",
        "runtime-guardrails"
      ],
      "granularity": "summary",
      "editorialStatus": "reviewed",
      "reviewedAt": "2026-10-05",
      "sourceUrl": "https://pages.nist.gov/nccoe-ai-identity/summary-of-comments.html",
      "note": "Selected consultation findings; conceptual mappings are Atlas interpretation, not tested controls."
    }
  ]
})]
