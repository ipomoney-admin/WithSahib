import { baseTemplate, heading, subheading, primaryButton, divider, infoRow } from './base'

export interface SubscriptionPlanData {
  firstName: string
  plan: 'basic' | 'pro' | 'elite'
  billingCycle: 'monthly' | 'yearly'
  amountPaid: number
  nextBillingDate: string
  features: string[]
}

const PLAN_COLOR: Record<string, string> = {
  basic: '#8FA8C0',
  pro: '#00C896',
  elite: '#D4A843',
}

const PLAN_LABEL: Record<string, string> = {
  basic: 'Basic',
  pro: 'Pro',
  elite: 'Elite',
}

export function subscriptionConfirmationTemplate(data: SubscriptionPlanData): string {
  const planColor = PLAN_COLOR[data.plan] ?? '#00C896'
  const planLabel = PLAN_LABEL[data.plan] ?? data.plan

  const featureRows = data.features.map((f) =>
    `<tr><td style="padding:6px 0; font-size:13px; color:#8FA8C0; line-height:1.6;">
      <span style="color:${planColor}; font-weight:600; margin-right:8px;">✓</span>${f}
    </td></tr>`
  ).join('')

  const content = `
    <!-- Plan badge -->
    <div style="margin:0 0 20px 0; text-align:center;">
      <span style="display:inline-block; padding:6px 20px; border-radius:20px; border:1px solid ${planColor}40; background:${planColor}12; font-size:12px; font-weight:700; color:${planColor}; letter-spacing:2px; text-transform:uppercase;">${planLabel} Plan Active</span>
    </div>

    <div style="text-align:center; margin:0 0 24px 0;">
      <div style="width:64px; height:64px; border-radius:50%; background:${planColor}15; border:2px solid ${planColor}40; display:inline-flex; align-items:center; justify-content:center; font-size:28px;">✓</div>
    </div>

    ${heading(`You're on ${planLabel}, ${data.firstName}!`)}
    ${subheading(`Your subscription is active. Welcome to SEBI-registered research — built for serious Indian traders.`)}

    <!-- Billing info -->
    <div style="background:#0C1219; border:1px solid #1A2333; border-radius:12px; padding:20px; margin:0 0 24px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow('Plan', `<span style="color:${planColor}; font-weight:600;">${planLabel}</span>`)}
        ${infoRow('Billing', data.billingCycle === 'yearly' ? 'Annual' : 'Monthly')}
        ${infoRow('Amount paid', `₹${data.amountPaid.toLocaleString('en-IN')}`)}
        ${infoRow('Next billing', data.nextBillingDate)}
      </table>
    </div>

    ${divider()}

    <!-- Features -->
    <p style="margin:0 0 12px 0; font-size:12px; font-weight:600; color:#6B8AAA; letter-spacing:1.5px; text-transform:uppercase;">What's included</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
      ${featureRows}
    </table>

    <div style="text-align:center; margin:8px 0 24px 0;">
      ${primaryButton('Go to Dashboard →', 'https://www.withsahib.com/dashboard')}
    </div>

    <p style="margin:0; font-size:13px; color:#6B8AAA; line-height:1.7; text-align:center;">
      Manage your subscription at <a href="https://www.withsahib.com/settings">withsahib.com/settings</a>
    </p>
  `
  return baseTemplate(content)
}
