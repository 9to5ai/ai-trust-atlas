import {render,screen,fireEvent,cleanup,within} from '@testing-library/react'
import {it,expect,vi,afterEach} from 'vitest'
import {QuestionsProvider} from './LeadershipQuestions'
import {IncidentDetail} from './IncidentDetail'
import {incidents} from '../data/incidents'
afterEach(()=>{cleanup();localStorage.clear()})
it('connects an incident to practices and a persistable role-specific brief',()=>{
 HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')}
 const select=vi.fn();render(<QuestionsProvider><IncidentDetail item={incidents[0]} onSelect={select}/></QuestionsProvider>)
 expect(screen.getByRole('heading',{name:'What the reports establish'})).toBeInTheDocument()
 fireEvent.click(screen.getByRole('button',{name:/View practice: Agent constraints/}));expect(select).toHaveBeenCalledWith('control-objective:agent-runtime-constraints')
 fireEvent.click(screen.getByRole('button',{name:'Executive'}));fireEvent.click(screen.getByRole('button',{name:'+ Add to brief'}))
 fireEvent.click(screen.getByRole('button',{name:'Meeting brief, 1 question'}))
 const brief=within(screen.getByRole('dialog',{name:'Your meeting brief'}));expect(brief.getByText(incidents[0].prompts.executive.text)).toBeInTheDocument();expect(brief.getByRole('link',{name:'METR / Redwood: independent investigation ↗'})).toHaveAttribute('href',incidents[0].sources[1].url)
})
