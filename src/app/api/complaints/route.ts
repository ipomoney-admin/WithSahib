import { NextRequest, NextResponse } from 'next/server'
import { resend, FROM_ADDRESS } from '@/lib/email/resend-client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, type, description, date } = body

    if (!name || !email || !description) {
      return NextResponse.json(
        { error: 'Name, email and description are required' },
        { status: 400 },
      )
    }

    const referenceId = `WS-${Date.now()}`

    const html = `
<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
  <h2 style="color:#d97706;border-bottom:2px solid #d97706;padding-bottom:8px">
    New Complaint — withSahib
  </h2>
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:8px 0;font-weight:600;width:160px">Reference ID</td><td style="padding:8px 0">${referenceId}</td></tr>
    <tr><td style="padding:8px 0;font-weight:600">Name</td><td style="padding:8px 0">${name}</td></tr>
    <tr><td style="padding:8px 0;font-weight:600">Email</td><td style="padding:8px 0">${email}</td></tr>
    <tr><td style="padding:8px 0;font-weight:600">Phone</td><td style="padding:8px 0">${phone || 'Not provided'}</td></tr>
    <tr><td style="padding:8px 0;font-weight:600">Type</td><td style="padding:8px 0">${type || 'Not specified'}</td></tr>
    <tr><td style="padding:8px 0;font-weight:600">Date of Incident</td><td style="padding:8px 0">${date || 'Not specified'}</td></tr>
  </table>
  <h3 style="margin-top:24px">Description</h3>
  <p style="background:#f5f5f5;padding:16px;border-radius:8px;line-height:1.7">${description.replace(/\n/g, '<br>')}</p>
  <p style="margin-top:24px;font-size:12px;color:#888">
    Filed via withSahib.com complaints page. Respond within 30 days as per SEBI guidelines.
  </p>
</div>`

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: 'sahib13singh13@gmail.com',
      reply_to: email,
      subject: `[${referenceId}] Complaint: ${type || 'General'} — ${name}`,
      html,
    })

    if (error) {
      console.error('[complaints] email send failed:', error)
      return NextResponse.json(
        { error: 'Failed to submit complaint. Please email connect@withsahib.com directly.' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Complaint received. We will respond within 30 days as per SEBI guidelines.',
      referenceId,
    })
  } catch (err) {
    console.error('[complaints] route error:', err)
    return NextResponse.json(
      { error: 'Failed to submit complaint. Please email connect@withsahib.com directly.' },
      { status: 500 },
    )
  }
}
