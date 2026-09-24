import type { Incident } from './incidents'
import type { AssurancePrompt } from './assuranceQuestions'

/* Incidents added in the 2026-09 ontology review. Drafted for editorial review. */
export const reviewIncidents: Incident[] = [
{
 id:'robodebt-scheme',title:'Robodebt: automated welfare debts found unlawful',shortTitle:'Robodebt',
 classification:'Automated decision-making failure (rule-based, not machine learning)',disclosureLabel:'Government ends averaging-only debts',
 reviewScope:'The Royal Commission’s recommendations and selected report passages, plus the Government response, were reviewed. Hearing evidence, the sealed chapter and the outcomes of later referrals were not reviewed.',
 occurred:'2015–2019 (pilot 2015; online system from July 2016)',disclosed:'2019-11-19',updated:'2023-07-07',reviewed:'2026-09-25',
 summary:'The Commonwealth’s income compliance scheme used averaged tax-office income data to raise welfare debts. Recipients who did not disprove the figures were left with a debt. A Royal Commission found the scheme unlawful and harmful.',
 implication:'Automation can repeat an unlawful or untested rule across hundreds of thousands of people. Confirm the legal basis, test outcomes for affected people and act on early adverse decisions before scaling.',
 topics:['fairness','transparency','governance','testing'],
 sources:[
 {title:'Royal Commission into the Robodebt Scheme: report',url:'https://robodebt.royalcommission.gov.au/publications/report',role:'Royal Commission findings · 7 July 2023; corrected edition 11 July 2023'},
 {title:'Australian Government response to the Royal Commission',url:'https://www.pmc.gov.au/resources/government-response-royal-commission-robodebt-scheme',role:'Government response · 13 November 2023'},
 ],
 findings:[
 {text:'The Commissioner found that income averaging, as used, neither produced accurate results nor complied with the income calculation provisions of the Social Security Act 1991. The onus was placed on recipients to disprove the debts raised.',source:0},
 {text:'The online system was fully rolled out in September 2016 with unresolved defects, without proper evaluation of the pilot and without user testing of the screens recipients used.',source:0},
 {text:'The report records refunds of $746 million to about 381,000 people and a $112 million class-action settlement approved by the Federal Court.',source:0},
 {text:'The Government accepted recommendations for a consistent legal framework for automated decision-making, including review rights, plain-language disclosure and business rules open to independent expert scrutiny, and for a body to monitor and audit such processes.',source:1},
 ],
 limitations:'Robodebt was a rule-based data-matching and debt-raising system, not a machine-learning model. It is included for its lessons on automated decision-making. The Commission also examined legal advice, ministerial conduct and public-service culture; this card does not summarise individual findings about named people.',
 connections:[
 {conceptId:'impact-assessment',controlId:'impact-risk-assessment',reason:'The report finds the scheme was devised without regard to social security law. It also records internal advice in 2014 that the proposal was unlawful.',practice:'Confirm legal authority and assess effects on vulnerable groups before automating decisions about people, and record who accepted any doubts.'},
 {conceptId:'reliability',controlId:'fit-for-purpose-evaluation',reason:'The online system was fully rolled out without a proper evaluation of the pilot or user testing.',practice:'Require evaluation of accuracy and usability against real cases before expansion, with results reported to the approver.'},
 {conceptId:'contestability',controlId:'contestability-redress',reason:'Recipients carried the burden of disproving debts, and the letters did not reveal that averaging was used.',practice:'Explain the method in notices, keep review routes accessible and never treat silence as proof of a debt.'},
 {conceptId:'continuous-monitoring',controlId:'runtime-monitoring',reason:'Adverse tribunal decisions and a 2018 draft legal advice did not lead to the scheme being stopped.',practice:'Treat overturned decisions, complaint trends and adverse legal advice as monitored thresholds, each with a named owner who must escalate.'},
 ],
 prompts:{
 board:{text:'Which of our automated decisions could affect people at scale, and how do we know each one is lawful?',askFor:'An inventory of automated decisions affecting customers or citizens, with the legal or contractual authority, impact assessment and latest independent challenge for each.',followUp:'Where has advice raised doubts about legality, and who decided to proceed?'},
 executive:{text:'If an automated process starts producing overturned decisions or complaints, how quickly would we pause it?',askFor:'Thresholds for complaints, overturned decisions and error rates; escalation records; and the named owner with authority to suspend the process.',followUp:'Show an occasion when a signal led to a pause or redesign rather than a workaround.'},
 regulator:{text:'How can affected people understand and challenge an automated decision without carrying the burden of proof alone?',askFor:'Customer notices explaining the method, review pathways, reversal rates and evidence that business rules are available for independent scrutiny.',followUp:'What happens to people who do not respond to a request for information?'},
 }
},
{
 id:'deloitte-dewr-report-2025',title:'Deloitte report for DEWR corrected after citation errors linked to AI use',shortTitle:'Deloitte DEWR report',
 classification:'Professional-services deliverable with AI-linked errors',disclosureLabel:'Corrected report published',
 reviewScope:'Department web pages, the updated report’s method and update notes, and redacted FOI correspondence (LEX 1820) reviewed. Deloitte’s 2 September 2025 letter to the Department of Finance was seen only as described by DEWR. The review’s substantive findings were not assessed.',
 occurred:'Report dated 4 July 2025; published 14 August 2025',disclosed:'2025-10-03',updated:'2025-12-11',reviewed:'2026-09-25',
 summary:'Deloitte’s independent assurance review of the Targeted Compliance Framework for the Department of Employment and Workplace Relations contained incorrect citations and a misstated court summary. After media reports, the report was corrected, AI use was disclosed and the department sought repayment of the final instalment.',
 implication:'Using AI in advice or assurance work does not reduce the need to verify what is delivered. Agree AI use and disclosure in the contract, check sources before relying on a report, and keep the review evidence.',
 topics:['third-party','evidence','transparency','governance'],
 sources:[
 {title:'DEWR: Targeted Compliance Framework Assurance Review – Final Report',url:'https://www.dewr.gov.au/assuring-integrity-targeted-compliance-framework/resources/targeted-compliance-framework-assurance-review-final-report',role:'Department publication of the updated report · page updated 3 February 2026'},
 {title:'DEWR: Secretary statement on the TCF Integrity Assurance program',url:'https://www.dewr.gov.au/assuring-integrity-targeted-compliance-framework/announcements/statement-secretary-progress-under-targeted-compliance-framework-integrity-assurance-program',role:'Department statement · 3 October 2025'},
 {title:'DEWR: correspondence with Deloitte released under FOI (LEX 1820)',url:'https://www.dewr.gov.au/assuring-integrity-targeted-compliance-framework/resources/correspondence-relating-targeted-compliance-framework-assurance-review',role:'Redacted department–supplier correspondence, 6 August to 6 October 2025 · released 11 December 2025'},
 {title:'The Guardian: Deloitte to pay money back to Albanese government',url:'https://www.theguardian.com/australia-news/2025/oct/06/deloitte-to-pay-money-back-to-albanese-government-after-using-ai-in-440000-report',role:'Reporting with department and Deloitte statements · 6 October 2025'},
 ],
 findings:[
 {text:'The department says the review was published on 14 August 2025. After media reports on citation accuracy, Deloitte confirmed that some footnotes and references were incorrect, and corrected versions were released.',source:1},
 {text:'The updated report corrects citations and the summary of the Amato proceeding, and states that the changes do not affect its findings or recommendations. Its method now records an Azure OpenAI GPT-4o tool chain, licensed by DEWR, used in the technical workstream.',source:0},
 {text:'In a letter of 8 September 2025, DEWR said Deloitte had told the Department of Finance that generative AI tools used to summarise a legal case and format citations likely contributed to the errors. DEWR said it had agreed to AI tools for analysing IT code, had not been told the errors were attributed to generative AI, and asked for the final instalment ($97,587.11 including GST) to be repaid.',source:2},
 {text:'DEWR confirmed that Deloitte would repay the final instalment. Deloitte said the matter had been resolved directly with the client.',source:3},
 ],
 limitations:'The account of how the errors arose comes from DEWR’s description of Deloitte correspondence, released with redactions. DEWR and Deloitte both state that the findings and recommendations were unchanged; this card does not assess the review’s substance or compliance with professional standards. A further update to the report on 3 February 2026 was not reviewed. Completion of the repayment rests on reported departmental statements.',
 connections:[
 {conceptId:'third-party-risk',controlId:'third-party-assessment',reason:'The department relied on and published a supplier deliverable whose errors were identified externally after publication.',practice:'Set contract terms for supplier AI use and verification, and sample-check sources and quotations before accepting or publishing a deliverable.'},
 {conceptId:'transparency-disclosure',controlId:'ai-notice-disclosure',reason:'DEWR cites Deloitte’s acknowledgement that its internal policy on telling the client about AI use was not followed.',practice:'Require AI use in deliverables to be disclosed at delivery, stating which tasks it supported and how outputs were checked.'},
 {conceptId:'evidence-quality',controlId:'records-traceability',reason:'Corrections replaced citations and a court summary in a report on which the department was relying.',practice:'Link each material claim to a verified source and keep a record of who checked it before issue.'},
 ],
 prompts:{
 board:{text:'When we rely on external advice or assurance, do we know whether the supplier used AI and how its outputs were checked?',askFor:'Contract clauses on supplier AI use, disclosures received for material deliverables and the acceptance checks applied before reliance or publication.',followUp:'Which deliverables relied on by the board were accepted without independent checks of their sources?'},
 executive:{text:'Where our teams use AI in client or stakeholder deliverables, how do we verify its outputs and tell the recipient?',askFor:'The policy on AI use in deliverables, client approvals, citation and quotation checks and quality-review sign-offs for recent work.',followUp:'Can we show that the requirement to tell clients about AI use was met for a sample of recent engagements?'},
 regulator:{text:'How does the organisation show that AI-assisted analysis in reports relied on by government or the public has been verified?',askFor:'Disclosure statements, verification methods for citations and quotations, correction logs and contract terms on AI use.',followUp:'After a correction, how was it established that the conclusions did not depend on the erroneous material?'},
 }
},
{
 id:'air-canada-chatbot-2024',title:'Tribunal holds Air Canada responsible for its chatbot’s advice',shortTitle:'Air Canada chatbot',
 classification:'Customer-facing chatbot misinformation with legal finding',disclosureLabel:'Tribunal decision',
 reviewScope:'Full tribunal reasons (Moffatt v. Air Canada, 2024 BCCRT 149) reviewed, plus one legal commentary. Air Canada’s chatbot design and any later changes were not reviewed.',
 occurred:'11 November 2022',disclosed:'2024-02-14',updated:'2024-02-14',reviewed:'2026-09-25',
 summary:'Air Canada’s website chatbot told a customer that a bereavement fare could be claimed after travel, which contradicted the airline’s policy page. British Columbia’s Civil Resolution Tribunal found the airline liable for negligent misrepresentation.',
 implication:'An organisation remains responsible for what its automated assistants tell customers. Keep answers consistent with current policy, monitor them and give customers a remedy when the assistant is wrong.',
 topics:['fairness','resilience','transparency','governance'],
 sources:[
 {title:'Civil Resolution Tribunal: Moffatt v. Air Canada, 2024 BCCRT 149',url:'https://decisions.civilresolutionbc.ca/crt/crtd/en/item/525448/index.do',role:'Tribunal reasons for decision · 14 February 2024'},
 {title:'ABA Business Law Today: BC tribunal confirms companies remain liable for chatbot information',url:'https://businesslawtoday.org/2024/02/bc-tribunal-confirms-companies-remain-liable-for-information-provided-by-ai-chatbot/',role:'Legal commentary · 29 February 2024'},
 ],
 findings:[
 {text:'The chatbot said a reduced bereavement rate could be requested within 90 days of ticketing, including after travel. The linked policy page said the policy did not apply once travel was complete.',source:0},
 {text:'Air Canada argued it could not be liable for information from the chatbot. The tribunal called this a “remarkable submission”, finding the chatbot was part of Air Canada’s website and that it made no difference whether information came from a static page or a chatbot.',source:0},
 {text:'In February 2023 an Air Canada representative admitted the chatbot had provided “misleading words”. The tribunal ordered Air Canada to pay $812.02, comprising damages, interest and fees.',source:0},
 ],
 limitations:'Air Canada gave the tribunal no information about how its chatbot worked, so the role of AI or a language model is not established. This is a small-claims decision binding on the parties, not an appellate precedent. The amount is small; the significance lies in the reasoning about responsibility.',
 connections:[
 {conceptId:'accountability',controlId:'accountable-ownership',reason:'The tribunal rejected the argument that the airline was not responsible for its chatbot.',practice:'Assign a named business owner for each customer-facing assistant who is accountable for what it tells customers.'},
 {conceptId:'reliability',controlId:'fit-for-purpose-evaluation',reason:'The chatbot’s answer contradicted the airline’s published policy.',practice:'Test assistants with policy-based questions before release and after every policy change.'},
 {conceptId:'contestability',controlId:'contestability-redress',reason:'The airline acknowledged the error a year before the tribunal decision but did not resolve it for the customer.',practice:'Give complaint handlers authority to honour or remedy incorrect assistant advice, and track resolution times.'},
 ],
 prompts:{
 board:{text:'Are we treating everything our customer-facing AI says as our own statement, with the accountability that follows?',askFor:'The owner of each customer-facing assistant, accuracy results against current policy and complaint and remediation data.',followUp:'What remediation or liability have we accepted for assistant errors, and how is it reported to us?'},
 executive:{text:'How do we keep chatbot answers consistent with current policies, fees and terms?',askFor:'Controls over the assistant’s content sources, policy-based test sets, release checks after policy changes and reviews of sampled conversations.',followUp:'When a chatbot error is reported, how long until it is fixed and affected customers are remedied?'},
 regulator:{text:'What evidence shows customers are not disadvantaged when they rely on an organisation’s chatbot?',askFor:'Accuracy monitoring, handling records for chatbot-related complaints, remediation decisions and disclosures about the assistant.',followUp:'Does the organisation honour what its assistant told customers, or expect them to check elsewhere?'},
 }
},
{
 id:'arup-deepfake-fraud-2024',title:'Deepfake video call leads Arup employee to transfer HK$200 million',shortTitle:'Arup deepfake fraud',
 classification:'AI-enabled impersonation fraud',disclosureLabel:'Hong Kong Police briefing',
 reviewScope:'News reports of police statements and of Arup’s confirmation reviewed, plus an Australian Government case study. No primary police release, investigation file or Arup incident report was available.',
 occurred:'January 2024 (reported to police 29 January)',disclosed:'2024-02-04',updated:'2024-05-17',reviewed:'2026-09-25',
 summary:'A finance employee in Arup’s Hong Kong office joined a video call in which the other participants, including someone posing as the UK-based chief financial officer, were fake. The employee then made 15 transfers totalling about HK$200 million.',
 implication:'Seeing and hearing a senior executive is no longer reliable verification. High-value payments need checks that work even when everyone on a call appears genuine.',
 topics:['security','transparency','governance','resilience'],
 sources:[
 {title:'CNN: Arup revealed as victim of deepfake scam',url:'https://www.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk',role:'Reporting with Arup’s statement · 17 May 2024'},
 {title:'Hong Kong Free Press (AFP): police describe deepfake video conference scam',url:'https://hongkongfp.com/2024/02/05/multinational-loses-hk200-million-to-deepfake-video-conference-scam-hong-kong-police-say/',role:'Reporting of police briefing; company not named · 5 February 2024'},
 {title:'Commonwealth Fraud Prevention Centre: case study',url:'https://www.counterfraud.gov.au/case-studies/company-worker-hong-kong-pays-out-ps20m-deepfake-video-call-scam',role:'Australian Government summary of broadcaster reporting of police statements · date not stated'},
 ],
 findings:[
 {text:'Police said they received the report on 29 January 2024, by which time about HK$200 million had been lost through 15 transfers. They said the fakes were built from publicly available video and audio and were pre-recorded rather than interactive.',source:1},
 {text:'Police were quoted as saying the employee made the transfers to five local bank accounts after a multi-person video conference in which the participants looked like real colleagues.',source:2},
 {text:'Arup confirmed that “fake voices and images were used”. It said its financial stability and operations were not affected and no internal systems were compromised. Police said the employee had first suspected a phishing email requesting a secret transaction.',source:0},
 ],
 limitations:'Accounts of the police statements come from media reports. Arup declined to give details because the investigation was ongoing. The techniques used were not independently verified. Arrests and recovery of funds were not established from the sources reviewed. The US-dollar equivalent (about US$25.6 million) is as reported.',
 connections:[
 {conceptId:'decision-rights',controlId:'decision-rights-approval',reason:'A payment instruction was accepted on the apparent authority of a senior executive seen on a video call.',practice:'Require call-back verification using independently held contact details, plus dual authorisation, for urgent or confidential payments, whoever appears to request them.'},
 {conceptId:'content-authenticity',controlId:'adversarial-security-testing',reason:'Synthetic voices and images were convincing enough to override the employee’s initial doubts.',practice:'Run simulated deepfake impersonation exercises against finance and treasury processes and fix the gaps they reveal.'},
 {conceptId:'competence',controlId:'competence-challenge',reason:'The employee’s early suspicion was set aside once colleagues appeared on the call.',practice:'Train staff that challenging a senior request is expected, and make escalation easy and free of blame.'},
 {conceptId:'incident-response',controlId:'incident-response-reporting',reason:'The fraud surfaced after all 15 transfers were made.',practice:'Rehearse fast bank recall, police reporting and internal escalation for suspected payment fraud.'},
 ],
 prompts:{
 board:{text:'Could a convincing video call with our senior executives lead to a large payment without independent verification?',askFor:'Payment authorisation rules for urgent or confidential requests, call-back requirements and results of impersonation exercises.',followUp:'Do our executives themselves respect these checks, so staff know they must apply them?'},
 executive:{text:'Which payment and approval workflows rely on recognising a person’s face or voice?',askFor:'A map of voice- and video-based approvals, verification steps through a separate channel, dual-authorisation thresholds and bank recall procedures.',followUp:'How quickly could we detect a fraudulent transfer and attempt to recall it?'},
 regulator:{text:'How does the organisation test that its payment controls withstand synthetic voice and video impersonation?',askFor:'Control design for high-value transfers, results of simulated deepfake tests, staff training coverage and incident reporting records.',followUp:'Which controls remain effective if every participant on a call appears genuine?'},
 }
},
{
 id:'dutch-childcare-benefits-scandal',title:'Dutch childcare benefits: nationality used in a fraud risk model',shortTitle:'Dutch childcare benefits',
 classification:'Discriminatory algorithmic risk selection in public administration',disclosureLabel:'Data protection authority findings',
 reviewScope:'Dutch Data Protection Authority announcements (2020 findings, 2021 fine) and the English translation of the parliamentary inquiry report reviewed. The authority’s full Dutch-language report and fine decision, and the compensation scheme, were not reviewed.',
 occurred:'Nationality used as a risk indicator from at least March 2016 to October 2018',disclosed:'2020-07-17',updated:'2021-12-07',reviewed:'2026-09-25',
 summary:'The Dutch Tax Administration used a self-learning risk-classification model to select childcare benefit applications for extra checks. The data protection authority found that the use of applicants’ nationality in it and related systems was unlawful and discriminatory.',
 implication:'A risk model can embed discrimination through the data it is allowed to use. Justify every indicator, delete data that is no longer permitted and check what happens to people once they are flagged.',
 topics:['fairness','data','risk','transparency'],
 sources:[
 {title:'Dutch Data Protection Authority: methods unlawful and discriminatory',url:'https://www.autoriteitpersoonsgegevens.nl/en/current/methods-used-by-dutch-tax-administration-unlawful-and-discriminatory',role:'Regulator investigation findings · 17 July 2020'},
 {title:'Dutch Data Protection Authority: Tax Administration fined',url:'https://www.autoriteitpersoonsgegevens.nl/en/current/tax-administration-fined-for-discriminatory-and-unlawful-data-processing',role:'Regulator sanction · 7 December 2021'},
 {title:'House of Representatives: ‘Unprecedented injustice’ inquiry report',url:'https://www.houseofrepresentatives.nl/sites/default/files/atoms/files/verslag_pok_definitief-en-gb.docx.pdf',role:'Parliamentary inquiry report (English translation) · 17 December 2020'},
 ],
 findings:[
 {text:'The inquiry describes a self-learning risk-classification model, using several dozen indicators, that selected applications considered suspect for additional manual checks.',source:2},
 {text:'The authority found nationality (Dutch or not Dutch) was used as an indicator in a system that automatically designated applications as risky. Dual-nationality data that should have been deleted in 2014 was retained for about 1.4 million people in May 2018. It found this unlawful and discriminatory.',source:0},
 {text:'The authority fined the Minister of Finance €2.75 million. It reported that nationality had not been used to determine risk since October 2018 and that dual-nationality data was deleted in 2020.',source:1},
 {text:'The inquiry found that basic principles of the rule of law were breached in administering the allowance, through inflexible legislation and a hardline anti-fraud approach.',source:2},
 ],
 limitations:'The wider harm to families arose largely from the anti-fraud approach examined by the inquiry, which excluded nationality-based risk profiles from its remit. The authority said the specific consequences for individual applicants were outside its investigation. This card does not attribute the whole affair to the model, and does not state numbers of affected families.',
 connections:[
 {conceptId:'fairness-bias',controlId:'fairness-rights-testing',reason:'Nationality was used as a risk indicator, although entitlement depended on lawful residence, not nationality.',practice:'Test risk models for differences in outcomes between groups, including through proxies, and remove indicators that cannot be justified.'},
 {conceptId:'privacy',controlId:'privacy-data-protection',reason:'Nationality data was retained and used for purposes for which it was not necessary.',practice:'Enforce data minimisation and deletion schedules for sensitive attributes, and verify deletion in source systems.'},
 {conceptId:'model-risk',controlId:'impact-risk-assessment',reason:'Selection by the model subjected applicants to additional checks and demands for documents.',practice:'Assess the downstream treatment triggered by a risk score, not only the model’s accuracy, before and during use.'},
 ],
 prompts:{
 board:{text:'Could any of our risk or fraud models treat people differently because of nationality or another protected attribute, directly or by proxy?',askFor:'An inventory of risk-scoring models, their indicators, the legal basis for each sensitive attribute and fairness test results.',followUp:'Who approves the indicators, and when did someone independent last challenge them?'},
 executive:{text:'For each fraud-risk model, can we justify every indicator as necessary and lawful?',askFor:'Documentation for each indicator, data retention and deletion records, analysis of outcomes by group and the actions triggered by a high score.',followUp:'What happens to a person after the model flags them, and how often are flags wrong?'},
 regulator:{text:'How does the organisation prevent risk selection from becoming discriminatory treatment of groups?',askFor:'Data protection impact assessments, fairness testing by group, records of indicator removal and evidence that follow-up checks are proportionate.',followUp:'Can individuals find out that a risk score influenced their treatment, and challenge it?'},
 }
},
]

export const reviewIncidentAssurancePrompts: Record<string, AssurancePrompt> = {
 'robodebt-scheme':{
  text:'Could we trace a sample of automated decisions back to the legal rule, data and business logic that produced them?',
  askFor:'Business rules mapped to legislation, the legal advice register, pilot evaluation and user-testing results, and trends in overturned decisions over the period.',
  followUp:'Which adverse external decisions or legal advice were received but not escalated, and what does that show about control operation?',
 },
 'deloitte-dewr-report-2025':{
  text:'Before relying on a supplier’s report, what testing would show that its citations and quotations are accurate and its AI use was approved?',
  askFor:'A sample re-check of cited sources and quotations, the approved scope of AI use, the supplier’s disclosure and the version history of the deliverable.',
  followUp:'Did any AI use fall outside the approved scope, and would our acceptance procedures have detected it?',
 },
 'air-canada-chatbot-2024':{
  text:'Could we test a sample of chatbot answers against the policy in force on the date each was given?',
  askFor:'Time-stamped conversation logs, versioned policy content, the assistant’s knowledge-source configuration and related complaint records.',
  followUp:'Is there a control that detects contradictions between assistant answers and published policy, and did it operate during the period?',
 },
 'arup-deepfake-fraud-2024':{
  text:'How would we test that call-back verification operated for every high-value payment instructed by call, video or message?',
  askFor:'A sample of high-value payments with call-back evidence, authorisation logs, approved exceptions and results of impersonation exercises.',
  followUp:'Were any payments released on an executive’s instruction alone, and how were those exceptions approved?',
 },
 'dutch-childcare-benefits-scandal':{
  text:'Could we reconstruct which indicators drove a sample of high-risk selections, and test each against the data-use rules in force at the time?',
  askFor:'Model versions and indicator lists over time, data deletion evidence, samples of selections with their outcomes and analysis of outcomes by group.',
  followUp:'Were sensitive attributes still held in source systems after they should have been deleted, and could proxies have reintroduced them?',
 },
}
