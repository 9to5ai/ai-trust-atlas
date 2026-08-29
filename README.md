# AI Trust Atlas

AI Trust Atlas is a public, interactive knowledge graph showing how AI laws, regulatory expectations, standards, risk frameworks, testing resources and threat knowledge relate at the concept level.

The atlas is Australia first, with regulated financial services at its centre and global instruments as comparative layers. It supports semantic zoom from trust domains to concepts, instruments and clause-level guides.

## What the atlas is

- A navigable ontology of shared AI Trust concepts.
- A source-linked corpus of public, authoritative instruments.
- A map of explained relationships with an explicit evidence basis and confidence label.
- A comparison tool that preserves differences in authority, scope and applicability.

## What the atlas is not

It does not determine legal applicability, materiality, compliance, control effectiveness, evidence sufficiency, residual risk or an assurance opinion. Those decisions remain with appropriately accountable people.

Clause guides for licensed standards are original paraphrases based on public metadata. They do not reproduce the licensed text and do not replace the official standard.

## Relationship model

Each curated relationship records:

- a typed direction, such as `implements`, `extends`, `maps-to` or `provides-testing-for`;
- an explanation;
- whether the basis is explicit in source material or cross-framework synthesis;
- a confidence level;
- source anchors.

The corpus deliberately avoids unsupported claims of equivalence, proven compliance or proven control effectiveness.

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
