import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { Methodology } from './Methodology'
beforeEach(() => { HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open','') }; HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') } })
afterEach(cleanup)
it('explains selection and coverage in an accessible dismissible dialog', () => {
  const close = vi.fn(); render(<Methodology onClose={close} />)
  expect(screen.getByRole('dialog', { name: 'How the Atlas is curated' })).toBeVisible()
  expect(screen.getByText('15%')).toBeVisible()
  fireEvent.click(screen.getByText('Review cadence and coverage'))
  expect(screen.getByText(/Missing checks make the run incomplete/)).toBeVisible()
  fireEvent.click(screen.getByRole('button', { name: 'Close methodology' })); expect(close).toHaveBeenCalledOnce()
})
