import {render,screen,fireEvent,within,cleanup} from '@testing-library/react'
import {beforeEach,afterEach,it,expect,vi} from 'vitest'
import {QuestionsProvider} from './LeadershipQuestions'
import {QuestionsView} from './QuestionsView'
import {BRIEF_STORAGE_KEY} from '../lib/questionCatalogue'
beforeEach(()=>{localStorage.clear();HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')}})
afterEach(()=>cleanup())
it('retains questions across audiences and remount, with ordering and clearing in the brief',()=>{
 const renderView=()=>render(<QuestionsProvider><QuestionsView onExplore={vi.fn()}/></QuestionsProvider>)
 const page=renderView()
 expect(screen.queryByRole('button',{name:/Review brief/})).not.toBeInTheDocument()
 fireEvent.click(screen.getAllByRole('button',{name:'+ Add to brief'})[0])
 fireEvent.change(screen.getByRole('combobox',{name:'Question audience'}),{target:{value:'executive'}})
 fireEvent.click(screen.getAllByRole('button',{name:'+ Add to brief'})[0])
 page.unmount();renderView()
 expect(screen.getByRole('combobox',{name:'Question audience'})).toHaveValue('executive')
 fireEvent.click(screen.getByRole('button',{name:/Review brief · 2/}))
 const brief=within(screen.getByRole('dialog',{name:'Your meeting brief'}))
 expect(brief.getAllByRole('listitem').filter(x=>x.parentElement?.className==='brief-questions')).toHaveLength(2)
 const questions=brief.getAllByRole('heading',{level:3}).map(x=>x.textContent)
 fireEvent.click(brief.getAllByRole('button',{name:/Move down:/})[0])
 expect(brief.getAllByRole('heading',{level:3})[0].textContent).toBe(questions[1])
 fireEvent.click(brief.getByRole('button',{name:'Clear brief'}))
 expect(JSON.parse(localStorage.getItem(BRIEF_STORAGE_KEY)!).ids).toEqual([])
 expect(screen.queryByRole('button',{name:/Review brief/})).not.toBeInTheDocument()
},15000)

it('keeps topic choices and the complete catalogue behind compact controls',()=>{
 render(<QuestionsProvider><QuestionsView onExplore={vi.fn()}/></QuestionsProvider>)
 expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Questions')
 expect(screen.getAllByRole('button',{name:'+ Add to brief'})).toHaveLength(5)
 fireEvent.click(screen.getByText('All topics',{selector:'summary'}))
 fireEvent.click(screen.getByRole('checkbox',{name:'Data and privacy'}))
 fireEvent.click(screen.getByRole('checkbox',{name:'Security'}))
 expect(screen.getByRole('checkbox',{name:'Data and privacy'})).toBeChecked()
 expect(screen.getByRole('checkbox',{name:'Security'})).toBeChecked()
 fireEvent.click(screen.getByRole('button',{name:'Done'}))
 expect(screen.getByText('Topics · 2',{selector:'summary'})).toBeInTheDocument()
 const starters=screen.getAllByRole('button',{name:'+ Add to brief'}).length
 fireEvent.click(screen.getByRole('button',{name:/Browse all questions/}))
 expect(screen.getAllByRole('button',{name:'+ Add to brief'}).length).toBeGreaterThan(starters)
 fireEvent.click(screen.getByRole('button',{name:/Back to suggested questions/}))
 expect(screen.getAllByRole('button',{name:'+ Add to brief'})).toHaveLength(starters)
})

it('reveals evidence, follow-ups, references and the context action only on demand',()=>{
 const onExplore=vi.fn()
 render(<QuestionsProvider><QuestionsView onExplore={onExplore}/></QuestionsProvider>)
 const card=within(screen.getAllByRole('article')[0])
 expect(card.getByRole('heading',{name:'What to ask for'})).not.toBeVisible()
 expect(card.getByRole('button',{name:'Read context →'})).not.toBeVisible()
 fireEvent.click(card.getByText('Why ask?',{selector:'summary'}))
 expect(card.getByRole('heading',{name:'What to ask for'})).toBeVisible()
 expect(card.getByRole('heading',{name:'If the answer is vague…'})).toBeVisible()
 expect(card.getAllByRole('link')[0]).toBeVisible()
 fireEvent.click(card.getByRole('button',{name:'Read context →'}))
 expect(onExplore).toHaveBeenCalledWith('concept:accountability')
})
