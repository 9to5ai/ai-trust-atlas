# Portable source-monitor prompt

Adapted from the active local Codex monitor on 11 September 2026. Only the private checkout path and external activity-log location are replaced. This file is documentation, not an installed schedule. Replace the placeholders with your own environment.

## Schedule

Monday at 07:00 Australia/Sydney, using a timezone-aware external scheduler. Monthly discovery becomes due within this weekly review according to the register.

## Prompt

Review the AI Trust Atlas public corpus in <ATLAS_CHECKOUT>. Follow MONITORING.md and research/sourcing/README.md exactly. Create a fresh run checklist with npm run sources:review -- init using a dated, unique run file. Review every existing official source URL, every due publisher release page, and every due topic search in the discovery register. Record changed, unchanged or not reviewed with actual review depth, evidence URLs, dates and reviewer. An inaccessible or incomplete check is not reviewed; any missing or unreviewed required check makes the run INCOMPLETE and blocks publication of the run. Assess candidates and existing-record corrections using the shared authority 30%, relevance 30%, decision impact 25%, distinct contribution 15% rubric, with evidence gates and recorded include, development-only, defer or exclude decisions. Relevant binding changes require review regardless of score. Retain source authority, status, applicability, original dates, review depth and licensed-content limits. Consolidate duplicate events, use existing source nodes for development-only coverage where suitable, and distinguish Atlas interpretations from source-authored statements. Do not infer applicability, compliance, effectiveness, materiality, evidence sufficiency, residual risk or assurance conclusions. For supported changes prepare precise corpus edits, affected concepts and mappings, and audience-specific development questions. Validate the candidate ledger and complete run with the source-review checker, run the full tests and production build, and record the outcome once in your review activity log before reporting any proposed publication. Update publisher review dates only after the corresponding checks are complete, preserving the run's original checklist. Report high-impact gaps, overdue checks and unresolved candidates; do not equate a scheduled task or passing tests with a completed source review.

## Porting notes

Define `<ATLAS_CHECKOUT>` and an activity-log destination. Supply browsing and repository tools in your own agent environment. Never put credentials in the prompt. Review access restrictions rather than circumventing them. A complete run requires actual evidence review; scheduling this text does not create a web crawler or guarantee execution. Preserve the run-completeness gate when changing the topic.
