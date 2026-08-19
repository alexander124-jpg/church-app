import { describe, expect, it } from 'vitest'
import { aggregateAttendance, assertAggregateOnly, buildBoardSnapshot } from './aggregation'
import { fictionalFixtures } from './contracts'

describe('privacy-safe aggregation boundary', () => {
  it('deduplicates live/replay and combined counts deterministically', () => {
    const rows = [...fictionalFixtures.checkins, { ...fictionalFixtures.checkins[0], checkin_id: 'duplicate' }]
    const metrics = aggregateAttendance(rows, '2026-08', '2026-08-19T12:00:00Z')
    expect(metrics.map(({ value }) => value)).toEqual([1, 1, 2])
  })

  it('accepts aggregate snapshots and rejects person-level board payloads', () => {
    const snapshot = buildBoardSnapshot({ snapshot_id: 'snap-1', reporting_period: '2026-08', locked_at: '2026-08-31T12:00:00Z', metrics: [] })
    expect(snapshot.metrics).toEqual([])
    expect(() => assertAggregateOnly({ live_attendance: 4, person_key: 'private' })).toThrow(/person-level/)
  })
})
