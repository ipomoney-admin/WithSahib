import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const topStory = `Indian market analysis — ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        messages: [{
          role: 'user',
          content: `You are Sahib Singh Hora, SEBI Registered Research Analyst INH000026266. Write a 400-500 word blog post about: ${topStory}. Tone: authoritative, educational, research-focused. Include: market context, what it means for traders, technical perspective. End with: "Research by Sahib Singh Hora, SEBI RA INH000026266. Not investment advice." Return only the blog post content, no preamble.`,
        }],
      }),
    })

    if (!response.ok) {
      console.error('Anthropic API error:', response.status)
      return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
    }

    const data = await response.json()
    const draftContent = (data.content?.[0]?.text as string) ?? ''

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const slug = `market-update-${Date.now()}`
    await supabase.from('blog_posts').insert({
      title: `Market Analysis: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      content: draftContent,
      excerpt: draftContent.slice(0, 160).replace(/\n/g, ' '),
      slug,
      category: 'market-analysis',
      published_at: null, // draft — requires manual review before publishing
    })

    return NextResponse.json({ success: true, slug, message: 'Draft created — review in admin before publishing' })
  } catch (error) {
    console.error('Blog cron error:', error)
    return NextResponse.json({ error: 'Failed to generate draft' }, { status: 500 })
  }
}
