import { cleanup, fireEvent, render, screen, within, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Inspector } from './Inspector'
import { QuestionsProvider } from './LeadershipQuestions'
import { instruments } from '../data/instruments'
import { questionsForNode } from '../data/nodeQuestions'
import type { GraphNodeKind } from '../types'

beforeEach(() => {
  localStorage.clear()
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener() {}, removeEventListener() {} })))
})
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals() })
const cases: [GraphNodeKind, string][] = [
  ['domain', 'governance'], ['concept', 'accountability'], ['instrument', 'apra-cps-230'],
  ['provision', instruments.find(s => s.id === 'apra-cps-230')!.provisions[0].id],
  ['risk-domain', 'mit-risk-2'], ['risk-subdomain', 'mit-risk-2-1'],
  ['control-family', 'protect-constrain'], ['control-objective', 'least-privilege-access'],
]
describe('question panel integration', () => {
  it.each(cases)('lets readers choose a role and save a question from %s', async (kind, id) => {
    render(<QuestionsProvider><Inspector selectedNodeId={`${kind}:${id}`} onClose={vi.fn()} onSelectNode={vi.fn()} causalLens="all" /></QuestionsProvider>)
    const panel = within(screen.getByRole('region', { name: 'Questions to ask' }))
    const expected = questionsForNode(kind, id, 'regulator')[0]
    fireEvent.click(panel.getByRole('button', { name: 'Regulator' }))
    await waitFor(() => expect(panel.getByText(expected.text)).toBeVisible())
    expect(panel.getByRole('button', { name: 'Regulator' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(panel.getAllByRole('button', { name: '+ Add to brief' })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Meeting brief, 1 question' }))
    const brief = within(screen.getByRole('dialog', { name: 'Your meeting brief' }))
    expect(brief.getByRole('heading', { name: expected.text })).toBeVisible()
    expect(brief.getByText(`Regulator · ${expected.context}`)).toBeVisible()
    expect(brief.getAllByRole('link').some(link => link.getAttribute('href') === expected.sources[0].url)).toBe(true)
  })
})
