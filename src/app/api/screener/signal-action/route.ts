import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || !body.resultId || !body.action) {
    return NextResponse.json({ success: false, error: 'Missing resultId or action' }, { status: 400 })
  }

  if (!['share', 'ignore'].includes(body.action)) {
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  }

  const supabase = createServiceRoleClient()

  const updates =
    body.action === 'share'
      ? { shared_with_users: true, shared_at: new Date().toISOString() }
      : { shared_with_users: false }

  const { data, error } = await supabase
    .from('screener_results')
    .update(updates)
    .eq('id', body.resultId)
    .select()
    .single()

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  // Sync tracking table
  await supabase
    .from('screener_signal_tracking')
    .update({ shared_with_users: body.action === 'share' })
    .eq('screener_result_id', body.resultId)

  return NextResponse.json({ success: true, data })
}
