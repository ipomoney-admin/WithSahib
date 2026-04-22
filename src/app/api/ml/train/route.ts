import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-check'
import { trainAndSaveModel, getConfidenceTier } from '@/lib/ml/model-store'

function cronGuard(req: NextRequest): boolean {
  return req.headers.get('x-cron-secret') === process.env.CRON_SECRET
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

  const { data: features } = await supabase
    .from('signal_features')
    .select('*, signals!inner(scrip, segment)')
    .not('outcome', 'is', null)
    .eq('is_black_swan', false)

  if (!features || features.length === 0) {
    return NextResponse.json({ success: true, data: { message: 'No training data available', models_trained: 0 } })
  }

  const bySymbol = new Map<string, typeof features>()
  for (const f of features) {
    const sig = f.signals as unknown as { scrip: string; segment: string }
    if (!sig?.scrip) continue
    const key = sig.scrip
    if (!bySymbol.has(key)) bySymbol.set(key, [])
    bySymbol.get(key)!.push(f)
  }

  const trainingSummary: Array<{
    symbol: string | null
    segment: string | null
    samples: number
    accuracy: number
    confidence: string
  }> = []

  // Train symbol-specific models (5+ samples)
  for (const [symbol, symbolFeatures] of Array.from(bySymbol.entries())) {
    if (symbolFeatures.length < 5) continue
    const sig = symbolFeatures[0].signals as unknown as { scrip: string; segment: string }
    const outcomes = symbolFeatures.map((f) => f.outcome as string)
    const metrics = await trainAndSaveModel(symbol, sig.segment, symbolFeatures, outcomes)
    if (metrics) {
      trainingSummary.push({
        symbol,
        segment: sig.segment,
        samples: metrics.training_samples,
        accuracy: metrics.accuracy,
        confidence: getConfidenceTier(metrics.training_samples, metrics.accuracy),
      })
    }
  }

  // Train global model on all data
  const allOutcomes = features.map((f) => f.outcome as string)
  const globalMetrics = await trainAndSaveModel(null, null, features, allOutcomes)
  if (globalMetrics) {
    trainingSummary.push({
      symbol: null,
      segment: null,
      samples: globalMetrics.training_samples,
      accuracy: globalMetrics.accuracy,
      confidence: getConfidenceTier(globalMetrics.training_samples, globalMetrics.accuracy),
    })
  }

  return NextResponse.json({
    success: true,
    data: {
      models_trained: trainingSummary.length,
      total_samples: features.length,
      summary: trainingSummary,
    },
  })
}
