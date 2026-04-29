import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-check'
import { createServerComponentClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const authClient = createServerComponentClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user || !(await isAdmin(user.id))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, recipients } = await req.json() as { message: string; recipients: string[] }

    if (!message || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'message and recipients[] required' }, { status: 400 })
    }

    // TODO: Implement with AiSensy when API key is configured
    // AiSensy sends WhatsApp messages via campaign API
    // const res = await fetch('https://backend.aisensy.com/campaign/t1/api', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     apiKey: process.env.AISENSY_API_KEY,
    //     campaignName: process.env.AISENSY_CAMPAIGN_NAME,
    //     destination: recipients.join(','),
    //     userName: 'withSahib',
    //     source: 'API',
    //     media: {},
    //     templateParams: [message],
    //   }),
    // })

    console.log('[WhatsApp] delivery placeholder —', {
      recipients: recipients.length,
      preview: message.slice(0, 60),
    })

    return NextResponse.json({
      success: true,
      sent: 0,
      TODO: 'Set AISENSY_API_KEY and AISENSY_CAMPAIGN_NAME to enable WhatsApp delivery',
    })
  } catch (error) {
    console.error('WhatsApp send error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
