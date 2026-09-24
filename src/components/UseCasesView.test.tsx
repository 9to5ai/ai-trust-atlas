import {render,screen,fireEvent,cleanup,within} from '@testing-library/react'
import {it,expect,vi,afterEach,beforeEach} from 'vitest'
import {QuestionsProvider} from './LeadershipQuestions'
import {UseCasesView} from './UseCasesView'
import {UseCaseDetail} from './UseCaseDetail'
import {useCases} from '../data/useCases'
afterEach(()=>{cleanup();localStorage.clear()})
beforeEach(()=>{HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')}})
it('filters production cards and shortlists a role question without opening a node',()=>{
 const explore=vi.fn();render(<QuestionsProvider><UseCasesView active onExplore={explore} onShowUniverse={vi.fn()}/></QuestionsProvider>)
 fireEvent.click(screen.getByRole('button',{name:'Detect fraud & manage risk'}))
 expect(screen.getByRole('status')).toHaveTextContent('2 documented deployments')
 fireEvent.change(screen.getByPlaceholderText('Company or use case'),{target:{value:'Commonwealth'}})
 expect(screen.getByRole('status')).toHaveTextContent('1 documented deployment')
 fireEvent.click(screen.getByRole('button',{name:'Executive'}))
 fireEvent.click(screen.getByText('Question for Executive'))
 fireEvent.click(screen.getByRole('button',{name:'+ Add to brief'}))
 fireEvent.click(screen.getByRole('button',{name:'Your shortlist · 1'}))
 expect(within(screen.getByRole('dialog',{name:'Your meeting brief'})).getByText(useCases[0].prompts.executive.text)).toBeInTheDocument()
 expect(explore).not.toHaveBeenCalled()
})
it('shows limits and navigates from a use case to a concrete practice',()=>{
 const select=vi.fn();render(<QuestionsProvider><UseCaseDetail item={useCases[0]} onSelect={select}/></QuestionsProvider>)
 expect(screen.getByText(useCases[0].human)).toBeInTheDocument()
 expect(screen.getByText(useCases[0].limitations)).toBeInTheDocument()
 fireEvent.click(screen.getByRole('button',{name:/Define decision rights and approval gates/}))
 expect(select).toHaveBeenCalledWith('control-objective:decision-rights-approval')
})
