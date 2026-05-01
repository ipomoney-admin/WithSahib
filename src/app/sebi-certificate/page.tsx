import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CertificateViewer } from './CertificateViewer'

export const metadata: Metadata = {
  title: 'SEBI Registration Certificate — withSahib',
  description: 'SEBI Certificate of Registration as Research Analyst. Certificate No. 1781, INH000026266, issued to Sahib Singh Hora.',
  robots: { index: false, follow: false },
}

export default function SebiCertificatePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ padding: '64px 40px 32px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-tag">Regulatory</div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px,4vw,48px)',
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.15,
              marginBottom: 10,
            }}
          >
            SEBI Registration Certificate
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text3)', lineHeight: 1.7 }}>
            Certificate No. 1781 · Registration No. INH000026266 · Issued: 20 April 2026
          </p>
        </div>
      </section>

      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <CertificateViewer />

          <div style={{ marginTop: 20, padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.7, marginBottom: 10 }}>
              This certificate is issued by the Securities and Exchange Board of India. Investors may independently verify registration status at sebi.gov.in
            </p>
            <a
              href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=14"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, color: 'var(--orange)', textDecoration: 'none', fontWeight: 600 }}
            >
              Verify on SEBI website →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
