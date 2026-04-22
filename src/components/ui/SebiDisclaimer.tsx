interface SebiDisclaimerProps {
  variant?: 'full' | 'short' | 'signal'
}

export default function SebiDisclaimer({ variant = 'short' }: SebiDisclaimerProps) {
  if (variant === 'signal') {
    return (
      <div style={{
        fontSize: '10px',
        color: 'var(--text3)',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 300,
        lineHeight: '1.5',
        borderTop: '1px solid var(--border)',
        paddingTop: '8px',
        marginTop: '8px',
      }}>
        Research Analyst: Sahib Singh Hora | SEBI RA: INH000026266
        <br />
        For educational purposes only. Not investment advice.
        <br />
        Investments subject to market risk.
      </div>
    )
  }

  if (variant === 'short') {
    return (
      <span style={{
        fontSize: '10px',
        color: 'var(--text3)',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 300,
      }}>
        SEBI RA: INH000026266 | Not investment advice
      </span>
    )
  }

  // full
  return (
    <div style={{
      fontSize: '11px',
      color: 'var(--text3)',
      fontFamily: 'Outfit, sans-serif',
      fontWeight: 300,
      lineHeight: '1.7',
      padding: '20px',
      background: 'rgba(26,35,51,0.5)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
    }}>
      <p style={{ fontWeight: 500, color: 'var(--text2)', marginBottom: '8px' }}>
        Important Disclosures — SEBI Regulation
      </p>
      <p>
        Sahib Singh Hora is a SEBI Registered Research Analyst (Registration No. INH000026266)
        under the Securities and Exchange Board of India (Research Analysts) Regulations, 2014.
      </p>
      <p style={{ marginTop: '8px' }}>
        All research calls, signals, and content published on withSahib are for educational
        and informational purposes only and do not constitute investment advice, a solicitation,
        or a recommendation to buy or sell any security. Past performance is not indicative of
        future results.
      </p>
      <p style={{ marginTop: '8px' }}>
        Investments in securities are subject to market risks. Please read all scheme-related
        documents carefully before investing. Neither withSahib nor Sahib Singh Hora shall be
        liable for any direct, indirect, special, or consequential damages arising out of the
        use of the information provided.
      </p>
      <p style={{ marginTop: '8px', fontWeight: 500, color: 'var(--text2)' }}>
        SEBI RA Reg. No.: INH000026266 | Registered with SEBI under RA Regulations 2014
      </p>
    </div>
  )
}
