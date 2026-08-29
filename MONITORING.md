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
2. Review the MIT AI Risk Repository and AI Risk Mitigation pages for taxonomy, record-count, causal-coding, mitigation, update-date or licence changes.
3. Review the NIST Playbook, Australian Essential AI Practices, OWASP AISVS and CSA AICM public metadata for control-model changes. A CSA licence-gated download is `not reviewed` unless accessed through an authorised path.
4. Compare title, issuer, status, dates, scope and substantive source content with the current record.
5. Record the review timestamp, result and supporting URL for every source.
6. For changed sources, identify affected instruments, source provisions, concepts, risk types, control objectives and mapping assertions.
7. Prepare a proposed corpus update with citations and a plain-language change summary.
8. Run corpus and semantic-path integrity tests before publication.

## Relationship updates

AI-authored relationships are allowed. Each new or changed mapping assertion must include a predicate, rationale, structured citations, basis, confidence, mapping version, verification date and inference depth. Atlas synthesis must remain visibly distinct from source-authored mappings and published crosswalks.

Never create `proves compliance`, `proves control effectiveness` or `is equivalent to` relationships.

Risk-to-concept links must use `threatens` or `relevant to` and remain labelled as Atlas synthesis. Instrument-to-risk associations must remain explainable two-hop paths through concepts or provisions. Never translate a source-record count into likelihood, impact, organisational exposure, coverage, mitigation or priority.

Control mappings must use bounded predicates such as `supports`, `may address`, `synthesised from` and `may produce evidence`. Never create `implemented`, `effective`, `compliant`, `assured` or `risk mitigated` statuses in the public reference ontology.

## Standards access

For licensed ISO, IEC or IEEE material, use only official public metadata and original summaries. Never ingest, reproduce or publish licensed provision or control text. An automated access restriction is `not reviewed` unless the official public metadata can be assessed through another authorised public path.

## Human authority boundary

Monitoring and ontology updates do not decide legal applicability, materiality, compliance, operating effectiveness, evidence sufficiency, residual risk or assurance conclusions.
