import { baseTemplate, heading, subheading, primaryButton, divider } from './base'

export function welcomeTemplate(firstName: string): string {
  const content = `
    ${heading(`Welcome to withSahib, ${firstName} 👋`)}
    ${subheading('You\'re now part of a SEBI-registered research platform built for serious Indian traders.')}

    <p style="margin:0 0 24px 0; font-size:14px; color:#8FA8C0; line-height:1.8;">
      Your free account is ready. Here's what you can access right now:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
      <tr>
        <td style="padding:12px 16px; background:#0C1219; border:1px solid #1A2333; border-radius:10px; margin-bottom:8px; display:block;">
          <span style="color:#00C896; font-weight:600; font-size:13px;">✓ Signal Previews</span>
          <span style="color:#6B8AAA; font-size:13px; margin-left:8px;">— See live trade setups daily</span>
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:12px 16px; background:#0C1219; border:1px solid #1A2333; border-radius:10px;">
          <span style="color:#00C896; font-weight:600; font-size:13px;">✓ Performance Tracker</span>
          <span style="color:#6B8AAA; font-size:13px; margin-left:8px;">— Live P&amp;L on all published signals</span>
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:12px 16px; background:#0C1219; border:1px solid #1A2333; border-radius:10px;">
          <span style="color:#D4A843; font-weight:600; font-size:13px;">⬆ Upgrade to unlock</span>
          <span style="color:#6B8AAA; font-size:13px; margin-left:8px;">— Full intraday, options & swing research</span>
        </td>
      </tr>
    </table>

    <div style="text-align:center; margin:32px 0;">
      ${primaryButton('Go to your Dashboard →', 'https://www.withsahib.com/dashboard')}
    </div>

    ${divider()}

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:12px; background:#0C1219; border:1px solid #1A2333; border-radius:10px;">
          <p style="margin:0 0 4px 0; font-size:12px; color:#6B8AAA; letter-spacing:1px; text-transform:uppercase;">SEBI Registered</p>
          <p style="margin:0; font-size:14px; color:#E8EDF5; font-family:monospace;">INH000026266 · Sahib Singh Hora</p>
        </td>
      </tr>
    </table>

    <p style="margin:24px 0 0 0; font-size:13px; color:#6B8AAA; line-height:1.7;">
      Questions? Reply to this email or visit <a href="https://www.withsahib.com/faq">withsahib.com/faq</a>
    </p>
  `
  return baseTemplate(content)
}
