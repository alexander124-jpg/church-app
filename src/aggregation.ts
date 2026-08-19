import type { AttendanceCheckin, BoardMetric, BoardSnapshot } from './contracts'
import { boardSnapshotSchema } from './contracts'

const FORBIDDEN_BOARD_FIELDS = /person[_-]?key|member[_-]?name|email|phone|contact|last[_-]?attended|lapsed[_-]?list/i

export function aggregateAttendance(checkins: AttendanceCheckin[], reportingPeriod: string, refreshedAt: string): BoardMetric[] {
  const unique = (kind: 'live' | 'replay') => new Set(
    checkins.filter((row) => row.attendance_class === kind).map((row) => `${row.service_occurrence_id}:${row.person_key}`),
  ).size
  const combined = new Set(checkins.map((row) => `${row.service_occurrence_id}:${row.person_key}`)).size
  const metric = (key: string, label: string, value: number): BoardMetric => ({
    metric_key: key, label, value, state: 'actual', reporting_period: reportingPeriod, refreshed_at: refreshedAt,
    explanation: 'Calculated from validated, deduplicated verified check-ins.',
  })
  return [metric('live_attendance', 'Live attendance', unique('live')), metric('replay_attendance', 'Replay attendance', unique('replay')), metric('combined_participants', 'Combined participants', combined)]
}

export function buildBoardSnapshot(snapshot: BoardSnapshot): BoardSnapshot {
  const serialized = JSON.stringify(snapshot)
  if (FORBIDDEN_BOARD_FIELDS.test(serialized)) throw new Error('Board payload contains a forbidden person-level field')
  return boardSnapshotSchema.parse(JSON.parse(serialized))
}

export function assertAggregateOnly(value: unknown): void {
  if (FORBIDDEN_BOARD_FIELDS.test(JSON.stringify(value))) throw new Error('Aggregate boundary rejected person-level data')
}
