import { baseTemplate, heading, divider } from './base'

export interface SignalEmailData {
  scrip: string
  segment: 'swing' | 'intraday' | 'stock_options' | 'index_options'
  entryLow: number
  entryHigh: number
  stopLoss: number
  target1: number
  target2?: number
  target3?: number
  rrRatio: number
  rationale: string
  patternType?: string
  validityDate?: string
}

const SEGMENT_LABEL: Record<string, string> = {
  swing: 'Swing Trade',
  intraday: 'Intraday',
  stock_options: 'Stock Options',
  index_options: 'Index Options',
}

const SEGMENT_COLOR: Record<string, string> = {
  swing: '#8B5CF6',
  intraday: '#00C896',
  stock_options: '#D4A843',
  index_options: '#3B82F6',
}

export function newSignalTemplate(data: SignalEmailData): string {
  const segLabel = SEGMENT_LABEL[data.segment] ?? data.segment
  const segColor = SEGMENT_COLOR[data.segment] ?? '#00C896'
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

  const targets = [
    data.target1 && `<td style="text-align:center; padding:8px 0;"><p style="margin:0 0 2px 0; font-size:10px; color:#6B8AAA; letter-spacing:1px;">TARGET 1</p><p style="margin:0; font-size:16px; font-weight:700; color:#00C896; font-family:monospace;">${fmt(data.target1)}</p></td>`,
    data.target2 && `<td style="text-align:center; padding:8px 0;"><p style="margin:0 0 2px 0; font-size:10px; color:#6B8AAA; letter-spacing:1px;">TARGET 2</p><p style="margin:0; font-size:16px; font-weight:700; color:#00C896; font-family:monospace;">${fmt(data.target2)}</p></td>`,
    data.target3 && `<td style="text-align:center; padding:8px 0;"><p style="margin:0 0 2px 0; font-size:10px; color:#6B8AAA; letter-spacing:1px;">TARGET 3</p><p style="margin:0; font-size:16px; font-weight:700; color:#00C896; font-family:monospace;">${fmt(data.target3)}</p></td>`,
  ].filter(Boolean).join('<td style="width:16px;"></td>')

  const content = `
    <!-- Segment badge -->
    <div style="margin:0 0 20px 0;">
      <span style="display:inline-block; padding:4px 14px; border-radius:20px; border:1px solid ${segColor}30; background:${segColor}12; font-size:11px; font-weight:600; color:${segColor}; letter-spacing:1.5px; text-transform:uppercase;">${segLabel}</span>
    </div>

    ${heading(`New Signal: ${data.scrip}`)}
    ${data.patternType ? `<p style="margin:-4px 0 24px 0; font-size:13px; color:#6B8AAA;">Pattern: <span style="color:#8FA8C0;">${data.patternType.replace(/_/g, ' ')}</span></p>` : ''}

    <!-- Entry / SL box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0C1219; border:1px solid #1A2333; border-radius:12px; padding:0; margin:0 0 20px 0; overflow:hidden;">
      <tr>
        <td style="padding:16px 20px; border-bottom:1px solid #1A2333;">
          <p style="margin:0 0 4px 0; font-size:10px; color:#6B8AAA; letter-spacing:1.5px; text-transform:uppercase;">Entry Range</p>
          <p style="margin:0; font-size:20px; font-weight:700; color:#E8EDF5; font-family:monospace;">${fmt(data.entryLow)} – ${fmt(data.entryHigh)}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 20px;">
          <p style="margin:0 0 4px 0; font-size:10px; color:#6B8AAA; letter-spacing:1.5px; text-transform:uppercase;">Stop Loss</p>
          <p style="margin:0; font-size:18px; font-weight:600; color:#EF4444; font-family:monospace;">${fmt(data.stopLoss)}</p>
        </td>
      </tr>
    </table>

    <!-- Targets -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0C1219; border:1px solid rgba(0,200,150,0.2); border-radius:12px; padding:16px 20px; margin:0 0 20px 0;">
      <tr>${targets}</tr>
    </table>

    <!-- R:R badge -->
    <div style="margin:0 0 24px 0; text-align:center;">
      <span style="display:inline-block; padding:8px 20px; background:rgba(0,200,150,0.08); border:1px solid rgba(0,200,150,0.2); border-radius:8px; font-size:14px; font-weight:600; color:#00C896;">
        R:R Ratio — ${data.rrRatio.toFixed(1)}x
      </span>
    </div>

    ${divider()}

    <!-- Rationale -->
    <p style="margin:0 0 8px 0; font-size:12px; font-weight:600; color:#6B8AAA; letter-spacing:1.5px; text-transform:uppercase;">Research Rationale</p>
    <p style="margin:0 0 24px 0; font-size:14px; color:#8FA8C0; line-height:1.8;">${data.rationale}</p>

    ${data.validityDate ? `<p style="margin:0 0 24px 0; font-size:13px; color:#6B8AAA;">Valid until: <strong style="color:#E8EDF5;">${data.validityDate}</strong></p>` : ''}

    <div style="text-align:center;">
      <a href="https://www.withsahib.com/dashboard/signals" style="display:inline-block; padding:12px 28px; background:#00C896; color:#031A13; border-radius:10px; font-weight:600; font-size:14px; text-decoration:none;">View on Dashboard →</a>
    </div>

    <p style="margin:24px 0 0 0; font-size:11px; color:#4A6075; line-height:1.6; text-align:center;">
      Investments are subject to market risks. This is research, not a guarantee of returns.<br/>SEBI RA INH000026266 · Sahib Singh Hora
    </p>
  `
  return baseTemplate(content)
}
