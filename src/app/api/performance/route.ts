import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export const revalidate = 300

export async function GET() {
  const supabase = createServiceRoleClient()

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const [overallRes, segmentsRes, recentRes] = await Promise.all([
    supabase
      .from('performance_summary')
      .select('*')
      .eq('month', month)
      .eq('year', year)
      .is('segment', null)
      .single(),
    supabase
      .from('performance_summary')
      .select('*')
      .eq('month', month)
      .eq('year', year)
      .not('segment', 'is', null),
    supabase
      .from('signals')
      .select('id, segment, scrip, status, published_at')
      .not('status', 'in', '("open","cancelled")')
      .order('published_at', { ascending: false })
      .limit(30),
  ])

  const allTimeRes = await supabase
    .from('performance_summary')
    .select('total_calls, t1_hit, t2_hit, t3_hit, sl_hit')
    .is('segment', null)

  const allTimeData = allTimeRes.data ?? []
  const totalCalls = allTimeData.reduce((s, r) => s + (r.total_calls ?? 0), 0)

  return NextResponse.json({
    success: true,
    data: {
      overall: overallRes.data ?? null,
      by_segment: segmentsRes.data ?? [],
      recent_calls_log: (recentRes.data ?? []).map((s) => ({
        id: s.id,
        segment: s.segment,
        scrip: s.scrip,
        status: s.status,
        published_at: s.published_at,
      })),
      all_time_calls: totalCalls,
    },
  })
}
