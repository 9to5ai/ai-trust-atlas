# Weekly source monitoring protocol

## Schedule

Run every Monday at 07:00 Australia/Sydney.

## Required result for every source

Each configured official source must be logged as exactly one of:

- `changed`: authoritative content, status, publication date, effective date, scope or official URL changed;
- `unchanged`: the official source was reviewed and no material change was found;
- `not reviewed`: the source could not be assessed, including access restrictions, outage, ambiguous relocation or an incomplete check.

If one or more sources are `not reviewed`, label the entire run `INCOMPLETE`. Do not infer that an inaccessible source is unchanged.

## Review sequence

1. Review every `officialUrl` in the instrument corpus.
2. Review the MIT AI Risk Repository page and public database for taxonomy, record-count, causal-coding, update-date or licence changes.
3. Compare title, issuer, status, dates, scope and substantive source content with the current record.
4. Record the review timestamp, result and supporting URL for every source.
5. For changed sources, identify affected instruments, clause guides, concepts, risk types and relationships.
6. Prepare a proposed corpus update with citations and a plain-language change summary.
7. Run corpus integrity tests before publication.

## Relationship updates

AI-authored relationships are allowed. Each new or changed relationship must still include a relation type, explanation, source anchors, evidence basis and confidence. Cross-framework synthesis must remain visibly distinct from explicit source mappings.

Never create `proves compliance`, `proves control effectiveness` or `is equivalent to` relationships.

Risk-to-concept links must use `risk relevance` and remain labelled as Atlas synthesis. Never translate a source-record count into likelihood, impact, organisational exposure, coverage, mitigation or priority.

## Standards access

For licensed ISO, IEC or IEEE material, use only official public metadata and original summaries. Never ingest, reproduce or publish licensed clause text. An automated access restriction is `not reviewed` unless the official public metadata can be assessed through another authorised public path.

## Human authority boundary

Monitoring and ontology updates do not decide legal applicability, materiality, compliance, operating effectiveness, evidence sufficiency, residual risk or assurance conclusions.
