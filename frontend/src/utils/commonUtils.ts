export const formatAadhar = (value: string) => {
  // Remove all spaces first
  const digits = value.replace(/\s/g, '')
  // Insert space after every 4 digits
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

export const get18YearsAgo = () => {
  const today = new Date()
  today.setFullYear(today.getFullYear() - 18)
  return today.toISOString().toLocaleString().split('T')[0] // format: YYYY-MM-DD
}

export const getTodaysDate = () => {
  return new Date().toISOString().split('T')[0] // format: YYYY-MM-DD
}

// Returns the current month (1–12)
export function getCurrentMonth(): number {
  const date = new Date()
  return date.getMonth() + 1 // JS months are 0-indexed
}

// Returns the current year (e.g. 2025)
export function getCurrentYear(): number {
  return new Date().getFullYear()
}

export const getYesterdaysDate = (date: string) => {
  const yesterday = new Date(date)
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0] // format: YYYY-MM-DD
}

export const formatTimeWithSeconds = (time: string) => {
  // time is expected to be in "HH:mm" or "HH:mm:ss"
  if (time.length === 5) {
    return `${time}:00` // Append seconds if missing
  }
  return time // Already includes seconds
}

import dayjs from 'dayjs'

export const convertToBackendDate = (date: string) => {
  const parsed = dayjs(date, ['YYYY-MM-DD', 'DD-MM-YYYY'], true)
  return parsed.isValid() ? parsed.format('DD-MM-YYYY') : ''
}
export const convertToFrontendDate = (backendDate: string): string => {
  const [dd, mm, yyyy] = backendDate.split('-')
  return `${yyyy}-${mm}-${dd}`
}

export const getMonthFromDate = (date: string): string => {
  const dateObj = new Date(date)
  return dateObj.toLocaleString('default', { month: 'long' })
}

const calculateAge = (dob: string): number => {
  if (!dob) return 0
  const birthDate = new Date(dob)
  const today = new Date()

  // 🛡️ Block future dates
  if (birthDate > today) return 0

  let age = today.getFullYear() - birthDate.getFullYear()
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate())

  if (!hasBirthdayPassed) age--

  return age
}

export default calculateAge

export const generateReferenceNumber = (prefix: string) => {
  const now = new Date()
  const datePart = now.toISOString().split('T')[0].replace(/-/g, '')

  const randomPart = Math.floor(1000 + Math.random() * 9000) // Generates a 4-digit random number

  return `${prefix}-${datePart}-${randomPart}`
}
