import { baseTemplate, heading, subheading, divider } from './base'

export function otpTemplate(otp: string): string {
  const content = `
    ${heading('Your verification code')}
    ${subheading('Use this one-time code to verify your identity on withSahib.')}

    <div style="text-align:center; margin:32px 0;">
      <div style="display:inline-block; background:#0C1219; border:2px solid #00C896; border-radius:16px; padding:24px 48px;">
        <p style="margin:0 0 8px 0; font-size:11px; color:#6B8AAA; letter-spacing:2px; text-transform:uppercase;">One-Time Code</p>
        <p style="margin:0; font-size:44px; font-weight:700; color:#E8EDF5; font-family:monospace; letter-spacing:0.2em;">${otp}</p>
        <p style="margin:12px 0 0 0; font-size:12px; color:#6B8AAA;">Valid for 10 minutes</p>
      </div>
    </div>

    ${divider()}

    <p style="margin:0 0 12px 0; font-size:14px; color:#8FA8C0; line-height:1.7;">
      <strong style="color:#E8EDF5;">Never share this code with anyone.</strong> withSahib team will never ask for your OTP by phone, WhatsApp, or email.
    </p>

    <p style="margin:0; font-size:13px; color:#6B8AAA; line-height:1.7;">
      If you did not request this code, you can safely ignore this email. Your account remains secure.
    </p>
  `
  return baseTemplate(content)
}
