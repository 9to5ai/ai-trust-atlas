# RBNZ/FMA frontier-AI cyber expectations - 20 October 2026

User-directed intake: review and add the [joint supervisory remarks](https://www.rbnz.govt.nz/-/media/project/sites/rbnz/files/publications/speeches/2026/supervisory-expectations-on-cyber-risk-associated-with-frontier-ai.pdf). This is a targeted admission, not a completed monitoring scan. User instruction authorises implementation and publication of this item. Baseline: current main `5c5a615b02c5ae1d950bb109901ac83fcc2d64bc`, matching the live production deployment at the baseline check. The newer dashboard-research incident is retained.

## Evidence and scope

- The complete seven-page official PDF text was substantively read: title page, key messages, printed pp. 1-6, substantive expectations and footnotes. Cover dates remarks to financial-services leaders in Auckland on 15 October 2026; RBNZ and FMA announcements corroborate that date. Reviewed/added 20 October; no effective date invented.
- The document is joint remarks by Angus McGregor (RBNZ) and Louise Unger (FMA). It communicates supervisory expectations reflecting existing prudential, conduct, cyber and operational-resilience obligations. It is not a new standalone AI law or prudential standard. Entity-specific applicability is a human assessment.
- Direct PDF retrieval returned 403; browser download stalled and browser PDF rendering was blank. Following the official announcement's PDF link succeeded in the web reader: seven pages, 259 indexed lines. Private evidence retains that extraction, not original PDF bytes. The paper is not labelled unavailable or reviewed from its announcement alone. Visual layout was not verified.
- References to model capability, threat speed, research and example financial uses are regulator-reported context. Linked studies were not independently reviewed. No illustrative workflow is admitted as a production use case, and no incident is admitted.
- RBNZ [terms of use](https://www.rbnz.govt.nz/about-our-site/terms-of-use) permit accurate, non-misleading reuse with RBNZ acknowledged as source/copyright owner, excluding third-party material. Public output uses original short synopses, attribution and official links; it does not reproduce figures, third-party material or a long excerpt. Access restrictions are distinct from reuse rights.

Supporting primary announcements:

- [RBNZ, 15 October](https://www.rbnz.govt.nz/news-and-events/news/2026/10/rbnz-and-fma-outline-supervisory-expectations-on-cyber-and-ai-risks)
- [FMA, 15 October](https://www.fma.govt.nz/news/all-releases/media-releases/rbnz-and-fma-outline-supervisory-expectations-on-cyber-and-ai-risk/)

## Admission and distinct contribution

Candidate `rbnz-fma-frontier-cyber-20261020`: include; all four gates pass. Authority 4, relevance 4, impact 3, contribution 3 = 90/100 for attention, not legal force or assurance. No binding-change flag.

The technical themes overlap existing ASD/APRA/FSB coverage, but the joint New Zealand supervisory position has lasting distinct value. Particularly useful are the operational risk of accelerated remediation, scrutiny of manual triage, visibility of supplier AI use, notification arrangements and retained accountability, and recovery exercises involving critical suppliers where appropriate.

Add one source `nz-rbnz-fma-frontier-cyber`, four page-linked sections, four `should` expectations with no commencement date, authored questions for Board/Executive/Regulator/Assurance, and one What's new item dated 15 October. The source publication supplies the timeline event; the briefing has `timeline: false` to prevent duplicate events.

| Section | Printed pages / PDF page | Key boundary | Candidate existing controls |
|---|---|---|---|
| Cyber defence | 3 / 4 | Faster risk-based remediation still needs operational change-risk management; defensive AI needs oversight | Least privilege; change/release/retirement |
| Governance | 4 / 5 | Board visibility, capability, appetite and accountability; independent assurance is evidence to obtain, not a result the Atlas grants | Accountable ownership; inventory; competence/challenge |
| Suppliers | 4-5 / 5-6 | Concentration, supplier AI use, notifications, shared responsibilities; entity retains accountability | Third-party assessment; accountable ownership |
| Recovery | 5 / 6 | Fraud/identity controls and plausible attack/model/provider scenarios; exercise actual recovery arrangements | Incident response; resilience/continuity; evaluation |

Concepts cover security/access, risk treatment, lifecycle, governance/appetite, AI inventory, competence/assurance, third parties/systemic dependencies, operational resilience, response, evaluation and consumer outcomes. Existing MIT risks remain connected only through labelled concept paths. Control choices are medium-confidence Atlas synthesis and do not prove implementation, sufficiency or effectiveness. No new risk or control taxonomy nodes are added.

One thematic `aligns-with` relation connects the Australian frontier-AI board guide, with distinct jurisdiction and legal status explicit. Its current public overview and governance/resilience passages were inspected for this comparison; no whole-source review date or published Australian record is changed. That official page redirects to `/publication/frontier-ai-cyber-threat-considerations-for-boards-of-directors`; its September page metadata coexists with an August PDF label. This intake does not silently turn page metadata into a new document date.

## Coverage and validation

The new immutable full inventory was created with `sources:review init`. The cumulative targeted run carries all 136 previous rows unchanged, including pending dates/reasons/actions, and adds only the reviewed source. `status` validates the ledger; strict `check` remains expected INCOMPLETE, missing `[]`, 117 not reviewed. The 21 active checks first pending 10 September are now 40 days old; no discovery dates advanced. The original 19 October inventory is untouched. IMDA/MAS SAFR1.1 and earlier unapproved candidates stay excluded.

Validation evidence and final release receipt are retained separately. Semantic regression checks cover legal status/date boundaries, source/citation paths for all audiences, remediation and supplier-accountability caveats, interpreted control links, event deduplication and feed recency. Full corpus/unit, type/build/content/question/privacy gates and browser checks are required before release. Browser checks include source and each section, role switching, adding questions to the brief, and the development-to-source journey on desktop/mobile. Original dirty work is preserved by hash; release is from an isolated checkout.

The source, selected expectations and audience prompts increase measured first-load gzip from 386.6 KB to 389.6 KB (about 0.8%). The documented text allowance rises from 388 KB to 390 KB; the WebGL budget remains 190 KB (153.7 KB measured). The first budget failure was recorded before this bounded adjustment. One existing UI unit test timed out while unit/build processes competed; rerun the unchanged test suite without concurrent build load. No assertion or timeout is relaxed.
