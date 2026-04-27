import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research Methodology — How withSahib Generates Calls | withSahib',
  description:
    'The systematic framework behind every withSahib call — multi-timeframe analysis, risk-to-reward filters, open interest signals, and written rationale. SEBI RA INH000026266.',
  alternates: { canonical: '/methodology' },
  openGraph: {
    url: 'https://www.withsahib.com/methodology',
    title: 'Research Methodology | withSahib',
    description:
      'Documented, repeatable research process behind every intraday call, options signal, and swing pick by SEBI RA Sahib Singh Hora (INH000026266).',
  },
}

export default function MethodologyLayout({ children }: { children: React.ReactNode }) {
  return children
}
