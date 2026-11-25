# Incident review — 24 November 2026

Proposal-only scheduled review. No corpus edit, commit, push or deployment.

## Baseline and coverage

Read incident methodology, 17 November review, dated 3 November approval and current remote incident test inventory. Remote main: 3da4c02003a8bffbfad98fba579c04fed82fc971. Inventory remains 20 approved IDs. No approval inferred for 10/17 November proposals. Preserve those pending decisions rather than resubmitting them as new discoveries.

Window: 25 October–24 November by disclosure/material update; earlier occurrence only where newly disclosed. OECD default feed retrieved, latest visible 22 November. Explicit date-filter request failed. Supplemented with secondary discovery register and original provider/investigator publications. Coverage is incomplete and cyber-heavy; not all published incidents re-audited. No review dates in published data refreshed. No leaked repositories, credentials or customer data accessed.

Discovery sources: https://oecd.ai/en/incidents ; https://www.timmcallister.io/ai-incidents . Neither treated as verified findings.

## 1. PROPOSE — Together AI stored prompt-sample theft

Suggested ID: together-prompt-sample-theft-2026. Actual provider-confirmed unauthorized download, discovered within a broader canary investigation. Do not count the Dragos report and Together disclosure as separate incidents.

Dates: stored requests primarily 24 June, 4/8/14 July; these are NOT intrusion dates. Credential-exposure/download dates not established in reviewed narrative. Broader investigator disclosure 19 November; named-provider disclosure indexed 21 November (date not visible in retrieved article body; recheck original publication metadata before ingestion); review 24 November. No separately established later provider update.

Together says an AI coding agent committed a private Hugging Face repository credential to a public development repository. An unauthorized party downloaded stored customer prompt samples before containment and tested embedded credentials, including five linked to Dragos canaries. Customer/sensitive-data scope remained under review. The provider reports workflow changes and ZDR default for new accounts; these do not prove existing accounts have ZDR or that remediation effectiveness was independently tested.

Evidence: affected-provider narrative reviewed; Dragos original methodology and headline findings reviewed, not every investigative subsection. The provider explicitly links five canaries to the experiment. Independent customer scope and external forensic report unavailable. Strong admission evidence, incomplete scale. Not the existing OpenAI/Hugging Face intrusion: shared hosting service does not imply same event.

https://www.together.ai/blog/security-event-prompt-leakage-for-requests-in-june-and-july-of-2026
https://www.dragos.com/blog/ai-supply-chain-security-canary-tokens
https://openrouter.ai/blog/announcements/data-processing-incidents-on-inference-providers/

High audience relevance and decision impact. Distinct lesson: AI development permissions and retained production prompts combine into a second exposure path; reverting a commit does not establish that data was not already copied.

Proposed Atlas interpretations:
- privacy → privacy-data-protection: bound production-data retention for testing.
- access-control → least-privilege-access: limit development credentials and agent access.
- change-management → change-release-retirement: prevent secrets crossing public release boundaries.
- incident-response → incident-response-reporting: scope downloads and customer notification.

Questions / evidence:
- Board: Where are production prompts copied for testing, and who owns those exceptions? Request an inventory, retention basis and exception approvals.
- Executive: Can a coding agent publish credentials that reach customer data? Request negative release tests and scoped credential records.
- Regulator: Which evidence separates potentially reachable samples from downloaded data? Request repository access logs and notification methodology.
- Assurance: Does detection occur before publication or only afterward? Request controlled timing tests and revocation evidence.

## 2. PROPOSE — Novita unintended MiniMax routing

Suggested ID: novita-minimax-routing-2026. Confirmed routing error per provider, with observed test-link access; not established malicious theft or proven customer-data loss.

Dates: precautionary request window 28 May–11 November; exact link-access dates unknown; disclosure 22 November; no later separately identified update; reviewed 24 November.

Novita confirms some requests went to MiniMax's official API instead of its hosted infrastructure because a restricted forwarding path applied too broadly. Both direct and OpenRouter traffic may be affected. Test URLs were accessed; no use of AWS test keys was observed. Automated content review is Novita's assessment awaiting MiniMax verification. Affected models were suspended; retention/deletion inquiries continued.

Original Novita notice fully reviewed. Atlas Cloud's 23 November notice independently describes its own upstream route but relies on the same researcher, so it is not independent corroboration of Novita's customer scope. No MiniMax response or independent customer account reviewed. Evidence strong for routing admission, weaker for downstream purpose, retention and impact.

https://novita.ai/blog/minimax-requests-privacy-notice/
https://www.atlascloud.ai/blog/ai-updates/security-and-privacy-commitment

High relevance to procurement, data sovereignty and confidentiality. Distinct lesson from Together: policy/processing-path failure can matter without a proven compromise. Propose Novita as the bounded case; retain Atlas Cloud as a related disclosure, not an additional approved case or claimed identical event. Do not add provider/victim totals across related reports.

Proposed Atlas interpretations:
- third-party-risk → third-party-assessment: inspect all subprocessors and fallback routes.
- privacy → privacy-data-protection: match permitted use to actual processing paths.
- traceability → records-traceability: retain evidence of routing and retention.

Questions / evidence:
- Board: What proves confidentiality promises survive every inference handoff? Request independent path verification and contract exceptions.
- Executive: Can routing changes silently introduce another processor? Request configuration history and fail-closed route tests.
- Regulator: Can affected requests and downstream retention be reconstructed? Request routing records, deletion attestations and unresolved scope.
- Assurance: Are tests checking actual destination behavior rather than advertised labels? Request synthetic canary tests and limitations.

## Related context and deferred decisions

OpenRouter's original 22 November response reviewed: three unnamed providers removed, 125 endpoints lost ZDR eligibility including precautionary removals. These are not 125 breaches; no breach of OpenRouter itself established by the findings. The linked provider list does not identify which three were removed. Atlas Cloud says it withdrew voluntarily; do not contradict that without evidence. This is context for the above cases, not an additional incident.

- Barracuda original advisory reopened: latest displayed update remains 13 November; no substantive new change established. Prior proposal pending.
- Botpress, Grok apps, alleged executive impersonation and ConnectWise refresh remain pending; not reproposed. Other published entries were not substantively refreshed this run.
- Phala: linked provider notice not reviewed; defer separate event identity and overlap analysis.
- Microsoft Agent Framework PyPI compromise: discovery only; defer original investigator/maintainer review before proposing.
- AWS Cairn/MONAI: discovery only; defer original report/advisory/release reconciliation and overlap checks. Do not convert failed operations into confirmed victims or equate arbitrary write timing with root access.
- European Commission campaign: discovery only; official transcript not reviewed. Defer; journalist questions are not attribution evidence.
- Java4Shell: discovery describes controlled research and attempts without established successful compromise. Defer; not a confirmed customer incident.
- OECD Korean cheating and workplace synthetic-image abuse: original court/police/affected-party evidence not reviewed. Defer, preserve allegations and avoid reproducing abusive material.
- OECD Greek infrastructure warning: exclude as a general hazard, not a bounded realized incident.
- OECD chip-smuggling stories: defer identity, legal-status and AI-role verification; do not adopt generated summaries as findings.

## Requested decision

Approve Together and Novita as two distinct cases if desired. Their shared research context must not produce duplicate event counts. Connections/questions are Atlas interpretations, not assurance that a control would have prevented the events. Current corpus is unchanged.
