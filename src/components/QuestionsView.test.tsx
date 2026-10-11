import {render,screen,fireEvent,within,cleanup} from '@testing-library/react'
import {beforeEach,afterEach,it,expect,vi} from 'vitest'
import {QuestionsProvider} from './LeadershipQuestions'
import {QuestionsView} from './QuestionsView'
import {BRIEF_STORAGE_KEY} from '../lib/questionCatalogue'
beforeEach(()=>{localStorage.clear();HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')}})
afterEach(()=>cleanup())
it('shortlists across topics and audiences, survives remount, and clears persisted selections',()=>{
 const renderView=()=>render(<QuestionsProvider><QuestionsView onExplore={vi.fn()}/></QuestionsProvider>)
 const page=renderView()
 expect(screen.queryByRole('complementary',{name:'Your brief'})).not.toBeInTheDocument()
 fireEvent.click(screen.getAllByRole('button',{name:'+ Add to brief'})[0])
 fireEvent.click(screen.getByRole('button',{name:'Executive'}))
 fireEvent.click(screen.getAllByRole('button',{name:'+ Add to brief'})[0])
 expect(within(screen.getByRole('complementary',{name:'Your brief'})).getAllByRole('listitem')).toHaveLength(2)
 page.unmount();renderView()
 const shortlist=within(screen.getByRole('complementary',{name:'Your brief'}))
 expect(shortlist.getAllByRole('listitem')).toHaveLength(2)
 const before=shortlist.getAllByRole('listitem').map(x=>x.textContent)
 fireEvent.click(shortlist.getAllByRole('button',{name:/Move down:/})[0])
 expect(shortlist.getAllByRole('listitem')[0].textContent).toBe(before[1])
 fireEvent.click(shortlist.getByRole('button',{name:'Clear brief'}))
 expect(JSON.parse(localStorage.getItem(BRIEF_STORAGE_KEY)!).ids).toEqual([])
}, 15000)

it('starts with a focused selection and supports topics without losing the full catalogue',()=>{
 render(<QuestionsProvider><QuestionsView onExplore={vi.fn()}/></QuestionsProvider>)
 expect(screen.getAllByRole('button',{name:'+ Add to brief'})).toHaveLength(5)
 fireEvent.click(screen.getByRole('button',{name:/Data and privacy/}))
 expect(screen.getAllByRole('button',{name:'+ Add to brief'}).length).toBeGreaterThan(0)
 expect(screen.queryByText('No questions match this selection')).not.toBeInTheDocument()
 const starters=screen.getAllByRole('button',{name:'+ Add to brief'}).length
 fireEvent.click(screen.getByRole('button',{name:'Browse all'}))
 expect(screen.getAllByRole('button',{name:'+ Add to brief'}).length).toBeGreaterThan(starters)
})
