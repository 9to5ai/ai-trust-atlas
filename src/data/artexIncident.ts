import type { Incident } from './incidents'

export const artexIncident: Incident = {
  "id": "artex-south-korean-finance-2026",
  "title": "AI-assisted campaign targets South Korean financial organisations",
  "shortTitle": "ARTEX financial-sector campaign",
  "classification": "Security-researcher-reported campaign; scope under investigation",
  "disclosureLabel": "CrowdStrike technical report",
  "occurred": "Late September–early October 2026",
  "disclosed": "2026-10-07",
  "updated": "2026-10-07",
  "reviewed": "2026-10-09",
  "reviewScope": "CrowdStrike’s original investigation and associated press reporting reviewed. Actor files and affected systems were not independently examined; no bank-by-bank attribution or remediation validation performed.",
  "summary": "CrowdStrike reports an AI-assisted campaign against South Korean financial organisations involving ARTEX and large language models, with data exfiltration reported.",
  "implication": "Check whether existing defences and response teams can keep pace with more automated attacks, including on broker and employee services.",
  "topics": [
    "security",
    "testing",
    "resilience",
    "evidence"
  ],
  "sources": [
    {
      "title": "CrowdStrike: ARTEX campaign investigation",
      "url": "https://www.crowdstrike.com/en-us/blog/unknown-threat-actor-uses-artex-to-target-south-korean-finance/",
      "role": "Original security-researcher analysis · 7 October 2026"
    },
    {
      "title": "Kyunghyang Shinmun: financial-sector breach reporting",
      "url": "https://www.khan.co.kr/en/article/202610042320007",
      "role": "Press reporting cited by CrowdStrike · 4 October 2026; not independent technical verification"
    }
  ],
  "findings": [
    {
      "text": "CrowdStrike says attacker-controlled directories contained session histories, ARTEX configuration and memory files supporting AI-tool use during the campaign.",
      "source": 0
    },
    {
      "text": "Its account of individual bank breaches partly relies on industry reporting. The number of affected organisations remains unconfirmed.",
      "source": 0
    }
  ],
  "limitations": "AI involvement is supported by CrowdStrike’s reported analysis, not an Atlas audit. Do not attribute every contemporaneous bank breach to this campaign, infer full autonomy, or treat possible attacker identity as established. Victim scope, losses and the contribution of AI to each intrusion remain uncertain. Press accounts repeated by other outlets do not constitute independent technical corroboration.",
  "connections": [
    {
      "conceptId": "access-control",
      "controlId": "least-privilege-access",
      "reason": "Reported targets include services used outside core banking workflows.",
      "practice": "Review broker and employee service permissions and sensitive-data access."
    },
    {
      "conceptId": "ai-security",
      "controlId": "adversarial-security-testing",
      "reason": "The campaign raises questions about exposure to automated intrusion attempts.",
      "practice": "Exercise realistic attack scenarios against externally reachable services."
    },
    {
      "conceptId": "continuous-monitoring",
      "controlId": "runtime-monitoring",
      "reason": "Automated activity can put pressure on detection and triage.",
      "practice": "Test detection coverage and alert prioritisation across service boundaries."
    },
    {
      "conceptId": "incident-response",
      "controlId": "incident-response-reporting",
      "reason": "Reported data theft makes response speed and scope reconstruction material.",
      "practice": "Run timed containment exercises and retain evidence for event-level attribution."
    }
  ],
  "prompts": {
    "board": {
      "text": "Can our response keep pace with increasingly automated attacks?",
      "askFor": "Timed containment exercises, unresolved exposure and accountable owners.",
      "followUp": "Which response assumptions depend on attackers moving slowly?"
    },
    "executive": {
      "text": "Which broker, employee and public-facing services provide routes to sensitive data?",
      "askFor": "Service inventory, access tests and remediation records.",
      "followUp": "Can we isolate an affected service without losing critical operations?"
    },
    "regulator": {
      "text": "What demonstrates AI involvement in each attributed incident?",
      "askFor": "Technical evidence, source provenance and explicit attribution confidence.",
      "followUp": "Which incidents are linked by evidence rather than similar headlines?"
    },
    "assurance": {
      "text": "Do detection and containment work across these services?",
      "askFor": "Independent tests, correlated logs and measured response times.",
      "followUp": "Where does incomplete monitoring limit the conclusion?"
    }
  }
}
