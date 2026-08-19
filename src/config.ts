export type FeatureFlags = {
  membershipStatus: boolean
  attendanceDeclineAlert: boolean
  unverifiedReach: boolean
  autoBoardDelivery: boolean
}

export type AppConfig = {
  appTitle: string
  environment: string
  timezone: string
  reportingCutoffDay: number
  replayWindowDays: number
  serviceSchedule: string
  deploymentEnvironment: string
  features: FeatureFlags
}

const FALSE_VALUES = new Set(['false', '0', 'off', 'no', ''])

function envValue(key: string, fallback = ''): string {
  return (import.meta.env?.[key] ?? fallback).trim()
}

function booleanValue(key: string, fallback = false): boolean {
  const value = envValue(key, String(fallback)).toLowerCase()
  return !FALSE_VALUES.has(value)
}

function integerValue(key: string, fallback: number, min: number, max: number): number {
  const value = Number.parseInt(envValue(key, String(fallback)), 10)
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${key} must be an integer between ${min} and ${max}`)
  }
  return value
}

export function readConfig(): AppConfig {
  const timezone = envValue('APP_TIMEZONE', 'America/Edmonton')
  const serviceSchedule = envValue('SERVICE_SCHEDULE', 'Sunday 10:00')
  if (!timezone || !serviceSchedule) throw new Error('APP_TIMEZONE and SERVICE_SCHEDULE are required')

  return {
    appTitle: envValue('VITE_APP_TITLE', "Eagle's Ark Board KPI Tracker"),
    environment: envValue('VITE_ENVIRONMENT_LABEL', 'local'),
    timezone,
    reportingCutoffDay: integerValue('REPORTING_CUTOFF_DAY', 25, 1, 31),
    replayWindowDays: integerValue('REPLAY_WINDOW_DAYS', 7, 1, 31),
    serviceSchedule,
    deploymentEnvironment: envValue('DEPLOYMENT_ENVIRONMENT', 'local'),
    features: {
      membershipStatus: booleanValue('FEATURE_MEMBERSHIP_STATUS'),
      attendanceDeclineAlert: booleanValue('FEATURE_ATTENDANCE_DECLINE_ALERT'),
      unverifiedReach: booleanValue('FEATURE_UNVERIFIED_REACH'),
      autoBoardDelivery: booleanValue('FEATURE_AUTO_BOARD_DELIVERY'),
    },
  }
}

export const config = readConfig()

export function assertNoClientSecretKeys(keys: string[]): void {
  const forbidden = keys.filter((key) => /KEY|TOKEN|SECRET|PASSWORD|OAUTH|RECIPIENT/i.test(key) && key.startsWith('VITE_'))
  if (forbidden.length) throw new Error(`Sensitive configuration cannot use the VITE_ prefix: ${forbidden.join(', ')}`)
}
