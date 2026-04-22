import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createServiceRoleClient()
  const { signal_id } = await req.json()

  if (!signal_id) {
    return NextResponse.json({ success: false, error: 'signal_id required' }, { status: 400 })
  }

  const [signalRes, featuresRes] = await Promise.all([
    supabase.from('signals').select('*').eq('id', signal_id).single(),
    supabase.from('signal_features').select('*').eq('signal_id', signal_id).single(),
  ])

  const signal = signalRes.data
  const features = featuresRes.data

  if (!signal) return NextResponse.json({ success: false, error: 'Signal not found' }, { status: 404 })

  // Classify failure type
  let failureType: 'clean_loss' | 'stop_hunt' | 'premature_entry' | 'sector_against' | 'black_swan' = 'clean_loss'
  let primaryMiss = 'Price moved against position without clear catalyst'
  let secondaryMiss: string | null = null
  let timingAnalysis: string | null = null
  let marketContextAnalysis: string | null = null

  if (features) {
    // Sector against: sector was negative at entry
    if (features.sector_performance !== null && features.sector_performance < -0.5) {
      failureType = 'sector_against'
      primaryMiss = `Entered ${signal.scrip} against sector headwind (sector perf: ${features.sector_performance}%)`
      secondaryMiss = 'Sector momentum was negative at time of entry'
    }

    // VIX too high
    if (features.vix !== null && features.vix > 20) {
      marketContextAnalysis = `High VIX environment (${features.vix}) at entry increased volatility risk`
    }

    // Timing analysis
    if (features.time_bucket) {
      const lateBuckets = ['11:30-13:00', '13:00-15:30']
      if (lateBuckets.includes(features.time_bucket)) {
        timingAnalysis = `Entry in late session bucket (${features.time_bucket}) — liquidity typically lower`
      }
    }

    // Low volume ratio
    if (features.volume_ratio !== null && features.volume_ratio < 0.8) {
      secondaryMiss = secondaryMiss ?? `Low volume confirmation at entry (ratio: ${features.volume_ratio})`
    }
  }

  // Check for recurring pattern (3+ similar losses on same scrip)
  const { data: similarLosses } = await supabase
    .from('signals')
    .select('id, status')
    .eq('scrip', signal.scrip)
    .eq('status', 'sl_hit')
    .neq('id', signal_id)

  const patternDetected =
    (similarLosses?.length ?? 0) >= 2
      ? `Recurring loss pattern detected on ${signal.scrip}: ${(similarLosses?.length ?? 0) + 1} SL hits total`
      : null

  // Find similar winning signals
  const { data: similarWins } = await supabase
    .from('signals')
    .select('id, scrip, segment, entry_low, entry_high, target_1, rr_ratio, published_at')
    .eq('scrip', signal.scrip)
    .in('status', ['t1_hit', 't2_hit', 't3_hit'])
    .limit(5)

  const { data: existing } = await supabase
    .from('signal_postmortems')
    .select('id')
    .eq('signal_id', signal_id)
    .single()

  const postmortemData = {
    signal_id,
    failure_type: failureType,
    primary_miss: primaryMiss,
    secondary_miss: secondaryMiss,
    timing_analysis: timingAnalysis,
    market_context_analysis: marketContextAnalysis,
    pattern_detected: patternDetected,
    similar_winning_signals: similarWins ?? [],
    learning_applied: patternDetected
      ? `Consider avoiding ${signal.scrip} ${signal.segment} setups until pattern reversal confirmed`
      : null,
    ml_recommendation: features?.symbol_historical_winrate !== null && features?.symbol_historical_winrate !== undefined
      ? `Historical win rate for ${signal.scrip}: ${features.symbol_historical_winrate}%`
      : null,
  }

  if (existing) {
    await supabase.from('signal_postmortems').update(postmortemData).eq('id', existing.id)
  } else {
    await supabase.from('signal_postmortems').insert(postmortemData)
  }

  await supabase.from('signal_audit_log').insert({
    signal_id,
    action: 'postmortem_generated',
    notes: `Failure type: ${failureType}`,
  })

  return NextResponse.json({ success: true, data: { signal_id, failure_type: failureType, primary_miss: primaryMiss } })
}
