import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import App from './App'
import { STORAGE_KEY } from './storage'

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

describe('Volunteer Sign-Up Board', () => {
  it('loads starter slots and signs up a volunteer', () => {
    render(<App />)
    expect(screen.getByText('Welcome Team')).toBeInTheDocument()
    const card = screen.getByText('Welcome Team').closest('article')
    fireEvent.change(within(card).getByPlaceholderText('Your name'), { target: { value: '  Alex   Smith ' } })
    fireEvent.click(within(card).getByRole('button', { name: /i’ll serve/i }))
    expect(within(card).getByText('Alex Smith')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).find((slot) => slot.id === 'welcome-team').volunteerName).toBe('Alex Smith')
  })

  it('rejects an empty volunteer name', () => {
    render(<App />)
    const card = screen.getByText('Welcome Team').closest('article')
    fireEvent.click(within(card).getByRole('button', { name: /i’ll serve/i }))
    expect(within(card).getByText('Please enter your name.')).toBeInTheDocument()
  })

  it('adds and deletes a ministry slot', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /add a slot/i }))
    const form = screen.getByRole('heading', { name: 'Add a ministry slot' }).closest('section')
    fireEvent.change(within(form).getByLabelText('Ministry role'), { target: { value: 'Prayer Team' } })
    fireEvent.change(within(form).getByLabelText('Date'), { target: { value: '2099-12-20' } })
    fireEvent.change(within(form).getByLabelText('Service time'), { target: { value: '10:30' } })
    fireEvent.click(within(form).getByRole('button', { name: 'Add slot' }))
    expect(screen.getByText('Prayer Team')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Delete Prayer Team' }))
    expect(screen.queryByText('Prayer Team')).not.toBeInTheDocument()
  })

  it('reopens a filled slot', () => {
    render(<App />)
    const card = screen.getByText('Worship Vocals').closest('article')
    expect(within(card).getByText('Jordan M.')).toBeInTheDocument()
    fireEvent.click(within(card).getByRole('button', { name: 'Reopen' }))
    expect(within(card).getByPlaceholderText('Your name')).toBeInTheDocument()
    expect(window.confirm).toHaveBeenCalled()
  })

  it('rejects a past date when adding a slot', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /add a slot/i }))
    const form = screen.getByRole('heading', { name: 'Add a ministry slot' }).closest('section')
    fireEvent.change(within(form).getByLabelText('Ministry role'), { target: { value: 'Parking Team' } })
    fireEvent.change(within(form).getByLabelText('Date'), { target: { value: '2020-01-01' } })
    fireEvent.change(within(form).getByLabelText('Service time'), { target: { value: '09:00' } })
    fireEvent.click(within(form).getByRole('button', { name: 'Add slot' }))
    expect(within(form).getByText('Choose today or a future date.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Parking Team' })).not.toBeInTheDocument()
  })

  it('recovers when saved data is malformed', () => {
    localStorage.setItem(STORAGE_KEY, '{broken')
    render(<App />)
    expect(screen.getByText('Welcome Team')).toBeInTheDocument()
  })
})
