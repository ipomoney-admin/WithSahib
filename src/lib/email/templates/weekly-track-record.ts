import { baseTemplate, heading, divider, infoRow } from './base'

export interface WeeklyTrackData {
  weekLabel: string          // e.g. "Week of 14 Apr 2026"
  totalSignals: number
  winners: number
  losers: number
  winRate: number            // 0–100
  avgReturn: number          // percent, can be negative
  bestTrade: { scrip: string; gain: number }
  worstTrade: { scrip: string; loss: number }
  segmentBreakdown: Array<{ segment: string; signals: number; winRate: number }>
}

export function weeklyTrackRecordTemplate(data: WeeklyTrackData): string {
  const winColor = data.winRate >= 60 ? '#00C896' : data.winRate >= 45 ? '#D4A843' : '#EF4444'
  const returnColor = data.avgReturn >= 0 ? '#00C896' : '#EF4444'

  const segmentRows = data.segmentBreakdown.map((s) =>
    `<tr>
      <td style="padding:8px 0; font-size:13px; color:#8FA8C0; border-bottom:1px solid #1A2333;">${s.segment}</td>
      <td style="padding:8px 0; font-size:13px; color:#E8EDF5; text-align:center; border-bottom:1px solid #1A2333;">${s.signals}</td>
      <td style="padding:8px 0; font-size:13px; font-weight:600; text-align:right; border-bottom:1px solid #1A2333; color:${s.winRate >= 60 ? '#00C896' : s.winRate >= 45 ? '#D4A843' : '#EF4444'};">${s.winRate.toFixed(0)}%</td>
    </tr>`
  ).join('')

  const content = `
    ${heading(`Weekly Track Record`)}
    <p style="margin:0 0 28px 0; font-size:14px; color:#6B8AAA;">${data.weekLabel}</p>

    <!-- Key stats grid -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
      <tr>
        <td width="48%" style="background:#0C1219; border:1px solid #1A2333; border-radius:12px; padding:20px; text-align:center;">
          <p style="margin:0 0 4px 0; font-size:11px; color:#6B8AAA; letter-spacing:1.5px; text-transform:uppercase;">Win Rate</p>
          <p style="margin:0; font-size:36px; font-weight:700; color:${winColor}; font-family:monospace;">${data.winRate.toFixed(0)}%</p>
          <p style="margin:4px 0 0 0; font-size:12px; color:#6B8AAA;">${data.winners}W / ${data.losers}L of ${data.totalSignals}</p>
        </td>
        <td width="4%"></td>
        <td width="48%" style="background:#0C1219; border:1px solid #1A2333; border-radius:12px; padding:20px; text-align:center;">
          <p style="margin:0 0 4px 0; font-size:11px; color:#6B8AAA; letter-spacing:1.5px; text-transform:uppercase;">Avg Return</p>
          <p style="margin:0; font-size:36px; font-weight:700; color:${returnColor}; font-family:monospace;">${data.avgReturn >= 0 ? '+' : ''}${data.avgReturn.toFixed(1)}%</p>
          <p style="margin:4px 0 0 0; font-size:12px; color:#6B8AAA;">per closed signal</p>
        </td>
      </tr>
    </table>

    <!-- Best / Worst -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
      ${infoRow('Best trade', `${data.bestTrade.scrip} &nbsp;<span style="color:#00C896;font-weight:600;">+${data.bestTrade.gain.toFixed(1)}%</span>`)}
      ${infoRow('Worst trade', `${data.worstTrade.scrip} &nbsp;<span style="color:#EF4444;font-weight:600;">${data.worstTrade.loss.toFixed(1)}%</span>`)}
    </table>

    ${divider()}

    <!-- Segment breakdown -->
    <p style="margin:0 0 12px 0; font-size:12px; font-weight:600; color:#6B8AAA; letter-spacing:1.5px; text-transform:uppercase;">By Segment</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <th style="text-align:left; font-size:11px; color:#6B8AAA; padding:0 0 8px 0; font-weight:600; letter-spacing:1px; text-transform:uppercase;">Segment</th>
        <th style="text-align:center; font-size:11px; color:#6B8AAA; padding:0 0 8px 0; font-weight:600; letter-spacing:1px; text-transform:uppercase;">Signals</th>
        <th style="text-align:right; font-size:11px; color:#6B8AAA; padding:0 0 8px 0; font-weight:600; letter-spacing:1px; text-transform:uppercase;">Win %</th>
      </tr>
      ${segmentRows}
    </table>

    <div style="text-align:center; margin-top:32px;">
      <a href="https://www.withsahib.com/performance" style="display:inline-block; padding:12px 28px; border:1px solid #1A2333; color:#8FA8C0; border-radius:10px; font-size:14px; font-weight:500; text-decoration:none;">View Full Performance →</a>
    </div>
  `
  return baseTemplate(content)
}
