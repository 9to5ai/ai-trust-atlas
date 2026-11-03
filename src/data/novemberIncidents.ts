import type { Incident } from './incidents'

// Approved 3 November 2026. Connections and questions are Atlas interpretations.
export const novemberIncidents: Incident[] = [
  {
    "id": "cloudflare-glm-cache-exposure-2026",
    "title": "Cloudflare AI responses expose other customers’ request content",
    "shortTitle": "Cloudflare cross-customer exposure",
    "occurred": "27 August–9 September 2026",
    "disclosed": "2026-10-26",
    "updated": "2026-10-26",
    "reviewed": "2026-11-03",
    "classification": "Accidental production data exposure",
    "disclosureLabel": "Public customer-impact disclosure",
    "reviewScope": "Cloudflare incident account and coordinated SGLang technical disclosure reviewed. Customer-impact scope relies on Cloudflare; no independent customer audit performed.",
    "summary": "Cloudflare reports that 155 GLM-5.3 responses contained content from other customers’ requests. Oversized prompts reached stale shared cache state instead of failing safely.",
    "implication": "Test customer isolation at capacity limits and during failed requests, not only during normal operation.",
    "topics": [
      "data",
      "security",
      "testing",
      "third-party"
    ],
    "sources": [
      {
        "title": "Cloudflare: cross-request cache exposure",
        "url": "https://blog.cloudflare.com/kv-cache-exposure-remediation/",
        "role": "Affected provider incident report · 26 October 2026"
      },
      {
        "title": "SGLang: request isolation disclosure",
        "url": "https://www.lmsys.org/blog/2026-10-26-cf-security",
        "role": "Coordinated upstream technical explanation · 26 October 2026"
      }
    ],
    "findings": [
      {
        "text": "Cloudflare dates exposure to August 27–September 9 and reports 155 affected responses, not 155 customers. It found no evidence of deliberate exploitation or other Workers AI models being affected.",
        "source": 0
      },
      {
        "text": "SGLang describes a request-rejection path that could continue into shared-cache handoff. Its customer-impact discussion relies on Cloudflare’s investigation.",
        "source": 1
      }
    ],
    "limitations": "Provider-reported scope and remediation; no independent customer account reviewed. Coordinated disclosure is not independent verification of affected-user counts. This was actual accidental exposure, not established malicious theft. Fixes do not establish that every SGLang deployment is protected.",
    "connections": [
      {
        "conceptId": "privacy",
        "controlId": "privacy-data-protection",
        "reason": "Shared inference state exposed another customer’s information.",
        "practice": "Test cross-customer confidentiality under normal and failed requests."
      },
      {
        "conceptId": "access-control",
        "controlId": "least-privilege-access",
        "reason": "Authenticated requests still crossed customer data boundaries.",
        "practice": "Verify tenant isolation beyond API authentication."
      },
      {
        "conceptId": "ai-security",
        "controlId": "adversarial-security-testing",
        "reason": "Capacity and rejection behavior were consequential.",
        "practice": "Exercise oversized, interrupted and rejected requests."
      }
    ],
    "prompts": {
      "board": {
        "text": "What evidence shows another customer’s request cannot expose our information?",
        "askFor": "Independent isolation assurance and exception scope.",
        "followUp": "Does assurance cover shared serving infrastructure?"
      },
      "executive": {
        "text": "Do isolation tests include capacity limits and interrupted requests?",
        "askFor": "Failure-path tests, deployed configuration and change records.",
        "followUp": "What happens when a request cannot be processed safely?"
      },
      "regulator": {
        "text": "How was actual exposure distinguished from the population potentially at risk?",
        "askFor": "Scoped response evidence, notification methodology and remediation validation.",
        "followUp": "Are reported counts responses, customers or confirmed disclosures?"
      },
      "assurance": {
        "text": "Can a failed request leave data available to the next customer?",
        "askFor": "Cross-tenant canary tests and observed cache-lifecycle behavior.",
        "followUp": "Have the deployed configuration and error paths both been tested?"
      }
    }
  },
  {
    "id": "cyberstrikeai-education-campaign-2026",
    "title": "CyberStrikeAI directs post-compromise attacks on educational organisations",
    "shortTitle": "CyberStrikeAI education campaign",
    "occurred": "Exact calendar dates not established in reviewed report",
    "disclosed": "2026-11-02",
    "updated": "2026-11-02",
    "reviewed": "2026-11-03",
    "classification": "Investigator-reported real intrusion campaign",
    "disclosureLabel": "Original investigation publication",
    "reviewScope": "Kaspersky’s original reconstruction reviewed on 3 November. The page could not be reopened during release verification; no separate affected-party or independent reconstruction was obtained.",
    "summary": "Kaspersky reports educational-sector intrusions in Africa and Latin America. Human operators obtained initial access, then an attacker-side language model directed conventional tools through later attack stages.",
    "implication": "Detect harmful actions across identities and endpoints even when compromised hosts never contact an AI provider.",
    "topics": [
      "security",
      "agentic",
      "testing"
    ],
    "sources": [
      {
        "title": "Kaspersky: CyberStrikeAI in real-world attacks",
        "url": "https://securelist.com/tr/cyberstrikeai-attacks/121715/",
        "role": "Original investigator reconstruction · 2 November 2026"
      }
    ],
    "findings": [
      {
        "text": "Kaspersky describes human-led initial SQL Server access followed by model-orchestrated activity. Strategic control remained human; the implant itself did not need AI-provider API calls.",
        "source": 0
      },
      {
        "text": "The report’s one-hour statement concerns a final phase of lateral movement and collection, not the whole intrusion.",
        "source": 0
      }
    ],
    "limitations": "Exact event dates, victim totals, model identity, complete containment and downstream misuse are not established here. Claims rely on one investigator. Grouped as one reported campaign, not invented individual victim events. Shared tooling does not establish a common actor with ARTEX.",
    "connections": [
      {
        "conceptId": "continuous-monitoring",
        "controlId": "runtime-monitoring",
        "reason": "AI-directed actions can resemble conventional remote administration.",
        "practice": "Correlate credential access, remote execution and bulk exports."
      },
      {
        "conceptId": "access-control",
        "controlId": "least-privilege-access",
        "reason": "Initial access enabled further movement.",
        "practice": "Limit privileges and test containment after an initial compromise."
      },
      {
        "conceptId": "incident-response",
        "controlId": "incident-response-reporting",
        "reason": "Activity crossed hosts and stages.",
        "practice": "Exercise coordinated containment and preserve the event sequence."
      }
    ],
    "prompts": {
      "board": {
        "text": "Would our defenses detect AI-directed activity that looks like ordinary remote administration?",
        "askFor": "Scenario-based detection coverage and response results.",
        "followUp": "What works without knowing whether the attacker uses AI?"
      },
      "executive": {
        "text": "Which detections work without AI-provider traffic from the victim host?",
        "askFor": "Credential-access, lateral-movement and export alerts with test results.",
        "followUp": "Where do we rely on identifying the attacker’s tools?"
      },
      "regulator": {
        "text": "Which observations establish AI involvement, and which only establish compromise?",
        "askFor": "Source provenance, investigator confidence and reconstruction limits.",
        "followUp": "Which conclusions lack affected-party confirmation?"
      },
      "assurance": {
        "text": "Can we detect the attack sequence without relying on an AI label?",
        "askFor": "Replay results and correlated identity, endpoint and database logs.",
        "followUp": "Which stages fall outside current visibility?"
      }
    }
  }
]
