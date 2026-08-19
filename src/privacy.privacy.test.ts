import { describe, expect, it } from 'vitest'
import { aggregateAttendance, assertAggregateOnly, buildBoardSnapshot } from './aggregation'
import { fictionalFixtures } from './contracts'

describe('board privacy contract', () => {
  it('does not serialize person keys into board metrics or snapshots', () => {
    const metrics = aggregateAttendance(fictionalFixtures.checkins, '2026-08', '2026-08-19T12:00:00Z')
    const snapshot = buildBoardSnapshot({ snapshot_id: 'privacy', reporting_period: '2026-08', locked_at: '2026-08-31T12:00:00Z', metrics })
    expect(JSON.stringify(snapshot)).not.toContain('fictional-a')
    expect(() => assertAggregateOnly(snapshot)).not.toThrow()
  })
})
