import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-check'
import { calculateRR } from '@/lib/signal-utils'
import { captureSignalFeatures } from '@/lib/capture-features'

const MIN_RR: Record<string, number> = {
  intraday: 2,
  stock_options: 2.5,
  index_options: 1.5,
  swing: 3,
}

export async function GET(req: NextRequest) {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()

  const supabase = createServiceRoleClient()
  const { searchParams } = req.nextUrl

  const segment = searchParams.get('segment')
  const status = searchParams.get('status')
  const limit = Math.min(Number(searchParams.get('limit') ?? 20), 100)
  const offset = Number(searchParams.get('offset') ?? 0)

  if (!user) {
    // Public: minimal info only
    let query = supabase
      .from('signals')
      .select('id, segment, scrip, status, published_at')
      .order('published_at', { ascending: false })
      .limit(30)

    if (segment) query = query.eq('segment', segment)
    if (status) query = query.eq('status', status)

    const { data } = await query
    return NextResponse.json({ success: true, data: data ?? [] })
  }

  const adminUser = await isAdmin(user.id)

  if (adminUser) {
    let query = supabase
      .from('signals')
      .select('*')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (segment) query = query.eq('segment', segment)
    if (status) query = query.eq('status', status)

    const { data } = await query
    return NextResponse.json({ success: true, data: data ?? [] })
  }

  // Member: check subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status, current_period_end')
    .eq('user_id', user.id)
    .single()

  if (!sub || !['active', 'grace_period'].includes(sub.status) || new Date(sub.current_period_end) < new Date()) {
    return NextResponse.json({ success: false, error: 'Active subscription required' }, { status: 403 })
  }

  const allowedSegments =
    ['pro', 'elite'].includes(sub.plan)
      ? ['intraday', 'stock_options', 'index_options', 'swing']
      : sub.plan === 'basic'
      ? ['swing']
      : []

  if (allowedSegments.length === 0) {
    return NextResponse.json({ success: false, error: 'Upgrade required' }, { status: 403 })
  }

  let query = supabase
    .from('signals')
    .select('id, segment, scrip, strike, entry_low, entry_high, stop_loss, stop_loss_type, target_1, target_2, target_3, rr_ratio, rationale, status, published_at, analyst_holding, is_modified, t1_hit_at, t2_hit_at, t3_hit_at, sl_hit_at, validity_date')
    .in('segment', allowedSegments)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (segment && allowedSegments.includes(segment)) query = query.eq('segment', segment)
  if (status) query = query.eq('status', status)

  const { data } = await query
  return NextResponse.json({ success: true, data: data ?? [] })
}

export async function POST(req: NextRequest) {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user || !(await isAdmin(user.id))) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
  }

  const body = await req.json()
  const {
    alert_id,
    segment, scrip, strike,
    entry_low, entry_high, stop_loss, stop_loss_type,
    target_1, target_2, target_3,
    rationale, validity_date, pattern_type, analyst_holding,
  } = body

  if (!segment || !scrip || entry_low == null || entry_high == null || stop_loss == null || !target_1 || !rationale) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
  }

  const rr = calculateRR(Number(entry_low), Number(entry_high), Number(stop_loss), Number(target_1))
  const minRR = MIN_RR[segment] ?? 1.5

  if (rr < minRR) {
    return NextResponse.json({
      success: false,
      error: `R:R ratio ${rr} is below minimum ${minRR} for ${segment}`,
    }, { status: 400 })
  }

  const supabase = createServiceRoleClient()

  const signalData = {
    alert_id: alert_id ?? null,
    segment,
    scrip,
    strike: strike ?? null,
    original_entry_low: Number(entry_low),
    original_entry_high: Number(entry_high),
    original_stop_loss: Number(stop_loss),
    original_target_1: Number(target_1),
    original_target_2: target_2 ? Number(target_2) : null,
    original_target_3: target_3 ? Number(target_3) : null,
    entry_low: Number(entry_low),
    entry_high: Number(entry_high),
    stop_loss: Number(stop_loss),
    stop_loss_type: stop_loss_type ?? 'hard',
    target_1: Number(target_1),
    target_2: target_2 ? Number(target_2) : null,
    target_3: target_3 ? Number(target_3) : null,
    rr_ratio: rr,
    rationale,
    validity_date: validity_date ?? null,
    pattern_type: pattern_type ?? null,
    analyst_holding: analyst_holding ?? false,
    published_by: user.id,
    status: 'open',
  }

  const { data: signal, error } = await supabase
    .from('signals')
    .insert(signalData)
    .select()
    .single()

  if (error || !signal) {
    return NextResponse.json({ success: false, error: error?.message ?? 'Insert failed' }, { status: 500 })
  }

  // Mark alert as approved if from alert
  if (alert_id) {
    await supabase
      .from('signal_alerts')
      .update({ review_status: 'approved', reviewed_by: user.id, reviewed_at: new Date().toISOString() })
      .eq('id', alert_id)
  }

  // Capture ML features (non-blocking)
  captureSignalFeatures(signal.id, scrip, segment).catch(() => {})

  await supabase.from('signal_audit_log').insert({
    signal_id: signal.id,
    alert_id: alert_id ?? null,
    action: 'signal_published',
    performed_by: user.id,
    new_values: signalData,
  })

  return NextResponse.json({ success: true, data: signal }, { status: 201 })
}
