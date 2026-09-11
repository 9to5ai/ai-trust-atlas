# Questions on every Atlas card

All eight node types now provide two or three questions for Board, Executive and Regulator readers. The 20 development cards retain their individual role prompts.

Sources and sections combine existing mapped concept prompts with the selected record's summary, references and authority-aware scope question. Selected sources also have bespoke focus prompts. Section questions retain the actual section reference and summary in meeting-brief exports. Source questions are not newly verified source claims and do not advance review dates.

Each of the 24 risk types and 24 control objectives has an authored role-specific question, followed by a response or ownership question. Risk questions distinguish documented scenarios from organisational exposure; control questions use the control's existing evidence examples and source foundations. Parent risk domains and control families show selected child questions. Shared question IDs preserve meeting-brief selections between parent and child views.

`npm run questions:check` validates all 293 node cards and 20 developments across three audiences. The production build runs this gate. It checks coverage, complete fields, references and role distinctions; it does not replace editorial review of relevance. The sourcing workflow now requires that review for added or changed cards.

Validation: 86 tests pass, TypeScript and Vite build pass. Integration tests exercise selection and meeting-brief saving for all eight node kinds. Mobile dark source questions and role selection were visually checked. An existing pointer-capture issue was fixed so clicking the mobile sheet handle expands it; dragging the handle still dismisses it. The wider source-monitor run remains incomplete and is not part of this interface release.
