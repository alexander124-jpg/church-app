export type AttendanceClass = 'live' | 'replay' | 'outside'
export type DataState = 'actual' | 'missing' | 'partial' | 'estimated'
export type MinistryState = 'on_track' | 'missed_target' | 'at_risk' | 'reporting_gap'

export type ServiceOccurrence = {
  id: string
  scheduledStartAt: string
  scheduledEndAt: string
  replayWindowEndAt: string
}

export type Checkin = {
  personKey?: string
  serviceOccurrenceId: string
  checkinAt: string
  attendanceClass?: AttendanceClass
}

export type MinistrySubmission = {
  target: number
  result?: number
  submitted: boolean
  previousMissed: boolean
}

export type FeatureGate = {
  enabled: boolean
  value: number | null
  explanation: string
}

export function classifyCheckin(checkinAt: string, occurrence: ServiceOccurrence): AttendanceClass {
  const timestamp = Date.parse(checkinAt)
  const start = Date.parse(occurrence.scheduledStartAt)
  const end = Date.parse(occurrence.scheduledEndAt)
  const replayEnd = Date.parse(occurrence.replayWindowEndAt)
  if (![timestamp, start, end, replayEnd].every(Number.isFinite)) return 'outside'
  if (timestamp >= start && timestamp <= end) return 'live'
  if (timestamp > end && timestamp <= replayEnd) return 'replay'
  return 'outside'
}

export function deduplicateCheckins(checkins: Checkin[], attendanceClass?: Exclude<AttendanceClass, 'outside'>): Checkin[] {
  const seen = new Set<string>()
  return checkins.filter((checkin) => {
    if (!checkin.personKey || (attendanceClass && checkin.attendanceClass !== attendanceClass)) return false
    const key = `${checkin.serviceOccurrenceId}:${checkin.personKey}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function countParticipants(checkins: Checkin[], attendanceClass?: Exclude<AttendanceClass, 'outside'>): number {
  return deduplicateCheckins(checkins, attendanceClass).length
}

export function combinedParticipantCount(checkins: Checkin[]): number {
  return new Set(deduplicateCheckins(checkins).map((checkin) => checkin.personKey)).size
}

export function dataState(hasData: boolean, isPartial = false, isEstimated = false): DataState {
  if (isEstimated) return 'estimated'
  if (!hasData) return 'missing'
  if (isPartial) return 'partial'
  return 'actual'
}

export function ministryState(submission: MinistrySubmission): { state: MinistryState; explanation: string } {
  if (!submission.submitted || submission.result === undefined) {
    return { state: 'reporting_gap', explanation: 'No data submitted; this is separate from ministry performance.' }
  }
  const meetsTarget = submission.result >= submission.target
  if (meetsTarget) return { state: 'on_track', explanation: 'Submitted result meets the approved ministry target.' }
  if (submission.previousMissed) return { state: 'at_risk', explanation: 'Approved target missed for two consecutive submitted reporting months.' }
  return { state: 'missed_target', explanation: 'Submitted result missed the approved ministry target for one month.' }
}

export function gatedMetric(enabled: boolean, value: number | null, label: string): FeatureGate {
  if (!enabled) return { enabled: false, value: null, explanation: `${label} is disabled pending leadership approval.` }
  if (value === null) return { enabled: true, value: null, explanation: `No ${label.toLowerCase()} data submitted.` }
  return { enabled: true, value, explanation: `${label} is an approved aggregate metric.` }
}

export function declineAlert(enabled: boolean, current: number, previous: number): { active: boolean; explanation: string } {
  if (!enabled) return { active: false, explanation: 'Attendance decline alerts are disabled pending approval of the comparison basis.' }
  if (previous <= 0) return { active: false, explanation: 'No valid comparison baseline is available.' }
  const decline = (previous - current) / previous
  return { active: decline >= 0.15, explanation: `Live attendance changed ${Math.round(decline * 100)}% versus the comparison period.` }
}
