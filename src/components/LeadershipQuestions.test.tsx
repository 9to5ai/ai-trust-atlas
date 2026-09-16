import { cleanup, fireEvent, render, screen, within, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { QuestionsProvider, QuestionsPanel, DevelopmentQuestion, AudiencePicker } from './LeadershipQuestions'
import { developments } from '../data/developments'

beforeEach(()=>{
  localStorage.clear()
  HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')}
  HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')}
})
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals()})
const panel=()=>render(<QuestionsProvider><QuestionsPanel kind="concept" id="third-party-risk" /></QuestionsProvider>)
const addFirst=()=>fireEvent.click(screen.getAllByRole('button',{name:'+ Add to brief'})[0])

describe('meeting preparation',()=>{
  it('switches role, retains existing selections, copies and removes a complete brief',async()=>{
    const writeText=vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator',{clipboard:{writeText}})
    panel()
    fireEvent.click(screen.getByRole('button',{name:'Regulator'}))
    expect(localStorage.getItem('atlas-question-audience')).toBe('regulator')
    addFirst()
    fireEvent.click(screen.getByRole('button',{name:'Board'}))
    addFirst()
    fireEvent.click(screen.getByRole('button',{name:'Meeting brief, 2 questions'}))
    const brief=within(screen.getByRole('dialog',{name:'Your meeting brief'}))
    fireEvent.change(brief.getByRole('textbox',{name:'Purpose of the discussion'}),{target:{value:'AI supplier discussion'}})
    fireEvent.click(brief.getByRole('button',{name:'Copy brief'}))
    await waitFor(()=>expect(writeText).toHaveBeenCalledOnce())
    expect(writeText.mock.calls[0][0]).toContain('AI supplier discussion')
    expect(writeText.mock.calls[0][0]).toContain('Regulator')
    expect(writeText.mock.calls[0][0]).toContain('Board')
    expect(writeText.mock.calls[0][0]).toContain('https://')
    const headings=brief.getAllByRole('heading',{level:3}).map(h=>h.textContent)
    fireEvent.click(brief.getAllByRole('button',{name:/Move down:/})[0])
    expect(brief.getAllByRole('heading',{level:3})[0]).toHaveTextContent(headings[1]!)
    fireEvent.click(brief.getAllByRole('button',{name:/Remove:/})[0])
    expect(brief.getAllByRole('heading',{level:3})).toHaveLength(1)
    vi.unstubAllGlobals()
  })
  it('shares role selection with developments and keeps a copy fallback when clipboard is unavailable',async()=>{
    vi.stubGlobal('navigator',{clipboard:{writeText:vi.fn().mockRejectedValue(new Error('Unavailable'))}})
    render(<QuestionsProvider><AudiencePicker/><DevelopmentQuestion item={developments.find(d=>d.id==='apra-frontier-roundtables')!}/></QuestionsProvider>)
    fireEvent.click(screen.getByRole('button',{name:'Executive'}))
    expect(screen.getByText('Which incident decisions can be made immediately, and by whom?')).toBeInTheDocument()
    addFirst()
    fireEvent.click(screen.getByRole('button',{name:'Meeting brief, 1 question'}))
    fireEvent.click(screen.getByRole('button',{name:'Copy brief'}))
    const fallback=await screen.findByRole('textbox',{name:'Brief text to copy'})
    expect((fallback as HTMLTextAreaElement).value).toContain('https://www.apra.gov.au/')
    vi.unstubAllGlobals()
  })
  it('allows more than eight questions with guidance instead of a hard limit',()=>{
    render(<QuestionsProvider><QuestionsPanel kind="domain" id="governance"/><QuestionsPanel kind="domain" id="security"/><QuestionsPanel kind="domain" id="resilience"/></QuestionsProvider>)
    const buttons=screen.getAllByRole('button',{name:'+ Add to brief'}).slice(0,9)
    buttons.forEach(b=>fireEvent.click(b))
    expect(screen.getByRole('button',{name:'Meeting brief, 9 questions'})).toBeInTheDocument()
    expect(screen.getByText(/Five to eight questions usually/)).toBeInTheDocument()
  })
})
