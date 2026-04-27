import { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { StatutoryLetterhead } from '@/components/layout/StatutoryLetterhead'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — Data Protection',
  description: 'Privacy Policy for withSahib.com — SEBI Registered Research Analyst INH000026266',
  robots: 'noindex',
}

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <StatutoryLetterhead title="Privacy Policy" lastUpdated="23 April 2026" />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 20px 80px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

          <section>
            <h2 style={h2}>1. Introduction</h2>
            <p style={p}>
              withSahib.com is operated by Sahib Singh Hora, SEBI Registered Research Analyst (Registration No. INH000026266).
              This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our
              website, services, and research publications.
            </p>
            <p style={p}>
              By using withSahib.com you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 style={h2}>2. Information We Collect</h2>
            <h3 style={h3}>2.1 Information you provide directly</h3>
            <ul style={ul}>
              <li style={li}>Name and email address when you register an account</li>
              <li style={li}>Phone number (optional, for WhatsApp alerts)</li>
              <li style={li}>Payment information processed securely via Razorpay (we do not store card details)</li>
              <li style={li}>Communications you send us via email or contact forms</li>
            </ul>
            <h3 style={h3}>2.2 Information collected automatically</h3>
            <ul style={ul}>
              <li style={li}>IP address and approximate location</li>
              <li style={li}>Browser type and device information</li>
              <li style={li}>Pages visited and time spent on the site</li>
              <li style={li}>Referral source (how you found our website)</li>
            </ul>
          </section>

          <section>
            <h2 style={h2}>3. How We Use Your Information</h2>
            <ul style={ul}>
              <li style={li}>To provide and improve our research services and platform</li>
              <li style={li}>To send research reports, trade alerts, and market updates you have subscribed to</li>
              <li style={li}>To process subscription payments and send billing notifications</li>
              <li style={li}>To respond to your enquiries and support requests</li>
              <li style={li}>To comply with SEBI regulations and legal obligations</li>
              <li style={li}>To detect and prevent fraud and misuse</li>
            </ul>
            <p style={p}>
              We do not sell, trade, or otherwise transfer your personally identifiable information to third parties
              without your consent, except as described in this policy or as required by law.
            </p>
          </section>

          <section>
            <h2 style={h2}>4. Data Storage and Security</h2>
            <p style={p}>
              Your data is stored on Supabase (hosted on AWS infrastructure) with encryption at rest and in transit.
              We implement industry-standard security practices including HTTPS, hashed passwords, and access controls.
            </p>
            <p style={p}>
              Despite these measures, no method of transmission over the internet is 100% secure. We cannot guarantee
              absolute security but we take all reasonable precautions to protect your information.
            </p>
          </section>

          <section>
            <h2 style={h2}>5. Third-Party Services</h2>
            <p style={p}>We use the following third-party services which may process your data:</p>
            <ul style={ul}>
              <li style={li}><strong style={{ color: 'var(--text2)' }}>Razorpay</strong> — payment processing (PCI DSS compliant)</li>
              <li style={li}><strong style={{ color: 'var(--text2)' }}>Resend</strong> — transactional email delivery</li>
              <li style={li}><strong style={{ color: 'var(--text2)' }}>Supabase</strong> — database and authentication</li>
              <li style={li}><strong style={{ color: 'var(--text2)' }}>Vercel</strong> — website hosting and deployment</li>
            </ul>
            <p style={p}>
              Each of these services maintains their own privacy policies and data protection standards.
            </p>
          </section>

          <section>
            <h2 style={h2}>6. Cookies</h2>
            <p style={p}>
              We use cookies strictly necessary for authentication (session management) and preference storage (theme
              settings). We do not use advertising or tracking cookies. You can disable cookies in your browser settings,
              though this may affect your ability to log in.
            </p>
          </section>

          <section>
            <h2 style={h2}>7. Your Rights</h2>
            <p style={p}>You have the right to:</p>
            <ul style={ul}>
              <li style={li}>Access the personal information we hold about you</li>
              <li style={li}>Request correction of inaccurate data</li>
              <li style={li}>Request deletion of your account and associated data</li>
              <li style={li}>Opt out of marketing emails at any time via the unsubscribe link</li>
              <li style={li}>Data portability where technically feasible</li>
            </ul>
            <p style={p}>
              To exercise any of these rights, email us at <strong style={{ color: 'var(--emerald)' }}>connect@withsahib.com</strong>.
            </p>
          </section>

          <section>
            <h2 style={h2}>8. Data Retention</h2>
            <p style={p}>
              We retain your account data for as long as your account is active or as needed to provide services.
              If you delete your account, personal data will be removed within 30 days except where we are required
              to retain it for legal or regulatory compliance (e.g., transaction records required by SEBI regulations).
            </p>
          </section>

          <section>
            <h2 style={h2}>9. Children&apos;s Privacy</h2>
            <p style={p}>
              Our services are intended for individuals who are 18 years of age or older. We do not knowingly collect
              information from minors. If you believe a minor has provided us with personal information, contact us
              immediately.
            </p>
          </section>

          <section>
            <h2 style={h2}>10. Changes to This Policy</h2>
            <p style={p}>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated
              revision date. Continued use of our services after changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 style={h2}>11. Contact</h2>
            <p style={p}>
              For any privacy-related enquiries or to exercise your rights:
            </p>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
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
