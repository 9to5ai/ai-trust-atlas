import { reviewUseCases } from './useCasesReview'
import type { Audience, Question } from './leadershipQuestions'
export const useCaseWorkflows = {customers:'Serve customers', employees:'Support employees & advisers', software:'Build software', risk:'Detect fraud & manage risk', operations:'Run operations', products:'Create products & revenue'} as const
export type UseCaseWorkflow = keyof typeof useCaseWorkflows
export type UseCase = {
 id:string; company:string; title:string; workflow:UseCaseWorkflow; sector:string;
 status:'Production'|'Pilot'|'Announced'|'Retired'; evidence:'Company-reported'|'Independently corroborated'|'Supplier-only';
 reported:string; published:string|null; reviewed:string; summary:string; before:string; actions:string; human:string; value:string; limitations:string;
 topics:string[]; sources:{title:string;url:string}[];
 connections:{conceptId:string;controlId:string;reason:string}[];
 prompts:Record<Audience,{text:string;askFor:string;followUp:string}>;
}
// Authored evidence snapshots. Publication dates never inherit the review date.
const baseUseCases:UseCase[] = [
  {
    "id": "cba-fraud-agent",
    "company": "Commonwealth Bank",
    "title": "Proposing new fraud rules",
    "workflow": "risk",
    "sector": "Financial services",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "April 2026",
    "published": null,
    "reviewed": "2026-09-21",
    "summary": "An agent analyses payment patterns and proposes detection rules for fraud specialists to approve.",
    "before": "Fraud specialists investigate emerging patterns and develop detection rules.",
    "actions": "Analyses transaction and payment data; assesses suspicious patterns and proposes rules.",
    "human": "CBA says its fraud analytics team reviews and approves new rules before implementation.",
    "value": "CBA reports the agent contributed to developing or updating three quarters of its card fraud rules.",
    "limitations": "The reported reduction in fraud losses relates to the broader fraud technology programme, not an isolated causal effect of this agent. Detailed false-positive and approval-quality results are not disclosed in this account.",
    "topics": [
      "agentic",
      "testing",
      "fairness"
    ],
    "sources": [
      {
        "title": "Commonwealth Bank · deployment account",
        "url": "https://www.commbank.com.au/articles/newsroom/2026/04/ai-agent-spots-fraud-in-real-time.html"
      }
    ],
    "connections": [
      {
        "conceptId": "human-oversight",
        "controlId": "decision-rights-approval",
        "reason": "A proposed rule can affect legitimate payments; approval must test customer impact."
      },
      {
        "conceptId": "continuous-monitoring",
        "controlId": "runtime-monitoring",
        "reason": "New fraud patterns and false positives can both change after release."
      }
    ],
    "prompts": {
      "board": {
        "text": "How do we know faster fraud-rule creation improves protection without unfairly blocking customers?",
        "askFor": "Fraud-loss and false-positive trends, complaints, approval sampling and accountable owners.",
        "followUp": "Where is the trade-off between losses prevented and legitimate payments blocked made explicit?"
      },
      "executive": {
        "text": "What must a fraud rule pass before the agent’s proposal reaches production?",
        "askFor": "Back-tests, segment-level false positives, approval records, rollback triggers and live monitoring.",
        "followUp": "What happens when fraud patterns change before the next human review?"
      },
      "regulator": {
        "text": "Show how human approval and customer-impact monitoring constrain AI-generated fraud rules.",
        "askFor": "Approval and override records, customer-impact analysis, challenge routes and monitoring results.",
        "followUp": "Can the firm reconstruct why a particular rule was deployed and who authorised it?"
      }
    }
  },
  {
    "id": "jpm-employee-assistant",
    "company": "JPMorganChase",
    "title": "A single employee assistant",
    "workflow": "employees",
    "sector": "Financial services",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "6 April 2026",
    "published": "2026-04-06",
    "reviewed": "2026-09-21",
    "summary": "JPMorganChase reports rolling out a personalised Employee Assistant to help employees get support and take action across the firm.",
    "before": "Employees seek information and complete support tasks across internal services.",
    "actions": "The letter describes a single resource for help and actions, alongside LLM Suite.",
    "human": "The public letter does not specify action-level approval rules or permission boundaries.",
    "value": "The firm describes improved quality and time saved, without a separate measured benefit for Employee Assistant.",
    "limitations": "Enterprise deployment is reported, but active usage, enabled actions and control test results are not specified. The letter is not an independent evaluation.",
    "topics": [
      "agentic",
      "security",
      "data"
    ],
    "sources": [
      {
        "title": "JPMorganChase · deployment account",
        "url": "https://www.jpmorganchase.com/ir/annual-report/2025/ar-ceo-letter-jennifer-piepszak"
      }
    ],
    "connections": [
      {
        "conceptId": "agent-authority",
        "controlId": "agent-runtime-constraints",
        "reason": "Connecting help to actions makes the boundary of delegated authority important."
      },
      {
        "conceptId": "access-control",
        "controlId": "least-privilege-access",
        "reason": "An employee assistant must preserve permissions across the services it reaches."
      }
    ],
    "prompts": {
      "board": {
        "text": "Which employee tasks may AI perform for us, and who has approved those boundaries?",
        "askFor": "An approved action catalogue, accountable owners and evidence of enforced limits.",
        "followUp": "Which action would we prohibit even if it saved substantial time?"
      },
      "executive": {
        "text": "Can the assistant inherit excessive access when it connects several internal services?",
        "askFor": "Service permissions, action logs, identity propagation tests and approval rules.",
        "followUp": "Can revoking a user’s access also stop actions already queued by their assistant?"
      },
      "regulator": {
        "text": "How does the organisation demonstrate that employee-agent actions remain within delegated authority?",
        "askFor": "Delegation records, access tests and samples tracing requests to authorised actions.",
        "followUp": "What independent evidence supports the claimed boundary?"
      }
    }
  },
  {
    "id": "morgan-stanley-debrief",
    "company": "Morgan Stanley",
    "title": "From client meeting to follow-up",
    "workflow": "employees",
    "sector": "Financial services",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "26 June 2024",
    "published": "2024-06-26",
    "reviewed": "2026-09-21",
    "summary": "Debrief turns consented adviser meetings into notes, action items and draft follow-up emails.",
    "before": "Advisers write meeting notes and compose follow-up messages.",
    "actions": "Produces a meeting summary, drafts an email and saves a note into Salesforce.",
    "human": "Client consent is required; the adviser edits and sends the email at their discretion.",
    "value": "The company reports adviser efficiency benefits; the launch account does not establish an audited productivity effect.",
    "limitations": "This is a dated deployment account. Current adoption, retention settings and error rates require renewed verification. A saved note is not necessarily an adviser-validated record.",
    "topics": [
      "data",
      "fairness",
      "evidence"
    ],
    "sources": [
      {
        "title": "Morgan Stanley · deployment account",
        "url": "https://www.morganstanley.com/press-releases/ai-at-morgan-stanley-debrief-launch"
      }
    ],
    "connections": [
      {
        "conceptId": "privacy",
        "controlId": "privacy-data-protection",
        "reason": "Recording client conversations introduces consent, retention and access decisions."
      },
      {
        "conceptId": "traceability",
        "controlId": "records-traceability",
        "reason": "A summary can become a client record; corrections and provenance matter."
      }
    ],
    "prompts": {
      "board": {
        "text": "What prevents an AI meeting summary from becoming an inaccurate official client record?",
        "askFor": "Sampled records, correction rates, consent controls and accountability for client communications.",
        "followUp": "How would a client challenge a disputed account of their instructions?"
      },
      "executive": {
        "text": "Where do advisers validate notes, correct errors and confirm consent before reuse?",
        "askFor": "The recording-to-CRM workflow, retention settings, approval steps and correction history.",
        "followUp": "Does editing an email also correct the underlying CRM note?"
      },
      "regulator": {
        "text": "Can the firm trace AI-generated client records back to consent, source material and human review?",
        "askFor": "Consent evidence, access logs, record provenance and a sample of corrected summaries.",
        "followUp": "What happens when consent is withdrawn?"
      }
    }
  },
  {
    "id": "dbs-cso-assistant",
    "company": "DBS",
    "title": "Live support for service officers",
    "workflow": "customers",
    "sector": "Financial services",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "2024 annual report",
    "published": null,
    "reviewed": "2026-09-21",
    "summary": "DBS reports service officers using a generative AI assistant in Singapore, Hong Kong, India and Taiwan.",
    "before": "Service officers search for answers and write call summaries while helping customers.",
    "actions": "Transcribes and summarises calls, and recommends responses in real time.",
    "human": "The assistant supports a service officer; the account does not detail how each recommendation is checked.",
    "value": "DBS expected up to 20% shorter call handling time. This is a target, not a measured result in the cited account.",
    "limitations": "Country rollout is reported. Accuracy across languages, complaint outcomes and realised time savings are not established by this report.",
    "topics": [
      "testing",
      "data",
      "fairness"
    ],
    "sources": [
      {
        "title": "DBS · deployment account",
        "url": "https://www.dbs.com/annualreports/2024/cio-statement.html"
      }
    ],
    "connections": [
      {
        "conceptId": "evaluation",
        "controlId": "fit-for-purpose-evaluation",
        "reason": "Useful answers must be tested against actual products, languages and customer situations."
      },
      {
        "conceptId": "human-oversight",
        "controlId": "competence-challenge",
        "reason": "A busy service officer needs enough time and knowledge to challenge an answer."
      }
    ],
    "prompts": {
      "board": {
        "text": "Are service improvements being measured through customer outcomes as well as shorter calls?",
        "askFor": "Resolution, repeat-contact and complaint measures alongside handling time.",
        "followUp": "Could a speed target discourage staff from challenging the assistant?"
      },
      "executive": {
        "text": "How do we test incorrect recommendations across languages and difficult customer situations?",
        "askFor": "Representative test calls, incorrect-answer reviews and agent escalation procedures.",
        "followUp": "Can an officer quickly find the source behind a suggested answer?"
      },
      "regulator": {
        "text": "What evidence shows assisted service is accurate and accessible for different customer groups?",
        "askFor": "Segmented accuracy and outcome data, accessibility tests and complaint investigations.",
        "followUp": "Which customer groups are least represented in the tests?"
      }
    }
  },
  {
    "id": "bofa-erica",
    "company": "Bank of America",
    "title": "Everyday financial assistance",
    "workflow": "customers",
    "sector": "Financial services",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "14 July 2026",
    "published": "2026-07-14",
    "reviewed": "2026-09-21",
    "summary": "Erica provides digital financial assistance and proactive personalised insights to banking clients.",
    "before": "Customers navigate banking information and seek help with everyday finances.",
    "actions": "Provides assistance and personalised insights through the bank’s digital service.",
    "human": "The cited summary does not describe escalation thresholds or the authority to execute transactions.",
    "value": "The bank reports more than 24.6 million clients and 3.6 billion interactions since the 2018 launch.",
    "limitations": "Interaction volume demonstrates reported adoption, not accuracy, customer benefit or control effectiveness. The account does not establish that every Erica function uses generative AI.",
    "topics": [
      "transparency",
      "fairness",
      "testing"
    ],
    "sources": [
      {
        "title": "Bank of America · deployment account",
        "url": "https://newsroom.bankofamerica.com/content/newsroom/company-overview/bank-of-america-fast-facts.html"
      }
    ],
    "connections": [
      {
        "conceptId": "contestability",
        "controlId": "contestability-redress",
        "reason": "Customers need a usable route to challenge answers and reach a person."
      },
      {
        "conceptId": "continuous-monitoring",
        "controlId": "runtime-monitoring",
        "reason": "High-volume service requires outcome monitoring beyond interaction counts."
      }
    ],
    "prompts": {
      "board": {
        "text": "How do we distinguish widespread use of a banking assistant from demonstrably better customer outcomes?",
        "askFor": "Customer outcomes, repeat contacts, unresolved cases and escalation performance.",
        "followUp": "Which customer harm could be hidden by a growing engagement metric?"
      },
      "executive": {
        "text": "Which signals reveal unresolved customer needs even when conversations appear completed?",
        "askFor": "Conversation-quality samples, abandonment and repeat-contact trends, and escalation logs.",
        "followUp": "How are unresolved conversations counted?"
      },
      "regulator": {
        "text": "Can customers obtain a human review when a digital assistant gives unsuitable or disputed guidance?",
        "askFor": "Human-review routes, complaint samples and evidence that vulnerable customers can use them.",
        "followUp": "Does a closed conversation mean the customer’s problem was resolved?"
      }
    }
  },
  {
    "id": "google-code-assistance",
    "company": "Google",
    "title": "AI in the engineering workflow",
    "workflow": "software",
    "sector": "Technology",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "18 August 2025",
    "published": "2025-08-18",
    "reviewed": "2026-09-21",
    "summary": "Google engineers use AI for coding, reviews, testing and migrations, with engineers reviewing and approving generated code.",
    "before": "Engineers write, review and test software changes.",
    "actions": "Generates code and assists other stages of the development lifecycle.",
    "human": "Google says engineers review and approve the generated code.",
    "value": "Google reports AI helps generate 30% of new code and estimates a 10% increase in engineering velocity.",
    "limitations": "These are company-reported measures from August 2025. They do not establish defect reduction, security improvement or the same gains in another organisation.",
    "topics": [
      "lifecycle",
      "security",
      "testing"
    ],
    "sources": [
      {
        "title": "Google · deployment account",
        "url": "https://blog.google/innovation-and-ai/products/google-ai-workplace-examples/"
      }
    ],
    "connections": [
      {
        "conceptId": "ai-security",
        "controlId": "secure-ai-development",
        "reason": "Faster code generation still needs security review of changes and dependencies."
      },
      {
        "conceptId": "evaluation",
        "controlId": "fit-for-purpose-evaluation",
        "reason": "Measure defects and maintainability alongside delivery speed."
      }
    ],
    "prompts": {
      "board": {
        "text": "Does faster AI-assisted development preserve our security and reliability standards?",
        "askFor": "Release quality, escaped defects, security findings and the ownership of generated code.",
        "followUp": "Are maintenance and remediation costs included in the productivity claim?"
      },
      "executive": {
        "text": "Which generated changes need additional review before merging or release?",
        "askFor": "Review policies, representative pull requests, test results and dependency checks.",
        "followUp": "Can the team identify where an AI suggestion introduced a defect?"
      },
      "regulator": {
        "text": "How can the organisation evidence that AI-assisted software passes its release controls?",
        "askFor": "Change approvals, security tests, production incidents and traceable release records.",
        "followUp": "Which controls differ for higher-impact software?"
      }
    }
  },
  {
    "id": "amazon-deepfleet",
    "company": "Amazon",
    "title": "Coordinating warehouse robots",
    "workflow": "operations",
    "sector": "Retail & logistics",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "31 July 2025",
    "published": "2025-07-31",
    "reviewed": "2026-09-21",
    "summary": "Amazon reports launching DeepFleet to coordinate robot movements and reduce bottlenecks in its fulfilment operations.",
    "before": "Warehouse robot fleets need routing and coordination to move inventory.",
    "actions": "Optimises robot paths and coordination across the operating fleet.",
    "human": "The earnings release does not specify local override, safe-stop or fallback arrangements.",
    "value": "Amazon reports a 10% improvement in robot travel efficiency. The release does not provide a site-level evaluation method.",
    "limitations": "The million-robot figure describes Amazon’s overall fleet, not verified DeepFleet coverage at every site. Deployment extent and current operating performance are not independently established.",
    "topics": [
      "resilience",
      "agentic",
      "testing"
    ],
    "sources": [
      {
        "title": "Amazon · deployment account",
        "url": "https://ir.aboutamazon.com/news-release/news-release-details/2025/Amazon-com-Announces-Second-Quarter-Results/"
      }
    ],
    "connections": [
      {
        "conceptId": "operational-resilience",
        "controlId": "resilience-rollback-continuity",
        "reason": "Coordinated routing can concentrate disruption if the optimisation service fails."
      },
      {
        "conceptId": "human-oversight",
        "controlId": "human-intervention-safe-stop",
        "reason": "Physical operations require usable intervention and safe fallback."
      }
    ],
    "prompts": {
      "board": {
        "text": "What happens to critical operations if a shared AI coordinator gives poor instructions or becomes unavailable?",
        "askFor": "Dependency maps, business-continuity exercises and accountable site owners.",
        "followUp": "Could one model change affect many sites at once?"
      },
      "executive": {
        "text": "Can a site safely stop or bypass the coordinator without losing essential operations?",
        "askFor": "Safe-stop tests, local fallback procedures and degraded-mode performance.",
        "followUp": "How is a bad routing update detected and rolled back?"
      },
      "regulator": {
        "text": "Demonstrate the fallback and intervention arrangements for AI-coordinated physical operations.",
        "askFor": "Exercise records, failure scenarios, intervention logs and recovery evidence.",
        "followUp": "Are operating conditions in testing representative of real sites?"
      }
    }
  },
  {
    "id": "chrobinson-shipment-agents",
    "company": "C.H. Robinson",
    "title": "From shipment email to action",
    "workflow": "operations",
    "sector": "Retail & logistics",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "16 April 2025",
    "published": "2025-04-16",
    "reviewed": "2026-09-21",
    "summary": "Logistics agents turn customer and carrier messages into quotes, orders and appointment tasks.",
    "before": "Employees read shipment emails and enter details into operational systems.",
    "actions": "Produces quotes, processes orders, posts truck availability and arranges appointments.",
    "human": "The company describes staff focusing on complex work; exception thresholds and approval limits are not specified.",
    "value": "C.H. Robinson reports over three million automated shipping tasks, including more than one million quotes and one million orders.",
    "limitations": "Task totals are company-reported. The cited account also mentions separate pilots; this case covers the explicitly operating workflows, not every announced agent.",
    "topics": [
      "agentic",
      "evidence",
      "resilience"
    ],
    "sources": [
      {
        "title": "C.H. Robinson · deployment account",
        "url": "https://www.chrobinson.com/en-us/about-us/newsroom/press-releases/2025/ai-performs-over-three-million-shipping-tasks/"
      }
    ],
    "connections": [
      {
        "conceptId": "agent-authority",
        "controlId": "agent-runtime-constraints",
        "reason": "Messages can become commercial commitments; tool actions need clear limits."
      },
      {
        "conceptId": "traceability",
        "controlId": "records-traceability",
        "reason": "Operators need to reconstruct how an incoming message became an order."
      }
    ],
    "prompts": {
      "board": {
        "text": "Which commercial commitments can our agents make, and when must a person intervene?",
        "askFor": "Delegated limits, exception rates, correction costs and ownership of commitments.",
        "followUp": "Who bears the cost when an automated quote or order is wrong?"
      },
      "executive": {
        "text": "How do we prevent ambiguous or malicious messages from creating incorrect orders?",
        "askFor": "Message-to-action traces, input validation, approval rules and exception queues.",
        "followUp": "What prevents a duplicate email from triggering a duplicate order?"
      },
      "regulator": {
        "text": "Can the organisation reconstruct and challenge an automated shipment commitment?",
        "askFor": "Sampled commitments, source messages, authorisation records and correction procedures.",
        "followUp": "Can affected parties obtain a timely correction?"
      }
    }
  },
  {
    "id": "walmart-sparky",
    "company": "Walmart",
    "title": "Shopping through an AI assistant",
    "workflow": "products",
    "sector": "Retail & logistics",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "21 May 2026",
    "published": "2026-05-21",
    "reviewed": "2026-09-21",
    "summary": "Sparky supports product discovery, meal planning and personalised replenishment across Walmart’s app, web and in-store experiences.",
    "before": "Shoppers search and compare products and organise repeat purchases.",
    "actions": "Recommends products using inventory, price and delivery context; supports repeat-item reordering.",
    "human": "The earnings call does not detail confirmation rules, spending limits or how users undo an automated reorder.",
    "value": "Walmart reports weekly active users more than doubled in the quarter, and average order values around 35% higher for Sparky users.",
    "limitations": "The order-value comparison is observational, not proof of incremental revenue caused by AI. Customer consent and purchasing controls need separate examination.",
    "topics": [
      "agentic",
      "transparency",
      "data"
    ],
    "sources": [
      {
        "title": "Walmart · deployment account",
        "url": "https://corporate.walmart.com/content/dam/corporate/documents/newsroom/2026/05/21/walmart-releases-q1-fy27-earnings/q1-fy27-earnings-call-transcript.pdf"
      }
    ],
    "connections": [
      {
        "conceptId": "agent-authority",
        "controlId": "agent-runtime-constraints",
        "reason": "Moving from recommendations to reordering introduces spending authority."
      },
      {
        "conceptId": "transparency-disclosure",
        "controlId": "ai-notice-disclosure",
        "reason": "Customers should understand when recommendations and actions are AI-assisted."
      }
    ],
    "prompts": {
      "board": {
        "text": "Does an AI shopping experience improve customer value as well as increasing basket size?",
        "askFor": "Customer satisfaction, returns, complaints and incremental-value analysis.",
        "followUp": "Could commercial incentives encourage unsuitable recommendations?"
      },
      "executive": {
        "text": "How do customers approve, constrain and reverse AI-assisted repeat purchases?",
        "askFor": "Consent flows, spending limits, order confirmations and cancellation tests.",
        "followUp": "What happens when price or product availability changes after authorisation?"
      },
      "regulator": {
        "text": "What evidence shows recommendations and purchasing actions respect customer choice?",
        "askFor": "Disclosure, consent and transaction records, with evidence of accessible redress.",
        "followUp": "How are commercial incentives disclosed to customers?"
      }
    }
  },
  {
    "id": "salesforce-agentforce-help",
    "company": "Salesforce",
    "title": "AI support with human escalation",
    "workflow": "customers",
    "sector": "Technology",
    "status": "Production",
    "evidence": "Company-reported",
    "reported": "6 November 2025",
    "published": "2025-11-06",
    "reviewed": "2026-09-21",
    "summary": "Agentforce answers customer support questions directly on Salesforce Help using the company’s support information.",
    "before": "Customers search documentation or contact support engineers.",
    "actions": "Provides natural-language answers and routes more complex issues to support staff.",
    "human": "Salesforce describes human support engineers handling more complex issues.",
    "value": "Salesforce reports more than two million conversations handled since the October 2024 launch.",
    "limitations": "The operator is also the technology supplier. Conversation counts do not establish resolution quality; changing resolution-rate definitions should not be treated as comparable without checking denominators.",
    "topics": [
      "transparency",
      "testing",
      "fairness"
    ],
    "sources": [
      {
        "title": "Salesforce · deployment account",
        "url": "https://www.salesforce.com/blog/support-requests-agentforce/"
      }
    ],
    "connections": [
      {
        "conceptId": "contestability",
        "controlId": "contestability-redress",
        "reason": "Customers need a working escalation path when an answer does not solve the problem."
      },
      {
        "conceptId": "evaluation",
        "controlId": "fit-for-purpose-evaluation",
        "reason": "Resolution measures should test the customer outcome, not just conversation closure."
      }
    ],
    "prompts": {
      "board": {
        "text": "What proves our AI support resolves customer problems rather than merely reducing human contacts?",
        "askFor": "Independent conversation samples, repeat contacts, satisfaction and escalation outcomes.",
        "followUp": "Whose definition of success is reflected in the headline metric?"
      },
      "executive": {
        "text": "How do we detect false resolution and transfer unresolved cases with their context?",
        "askFor": "Resolution definitions, sampled failures, handoff logs and backlog measures.",
        "followUp": "Do repeat contacts reopen the original case or disappear into a new count?"
      },
      "regulator": {
        "text": "Can users reliably escalate an incorrect automated answer to a person?",
        "askFor": "Escalation tests, complaint cases and evidence that customers can correct errors.",
        "followUp": "Which users face the greatest barriers to reaching a human?"
      }
    }
  }
]
export const useCases:UseCase[] = [...baseUseCases, ...reviewUseCases]
export const useCaseById = new Map(useCases.map(item=>[item.id,item]))
export function useCaseQuestion(item:UseCase,audience:Audience):Question {
 return {id:`use-case:${item.id}:${audience}`,audience,context:`${item.company} · ${item.title}`,basis:item.summary,why:item.connections.map(c=>c.reason).join(' '),sources:item.sources,...item.prompts[audience]}
}
export function useCasesForNode(kind:string|undefined,id:string|undefined) {
 return useCases.filter(item=>kind==='domain'?item.topics.includes(id??''):kind==='concept'?item.connections.some(c=>c.conceptId===id):kind==='control-objective'?item.connections.some(c=>c.controlId===id):false)
}
export function filterUseCases(workflow='all',sector='all',query='') {
 const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean)
 return useCases.filter(item=>item.status==='Production'&&(workflow==='all'||item.workflow===workflow)&&(sector==='all'||item.sector===sector)&&terms.every(term=>`${item.company} ${item.title} ${item.summary} ${useCaseWorkflows[item.workflow]}`.toLowerCase().includes(term))).sort((a,b)=>(b.published??'').localeCompare(a.published??'')||a.company.localeCompare(b.company))
}
