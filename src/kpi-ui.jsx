import './kpi.css'

export function MetricCard({ label, value, detail, state = 'actual', accent = 'teal' }) {
  return <article className={`kpi-metric kpi-accent-${accent}`} data-state={state}>
    <p className="kpi-label">{label}</p>
    <p className="kpi-value">{value ?? '—'}</p>
    <p className="kpi-detail">{detail}</p>
    {state !== 'actual' && <span className="kpi-state">{state === 'missing' ? 'No data submitted' : state}</span>}
  </article>
}

export function ScorecardShell({ children, title = "Eagle's Ark", subtitle = 'Church health scorecard' }) {
  return <div className="scorecard-shell"><header className="scorecard-header"><div><p className="scorecard-eyebrow">Board mode · Non-financial KPIs</p><h1>{title}</h1><p>{subtitle}</p></div><span className="freshness">Locked snapshot</span></header>{children}</div>
}

export function TrendBar({ label, values = [], max = Math.max(...values, 1) }) {
  return <div className="trend-row"><span>{label}</span><div className="trend-bars" aria-label={`${label} four-week trend`}>{values.map((value, index) => <i key={`${label}-${index}`} style={{ height: `${Math.max(8, (value / max) * 100)}%` }} title={`${value}`} />)}</div></div>
}
