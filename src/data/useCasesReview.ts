import type { UseCase } from './useCases'
import type { AssurancePrompt } from './assuranceQuestions'

/* Production use cases added in the 2026-09 ontology review. Drafted for editorial review.
 * Each record rests on the operator's own dated public account; secondary reports are listed only for context.
 * Publication dates never inherit the review date. */
export const reviewUseCases: UseCase[] = [
  {
    "id": "suncorp-claims-genai",
    "company": "Suncorp",
    "title": "Claim summaries and motor fault reviews",
    "workflow": "operations",
    "sector": "Financial services",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "19 August 2025",
    "published": "2025-08-19",
    "reviewed": "2026-09-25",
    "summary": "Suncorp reports generative AI tools that summarise claim status for frontline teams and review motor claim documents to assess fault and settlement contributions.",
    "before": "Frontline teams collated and interpreted claim information by hand; claims managers reviewed motor claim documents to decide fault and each party’s contribution.",
    "actions": "Single View of Claim extracts information and generates a claim status summary, now extended from home and motor to personal injury schemes. A motor settlement tool reviews claim documents to determine the at-fault party and how much each party should contribute.",
    "human": "Suncorp says the motor tool lets claims managers focus on complex claims and customers. The account does not say whether a person confirms each fault or settlement determination.",
    "value": "Suncorp reports delivering more than 20 generative AI use cases in FY25. It gives no separate accuracy, volume or time results for these two claims tools.",
    "limitations": "The tools are named as delivered in a results feature, without rollout dates, claim volumes or error rates. Other tools in the same account, including complaint summaries and communication triage, were still being trialled and are excluded. Personal injury schemes can involve injured third parties as well as policyholders.",
    "topics": [
      "fairness",
      "evidence",
      "testing"
    ],
    "sources": [
      {
        "title": "Suncorp · deployment account",
        "url": "https://www.suncorpgroup.com.au/news/news/fy25-tech-milestones-suncorp"
      }
    ],
    "connections": [
      {
        "conceptId": "human-oversight",
        "controlId": "decision-rights-approval",
        "reason": "A fault and contribution determination affects what customers and third parties pay; who confirms it must be clear."
      },
      {
        "conceptId": "traceability",
        "controlId": "records-traceability",
        "reason": "A generated claim summary can shape later decisions; staff need to trace it back to the claim file."
      }
    ],
    "prompts": {
      "board": {
        "text": "Where does AI influence who is found at fault in a motor claim, and who remains accountable for that outcome?",
        "askFor": "The claims decisions AI informs, accountable owners, dispute and complaint trends, and rates at which AI assessments are overturned.",
        "followUp": "Would we know if customers were disputing AI-assisted settlements more often?"
      },
      "executive": {
        "text": "What must a claims manager check before relying on an AI fault assessment or claim summary?",
        "askFor": "Review procedures, sampled claims comparing AI outputs with final decisions, testing on difficult documents and escalation rules.",
        "followUp": "How is a summary corrected when the claim file changes after it was generated?"
      },
      "regulator": {
        "text": "How can a policyholder or injured person challenge a fault or settlement outcome that AI helped to form?",
        "askFor": "Customer disclosures, dispute records, sampled decisions with evidence of human review, and outcomes for vulnerable claimants.",
        "followUp": "Can the insurer explain a disputed determination from the documents the tool relied on?"
      }
    }
  },
  {
    "id": "iag-predictive-total-loss",
    "company": "IAG",
    "title": "Predicting motor total losses",
    "workflow": "customers",
    "sector": "Financial services",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "30 November 2020",
    "published": "2020-11-30",
    "reviewed": "2026-09-25",
    "summary": "IAG uses a machine-learning model to predict whether a car is a total loss from claim lodgement information, speeding claims for NRMA Insurance, SGIC and SGIO customers.",
    "before": "A damaged vehicle was towed to a repairer and assessed before a total loss could be confirmed, which could take more than three weeks.",
    "actions": "Predicts a potential total loss from information the customer gives by phone or online. Process automation removes manual steps, and the customer is told of the likely outcome by text message the next day.",
    "human": "The account does not say who confirms a total loss. IAG says it set conservative model thresholds to reduce wrongly predicted total losses.",
    "value": "IAG reports more than 90% accuracy in detecting a potential total loss, claim times up to two and a half weeks shorter, and higher advocacy in total loss customer surveys.",
    "limitations": "This is a 2020 deployment account; current use, model changes and performance need renewed verification. The accuracy figure has no published test method, and error rates for customers wrongly told their car may be written off are not reported. IAG says an AI ethics framework review preceded go-live, but the assessment itself is not published.",
    "topics": [
      "risk",
      "transparency",
      "fairness"
    ],
    "sources": [
      {
        "title": "IAG · deployment account",
        "url": "https://www.iag.com.au/iag-embeds-artificial-intelligence-reduce-claims-times-and-improve-customer-experience-after-car"
      }
    ],
    "connections": [
      {
        "conceptId": "impact-assessment",
        "controlId": "impact-risk-assessment",
        "reason": "A pre-launch review of benefits, harms and thresholds needs repeating when the model or claims process changes."
      },
      {
        "conceptId": "contestability",
        "controlId": "contestability-redress",
        "reason": "A customer told their car is likely written off needs a clear way to question the prediction before settlement."
      }
    ],
    "prompts": {
      "board": {
        "text": "When a model predicts a claim outcome early, how do we know wrong predictions are rare and caught before customers are harmed?",
        "askFor": "Error rates in both directions, reversed predictions, related complaints and the approved threshold decisions.",
        "followUp": "Who approved the trade-off between faster claims and wrongly predicted total losses?"
      },
      "executive": {
        "text": "Is the pre-launch ethics review still valid for the model and process we run today?",
        "askFor": "The original assessment, later model versions, threshold changes, monitoring results and any reassessment records.",
        "followUp": "Which change would trigger a fresh review?"
      },
      "regulator": {
        "text": "How are customers told that a total loss outcome is a prediction, and how can they dispute it?",
        "askFor": "Customer messages, dispute and complaint records, sampled reversals and evidence of fair treatment across customer groups.",
        "followUp": "Are some vehicle or customer groups more likely to receive a wrong prediction?"
      }
    }
  },
  {
    "id": "services-australia-disaster-fraud",
    "company": "Services Australia",
    "title": "Screening disaster payment claims for fraud",
    "workflow": "risk",
    "sector": "Government",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "Agency web page updated 14 July 2026",
    "published": null,
    "reviewed": "2026-09-25",
    "summary": "A human-supervised machine-learning model flags Australian Government Disaster Recovery Payment claims that need fraud checks before they can be paid.",
    "before": "The agency aims to pay people affected by disasters quickly while stopping payments to fraudsters, using pre-payment checks.",
    "actions": "Scans claims for patterns consistent with known fraud, stops flagged claims from being paid automatically and sends them to a fraud analyst. The model is trained on claims previously proven to be fraudulent.",
    "human": "Services Australia says the model does not decide claim outcomes or whether fraud occurred; a fraud analyst investigates each flagged claim.",
    "value": "The agency does not publish detection, false-positive or payment-delay results for the model.",
    "limitations": "The agency’s page does not say when the model entered use. In February 2025 Senate estimates, officials described machine-learning fraud work as a trial. Training on past proven fraud may miss new schemes and reflect how earlier cases were found. Delays from wrongly flagged claims fall on people affected by disasters.",
    "topics": [
      "fairness",
      "agentic",
      "transparency"
    ],
    "sources": [
      {
        "title": "Services Australia · deployment account",
        "url": "https://www.servicesaustralia.gov.au/how-we-use-artificial-intelligence"
      },
      {
        "title": "Services Australia · AI transparency statement",
        "url": "https://www.servicesaustralia.gov.au/automation-and-artificial-intelligence-transparency-statement"
      },
      {
        "title": "iTnews · Senate estimates report (February 2025)",
        "url": "https://www.itnews.com.au/news/services-australia-describes-fraud-debt-related-machine-learning-use-cases-615323"
      }
    ],
    "connections": [
      {
        "conceptId": "fairness-bias",
        "controlId": "fairness-rights-testing",
        "reason": "A model trained on past proven fraud may flag some claimant groups more often, delaying their emergency payments."
      },
      {
        "conceptId": "human-oversight",
        "controlId": "competence-challenge",
        "reason": "Analysts must be able to release a flagged claim promptly rather than defer to the model under disaster workloads."
      }
    ],
    "prompts": {
      "board": {
        "text": "How do we know the fraud model is not delaying genuine disaster payments for particular communities?",
        "askFor": "Flag rates, release rates after review, time to payment for flagged claims, and results by region and claimant group.",
        "followUp": "What is the longest a genuine claimant has waited because of a model flag?"
      },
      "executive": {
        "text": "How is the model kept current as fraud patterns change from one disaster to the next?",
        "askFor": "Retraining and validation records, analyst release rates, drift monitoring and the approval for each model version.",
        "followUp": "What would prompt the agency to pause the model during a major disaster?"
      },
      "regulator": {
        "text": "What evidence shows people remain the decision-makers and flagged claimants are treated fairly?",
        "askFor": "Analyst decision records, override rates, fairness testing, privacy assessments and complaint or review outcomes.",
        "followUp": "Can a claimant find out that a model flag delayed their payment?"
      }
    }
  },
  {
    "id": "nab-customer-brain",
    "company": "NAB",
    "title": "Choosing the next best action for each customer",
    "workflow": "customers",
    "sector": "Financial services",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "6 June 2025",
    "published": "2025-06-06",
    "reviewed": "2026-09-25",
    "summary": "NAB’s Customer Brain, launched in 2023, uses customer data and adaptive models to choose reminders, nudges and offers across digital, phone and branch channels.",
    "before": "Bankers and channels decide which messages, reminders and offers each customer receives.",
    "actions": "Makes millions of real-time decisions daily with over 2,000 adaptive models, selecting from 220 next best actions such as dispute progress updates, home loan milestones and term deposit expiry prompts.",
    "human": "The account does not describe how bankers use or override suggestions, or who approves new actions and contact limits.",
    "value": "NAB reports more than 50 million guided interactions a month, a 40% uplift in engagement when customers are nudged, and about $92 million in retained term deposits.",
    "limitations": "Engagement and retained deposits are company-reported commercial measures, not evidence of better customer outcomes. The article gives both 2,000 and 1,200 data points, so the model inputs are not precisely described. The engine runs on a supplier’s decisioning platform (Pegasystems).",
    "topics": [
      "fairness",
      "data",
      "transparency"
    ],
    "sources": [
      {
        "title": "NAB · deployment account",
        "url": "https://news.nab.com.au/news/the-brain-behind-better-banking-how-nabs-ai-is-making-banking-more-human"
      }
    ],
    "connections": [
      {
        "conceptId": "consumer-outcomes",
        "controlId": "fairness-rights-testing",
        "reason": "Nudges that retain deposits or promote finance may serve the bank more than the customer; outcomes need testing by segment."
      },
      {
        "conceptId": "privacy",
        "controlId": "privacy-data-protection",
        "reason": "Personalising from many customer data points raises questions of purpose, inference and customer expectations."
      }
    ],
    "prompts": {
      "board": {
        "text": "How do we know personalised nudges put customers’ interests ahead of retention and sales targets?",
        "askFor": "Customer outcome measures alongside engagement, rules for commercial actions, complaints and results for customers experiencing vulnerability.",
        "followUp": "Which next best action would we switch off if it raised deposits but worsened customer outcomes?"
      },
      "executive": {
        "text": "Who approves a new next best action, and what limits stop customers being contacted too often?",
        "askFor": "Action approval records, contact policies, suppression rules, model monitoring and experiment designs.",
        "followUp": "What stops adaptive models learning to favour the most profitable actions?"
      },
      "regulator": {
        "text": "Can the bank show how customer data is used to target prompts and that vulnerable customers are treated fairly?",
        "askFor": "Data-use assessments, action eligibility rules, fairness analysis, opt-out handling and complaint samples.",
        "followUp": "Can a customer find out why they received a particular prompt?"
      }
    }
  },
  {
    "id": "ocbc-ai-oscar",
    "company": "OCBC",
    "title": "AI stock ideas for self-directed investors",
    "workflow": "products",
    "sector": "Financial services",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "18 June 2024",
    "published": "2024-06-18",
    "reviewed": "2026-09-25",
    "summary": "OCBC Securities’ A.I. Oscar sends each customer a weekly list of 15 personalised stock ideas from Singapore, Hong Kong and US exchanges.",
    "before": "Self-directed investors find trading ideas themselves. OCBC says 97% of 2023 trades by customers under 35 were made digitally without a broker’s help or advice.",
    "actions": "Deep-learning models predict stock price movements and combine them with each investor’s risk appetite, past trading and demographic information. Ideas arrive weekly through the app, trading platform and email.",
    "human": "Customers decide and place trades themselves; OCBC says trading representatives can use the ideas to start conversations. The release does not describe suitability checks.",
    "value": "OCBC reports under-35 trading activity rose 50% during the pilot, and its 2024 annual report cites a 95% increase in trading accounts opened within three months of launch.",
    "limitations": "Trading activity and account openings are commercial measures, not evidence of prediction accuracy or better investor outcomes; accuracy is not disclosed. The pilot comparison is before-and-after, not a controlled test. The launch aim of tripling active young investors may create incentives to encourage trading.",
    "topics": [
      "fairness",
      "transparency",
      "testing"
    ],
    "sources": [
      {
        "title": "OCBC · deployment account",
        "url": "https://www.ocbc.com/group/media/release/2024/ocbc-securities-to-triple-young-active-investors-with-launch-of-singapore-first-ai-stock-picker"
      },
      {
        "title": "OCBC · 2024 annual report",
        "url": "https://www.ocbc.com/group/investors/annual-reports/2024-annual-report/creating-value-through-ai.page"
      }
    ],
    "connections": [
      {
        "conceptId": "consumer-outcomes",
        "controlId": "impact-risk-assessment",
        "reason": "Personalised ideas designed to grow young investors’ trading can encourage activity that does not suit them."
      },
      {
        "conceptId": "explainability",
        "controlId": "explanation-limitations",
        "reason": "Investors need to understand that ideas are model predictions with limits, not advice or assured returns."
      }
    ],
    "prompts": {
      "board": {
        "text": "Does growth in AI-prompted trading reflect better outcomes for young investors, or only more activity?",
        "askFor": "Investor returns and losses by segment, trading frequency, complaints and how growth targets link to customer outcomes.",
        "followUp": "Would we still offer the tool if it increased trading but reduced investor returns?"
      },
      "executive": {
        "text": "How is prediction accuracy tested and explained before stock ideas reach customers?",
        "askFor": "Back-testing and live performance, model change approvals, disclosures shown with each idea and monitoring of idea-driven trades.",
        "followUp": "What happens to the ideas when markets move outside the conditions in the training data?"
      },
      "regulator": {
        "text": "Where is the line between personalised stock ideas and financial advice, and how is suitability addressed?",
        "askFor": "Regulatory classification analysis, customer disclosures, use of risk profiles, suitability controls and complaint handling.",
        "followUp": "Are less experienced investors more likely to act on the ideas?"
      }
    }
  },
  {
    "id": "mckinsey-lilli",
    "company": "McKinsey & Company",
    "title": "A firm knowledge assistant for consultants",
    "workflow": "employees",
    "sector": "Professional services",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "5 September 2024",
    "published": "2024-09-05",
    "reviewed": "2026-09-25",
    "summary": "Lilli, McKinsey’s generative AI platform, searches and synthesises the firm’s knowledge for its people and was rolled out firmwide in July 2023.",
    "before": "Consultants searched the firm’s research, past work and expertise to gather and synthesise knowledge.",
    "actions": "Answers prompts using the firm’s knowledge sources. McKinsey describes it moving from search and synthesis towards an orchestration layer, with task agents and slide-building features in development.",
    "human": "Colleagues use outputs in their own work. The account does not describe review requirements before AI-assisted content reaches clients.",
    "value": "McKinsey reports 72% of the firm active on the platform, more than 500,000 prompts a month, up to 30% time saved on searching and synthesis, and a 20% improvement in content quality and accuracy from blind scoring.",
    "limitations": "The account is a client-facing case study, and the firm offers clients a version of the underlying architecture. The blind-scoring sample and method are not disclosed. Protection of confidential client information is asserted, not described. Features described as in development are excluded.",
    "topics": [
      "data",
      "security",
      "evidence"
    ],
    "sources": [
      {
        "title": "McKinsey & Company · deployment account",
        "url": "https://www.mckinsey.com/capabilities/tech-and-ai/how-we-help-clients/rewiring-the-way-mckinsey-works-with-lilli"
      }
    ],
    "connections": [
      {
        "conceptId": "access-control",
        "controlId": "least-privilege-access",
        "reason": "A firm-wide assistant over past client work must respect confidentiality walls between clients and engagements."
      },
      {
        "conceptId": "evaluation",
        "controlId": "fit-for-purpose-evaluation",
        "reason": "Quality claims depend on how outputs were scored and whether errors reach client deliverables."
      }
    ],
    "prompts": {
      "board": {
        "text": "How do we know a firm-wide AI assistant cannot surface one client’s confidential work to people serving another?",
        "askFor": "Access design, confidentiality testing, incident records and client contract requirements.",
        "followUp": "Have any clients restricted how their information may be used by the assistant?"
      },
      "executive": {
        "text": "What review is required before AI-synthesised content goes into client deliverables?",
        "askFor": "Quality-review policies, sampled deliverables, error reports and the method behind reported quality gains.",
        "followUp": "Is the time saved offset by additional review effort?"
      },
      "regulator": {
        "text": "Can the firm show that client information and professional standards are protected when AI helps draft client work?",
        "askFor": "Data-handling controls, access tests, quality-control procedures and evidence of client disclosure where required.",
        "followUp": "Who is professionally responsible for an error that originated in an AI output?"
      }
    }
  }
]

/* Internal audit & assurance prompts for the cases above. Discussion prompts, not audit procedures or findings. */
export const reviewUseCaseAssurancePrompts: Record<string, AssurancePrompt> = {
  'suncorp-claims-genai': {
    text: 'Can we sample settled motor claims and trace each AI fault assessment to the documents used, the claims manager’s decision and any dispute?',
    askFor: 'The population of AI-assessed claims, tool outputs, final determinations, override records, dispute outcomes and model change logs.',
    followUp: 'Does high agreement between tool and claims manager show accuracy, or reliance without independent review?',
  },
  'iag-predictive-total-loss': {
    text: 'Can we re-perform accuracy and threshold testing for the current model version and compare it with the go-live assessment?',
    askFor: 'The model inventory entry, validation results by version, threshold settings, predicted-versus-final outcome data and reassessment approvals.',
    followUp: 'Are reversed predictions captured completely enough to measure the error rate?',
  },
  'services-australia-disaster-fraud': {
    text: 'Can we sample flagged and unflagged claims to test that analysts made the decisions and that flagging was consistent with the approved model?',
    askFor: 'Model version history, the pre-use governance approval, the flagged-claim population, analyst decisions and timings, and release rates.',
    followUp: 'Does a very high analyst agreement rate show a good model or insufficient challenge?',
  },
  'nab-customer-brain': {
    text: 'Can we trace a sample of delivered actions to the data, model version and eligibility rules that selected them?',
    askFor: 'Decision logs, the approved action catalogue, model monitoring reports, contact-frequency data and privacy assessments.',
    followUp: 'Can the reported engagement and retention figures be reproduced from source data, and against what baseline?',
  },
  'ocbc-ai-oscar': {
    text: 'Can we reconcile a sample of weekly stock ideas to the model version, data and customer profile used, and to the disclosures shown?',
    askFor: 'Idea generation logs, model validation and performance records, risk-profile data, disclosure versions and trades linked to ideas.',
    followUp: 'Is idea performance measured independently of the team targeting account growth?',
  },
  'mckinsey-lilli': {
    text: 'Can we test that the assistant’s retrieval enforces the same client and engagement access restrictions as the source repositories?',
    askFor: 'Access-control configurations, permission test results, retrieval logs for sampled queries, and the blind-scoring method and data.',
    followUp: 'Could a user without access to a document obtain its content through a generated summary?',
  },
}
