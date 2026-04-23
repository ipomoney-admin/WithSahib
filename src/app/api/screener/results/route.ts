import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const segment = searchParams.get('segment')
  const direction = searchParams.get('direction')
  const bucketCode = searchParams.get('bucketCode')
  const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0]

  const supabase = createServiceRoleClient()

  let query = supabase
    .from('screener_results')
    .select('*, screener_signal_tracking(outcome, outcome_pct, price_1d, price_5d, price_10d)')
    .gte('scanned_at', `${date}T00:00:00Z`)
    .lte('scanned_at', `${date}T23:59:59Z`)
    .order('scanned_at', { ascending: false })

  if (segment) query = query.eq('segment', segment)
  if (direction) query = query.eq('direction', direction)
  if (bucketCode) query = query.eq('bucket_code', bucketCode)

  const { data, error } = await query.limit(500)
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  // Group by bucket_code
  const grouped: Record<string, unknown[]> = {}
  for (const row of data ?? []) {
    const key = (row as { bucket_code: string }).bucket_code
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(row)
  }

  return NextResponse.json({ success: true, data: { results: data ?? [], grouped, total: data?.length ?? 0 } })
}
