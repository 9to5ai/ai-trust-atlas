import type { SourceGranularity, SourceProvision } from '../../types.js'

/* Sections for the societal and content concepts added in the 2026-09 ontology review, keyed by source ID. Drafted for editorial review. */

type Draft = { id: string; ref: string; title: string; summary: string; conceptIds: string[]; granularity: SourceGranularity }

const draftSections = (sourceUrl: string, items: Draft[]): SourceProvision[] =>
  items.map((item) => ({
    ...item,
    sourceUrl,
    reviewedAt: '2026-09-25',
    editorialStatus: 'draft',
    note: 'Draft prepared for editorial review. Original synopsis; confirm scope and edition against the issuer’s current text before relying on it.',
  }))

const URLS = {
  aiAct: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng',
  gpaiCopyright: 'https://ec.europa.eu/newsroom/dae/redirection/document/118115',
  gpaiTransparency: 'https://ec.europa.eu/newsroom/dae/redirection/document/118120',
  genaiProfile: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf',
  unesco: 'https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence',
  oecdLabour: 'https://oecd.ai/en/dashboards/ai-principles/P13',
  c2pa: 'https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html',
  syntheticContent: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-4.pdf',
  asd: 'https://www.cyber.gov.au/business-government/secure-design/artificial-intelligence/guidelines-for-secure-ai-system-development',
  ssdfAi: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218A.pdf',
} as const

export const societalSections: Record<string, SourceProvision[]> = {
  'eu-ai-act': draftSections(URLS.aiAct, [
    {
      id: 'eu-ai-act-50-2-4-marking-deepfakes',
      ref: 'Article 50(2) and 50(4)',
      title: 'Machine-readable marking and deepfake disclosure',
      summary: 'Providers of systems generating synthetic audio, image, video or text must mark outputs in a machine-readable, detectable way that is effective, interoperable and robust as far as feasible. Deployers must disclose deepfakes and AI-generated text published to inform the public, subject to stated exceptions.',
      conceptIds: ['content-authenticity', 'transparency-disclosure'],
      granularity: 'clause',
    },
    {
      id: 'eu-ai-act-53-1-c-d-copyright-training-content',
      ref: 'Article 53(1)(c)–(d)',
      title: 'Copyright policy and training-content summary',
      summary: 'Providers of general-purpose AI models must have a policy to comply with EU copyright law, including identifying and honouring text-and-data-mining opt-outs, and must publish a sufficiently detailed summary of the content used for training, using the AI Office template.',
      conceptIds: ['intellectual-property', 'transparency-disclosure', 'provenance'],
      granularity: 'clause',
    },
    {
      id: 'eu-ai-act-26-7-worker-information',
      ref: 'Article 26(7)',
      title: 'Informing workers before workplace use',
      summary: 'Employers deploying a high-risk AI system at work must tell workers’ representatives and affected workers, before putting it into service or use, that they will be subject to it, following applicable rules on informing workers.',
      conceptIds: ['workforce-impact', 'transparency-disclosure'],
      granularity: 'clause',
    },
  ]),
  'eu-gpai-code': [
    ...draftSections(URLS.gpaiCopyright, [
      {
        id: 'gpai-code-copyright-policy-measures',
        ref: 'Copyright chapter, Commitment 1 (Measures 1.1–1.5)',
        title: 'Copyright policy, crawling, outputs and complaints',
        summary: 'Signatories keep one copyright policy with assigned owners, crawl only lawfully accessible content without bypassing paywalls, honour robots.txt and other machine-readable opt-outs, guard against infringing outputs, ban infringing use in their terms, and give rightsholders a contact point and complaints route.',
        conceptIds: ['intellectual-property', 'data-governance', 'contestability'],
        granularity: 'practice',
      },
    ]),
    ...draftSections(URLS.gpaiTransparency, [
      {
        id: 'gpai-code-energy-reporting',
        ref: 'Transparency chapter, Measure 1.1 and Model Documentation Form (energy consumption)',
        title: 'Recording training energy and inference compute',
        summary: 'The Model Documentation Form asks for measured or estimated training energy in megawatt-hours, the method used (or what information from compute providers was missing) and benchmarked inference compute. This is for the AI Office and national authorities, not downstream providers.',
        conceptIds: ['environmental-impact', 'documentation'],
        granularity: 'practice',
      },
    ]),
  ],
  'nist-genai-profile': draftSections(URLS.genaiProfile, [
    {
      id: 'nist-genai-harmful-abusive-content',
      ref: 'Sections 2.3 and 2.11',
      title: 'Dangerous, violent, hateful and abusive content',
      summary: 'Generative AI can produce violent, hateful or self-harm content and can ease creation of non-consensual intimate imagery and child sexual abuse material. Output restrictions can be bypassed through jailbreaking, and harmful material can also sit in training data.',
      conceptIds: ['content-safety', 'human-rights', 'runtime-guardrails'],
      granularity: 'section',
    },
    {
      id: 'nist-genai-environmental-impacts',
      ref: 'Section 2.5',
      title: 'Environmental impacts',
      summary: 'Training, fine-tuning and running generative models can carry large energy and carbon footprints that vary with task, modality and hardware. Smaller distilled or compressed models may cut inference impacts, and NIST notes there is no agreed method yet for estimating them.',
      conceptIds: ['environmental-impact'],
      granularity: 'section',
    },
    {
      id: 'nist-genai-intellectual-property',
      ref: 'Section 2.10',
      title: 'Intellectual property',
      summary: 'IP risk arises where copyrighted works are used outside fair use or where outputs reproduce memorised training data. How copyright applies to similar but non-identical outputs, and to use of a person’s likeness or voice, is still being argued in legal forums.',
      conceptIds: ['intellectual-property', 'privacy'],
      granularity: 'section',
    },
  ]),
  'unesco-ai-ethics': draftSections(URLS.unesco, [
    {
      id: 'unesco-environment-ecosystems',
      ref: 'Paragraphs 17–18; Policy Area 5 (paragraphs 84–86)',
      title: 'Environment and ecosystems',
      summary: 'Governments and businesses should assess and reduce direct and indirect environmental impacts across the AI life cycle, including carbon footprint, energy use and raw material extraction. AI actors should favour data-, energy- and resource-efficient methods, and not use AI where environmental harm is disproportionate.',
      conceptIds: ['environmental-impact', 'impact-assessment'],
      granularity: 'section',
    },
    {
      id: 'unesco-economy-labour',
      ref: 'Policy Area 10 (paragraphs 116–119)',
      title: 'Economy and labour',
      summary: 'Member States should assess AI’s effect on labour markets and skills, and work with employers, workers and unions on a fair transition for at-risk employees through upskilling, reskilling, retention mechanisms and safety nets, backed by research on local labour impacts.',
      conceptIds: ['workforce-impact', 'competence'],
      granularity: 'section',
    },
  ]),
  'oecd-ai-principles': draftSections(URLS.oecdLabour, [
    {
      id: 'oecd-labour-market-transition',
      ref: 'Principle 2.4',
      title: 'Building human capacity and labour market transition',
      summary: 'Governments should work with stakeholders to prepare for changes to work, equip people with AI skills and, through social dialogue, support a fair transition for workers, including lifelong training and help for those displaced. They should promote responsible AI use that improves worker safety and job quality.',
      conceptIds: ['workforce-impact', 'competence'],
      granularity: 'principle',
    },
  ]),
  'c2pa-2-4': draftSections(URLS.c2pa, [
    {
      id: 'c2pa-digital-source-type',
      ref: 'Sections 18.15.2 and 18.15.4.5',
      title: 'Declaring AI-generated origin',
      summary: 'When an asset is newly created, its first actions assertion must start with a created action carrying a digital source type that states how the content came into being. Generative AI output is recorded with the IPTC trained algorithmic media value, and AI-generated ingredients can be flagged the same way.',
      conceptIds: ['content-authenticity', 'provenance'],
      granularity: 'clause',
    },
  ]),
  'nist-synthetic-content': draftSections(URLS.syntheticContent, [
    {
      id: 'nist-synthetic-csam-ncii-safeguards',
      ref: 'Section 5 (5.1–5.6)',
      title: 'Preventing AI-generated CSAM and intimate imagery',
      summary: 'Sets out emerging practices against AI-generated child sexual abuse material and non-consensual intimate imagery: filtering training data, prompts and outputs, hashing confirmed material, provenance tracking and red teaming. It notes classifier error, filter evasion and legal limits on testing.',
      conceptIds: ['content-safety', 'runtime-guardrails', 'red-teaming'],
      granularity: 'section',
    },
  ]),
  'asd-secure-ai-development': draftSections(URLS.asd, [
    {
      id: 'asd-secure-development-stage',
      ref: 'Section 2, Secure development',
      title: 'Supply chain, assets, documentation and technical debt',
      summary: 'Providers hold suppliers to their own software security standards, track, version and protect AI assets such as models, data, prompts and logs so they can restore a known good state, document data, models and prompts with model cards or SBOMs, and manage technical debt.',
      conceptIds: ['secure-development', 'supply-chain', 'documentation'],
      granularity: 'section',
    },
    {
      id: 'asd-secure-deployment-stage',
      ref: 'Section 3, Secure deployment',
      title: 'Hardened infrastructure, model protection and secure defaults',
      summary: 'Providers apply access controls and environment segregation across pipelines, protect models from extraction and tampering, publish hashes or signatures for model files and datasets, release only after security evaluation such as red teaming, and make the most secure configuration the default.',
      conceptIds: ['secure-development', 'access-control', 'ai-security'],
      granularity: 'section',
    },
  ]),
  'nist-sp-800-218a': draftSections(URLS.ssdfAi, [
    {
      id: 'nist-ssdf-ai-ps1-protect-weights-data',
      ref: 'Practice PS.1 (tasks PS.1.1–PS.1.3)',
      title: 'Protect model weights and training data',
      summary: 'Store models, weights, pipelines and reward models under least privilege, protect training, fine-tuning and alignment data from unauthorised access or change, keep weights apart from data, and add risk-proportionate controls such as encryption, signatures and multi-party authorisation.',
      conceptIds: ['secure-development', 'access-control', 'ai-security'],
      granularity: 'practice',
    },
  ]),
}
