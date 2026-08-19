import { beforeEach, describe, expect, it } from 'vitest'
import { authorizePilot, pilotIdentity, revokePilot } from './auth'

beforeEach(() => { pilotIdentity.active = true })

describe('single-account pilot authorization', () => {
  it('allows the approved account and denies unknown identities', () => {
    expect(authorizePilot('AAYEY812@MTROYAL.CA', 'board')).toBe(true)
    expect(authorizePilot('other@example.com', 'admin')).toBe(false)
  })

  it('supports server-side revocation', () => {
    revokePilot()
    expect(authorizePilot('aayey812@mtroyal.ca', 'admin')).toBe(false)
  })
})
