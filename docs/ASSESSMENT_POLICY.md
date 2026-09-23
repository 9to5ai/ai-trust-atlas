# Assessment policy

The Assess area lets a team rate its own AI governance against the Atlas's 24 candidate control objectives and produce a discussion pack. The rules below keep it useful without letting it look like something it is not.

## What an assessment is

- A **self-reported** view of maturity from the people who completed it, on a six-level scale: Not started, Initial, Developing, Defined, Managed, Optimising.
- A way to structure conversations and prioritise work. Gaps are ordered by size, weighted by how many risks and crosswalk-mapped obligations each control connects to.

## What it is not

- Not an audit, an assurance engagement or a conclusion under ISAE/ASAE 3000, ASAE 3150 or any other standard.
- Not a statement of compliance with any law, standard or regulator expectation. Obligation mappings come from the Atlas crosswalk and are Atlas interpretations drafted for review.
- Not evidence that a control operates effectively. "Evidence reviewed" records that someone looked at evidence, not what they concluded.

Every screen and export carries this disclaimer (`assessmentDisclaimer` in `src/assess/content.ts`).

## Where the data lives

- **Browser only.** Assessments are stored in `localStorage` under `atlas-assessments-v1`. They are never sent to a server, to Ask the Atlas or to any analytics service.
- **Portable.** Users can export an assessment as JSON and import it elsewhere. Imports are validated: unknown controls and out-of-range values are discarded.
- **Separate from the corpus.** Assessment code lives in `src/assess/` and is never imported by `src/data/`, `src/ask/` or `api/`. A test enforces this, so self-reported ratings cannot become public Atlas content or model context.

## Content rules

- Procedures are written as steps to consider ("Obtain…", "Select a sample…"), never as conclusions.
- Descriptors and procedures must not use conclusive language (compliant, certified, guarantees, proves). A test enforces this.
- The example assessment is labelled "Example data" in the app and in every export.

## Exports

- **Board pack (PowerPoint):** editable native text, tables and charts in Georgia and Arial, so it can be restyled into a house template. Questions come from the user's meeting brief when one exists; otherwise they are the board questions linked to the top gaps.
- **Workbook (Excel):** ratings, an evidence request list with a status dropdown, priority gaps with mapped provisions, and an About sheet.
- **Print / PDF:** the report prints on the Paper palette with A4 margins.

## Before using with clients

Confirm with the firm's risk and independence functions how self-assessment tools may be used with audit clients, and whether outputs need review before they are shared.
