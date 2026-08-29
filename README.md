# AI Trust Atlas

AI Trust Atlas is a public, interactive knowledge graph showing how AI laws, regulatory expectations, standards, risk frameworks, testing resources and threat knowledge relate at the concept level.

The atlas is Australia first, with regulated financial services at its centre and global instruments as comparative layers. It supports semantic zoom from trust domains to concepts, instruments and clause-level guides.

The Risk lens incorporates the MIT AI Risk Repository's seven domains and 24 subdomains as a separate descriptive layer. It connects documented risk types to the Atlas trust ontology while retaining the distinction between MIT source taxonomy and Atlas synthesis.

## What the atlas is

- A navigable ontology of shared AI Trust concepts.
- A source-linked corpus of public, authoritative instruments.
- A map of explained relationships with an explicit evidence basis and confidence label.
- A comparison tool that preserves differences in authority, scope and applicability.
- A progressive risk universe with causal lenses for entity, intent and timing.

## What the atlas is not

It does not determine legal applicability, materiality, compliance, control effectiveness, evidence sufficiency, residual risk or an assurance opinion. Those decisions remain with appropriately accountable people.

A risk-to-concept connection means `relevant to`, not `covered by`, `mitigated by` or `controlled by`. MIT risk record counts are descriptive source classifications; they are not likelihood, impact, exposure or priority scores.

Clause guides for licensed standards are original paraphrases based on public metadata. They do not reproduce the licensed text and do not replace the official standard.

## Relationship model

Each curated relationship records:

- a typed direction, such as `implements`, `extends`, `maps-to` or `provides-testing-for`;
- an explanation;
- whether the basis is explicit in source material or cross-framework synthesis;
- a confidence level;
- source anchors.

The corpus deliberately avoids unsupported claims of equivalence, proven compliance or proven control effectiveness.

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

React, TypeScript, Vite, Motion and a custom high-performance canvas renderer. No analytics, cookies, accounts or private data are used in version 1.

## Licence

Application code is released under the MIT License. Source instruments remain subject to the rights and terms of their respective publishers.
