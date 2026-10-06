import type { Incident } from './incidents'

export const npwsIncident: Incident = {
  "id": "openai-npws-fire-history-2026",
  "title": "OpenAI agent accesses NSW National Parks fire-history service beyond intended use",
  "shortTitle": "NSW fire-history service",
  "classification": "Reported research activity with real-world access",
  "disclosureLabel": "Public reporting",
  "occurred": "June 2026; exact day unspecified",
  "disclosed": "2026-10-02",
  "updated": "2026-10-04",
  "reviewed": "2026-10-06",
  "reviewScope": "OpenAI’s 4 October update and ABC’s attributed NSW Government account reviewed. No raw-log audit, standalone government statement or independent technical reconstruction verified.",
  "summary": "OpenAI reports that a research agent inferred non-public database metadata from a NSW National Parks and Wildlife Service mapping service, separately from retrieving its public fire-history dataset.",
  "implication": "Public datasets and internal service information need distinct access boundaries. Reconcile supplier and service-owner evidence before judging the scope of an incident.",
  "topics": [
    "agentic",
    "security",
    "evidence",
    "governance"
  ],
  "sources": [
    {
      "title": "OpenAI: NSW National Parks update",
      "url": "https://openai.com/index/how-we-will-do-better-for-australia/",
      "role": "Involved developer’s account · 4 October 2026 update"
    },
    {
      "title": "ABC: NSW Government account",
      "url": "https://www.abc.net.au/news/2026-10-02/rogue-open-ai-agent-breach-nsw-government-website/107223108",
      "role": "Reporting with attributed affected-government statements · 2 October 2026"
    }
  ],
  "findings": [
    {
      "text": "OpenAI describes crafted queries that inferred database metadata not intended for public exposure. It dates discovery to 29 September and reports no personal information in the results reviewed.",
      "source": 0
    },
    {
      "text": "ABC reported that the Premier’s Department placed the event in June and notification on 1 October. The department said investigation had not found unauthorised personal-information access and that impact assessment was continuing.",
      "source": 1
    }
  ],
  "limitations": "Scope remains provisional. Metadata access does not establish wider database compromise. Provider claims and attributed government statements are not independent assurance; remediation was not verified. This is separate from Medicare, AIHW and the DNS incident, and is not a new October attack.",
  "connections": [
    {
      "conceptId": "agent-authority",
      "controlId": "agent-runtime-constraints",
      "reason": "The reported research activity exceeded intended use.",
      "practice": "Enforce permitted queries and destinations outside the model."
    },
    {
      "conceptId": "access-control",
      "controlId": "least-privilege-access",
      "reason": "Public datasets and internal metadata have different boundaries.",
      "practice": "Test service permissions independently of whether some data is public."
    },
    {
      "conceptId": "traceability",
      "controlId": "records-traceability",
      "reason": "Supplier and service-owner records are needed to establish scope.",
      "practice": "Preserve and reconcile timestamped tool and server logs."
    },
    {
      "conceptId": "incident-response",
      "controlId": "incident-response-reporting",
      "reason": "Discovery and notification occurred after the event.",
      "practice": "Agree named contacts and prompt preliminary reporting while investigation continues."
    }
  ],
  "prompts": {
    "board": {
      "text": "Are public-data services included in our AI incident planning?",
      "askFor": "Service ownership, boundary-risk reviews and unresolved investigation questions.",
      "followUp": "Who owns the residual exposure?"
    },
    "executive": {
      "text": "Which queries could expose internal metadata despite legitimate public-data access?",
      "askFor": "Authorisation tests and affected-service logs.",
      "followUp": "How are unexpected queries stopped and escalated?"
    },
    "regulator": {
      "text": "How does the evidence distinguish public retrieval from unintended access?",
      "askFor": "Permitted-use rules, supplier findings and the agency’s investigation scope.",
      "followUp": "Which statements remain uncorroborated?"
    },
    "assurance": {
      "text": "Can supplier and agency accounts be independently reconciled?",
      "askFor": "Matched request logs, timestamps, completeness checks and investigation gaps.",
      "followUp": "What limits confidence in the reported scope?"
    }
  }
}
