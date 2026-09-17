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
 expect(within(screen.getByRole('complementary',{name:'Your shortlist'})).queryAllByRole('listitem')).toHaveLength(0)
 fireEvent.click(screen.getAllByRole('button',{name:'+ Add to brief'})[0])
 fireEvent.click(screen.getByRole('button',{name:'Executive'}))
 fireEvent.click(screen.getAllByRole('button',{name:'+ Add to brief'})[0])
 expect(within(screen.getByRole('complementary',{name:'Your shortlist'})).getAllByRole('listitem')).toHaveLength(2)
 page.unmount();renderView()
 const shortlist=within(screen.getByRole('complementary',{name:'Your shortlist'}))
 expect(shortlist.getAllByRole('listitem')).toHaveLength(2)
 const before=shortlist.getAllByRole('listitem').map(x=>x.textContent)
 fireEvent.click(shortlist.getAllByRole('button',{name:/Move down:/})[0])
 expect(shortlist.getAllByRole('listitem')[0].textContent).toBe(before[1])
 fireEvent.click(shortlist.getByRole('button',{name:'Clear shortlist'}))
 expect(JSON.parse(localStorage.getItem(BRIEF_STORAGE_KEY)!).ids).toEqual([])
})
