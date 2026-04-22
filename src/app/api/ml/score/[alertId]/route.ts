import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-check'

type Params = { params: { alertId: string } }

export async function GET(req: NextRequest, { params }: Params) {
  const { alertId } = params
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user || !(await isAdmin(user.id))) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
  }

  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('signal_ml_scores')
    .select('win_probability, confidence_level, top_risk_factors, suggested_sl_adjustment, similar_winning_count, similar_losing_count, model_used, model_version, training_samples, trained_on, feature_importances, created_at')
    .eq('alert_id', alertId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!data) {
    return NextResponse.json({ success: false, error: 'No ML score available for this alert' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data })
}
