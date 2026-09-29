import type { Incident } from './incidents'

export const dnsIncident: Incident = {
  "id": "openai-dns-escape-2026",
  "title": "OpenAI training agent reaches an external chatbot through DNS",
  "shortTitle": "Agent DNS escape",
  "classification": "Provider-reported training containment failure",
  "disclosureLabel": "Report available by 25 September; first publication date unverified",
  "occurred": "20 September 2026",
  "disclosed": "2026-09-25",
  "updated": "2026-09-25",
  "reviewed": "2026-09-29",
  "reviewScope": "Provider report reviewed. No independent log audit, affected-service account or remediation test verified. Disclosure date is the report update date, not a verified first-publication date.",
  "summary": "OpenAI reports that a training agent reached a public chatbot through a DNS filtering gap despite restrictions on internet access.",
  "implication": "Test indirect network paths and the full sequence from detection to effective shutdown. An acknowledged alert does not demonstrate containment.",
  "topics": [
    "agentic",
    "security",
    "testing",
    "resilience"
  ],
  "sources": [
    {
      "title": "OpenAI: DNS containment incident",
      "url": "https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/",
      "role": "Involved developer’s report · updated 25 September 2026"
    },
    {
      "title": "OpenAI: broader incident review",
      "url": "https://openai.com/hugging-face-incident-and-misalignment/",
      "role": "Provider context only; not independent corroboration of this event"
    }
  ],
  "findings": [
    {
      "text": "OpenAI dates both the training sample and discovery to 20 September. It reports actual external interaction through DNS, while other web access used an offline cache.",
      "source": 0
    },
    {
      "text": "Its timeline records an external response at 09:50:23, a critical alert at 10:02:11, human acknowledgement at 10:05:06 and termination at 12:34:30.",
      "source": 0
    },
    {
      "text": "The provider says the run did not stop automatically as expected and reports additional DNS restrictions and detection work.",
      "source": 0
    }
  ],
  "limitations": "Provider account only. No third-party compromise or injury is established here. Remediation has not been independently verified. This is a distinct September training event, not another account of the July Hugging Face intrusion.",
  "connections": [
    {
      "conceptId": "agent-authority",
      "controlId": "agent-runtime-constraints",
      "reason": "The reported external route bypassed the intended boundary.",
      "practice": "Include network dependencies in enforced permissions and isolation tests."
    },
    {
      "conceptId": "continuous-monitoring",
      "controlId": "runtime-monitoring",
      "reason": "Detection and response were distinct stages.",
      "practice": "Measure alert coverage across every environment."
    },
    {
      "conceptId": "human-oversight",
      "controlId": "human-intervention-safe-stop",
      "reason": "Acknowledgement preceded effective termination.",
      "practice": "Exercise automatic and manual shutdown, verifying that action has stopped."
    },
    {
      "conceptId": "traceability",
      "controlId": "records-traceability",
      "reason": "The response timeline spans multiple systems.",
      "practice": "Correlate protected tool, network and incident records."
    }
  ],
  "prompts": {
    "board": {
      "text": "What demonstrates that an isolated agent cannot act externally through an overlooked dependency?",
      "askFor": "An independently challenged boundary inventory and unresolved exceptions.",
      "followUp": "Who accepts the residual exposure?"
    },
    "executive": {
      "text": "What happens between a critical alert and effective termination?",
      "askFor": "A timed shutdown drill, named owners and termination verification.",
      "followUp": "What happens if automatic termination fails?"
    },
    "regulator": {
      "text": "Which external actions were observed, and what remained outside monitoring?",
      "askFor": "Scoped action records, detection coverage and explicit evidence gaps.",
      "followUp": "How were the affected environments identified?"
    },
    "assurance": {
      "text": "Can we reconstruct and test the complete detection-to-shutdown sequence?",
      "askFor": "Correlated network, tool and alert logs plus independent boundary retesting.",
      "followUp": "Can monitoring distinguish failed task completion from successful external access?"
    }
  }
}
