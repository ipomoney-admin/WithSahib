import { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { StatutoryLetterhead } from '@/components/layout/StatutoryLetterhead'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Disclaimer — SEBI Research Analyst Disclosures',
  description: 'Risk disclaimer and regulatory disclosures for withSahib.com — SEBI Registered Research Analyst INH000026266',
  robots: 'noindex',
}

export default function DisclaimerPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <StatutoryLetterhead title="Disclaimer" lastUpdated="23 April 2026" />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 20px 80px' }}>

        {/* Primary risk warning */}
        <div style={{
          background: 'rgba(212,168,67,0.06)',
          border: '1px solid rgba(212,168,67,0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '48px',
        }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gold)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Risk Warning
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: '1.8', margin: 0 }}>
            Investments in securities markets are subject to market risks. Read all related documents carefully
            before investing. Registration granted by SEBI and certification from NISM in no way guarantee
            performance of the intermediary or provide any assurance of returns to investors. <strong>Past performance
            is not indicative of future results.</strong>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

          <section>
            <h2 style={h2}>1. SEBI Registration</h2>
            <p style={p}>
              withSahib.com is operated by Sahib Singh Hora, a SEBI Registered Research Analyst.
            </p>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginTop: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    ['Registration No.', 'INH000026266'],
                    ['Analyst Name', 'Sahib Singh Hora'],
                    ['Registration Type', 'Individual Research Analyst'],
                    ['Registration Valid', '20th April 2026 – 19th April 2031'],
                    ['Regulator', 'Securities and Exchange Board of India (SEBI)'],
                  ].map(([label, value]) => (
                    <tr key={label} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 0', fontSize: '13px', color: 'var(--text3)', width: '200px' }}>{label}</td>
                      <td style={{ padding: '10px 0', fontSize: '13px', color: 'var(--text)', fontWeight: 500, fontFamily: label === 'Registration No.' ? 'Courier New, monospace' : undefined }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ ...p, marginTop: '16px' }}>
              You can verify our registration at:{' '}
              <a
                href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=14"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--emerald)', textDecoration: 'none' }}
              >
                SEBI Intermediary Portal
              </a>
            </p>
          </section>

          <section>
            <h2 style={h2}>2. Nature of Research Services</h2>
            <p style={p}>
              The research, analysis, trade ideas, and market commentary published on withSahib.com are provided
              under SEBI (Research Analyst) Regulations 2014. These are general research publications and not
              personalised investment advice tailored to any individual&apos;s financial situation.
            </p>
            <p style={p}>
              Research reports may contain information, data, analysis, and opinions. They are prepared based on
              publicly available information and our independent analysis. We do not guarantee the accuracy,
              completeness, or timeliness of any information.
            </p>
          </section>

          <section>
            <h2 style={h2}>3. No Personalised Advice</h2>
            <p style={p}>
              Nothing on this Platform constitutes personalised investment advice, portfolio management, or wealth
              management services. Before making any investment decision, you should consult a SEBI Registered
              Investment Adviser who can assess your individual financial circumstances, risk tolerance, and objectives.
            </p>
          </section>

          <section>
            <h2 style={h2}>4. Conflict of Interest Disclosure</h2>
            <p style={p}>
              As required under SEBI (Research Analyst) Regulations 2014, we disclose:
            </p>
            <ul style={ul}>
              <li style={li}>
                Sahib Singh Hora or associates may hold positions in securities covered in research reports.
                Material positions will be disclosed in the relevant report.
              </li>
              <li style={li}>
                We do not receive any compensation from companies covered in our research for publishing research reports.
              </li>
              <li style={li}>
                Subscription fees are our sole source of revenue from research services.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={h2}>5. Forward-Looking Statements</h2>
            <p style={p}>
              Research reports may contain forward-looking statements, price targets, or return projections. These
              are based on assumptions and models that may prove incorrect. Actual results may differ materially
              from projections. Do not place undue reliance on forward-looking statements.
            </p>
          </section>

          <section>
            <h2 style={h2}>6. Options and Derivatives</h2>
            <p style={p}>
              Options and derivatives trading involves significant risk and may not be suitable for all investors.
              Options can expire worthless, resulting in a total loss of the premium paid. Leverage in derivatives
              can amplify losses as well as gains. Only trade options with capital you can afford to lose entirely.
            </p>
          </section>

          <section>
            <h2 style={h2}>7. Track Record Disclosure</h2>
            <p style={p}>
              Historical performance data shown on the Platform reflects actual calls made. However:
            </p>
            <ul style={ul}>
              <li style={li}>Actual returns will vary based on entry/exit prices, brokerage, taxes, and timing</li>
              <li style={li}>Past performance does not guarantee future results</li>
              <li style={li}>Returns are calculated at recommended prices and may not reflect slippage</li>
              <li style={li}>Not all subscribers will achieve the same results</li>
            </ul>
          </section>

          <section>
            <h2 style={h2}>8. Limitation of Liability</h2>
            <p style={p}>
              withSahib.com and Sahib Singh Hora shall not be liable for any investment losses incurred by subscribers
              or visitors based on the research published on this Platform. You acknowledge that you act on any
              information at your own risk and discretion.
            </p>
          </section>

          <section>
            <h2 style={h2}>9. Grievance Redressal</h2>
            <p style={p}>
              For any complaints or grievances related to our research services:
            </p>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text2)', lineHeight: '2' }}>
                <strong style={{ color: 'var(--text)' }}>Grievance Officer: Sahib Singh Hora</strong><br />
                Email: <a href="mailto:connect@withsahib.com" style={{ color: 'var(--emerald)', textDecoration: 'none' }}>connect@withsahib.com</a><br />
                Response time: Within 7 business days<br /><br />
                If your grievance is not resolved, you may approach SEBI&apos;s SCORES portal at{' '}
                <a href="https://scores.sebi.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--emerald)', textDecoration: 'none' }}>scores.sebi.gov.in</a>
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
