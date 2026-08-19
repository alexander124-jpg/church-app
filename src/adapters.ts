import type { AttendanceCheckin, MinistrySubmission } from './contracts'

export type ReachRecord = { service_occurrence_id: string; platform: string; metric_key: string; metric_value: number; captured_at: string }
export type MembershipAggregate = { reporting_period: string; new_members: number; active_members: number | null; lapsed_members: number | null }

export interface CheckinAdapter { listCheckins(startAt: string, endAt: string): Promise<AttendanceCheckin[]> }
export interface ReachAdapter { listReach(startAt: string, endAt: string): Promise<ReachRecord[]> }
export interface MembershipAdapter { getAggregate(reportingPeriod: string): Promise<MembershipAggregate> }
export interface MinistryAdapter { listSubmissions(reportingPeriod: string): Promise<MinistrySubmission[]> }

export class MockCheckinAdapter implements CheckinAdapter {
  constructor(private readonly rows: AttendanceCheckin[] = []) {}
  async listCheckins(startAt: string, endAt: string): Promise<AttendanceCheckin[]> { void startAt; void endAt; return structuredClone(this.rows) }
}

export class MockReachAdapter implements ReachAdapter {
  constructor(private readonly rows: ReachRecord[] = []) {}
  async listReach(startAt: string, endAt: string): Promise<ReachRecord[]> { void startAt; void endAt; return structuredClone(this.rows) }
}

export class MockMembershipAdapter implements MembershipAdapter {
  constructor(private readonly aggregate: MembershipAggregate = { reporting_period: '2026-08', new_members: 0, active_members: null, lapsed_members: null }) {}
  async getAggregate(reportingPeriod: string): Promise<MembershipAggregate> { void reportingPeriod; return { ...this.aggregate } }
}

export class MockMinistryAdapter implements MinistryAdapter {
  constructor(private readonly rows: MinistrySubmission[] = []) {}
  async listSubmissions(): Promise<MinistrySubmission[]> { return structuredClone(this.rows) }
}
