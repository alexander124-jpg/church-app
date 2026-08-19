import { describe, expect, it } from 'vitest'
import { pilotConfig } from './pilot'

describe('fictional pilot configuration', () => {
  it('uses two fictional ministries and keeps real-data features disabled', () => {
    expect(pilotConfig.ministries).toHaveLength(2)
    expect(pilotConfig.realDataEnabled).toBe(false)
    expect(pilotConfig.membershipStatusEnabled).toBe(false)
    expect(pilotConfig.attendanceDeclineAlertEnabled).toBe(false)
  })
})
