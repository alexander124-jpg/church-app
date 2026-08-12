export const STORAGE_KEY = 'church-volunteer-board:v1'

const DAY = 24 * 60 * 60 * 1000

export function localDateValue(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60 * 1000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

function futureDate(days) {
  return localDateValue(new Date(Date.now() + days * DAY))
}

export function createStarterSlots() {
  const createdAt = new Date().toISOString()
  return [
    { id: 'welcome-team', role: 'Welcome Team', date: futureDate(4), serviceTime: '09:00', volunteerName: '', createdAt },
    { id: 'kids-check-in', role: 'Kids Check-In', date: futureDate(4), serviceTime: '11:00', volunteerName: '', createdAt },
    { id: 'worship-vocals', role: 'Worship Vocals', date: futureDate(11), serviceTime: '09:00', volunteerName: 'Jordan M.', createdAt },
    { id: 'coffee-host', role: 'Coffee Host', date: futureDate(11), serviceTime: '11:00', volunteerName: '', createdAt },
  ]
}

export function isValidSlot(slot) {
  return Boolean(
    slot &&
      typeof slot.id === 'string' &&
      typeof slot.role === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(slot.date) &&
      /^\d{2}:\d{2}$/.test(slot.serviceTime) &&
      typeof slot.volunteerName === 'string' &&
      typeof slot.createdAt === 'string',
  )
}

export function loadSlots() {
  const starter = createStarterSlots()
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(starter))
      return starter
    }
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed) || !parsed.every(isValidSlot)) throw new Error('Invalid saved board')
    return parsed
  } catch {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(starter))
    } catch {
      // The app can still operate in memory when browser storage is unavailable.
    }
    return starter
  }
}

export function saveSlots(slots) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slots))
    return true
  } catch {
    return false
  }
}

export function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `slot-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

