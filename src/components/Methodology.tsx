import { ArrowRight, BookOpen, Broadcast, CheckCircle, MagnifyingGlass, Scales } from '@phosphor-icons/react'
import { sourcingPolicy } from '../data/sourcingPolicy'
import { Link } from '../app/router'
import { Page, PageHero, Section } from '../ui/Page'
import styles from './Methodology.module.css'

const steps = [
  { icon: MagnifyingGlass, title: 'Look beyond the existing collection.', body: 'Check source documents, publisher releases and topic searches for original evidence.' },
  { icon: CheckCircle, title: 'Check the claim and its limits.', body: 'Record provenance, status, scope, dates and whether we read the full text, an overview or public metadata.' },
  { icon: Scales, title: 'Make a recorded editorial decision.', body: 'Include as a reference, cover as a development, defer or exclude—with a reason. Consolidate duplicate announcements.' },
]

export function Methodology() {
  return (
    <Page labelledBy="method-title">
      <PageHero id="method-title" eyebrow="Methodology" title="How the Atlas is curated" lede="Sources that help you ask better questions. Selected for their authority, relevance and practical value, with the limits of the evidence kept visible." />

      <section className={styles.lanes} aria-label="Two kinds of coverage">
        <article className={styles.lane}><BookOpen size={22} weight="duotone" /><span>01 / Reference</span><h3>A dependable foundation</h3><p>Durable laws, guidance, standards, frameworks and evidence resources. Authority, status and applicability stay attached to each source.</p></article>
        <article className={styles.lane}><Broadcast size={22} weight="duotone" /><span>02 / Developments</span><h3>A view of what is changing</h3><p>Significant publications, findings, consultations and incidents. Linked to existing sources where possible, without adding a permanent node for every announcement.</p></article>
      </section>

      <Section id="weight-title" eyebrow="Editorial rubric" title="What earns a closer look" intro="Our editorial rubric orders research effort. It does not score legal force, compliance or control effectiveness.">
        <div className={styles.factors}>
          {sourcingPolicy.factors.map((factor) => (
            <article key={factor.id} className={styles.factor}>
              <strong className="tabular">{factor.weight}%</strong>
              <h3>{factor.label}</h3>
              <p>{factor.question}</p>
              <div className={styles.meter} aria-hidden="true"><i style={{ width: `${factor.weight * 2.5}%` }} /></div>
            </article>
          ))}
        </div>
        <p className={styles.rule}>Relevant changes to binding obligations always receive review. A high score cannot compensate for missing evidence.</p>
      </Section>

      <Section id="process-title" eyebrow="Process" title="Discover. Verify. Decide.">
        <ol className={styles.steps}>
          {steps.map(({ icon: Icon, title, body }, index) => (
            <li key={title} className={styles.step}><span className={styles.stepIndex}><Icon size={20} weight="duotone" /><em className="tabular">0{index + 1}</em></span><strong>{title}</strong><p>{body}</p></li>
          ))}
        </ol>
      </Section>

      <Section id="principles-title" eyebrow="Principles" title="The boundaries we keep">
        <div className={styles.details}>
          <details><summary>How we judge authority</summary><p>Authority depends on the claim. A regulator can establish supervisory expectations; an original study can provide technical evidence. Neither automatically establishes that a control works in your organisation.</p><p>Relevant binding instruments receive the highest monitoring priority. Guidance and established standards provide context; research and documented incidents surface emerging issues. Vendor claims remain attributed. News and commentary primarily help us find original evidence.</p></details>
          <details><summary>Production use cases</summary><p>Use cases require a named operator, a concrete workflow and public evidence of real deployment. Production status and evidence strength are recorded separately. Company statements establish what the company reports; they do not establish independent performance or effective controls.</p><p>We distinguish observed adoption, reported benefits and targets, and record what remains unknown about human approval and AI permissions. Connections and questions are Atlas interpretations. Publication dates determine recency; reading an old report does not make it new. Pilots, announcements and supplier-only claims do not qualify for the default production collection. Use-case monitoring is not scheduled.</p></details>
          <details><summary>Review cadence and coverage</summary><p>The weekly monitor is configured for Mondays at 7am Sydney time. It checks existing sources plus due publisher and topic searches. Some discovery sources have a monthly cadence. Scheduling is not a guarantee of completed coverage.</p><p>Each check is recorded as changed, unchanged or not reviewed. Missing checks make the run incomplete and block publication of that monitoring run. Licensed sources are reviewed only to their declared public scope; inaccessible detail is never represented as verified.</p><p>Development dates reflect the publication or clearly labelled substantive event, not the date we added it. Unknown dates remain unknown. This is a curated reference and briefing, not a complete newswire.</p></details>
          <details><summary>Evidence, interpretation and human judgement</summary><p>Source-authored relationships and Atlas interpretations remain distinct, with citations and reasoning. Connections and discussion questions help exploration; they do not establish equivalence, applicability, compliance or assurance.</p><p>Accountable people retain decisions about materiality, risk, evidence sufficiency and operating effectiveness. Licensed standards text is not reproduced.</p></details>
        </div>
      </Section>

      <footer className={styles.footer}>
        <span>Selection policy · 10 September 2026. Existing sources have received editorial triage; this does not imply full source re-verification.</span>
        <Link to="/universe" className={styles.cta}>Explore the Universe <ArrowRight size={16} /></Link>
      </footer>
    </Page>
  )
}
