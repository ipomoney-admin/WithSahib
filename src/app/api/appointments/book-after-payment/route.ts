import { NextRequest, NextResponse } from 'next/server'
import { resend, FROM_ADDRESS } from '@/lib/email/resend-client'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, duration, preferred_date, message, razorpay_payment_id, plan_name } = await req.json()

    if (!name || !email || !razorpay_payment_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const durationLabel = duration === '15' ? '15-minute' : '30-minute'
    const priceLabel = duration === '15' ? '₹1,999' : '₹2,999'
    const preferredDateLabel = preferred_date
      ? new Date(preferred_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : 'Flexible'

    // Admin notification email
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: 'sahib13singh13@gmail.com',
      subject: `New Session Booked — ${durationLabel} with ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <h2 style="color: #FF6B00;">New Session Booking</h2>
          <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${email}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Duration</td><td style="padding: 8px 0; font-weight: 600;">${durationLabel}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Amount Paid</td><td style="padding: 8px 0; font-weight: 600; color: #FF6B00;">${priceLabel}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Payment ID</td><td style="padding: 8px 0; font-family: monospace; font-size: 13px;">${razorpay_payment_id}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Preferred Date</td><td style="padding: 8px 0;">${preferredDateLabel}</td></tr>
            <tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Topic</td><td style="padding: 8px 0;">${message || 'Not specified'}</td></tr>
          </table>
          <p style="margin-top: 24px; font-size: 13px; color: #999;">Plan: ${plan_name}</p>
        </div>
      `,
    })

    // User confirmation email
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `Your ${durationLabel} session with Sahib is confirmed`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <h2 style="color: #FF6B00;">Session Booking Confirmed</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-top: 16px;">Hi ${name},</p>
          <p style="font-size: 15px; line-height: 1.7; color: #444;">
            Your payment of <strong>${priceLabel}</strong> for a <strong>${durationLabel} session</strong> with Sahib Singh Hora has been received.
          </p>
          <div style="background: #f9f9f9; border-left: 4px solid #FF6B00; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #555;"><strong>Preferred Date:</strong> ${preferredDateLabel}</p>
            ${message ? `<p style="margin: 8px 0 0; font-size: 14px; color: #555;"><strong>Topic:</strong> ${message}</p>` : ''}
            <p style="margin: 8px 0 0; font-size: 13px; color: #888;">Payment Reference: ${razorpay_payment_id}</p>
          </div>
          <p style="font-size: 15px; line-height: 1.7; color: #444;">
            Sahib will review your preferred date and send a Google Meet or Zoom link within <strong>24 hours</strong>.
            Sessions are held Mon–Fri, 9 AM–5 PM IST.
          </p>
          <p style="font-size: 15px; line-height: 1.7; color: #444;">
            If you have any questions in the meantime, reply to this email or reach out at
            <a href="mailto:connect@withsahib.com" style="color: #FF6B00;">connect@withsahib.com</a>.
          </p>
          <p style="font-size: 15px; line-height: 1.7; color: #444; margin-top: 24px;">
            Looking forward to speaking with you,<br/>
            <strong>Sahib Singh Hora</strong><br/>
            <span style="font-size: 13px; color: #888;">SEBI Registered Research Analyst · INH000026266</span>
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[book-after-payment]', err)
    return NextResponse.json({ error: 'Failed to send confirmation emails' }, { status: 500 })
  }
}
