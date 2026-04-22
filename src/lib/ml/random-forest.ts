import { trainTree, predictProba, serializeTree, deserializeTree, type TrainedTree } from './decision-tree'

export interface RandomForest {
  trees: TrainedTree[]
  featureImportances: number[]
  nTrees: number
  nFeatures: number
}

function bootstrapSample(X: number[][], y: number[]): [number[][], number[]] {
  const n = X.length
  const sampledX: number[][] = []
  const sampledY: number[] = []
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * n)
    sampledX.push(X[idx])
    sampledY.push(y[idx])
  }
  return [sampledX, sampledY]
}

export function trainForest(
  X: number[][],
  y: number[],
  nTrees = 50,
  maxDepth = 8,
  minSamples = 5
): RandomForest {
  if (X.length === 0) {
    return { trees: [], featureImportances: [], nTrees: 0, nFeatures: 0 }
  }

  const nFeatures = X[0].length
  const trees: TrainedTree[] = []

  for (let i = 0; i < nTrees; i++) {
    const [bX, bY] = bootstrapSample(X, y)
    const tree = trainTree(bX, bY, maxDepth, minSamples)
    trees.push(tree)
  }

  // Average feature importances across trees
  const avgImportances = new Array(nFeatures).fill(0)
  trees.forEach((tree) => {
    tree.featureImportances.forEach((imp, idx) => {
      avgImportances[idx] += imp / nTrees
    })
  })

  return { trees, featureImportances: avgImportances, nTrees, nFeatures }
}

export function forestPredictProba(forest: RandomForest, x: number[]): number {
  if (forest.trees.length === 0) return 0.5
  const probs = forest.trees.map((tree) => predictProba(tree, x))
  return probs.reduce((s, p) => s + p, 0) / probs.length
}

export function forestPredict(forest: RandomForest, x: number[]): number {
  return forestPredictProba(forest, x) >= 0.5 ? 1 : 0
}

export function serializeForest(forest: RandomForest): string {
  return JSON.stringify({
    ...forest,
    trees: forest.trees.map(serializeTree),
  })
}

export function deserializeForest(json: string): RandomForest {
  const parsed = JSON.parse(json)
  return {
    ...parsed,
    trees: (parsed.trees as string[]).map(deserializeTree),
  }
}

export function calculateAccuracy(
  forest: RandomForest,
  X: number[][],
  y: number[]
): { accuracy: number; precision: number; recall: number; f1: number } {
  if (X.length === 0) return { accuracy: 0, precision: 0, recall: 0, f1: 0 }

  let tp = 0, fp = 0, tn = 0, fn = 0
  X.forEach((x, i) => {
    const pred = forestPredict(forest, x)
    const actual = y[i]
    if (pred === 1 && actual === 1) tp++
    else if (pred === 1 && actual === 0) fp++
    else if (pred === 0 && actual === 0) tn++
    else fn++
  })

  const accuracy = (tp + tn) / X.length
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0

  return {
    accuracy: Number(accuracy.toFixed(4)),
    precision: Number(precision.toFixed(4)),
    recall: Number(recall.toFixed(4)),
    f1: Number(f1.toFixed(4)),
  }
}
