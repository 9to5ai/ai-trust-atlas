import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../App'
import { resetAssessmentCache } from '../../assess/store'

beforeEach(() => {
  localStorage.clear()
  resetAssessmentCache()
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener() {}, removeEventListener() {} })))
})
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals() })

describe('assess', () => {
  it('creates an assessment, records ratings locally and reports gaps', () => {
    window.history.replaceState(null, '', '/assess')
    render(<App />)
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Pilot bank' } })
    fireEvent.click(screen.getByRole('button', { name: 'Start assessment' }))
    expect(window.location.pathname).toMatch(/^\/assess\/[\w-]+$/)
    const card = screen.getByRole('article', { name: 'Assess impacts and risks' })
    fireEvent.click(within(within(card).getByRole('group', { name: 'Current' })).getByRole('radio', { name: '1' }))
    fireEvent.click(within(within(card).getByRole('group', { name: 'Target' })).getByRole('radio', { name: '4' }))
    expect(JSON.parse(localStorage.getItem('atlas-assessments-v1')!)[0].responses['impact-risk-assessment']).toMatchObject({ current: 1, target: 4 })
    fireEvent.click(screen.getByRole('link', { name: /View report/ }))
    expect(screen.getByRole('heading', { level: 1, name: 'Pilot bank' })).toBeInTheDocument()
    const gaps = screen.getByRole('heading', { name: 'Priority gaps' }).parentElement!
    expect(within(gaps).getByRole('link', { name: /ATC-06 Assess impacts and risks/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Obligations touched by the top gaps' })).toBeInTheDocument()
  })
  it('loads a labelled example straight into the report', () => {
    window.history.replaceState(null, '', '/assess')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Load an example/ }))
    expect(window.location.pathname).toMatch(/\/report$/)
    expect(screen.getByText('Example data — illustrative only')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Board pack/ })).toBeInTheDocument()
  })
})
