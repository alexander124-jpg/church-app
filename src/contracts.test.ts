import { describe, expect, it } from 'vitest'
import { attendanceCheckinSchema, boardSnapshotSchema, fictionalFixtures } from './contracts'

describe('data contracts', () => {
  it('accepts fictional raw fixtures and aggregate snapshots', () => {
    expect(attendanceCheckinSchema.array().parse(fictionalFixtures.checkins)).toHaveLength(2)
    expect(boardSnapshotSchema.parse({
      snapshot_id: 'snap-1', reporting_period: '2026-08', locked_at: '2026-08-31T12:00:00Z',
      metrics: [{ metric_key: 'live_attendance', label: 'Live attendance', value: 12, state: 'actual', reporting_period: '2026-08', refreshed_at: '2026-08-31T11:00:00Z', explanation: 'Verified live check-ins.' }],
    }).metrics[0].value).toBe(12)
  })

  it('rejects malformed or incomplete records', () => {
    expect(() => attendanceCheckinSchema.parse({ ...fictionalFixtures.checkins[0], person_key: '' })).toThrow()
    expect(() => boardSnapshotSchema.parse({ snapshot_id: 'x', reporting_period: '2026-08', locked_at: 'bad', metrics: [] })).toThrow()
  })
})
