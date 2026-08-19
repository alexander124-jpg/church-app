export type AuditEntry = { id: string; actor: string; action: string; target: string; at: string; reason: string }

export function recordCorrection(entry: Omit<AuditEntry, 'id'>): AuditEntry {
  return { ...entry, id: `audit-${entry.at}-${entry.target}` }
}

export function isStale(lastRefreshAt: string, now = Date.now(), maxAgeMs = 26 * 60 * 60 * 1000): boolean {
  const refreshed = Date.parse(lastRefreshAt)
  return !Number.isFinite(refreshed) || now - refreshed > maxAgeMs
}

export function deterministicRebuild<T>(rows: T[], aggregate: (values: T[]) => unknown): unknown {
  return aggregate([...rows])
}
