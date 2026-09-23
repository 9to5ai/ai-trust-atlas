import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { Methodology } from './Methodology'
afterEach(cleanup)
it('explains selection and coverage on its own page', () => {
  render(<Methodology />)
  expect(screen.getByRole('heading', { level: 1, name: 'How the Atlas is curated' })).toBeVisible()
  expect(screen.getByText('15%')).toBeVisible()
  fireEvent.click(screen.getByText('Review cadence and coverage'))
  expect(screen.getByText(/Missing checks make the run incomplete/)).toBeVisible()
  expect(screen.getByRole('link', { name: /Explore the Universe/ })).toHaveAttribute('href', '/universe')
})
