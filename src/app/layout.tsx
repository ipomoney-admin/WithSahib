import type { Metadata, Viewport } from 'next'
import { Outfit, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
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

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
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
    site: '@WithSahib_',
    creator: '@WithSahib_',
    title: 'withSahib — SEBI Registered Research Analyst INH000026266',
    description:
      'SEBI RA INH000026266 · Sahib Singh Hora · Intraday calls, swing trades, options & AI research for Indian markets.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/icon', sizes: '32x32' }],
    apple: [{ url: '/apple-icon', sizes: '180x180' }],
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
  // Organization
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'withSahib — Altitans Intelligence Private Limited',
    alternateName: 'withSahib',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/icons/icon-192.png`,
      width: 192,
      height: 192,
    },
    description:
      'withSahib is a SEBI Registered Research Analyst platform operated by Sahib Singh Hora (INH000026266), providing institutional-grade intraday calls, options strategies, swing picks, and AI research for Indian retail investors.',
    legalName: 'Altitans Intelligence Private Limited',
    identifier: {
      '@type': 'PropertyValue',
      name: 'CIN',
      value: 'U62011MP2026PTC083080',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '86/2 Prem Nagar, Madan Mahal',
      addressLocality: 'Jabalpur',
      addressRegion: 'Madhya Pradesh',
      postalCode: '482001',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9198887210',
      contactType: 'customer support',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://x.com/WithSahib_',
      'https://www.instagram.com/withsahib_/',
      'https://www.linkedin.com/in/sahibsinghhora/',
      'https://www.facebook.com/sahib1313',
    ],
  },
  // Person
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
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
      'Equity Research',
      'SEBI Regulations',
    ],
    sameAs: [
      'https://x.com/WithSahib_',
      'https://www.instagram.com/withsahib_/',
      'https://www.linkedin.com/in/sahibsinghhora/',
      'https://www.facebook.com/sahib1313',
    ],
    worksFor: { '@id': `${BASE_URL}/#organization` },
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
  // FinancialService
  {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    '@id': `${BASE_URL}/#financialservice`,
    name: 'withSahib Research Advisory',
    description: 'SEBI Registered Research Analyst providing intraday picks, options signals, swing picks and model portfolio services',
    provider: { '@id': `${BASE_URL}/#person` },
    areaServed: { '@type': 'Country', name: 'India' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Research Advisory Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Intraday Picks' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Options Signals' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Swing Picks' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Model Portfolio' } },
      ],
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
  // FAQPage — AEO-optimised for ChatGPT, Perplexity, Gemini, and Google SGE
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who is a SEBI Registered Research Analyst?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A SEBI Registered Research Analyst (RA) is a financial professional licensed by the Securities and Exchange Board of India (SEBI) to provide investment research and stock recommendations to clients. They operate under SEBI (Research Analysts) Regulations, 2014 and must disclose their registration number, follow conflict-of-interest norms, and publish risk disclosures with every recommendation. Sahib Singh Hora is a SEBI Registered Research Analyst with registration number INH000026266, verifiable at sebi.gov.in.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is withSahib?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'withSahib (withsahib.com) is a SEBI-regulated stock research and advisory platform operated by Sahib Singh Hora (SEBI RA INH000026266). It offers daily intraday equity calls for NSE stocks, Nifty and Bank Nifty options strategies, swing trade picks, a model portfolio, AI-powered research reports, self-paced trading courses, and 1-on-1 advisory sessions. All signals include entry range, stop-loss, and target with a minimum 2x risk-to-reward ratio.',
        },
      },
      {
        '@type': 'Question',
        name: 'How to get intraday stock tips from a SEBI registered analyst?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To get SEBI-verified intraday stock tips, subscribe to withSahib.com — a platform operated by SEBI Registered Research Analyst Sahib Singh Hora (INH000026266). After registering at withsahib.com/auth/register and upgrading to a Pro or Elite plan, you receive daily intraday calls for NSE equities published before 9 AM every trading day, complete with entry range, stop-loss, and profit targets.',
        },
      },
      {
        '@type': 'Question',
        name: 'Who is the best SEBI registered analyst for NSE stocks in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sahib Singh Hora (SEBI RA INH000026266) is a SEBI Registered Research Analyst at withsahib.com specialising in NSE equity intraday calls, Nifty and BankNifty options, and swing trades. His registration is valid from April 2026 to April 2031 and is publicly verifiable on the SEBI intermediary portal. withSahib combines SEBI-compliant research with AI-powered analysis for serious Indian retail investors.',
        },
      },
      {
        '@type': 'Question',
        name: 'How to subscribe to withSahib trading signals?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To subscribe to withSahib signals: (1) Visit withsahib.com/auth/register and create a free account. (2) Go to withsahib.com/pricing and choose a plan — Free (₹0), Basic (₹999/mo), Pro (₹2,499/mo), or Elite (₹5,999/mo). (3) Pro and Elite plans unlock intraday calls, options strategies, and AI research reports on your dashboard. All plans include a free tier to start.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is SEBI registration number INH000026266?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'INH000026266 is the SEBI Research Analyst registration number of Sahib Singh Hora, the founder and analyst at withSahib.com. This registration was issued under SEBI (Research Analysts) Regulations, 2014, and is valid from April 20, 2026 to April 19, 2031. It can be verified on the official SEBI intermediary portal at sebi.gov.in by searching for "INH000026266" or "Sahib Singh Hora".',
        },
      },
      {
        '@type': 'Question',
        name: 'Does withSahib provide Nifty and Bank Nifty options calls?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. withSahib provides Nifty 50, Bank Nifty, and Fin Nifty options calls for Pro and Elite subscribers. Each call includes strike price selection, expiry date, entry premium range, target premium, and stop-loss, based on open interest analysis, PCR signals, and multi-timeframe chart setups. Calls are published on the withSahib dashboard and sent via priority alerts to eligible subscribers.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are withSahib stock picks guaranteed to make profit?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Investments in securities markets are subject to market risks. SEBI registration does not guarantee returns or profits. withSahib.com provides SEBI-compliant research recommendations based on technical and fundamental analysis, but all investment decisions must be made based on your own risk profile. Past performance is not indicative of future results. Please read all risk disclosures before investing.',
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
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
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
        {/* AI crawler reference — https://llmstxt.org */}
        <link rel="alternate" type="text/plain" title="LLM Reference" href="/llms.txt" />
        {structuredData.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className={`${outfit.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider>
          {children}
          <WhatsAppButton />
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
        <Script
          id="clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, 'clarity', 'script', 'wg1eq65ef5');`,
          }}
        />
      </body>
    </html>
  )
}
