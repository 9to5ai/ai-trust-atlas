import { describe, expect, it } from 'vitest'
import { instruments } from './instruments'
import { requirements } from './requirements'
import { mappingAssertions, riskPathsForInstrument } from './assertions'
import { developments, filterDevelopments } from './developments'
import { timelineEvents } from './timeline'
import { audiences, questionForDevelopment } from './leadershipQuestions'
import { questionsForNode } from './nodeQuestions'
import { RBNZ_FRONTIER_ID, RBNZ_FRONTIER_PDF, rbnzFrontierDevelopment } from './rbnzFrontierCyber'

describe('RBNZ/FMA frontier-AI supervisory expectations', () => {
  const source = instruments.find(item => item.id === RBNZ_FRONTIER_ID)!
  it('preserves jurisdiction, authorship and supervisory status without inventing commencement', () => {
    expect(source).toMatchObject({region: 'New Zealand', issuerType: 'regulator', legalEffect: 'supervisory-expectation', published: '2026-10-15', lastVerified: '2026-10-20'})
    expect(source.issuer).toContain('Financial Markets Authority')
    expect(source.applicability).toContain('existing prudential')
    expect(source.effective).toBeUndefined()
    const expectations = requirements.filter(item => item.instrumentId === source.id)
    expect(expectations).toHaveLength(4)
    for (const item of expectations) {
      expect(item.modality).toBe('should')
      expect(item.appliesFrom).toBeUndefined()
      expect(item.sourceUrl).toMatch(/#page=[456]$/)
    }
  })
  it('preserves source-level detail for the remediation trade-off and retained supplier accountability', () => {
    expect(source.provisions.find(item => item.id === 'nz-frontier-cyber-defence')?.summary).toContain('change risk managed')
    expect(source.provisions.find(item => item.id === 'nz-frontier-cyber-suppliers')?.summary).toContain('entities retain operational-risk accountability')
    expect(source.provisions.find(item => item.id === 'nz-frontier-cyber-recovery')?.sourceUrl).toBe(`${RBNZ_FRONTIER_PDF}#page=6`)
    const controls = mappingAssertions.filter(item => item.id.startsWith('map:requirement:req-nz-frontier-cyber-') && item.id.includes(':control:'))
    expect(controls.length).toBeGreaterThan(0)
    for (const item of controls) {
      expect(item).toMatchObject({basis: 'atlas-synthesis', confidence: 'medium', inferenceDepth: 1, verifiedAt: '2026-10-20'})
      expect(item.rationale).toContain('does not establish')
      expect(item.citations[0].url).toContain('#page=')
    }
    expect(riskPathsForInstrument(source.id).length).toBeGreaterThan(0)
  })
  it('gives each source section its own four role prompts and precise evidence links', () => {
    const authored: string[] = []
    for (const [kind, id, url] of [['instrument', source.id, source.officialUrl], ...source.provisions.map(item => ['provision', item.id, item.sourceUrl!] as const)] as const) {
      const qs = audiences.map(role => questionsForNode(kind as 'instrument' | 'provision', id, role)[0])
      expect(new Set(qs.map(item => item.text)).size).toBe(4)
      for (const q of qs) {
        expect(q.id).toContain(':focus:')
        expect(q.sources[0].url).toBe(url)
        authored.push(q.text)
      }
    }
    expect(new Set(authored).size).toBe(20)
  })
  it('keeps the original event date and emits one timeline event rather than double-counting the release', () => {
    const item = developments.find(candidate => candidate.id === rbnzFrontierDevelopment.id)!
    expect(item).toMatchObject({published: '2026-10-15', reviewed: '2026-10-20', added: '2026-10-20', sourceId: source.id})
    expect(item.implication).toContain('do not themselves create a new standalone AI law')
    expect(filterDevelopments(30, 'all', '2026-10-14').some(candidate => candidate.id === item.id)).toBe(false)
    expect(filterDevelopments(30, 'all', '2026-10-20').filter(candidate => candidate.id === item.id)).toHaveLength(1)
    const events = timelineEvents.filter(event => event.instrumentId === source.id)
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({kind: 'published', date: '2026-10-15'})
    const qs = audiences.map(role => questionForDevelopment(item, role)!)
    expect(new Set(qs.map(q => q.text)).size).toBe(4)
    for (const q of qs) expect(q.sources[0].url).toBe(item.url)
  })
})
