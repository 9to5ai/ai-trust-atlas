import type { Incident } from './incidents'

// Approved 25 November 2026; mappings and questions are Atlas interpretations.
export const lateNovemberIncidents: Incident[] = [
  {
    "id": "together-prompt-sample-theft-2026",
    "title": "Together AI reports theft of stored prompt samples",
    "shortTitle": "Together AI prompt-sample theft",
    "disclosed": "2026-11-21",
    "updated": "2026-11-21",
    "reviewed": "2026-11-25",
    "occurred": "Exposure and download dates undisclosed; sampled requests from June–July 2026",
    "classification": "Provider-confirmed unauthorized download",
    "disclosureLabel": "Provider disclosure",
    "reviewScope": "Original provider disclosure rechecked on 25 November. No independent customer-scope audit reviewed.",
    "summary": "Together AI says a coding agent published a repository credential, enabling an unauthorized party to download stored customer prompt samples.",
    "implication": "Check what development agents can publish and where production prompts are retained.",
    "topics": [
      "data",
      "security",
      "third-party"
    ],
    "sources": [
      {
        "title": "Together AI: prompt-sample incident",
        "url": "https://www.together.ai/blog/security-event-prompt-leakage-for-requests-in-june-and-july-of-2026",
        "role": "Affected provider disclosure · 2026-11-21"
      }
    ],
    "findings": [
      {
        "text": "An exposed credential opened a private Hugging Face repository. Five credentials later tested by the unauthorized party were linked to the Dragos canary experiment.",
        "source": 0
      },
      {
        "text": "The sampled requests primarily date to June 24 and July 4, 8 and 14. These are not intrusion dates. Together reports revised development controls and zero data retention by default for new accounts.",
        "source": 0
      }
    ],
    "limitations": "Customer and sensitive-data scope remained under review. Provider-reported controls are not independently validated. This is separate from the OpenAI/Hugging Face incident; the related Dragos report is not an additional victim event.",
    "connections": [
      {
        "conceptId": "privacy",
        "controlId": "privacy-data-protection",
        "reason": "Retained production samples created another exposure path.",
        "practice": "Inventory testing copies and enforce retention limits."
      },
      {
        "conceptId": "access-control",
        "controlId": "least-privilege-access",
        "reason": "Development access reached customer data.",
        "practice": "Separate agent credentials from sensitive repositories."
      },
      {
        "conceptId": "change-management",
        "controlId": "change-release-retirement",
        "reason": "A public commit exposed access.",
        "practice": "Block secrets before publication, then test revocation."
      }
    ],
    "prompts": {
      "board": {
        "text": "Where are production prompts copied for testing?",
        "askFor": "An inventory, retention basis and exception approvals.",
        "followUp": "Who owns each exception?"
      },
      "executive": {
        "text": "Can a coding agent publish credentials that reach customer data?",
        "askFor": "Negative release tests and scoped credential records.",
        "followUp": "Can publication be blocked before exposure?"
      },
      "regulator": {
        "text": "What distinguishes reachable samples from downloaded data?",
        "askFor": "Access logs and notification methodology.",
        "followUp": "Which scope questions remain unresolved?"
      },
      "assurance": {
        "text": "Does secret detection happen before publication?",
        "askFor": "Timing tests and revocation evidence.",
        "followUp": "Does reverting a commit also revoke access?"
      }
    }
  },
  {
    "id": "novita-minimax-routing-2026",
    "title": "Novita routes MiniMax requests beyond its hosted infrastructure",
    "shortTitle": "Novita MiniMax routing",
    "disclosed": "2026-11-22",
    "updated": "2026-11-22",
    "reviewed": "2026-11-25",
    "occurred": "Potentially affected requests: 28 May–11 November 2026; link-access dates unspecified",
    "classification": "Provider-confirmed routing error; test-link access observed",
    "disclosureLabel": "Provider disclosure",
    "reviewScope": "Original provider disclosure rechecked on 25 November. No independent customer-scope audit reviewed.",
    "summary": "Novita confirms that a routing error sent some MiniMax requests to the official MiniMax API instead of Novita-hosted infrastructure.",
    "implication": "Verify every processing destination, including fallback routes and intermediaries.",
    "topics": [
      "data",
      "security",
      "third-party"
    ],
    "sources": [
      {
        "title": "Novita: MiniMax request privacy notice",
        "url": "https://novita.ai/blog/minimax-requests-privacy-notice/",
        "role": "Affected provider disclosure · 2026-11-22"
      }
    ],
    "findings": [
      {
        "text": "The precautionary window covers direct requests and traffic routed through OpenRouter. Test links were accessed, but no use of AWS test keys was observed.",
        "source": 0
      },
      {
        "text": "Novita suspended affected models and was investigating retention and deletion with MiniMax. Automated content review remained an assessment awaiting verification.",
        "source": 0
      }
    ],
    "limitations": "Malicious theft, customer totals and downstream retention are not established. No MiniMax response or independent customer account reviewed. Related Atlas Cloud notices do not prove an identical event or additional unique victims.",
    "connections": [
      {
        "conceptId": "third-party-risk",
        "controlId": "third-party-assessment",
        "reason": "Requests crossed an unintended provider route.",
        "practice": "Verify subprocessors and fallback destinations."
      },
      {
        "conceptId": "privacy",
        "controlId": "privacy-data-protection",
        "reason": "Processing location can differ from customer expectations.",
        "practice": "Match permitted use to actual data paths."
      },
      {
        "conceptId": "traceability",
        "controlId": "records-traceability",
        "reason": "Scope depends on reconstructing request routes.",
        "practice": "Keep routing history and deletion evidence."
      }
    ],
    "prompts": {
      "board": {
        "text": "What proves confidentiality promises survive every inference handoff?",
        "askFor": "Path verification and contract exceptions.",
        "followUp": "Which destinations remain unverified?"
      },
      "executive": {
        "text": "Can routing changes silently introduce another processor?",
        "askFor": "Configuration history and fail-closed route tests.",
        "followUp": "What blocks an unapproved destination?"
      },
      "regulator": {
        "text": "Can affected requests and downstream retention be reconstructed?",
        "askFor": "Routing records, deletion attestations and scope gaps.",
        "followUp": "Which claims rely only on provider assurances?"
      },
      "assurance": {
        "text": "Do tests check actual destinations rather than advertised labels?",
        "askFor": "Synthetic canary results and their limits.",
        "followUp": "Can legitimate link scanning be separated from misuse?"
      }
    }
  }
]
