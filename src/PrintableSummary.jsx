import { aggregateAttendance } from './aggregation'
import { fictionalFixtures } from './contracts'

const metrics = aggregateAttendance(fictionalFixtures.checkins, '2026-08', '2026-08-19T12:00:00Z')

export default function PrintableSummary() {
  return <article className="print-summary" aria-label="Printable board summary">
    <header><p>Board summary · August 2026</p><h1>Eagle's Ark Church Health</h1><span>Locked aggregate snapshot · refreshed Aug 19, 2026</span></header>
    <section className="print-metrics">{metrics.map((metric) => <div key={metric.metric_key}><small>{metric.label}</small><strong>{metric.value}</strong></div>)}<div><small>New members</small><strong>3</strong></div><div><small>Reporting gaps</small><strong>1</strong></div></section>
    <footer><strong>Data note</strong><span>Unverified reach is excluded from attendance. Missing submissions are not treated as zero.</span></footer>
    <button className="print-button" onClick={() => window.print()}>Print / save PDF</button>
  </article>
}
