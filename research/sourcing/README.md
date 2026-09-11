# Source selection and discovery — policy 2026-09-10

The shared rubric lives in `src/data/sourcingPolicy.ts`; both the public Methodology panel and candidate assessor use it. Source type describes document form. Authority describes the claim and its scope. Priority directs review effort, never legal force or assurance.

## Workflow

1. From the project root run `npm run sources:review -- init research/sourcing/run-YYYY-MM-DD.json`. This creates a fresh, non-overwriting checklist for every current corpus source, due publisher release page and topic search. It does not fetch or review anything. New register entries are initially unreviewed, not presumed current.
2. Review official document content and status, publisher releases and cross-publisher topic searches. Use search date filters only for discovery; confirm event dates at the primary source. For long documents inspect relevant sections and record the actual review scope. Do not equate opening a page with reviewing its content.
3. Record every check's result, timestamp, reviewer, evidence URLs, findings and candidate IDs in the run. Record source restrictions and incomplete comparisons explicitly. Retain snapshots/version identifiers or precise excerpts where lawful. A changed checksum alone is not evidence of a substantive change.
4. Copy `candidate-template.json` into `candidate-decisions.json` for each substantive candidate or existing-record correction. The ledger is append-only by decision ID; a later reassessment gets a new ID and sets `supersedesId` to the earlier decision ID and keeps the same eventKey. Do not backdate reviews. Keep original publication, substantive event, review and addition dates distinct. Unknown publication dates stay null.
5. Assess the gates and score each factor 0–4 with a specific rationale. Record a decision: `include`, `development-only`, `defer`, or `exclude`. No automatic score threshold admits sources. Deduplicate by issuer/document/version/event, not headline. Consolidate multiple announcements of the same event. A binding-change flag moves a candidate to mandatory review but never bypasses evidence gates.
6. Prepare only supported corpus edits, development cards and bounded mappings. Link development-only items to existing sources; a new permanent node requires distinct lasting reference value. Source-authored and Atlas-interpreted material remain separate. Check discussion-question coverage for every added or changed card: sources and sections use their own concept mappings and references; risk types and control objectives require authored role prompts; developments require their own prompt set. Review wording for Board, Executive and Regulator audiences. Prompts are Atlas-authored and do not establish regulatory obligations or control effectiveness.
7. Run `npm run sources:review -- check research/sourcing/run-YYYY-MM-DD.json`, `npm run questions:check`, `npm test`, and `npm run build`. Production builds also run the question-coverage gate. The checker derives completeness from recorded items, not the status label. Missing or unreviewed required checks block publication of the monitoring run. Log the run once in the vault ACTIVITY_LOG.md before reporting. Update discovery-register lastReviewed dates only after successful checks, after validating the completed run; preserve the original run checklist.

## Rubric anchors

| Factor | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Authority for claim — 30% | Untraceable claim | Attributed secondary opinion | Accountable original claim with limited support | Strong original evidence or recognised technical reference | Responsible authority on its remit or robust original evidence directly supporting the claim |
| Audience relevance — 30% | Outside scope | Remote connection | Useful specialist context | Direct relevance to one target audience | Direct relevance to priority audiences and jurisdiction |
| Decision impact — 25% | No identifiable use | General awareness | Improves understanding | Changes a question, assessment or implementation choice | Material change requiring timely review or action consideration |
| Distinct contribution — 15% | Duplicate | Minor restatement | Useful clarification | Substantive new evidence or practice | Major new requirement, finding or capability |

The weighted total is sum(score × weight / 4), from 0–100. It orders attention; it is not a probability or quality certification. Evidence and rights gates must pass before inclusion. Original technical research can score highly without regulatory force. Official publication alone does not earn inclusion. Relevant binding changes are mandatory review regardless of novelty. Review borderline examples after the first completed runs before considering thresholds.

## Evidence gates and dispositions

- Provenance: attributable original evidence, stable URL and identifiable issuer.
- Evidence: the actual claim is supported at the stated review depth; distinguish a publisher's assertion from independent validation.
- Rights: public information or appropriately authorised use; licensed standards text is not reproduced.
- Scope and status: jurisdiction, audience, draft/final state, binding/voluntary distinction and date basis are clear.
- Defer: access restrictions, insufficient evidence, ambiguous date/status or incomplete review. Retain the lead and reason.
- Exclude: duplicate, out of scope, promotional without substantive evidence, or no decision value. Record why even if the publisher is prestigious.

## Monitoring priorities and scope

Weekly: existing references; priority regulators, public-sector guidance, major standards/research bodies; topic discovery across governance, risk, data/privacy, lifecycle, fairness, transparency, security, testing, resilience and agents. Monthly: secondary publisher discovery and a review of gaps in jurisdiction/topic coverage. Binding or urgent material changes warrant an out-of-cycle review.

Publisher register URLs are discovery starting points and must be checked on each run. An unreachable endpoint remains not reviewed until an authorised alternate official path is assessed. ISO and other licensed references have an explicit metadata-only scope; the review never claims full-text verification. Full-public-text sources are not silently downgraded to metadata to satisfy a completeness gate. Review dates on the public corpus must not be advanced for portions not assessed.

Existing references can be retained pending reassessment without claiming that their gates or dates have newly passed. A new methodology release alone does not imply a completed research scan. Track high-impact misses, overdue checks, review latency, evidence depth and decision usefulness rather than source count. Review monitoring effort and the publisher register monthly; adjust weights only with recorded reasons.
