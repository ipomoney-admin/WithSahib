import type { Metadata, Viewport } from 'next'
import { Outfit } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
  preload: true,
})

const BASE_URL = 'https://www.withsahib.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'withSahib — SEBI Registered Research Analyst INH000026266',
    template: '%s | withSahib',
  },
  description:
    'Sahib Singh Hora, SEBI Registered Research Analyst (INH000026266). Institutional-grade intraday calls, NSE swing trades, index options, AI stock research reports & 1-on-1 advisory for serious Indian investors.',
  keywords: [
    'SEBI registered research analyst India',
    'SEBI RA INH000026266',
    'Sahib Singh Hora research analyst',
    'best SEBI RA India 2026',
    'intraday stock calls SEBI registered',
    'NSE swing trade picks',
    'index options calls India',
    'SEBI RA model portfolio',
    'AI stock research report India',
    'research analyst appointment',
    'verified stock market analyst India',
    'SEBI research analyst Madhya Pradesh',
    'top SEBI RA intraday calls',
    'SEBI registered analyst options trading',
    'withsahib.com',
    'withSahib',
    'INH000026266',
    'NISM certified analyst India',
    'Bank Nifty options calls',
    'Nifty intraday analysis',
  ],
  authors: [{ name: 'Sahib Singh Hora', url: BASE_URL }],
  creator: 'Sahib Singh Hora',
  publisher: 'Sahib Singh Hora',
  category: 'Finance',
  classification: 'Financial Research & Advisory',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'withSahib',
    title: 'withSahib — SEBI Registered Research Analyst INH000026266',
    description:
      'Institutional-grade intraday calls, NSE swing trades, index options & AI research by Sahib Singh Hora, SEBI RA INH000026266.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'withSahib — SEBI Registered Research Analyst Sahib Singh Hora INH000026266',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@withsahib',
    creator: '@withsahib',
    title: 'withSahib — SEBI Registered Research Analyst INH000026266',
    description:
      'SEBI RA INH000026266 · Sahib Singh Hora · Intraday calls, swing trades, options & AI research for Indian markets.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#06090F' },
    { media: '(prefers-color-scheme: light)', color: '#F0F4FA' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// ─── STRUCTURED DATA ──────────────────────────────────────────────────────────
const structuredData = [
  // Person
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sahib Singh Hora',
    url: BASE_URL,
    image: `${BASE_URL}/icons/icon-192.png`,
    jobTitle: 'SEBI Registered Research Analyst',
    description:
      'Sahib Singh Hora is a SEBI Registered Research Analyst (INH000026266) providing institutional-grade stock research, intraday calls, and options advisory for Indian markets.',
    identifier: {
      '@type': 'PropertyValue',
      name: 'SEBI Registration Number',
      value: 'INH000026266',
    },
    knowsAbout: [
      'Technical Analysis',
      'Intraday Trading',
      'Options Trading',
      'Swing Trading',
      'Stock Market Research',
      'NSE Equities',
      'Nifty Options',
      'Bank Nifty Options',
    ],
    sameAs: [`${BASE_URL}/about`],
  },
  // WebSite
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'withSahib',
    url: BASE_URL,
    description:
      'SEBI Registered Research Analyst platform — intraday calls, swing trades, options picks, AI research reports, and 1-on-1 advisory by Sahib Singh Hora (INH000026266).',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/reports?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
  // ProfessionalService
  {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'withSahib Research Advisory',
    url: BASE_URL,
    description:
      'SEBI Registered Research Analyst services including intraday stock calls, NSE swing trade picks, Nifty & Bank Nifty options, model portfolio, AI research reports, and personal advisory sessions.',
    provider: {
      '@type': 'Person',
      name: 'Sahib Singh Hora',
    },
    areaServed: 'IN',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Advisory Plans',
      itemListElement: [
        { '@type': 'Offer', name: 'Free Plan', price: '0', priceCurrency: 'INR' },
        { '@type': 'Offer', name: 'Basic Plan', price: '999', priceCurrency: 'INR' },
        { '@type': 'Offer', name: 'Pro Plan', price: '2499', priceCurrency: 'INR' },
        { '@type': 'Offer', name: 'Elite Plan', price: '5999', priceCurrency: 'INR' },
      ],
    },
  },
  // BreadcrumbList
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/services/intraday` },
      { '@type': 'ListItem', position: 3, name: 'Pricing', item: `${BASE_URL}/pricing` },
      { '@type': 'ListItem', position: 4, name: 'Reports', item: `${BASE_URL}/reports` },
      { '@type': 'ListItem', position: 5, name: 'FAQ', item: `${BASE_URL}/faq` },
      { '@type': 'ListItem', position: 6, name: 'About', item: `${BASE_URL}/about` },
    ],
  },
  // FAQPage
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a SEBI Registered Research Analyst?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A SEBI Registered Research Analyst (RA) is a SEBI-licensed professional who provides investment research and trade recommendations to clients under the SEBI (Research Analysts) Regulations, 2014. They are required to disclose their registration number and follow strict conflict-of-interest and disclosure norms.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is Sahib Singh Hora\'s SEBI registration number?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sahib Singh Hora\'s SEBI Research Analyst registration number is INH000026266, valid from April 20, 2026 to April 19, 2031. Verify at sebi.gov.in.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I verify the SEBI RA registration INH000026266?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can verify SEBI RA registration INH000026266 on the official SEBI Intermediary Portal at sebi.gov.in under the "Registered Intermediaries" section. Search for registration number INH000026266 or name "Sahib Singh Hora".',
        },
      },
      {
        '@type': 'Question',
        name: 'What services does withSahib.com offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'withSahib.com offers: Daily intraday stock calls for NSE equities, weekly stock options strategies, Nifty & Bank Nifty index options calls, 2–10 day swing trade picks, a curated model portfolio, AI-powered research reports, self-paced trading courses, and 1-on-1 personal advisory sessions.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are investments recommended by withSahib guaranteed?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Investments in securities markets are subject to market risks. SEBI registration does not guarantee performance or returns. All recommendations are research-based and must be evaluated based on your own risk profile. Past performance is not indicative of future results.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the subscription plans available on withSahib?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'withSahib offers 4 plans: Free (₹0/month — signal previews), Basic (₹999/month — swing trades, model portfolio), Pro (₹2,499/month — intraday + options + AI reports), and Elite (₹5,999/month — full access including unlimited 1-on-1 sessions and priority alerts).',
        },
      },
      {
        '@type': 'Question',
        name: 'How are intraday calls delivered?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Intraday stock calls are published on your withSahib dashboard before 9 AM on every trading day. Each call includes the stock name, entry range, target price, and stop-loss level. Pro and Elite subscribers also receive priority alerts.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I book a 1-on-1 session with Sahib Singh Hora?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Pro subscribers get 1 appointment per month; Elite subscribers get unlimited sessions. You can book 15 or 30-minute personal sessions for portfolio review, stock deep-dives, or strategy discussions at withsahib.com/appointments.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the AI Research Engine on withSahib?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The AI Research Engine is an automated system that scans NSE stocks for chart patterns and generates DCF models and quarterly results analysis when companies file results on BSE/NSE. It produces institutional-grade research reports available to Pro and Elite subscribers.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is withSahib compliant with SEBI regulations?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. withSahib operates fully under SEBI (Research Analysts) Regulations, 2014. All research is published with full analyst disclosure, conflict-of-interest declarations, and registration details (INH000026266). Client data is never shared with third parties.',
        },
      },
    ],
  },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resource hints for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://trtoxawkeququfurddwr.supabase.co" />
        <link rel="dns-prefetch" href="https://trtoxawkeququfurddwr.supabase.co" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <meta
          name="robots"
          content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        {/* TODO: Replace PLACEHOLDER with actual Google Search Console verification code */}
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? 'PLACEHOLDER'} />
        {/* TODO: Replace BING_PLACEHOLDER with actual Bing Webmaster Tools verification code */}
        <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? 'BING_PLACEHOLDER'} />
        {structuredData.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className={outfit.variable}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--surface)',
                border: '1px solid var(--border2)',
                color: 'var(--text)',
                fontFamily: 'Outfit, sans-serif',
              },
            }}
          />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
