import { describe, expect, it } from 'vitest'
import { MockCheckinAdapter, MockMembershipAdapter, MockReachAdapter } from './adapters'
import { fictionalFixtures } from './contracts'

describe('provider adapter contracts', () => {
  it('returns isolated mock check-in and reach data', async () => {
    const checkins = await new MockCheckinAdapter(fictionalFixtures.checkins).listCheckins('', '')
    checkins[0].person_key = 'changed-copy'
    expect(fictionalFixtures.checkins[0].person_key).toBe('fictional-a')
    expect(await new MockReachAdapter([{ service_occurrence_id: 'svc', platform: 'video', metric_key: 'stream_views', metric_value: 20, captured_at: '2026-08-19T00:00:00Z' }]).listReach('', '')).toHaveLength(1)
  })

  it('keeps gated membership aggregates nullable', async () => {
    const result = await new MockMembershipAdapter().getAggregate('2026-08')
    expect(result.active_members).toBeNull()
    expect(result.lapsed_members).toBeNull()
  })
})
