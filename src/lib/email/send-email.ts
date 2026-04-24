import { resend, FROM_ADDRESS } from './resend-client'
import { welcomeTemplate } from './templates/welcome'
import { otpTemplate } from './templates/otp'
import { forgotPasswordTemplate } from './templates/forgot-password'
import { weeklyTrackRecordTemplate, type WeeklyTrackData } from './templates/weekly-track-record'
import { newSignalTemplate, type SignalEmailData } from './templates/new-signal'
import { subscriptionConfirmationTemplate, type SubscriptionPlanData } from './templates/subscription-confirmation'

type SendResult = { success: true; id: string } | { success: false; error: string }

async function safeSend(params: {
  from: string
  to: string | string[]
  subject: string
  html: string
}): Promise<SendResult> {
  try {
    const { data, error } = await resend.emails.send(params)
    if (error) return { success: false, error: error.message }
    return { success: true, id: data?.id ?? '' }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[email] send failed:', msg)
    return { success: false, error: msg }
  }
}

// ─── Welcome Email ─────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, firstName: string): Promise<SendResult> {
  return safeSend({
    from: FROM_ADDRESS,
    to,
    subject: `Welcome to withSahib, ${firstName} 👋`,
    html: welcomeTemplate(firstName),
  })
}

// ─── OTP Verification Email ────────────────────────────────────────────────────

export async function sendOTPEmail(to: string, otp: string): Promise<SendResult> {
  return safeSend({
    from: FROM_ADDRESS,
    to,
    subject: `${otp} is your withSahib verification code`,
    html: otpTemplate(otp),
  })
}

// ─── Forgot Password / Reset Link ─────────────────────────────────────────────

export async function sendForgotPasswordEmail(to: string, resetLink: string): Promise<SendResult> {
  return safeSend({
    from: FROM_ADDRESS,
    to,
    subject: 'Reset your withSahib password',
    html: forgotPasswordTemplate(resetLink),
  })
}

// ─── Weekly Track Record ───────────────────────────────────────────────────────

export async function sendWeeklyTrackRecord(
  to: string[],
  weekData: WeeklyTrackData
): Promise<SendResult[]> {
  // Resend supports batch but we fan-out individually to stay within limits
  return Promise.all(
    to.map((email) =>
      safeSend({
        from: FROM_ADDRESS,
        to: email,
        subject: `withSahib Weekly Track Record — ${weekData.weekLabel}`,
        html: weeklyTrackRecordTemplate(weekData),
      })
    )
  )
}

// ─── New Signal Alert ──────────────────────────────────────────────────────────

export async function sendSignalAlert(
  to: string[],
  signalData: SignalEmailData
): Promise<SendResult[]> {
  const segLabel = signalData.segment.replace(/_/g, ' ')
  return Promise.all(
    to.map((email) =>
      safeSend({
        from: FROM_ADDRESS,
        to: email,
        subject: `New ${segLabel} signal: ${signalData.scrip} — withSahib`,
        html: newSignalTemplate(signalData),
      })
    )
  )
}

// ─── Subscription Confirmation ─────────────────────────────────────────────────

export async function sendSubscriptionConfirmation(
  to: string,
  planData: SubscriptionPlanData
): Promise<SendResult> {
  const planLabel = planData.plan.charAt(0).toUpperCase() + planData.plan.slice(1)
  return safeSend({
    from: FROM_ADDRESS,
    to,
    subject: `You're on ${planLabel}! withSahib subscription confirmed`,
    html: subscriptionConfirmationTemplate(planData),
  })
}

// Re-export types for consumers
export type { WeeklyTrackData, SignalEmailData, SubscriptionPlanData }
