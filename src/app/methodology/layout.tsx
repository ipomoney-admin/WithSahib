import type { Metadata } from 'next'

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How withSahib Publishes Equity Research',
  description: 'Six-filter research process used to evaluate and publish equity recommendations by SEBI RA Sahib Singh Hora (INH000026266).',
  step: [
    { '@type': 'HowToStep', name: 'Global & Macro Scan', text: 'Pre-market review of SGX Nifty, FII/DII flows, global index cues, and overnight US market performance.' },
    { '@type': 'HowToStep', name: 'Technical Structure Validation', text: 'Multi-timeframe chart analysis using Wyckoff, Dow Theory, and pattern recognition across daily and weekly charts.' },
    { '@type': 'HowToStep', name: 'Derivatives & Institutional Flow', text: 'Open Interest analysis, PCR reading, IV rank review, and options chain scanning for confirmation.' },
    { '@type': 'HowToStep', name: 'Risk Calibration', text: 'Stop-loss defined at structural invalidation point. Minimum risk-to-reward of 1:2 required before any call is considered.' },
    { '@type': 'HowToStep', name: 'Red Team Review', text: 'Every setup is argued against — counter-thesis tested before publishing. No confirmation bias allowed.' },
    { '@type': 'HowToStep', name: 'Research Report Published', text: 'Delivered via dashboard and WhatsApp before market open. Entry zone, two targets, stop-loss, and written rationale included.' },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.withsahib.com' },
    { '@type': 'ListItem', position: 2, name: 'Methodology', item: 'https://www.withsahib.com/methodology' },
  ],
}

export const metadata: Metadata = {
  title: 'Research Methodology — Six-Filter Process | withSahib',
  description:
    'Every recommendation passes six sequential filters — macro scan, technical validation, derivatives analysis, risk calibration, red team review. No shortcuts. SEBI RA INH000026266.',
  alternates: { canonical: '/methodology' },
  openGraph: {
    url: 'https://www.withsahib.com/methodology',
    title: 'Research Methodology — Six-Filter Process | withSahib',
    description:
      'Documented, repeatable six-filter research process behind every intraday call, options signal, and swing pick by SEBI RA Sahib Singh Hora (INH000026266).',
  },
}

export default function MethodologyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  )
}
