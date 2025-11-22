import dayjs from 'dayjs'

export const getDateRange = (start: string, end: string) => {
  const dates: string[] = []
  let current = dayjs(start, 'DD-MM-YYYY')
  const last = dayjs(end, 'DD-MM-YYYY')

  while (current.isBefore(last) || current.isSame(last)) {
    dates.push(current.format('YYYY-MM-DD')) // match DateInput format
    current = current.add(1, 'day')
  }
  return dates
}

export function getDatesBetween(from: string, to: string): string[] {
  const start = new Date(from)
  const end = new Date(to)
  const dates: string[] = []

  const current = new Date(start)
  while (current <= end) {
    const y = current.getFullYear()
    const m = String(current.getMonth() + 1).padStart(2, '0')
    const d = String(current.getDate()).padStart(2, '0')
    dates.push(`${y}-${m}-${d}`)
    current.setDate(current.getDate() + 1)
  }

  return dates
}

// used in time input fields
export function timeTOIso(time: string): string {
  const [hours, minutes, seconds] = time.split(':').map(Number)
  let duration = 'PT'

  if (hours) duration += `${hours}H`
  if (minutes) duration += `${minutes}M`
  if (seconds) duration += `${seconds}S`

  // Edge case: everything is zero
  return duration === 'PT' ? 'PT0S' : duration
}


export function isoToTime(iso: string): string {
  // Match ISO 8601 duration parts
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)

  if (!match) return '00:00:00'

  const hours = String(match[1] ? parseInt(match[1], 10) : 0).padStart(2, '0')
  const minutes = String(match[2] ? parseInt(match[2], 10) : 0).padStart(2, '0')
  const seconds = String(match[3] ? parseInt(match[3], 10) : 0).padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}