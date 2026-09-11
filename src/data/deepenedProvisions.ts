import type { SourceProvision } from '../types.js'
const checked='2026-09-05'
const nist='https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf'
const apra='https://www.apra.gov.au/standards/cps-230'
// Selective, independently written synopses of the linked public source passages.
export const deepenedProvisions:Record<string,SourceProvision[]>={
 'nist-ai-rmf':[
  {id:'nist-govern-3-2',ref:'GOVERN 3.2 · p. 23',title:'Human–AI responsibilities',summary:'Define differentiated responsibilities for people, AI configurations and oversight through organisational policies and procedures.',conceptIds:['human-oversight','decision-rights','accountability'],sourceUrl:`${nist}#page=27`,reviewedAt:checked,granularity:'outcome'},
  {id:'nist-map-3-5',ref:'MAP 3.5 · p. 27',title:'Document oversight processes',summary:'Specify, assess and document human oversight processes consistently with governance policies.',conceptIds:['human-oversight','documentation'],sourceUrl:`${nist}#page=31`,reviewedAt:checked,granularity:'outcome'},
  {id:'nist-measure-2-1',ref:'MEASURE 2.1 · p. 29',title:'Document evaluation foundations',summary:'Record the test datasets, metrics and tools used for testing, evaluation, verification and validation.',conceptIds:['evaluation','evidence-quality','documentation'],sourceUrl:`${nist}#page=33`,reviewedAt:checked,granularity:'outcome'},
  {id:'nist-measure-2-3',ref:'MEASURE 2.3 · p. 29',title:'Evaluate in representative conditions',summary:'Demonstrate and document performance or assurance criteria in conditions resembling the deployment context.',conceptIds:['evaluation','reliability','evidence-quality'],sourceUrl:`${nist}#page=33`,reviewedAt:checked,granularity:'outcome'},
  {id:'nist-manage-2-4',ref:'MANAGE 2.4 · p. 32',title:'Intervene when behaviour diverges',summary:'Assign responsibilities and apply mechanisms to replace, disengage or deactivate systems whose behaviour diverges from intended use.',conceptIds:['intervention','human-oversight','agent-authority'],sourceUrl:`${nist}#page=36`,reviewedAt:checked,granularity:'outcome'},
 ],
 'apra-cps-230':[
  {id:'cps230-tolerance-dimensions',ref:'Critical operations and tolerance levels',title:'Define disruption tolerances',summary:'Specify tolerances for disruption duration, acceptable data loss and the service maintained under alternative arrangements for each critical operation.',conceptIds:['operational-resilience','materiality'],sourceUrl:apra,reviewedAt:checked,granularity:'section'},
  {id:'cps230-bcp-dependencies',ref:'Business continuity plan',title:'Make continuity dependencies explicit',summary:'A continuity plan includes activation triggers, response actions, execution risks, required resources, internal and external dependencies, and communication arrangements.',conceptIds:['operational-resilience','third-party-risk','incident-response'],sourceUrl:apra,reviewedAt:checked,granularity:'section'},
  {id:'cps230-test-review',ref:'Testing and review',title:'Test continuity against disruption',summary:'The testing programme covers critical operations, an annual exercise and severe but plausible disruptions, including provider failures and contingency arrangements.',conceptIds:['evaluation','operational-resilience','third-party-risk'],sourceUrl:apra,reviewedAt:checked,granularity:'section'},
  {id:'cps230-independent-review',ref:'Testing and review · internal audit',title:'Review the credibility of continuity plans',summary:'Internal audit periodically examines whether the continuity plan credibly maintains operations within tolerance and whether testing is adequate and satisfactorily conducted.',conceptIds:['assurance','evidence-quality','operational-resilience'],sourceUrl:apra,reviewedAt:checked,granularity:'section'},
 ],
}
