# Prompt catalogue

This catalogue separates scheduled agent instructions and authored questions shown to readers. It documents the maintained mechanisms, not every historical interactive conversation used to develop the app.

| Family | Canonical source | Trigger | Output |
|---|---|---|---|
| Source-monitor agent | [Portable monitor prompt](prompts/source-monitor.md); operational policy in [MONITORING.md](../MONITORING.md) | External local Codex schedule or explicit manual review | Evidence-backed run records, candidate decisions and proposed content edits |
| Concept/development questions | [leadershipQuestions.ts](../src/data/leadershipQuestions.ts), development prompt additions in [methodologyRefresh.ts](../src/data/methodologyRefresh.ts) | Card opened / audience changed | Authored questions for Board, Executive and Regulator |
| Risk/control/source questions | [nodeQuestionPrompts.ts](../src/data/nodeQuestionPrompts.ts) | Same | Authored role-specific content |
| Question composition | [nodeQuestions.ts](../src/data/nodeQuestions.ts) | Same | Source/section scope and concept questions assembled deterministically |

The application makes no live model calls. Source monitoring runs in the external agent environment; it does not run inside the website.

## Authored audience questions

These are reader-facing questions, not LLM prompts executed on every page visit. A complete question includes:

- Context and question text.
- Why the question matters.
- What evidence to ask for.
- A follow-up question.
- Source references and, where supplied, the basis.

Read the linked TypeScript banks to see all maintained wording. Source and section questions combine scope-specific framing with authored concept material; risk and control cards have authored role prompts. The question coverage checker tests 2–3 questions per card/audience and a complete question for each development/audience. It also checks role distinctions and references. Passing coverage is not a review of the original source or a validation of the answer a reader gives.

## Adapting the prompts

When building for another topic, replace the scope, audience, prohibited inferences and reference semantics together. Keep the separation between agent instructions and source documents. Replace the authored question banks and update the coverage checker alongside any audience changes. The monitor must retain evidence review, documented uncertainty and the incomplete-run publication gate.
