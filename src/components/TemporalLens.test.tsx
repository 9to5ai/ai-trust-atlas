import {render,screen,fireEvent,within,cleanup} from '@testing-library/react'
import {it,expect,vi,afterEach,beforeEach} from 'vitest'
import {QuestionsProvider} from './LeadershipQuestions'
import {TemporalLens} from './TemporalLens'
import {instruments} from '../data/instruments'

beforeEach(()=>{
 localStorage.clear()
 HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')}
 HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')}
})
afterEach(cleanup)
function showNews(){
 render(<QuestionsProvider><TemporalLens open instruments={instruments} onClose={vi.fn()} onSelect={vi.fn()}/></QuestionsProvider>)
 return screen.getByRole('dialog',{name:'What’s new'})
}
it('starts with dated summaries and keeps questions and feed methodology on demand',()=>{
 const dialog=showNews()
 expect(within(dialog).getByRole('combobox',{name:'Updates order'})).toHaveValue('latest')
 const articles=Array.from(dialog.querySelectorAll('.news-card'))
 const dates=articles.map(e=>e.querySelector('time')!.getAttribute('datetime'))
 expect(dates).toEqual([...dates].sort().reverse())
 expect(articles[0].querySelector('details')).not.toHaveAttribute('open')
 for(const picker of within(dialog).getAllByRole('combobox',{name:'Questions for'}))expect(picker).not.toBeVisible()
 expect(dialog.querySelector('.news-method')).not.toHaveAttribute('open')
 fireEvent.change(within(dialog).getByRole('combobox',{name:'Updates order'}),{target:{value:'priority'}})
 expect(within(dialog).getByText(/Editorial order/)).toBeVisible()
 fireEvent.change(within(dialog).getByRole('combobox',{name:'Time period'}),{target:{value:'120'}})
 expect(within(dialog).getByRole('heading',{name:'OWASP updates its LLM security guide for 2026'})).toBeInTheDocument()
})
it('shares the chosen role across expanded updates and preserves saved questions when the role changes',()=>{
 const dialog=showNews()
 const card=dialog.querySelector('.news-card')!
 card.querySelector('details')!.open=true
 const audience=within(card as HTMLElement).getByRole('combobox',{name:'Questions for'})
 fireEvent.change(audience,{target:{value:'assurance'}})
 expect(localStorage.getItem('atlas-question-audience')).toBe('assurance')
 fireEvent.click(within(card as HTMLElement).getByRole('button',{name:'+ Add to brief'}))
 fireEvent.change(audience,{target:{value:'executive'}})
 expect(within(card as HTMLElement).getByRole('button',{name:'Review brief · 1'})).toBeVisible()
 const second=dialog.querySelectorAll('.news-card')[1] as HTMLElement
 second.querySelector('details')!.open=true
 expect(within(second).getByRole('combobox',{name:'Questions for'})).toHaveValue('executive')
 fireEvent.click(within(card as HTMLElement).getByRole('button',{name:'Review brief · 1'}))
 const brief=screen.getByRole('dialog',{name:'Your meeting brief'})
 expect(within(brief).getByText(/Internal audit & assurance/)).toBeInTheDocument()
})
