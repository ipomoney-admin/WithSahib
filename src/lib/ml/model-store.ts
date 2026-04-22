import { createServiceRoleClient } from '@/lib/supabase/server'
import { trainForest, deserializeForest, serializeForest, calculateAccuracy, type RandomForest } from './random-forest'
import { encodeFeature, encodeOutcome, computeMedians, FEATURE_NAMES, type RawFeature } from './feature-encoder'

export interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1: number
  training_samples: number
}

export async function saveModel(
  symbol: string | null,
  segment: string | null,
  forest: RandomForest,
  metrics: ModelMetrics,
  medians: Record<string, number>
): Promise<void> {
  const supabase = createServiceRoleClient()

  const { data: existing } = await supabase
    .from('ml_models')
    .select('model_version')
    .eq('symbol', symbol ?? '')
    .eq('segment', segment ?? '')
    .eq('status', 'active')
    .single()

  const newVersion = (existing?.model_version ?? 0) + 1

  if (existing) {
    await supabase
      .from('ml_models')
      .update({ status: 'deprecated' })
      .eq('symbol', symbol ?? '')
      .eq('segment', segment ?? '')
      .eq('status', 'active')
  }

  await supabase.from('ml_models').insert({
    symbol,
    segment,
    model_version: newVersion,
    training_samples: metrics.training_samples,
    accuracy: metrics.accuracy,
    precision_score: metrics.precision,
    recall_score: metrics.recall,
    f1_score: metrics.f1,
    feature_importances: Object.fromEntries(
      FEATURE_NAMES.map((name, i) => [name, forest.featureImportances[i] ?? 0])
    ),
    model_params: {
      forest: serializeForest(forest),
      medians,
    },
    status: 'active',
    trained_at: new Date().toISOString(),
  })
}

export async function loadModel(
  symbol: string | null,
  segment: string | null
): Promise<{ forest: RandomForest; medians: Record<string, number>; version: number } | null> {
  const supabase = createServiceRoleClient()

  const { data } = await supabase
    .from('ml_models')
    .select('model_params, model_version')
    .eq('symbol', symbol ?? '')
    .eq('segment', segment ?? '')
    .eq('status', 'active')
    .single()

  if (!data?.model_params) return null

  const params = data.model_params as { forest: string; medians: Record<string, number> }
  return {
    forest: deserializeForest(params.forest),
    medians: params.medians,
    version: data.model_version,
  }
}

export async function getModelForSymbol(
  symbol: string,
  segment: string
): Promise<{ forest: RandomForest; medians: Record<string, number>; version: number; modelUsed: string } | null> {
  // Try symbol-specific model first
  const symbolModel = await loadModel(symbol, segment)
  if (symbolModel) {
    return { ...symbolModel, modelUsed: `${symbol}_${segment}` }
  }

  // Fall back to global model
  const globalModel = await loadModel(null, null)
  if (globalModel) {
    return { ...globalModel, modelUsed: 'global' }
  }

  return null
}

export async function trainAndSaveModel(
  symbol: string | null,
  segment: string | null,
  features: RawFeature[],
  outcomes: string[]
): Promise<ModelMetrics | null> {
  if (features.length < 5) return null

  const medians = computeMedians(features)
  const X = features.map((f) => encodeFeature(f, medians))
  const y = outcomes.map(encodeOutcome)

  // Use 80% for training, 20% for evaluation
  const splitIdx = Math.floor(X.length * 0.8)
  const trainX = X.slice(0, splitIdx)
  const trainY = y.slice(0, splitIdx)
  const testX = X.slice(splitIdx)
  const testY = y.slice(splitIdx)

  const forest = trainForest(trainX, trainY)
  const metrics = testX.length > 0
    ? calculateAccuracy(forest, testX, testY)
    : { accuracy: 0, precision: 0, recall: 0, f1: 0 }

  const fullMetrics: ModelMetrics = {
    ...metrics,
    training_samples: features.length,
  }

  await saveModel(symbol, segment, forest, fullMetrics, medians)
  return fullMetrics
}

export function getConfidenceTier(
  samples: number,
  accuracy: number
): 'HIGH' | 'MEDIUM' | 'LOW' | 'LEARNING' {
  if (samples < 5) return 'LEARNING'
  if (samples >= 50 && accuracy > 0.65) return 'HIGH'
  if (samples >= 20 && accuracy > 0.55) return 'MEDIUM'
  return 'LOW'
}
