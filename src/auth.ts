export type PilotRole = 'board' | 'admin' | 'ministry'

export type PilotIdentity = { email: string; active: boolean; roles: PilotRole[] }

export const pilotIdentity: PilotIdentity = {
  email: 'aayey812@mtroyal.ca',
  active: true,
  roles: ['board', 'admin', 'ministry'],
}

export function authorizePilot(email: string, role: PilotRole): boolean {
  return pilotIdentity.active && email.trim().toLowerCase() === pilotIdentity.email && pilotIdentity.roles.includes(role)
}

export function revokePilot(): void { pilotIdentity.active = false }
