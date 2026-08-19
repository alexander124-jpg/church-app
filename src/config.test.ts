import { describe, expect, it } from 'vitest'
import { assertNoClientSecretKeys, readConfig } from './config'

describe('configuration contract', () => {
  it('uses safe defaults with unresolved features disabled', () => {
    const value = readConfig()
    expect(value.replayWindowDays).toBe(7)
    expect(value.features).toEqual({
      membershipStatus: false,
      attendanceDeclineAlert: false,
      unverifiedReach: false,
      autoBoardDelivery: false,
    })
  })

  it('rejects invalid numeric settings', () => {
    expect(() => {
      const original = import.meta.env.REPLAY_WINDOW_DAYS
      import.meta.env.REPLAY_WINDOW_DAYS = '0'
      try { readConfig() } finally { import.meta.env.REPLAY_WINDOW_DAYS = original }
    }).toThrow(/REPLAY_WINDOW_DAYS/)
  })

  it('rejects likely secrets exposed through Vite', () => {
    expect(() => assertNoClientSecretKeys(['VITE_APP_TITLE', 'VITE_API_KEY'])).toThrow(/VITE_API_KEY/)
    expect(() => assertNoClientSecretKeys(['VITE_APP_TITLE'])).not.toThrow()
  })
})
