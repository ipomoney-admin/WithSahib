import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-check'
import { getModelForSymbol, getConfidenceTier } from '@/lib/ml/model-store'
import { encodeFeature, FEATURE_NAMES } from '@/lib/ml/feature-encoder'
import { forestPredictProba } from '@/lib/ml/random-forest'

function cronGuard(req: NextRequest): boolean {
  return req.headers.get('x-cron-secret') === process.env.CRON_SECRET
}

function topRiskFactors(
  featureVector: number[],
  featureImportances: number[],
  winProb: number
): Array<{ factor: string; impact: string; direction: 'risk' | 'positive' }> {
  const risks: Array<{ factor: string; impact: string; direction: 'risk' | 'positive'; importance: number }> = []

  FEATURE_NAMES.forEach((name, i) => {
    const importance = featureImportances[i] ?? 0
    if (importance < 0.02) return

    let label = name.replace(/_/g, ' ')
    let direction: 'risk' | 'positive' = winProb >= 0.5 ? 'positive' : 'risk'

    const featureVal = featureVector[i] ?? 0
    // VIX risk
    if (name === 'vix' && featureVal > 18) {
      label = `High VIX (${featureVal.toFixed(1)})`
      direction = 'risk'
    }
    // Volume low
    if (name === 'volume_ratio' && featureVal < 0.8) {
      label = `Low volume ratio (${featureVal.toFixed(2)}x)`
      direction = 'risk'
    }
    // Historical win rate
    if (name === 'symbol_historical_winrate' && featureVal < 50) {
      label = `Low symbol win rate (${featureVal.toFixed(0)}%)`
      direction = 'risk'
    }

    risks.push({ factor: label, impact: (importance * 100).toFixed(1) + '%', direction, importance })
  })

  return risks
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 3)
    .map(({ factor, impact, direction }) => ({ factor, impact, direction }))
}

export async function GET(req: NextRequest) {
  const isCron = cronGuard(req)
  if (!isCron) {
    const authClient = createServerComponentClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
  }

  const supabase = createServiceRoleClient()

  const { data: pendingAlerts } = await supabase
    .from('signal_alerts')
    .select('*, signal_features(*, signals(scrip, segment))')
    .eq('review_status', 'pending')

  if (!pendingAlerts || pendingAlerts.length === 0) {
    return NextResponse.json({ success: true, data: { scored: 0 } })
  }

  const scored: string[] = []

  for (const alert of pendingAlerts) {
    const modelResult = await getModelForSymbol(alert.scrip, alert.segment)
    if (!modelResult) continue

    const rawFeature = {
      vix: alert.signal_features?.vix,
      nifty_trend: alert.signal_features?.nifty_trend,
      nifty_vs_20ema: alert.signal_features?.nifty_vs_20ema,
      sector_performance: alert.signal_features?.sector_performance,
      volume_ratio: alert.signal_features?.volume_ratio,
      vwap_distance: alert.signal_features?.vwap_distance,
      atr_pct: alert.signal_features?.atr_pct,
      time_bucket: alert.signal_features?.time_bucket,
      day_of_week: alert.signal_features?.day_of_week,
      days_to_expiry: alert.signal_features?.days_to_expiry,
      iv_percentile: alert.signal_features?.iv_percentile,
      signal_rr_promised: alert.rr_ratio,
      symbol_historical_winrate: alert.signal_features?.symbol_historical_winrate,
      similar_setup_count: alert.signal_features?.similar_setup_count,
    }

    const featureVector = encodeFeature(rawFeature, modelResult.medians)
    const winProbability = forestPredictProba(modelResult.forest, featureVector)

    const { data: modelRow } = await supabase
      .from('ml_models')
      .select('training_samples, accuracy, model_version, trained_at')
      .eq('symbol', modelResult.modelUsed === 'global' ? '' : alert.scrip)
      .eq('status', 'active')
      .single()

    const confidence = getConfidenceTier(
      modelRow?.training_samples ?? 0,
      modelRow?.accuracy ?? 0
    )

    const riskFactors = topRiskFactors(
      featureVector,
      modelResult.forest.featureImportances,
      winProbability
    )

    // SHAP-style: suggest tighter SL if win prob < 0.4
    const suggestedSlAdjustment =
      winProbability < 0.4 && alert.stop_loss
        ? Number((alert.stop_loss * 0.98).toFixed(2))
        : null

    const { data: existingScore } = await supabase
      .from('signal_ml_scores')
      .select('id')
      .eq('alert_id', alert.id)
      .single()

    const scoreData = {
      alert_id: alert.id,
      win_probability: Number(winProbability.toFixed(4)),
      confidence_level: confidence,
      top_risk_factors: riskFactors,
      suggested_sl_adjustment: suggestedSlAdjustment,
      model_used: modelResult.modelUsed,
      model_version: modelRow?.model_version ?? 1,
      trained_on: modelRow?.trained_at ? new Date(modelRow.trained_at).toISOString().split('T')[0] : null,
      training_samples: modelRow?.training_samples ?? 0,
      feature_importances: Object.fromEntries(
        FEATURE_NAMES.map((n, i) => [n, modelResult.forest.featureImportances[i] ?? 0])
      ),
    }

    if (existingScore) {
      await supabase.from('signal_ml_scores').update(scoreData).eq('id', existingScore.id)
    } else {
      await supabase.from('signal_ml_scores').insert(scoreData)
    }

    scored.push(alert.id)
  }

  return NextResponse.json({ success: true, data: { scored: scored.length } })
}
