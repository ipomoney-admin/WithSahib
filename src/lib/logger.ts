export function logError(context: string, error: unknown): void {
  console.error(`[${context}]`, error instanceof Error ? error.message : error)
}

export function logWarn(context: string, msg: string): void {
  console.warn(`[${context}]`, msg)
}
