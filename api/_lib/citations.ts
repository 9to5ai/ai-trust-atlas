/*
 * Streaming citation filter. The model cites records as [[kind:id]]. Markers
 * for ids that were not supplied are removed, so an answer can only link to
 * records the server actually retrieved. Partial markers are held back until
 * complete, so a marker split across stream chunks is still checked.
 */
const MARKER = /\[\[([^\]]{1,200})\]\]/g

export class CitationFilter {
  readonly cited = new Set<string>()
  readonly dropped = new Set<string>()
  private pending = ''

  constructor(private readonly allowed: Set<string>) {}

  push(text: string): string {
    this.pending += text
    const open = this.pending.lastIndexOf('[[')
    const close = this.pending.lastIndexOf(']]')
    let ready = this.pending
    if (open !== -1 && open > close) {
      ready = this.pending.slice(0, open)
      this.pending = this.pending.slice(open)
      if (this.pending.length > 240) { ready += this.pending; this.pending = '' }
    } else if (this.pending.endsWith('[')) {
      ready = this.pending.slice(0, -1)
      this.pending = '['
    } else {
      this.pending = ''
    }
    return this.clean(ready)
  }

  flush(): string {
    const rest = this.clean(this.pending)
    this.pending = ''
    return rest.replace(/\[\[[^\]]*$/, '')
  }

  private clean(text: string) {
    return text.replace(MARKER, (_, inner: string) => {
      const ids = inner.split(/[,;\s]+/).map((id) => id.trim()).filter(Boolean)
      const kept = ids.filter((id) => this.allowed.has(id))
      ids.filter((id) => !this.allowed.has(id)).forEach((id) => this.dropped.add(id))
      kept.forEach((id) => this.cited.add(id))
      return kept.map((id) => `[[${id}]]`).join('')
    })
  }
}

/* Soft check on the finished answer for conclusive assurance language. */
export const conclusiveLanguage = /\b(is|are|will be|makes you|ensures?|guarantees?)\s+(fully\s+)?(compliant|assured|certified|effective|equivalent)\b/i
