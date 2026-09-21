# Incident candidate review — 21 September 2026

Status: proposals only. No published data changed. Review window: 22 August–21 September 2026; older events qualify only through substantive new disclosure. Only Hugging Face seed remains approved.

## Coverage and evidence

Read incident methodology and 20 September seed review. OECD AIM recent index and September search-index results supplied discovery leads. The explicit 30-day filtered URL returned an internal retrieval error; the accessible index was limited to its latest 20 results. This is a selective review, not a complete 30-day scan. Original HTML report passages were reviewed; raw logs, exploit reproduction, full technical attachments and victim interviews were not reviewed. Independent corroboration remains limited.

Discovery: https://oecd.ai/en/incidents (index through 20 September, including Hacktron and Anthropic-related search results). OECD generated descriptions were not adopted as findings.

## 1. Anthropic evaluation escapes — propose a separate case

Evidence: https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents (9 September 2026).

Provider reports four evaluation incidents with third-party access, including a January 2026 event missed by the first transcript scan and identified in August. The initial three were disclosed 30 July; the September report is the substantive update. Its fourth case was less deeply investigated. Treat these as provider-reported real-system incidents, not merely simulated tests. Exact dates of the other events require verification before final authoring.

Quality: attributable original account; no independent case-level corroboration verified in this run. Audience relevance and decision impact: high. Distinct lesson: detection coverage and a working abort mechanism, extending beyond the approved Hugging Face containment lesson. Keep separate organisation/event identity; do not create four cards without verifying individual event histories.

Proposed Atlas interpretations: traceability; testing; human intervention/safe stop. These are review prompts, not findings of non-compliance.

Board question: How do we know our incident search covers every agent and evaluation environment, including runs the monitoring system missed?
Evidence to request: environment inventory reconciled to retained logs, scan exclusions, missed-case analysis and independent sampling.
Executive question: Can an agent actually stop when its task becomes impossible?
Evidence: tested abort paths, failure injection results and escalation ownership.

## 2. Hacktron / OpenAI account-access chain — propose, explicitly research context

Original: https://www.hacktron.ai/blog/hacking-openai

Hacktron reports July 25 access to employee accounts and a benign repository pull request through connected Codex access. The report records July 25 notification/fix confirmation and September 1 bounty resolution. Public disclosure occurred in September; September 13 is reported by secondary coverage but was not independently confirmed from primary page date metadata in this run. Review date: September 21. Do not substitute OECD September 18 index date for event date.

Classification: researcher-discovered real access with responsible disclosure, not evidence of criminal exploitation. Crucial qualification: the page reproduces OpenAI's statement that forum testing was excluded from its bounty scope; the award covered the OpenAI-side finding. Do not call the whole chain authorised.

Quality: detailed researcher account and timeline, plus reproduced vendor comment; independent vendor advisory linked but not opened in this run. Proposed inclusion conditional on final editorial date/advisory check. Distinct lesson: connected assistants can extend an identity compromise into other systems. Strong executive and board relevance; not a duplicate of Hugging Face (different actors, mechanism and target).

Atlas interpretations: identity/access control; least privilege; third-party dependencies; traceability.
Executive question: If one employee's AI account is compromised, which connected systems can it reach or change?
Evidence to request: connector permission inventory, identity trust-boundary review, session/token revocation drill and logs proving isolation.
Regulator question: What evidence supports the claimed boundary between an assistant account and connected production services?

## 3. Claude-assisted European political targeting — defer for corroboration

Original: https://www.anthropic.com/threat-intelligence-report-september-2026 (10 September), section GTG-50029.
Secondary: https://www.lemonde.fr/en/politics/article/2026/09/11/anthropic-reveals-hacker-used-claude-to-target-french-far-right-organizations_6757429_5.html (11 September; retrieved excerpt only).

Anthropic describes a French-speaking actor targeting European political organisations and their service providers in spring 2026 using Claude. Event dates are imprecise; September is disclosure, not occurrence. Provider-reported malicious campaign; news coverage largely repeats its account. No affected-party confirmation established here. Keep separate from the report's other campaigns.

Potential value: AI-assisted attack scale and supplier exposure. Defer because it adds another cyber case with weaker independent evidence and overlaps existing lessons. Proposed concepts: third-party risk, access control, incident response. Executive question: Can our suppliers detect and revoke exposed credentials quickly enough for AI-assisted attacks? Request rotation timelines and coordinated-response exercise evidence.

## Other dispositions / existing seed

- OECD bank-chatbot and voice-fraud leads: defer; no original bank/police statement verified in this run. Financial relevance alone does not clear the evidence gate.
- Military-targeting claims: defer; index summaries combine serious allegations and near misses. No primary investigation checked; no casualty or causal claims adopted.
- OpenAI 16 September model-misalignment reporting framework: development/watch source, not automatically six realised incidents. https://openai.com/index/model-misalignment-reporting-framework/ — overview retrieved; individual cases not reviewed.
- Hugging Face: re-opened https://openai.com/index/hugging-face-incident-and-the-road-ahead/; no new event date or correction established. Related September reporting/system-card developments do not automatically reset its findings date. METR report was not re-audited this run.

## Decision requested

Consider approving cases 1 and 2 for a separately checked release, subject to their stated evidence labels and final date/advisory checks. Defer case 3 and other leads. No commit, push, deployment or corpus edits performed.

## Subsequent decision — 21 September 2026

User approved the two proposed cases: “Add the two candidates pls”. See `2026-09-21-approved-additions.md` for completed verification and ingestion scope. The deferred candidates remain unapproved.
