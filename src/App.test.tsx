import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within, waitFor } from '@testing-library/react'
import App from './App'

beforeEach(() => {
  vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2026-09-08T12:00:00.000Z')
  localStorage.clear()
  window.history.replaceState(null, '', '/universe')
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  Element.prototype.scrollIntoView = vi.fn()
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} })
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1))
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })))
})
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals() })

const selectOversight = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Search everything' }))
  fireEvent.change(screen.getByLabelText('Search all Atlas objects'), { target: { value: 'human oversight' } })
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^Concept Human oversight/ }))
}

describe('clean universe interface', () => {
  it('keeps the map primary and opens related items from selected details', async () => {
    const { container } = render(<App />)
    expect(screen.getByLabelText(/Interactive orbital map/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Related items' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Build your framework' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Saved items/ })).not.toBeInTheDocument()
    selectOversight()
    await new Promise(resolve => setTimeout(resolve, 600))
    expect(container.querySelector('.is-focus-list')).toBeNull()
    fireEvent.click(within(screen.getByLabelText('Selected node details')).getByRole('button', { name: 'Related items' }))
    expect(container.querySelector('.is-focus-list')).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Return to map' }))
    expect(container.querySelector('.is-focus-list')).toBeNull()
  })

  it('collapses and expands the left panel without discarding selected details', () => {
    const { container } = render(<App />)
    selectOversight()
    fireEvent.click(screen.getByRole('button', { name: 'Collapse left panel' }))
    expect(container.querySelector('main')).toHaveClass('sidebar-collapsed')
    expect(screen.getByLabelText('Selected node details')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Expand left panel' })).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(screen.getByRole('button', { name: 'Expand left panel' }))
    expect(container.querySelector('main')).not.toHaveClass('sidebar-collapsed')
    expect(window.location.hash).toBe('#/concept/human-oversight')
  })

  it('opens deep links directly into the map and retains motion controls', () => {
    window.history.replaceState(null, '', '/#/concept/privacy')
    render(<App />)
    expect(screen.getByRole('button', { name: 'Focus selected object' })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: 'Pause ambient motion' }))
    expect(screen.getByRole('button', { name: 'Resume ambient motion' })).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('source type navigation', () => {
  it('offers eight types, including assurance standards, and keeps binding standards distinct from guidance', () => {
    window.history.replaceState(null, '', '/#/instrument/apra-cps-234')
    render(<App />)
    const types = ['Laws & regulations', 'Treaties', 'Policy & guidance', 'Standards', 'Assurance standards', 'Frameworks', 'Testing & tools', 'Research & databases']
    for (const name of types) expect(screen.getByRole('checkbox', { name })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Regulatory expectation' })).not.toBeInTheDocument()
    const detail = within(screen.getByLabelText('Selected node details'))
    expect(detail.getByText('Legally binding prudential standard within its scope')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Laws & regulations' }))
    expect(screen.getByRole('checkbox', { name: 'Laws & regulations' })).toBeChecked()
    expect(detail.getByRole('heading', { name: 'APRA CPS 234' })).toBeInTheDocument()
  })
})

describe('legal foundation navigation', () => {
  it('opens an enabling Act and reverses the relationship label correctly', async () => {
    window.history.replaceState(null, '', '/#/instrument/apra-cps-220')
    render(<App />)
    fireEvent.click(screen.getByText('Legal foundations', { selector: 'summary' }))
    const legal = within(screen.getByLabelText('Legal foundations', { selector: 'details' }))
    expect(legal.getAllByText('Made under')).toHaveLength(4)
    expect(legal.queryByText('SIS Act')).not.toBeInTheDocument()
    expect(legal.getByText('APRA’s governing legislation')).toBeInTheDocument()
    fireEvent.click(legal.getByRole('button', { name: /Made under Banking Act/ }))
    expect(window.location.hash).toBe('#/instrument/au-banking-act')
    await waitFor(() => {
      const reverse = within(screen.getByLabelText('Legal foundations', { selector: 'details' }))
      expect(reverse.getAllByText('Authorises')).toHaveLength(3)
      expect(reverse.queryByText('Made under')).not.toBeInTheDocument()
    })
  })
})

describe('universe outline', () => {
  it('unfolds the selected source, opens its sections and returns without losing selection', async () => {
    window.history.replaceState(null, '', '/#/instrument/apra-cps-234')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'List' }))
    const tree = within(screen.getByRole('tree', { name: 'Atlas hierarchy' }))
    expect(tree.getByRole('button', { name: 'APRA CPS 234' })).toBeInTheDocument()
    fireEvent.click(tree.getByRole('button', { name: 'Expand APRA CPS 234' }))
    expect(tree.getByRole('button', { name: 'Legal foundations' })).toBeInTheDocument()
    fireEvent.click(tree.getByRole('button', { name: 'Expand Legal foundations' }))
    fireEvent.click(tree.getAllByRole('button', { name: 'Banking Act' })[0])
    expect(window.location.hash).toBe('#/instrument/au-banking-act')
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Universe' }))
    expect(screen.queryByRole('tree')).not.toBeInTheDocument()
    expect(window.location.hash).toBe('#/instrument/au-banking-act')
    fireEvent.click(screen.getByRole('button', { name: 'List' }))
    expect(screen.getByRole('tree')).toBeInTheDocument()
  })
  it('supports keyboard expansion and retains List when changing lenses', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'List' }))
    const tree = screen.getByRole('tree')
    const first = within(tree).getAllByRole('treeitem')[0]
    expect(first).toHaveAttribute('aria-expanded', 'false')
    fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(first).toHaveAttribute('aria-expanded', 'true')
    fireEvent.keyDown(first, { key: 'ArrowLeft' })
    expect(first).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(screen.getByRole('button', { name: 'Risks' }))
    expect(screen.getByRole('heading', { name: 'Explore risks' })).toBeInTheDocument()
    expect(within(tree).getAllByRole('treeitem')).toHaveLength(7)
    fireEvent.click(screen.getByRole('button', { name: 'Controls' }))
    expect(within(tree).getAllByRole('treeitem')).toHaveLength(6)
  })
})

describe('focused reference workflow', () => {
  it('filters a direct source directory and keeps the selected source overview', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'List' }))
    fireEvent.click(screen.getByRole('button', { name: /^All sources/ }))
    fireEvent.change(screen.getAllByLabelText('Search the atlas')[0], { target: { value: 'CPS 234' } })
    const tree = screen.getByRole('tree')
    expect(within(tree).getAllByRole('button', { name: 'APRA CPS 234' })).toHaveLength(1)
    fireEvent.click(within(tree).getByRole('button', { name: 'APRA CPS 234' }))
    await waitFor(() => expect(screen.getByText('What this says')).toBeInTheDocument())
    expect(screen.getByRole('navigation', { name: 'Selected item location' })).toHaveTextContent('APRA CPS 234')
    expect(screen.queryByRole('button', { name: /Compare/ })).not.toBeInTheDocument()
  })
  it('shows developments only, switches periods and opens APRA with its background source', () => {
    render(<App />)
    fireEvent.click(screen.getAllByRole('button', { name: 'What’s new' })[0])
    const history = screen.getByRole('dialog', { name: 'What’s new' })
    expect(within(history).queryByRole('button', { name: 'Corrections' })).not.toBeInTheDocument()
    expect(within(history).queryByRole('button', { name: 'Atlas additions & updates' })).not.toBeInTheDocument()
    const apra = within(history).getByRole('heading', { name: 'Frontier AI: move from awareness to tested resilience' }).closest('article')!
    expect(within(apra).getByRole('button', { name: /Background: APRA AI Letter/ })).toBeInTheDocument()
    expect(within(history).queryByRole('heading', { name: 'DTA expands technical guidance for agentic AI' })).not.toBeInTheDocument()
    fireEvent.click(within(history).getByRole('button', { name: 'Last 120 days' }))
    expect(within(history).getByRole('heading', { name: 'DTA expands technical guidance for agentic AI' })).toBeInTheDocument()
    fireEvent.click(within(apra).getByRole('button', { name: 'Explore in Atlas' }))
    expect(window.location.hash).toBe('#/instrument/apra-asic-frontier-roundtables-2026')
  })
})


describe('view navigation', () => {
  it('opens a shared filtered list, removes chips, and restores context after a search', async () => {
    window.history.replaceState(null,'','/?view=list&type=standard&region=Australia&year=2026')
    render(<App />)
    expect(screen.getByRole('button',{name:'List'})).toHaveAttribute('aria-pressed','true')
    expect(screen.getByText(/No sources match these filters/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button',{name:'Remove Australia filter'}))
    expect(screen.queryByText(/No sources match these filters/)).not.toBeInTheDocument()
    selectOversight()
    expect(window.location.hash).toContain('human-oversight')
    fireEvent.click(screen.getByRole('button',{name:'Back to previous view'}))
    expect(screen.getByRole('button',{name:'Remove Standards filter'})).toBeInTheDocument()
    expect(screen.getByRole('button',{name:'List'})).toHaveAttribute('aria-pressed','true')
    expect(window.location.hash).toBe('')
    expect(window.location.search).toContain('type=standard')
  })
})


describe('audience workspace entry',()=>{
 it('opens Questions without a node and returns to the map after exploring',()=>{
   render(<App />)
   fireEvent.click(within(screen.getByRole('navigation',{name:'Atlas sections'})).getByRole('link',{name:'Questions'}))
   expect(screen.getByRole('region',{name:'Questions workspace'})).toBeInTheDocument()
   expect(window.location.pathname).toBe('/questions')
   fireEvent.click(screen.getByRole('button',{name:'Accountability and governance'}))
   fireEvent.click(screen.getAllByRole('button',{name:'Explore in Atlas →'})[0])
   expect(screen.queryByRole('region',{name:'Questions workspace'})).not.toBeInTheDocument()
   expect(window.location.hash).toContain('concept/accountability')
   fireEvent.click(screen.getByRole('button',{name:'Back to previous view'}))
   expect(screen.getByRole('button',{name:'Accountability and governance'})).toHaveAttribute('aria-pressed','true')
 })
})


describe('production use case journey',()=>{
 it('opens a shared collection, explores a case and returns to its filtered collection',()=>{
  window.history.replaceState(null,'','/?view=use-cases')
  render(<App/>)
  expect(window.location.pathname).toBe('/cases')
  expect(within(screen.getByRole('navigation',{name:'Atlas sections'})).getByRole('link',{name:'Use cases'})).toHaveAttribute('aria-current','page')
  fireEvent.click(screen.getByRole('button',{name:'Detect fraud & manage risk'}))
  fireEvent.click(screen.getByRole('button',{name:'Proposing new fraud rules'}))
  expect(screen.getByRole('heading',{name:'How the work changes'})).toBeInTheDocument()
  expect(window.location.hash).toBe('#/use-case/cba-fraud-agent')
  fireEvent.click(screen.getByRole('button',{name:'Back to previous view'}))
  expect(screen.getByRole('button',{name:'Detect fraud & manage risk'})).toHaveAttribute('aria-pressed','true')
  expect(screen.queryByRole('complementary',{name:'Selected node details'})).not.toBeInTheDocument()
 })
 it('shows use cases in the briefing by publication date and opens their details',()=>{
  render(<App/>)
  fireEvent.click(screen.getAllByRole('button',{name:'What’s new'})[0])
  const news=within(screen.getByRole('dialog',{name:'What’s new'}))
  fireEvent.click(news.getByRole('button',{name:'Use cases'}))
  expect(news.getByText('No reviewed items in this selection')).toBeInTheDocument()
  fireEvent.click(news.getByRole('button',{name:'Last 90 days'}))
  expect(news.getByRole('heading',{name:'Everyday financial assistance'})).toBeInTheDocument()
  expect(news.queryByRole('heading',{name:'Proposing new fraud rules'})).not.toBeInTheDocument()
  fireEvent.click(news.getByRole('button',{name:'Explore use case and questions'}))
  expect(window.location.hash).toBe('#/use-case/bofa-erica')
  expect(screen.getByRole('heading',{name:'How the work changes'})).toBeInTheDocument()
 })
})

describe('pages and browser history',()=>{
 it('rewrites legacy root links onto the Universe route',()=>{
  window.history.replaceState(null,'','/?mode=risk#/instrument/apra-cps-234')
  render(<App/>)
  expect(window.location.pathname).toBe('/universe')
  expect(window.location.hash).toBe('#/instrument/apra-cps-234')
  expect(screen.getByLabelText('Selected node details')).toHaveTextContent('APRA CPS 234')
 })
 it('records selections as browser history so Back returns to the previous item',async()=>{
  window.history.replaceState(null,'','/universe#/instrument/apra-cps-234')
  render(<App/>)
  selectOversight()
  expect(window.location.hash).toBe('#/concept/human-oversight')
  window.history.back()
  await waitFor(()=>expect(window.location.hash).toBe('#/instrument/apra-cps-234'))
  await waitFor(()=>expect(screen.getByLabelText('Selected node details')).toHaveTextContent('APRA CPS 234'))
 })
 it('opens the Universe at the site root and navigates to sections without reloading',()=>{
  window.history.replaceState(null,'','/')
  render(<App/>)
  expect(window.location.pathname).toBe('/universe')
  expect(screen.getByLabelText(/Interactive orbital map/)).toBeInTheDocument()
  fireEvent.click(within(screen.getByRole('navigation',{name:'Atlas sections'})).getByRole('link',{name:'Methodology'}))
  expect(window.location.pathname).toBe('/methodology')
  expect(screen.getByRole('heading',{level:1,name:'How the Atlas is curated'})).toBeInTheDocument()
 })
})

describe('guided tours',()=>{
 it('plays a tour from its link, drives the selection and keeps the step in the URL',()=>{
  window.history.replaceState(null,'','/universe?tour=apra-to-controls&step=0')
  render(<App/>)
  const player=screen.getByRole('region',{name:/Guided tour: From APRA/})
  expect(within(player).getByRole('heading',{name:'One universe, every link sourced'})).toBeInTheDocument()
  fireEvent.click(within(player).getByRole('button',{name:/Next/}))
  expect(window.location.search).toContain('step=1')
  expect(window.location.hash).toBe('#/instrument/apra-ai-letter-2026')
  expect(screen.getByLabelText('Selected node details')).toHaveTextContent('APRA')
  fireEvent.click(within(player).getByRole('button',{name:'Exit tour'}))
  expect(screen.queryByRole('region',{name:/Guided tour/})).not.toBeInTheDocument()
  expect(window.location.search).not.toContain('tour=')
 })
 it('traces a recorded route from the inspector',()=>{
  window.history.replaceState(null,'','/universe#/instrument/apra-cps-230')
  render(<App/>)
  fireEvent.change(screen.getByLabelText('Trace destination'),{target:{value:'control-objective:third-party-assessment'}})
  expect(screen.getAllByRole('button',{name:'Show in Universe'}).length).toBeGreaterThan(0)
  fireEvent.click(screen.getAllByRole('button',{name:'Show in Universe'})[0])
  expect(screen.getByRole('button',{name:'Hide route'})).toHaveAttribute('aria-pressed','true')
 })
})
