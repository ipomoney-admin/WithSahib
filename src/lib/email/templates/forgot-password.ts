import { baseTemplate, heading, subheading, primaryButton, divider } from './base'

export function forgotPasswordTemplate(resetLink: string): string {
  const content = `
    ${heading('Reset your password')}
    ${subheading('We received a request to reset your withSahib account password.')}

    <div style="text-align:center; margin:32px 0;">
      ${primaryButton('Reset Password →', resetLink)}
    </div>

    <p style="margin:0 0 16px 0; font-size:13px; color:#6B8AAA; line-height:1.7; text-align:center;">
      This link expires in <strong style="color:#E8EDF5;">1 hour</strong>.
    </p>

    ${divider()}

    <p style="margin:0 0 12px 0; font-size:14px; color:#8FA8C0; line-height:1.7;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="margin:0 0 20px 0; font-size:12px; color:#00C896; word-break:break-all; font-family:monospace;">
      ${resetLink}
    </p>

    <div style="background:#0C1219; border:1px solid rgba(212,168,67,0.2); border-radius:10px; padding:14px 16px;">
      <p style="margin:0; font-size:13px; color:#D4A843; line-height:1.6;">
        ⚠ If you did not request a password reset, ignore this email. Your account is safe and no changes have been made.
      </p>
    </div>
  `
  return baseTemplate(content)
}
