import { createServiceRoleClient } from '@/lib/supabase/server'

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

function nowIST(): Date {
  return new Date(Date.now() + IST_OFFSET_MS)
}

function toIST(date: Date): Date {
  return new Date(date.getTime() + IST_OFFSET_MS)
}

export function formatIST(date: Date): string {
  return toIST(date).toISOString().replace('T', ' ').substring(0, 19) + ' IST'
}

export function getTimeBucket(): '09:15-10:00' | '10:00-11:30' | '11:30-13:00' | '13:00-15:30' | null {
  const now = nowIST()
  const h = now.getUTCHours()
  const m = now.getUTCMinutes()
  const mins = h * 60 + m

  if (mins >= 9 * 60 + 15 && mins < 10 * 60) return '09:15-10:00'
  if (mins >= 10 * 60 && mins < 11 * 60 + 30) return '10:00-11:30'
  if (mins >= 11 * 60 + 30 && mins < 13 * 60) return '11:30-13:00'
  if (mins >= 13 * 60 && mins < 15 * 60 + 30) return '13:00-15:30'
  return null
}

export function getDaysToExpiry(): number {
  const now = nowIST()
  const dayOfWeek = now.getUTCDay() // 0=Sun, 4=Thu
  const daysToThursday = (4 - dayOfWeek + 7) % 7
  // If today is Thursday after 15:30 IST, next Thursday
  if (daysToThursday === 0) {
    const mins = now.getUTCHours() * 60 + now.getUTCMinutes()
    if (mins >= 15 * 60 + 30) return 7
  }
  return daysToThursday === 0 ? 7 : daysToThursday
}

export async function isMarketHoliday(date: Date): Promise<boolean> {
  const supabase = createServiceRoleClient()
  const dateStr = date.toISOString().split('T')[0]
  const { data } = await supabase
    .from('market_holidays')
    .select('id')
    .eq('date', dateStr)
    .single()
  return !!data
}

export async function isMarketOpen(): Promise<boolean> {
  const now = nowIST()
  const dayOfWeek = now.getUTCDay()

  // Weekend check
  if (dayOfWeek === 0 || dayOfWeek === 6) return false

  const h = now.getUTCHours()
  const m = now.getUTCMinutes()
  const mins = h * 60 + m

  // 9:00 AM to 3:30 PM IST
  if (mins < 9 * 60 || mins >= 15 * 60 + 30) return false

  // Holiday check
  const holiday = await isMarketHoliday(now)
  return !holiday
}

export async function isPreMarketWindow(): Promise<boolean> {
  const now = nowIST()
  const dayOfWeek = now.getUTCDay()
  if (dayOfWeek === 0 || dayOfWeek === 6) return false

  const h = now.getUTCHours()
  const m = now.getUTCMinutes()
  const mins = h * 60 + m

  // 8:00 AM to 9:00 AM IST
  if (mins < 8 * 60 || mins >= 9 * 60) return false

  const holiday = await isMarketHoliday(now)
  return !holiday
}
