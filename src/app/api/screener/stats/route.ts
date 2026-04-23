import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createServiceRoleClient()
  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [todayRes, thirtyDayRes] = await Promise.all([
    supabase
      .from('screener_results')
      .select('id, direction, shared_with_users, bucket_code, bucket_name')
      .gte('scanned_at', `${today}T00:00:00Z`),
    supabase
      .from('screener_signal_tracking')
      .select('bucket_code, outcome, outcome_pct, shared_with_users, price_10d, signal_price')
      .gte('signal_date', thirtyDaysAgo),
  ])

  const todayData = todayRes.data ?? []
  const thirtyData = thirtyDayRes.data ?? []

  const bullishToday = todayData.filter((r) => (r as { direction: string }).direction === 'bullish').length
  const bearishToday = todayData.filter((r) => (r as { direction: string }).direction === 'bearish').length
  const sharedToday = todayData.filter((r) => (r as { shared_with_users: boolean }).shared_with_users).length

  // Best bucket last 30d
  const bucketStats: Record<string, { wins: number; total: number; name: string }> = {}
  for (const row of thirtyData) {
    const r = row as { bucket_code: string; outcome: string; shared_with_users: boolean }
    if (!r.shared_with_users) continue
    if (!bucketStats[r.bucket_code]) bucketStats[r.bucket_code] = { wins: 0, total: 0, name: r.bucket_code }
    const bs = bucketStats[r.bucket_code]!
    if (r.outcome !== 'open') {
      bs.total++
      if (r.outcome === 'win') bs.wins++
    }
  }

  let bestBucket = { code: '—', name: '—', winRate: 0 }
  for (const [code, stats] of Object.entries(bucketStats)) {
    if (stats.total >= 3) {
      const wr = (stats.wins / stats.total) * 100
      if (wr > bestBucket.winRate) bestBucket = { code, name: stats.name, winRate: wr }
    }
  }

  // Win rate last 30d (shared signals only, closed)
  const closedShared = thirtyData.filter(
    (r) => (r as { shared_with_users: boolean; outcome: string }).shared_with_users &&
            (r as { outcome: string }).outcome !== 'open'
  )
  const wins30d = closedShared.filter((r) => (r as { outcome: string }).outcome === 'win').length
  const winRate30d = closedShared.length > 0 ? Math.round((wins30d / closedShared.length) * 100) : 0

  // Missed opportunities (not shared, price moved >10%)
  const missed = thirtyData.filter((r) => {
    const row = r as { shared_with_users: boolean; signal_price: number; price_10d: number | null }
    if (row.shared_with_users || !row.price_10d || !row.signal_price) return false
    const move = Math.abs((row.price_10d - row.signal_price) / row.signal_price) * 100
    return move > 10
  }).length

  return NextResponse.json({
    success: true,
    data: {
      bullishToday,
      bearishToday,
      sharedToday,
      bestBucket,
      winRate30d,
      missedOpportunities: missed,
    },
  })
}
