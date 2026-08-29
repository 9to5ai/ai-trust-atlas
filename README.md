# AI Trust Atlas

AI Trust Atlas is a public, interactive knowledge graph showing how AI laws, regulatory expectations, standards, risk frameworks, controls, testing resources and threat knowledge relate at the ontological level.

The atlas is Australia first, with regulated financial services at its centre and global instruments as comparative layers. It supports semantic zoom from visual themes to concepts, instruments and source provisions, while preserving the granularity of articles, clauses, sections, principles, outcomes, practices and summaries.

The Risk lens incorporates the MIT AI Risk Repository's seven domains and 24 subdomains as a separate descriptive layer. It connects documented risk types to the Atlas trust ontology while retaining the distinction between MIT source taxonomy and Atlas synthesis.

The Controls lens adds 24 Atlas-normalised control objectives across six families. They are grounded in public NIST, MIT, Australian Government and OWASP material, with CSA AICM represented as a public-metadata crosswalk source. Controls are candidate responses—not findings about implementation, effectiveness or compliance.

## What the atlas is

- A navigable ontology of shared AI Trust concepts.
- A source-linked corpus of public, authoritative instruments.
- A canonical store of typed mapping assertions with rationale, basis, confidence, citations, version and verification date.
- A comparison tool that preserves differences in authority, scope and applicability.
- A progressive risk universe with causal lenses for entity, intent and timing.
- A bounded control architecture with implementation patterns, possible evidence and source foundations.

## What the atlas is not

It does not determine legal applicability, materiality, compliance, control effectiveness, evidence sufficiency, residual risk or an assurance opinion. Those decisions remain with appropriately accountable people.

A risk-to-concept connection means `threatens` or `relevant to`, not `covered by`, `mitigated by` or `controlled by`. Instrument-to-risk associations are displayed as ranked two-hop paths through shared concepts and provisions. MIT risk record counts are descriptive source classifications; they are not likelihood, impact, exposure or priority scores.

Source-provision guides for licensed standards are original paraphrases based on public metadata. They do not reproduce the licensed text and do not replace the official standard.

A control objective may be `intended to support` a trust concept or `may address` a risk. The Atlas does not determine whether a control applies, has been implemented, is appropriately designed, operates effectively, produces sufficient evidence or supports an assurance conclusion.

## Ontology and assertion model

The user-facing model separates:

`Source → Source provision → Trust objective ← Risk ← Control objective ← Control practice`

Tests and possible evidence sit beneath control practices. Accountable humans retain approval, risk acceptance, residual-risk and assurance decisions.

Each semantic mapping records:

- a typed direction, such as `implements`, `extends`, `maps-to` or `provides-testing-for`;
- an explanation;
- whether the basis is explicit in source material or cross-framework synthesis;
- a confidence level;
- structured source citations;
- mapping version, verification date and inference depth.

The 12 familiar themes are explicitly typed as five trust outcomes, five governance capabilities and two context facets. Agentic AI and third-party are therefore cross-cutting contexts rather than peer trust outcomes.

## Control layer

- Six families: Govern and own; Understand and assess; Protect and constrain; Inform and enable recourse; Test and monitor; Respond, recover and retire.
- 24 neutral control objectives.
- Three implementation patterns and three possible evidence examples per objective.
- Explicit mappings to trust concepts, MIT risk types and public source foundations.
- Immediate controls appear only around a selected risk or concept; detailed catalogues remain in search and the inspector.

Primary public foundations:

- [NIST AI RMF Playbook](https://airc.nist.gov/airmf-resources/playbook/)
- [MIT AI Risk Mitigation Taxonomy](https://airisk.mit.edu/ai-risk-mitigations)
- [Australian Government Guidance for AI Adoption](https://www.ai.gov.au/staying-safe-and-responsible/essential-ai-practices/guidance-ai-adoption-implementation-guidance)
- [OWASP AISVS](https://owasp.org/www-project-artificial-intelligence-security-verification-standard-aisvs-docs/)
- [CSA AICM v1.1 public metadata](https://cloudsecurityalliance.org/artifacts/ai-controls-matrix-v1-1)

CSA's detailed catalogue is not republished pending appropriate public-display and derivative-use rights. Licensed ISO content remains a normative reference and crosswalk target, not an ingested control source.

## MIT risk layer

- Source: [MIT AI Risk Repository](https://airisk.mit.edu/risks)
- Taxonomy: 7 domains and 24 subdomains
- Included aggregate: 1,511 source records mapped to those 24 subdomains in AI Risk Database v4
- Source data updated: 3 December 2025
- Licence: CC BY 4.0
- Atlas mappings: cross-framework synthesis with a visible confidence level

The browser bundle contains the stable taxonomy spine and aggregate causal profiles, not the full source-record text. Users can open the official MIT database from every risk detail panel.

## Local use

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run typecheck
npm test
npm run build
```

## Corpus maintenance

The public-source monitoring protocol is documented in [MONITORING.md](./MONITORING.md). Every configured source must receive one of three states on each run: `changed`, `unchanged` or `not reviewed`. Any `not reviewed` source makes the run incomplete.

## Technology

React, TypeScript, Vite, Motion and a custom high-performance canvas renderer. The canvas supports pointer orbiting, zoom and keyboard node navigation. No analytics, cookies, accounts or private data are used.

## Licence

Application code is released under the MIT License. Source instruments remain subject to the rights and terms of their respective publishers.
