# Incident review — 27 October 2026

Status: proposals only. No corpus edits, commits, pushes or deployments.
Window: 27 September–27 October 2026; no extended historical search.

## Baseline and coverage

Read incident research README, previous reviews and 20 October dashboard approval. Read-only GitHub main snapshot: `24a0900c4f9f75d97ef4d0726b6e78f63f4887b1`; 15 published incident IDs verified in remote incident tests. Local checkout contains unrelated dirty work and is not the release baseline.

Published IDs: hugging-face-2026; anthropic-evaluation-incidents-2026; hacktron-openai-2026; robodebt-scheme; deloitte-dewr-report-2025; air-canada-chatbot-2024; arup-deepfake-fraud-2024; dutch-childcare-benefits-scandal; openai-medicare-2026; openai-dns-escape-2026; openai-npws-fire-history-2026; artex-south-korean-finance-2026; anthropic-philadelphia-false-tip-2026; fireworks-evaluation-credentials-2026; openai-dashboard-internal-systems-2026. None reproposed.

OECD AIM default page accessible, showing October 22 discovery leads. Explicit date-filter URL returned Internal Error. Therefore this is a bounded discovery review, not exhaustive 30-day coverage. AIM summaries are machine-generated leads, not verified findings. Targeted original-source searches supplemented AIM. No comprehensive re-verification of all 15 published cases was performed.

## 1. PROPOSE — LiteLLM compromised release

Suggested ID: `litellm-release-compromise-2026-10`.
Classification: actual AI infrastructure/software-supply-chain compromise, not a model evaluation or proof of autonomous malicious AI.
Dates: exposed key May 27 (antecedent); reported attacker access October 10; malicious release and disclosure October 21; corrected canonical account October 23; reviewed October 27.

LiteLLM reports that an unrevoked Agent Platform master key led to an organization-owner GitHub token and release compromise. Its October 23 account supersedes preliminary explanations. JFrog independently analyzed malicious 1.107.0 wheels: credential theft and a remote-code loader, including Python-startup execution without importing LiteLLM. Source archives did not contain the same payload files. Keep this separate from the March LiteLLM compromise; no established shared campaign.

Evidence: high for malicious artifacts; provider-reported for internal access chain; downstream victim totals and attribution unestablished.
- [Canonical provider investigation](https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain)
- [Affected artifacts / historical preliminary notice](https://docs.litellm.ai/blog/security-incident-oct-21-2026)
- [Independent JFrog artifact analysis](https://research.jfrog.com/post/litellm-hijacked-again/)

Why include: a distinct release-integrity lesson beyond Fireworks evaluation-secret exposure. Relevant to boards' dependency assurance, executives' release controls and regulators' operational resilience assessments. Decision impact: require evidence about the installed artifact and actual credential boundaries, not repository review alone.
Proposed connections (Atlas interpretation):
- `supply-chain` → `secure-ai-development`: verify shipped packages and release provenance.
- `access-control` → `least-privilege-access`: bound identities available to agent platforms.
- `change-management` → `change-release-retirement`: independently enforce release approvals.
- `incident-response` → `incident-response-reporting`: prove revocation, not just removal of leaked text.

Questions / requested evidence:
- Board: What proves our AI dependencies cannot turn one leaked credential into a trusted release? Request dependency inventory, release assurance and privileged-access exceptions.
- Executive: Can we identify every deployment of an affected wheel or container? Request artifact digests, deployment inventory and tested rotation records.
- Regulator: How is the boundary between repository checks and shipped-artifact assurance independently tested? Request build attestations, approval-enforcement tests and incident reconstruction.

## 2. PROPOSE — ConnectWise application compromise with ARTEX-assisted follow-on activity

Suggested ID: `connectwise-artex-cloud-applications-2026`.
Classification: actual third-party application compromise; AI role and actor attribution attributed to Microsoft telemetry analysis.
Dates: broader campaign from September; downstream activity reported October 15; vendor disclosure October 16 at 17:47 UTC; Microsoft analysis October 21; vendor update October 26 at 14:00 UTC; reviewed October 27. Exact initial compromise time not established here.

Microsoft reports ARTEX-assisted abuse of trusted application credentials and subsequent cloud activity. Successful authentication does not establish data exfiltration. ConnectWise confirms unauthorized application-credential access and continued restoration work; on October 26, partner restoration availability was still being prepared. It reports no indication of backup-archive compromise. This is a separate underlying event from the approved South Korean finance case; shared tooling does not establish shared actors or merge their impacts.

Evidence: strong for compromise and operational disruption (affected vendor plus Microsoft observations); AI mechanism/attribution remains Microsoft's assessment. No global affected-customer or exfiltration count proposed.
- [Microsoft original investigation](https://www.microsoft.com/en-us/security/blog/2026/10/21/storm-0940-uses-artex-agentic-ai-connectwise-supply-chain-compromise/)
- [ConnectWise dated advisories](https://www.connectwise.com/company/trust/advisories)

Why include: trusted non-human identities can carry attacker activity across customer boundaries, while backup recovery becomes an operational constraint. More specific than simply another ARTEX example. High audience relevance and decision impact for vendor permission governance and recovery readiness.
Proposed connections (Atlas interpretation):
- `third-party-risk` → `third-party-assessment`: delegated supplier access.
- `access-control` → `least-privilege-access`: app-only privileges and consent.
- `continuous-monitoring` → `runtime-monitoring`: inspect service-principal changes and follow-on activity.
- `incident-response` → `incident-response-reporting`: remove persistence and preserve evidence.

Questions / requested evidence:
- Board: Could a trusted supplier compromise both our access controls and recovery capability? Request dependency scenarios and recovery exercises.
- Executive: Which vendor applications can change identities or permissions without a person signing in? Request consent inventory, privilege review and service-principal audit logs.
- Regulator: What distinguishes an attempted sign-in, successful access and verified data loss in reported impacts? Request event-level evidence and explicit confidence boundaries.

## 3. PROPOSE — Railway hosted-secret compromise

Suggested ID: `railway-ai-api-key-compromise-2026`.
Classification: actual infrastructure breach affecting AI credentials; claimed AI-assisted attack and distillation intent remain provider assessments, not independently established facts.
Dates: provider attack window October 20–22; initial disclosure October 21; preliminary report October 22; page also contains an update labelled “Monday, October 27” (weekday/date inconsistent in 2026; update timestamp unverified); reviewed October 27.

Railway reports unauthorized internal access and decryption of some stored environment variables. It describes attackers seeking AI-provider keys and broader precautionary revocations. A rotation notice is not evidence that a particular key was stolen. Running workloads reportedly stayed online while builds and deployments were interrupted. Investigation remains preliminary; do not turn provider claims about attacker models or motive into settled attribution.

Evidence: medium, direct affected-provider disclosure; no independently published forensic confirmation reviewed. Distinct lesson: third-party secret custody and coordinated revocation, including uncertainty about individual keys. Audience relevance high; incremental value lower than the first two because Fireworks already covers related exposure.
- [Railway preliminary report and updates](https://blog.railway.com/p/preliminary-report-october-security-incident)

Proposed connections (Atlas interpretation):
- `third-party-risk` → `third-party-assessment`: map custodians of AI credentials.
- `access-control` → `least-privilege-access`: separate decryption and execution privileges.
- `incident-response` → `incident-response-reporting`: coordinate revocation across providers.

Questions / requested evidence:
- Board: Do we know where our high-value AI credentials are held and the consequences of losing them? Request custodian inventory and loss scenarios.
- Executive: Can we rotate keys across providers without re-exposing replacements? Request revocation runbook, containment sequence and rehearsal results.
- Regulator: How are confirmed compromise and precautionary notification populations distinguished? Request scope methodology, access logs and notification decision records.

## Defer / exclude and existing-case checks

- OECD ARTEX headline: resolved to separate ConnectWise candidate above; do not overwrite Korean finance attribution.
- OECD economic forecasts, robot demonstrations and speculative crypto-game harms: exclude as new incident entries on current evidence; hazards/forecasts rather than bounded realized events.
- OECD PHP vulnerability discovery: defer; authorized discovery/patching does not establish an exploited AI incident.
- OECD political deepfake, election interference, Korean exam cheating and Australian Meta litigation leads: defer pending primary event/court evidence and distinct lesson review. Allegations must stay allegations.
- DIVD and OpenCode remain unapproved; this review does not promote either. No new original evidence verified here to resolve OpenCode's earlier access limitation.
- Fireworks search surfaced the existing October 6–10 chronology, not a verified new material development. Recent secondary publication dates alone do not justify a refresh.
- No material correction to an approved entry established by this bounded review. This is not a claim that all existing entries are fully current.

## Decision requested

Approve candidates individually. Recommended priority: LiteLLM, ConnectWise, then Railway (provider-reported and preliminary). All remain unpublished. Mappings and questions are Atlas editorial proposals, not claims of source equivalence or proof that a particular control would have prevented the event.
