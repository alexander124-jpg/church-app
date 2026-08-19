export const pilotConfig = {
  environment: 'fictional-pilot',
  timezone: 'America/Edmonton',
  serviceSchedule: 'Sunday 10:00',
  ministries: [
    { id: 'worship', name: 'Worship Ministry', goal: 'Monthly worship service contribution' },
    { id: 'community-care', name: 'Community Care Ministry', goal: 'Monthly care contacts completed' },
  ],
  boardReviewers: ['aayey812@mtroyal.ca'],
  membershipStatusEnabled: false,
  attendanceDeclineAlertEnabled: false,
  realDataEnabled: false,
} as const
