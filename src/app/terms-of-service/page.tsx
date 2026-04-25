import { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { StatutoryLetterhead } from '@/components/layout/StatutoryLetterhead'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service — Subscription & Usage',
  description: 'Terms of Service for withSahib.com — SEBI Registered Research Analyst INH000026266',
  robots: 'noindex',
}

export default function TermsOfServicePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <StatutoryLetterhead title="Terms of Service" lastUpdated="23 April 2026" />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 20px 80px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

          <section>
            <h2 style={h2}>1. Agreement to Terms</h2>
            <p style={p}>
              By accessing or using withSahib.com (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service
              and all applicable laws and regulations. If you do not agree, do not use the Platform.
            </p>
            <p style={p}>
              These terms govern your use of research services provided by Sahib Singh Hora, SEBI Registered Research
              Analyst (Registration No. INH000026266).
            </p>
          </section>

          <section>
            <h2 style={h2}>2. Nature of Services</h2>
            <p style={p}>
              withSahib.com provides equity research reports, trading ideas, and market analysis as a SEBI Registered
              Research Analyst. Our services include:
            </p>
            <ul style={ul}>
              <li style={li}>Swing trade setups and technical analysis</li>
              <li style={li}>Intraday trading calls (Pro and Elite plans)</li>
              <li style={li}>Options analysis and strategies</li>
              <li style={li}>Model portfolio guidance</li>
              <li style={li}>In-depth research reports</li>
              <li style={li}>Advisory sessions (Elite plan)</li>
            </ul>
            <p style={p}>
              All research is for informational and educational purposes only. Nothing on this Platform constitutes
              personalised investment advice. Past performance is not a guarantee of future results.
            </p>
          </section>

          <section>
            <h2 style={h2}>3. Eligibility</h2>
            <p style={p}>
              You must be at least 18 years of age and legally capable of entering into binding contracts. By registering,
              you confirm that you meet these requirements. Our services are intended for Indian residents investing
              in Indian capital markets.
            </p>
          </section>

          <section>
            <h2 style={h2}>4. Account Registration</h2>
            <p style={p}>
              You must provide accurate, current, and complete information during registration. You are responsible for
              maintaining the confidentiality of your password. You must notify us immediately at connect@withsahib.com
              if you suspect unauthorised access to your account.
            </p>
            <p style={p}>
              We reserve the right to suspend or terminate accounts that violate these terms or are used fraudulently.
            </p>
          </section>

          <section>
            <h2 style={h2}>5. Subscriptions and Billing</h2>
            <h3 style={h3}>5.1 Plans</h3>
            <p style={p}>
              We offer Basic, Pro, and Elite subscription plans billed monthly or annually. Pricing is as displayed
              on our Pricing page and may change with 30 days' notice to existing subscribers.
            </p>
            <h3 style={h3}>5.2 Payment</h3>
            <p style={p}>
              Payments are processed via Razorpay, a PCI DSS-compliant payment gateway. Subscriptions auto-renew
              unless cancelled before the renewal date. We do not store your payment card details.
            </p>
            <h3 style={h3}>5.3 Refunds</h3>
            <p style={p}>
              Due to the immediate delivery of research content, subscriptions are generally non-refundable. If you
              believe there has been an error or technical issue, contact us within 7 days of payment at
              connect@withsahib.com and we will review on a case-by-case basis.
            </p>
            <h3 style={h3}>5.4 Cancellation</h3>
            <p style={p}>
              You may cancel your subscription at any time from the Settings page. Cancellation takes effect at the end
              of the current billing cycle. You retain access until then.
            </p>
          </section>

          <section>
            <h2 style={h2}>6. Prohibited Uses</h2>
            <p style={p}>You must not:</p>
            <ul style={ul}>
              <li style={li}>Redistribute, resell, or republish our research without prior written consent</li>
              <li style={li}>Share your account credentials with others</li>
              <li style={li}>Use automated tools (scrapers, bots) to access the Platform</li>
              <li style={li}>Post false, misleading, or defamatory content</li>
              <li style={li}>Attempt to interfere with the security or operation of the Platform</li>
              <li style={li}>Use the Platform for any unlawful purpose</li>
            </ul>
          </section>

          <section>
            <h2 style={h2}>7. Investment Risk Disclaimer</h2>
            <div style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
              <p style={{ ...p, marginBottom: 0, color: 'var(--gold)' }}>
                <strong>Important:</strong> Investments in securities markets are subject to market risks.
                Read all related documents carefully before investing. SEBI registration does not guarantee
                performance or assure returns. Research Analyst services do not constitute portfolio management.
                You are solely responsible for your investment decisions.
              </p>
            </div>
            <p style={p}>
              The research, analysis, and recommendations provided on this Platform are based on publicly available
              information and our analysis. They may be incorrect, incomplete, or out of date. Market conditions can
              change rapidly and past performance is not indicative of future results.
            </p>
          </section>

          <section>
            <h2 style={h2}>8. Intellectual Property</h2>
            <p style={p}>
              All content on withSahib.com — including research reports, analysis, logos, and design — is owned by
              Sahib Singh Hora or licensed for use. You may not copy, reproduce, or distribute our content without
              express written permission.
            </p>
            <p style={p}>
              Personal use (reading, saving for personal reference) is permitted. Commercial redistribution is not.
            </p>
          </section>

          <section>
            <h2 style={h2}>9. Limitation of Liability</h2>
            <p style={p}>
              To the maximum extent permitted by law, withSahib.com and Sahib Singh Hora shall not be liable for
              any investment losses, indirect, incidental, or consequential damages arising from your use of the
              Platform or reliance on our research.
            </p>
            <p style={p}>
              Our total liability to you for any claims shall not exceed the amount you paid for the subscription
              in the three months preceding the claim.
            </p>
          </section>

          <section>
            <h2 style={h2}>10. Governing Law</h2>
            <p style={p}>
              These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction
              of courts in India. SEBI regulations and SEBI (Research Analyst) Regulations 2014 apply to our
              research services.
            </p>
          </section>

          <section>
            <h2 style={h2}>11. Changes to Terms</h2>
            <p style={p}>
              We may modify these Terms at any time. Material changes will be communicated by email to registered users.
              Continued use of the Platform after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 style={h2}>12. Contact</h2>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text2)', lineHeight: '2' }}>
                <strong style={{ color: 'var(--text)' }}>Sahib Singh Hora</strong><br />
                SEBI Registered Research Analyst · INH000026266<br />
                Email: <a href="mailto:connect@withsahib.com" style={{ color: 'var(--emerald)', textDecoration: 'none' }}>connect@withsahib.com</a><br />
                Website: <a href="https://www.withsahib.com" style={{ color: 'var(--emerald)', textDecoration: 'none' }}>www.withsahib.com</a>
              </p>
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  )
}

const h2: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 600,
  color: 'var(--text)',
  marginBottom: '16px',
}

const h3: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--text2)',
  marginBottom: '10px',
  marginTop: '20px',
}

const p: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--text3)',
  lineHeight: '1.8',
  marginBottom: '12px',
}

const ul: React.CSSProperties = {
  paddingLeft: '20px',
  marginBottom: '12px',
}

const li: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--text3)',
  lineHeight: '1.8',
  marginBottom: '6px',
}
