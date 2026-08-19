import { describe, expect, it } from 'vitest'
import { deterministicRebuild, isStale, recordCorrection } from './operations'

describe('corrections and monitoring', () => {
  it('records an auditable correction and flags stale snapshots', () => {
    expect(recordCorrection({ actor: 'admin@example.com', action: 'replace', target: 'chk-1', at: '2026-08-19T12:00:00Z', reason: 'Source correction' }).id).toContain('chk-1')
    expect(isStale('2026-08-18T00:00:00Z', Date.parse('2026-08-20T00:00:00Z'))).toBe(true)
    expect(isStale('2026-08-19T12:00:00Z', Date.parse('2026-08-19T13:00:00Z'))).toBe(false)
  })

  it('rebuilds from an ordered copy without mutating source rows', () => {
    const rows = [2, 1]
    expect(deterministicRebuild(rows, (values) => values.reduce((a, b) => a + b, 0))).toBe(3)
    expect(rows).toEqual([2, 1])
  })
})
