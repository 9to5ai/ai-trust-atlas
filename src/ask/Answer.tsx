import { Fragment, type ReactNode } from 'react'
import { Link } from '../app/router'
import { recordLink } from './links'
import type { AskRecord } from './useAsk'
import styles from './Ask.module.css'

/*
 * Renders the model's answer as safe React elements: paragraphs, bullets,
 * **bold** and numbered citation chips. No HTML from the model is ever inserted.
 */
const MARKER = /\[\[([a-z-]+:[a-z0-9-]+)\]\]/g

export function citationOrder(text: string) {
  const order: string[] = []
  for (const match of text.matchAll(MARKER)) if (!order.includes(match[1])) order.push(match[1])
  return order
}

function inline(text: string, order: string[], records: Map<string, AskRecord>, key: string): ReactNode[] {
  const parts: ReactNode[] = []
  let last = 0
  const pattern = /\*\*([^*]+)\*\*|\[\[([a-z-]+:[a-z0-9-]+)\]\]/g
  for (const match of text.matchAll(pattern)) {
    if (match.index! > last) parts.push(text.slice(last, match.index))
    if (match[1]) parts.push(<strong key={`${key}-b${match.index}`}>{match[1]}</strong>)
    else {
      const id = match[2]
      const number = order.indexOf(id) + 1
      const record = records.get(id)
      parts.push(<Link key={`${key}-c${match.index}`} to={recordLink(id)} className={styles.cite} title={record ? `${record.title} (${record.kind})` : id} aria-label={`Source ${number}: ${record?.title ?? id}`}>{number}</Link>)
    }
    last = match.index! + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export function Answer({ text, records }: { text: string; records: AskRecord[] }) {
  const order = citationOrder(text)
  const byId = new Map(records.map((record) => [record.id, record]))
  const blocks = text.trim().split(/\n{2,}/)
  return (
    <div className={styles.answer}>
      {blocks.map((block, index) => {
        const lines = block.split('\n').filter((line) => line.trim())
        const bullets = lines.every((line) => /^\s*[-*•]\s+/.test(line))
        if (bullets) return <ul key={index}>{lines.map((line, item) => <li key={item}>{inline(line.replace(/^\s*[-*•]\s+/, ''), order, byId, `${index}-${item}`)}</li>)}</ul>
        return <p key={index}>{lines.map((line, item) => <Fragment key={item}>{item > 0 && <br />}{inline(line.replace(/^#+\s*/, ''), order, byId, `${index}-${item}`)}</Fragment>)}</p>
      })}
    </div>
  )
}
