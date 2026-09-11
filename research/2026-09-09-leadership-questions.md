# Leadership questions — 9 September 2026

Implemented the approved question layer without a separate dashboard.

- 40 concepts, each with separately authored Board, Executive and Regulator prompts.
- 12 topics surface three related concept questions; a selected concept stays first.
- All 18 developments have audience-specific prompts, supporting-material requests and follow-ups.
- Questions are labelled Atlas-authored and source-informed. Related references are contextual links, not assertions that the question is an official requirement.
- Meeting brief: up to eight questions, mixed audiences retained explicitly, purpose, reordering, removal, copy with links, clipboard fallback, print stylesheet and Save PDF through browser print.
- Audience persists in local storage. Brief contents remain in the current page session; no backend or external AI processing added.

Validation: 62 tests passed. Production build passed. Browser checks confirmed audience switching, expanded question details, adding a question and opening the meeting brief. Desktop and 390 × 844 mobile layouts visually inspected. The mobile launcher was adjusted to avoid covering the inspector. Viewport override restored. Print-preview visual verification was interrupted by the Mac locking; print export formatting has not been visually confirmed.
