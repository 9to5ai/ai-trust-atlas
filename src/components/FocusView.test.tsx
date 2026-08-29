import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FocusView } from './FocusView'

afterEach(cleanup)

describe('selected node focus view', () => {
  it('turns an instrument selection into readable relationship and structure lists', () => {
    const onSelectNode = vi.fn()
    const onBack = vi.fn()
    render(<FocusView selectedNodeId="instrument:eu-ai-act" onSelectNode={onSelectNode} onBack={onBack} />)

    expect(screen.getByRole('heading', { name: 'EU AI Act' })).toBeInTheDocument()
    expect(screen.getByText('Explained relationships')).toBeInTheDocument()
    expect(screen.getByText('Structural connections')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Article 9 · Risk management system/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /NIST AI RMF/i }))
    expect(onSelectNode).toHaveBeenCalledWith('instrument:nist-ai-rmf')
    fireEvent.click(screen.getByRole('button', { name: /Back to universe/i }))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('provides list navigation for concepts, domains and clauses', () => {
    const props = { onSelectNode: vi.fn(), onBack: vi.fn() }
    const conceptView = render(<FocusView selectedNodeId="concept:human-oversight" {...props} />)
    expect(screen.getByRole('heading', { name: 'Human oversight' })).toBeInTheDocument()
    expect(screen.getByText('Parent trust domain')).toBeInTheDocument()
    conceptView.unmount()

    const domainView = render(<FocusView selectedNodeId="domain:governance" {...props} />)
    expect(screen.getByText('Navigate the ontology without tracing lines.')).toBeInTheDocument()
    domainView.unmount()

    render(<FocusView selectedNodeId="clause:eu-ai-act-14" {...props} />)
    expect(screen.getByRole('heading', { name: 'Human oversight' })).toBeInTheDocument()
    expect(screen.getByText('Parent instrument')).toBeInTheDocument()
  })
})
