import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Investor Complaints — SEBI Grievance Redressal | withSahib',
  description:
    'SEBI-mandated investor complaints disclosure for withSahib (Altitans Intelligence Private Limited). SEBI RA INH000026266. File complaints via SCORES at scores.gov.in.',
  alternates: { canonical: '/complaints' },
  openGraph: {
    url: 'https://www.withsahib.com/complaints',
    title: 'Investor Complaints | withSahib',
    description:
      'SEBI-mandated complaints disclosure. File grievances via SCORES — SEBI RA INH000026266.',
  },
}

export default function ComplaintsLayout({ children }: { children: React.ReactNode }) {
  return children
}
