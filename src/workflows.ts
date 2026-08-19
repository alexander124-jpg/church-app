import type { MinistrySubmission } from './contracts'

export type UserRole = 'board' | 'admin' | 'ministry'
export type MinistryRecord = MinistrySubmission & { ministry_name: string; notes?: string }

export function visibleMinistryRecords(role: UserRole, records: MinistryRecord[], ministryId?: string): MinistryRecord[] {
  if (role === 'board') return []
  if (role === 'ministry') return records.filter((record) => record.ministry_id === ministryId)
  return records
}

export function canViewRawMemberData(role: UserRole): boolean { return role === 'admin' }

export function validateSubmissionAccess(role: UserRole, ministryId: string | undefined, record: MinistryRecord): void {
  if (role === 'board') throw new Error('Board users may view aggregate outputs only')
  if (role === 'ministry' && ministryId !== record.ministry_id) throw new Error('Ministry users may access only their own history')
}

export type ExceptionRecord = { id: string; kind: 'invalid_checkin' | 'ambiguous_member' | 'missing_submission'; status: 'open' | 'resolved'; note?: string }

export function openExceptions(records: ExceptionRecord[]): ExceptionRecord[] { return records.filter((record) => record.status === 'open') }
