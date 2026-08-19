import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import BoardMode from './BoardMode'

describe('Board Mode', () => {
  it('shows aggregate attendance and keeps reach separate', () => {
    render(<BoardMode />)
    expect(screen.getByText('Live attendance')).toBeInTheDocument()
    expect(screen.getByText('Combined participants')).toBeInTheDocument()
    expect(screen.getByText('Anonymous views kept separate')).toBeInTheDocument()
    expect(screen.getAllByText('No data submitted')).toHaveLength(2)
  })
})
