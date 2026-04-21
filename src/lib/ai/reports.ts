import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface ReportInput {
  company_name: string
  company_symbol: string
  report_type: 'dcf' | 'technical' | 'quarterly_results' | 'company_overview'
  raw_data?: string  // earnings data, announcement text, etc.
  current_price?: number
}

export interface GeneratedReport {
  title: string
  summary: string
  content: string
  recommendation: 'BUY' | 'HOLD' | 'SELL'
  target_price: number
  tags: string[]
}

// ─── GENERATE RESEARCH REPORT ─────────────────────────────────────────────────
export async function generateResearchReport(input: ReportInput): Promise<GeneratedReport> {
  const systemPrompt = `You are a SEBI Registered Research Analyst (INH000026266) named Sahib Singh Hora.
You produce institutional-grade, SEBI-compliant research reports for Indian retail investors.

ALWAYS:
- Include proper risk disclosures
- State this is for informational purposes only
- Note investments are subject to market risk
- Be objective, data-driven, and specific
- Use Indian financial context (NSE/BSE, INR, Indian regulations)
- Format output as valid JSON only

NEVER:
- Guarantee returns
- Make absolute predictions
- Use sensational language`

  const userPrompt = buildPrompt(input)

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  try {
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return {
      title: `${input.company_name} — ${input.report_type.replace('_', ' ')} Analysis`,
      summary: 'Report generation encountered an error. Please try again.',
      content: text,
      recommendation: 'HOLD',
      target_price: input.current_price ?? 0,
      tags: [input.company_symbol, input.report_type],
    }
  }
}

function buildPrompt(input: ReportInput): string {
  const base = `Generate a ${input.report_type} research report for ${input.company_name} (${input.company_symbol}) on NSE.
Current Price: ₹${input.current_price ?? 'N/A'}
${input.raw_data ? `Source Data:\n${input.raw_data}` : ''}

Return ONLY valid JSON with this structure:
{
  "title": "string",
  "summary": "2-3 sentence executive summary",
  "content": "full markdown report with sections: Overview, Key Metrics, Analysis, Risks, Conclusion, Disclaimer",
  "recommendation": "BUY" | "HOLD" | "SELL",
  "target_price": number,
  "tags": ["string array of relevant tags"]
}`

  if (input.report_type === 'dcf') {
    return base + `\nFor DCF: include revenue growth assumptions, WACC, terminal growth rate, intrinsic value calculation.`
  }
  if (input.report_type === 'quarterly_results') {
    return base + `\nFor quarterly results: compare vs prev quarter and YoY, highlight margin trends, management commentary key points.`
  }
  if (input.report_type === 'technical') {
    return base + `\nFor technical: include support/resistance levels, trend analysis, key indicators (RSI, MACD, volume), pattern identification.`
  }
  return base
}

// ─── GENERATE TRADE PICK RATIONALE ───────────────────────────────────────────
export async function generateTradeRationale(params: {
  symbol: string
  direction: 'BUY' | 'SELL'
  entry: number
  target: number
  sl: number
  service_type: string
  pattern?: string
}): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `Write a concise 2-3 sentence trade rationale for:
Symbol: ${params.symbol} | Direction: ${params.direction} | Type: ${params.service_type}
Entry: ₹${params.entry} | Target: ₹${params.target} | SL: ₹${params.sl}
${params.pattern ? `Pattern: ${params.pattern}` : ''}

Be specific, technical, and professional. No fluff. Include risk-reward context.
End with: "SEBI RA INH000026266. Not investment advice."`,
    }],
  })
  return response.content[0].type === 'text' ? response.content[0].text : ''
}

// ─── GENERATE COMPANY UPDATE SUMMARY ──────────────────────────────────────────
export async function summarizeCompanyUpdate(params: {
  company: string
  symbol: string
  update_type: string
  raw_content: string
}): Promise<{ title: string; summary: string }> {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `Summarize this ${params.update_type} for ${params.company} (${params.symbol}) for retail investors.

Raw content:
${params.raw_content.slice(0, 2000)}

Return JSON only:
{ "title": "concise headline under 80 chars", "summary": "2-3 sentence plain-English summary of what this means for investors" }`,
    }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim())
  } catch {
    return { title: `${params.company} — ${params.update_type}`, summary: params.raw_content.slice(0, 200) }
  }
}
