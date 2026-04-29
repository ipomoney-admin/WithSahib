import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const PRICES: Record<number, number> = { 15: 1999, 30: 2999 }

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, duration, preferredDate, message } = await req.json() as {
      name: string; email: string; phone?: string
      duration: number; preferredDate?: string; message?: string
    }

    if (!name?.trim() || !email?.trim() || !PRICES[duration]) {
      return NextResponse.json({ error: 'Name, email and duration (15 or 30) required' }, { status: 400 })
    }

    const price = PRICES[duration]
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'withSahib <connect@withsahib.com>',
      to: 'connect@withsahib.com',
      subject: `New Appointment Request — ${duration}min from ${name}`,
      html: `
        <h2 style="font-family:sans-serif">New Appointment Request</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
          <tr><td style="padding:6px 16px 6px 0;color:#666">Name</td><td><strong>${name}</strong></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Email</td><td>${email}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Phone</td><td>${phone ?? 'Not provided'}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Duration</td><td><strong>${duration} minutes — ₹${price.toLocaleString('en-IN')}</strong></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Preferred Date</td><td>${preferredDate ?? 'Flexible'}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Message</td><td>${message ?? '—'}</td></tr>
        </table>
      `,
    })

    await resend.emails.send({
      from: 'withSahib <connect@withsahib.com>',
      to: email,
      subject: 'Appointment Request Received — withSahib',
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
          <h2>Thank you, ${name}!</h2>
          <p>Your request for a <strong>${duration}-minute session (₹${price.toLocaleString('en-IN')})</strong> has been received.</p>
          <p>Sahib Singh Hora will confirm your slot within 24 hours with payment details and meeting link.</p>
          <p>Payment is via UPI / bank transfer before the session confirmation.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
          <p style="font-size:12px;color:#888">withSahib · SEBI RA INH000026266 · connect@withsahib.com</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, message: 'Request received. Confirmation within 24 hours.' })
  } catch (error) {
    console.error('Appointment booking error:', error)
    return NextResponse.json({ error: 'Failed. Please email connect@withsahib.com directly.' }, { status: 500 })
  }
}
