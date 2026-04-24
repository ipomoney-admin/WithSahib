import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email/send-email'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, firstName } = await req.json() as { email?: string; firstName?: string }
    if (!email || !firstName) {
      return NextResponse.json({ success: false, error: 'email and firstName required' }, { status: 400 })
    }
    const result = await sendWelcomeEmail(email, firstName)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
    return NextResponse.json({ success: true, id: result.id })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
