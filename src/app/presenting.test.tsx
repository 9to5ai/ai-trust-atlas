import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { isPresenting, setPresenting, usePresenting } from './presenting'

function Probe() {
  return <span>{usePresenting() ? 'presenting' : 'idle'}</span>
}

afterEach(() => act(() => setPresenting(false)))

describe('presenting mode', () => {
  it('marks the document and notifies subscribers both ways', () => {
    render(<Probe />)
    expect(screen.getByText('idle')).toBeInTheDocument()
    act(() => setPresenting(true))
    expect(isPresenting()).toBe(true)
    expect(document.documentElement).toHaveAttribute('data-stage')
    expect(screen.getByText('presenting')).toBeInTheDocument()
    act(() => setPresenting(false))
    expect(document.documentElement).not.toHaveAttribute('data-stage')
    expect(screen.getByText('idle')).toBeInTheDocument()
  })
})
