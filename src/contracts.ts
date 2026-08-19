import { z } from 'zod'

export const serviceOccurrenceSchema = z.object({
  service_occurrence_id: z.string().min(1),
  service_name: z.string().min(1),
  scheduled_start_at: z.string().datetime({ offset: true }),
  scheduled_end_at: z.string().datetime({ offset: true }),
  replay_window_end_at: z.string().datetime({ offset: true }),
  timezone: z.string().min(1),
})

export const attendanceCheckinSchema = z.object({
  checkin_id: z.string().min(1),
  service_occurrence_id: z.string().min(1),
  service_date: z.string().date(),
  service_name: z.string().min(1),
  campus_name: z.string().min(1).optional(),
  person_key: z.string().min(1),
  checkin_at: z.string().datetime({ offset: true }),
  attendance_class: z.enum(['live', 'replay']),
  source_type: z.enum(['api', 'scheduled_export', 'admin_import']),
  ingested_at: z.string().datetime({ offset: true }),
})

export const ministrySubmissionSchema = z.object({
  ministry_id: z.string().min(1),
  reporting_period: z.string().regex(/^\d{4}-\d{2}$/),
  target: z.number(),
  result: z.number().optional(),
  submitted_at: z.string().datetime({ offset: true }).optional(),
})

export const boardMetricSchema = z.object({
  metric_key: z.string().min(1),
  label: z.string().min(1),
  value: z.number().nonnegative().nullable(),
  state: z.enum(['actual', 'missing', 'partial', 'estimated']),
  reporting_period: z.string().regex(/^\d{4}-\d{2}$/),
  refreshed_at: z.string().datetime({ offset: true }),
  explanation: z.string().min(1),
})

export const boardSnapshotSchema = z.object({
  snapshot_id: z.string().min(1),
  reporting_period: z.string().regex(/^\d{4}-\d{2}$/),
  locked_at: z.string().datetime({ offset: true }),
  metrics: z.array(boardMetricSchema),
})

export type ServiceOccurrence = z.infer<typeof serviceOccurrenceSchema>
export type AttendanceCheckin = z.infer<typeof attendanceCheckinSchema>
export type MinistrySubmission = z.infer<typeof ministrySubmissionSchema>
export type BoardMetric = z.infer<typeof boardMetricSchema>
export type BoardSnapshot = z.infer<typeof boardSnapshotSchema>

export const fictionalFixtures = {
  occurrence: {
    service_occurrence_id: 'svc-2026-08-16-1000', service_name: 'Sunday Online Service',
    scheduled_start_at: '2026-08-16T10:00:00-06:00', scheduled_end_at: '2026-08-16T11:15:00-06:00',
    replay_window_end_at: '2026-08-23T11:15:00-06:00', timezone: 'America/Edmonton',
  },
  checkins: [
    { checkin_id: 'chk-001', service_occurrence_id: 'svc-2026-08-16-1000', service_date: '2026-08-16', service_name: 'Sunday Online Service', person_key: 'fictional-a', checkin_at: '2026-08-16T10:04:00-06:00', attendance_class: 'live' as const, source_type: 'api' as const, ingested_at: '2026-08-16T12:00:00-06:00' },
    { checkin_id: 'chk-002', service_occurrence_id: 'svc-2026-08-16-1000', service_date: '2026-08-16', service_name: 'Sunday Online Service', person_key: 'fictional-b', checkin_at: '2026-08-18T18:00:00-06:00', attendance_class: 'replay' as const, source_type: 'scheduled_export' as const, ingested_at: '2026-08-19T08:00:00-06:00' },
  ],
} satisfies { occurrence: ServiceOccurrence; checkins: AttendanceCheckin[] }
