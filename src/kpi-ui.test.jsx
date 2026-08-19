import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MetricCard, ScorecardShell, TrendBar } from './kpi-ui'

describe('scorecard UI primitives', () => {
  it('renders metric state and missing-data language', () => {
    render(<MetricCard label="Replay attendance" value={null} detail="Awaiting source" state="missing" />)
    expect(screen.getByText('No data submitted')).toBeInTheDocument()
  })

  it('renders board shell and accessible trend bars', () => {
    render(<ScorecardShell><TrendBar label="Live attendance" values={[10, 12, 9, 14]} /></ScorecardShell>)
    expect(screen.getByRole('heading', { name: "Eagle's Ark" })).toBeInTheDocument()
    expect(screen.getByLabelText('Live attendance four-week trend')).toBeInTheDocument()
  })
})
