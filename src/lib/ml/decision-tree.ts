export interface TreeNode {
  featureIndex?: number
  threshold?: number
  left?: TreeNode
  right?: TreeNode
  value?: number // leaf probability (0-1)
  samples?: number
}

export interface TrainedTree {
  root: TreeNode
  featureImportances: number[]
  nFeatures: number
}

function gini(labels: number[]): number {
  if (labels.length === 0) return 0
  const ones = labels.reduce((s, v) => s + v, 0)
  const p1 = ones / labels.length
  const p0 = 1 - p1
  return 1 - p1 * p1 - p0 * p0
}

function weightedGini(leftLabels: number[], rightLabels: number[]): number {
  const total = leftLabels.length + rightLabels.length
  if (total === 0) return 0
  return (
    (leftLabels.length / total) * gini(leftLabels) +
    (rightLabels.length / total) * gini(rightLabels)
  )
}

function bestSplit(
  X: number[][],
  y: number[],
  featureImportances: number[]
): { featureIndex: number; threshold: number; gain: number } | null {
  const nFeatures = X[0]?.length ?? 0
  let bestGain = 0
  let bestFeature = -1
  let bestThreshold = 0
  const parentGini = gini(y)

  for (let f = 0; f < nFeatures; f++) {
    const values = Array.from(new Set(X.map((row) => row[f]))).sort((a, b) => a - b)
    for (let i = 0; i < values.length - 1; i++) {
      const threshold = (values[i] + values[i + 1]) / 2
      const leftIdx = X.reduce<number[]>((acc, row, idx) => {
        if (row[f] <= threshold) acc.push(idx)
        return acc
      }, [])
      const rightIdx = X.reduce<number[]>((acc, row, idx) => {
        if (row[f] > threshold) acc.push(idx)
        return acc
      }, [])
      const leftLabels = leftIdx.map((i) => y[i])
      const rightLabels = rightIdx.map((i) => y[i])
      const gain = parentGini - weightedGini(leftLabels, rightLabels)
      if (gain > bestGain) {
        bestGain = gain
        bestFeature = f
        bestThreshold = threshold
      }
    }
  }

  if (bestFeature === -1) return null
  featureImportances[bestFeature] = (featureImportances[bestFeature] ?? 0) + bestGain
  return { featureIndex: bestFeature, threshold: bestThreshold, gain: bestGain }
}

function buildTree(
  X: number[][],
  y: number[],
  depth: number,
  maxDepth: number,
  minSamples: number,
  featureImportances: number[]
): TreeNode {
  const ones = y.reduce((s, v) => s + v, 0)
  const prob = y.length > 0 ? ones / y.length : 0

  if (depth >= maxDepth || y.length < minSamples || gini(y) === 0) {
    return { value: prob, samples: y.length }
  }

  const split = bestSplit(X, y, featureImportances)
  if (!split) return { value: prob, samples: y.length }

  const leftIdx: number[] = []
  const rightIdx: number[] = []
  X.forEach((row, idx) => {
    if (row[split.featureIndex] <= split.threshold) leftIdx.push(idx)
    else rightIdx.push(idx)
  })

  if (leftIdx.length === 0 || rightIdx.length === 0) {
    return { value: prob, samples: y.length }
  }

  const leftX = leftIdx.map((i) => X[i])
  const leftY = leftIdx.map((i) => y[i])
  const rightX = rightIdx.map((i) => X[i])
  const rightY = rightIdx.map((i) => y[i])

  return {
    featureIndex: split.featureIndex,
    threshold: split.threshold,
    samples: y.length,
    left: buildTree(leftX, leftY, depth + 1, maxDepth, minSamples, featureImportances),
    right: buildTree(rightX, rightY, depth + 1, maxDepth, minSamples, featureImportances),
  }
}

export function trainTree(
  X: number[][],
  y: number[],
  maxDepth = 8,
  minSamples = 5
): TrainedTree {
  const nFeatures = X[0]?.length ?? 0
  const featureImportances = new Array(nFeatures).fill(0)
  const root = buildTree(X, y, 0, maxDepth, minSamples, featureImportances)
  const totalImportance = featureImportances.reduce((s, v) => s + v, 0)
  const normalized =
    totalImportance > 0
      ? featureImportances.map((v) => v / totalImportance)
      : featureImportances
  return { root, featureImportances: normalized, nFeatures }
}

export function predictProba(tree: TrainedTree, x: number[]): number {
  let node = tree.root
  while (node.value === undefined) {
    if (x[node.featureIndex!] <= node.threshold!) {
      node = node.left!
    } else {
      node = node.right!
    }
  }
  return node.value
}

export function predict(tree: TrainedTree, x: number[]): number {
  return predictProba(tree, x) >= 0.5 ? 1 : 0
}

export function serializeTree(tree: TrainedTree): string {
  return JSON.stringify(tree)
}

export function deserializeTree(json: string): TrainedTree {
  return JSON.parse(json) as TrainedTree
}
