# Reference refinement — 8 September 2026

Implemented the five findings approved in the user’s screenshot: graph readability, direct source browsing and topic relevance ordering, concise source overview with disclosures, recorded change history, and fewer distant suggested connections.

CPS 234 correction: https://www.apra.gov.au/standards/cps-234 was checked on 8 September 2026. The displayed determination is dated 30 November 2018 and commences 1 July 2019; paragraph 6 limits the third-party information-asset transition to the earlier renewal date or 1 July 2020. Removed the incorrectly copied CPS 230 dates. Retained the earlier substantive-summary review date and recorded this targeted check separately.

Suggested risk paths now require a specific shared concept supported by a selected source section. Broad governance concepts alone are excluded. This remains a navigation heuristic, not a validated coverage or applicability finding. The same risk-source eligibility is used in the risk outline. Candidate controls use direct source references or specific section-supported concepts. Original assertions remain inspectable.

The change history is an appendable, typed collection in src/data/changeHistory.ts. It records selected past reviews and Atlas changes, with prior position, current position, review date, source link and work to revisit. It does not claim continuous monitoring or complete historical coverage. Future source changes should append reviewed entries; publication dates and Atlas review dates must remain distinct.

Verification: 54 tests pass, including direct-source filtering, history navigation, legal disclosures, commencement regression, and exclusion of CPS 234 paths to MIT risks 6.1 and 6.4. Typecheck and production build pass. Desktop browser review covered graph, selection, List directory, source overview and history layout.
