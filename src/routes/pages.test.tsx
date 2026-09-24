import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'

beforeEach(() => {
  vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2026-09-24T12:00:00.000Z')
  localStorage.clear()
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} })
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1))
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener() {}, removeEventListener() {} })))
})
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals() })
const open = (path: string) => { window.history.replaceState(null, '', path); return render(<App />) }

describe('library', () => {
  it('filters by type from the URL and offers assurance standards as a type', () => {
    open('/library?type=assurance-standard')
    expect(screen.getByRole('heading', { level: 1, name: 'Every source, one shelf' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'ISAE 3000 (Revised)' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: 'EU AI Act' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Assurance standards/ }))
    expect(window.location.search).not.toContain('type=')
    expect(screen.getByRole('heading', { level: 2, name: 'EU AI Act' })).toBeInTheDocument()
  })
  it('collects up to three sources for comparison', () => {
    open('/library?q=CPS')
    fireEvent.click(screen.getByRole('button', { name: 'Add APRA CPS 230 to comparison' }))
    fireEvent.click(screen.getByRole('button', { name: 'Add APRA CPS 234 to comparison' }))
    const tray = screen.getByRole('region', { name: 'Comparison tray' })
    expect(within(tray).getByRole('link', { name: /Compare/ })).toHaveAttribute('href', '/library/compare?ids=apra-cps-230,apra-cps-234')
  })
  it('shows a source page with mapped sections, crosswalk links, dates and a draft label', () => {
    open('/library/eu-ai-act')
    expect(screen.getByRole('heading', { level: 1, name: 'EU AI Act' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Record-keeping/ })).toBeInTheDocument()
    expect(screen.getByText('EU AI Act: Annex III high-risk rules apply')).toBeInTheDocument()
    expect(screen.getAllByText('Draft · awaiting review').length).toBeGreaterThan(0)
  })
  it('compares sources concept by concept', () => {
    open('/library/compare?ids=apra-cps-230,eu-dora')
    expect(screen.getByRole('columnheader', { name: 'APRA CPS 230' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'Operational resilience' })).toBeInTheDocument()
  })
})
