import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PrintableSummary from './PrintableSummary'

describe('board PDF/print summary', () => {
  it('renders aggregate-only printable content and invokes browser print', () => {
    window.print = vi.fn()
    render(<PrintableSummary />)
    expect(screen.getByRole('heading', { name: "Eagle's Ark Church Health" })).toBeInTheDocument()
    expect(screen.queryByText('fictional-a')).not.toBeInTheDocument()
    screen.getByRole('button', { name: /print/i }).click()
    expect(window.print).toHaveBeenCalled()
  })
})
