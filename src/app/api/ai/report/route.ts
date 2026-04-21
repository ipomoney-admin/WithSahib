import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'
import { generateResearchReport } from '@/lib/ai/reports'
import type { ReportInput } from '@/lib/ai/reports'

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerComponentClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Check tier — AI reports require Pro+
    const { data: user } = await supabase.from('users').select('tier').eq('id', session.user.id).single()
    const tierLevel = ({ free: 0, basic: 1, pro: 2, elite: 3 } as Record<string, number>)[user?.tier ?? 'free'] ?? 0
    if (tierLevel < 2) return NextResponse.json({ error: 'Pro plan required' }, { status: 403 })

    const input: ReportInput = await req.json()
    if (!input.company_name || !input.company_symbol || !input.report_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const report = await generateResearchReport(input)

    // Save to DB
    const { data: saved } = await supabase.from('research_reports').insert({
      company_symbol: input.company_symbol,
      company_name: input.company_name,
      report_type: input.report_type,
      title: report.title,
      summary: report.summary,
      content: report.content,
      recommendation: report.recommendation,
      target_price: report.target_price,
      current_price: input.current_price,
      tags: report.tags,
      tier_required: 'pro',
      ai_generated: true,
    }).select().single()

    return NextResponse.json({ report: saved ?? report })
  } catch (err) {
    console.error('AI report error:', err)
    return NextResponse.json({ error: 'Report generation failed' }, { status: 500 })
  }
}
