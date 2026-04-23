export function calculateRR(
  entryLow: number,
  entryHigh: number,
  sl: number,
  target1: number
): number {
  // Handle edge case where entry_low === entry_high
  const midEntry = entryLow === entryHigh ? entryLow : (entryLow + entryHigh) / 2
  const risk = Math.abs(midEntry - sl)
  const reward = Math.abs(target1 - midEntry)
  if (risk === 0) return 0
  return Number((reward / risk).toFixed(2))
}

export type EntryStatusCode = 'valid' | 'passed' | 'below_range' | 'sl_zone'

export interface EntryStatus {
  status: EntryStatusCode
  message: string
  color: string
}

export function getEntryStatus(
  signal: { entry_low: number; entry_high: number; stop_loss: number },
  livePrice: number
): EntryStatus {
  const { entry_low, entry_high, stop_loss } = signal

  if (livePrice >= entry_low && livePrice <= entry_high) {
    return {
      status: 'valid',
      message: `Entry still valid — ₹${entry_low.toLocaleString('en-IN')}–₹${entry_high.toLocaleString('en-IN')}`,
      color: '#00C896',
    }
  }

  if (livePrice > entry_high) {
    return {
      status: 'passed',
      message: `Entry range passed (₹${entry_low.toLocaleString('en-IN')}–₹${entry_high.toLocaleString('en-IN')}). Do not chase.`,
      color: '#D4A843',
    }
  }

  if (livePrice > stop_loss && livePrice < entry_low) {
    return {
      status: 'below_range',
      message: `Below entry range. Not recommended at current levels.`,
      color: '#D4A843',
    }
  }

  return {
    status: 'sl_zone',
    message: `Price at stop loss zone. Signal may be invalidated.`,
    color: '#EF4444',
  }
}

export interface SignalForMessage {
  id: string
  segment: string
  scrip: string
  strike?: string | null
  entry_low: number
  entry_high: number
  stop_loss: number
  target_1: number
  target_2?: number | null
  target_3?: number | null
  rr_ratio?: number | null
  rationale: string
  status: string
  analyst_holding?: boolean
  exit_price?: number | null
  actual_rr_achieved?: number | null
  is_modified?: boolean
}

export function formatSignalMessage(
  signal: SignalForMessage,
  type: 'new' | 'outcome' | 'modification'
): string {
  const sebi = 'SEBI RA: INH000026266 | Not investment advice'

  if (type === 'new') {
    const targets = [
      `T1: ₹${signal.target_1.toLocaleString('en-IN')}`,
      signal.target_2 ? `T2: ₹${signal.target_2.toLocaleString('en-IN')}` : null,
      signal.target_3 ? `T3: ₹${signal.target_3.toLocaleString('en-IN')}` : null,
    ].filter(Boolean).join(' | ')

    return [
      `🎯 *withSahib Signal Alert*`,
      ``,
      `*${signal.segment.toUpperCase().replace('_', ' ')} CALL*`,
      `Scrip: *${signal.scrip}${signal.strike ? ` ${signal.strike}` : ''}*`,
      ``,
      `Entry: ₹${signal.entry_low.toLocaleString('en-IN')} – ₹${signal.entry_high.toLocaleString('en-IN')}`,
      `SL: ₹${signal.stop_loss.toLocaleString('en-IN')}`,
      targets,
      `R:R ≈ ${signal.rr_ratio ?? calculateRR(signal.entry_low, signal.entry_high, signal.stop_loss, signal.target_1)}`,
      ``,
      `Rationale: ${signal.rationale}`,
      signal.analyst_holding ? `✅ Analyst holding position` : '',
      ``,
      sebi,
    ].filter((l) => l !== '').join('\n')
  }

  if (type === 'outcome') {
    const emoji =
      signal.status === 'sl_hit' ? '❌' :
      signal.status.includes('hit') ? '✅' : '⏸️'

    const statusLabel =
      signal.status === 't1_hit' ? 'T1 Hit ✅' :
      signal.status === 't2_hit' ? 'T2 Hit ✅✅' :
      signal.status === 't3_hit' ? 'T3 Hit 🎯' :
      signal.status === 'sl_hit' ? 'Stop Loss Hit ❌' :
      signal.status === 'expired' ? 'Expired ⏰' : signal.status

    return [
      `${emoji} *withSahib Signal Update*`,
      ``,
      `*${signal.scrip}${signal.strike ? ` ${signal.strike}` : ''}*`,
      `Status: ${statusLabel}`,
      signal.exit_price ? `Exit Price: ₹${signal.exit_price.toLocaleString('en-IN')}` : '',
      signal.actual_rr_achieved ? `R:R Achieved: ${signal.actual_rr_achieved}x` : '',
      ``,
      sebi,
    ].filter((l) => l !== '').join('\n')
  }

  // modification
  return [
    `⚠️ *withSahib Signal Modified*`,
    ``,
    `*${signal.scrip}${signal.strike ? ` ${signal.strike}` : ''}*`,
    `Entry: ₹${signal.entry_low.toLocaleString('en-IN')} – ₹${signal.entry_high.toLocaleString('en-IN')}`,
    `SL (updated): ₹${signal.stop_loss.toLocaleString('en-IN')}`,
    `T1: ₹${signal.target_1.toLocaleString('en-IN')}`,
    ``,
    `*Disclosure:* This signal has been modified since original publication.`,
    ``,
    sebi,
  ].join('\n')
}

export function formatTelegramMessage(
  signal: SignalForMessage,
  type: 'new' | 'outcome' | 'modification'
): string {
  // Telegram MarkdownV2 — escape special chars
  const esc = (s: string): string =>
    s.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')

  const sebi = esc('SEBI RA: INH000026266 | Not investment advice')

  if (type === 'new') {
    const targets = [
      `T1: ₹${esc(signal.target_1.toLocaleString('en-IN'))}`,
      signal.target_2 ? `T2: ₹${esc(signal.target_2.toLocaleString('en-IN'))}` : null,
      signal.target_3 ? `T3: ₹${esc(signal.target_3.toLocaleString('en-IN'))}` : null,
    ].filter(Boolean).join(' \\| ')

    return [
      `🎯 *withSahib Signal Alert*`,
      ``,
      `*${esc(signal.segment.toUpperCase().replace('_', ' '))} CALL*`,
      `Scrip: *${esc(signal.scrip)}${signal.strike ? ` ${esc(signal.strike)}` : ''}*`,
      ``,
      `Entry: ₹${esc(signal.entry_low.toLocaleString('en-IN'))} – ₹${esc(signal.entry_high.toLocaleString('en-IN'))}`,
      `SL: ₹${esc(signal.stop_loss.toLocaleString('en-IN'))}`,
      targets,
      `R:R ≈ ${esc(String(signal.rr_ratio ?? calculateRR(signal.entry_low, signal.entry_high, signal.stop_loss, signal.target_1)))}`,
      ``,
      `Rationale: ${esc(signal.rationale)}`,
      signal.analyst_holding ? `✅ Analyst holding position` : '',
      ``,
      `_${sebi}_`,
    ].filter((l) => l !== '').join('\n')
  }

  if (type === 'outcome') {
    const emoji =
      signal.status === 'sl_hit' ? '❌' :
      signal.status.includes('hit') ? '✅' : '⏸️'

    const statusLabel =
      signal.status === 't1_hit' ? 'T1 Hit ✅' :
      signal.status === 't2_hit' ? 'T2 Hit ✅✅' :
      signal.status === 't3_hit' ? 'T3 Hit 🎯' :
      signal.status === 'sl_hit' ? 'Stop Loss Hit ❌' :
      signal.status === 'expired' ? 'Expired ⏰' : esc(signal.status)

    return [
      `${emoji} *withSahib Signal Update*`,
      ``,
      `*${esc(signal.scrip)}${signal.strike ? ` ${esc(signal.strike)}` : ''}*`,
      `Status: ${statusLabel}`,
      signal.exit_price ? `Exit Price: ₹${esc(signal.exit_price.toLocaleString('en-IN'))}` : '',
      signal.actual_rr_achieved ? `R:R Achieved: ${esc(String(signal.actual_rr_achieved))}x` : '',
      ``,
      `_${sebi}_`,
    ].filter((l) => l !== '').join('\n')
  }

  return [
    `⚠️ *withSahib Signal Modified*`,
    ``,
    `*${esc(signal.scrip)}${signal.strike ? ` ${esc(signal.strike)}` : ''}*`,
    `Entry: ₹${esc(signal.entry_low.toLocaleString('en-IN'))} – ₹${esc(signal.entry_high.toLocaleString('en-IN'))}`,
    `SL \\(updated\\): ₹${esc(signal.stop_loss.toLocaleString('en-IN'))}`,
    `T1: ₹${esc(signal.target_1.toLocaleString('en-IN'))}`,
    ``,
    `*Disclosure:* This signal has been modified since original publication\\.`,
    ``,
    `_${sebi}_`,
  ].join('\n')
}

export function validateModification(
  field: string,
  oldVal: number,
  newVal: number,
  signalDirection: 'long' | 'short' = 'long'
): { valid: boolean; reason?: string } {
  if (field === 'entry_low' || field === 'entry_high') {
    return { valid: false, reason: 'Entry range is locked after publication.' }
  }

  if (field === 'stop_loss') {
    // Tighten only: for long, SL must move up (closer to entry); for short, move down
    if (signalDirection === 'long' && newVal <= oldVal) {
      return { valid: false, reason: 'Stop loss can only be tightened (moved higher) for long positions.' }
    }
    if (signalDirection === 'short' && newVal >= oldVal) {
      return { valid: false, reason: 'Stop loss can only be tightened (moved lower) for short positions.' }
    }
  }

  if (field === 'target_1' || field === 'target_2' || field === 'target_3') {
    // Targets can only be raised for long, lowered for short
    if (signalDirection === 'long' && newVal <= oldVal) {
      return { valid: false, reason: 'Targets can only be raised for long positions.' }
    }
    if (signalDirection === 'short' && newVal >= oldVal) {
      return { valid: false, reason: 'Targets can only be lowered for short positions.' }
    }
  }

  return { valid: true }
}
