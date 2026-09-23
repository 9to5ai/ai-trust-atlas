import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { tours } from '../data/tours'
import { TourPlayer } from './TourPlayer'

afterEach(cleanup)
describe('tour player', () => {
  it('advances with clicker keys, ignores typing and exits with Escape', () => {
    const onStep = vi.fn(), onExit = vi.fn()
    render(<><TourPlayer tour={tours[0]} step={1} onStep={onStep} onExit={onExit} /><input aria-label="Notes" /></>)
    expect(screen.getByRole('heading', { name: tours[0].steps[1].title })).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'PageDown' }); expect(onStep).toHaveBeenLastCalledWith(2)
    fireEvent.keyDown(window, { key: 'ArrowLeft' }); expect(onStep).toHaveBeenLastCalledWith(0)
    onStep.mockClear()
    fireEvent.keyDown(screen.getByLabelText('Notes'), { key: 'ArrowRight' }); expect(onStep).not.toHaveBeenCalled()
    fireEvent.keyDown(window, { key: 'Escape' }); expect(onExit).toHaveBeenCalledOnce()
  })
  it('offers Finish on the last step', () => {
    const onExit = vi.fn()
    render(<TourPlayer tour={tours[0]} step={tours[0].steps.length - 1} onStep={vi.fn()} onExit={onExit} />)
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }))
    expect(onExit).toHaveBeenCalledOnce()
  })
})
