import { MetricCard, ScorecardShell, TrendBar } from './kpi-ui'
import { aggregateAttendance } from './aggregation'
import { fictionalFixtures } from './contracts'

const metrics = aggregateAttendance(fictionalFixtures.checkins, '2026-08', '2026-08-19T12:00:00Z')

export default function BoardMode() {
  const byKey = Object.fromEntries(metrics.map((metric) => [metric.metric_key, metric]))
  return <ScorecardShell subtitle="August 2026 · Locked aggregate snapshot">
    <main aria-label="Church health board scorecard">
      <section className="kpi-grid" aria-label="Attendance and health KPIs">
        <MetricCard label="Live attendance" value={byKey.live_attendance.value} detail="Verified check-ins · headline KPI" accent="teal" />
        <MetricCard label="Replay attendance" value={byKey.replay_attendance.value} detail="Within seven-day replay window" accent="coral" />
        <MetricCard label="Combined participants" value={byKey.combined_participants.value} detail="Deduplicated live + replay" accent="indigo" />
        <MetricCard label="Unverified reach" value={null} detail="Anonymous views kept separate" state="missing" accent="coral" />
        <MetricCard label="New members" value={3} detail="Approved records this month" accent="teal" />
        <MetricCard label="Active / lapsed" value="—" detail="Leadership definition pending" state="missing" accent="indigo" />
        <MetricCard label="Ministries on track" value="2 / 3" detail="Against approved ministry goals" accent="teal" />
        <MetricCard label="Reporting gaps" value={1} detail="Missing submission, not failure" state="partial" accent="coral" />
      </section>
      <TrendBar label="Live attendance · four-week trend" values={[8, 10, 9, 12]} />
      <section className="board-alert" aria-label="Active alerts"><strong>Data note</strong><span>Attendance decline alerts remain disabled until the comparison basis is approved.</span></section>
    </main>
  </ScorecardShell>
}
