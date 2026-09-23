import { ArrowRight, ArrowSquareOut, Briefcase, ClipboardText, Flask, Lightning, ShieldCheck, Stamp } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Link } from '../../app/router'
import { controlObjectives } from '../../data/controls'
import { playbooks, toolPurposes, tools, type ToolPurpose } from '../../data/implement'
import { incidents } from '../../data/incidents'
import { useCases } from '../../data/useCases'
import { Badge, DraftBadge } from '../../ui/Kit'
import { Page, PageHero, Section } from '../../ui/Page'
import styles from './Implement.module.css'

const purposeIcons: Record<ToolPurpose, Icon> = { 'Test and evaluate': Flask, 'Secure and red-team': ShieldCheck, 'Govern and document': ClipboardText, 'Provenance and transparency': Stamp }
const controlCode = new Map(controlObjectives.map((control) => [control.id, control.code]))

export function ImplementPage() {
  return (
    <Page labelledBy="implement-title" wide>
      <PageHero id="implement-title" eyebrow="Implement" title="From obligation to operating control" lede="Playbooks that sequence the work, open tools that help you test and document it, and real deployments and incidents to learn from." />

      <Section id="playbooks-title" eyebrow="Playbooks" title="Five programmes teams run now" intro="Each step links to the candidate controls it builds and the sources that motivate it. They describe common practice, not obligations.">
        <div className={styles.playbooks}>
          {playbooks.map((playbook, index) => (
            <Link key={playbook.id} to={`/implement/${playbook.id}`} className={styles.playbook}>
              <span className={styles.index}>0{index + 1}</span>
              <h3>{playbook.title}</h3>
              <p>{playbook.outcome}</p>
              <div className={styles.meta}><Badge>{playbook.timeframe}</Badge><Badge>{playbook.steps.length} steps</Badge>{playbook.editorialStatus === 'draft' && <DraftBadge />}</div>
              <span className={styles.cta}>Open playbook <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="tools-title" eyebrow="Tools" title="Open tools, listed without endorsement" intro="Government, standards-body, non-profit and community open-source resources. Commercial products are deliberately excluded.">
        <div className={styles.toolGroups}>
          {toolPurposes.map((purpose) => {
            const PurposeIcon = purposeIcons[purpose]
            return (
              <div key={purpose} className={styles.toolGroup}>
                <h3><PurposeIcon size={18} weight="duotone" /> {purpose}</h3>
                <ul>
                  {tools.filter((tool) => tool.purpose === purpose).map((tool) => (
                    <li key={tool.id}>
                      <div className={styles.toolHead}>
                        <a href={tool.url} target="_blank" rel="noreferrer">{tool.name} <ArrowSquareOut size={12} /></a>
                        <small>{tool.publisher} · {tool.kind}</small>
                      </div>
                      <p>{tool.summary}</p>
                      <div className={styles.controls}>
                        {tool.controlIds.map((id) => <Link key={id} to={`/crosswalk/${id}`}>{controlCode.get(id)}</Link>)}
                        {tool.instrumentId && <Link to={`/library/${tool.instrumentId}`}>Source record</Link>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </Section>

      <Section id="field-title" eyebrow="From the field" title="Learn from real deployments and incidents">
        <div className={styles.field}>
          <Link to="/cases" className={styles.fieldCard}>
            <Briefcase size={24} weight="duotone" />
            <strong>{useCases.length} production use cases</strong>
            <span>Company-reported deployments across financial services, retail and technology — what the AI does, where people stay in control and what remains unknown.</span>
            <span className={styles.cta}>Browse use cases <ArrowRight size={14} /></span>
          </Link>
          <Link to="/universe?incidents=1" className={styles.fieldCard}>
            <Lightning size={24} weight="duotone" />
            <strong>{incidents.length} reviewed incidents</strong>
            <span>What went wrong, the practices to examine and the questions to ask — separated from the Atlas’s interpretation.</span>
            <span className={styles.cta}>See incidents in the Universe <ArrowRight size={14} /></span>
          </Link>
          <Link to="/assess" className={styles.fieldCard}>
            <ClipboardText size={24} weight="duotone" />
            <strong>Measure where you are</strong>
            <span>Rate the 24 control objectives privately, see the priority gaps and export a board pack.</span>
            <span className={styles.cta}>Start an assessment <ArrowRight size={14} /></span>
          </Link>
        </div>
      </Section>
    </Page>
  )
}
