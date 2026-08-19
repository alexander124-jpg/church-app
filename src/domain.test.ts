import { describe, expect, it } from 'vitest'
import { classifyCheckin, combinedParticipantCount, countParticipants, dataState, declineAlert, gatedMetric, ministryState } from './domain'

const occurrence = {
  id: 'service-1',
  scheduledStartAt: '2026-08-16T16:00:00Z',
  scheduledEndAt: '2026-08-16T17:00:00Z',
  replayWindowEndAt: '2026-08-23T17:00:00Z',
}

describe('KPI domain rules', () => {
  it('classifies live, replay, and outside the configured window', () => {
    expect(classifyCheckin('2026-08-16T16:00:00Z', occurrence)).toBe('live')
    expect(classifyCheckin('2026-08-18T12:00:00Z', occurrence)).toBe('replay')
    expect(classifyCheckin('2026-08-24T12:00:00Z', occurrence)).toBe('outside')
  })

  it('deduplicates repeated person check-ins and combined categories', () => {
    const rows = [
      { personKey: 'a', serviceOccurrenceId: 'service-1', checkinAt: '', attendanceClass: 'live' as const },
      { personKey: 'a', serviceOccurrenceId: 'service-1', checkinAt: '', attendanceClass: 'live' as const },
      { personKey: 'a', serviceOccurrenceId: 'service-1', checkinAt: '', attendanceClass: 'replay' as const },
      { personKey: 'b', serviceOccurrenceId: 'service-1', checkinAt: '', attendanceClass: 'replay' as const },
    ]
    expect(countParticipants(rows, 'live')).toBe(1)
    expect(countParticipants(rows, 'replay')).toBe(2)
    expect(combinedParticipantCount(rows)).toBe(2)
  })

  it('represents missing, partial, and actual data explicitly', () => {
    expect(dataState(false)).toBe('missing')
    expect(dataState(true, true)).toBe('partial')
    expect(dataState(true)).toBe('actual')
  })

  it('separates reporting gaps from ministry performance and detects consecutive risk', () => {
    expect(ministryState({ target: 10, submitted: false, previousMissed: false }).state).toBe('reporting_gap')
    expect(ministryState({ target: 10, result: 9, submitted: true, previousMissed: false }).state).toBe('missed_target')
    expect(ministryState({ target: 10, result: 9, submitted: true, previousMissed: true }).state).toBe('at_risk')
  })

  it('keeps membership and alerts behind feature gates', () => {
    expect(gatedMetric(false, 4, 'Active members').value).toBeNull()
    expect(declineAlert(false, 50, 100).active).toBe(false)
    expect(declineAlert(true, 80, 100).active).toBe(true)
  })
})
