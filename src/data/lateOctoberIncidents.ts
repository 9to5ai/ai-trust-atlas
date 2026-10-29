import type { Incident } from './incidents'

// Approved 28 October 2026; connections and prompts are Atlas interpretations.
export const lateOctoberIncidents: Incident[] = [
  {
    "id": "litellm-release-compromise-2026-10",
    "title": "Compromised LiteLLM release distributes credential-stealing code",
    "shortTitle": "LiteLLM release compromise",
    "occurred": "10–21 October 2026; exposed key dates to 27 May",
    "disclosed": "2026-10-21",
    "updated": "2026-10-23",
    "classification": "AI infrastructure supply-chain compromise",
    "summary": "LiteLLM reports that a leaked, unrevoked agent-platform key led to privileged GitHub access and a compromised release. JFrog independently identified malicious code in version 1.107.0 artifacts.",
    "implication": "Check the software you deploy, the identities that can release it and whether exposed keys were actually revoked.",
    "topics": [
      "security",
      "third-party",
      "resilience"
    ],
    "sources": [
      {
        "title": "LiteLLM: corrected attack-chain investigation",
        "url": "https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain",
        "role": "Affected provider account · 23 October 2026"
      },
      {
        "title": "JFrog: independent analysis of malicious wheels",
        "url": "https://research.jfrog.com/post/litellm-hijacked-again/",
        "role": "Independent artifact analysis · 21 October; updated 22 October 2026"
      }
    ],
    "findings": [
      {
        "text": "LiteLLM traces access through an exposed Agent Platform master key to an organisation-owner GitHub token. Its corrected report supersedes preliminary explanations.",
        "source": 0
      },
      {
        "text": "JFrog found credential theft and a remote-code loader in wheels, including startup execution without importing LiteLLM. The source archive lacked the same payload files.",
        "source": 1
      }
    ],
    "limitations": "Internal access-chain findings are provider-reported; independent artifact analysis does not independently establish that chain. Downstream victim totals and actor attribution are not established here. This is separate from the March LiteLLM compromise and does not prove autonomous AI misuse.",
    "reviewed": "2026-10-28",
    "disclosureLabel": "Initial public disclosure",
    "reviewScope": "Original accounts rechecked for approved publication on 28 October. Evidence supports the bounded findings below; underlying logs and remediation were not independently audited.",
    "connections": [
      {
        "conceptId": "supply-chain",
        "controlId": "secure-ai-development",
        "reason": "Malicious wheel contents differed from the source archive.",
        "practice": "Verify deployed artifact digests and build provenance."
      },
      {
        "conceptId": "access-control",
        "controlId": "least-privilege-access",
        "reason": "An agent-platform key reportedly exposed an owner-level identity.",
        "practice": "Use scoped service identities and test their effective permissions."
      },
      {
        "conceptId": "change-management",
        "controlId": "change-release-retirement",
        "reason": "Compromised identities could trigger and approve a release.",
        "practice": "Enforce independent release approvals beyond owner-token bypasses."
      },
      {
        "conceptId": "incident-response",
        "controlId": "incident-response-reporting",
        "reason": "Removing a leaked key from a repository did not revoke it.",
        "practice": "Record issuer-side revocation and test that old credentials fail."
      }
    ],
    "prompts": {
      "board": {
        "text": "What proves our AI dependencies cannot turn one leaked credential into a trusted release?",
        "askFor": "Dependency inventory, release assurance and privileged-access exceptions.",
        "followUp": "Which conclusions are demonstrated, and which remain uncertain?"
      },
      "executive": {
        "text": "Can we identify every deployment of an affected wheel or container?",
        "askFor": "Artifact digests, deployment inventory and tested rotation records.",
        "followUp": "Which conclusions are demonstrated, and which remain uncertain?"
      },
      "regulator": {
        "text": "How is the boundary between repository checks and shipped-artifact assurance independently tested?",
        "askFor": "Build attestations, approval-enforcement tests and incident reconstruction.",
        "followUp": "Which conclusions are demonstrated, and which remain uncertain?"
      },
      "assurance": {
        "text": "Can we independently substantiate the exposure and containment boundaries?",
        "askFor": "Artifact or access records, scoped findings and tested remediation evidence.",
        "followUp": "Which parts of the incident depend only on provider statements?"
      }
    }
  },
  {
    "id": "connectwise-artex-cloud-applications-2026",
    "title": "ConnectWise application compromise enables ARTEX-assisted customer access",
    "shortTitle": "ConnectWise / ARTEX",
    "occurred": "October 2026; downstream activity reported 15 October",
    "disclosed": "2026-10-16",
    "updated": "2026-10-27",
    "classification": "Third-party compromise with reported AI-assisted follow-on activity",
    "summary": "ConnectWise confirms unauthorised access to Cloud Backup application credentials. Microsoft reports ARTEX-assisted abuse of trusted applications in customer environments.",
    "implication": "Review supplier application permissions and prove that containment removes access created inside customer environments.",
    "topics": [
      "security",
      "third-party",
      "resilience",
      "agentic"
    ],
    "sources": [
      {
        "title": "Microsoft: ARTEX campaign and ConnectWise compromise",
        "url": "https://www.microsoft.com/en-us/security/blog/2026/10/21/storm-0940-uses-artex-agentic-ai-connectwise-supply-chain-compromise/",
        "role": "Original telemetry-based investigation · 21 October 2026"
      },
      {
        "title": "ConnectWise: Cloud Backup advisory",
        "url": "https://www.connectwise.com/company/trust/advisories",
        "role": "Affected provider disclosure · 16 October; updated 27 October 2026"
      }
    ],
    "findings": [
      {
        "text": "Microsoft reports application-credential changes and privilege-related activity following authentication. Successful sign-in alone does not establish data access or exfiltration.",
        "source": 0
      },
      {
        "text": "On 27 October, ConnectWise said phased restoration awaited third-party validation. It reported no indication that existing backup archives were compromised.",
        "source": 1
      }
    ],
    "limitations": "AI involvement and Storm-0940 attribution are Microsoft assessments. Customer-specific impacts require separate investigation. This event is distinct from the South Korean finance case; shared ARTEX tooling does not establish a common actor. Provider restoration statements are not independent assurance.",
    "reviewed": "2026-10-28",
    "disclosureLabel": "Initial public disclosure",
    "reviewScope": "Original accounts rechecked for approved publication on 28 October. Evidence supports the bounded findings below; underlying logs and remediation were not independently audited.",
    "connections": [
      {
        "conceptId": "third-party-risk",
        "controlId": "third-party-assessment",
        "reason": "Trusted supplier applications provided access across customer boundaries.",
        "practice": "Inventory delegated supplier access and test compromise scenarios."
      },
      {
        "conceptId": "access-control",
        "controlId": "least-privilege-access",
        "reason": "App-only credentials enabled access without interactive sign-in.",
        "practice": "Review consent grants and remove unnecessary application privileges."
      },
      {
        "conceptId": "continuous-monitoring",
        "controlId": "runtime-monitoring",
        "reason": "Credential and privilege changes can create further access.",
        "practice": "Monitor service-principal activity and unexpected privilege changes."
      },
      {
        "conceptId": "incident-response",
        "controlId": "incident-response-reporting",
        "reason": "Removing the original application may leave derived access behind.",
        "practice": "Preserve evidence and verify removal of every derived credential."
      }
    ],
    "prompts": {
      "board": {
        "text": "Could a trusted supplier compromise both our access controls and recovery capability?",
        "askFor": "Dependency scenarios and recovery exercises.",
        "followUp": "Which conclusions are demonstrated, and which remain uncertain?"
      },
      "executive": {
        "text": "Which vendor applications can change identities or permissions without a person signing in?",
        "askFor": "Consent inventory, privilege review and service-principal audit logs.",
        "followUp": "Which conclusions are demonstrated, and which remain uncertain?"
      },
      "regulator": {
        "text": "What distinguishes an attempted sign-in, successful access and verified data loss in reported impacts?",
        "askFor": "Event-level evidence and explicit confidence boundaries.",
        "followUp": "Which conclusions are demonstrated, and which remain uncertain?"
      },
      "assurance": {
        "text": "Can we independently substantiate the exposure and containment boundaries?",
        "askFor": "Artifact or access records, scoped findings and tested remediation evidence.",
        "followUp": "Which parts of the incident depend only on provider statements?"
      }
    }
  },
  {
    "id": "railway-ai-api-key-compromise-2026",
    "title": "Railway breach exposes hosted credentials sought for AI access",
    "shortTitle": "Railway credential breach",
    "occurred": "20–22 October 2026 (provider-reported window)",
    "disclosed": "2026-10-21",
    "updated": "2026-10-26",
    "classification": "Provider-reported infrastructure and credential compromise",
    "summary": "Railway reports unauthorised internal access and decryption of some stored environment variables. Its investigation says attackers sought AI-provider keys; precautionary revocations extended beyond confirmed exposure.",
    "implication": "Map who holds your AI credentials and rehearse coordinated revocation without exposing replacement keys.",
    "topics": [
      "security",
      "third-party",
      "resilience"
    ],
    "sources": [
      {
        "title": "Railway: preliminary incident report",
        "url": "https://blog.railway.com/p/preliminary-report-october-security-incident",
        "role": "Affected provider account · 22 October; update labelled 26 October 2026"
      }
    ],
    "findings": [
      {
        "text": "Railway reports that some stored environment variables were decrypted. Receiving a rotation notice does not establish that a particular key was stolen.",
        "source": 0
      },
      {
        "text": "The provider says existing workloads stayed online while builds and deployments were interrupted. Its 26 October update describes restored service for existing users while signups remained paused.",
        "source": 0
      }
    ],
    "limitations": "The investigation remains preliminary. No independent forensic confirmation was reviewed. Attacker AI use and distillation intent are provider assessments, not independently established findings. Exact affected-key scope remains uncertain; precautionary notifications must not be counted as confirmed compromise.",
    "reviewed": "2026-10-28",
    "disclosureLabel": "Initial public disclosure",
    "reviewScope": "Original accounts rechecked for approved publication on 28 October. Evidence supports the bounded findings below; underlying logs and remediation were not independently audited.",
    "connections": [
      {
        "conceptId": "third-party-risk",
        "controlId": "third-party-assessment",
        "reason": "A hosting provider held credentials for multiple upstream services.",
        "practice": "Maintain an inventory of credential custodians and upstream dependencies."
      },
      {
        "conceptId": "access-control",
        "controlId": "least-privilege-access",
        "reason": "Internal access reportedly enabled decryption of stored secrets.",
        "practice": "Separate secret-decryption authority from build and execution access."
      },
      {
        "conceptId": "incident-response",
        "controlId": "incident-response-reporting",
        "reason": "Precautionary rotations extended beyond confirmed key exposure.",
        "practice": "Exercise coordinated revocation after containing the intrusion."
      }
    ],
    "prompts": {
      "board": {
        "text": "Do we know where our high-value AI credentials are held and the consequences of losing them?",
        "askFor": "Custodian inventory and loss scenarios.",
        "followUp": "Which conclusions are demonstrated, and which remain uncertain?"
      },
      "executive": {
        "text": "Can we rotate keys across providers without re-exposing replacements?",
        "askFor": "Revocation runbook, containment sequence and rehearsal results.",
        "followUp": "Which conclusions are demonstrated, and which remain uncertain?"
      },
      "regulator": {
        "text": "How are confirmed compromise and precautionary notification populations distinguished?",
        "askFor": "Scope methodology, access logs and notification decision records.",
        "followUp": "Which conclusions are demonstrated, and which remain uncertain?"
      },
      "assurance": {
        "text": "Can we independently substantiate the exposure and containment boundaries?",
        "askFor": "Artifact or access records, scoped findings and tested remediation evidence.",
        "followUp": "Which parts of the incident depend only on provider statements?"
      }
    }
  }
]
