import { describe, expect, it } from 'vitest'
import { canViewRawMemberData, openExceptions, validateSubmissionAccess, visibleMinistryRecords } from './workflows'

const records = [
  { ministry_id: 'worship', ministry_name: 'Worship', reporting_period: '2026-08', target: 10, result: 12 },
  { ministry_id: 'youth', ministry_name: 'Youth', reporting_period: '2026-08', target: 8, result: 7 },
]

describe('role-aware ministry workflows', () => {
  it('keeps board output aggregate-only and limits ministry history', () => {
    expect(visibleMinistryRecords('board', records)).toEqual([])
    expect(visibleMinistryRecords('ministry', records, 'worship')).toHaveLength(1)
    expect(visibleMinistryRecords('admin', records)).toHaveLength(2)
    expect(canViewRawMemberData('board')).toBe(false)
    expect(canViewRawMemberData('admin')).toBe(true)
  })

  it('denies cross-ministry access and exposes open exceptions to admins', () => {
    expect(() => validateSubmissionAccess('ministry', 'youth', records[0])).toThrow(/own history/)
    expect(openExceptions([{ id: '1', kind: 'invalid_checkin', status: 'open' }, { id: '2', kind: 'missing_submission', status: 'resolved' }])).toHaveLength(1)
  })
})
