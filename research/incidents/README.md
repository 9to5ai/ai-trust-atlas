# Incident review methodology

The incident layer turns documented events into questions for boards, executives and regulators. Approved cases are the July 2026 OpenAI / Hugging Face intrusion (20 September approval), the Anthropic evaluation-incident series and the Hacktron / OpenAI account-access chain (21 September approval). All other cases require separate approval before ingestion. Consult dated approval records and published incident IDs before proposing duplicates.

## Discovery and publication

The Codex app automation **Atlas incident review** runs weekly on Monday at 09:00 in the user's Australia/Sydney timezone. It is attached to the Atlas task, not a Vercel cron or server-side crawler. Its prompt directs research and candidate proposals only. Scheduling does not establish that any source has been reviewed; check each run's evidence and coverage.

Start with [OECD AIM](https://oecd.ai/en/incidents) and its [methodology](https://oecd.ai/en/incidents-methodology), using recent 30-day coverage and substantive updates to existing cases. Extend to 90/120 days when a meaningful gap warrants it. OECD summaries and classifications are AI-assisted discovery leads, not independently verified findings or OECD endorsements. Follow original reports and independent evidence. Do not infer prevalence from press coverage or treat multiple articles based on one disclosure as corroboration.

Separate observed incidents, allegations, near misses and testing-only findings. Real external impact during testing belongs in the incident category with that context explicitly stated. Preserve event, disclosure, findings/publication, and review dates separately. An ingestion or review date never makes an old incident new.

## Decisions

Use evidence quality as an admission gate: identifiable event, meaningful AI role, attributable claims, source accessibility and current status. Then prioritise audience relevance, decision impact and a distinct governance lesson. Record each dimension qualitatively, with reasons; do not collapse evidence strength and severity into a score. One case should have a stable identity across later reports.

For no more than five strong candidates per run, document:
- What happened, event and disclosure dates, organisations and AI's role.
- Evidence links, exact review depth, who makes each claim, limitations and unresolved differences.
- Recommend inclusion, defer or exclude, with rationale and duplication checks.
- Two to four proposed concept/control connections, explicitly Atlas interpretations.
- Audience-specific questions and evidence to request, without claiming compliance or prevention.

Write a dated Markdown review to `reviews/`. Record inaccessible material as not reviewed and identify incomplete coverage. Notify only for worthwhile candidates, material corrections, monitoring failures or decisions; remain quiet otherwise. Never edit published data, commit, push or deploy from the monitor. The user approves individual cases before a separately tested release. Preserve other uncommitted research files.

## Implementation

`src/data/incidents.ts` holds authored records, source roles, findings, limits, concept/control links and role questions. `IncidentDetail` displays these within the existing swipe-dismiss inspector. Incidents are discoverable in global search, What’s new (All / Developments / Incidents), related concept/topic/control details, and Questions. An optional universe layer adds triangular incident nodes and labelled interpretive links. `?incidents=1` preserves layer visibility; `#/incident/hugging-face-2026` opens the seed directly.

What’s new uses the latest reviewed substantive findings publication date; it labels that date separately from when the event occurred. Do not update this date merely because a scheduled review ran. Question IDs resolve against the current corpus when restoring saved meeting briefs. No live model generation or automatic publication occurs.
