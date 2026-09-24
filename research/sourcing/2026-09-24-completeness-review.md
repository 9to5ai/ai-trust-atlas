# Library completeness review: 24 September 2026

**Scope:** Australian depth and global financial regulators, as requested. **Status:** approved by the owner and applied on 24 September 2026, including the new Hong Kong and Japan regions. Decisions are recorded in `candidate-decisions.json` (`review-2026-09-24-*`). Every added record carries `editorialStatus: 'draft'` until it is reviewed. One change was dropped: the CPS 230 record already explains that 1 July 2026 is the amended determination, and citations depend on that date.

**Method:** I inventoried all 86 sources, then checked official and secondary sources on the web on 24 September 2026. Items marked *verify on apply* were confirmed only through secondary reporting. Their official text must be read before they are added.

## Where the Library stands

| Area | Sources now | Gap |
|---|---|---|
| Australia | 30 | Strong on APRA standards, ASD and the enabling Acts. Missing the national policy frame (National AI Plan), APRA practice guides, OAIC developer and automated-decision guidance, ASIC conduct guidance, board guidance and state government. |
| Global financial standard-setters | FSB ×3 | No IOSCO, IAIS or BCBS material. |
| Europe (financial) | DORA only | No EBA, EIOPA or ESMA. |
| UK (financial) | PRA SS1/23 | No FCA or Bank of England material. |
| US (financial) | SR 26-2 | No insurance (NAIC). |
| Singapore | 5 | Missing MAS's proposed AI Risk Management Guidelines, the most important finance-specific AI rule in the region. |
| Hong Kong, Japan | 0 | The app's region list has no entry for either, so the data model has to change first. |

## A. Proposed additions: Australia

| # | Source | Issuer · date | Type · status | Why add it | Priority |
|---|---|---|---|---|---|
| A1 | [National AI Plan](https://www.industry.gov.au/publications/national-ai-plan) | DISR · 2 Dec 2025 | Policy · active | Sets Australia's position: existing laws and sector regulators, backed by voluntary guidance and the AI Safety Institute, not a standalone AI Act. Every board conversation about "will there be an AI Act?" starts here. | **High** |
| A2 | [CPG 230 Operational Risk Management](https://www.apra.gov.au/operational-risk-management) | APRA · updated for the 1 Jul 2026 amendments | Guidance · active | APRA's practice guide for CPS 230. It shows how APRA expects material service providers to be managed, and AI vendors are increasingly among them. | **High** |
| A3 | [OAIC: privacy and developing and training generative AI models](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/guidance-on-privacy-and-developing-and-training-generative-ai-models) | OAIC · 21 Oct 2024 | Guidance · active | The Library holds OAIC's *commercial products* guide but not its developer and fine-tuning companion (APPs 1, 3, 5, 6 and 10). | **High** |
| A4 | [OAIC automated decision-making transparency guidance](https://www.oaic.gov.au/engage-with-us/consultations/consultation-on-guidance-for-transparency-in-automated-decision-making) | OAIC · issues paper 18 May 2026; final expected Sept 2026 | Guidance · *verify on apply* | Supports the new APP 1 ADM obligation that starts **10 Dec 2026**. That date is already on the timeline but has no source behind it. Add the final guidance if it is published; otherwise add the issues paper as a consultation. | **High** |
| A5 | [A Director's Guide to AI Governance v2](https://www.aicd.com.au/news-media/research-and-reports/a-directors-guide-to-ai-governance.html) | AICD and UTS Human Technology Institute · June 2026 | Framework · active | The board-facing Australian reference, now updated for agentic AI. It is not from a government body, so its authority note would say "industry guidance". | **High** |
| A6 | [RG 234 Advertising financial products and services](https://www.asic.gov.au/regulatory-resources/find-a-document/consultations/cs-37-proposed-update-to-asic-s-guidance-on-advertising-financial-products-and-services) | ASIC · 9 Jun 2026 | Guidance · *verify on apply* | First rewrite since 2012. It now expressly covers AI-generated advertising and warns against overstating AI advice tools ("AI-washing"). | **High** |
| A7 | [Australian Government AI technical standard](https://www.digital.gov.au/policy/ai/AI-technical-standard) | DTA · 31 Jul 2025 | Standard · active | 42 statements and 148 criteria across the lifecycle. It sits under the DTA AI policy already in the Library and is a good model for enterprise control design. | Medium |
| A8 | [NSW AI Assessment Framework](https://www.digital.nsw.gov.au/policy/artificial-intelligence/ai-governance-assurance-and-frameworks/nsw-ai-assessment-framework) and [DCS-2026-02](https://arp.nsw.gov.au/dcs-2026-02-use-of-artificial-intelligence-by-nsw-government-agencies) | NSW Government · 2026 revision | Policy · mandatory for NSW agencies | The Library's first state source. It is mandatory, revised for generative AI and aligned to standards. | Medium |
| A9 | [Review of AI and the Australian Consumer Law: final report](https://treasury.gov.au/publication/p2025-702329) | Treasury · 3 Oct 2025 | Research · final | Finds the Australian Consumer Law broadly fit for AI and proposes targeted amendments on "manufacturer" and supply chains. Useful for product liability questions. | Medium |
| A10 | Scams Prevention Framework Act 2025 and [draft codes (May 2026)](https://www.hsfkramer.com/insights/2026-06/stage-1-of-the-scams-prevention-framework) | Treasury · obligations from 1 Jul 2026, codes from 31 Mar 2027 | Law · phased · *verify on apply* | Binding duties on banks, telcos and platforms. AI-enabled scams such as voice cloning are a named driver. | Medium |
| A11 | [CPG 234 Information Security](https://www.apra.gov.au/practice-guides/cpg-234) | APRA · June 2019 | Guidance · active | Companion to CPS 234. It is dated, but APRA still points to it for security controls that apply to AI systems. | Low |

**Development-only, not new sources:** the Australian AI Safety Institute starting operations (early 2026) and the updated Guidance for AI Adoption tools. Both belong in *What's new* and link to existing records.

## B. Proposed additions: global financial regulators

| # | Source | Issuer · date | Type · status | Why add it | Priority |
|---|---|---|---|---|---|
| B1 | [Consultation Paper: Guidelines on AI Risk Management](https://www.mas.gov.sg/-/media/mas-media-library/publications/consultations/bd/2025/final_consultation_paper_on_guidelines_on_ai_risk_management_forrelease.pdf) | MAS · 13 Nov 2025 (closed 31 Jan 2026) | Guidance · consultation closed | Would apply to *all* Singapore financial institutions and all AI, including agentic AI, with a 12-month transition. MAS said on 5 Aug 2026 that it will be "finalised soon". Add it now and switch to the final version when issued. | **High** |
| B2 | [Supervisory Toolkit for AI Use in Capital Markets](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD823.pdf) | IOSCO · 25 May 2026 | Guidance · final | The global securities regulators' lifecycle toolkit, covering generative and agentic AI. It builds on the [Mar 2025 use-case report](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD788.pdf), which should be cited inside this record rather than added separately. | **High** |
| B3 | [Application Paper on the supervision of AI](https://www.iais.org/uploads/2025/07/Application-Paper-on-the-supervision-of-artificial-intelligence.pdf) | IAIS · 2 Jul 2025 | Guidance · final | The global insurance standard-setter applying the Insurance Core Principles to AI. It is the insurer counterpart to FSB and IOSCO, and relevant to APRA-regulated insurers. | **High** |
| B4 | [Opinion on AI governance and risk management](https://www.eiopa.europa.eu/publications/opinion-artificial-intelligence-governance-and-risk-management_en) | EIOPA · 6 Aug 2025 | Guidance · active | Explains how Solvency II, IDD and DORA apply to AI that is *not* high-risk under the AI Act. | **High** |
| B5 | [Mills Review: AI and the future of retail financial services](https://www.fca.org.uk/publications/calls-input/review-long-term-impact-ai-retail-financial-services-mills-review) | FCA · 6 Jul 2026 | Research · final | The UK conduct regulator's main AI statement, with seven priority recommendations. It also covers AI Live Testing. | **High** |
| B6 | [Circular: consumer protection in the use of generative AI](https://brdr.hkma.gov.hk/eng/doc-ldg/docId/20241107-1-EN) | HKMA · 19 Aug 2024 | Guidance · active | Requires GenAI output monitoring, human intervention and an opt-out for customers of Hong Kong banks. | **High** (*needs a new region*) |
| B7 | [Circular: use of generative AI language models](https://apps.sfc.hk/edistributionWeb/gateway/EN/circular/doc?refNo=24EC55) | SFC · 12 Nov 2024 | Guidance · active | Hong Kong licensed corporations. Sets four core principles and a "high-risk use case" test for investment advice. | **High** (*needs a new region*) |
| B8 | [Model Bulletin: use of AI systems by insurers](https://content.naic.org/sites/default/files/legal-adoption-map-ai-model-bulletin.pdf) | NAIC · Dec 2023, adopted by about 25 states by Jul 2026 | Guidance · adopted state by state | The de facto US insurance AI governance baseline. | Medium |
| B9 | [AI Act implications for the EU banking and payments sector](https://www.eba.europa.eu/sites/default/files/2025-11/d8b999ce-a1d9-4964-9606-971bbc2aaf89/AI%20Act%20implications%20for%20the%20EU%20banking%20sector.pdf) | EBA · Nov 2025 | Research · final | Finds no conflict between the AI Act and banking law, and focuses on credit scoring. A good *Compare* partner for the EU AI Act. | Medium |
| B10 | [Public statement on AI and investment services](https://www.esma.europa.eu/document/public-statement-ai-and-investment-services) | ESMA · 30 May 2024 | Guidance · active | How MiFID II applies to AI in retail investment services. | Medium |
| B11 | [Financial Stability in Focus: AI in the financial system](https://www.bankofengland.co.uk/financial-stability-in-focus/2025/april-2025) | Bank of England FPC · Apr 2025 | Research · final | The four AI channels to financial stability. The July 2026 Financial Stability Report now lists AI as a named systemic risk. | Medium |
| B12 | [AI Discussion Paper v1.1](https://www.fsa.go.jp/en/news/2026/20260303/aidp.html) | Japan FSA · 3 Mar 2026 | Research · active | Japan's supervisory stance, including the "risk of inaction". | Low (*needs a new region*) |

**Development-only:** the HKMA/SFC/IA/MPFA [GenA.I. Sandbox++](https://www.hkma.gov.hk/eng/news-and-media/press-releases/2026/03/20260305-3/) (Mar 2026; [first cohort, focused on agentic AI](https://www.hkma.gov.hk/eng/news-and-media/press-releases/2026/08/20260827-3/), Aug 2026) and the [BCBS May 2026 meeting](https://www.bis.org/press/p260520.htm) note on frontier AI and bank cyber risk. BCBS has no AI standard yet, so there is nothing to add as a source.

**Watch:** the [FSB final report on AI sound practices](https://www.fsb.org/) is due October 2026. It replaces the consultation record already in the Library. MAS B1 also goes final soon.

## C. Proposed changes to existing records

| Record | Change | Evidence |
|---|---|---|
| `au-privacy-act` | Add a section for **APP 1 automated-decision transparency** (from the POLA Act 2024, starting 10 Dec 2026) and link it to the existing timeline event `au-privacy-adm`, which currently has no section to point to. | [OAIC consultation](https://www.oaic.gov.au/engage-with-us/consultations/consultation-on-guidance-for-transparency-in-automated-decision-making) |
| `apra-cps-230` | **Not an error.** The `effective: 2026-07-01` flagged earlier is correct: it is the amended determination (exemptions for non-traditional service providers). Change the field to "Commenced 1 Jul 2025; amendments effective 1 Jul 2026" so readers don't misread it. | [APRA final amendments](https://www.apra.gov.au/news-and-publications/apra-finalises-targeted-amendments-to-cps-230-operational-risk-management) |
| `au-ai-adoption-guidance` | `published` should be **2025-10-21**, with "Updated 2026-05-05". It currently shows only the update date. Note that it replaced the 2024 Voluntary AI Safety Standard. | [NAIC](https://www.ai.gov.au/staying-safe-and-responsible/essential-ai-practices/guidance-ai-adoption-foundations) |
| `eu-ai-act` | The timeline already has the Digital Omnibus dates (Annex III 2 Dec 2027, Annex I 2 Aug 2028). The source record itself doesn't mention the omnibus, so add a line to its status and scope noting it was amended by the Digital Omnibus on AI (in force 27 Jul 2026). | [Council, 29 Jun 2026](https://www.consilium.europa.eu/en/press/press-releases/2026/06/29/artificial-intelligence-council-gives-final-green-light-to-simplify-and-streamline-rules/) |
| `uk-ai-white-paper` | Update the authority note: the government has confirmed there will be no horizontal AI bill in the short to medium term, so the white paper remains the operative framework. Remove the implication that it is interim. | [Commons Library CBP-10003](https://commonslibrary.parliament.uk/research-briefings/cbp-10003/) |
| `us-sr-26-2` | State that generative and agentic AI are **outside its scope**. Readers otherwise assume model risk guidance covers large language models. | [SR 26-2](https://www.federalreserve.gov/supervisionreg/srletters/SR2602.htm) |
| `mas-ai-mrm` | Relabel as the 2024 information paper that led to the B1 guidelines, and link the two. | — |
| `iso-42001` | Note the Australian adoption as AS ISO/IEC 42001:2023. | Standards Australia |

## D. Proposed removals, converting sources to *What's new* items

Methodology rule 6 says a permanent source must have "distinct lasting reference value". These records are announcements rather than reference documents. I would move them to development cards linked to the source they support. They would still appear in *What's new* and in Ask answers.

| Record | Why | Would link to |
|---|---|---|
| `apra-frontier-speech-2026` | A speech with one summary-only section | `apra-ai-letter-2026` |
| `apra-asic-frontier-roundtables-2026` | Roundtable notes, summary only | `apra-ai-letter-2026`, `asic-ai-cyber-letter` |
| `fsb-frontier-letter-2026` | A covering letter, summary only | `fsb-ai-sound-practices` |
| `five-eyes-frontier-statement` | A joint statement, summary only | `asd-frontier-board` |
| `iso-tr-24028` | A 2020 technical report superseded in practice by ISO/IEC 42001, 23894 and 42005. Low decision value. | — (remove) |

## E. Model change needed first

`Instrument.region` only allows Australia, Global, Europe, United States, United Kingdom, Singapore and Canada. Adding B6, B7 and B12 needs **Hong Kong** and **Japan** added to the region list, the region filter and the region colours.

## Net effect if everything is approved

86 sources → **104** (+23 added, −5 converted or removed). Australia goes from 30 to 39. The 12 global financial additions give the Library its first coverage of IOSCO, IAIS, EIOPA, EBA, ESMA, FCA, HKMA, SFC, NAIC and Japan's FSA.
