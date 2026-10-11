import {render,screen,fireEvent,within,cleanup} from '@testing-library/react'
import {it,expect,vi,afterEach} from 'vitest'
import {QuestionsProvider} from './LeadershipQuestions'
import {TemporalLens} from './TemporalLens'
import {instruments} from '../data/instruments'
afterEach(()=>{cleanup();vi.useRealTimers()})
it('starts with chronological summaries and expands supporting questions',()=>{
 vi.useFakeTimers();vi.setSystemTime(new Date('2026-10-11T00:00:00Z'))
 HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')}
 render(<QuestionsProvider><TemporalLens open instruments={instruments} onClose={vi.fn()} onSelect={vi.fn()}/></QuestionsProvider>)
 const dialog=screen.getByRole('dialog',{name:'What’s new'})
 expect(within(dialog).getByRole('button',{name:'Latest'})).toHaveAttribute('aria-pressed','true')
 const articles=Array.from(dialog.querySelectorAll('.news-card'))
 const dates=articles.map(e=>e.querySelector('time')!.getAttribute('datetime'))
 expect(dates).toEqual([...dates].sort().reverse())
 const detail=articles[0].querySelector('details')!
 expect(detail).not.toHaveAttribute('open')
 fireEvent.click(within(dialog).getByRole('button',{name:'Priority'}))
 expect(within(dialog).getByText(/Editorial order/)).toBeInTheDocument()
})
