import {it,expect} from 'vitest'
import {newsFeed} from './newsFeed'
import {instruments} from '../data/instruments'
it('interleaves categories by original publication or findings date',()=>{
 const feed=newsFeed(30,'all','2026-10-11','latest',instruments)
 expect(feed.some(e=>e.kind==='use-case')).toBe(true)
 expect(feed.some(e=>e.kind==='incident')).toBe(true)
 expect(feed.some(e=>e.item.id==='mas-ai-risk-guidelines-final')).toBe(true)
 for(let i=1;i<feed.length;i++)expect(feed[i].date<=feed[i-1].date).toBe(true)
 expect(feed.findIndex(e=>e.item.id==='mas-ai-risk-guidelines-final')).toBeLessThan(feed.findIndex(e=>e.kind==='use-case'))
 expect(feed.some(e=>e.item.id==='dbs-joy-account-enquiries')).toBe(false)
})
it('uses a disclosed category priority and preserves topic and date scope',()=>{
 const latest=newsFeed(90,'security','2026-10-11','latest',instruments)
 const priority=newsFeed(90,'security','2026-10-11','priority',instruments)
 expect(priority.map(e=>e.item.id).sort()).toEqual(latest.map(e=>e.item.id).sort())
 expect(priority.every(e=>e.item.topics.includes('security'))).toBe(true)
 for(let i=1;i<priority.length;i++)expect(priority[i].priority>=priority[i-1].priority).toBe(true)
})
