import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | withSahib Research',
  description:
    'Common questions about withSahib research subscriptions, SEBI registration, methodology, plans, and how calls are published. SEBI RA INH000026266.',
  alternates: { canonical: 'https://www.withsahib.com/faq' },
  openGraph: {
    title: 'Frequently Asked Questions | withSahib Research',
    description:
      'Common questions about withSahib research subscriptions, SEBI registration, methodology, plans, and how calls are published.',
    url: 'https://www.withsahib.com/faq',
  },
}

const FAQ_SECTIONS = [
  {
    heading: 'About SEBI Research Analysts',
    items: [
      {
        q: 'What is a SEBI Registered Research Analyst (RA)?',
        a: "A SEBI Registered Research Analyst is a SEBI-licensed professional authorised to provide investment research, stock recommendations, and trade ideas to retail and institutional clients. They operate under the SEBI (Research Analysts) Regulations, 2014 and must follow strict disclosure, conflict-of-interest, and compliance norms. Each RA carries a unique registration number (e.g. INH000026266) that is publicly verifiable on SEBI's portal.",
      },
      {
        q: 'Why should I only take research from a SEBI Registered RA?',
        a: 'Unregistered "tipsters" operate illegally and have zero accountability. A SEBI Registered RA must disclose their identity, registration number, conflicts of interest, and analyst holdings in every piece of research. They are subject to SEBI inspection and can face penalties for misleading recommendations. This regulatory framework protects investors from fraud and pump-and-dump schemes.',
      },
      {
        q: 'How is a SEBI RA different from a SEBI Investment Adviser (IA)?',
        a: "A SEBI Research Analyst provides research reports and general trade recommendations that are not tailored to individual circumstances. A SEBI Investment Adviser provides personalised advice based on a client's risk profile, goals, and financial situation. Sahib Singh Hora is a SEBI RA — the research published on withSahib.com is general in nature and not personal financial advice.",
      },
      {
        q: 'What are the SEBI RA Regulations 2014?',
        a: 'The SEBI (Research Analysts) Regulations, 2014 govern how research analysts can operate in India. Key requirements include: mandatory SEBI registration, NISM certification, disclosure of conflicts of interest, clear labelling of research reports with registration numbers, prohibition on trading against published recommendations for a defined period, and maintaining research records for 5 years.',
      },
      {
        q: 'What is NISM certification and why does it matter?',
        a: "NISM (National Institute of Securities Markets) is SEBI's educational arm. Research Analysts are required to pass the NISM Series XV: Research Analyst Certification Examination as a prerequisite for SEBI registration. This ensures all registered analysts have a baseline understanding of securities markets, valuation, and ethics. Sahib Singh Hora is NISM certified.",
      },
      {
        q: 'What is SEBI Registration No. INH000026266?',
        a: 'INH000026266 is the SEBI Research Analyst registration number of Sahib Singh Hora, founder of withSahib. This registration authorises the provision of equity research and investment recommendations to clients in India. It was issued under SEBI (Research Analysts) Regulations, 2014 and is valid from April 20, 2026 to April 19, 2031. Verifiable at sebi.gov.in.',
      },
    ],
  },
  {
    heading: 'About withSahib & Sahib Singh Hora',
    items: [
      {
        q: 'What is withSahib?',
        a: 'withSahib is a SEBI Registered Research Analyst platform founded by Sahib Singh Hora (Registration No. INH000026266). It provides structured equity research including swing trade setups, intraday stock picks, and options signals for Indian stock markets — backed by data and detailed rationale.',
      },
      {
        q: 'Who is Sahib Singh Hora?',
        a: 'Sahib Singh Hora is a SEBI Registered Research Analyst (INH000026266) and the founder of withSahib. He specialises in technical analysis, swing trading, intraday strategies, and options research for Indian equity markets.',
      },
      {
        q: 'Is withSahib SEBI registered?',
        a: 'Yes. withSahib operates under SEBI Research Analyst Registration No. INH000026266, issued by the Securities and Exchange Board of India (SEBI). All research and recommendations comply with SEBI (Research Analysts) Regulations, 2014.',
      },
      {
        q: 'What services does withSahib offer?',
        a: 'withSahib offers four core research services: (1) Swing trade setups — daily scans across 1500+ NSE stocks, (2) Intraday picks — Nifty 500 stocks with 1H watchlist and 15-minute live alerts, (3) Index options signals — Nifty, BankNifty, Sensex, FinNifty, MidcapNifty, and (4) Stock options signals for F&O eligible NSE stocks.',
      },
      {
        q: 'Is withSahib legitimate?',
        a: 'Yes. withSahib is a legally registered research analyst service under SEBI. Unlike unregistered tip providers, withSahib operates with full regulatory compliance, transparent track records, and detailed research rationale for every recommendation.',
      },
      {
        q: 'How is withSahib different from other stock tip services?',
        a: 'withSahib provides structured research — not tips. Every signal comes with data-backed rationale, entry/exit levels, and stop-loss. All signals are tracked publicly, including ones that were not shared, to maintain full accountability. withSahib is SEBI registered, which most tip providers are not.',
      },
      {
        q: 'Where is withSahib based?',
        a: 'withSahib is based in Jabalpur, Madhya Pradesh, India, and serves clients across the country through its digital platform at withsahib.com.',
      },
      {
        q: 'How can I contact withSahib?',
        a: 'You can reach withSahib through the website at withsahib.com, or via WhatsApp and email listed on the contact page.',
      },
      {
        q: 'What makes Sahib Singh Hora qualified to give stock market research?',
        a: 'Sahib Singh Hora holds a SEBI Research Analyst registration (INH000026266), which requires passing NISM Series XV examination and meeting SEBI\'s eligibility criteria. He specialises in technical analysis with a focus on pattern recognition, momentum strategies, and options pricing.',
      },
      {
        q: 'How do I verify SEBI registration INH000026266?',
        a: 'Go to sebi.gov.in → Intermediaries/Market Infrastructure Institutions → Registered Intermediaries → Research Analyst. Search for "INH000026266" or "Sahib Singh Hora" to verify the active registration status and validity period.',
      },
    ],
  },
  {
    heading: 'Swing Trading Research',
    items: [
      {
        q: 'What is swing trading?',
        a: 'Swing trading is a medium-term trading style where positions are held for 2 to 15 days, capturing price swings within a trend. It requires identifying stocks at key technical levels before a significant move.',
      },
      {
        q: 'How does withSahib identify swing trade setups?',
        a: 'withSahib uses a proprietary screener scanning 1500+ NSE stocks daily at 4 PM. It detects 15 bullish and 13 bearish patterns including EMA crossovers, Darvas Box breakouts, RSI divergence, VCP (Volatility Contraction Pattern), Cup & Handle, Double/Triple bottoms, Base breakouts, and SMC patterns like Order Blocks, FVGs, and Liquidity Sweeps.',
      },
      {
        q: 'What patterns does the swing screener detect?',
        a: 'The screener detects: EMA 10x20 and 20x50 crossovers and retests, Darvas Box breakout/breakdown (10D and 20D), RSI Bullish/Bearish Divergence (10, 14, 21 day), Double and Triple Bottom/Top with neckline breakout, Base Breakout with volume surge (10, 15, 20 day), VCP (Volatility Contraction Pattern), Rounding Bottom, Cup & Handle, Inverse Head & Shoulders, Head & Shoulders, SMC Order Blocks, Fair Value Gaps (FVG), and Liquidity Sweeps.',
      },
      {
        q: 'How many stocks does withSahib scan for swing trades?',
        a: 'withSahib scans 1200 to 1500 NSE Main Board stocks daily, filtered for liquidity (average daily turnover above ₹50 lakhs over 20 days). SME stocks and illiquid stocks are excluded.',
      },
      {
        q: 'What timeframe is used for swing trade research?',
        a: 'Swing trade research uses daily (1D) candles as the primary timeframe, with weekly trend confirmation. Scans run at 4 PM daily after market prices settle.',
      },
      {
        q: 'What is a Darvas Box breakout?',
        a: 'A Darvas Box is a tight price consolidation pattern where the stock trades within a defined range (box) for several days. A breakout occurs when price closes above the box top with significant volume — signalling institutional accumulation and potential for a strong move.',
      },
      {
        q: 'What is VCP — Volatility Contraction Pattern?',
        a: 'VCP is a pattern identified by Mark Minervini where a stock makes progressively smaller price corrections with decreasing volume — indicating institutional accumulation. The final breakout from VCP often produces explosive moves.',
      },
      {
        q: 'What is RSI divergence and why does it matter?',
        a: 'RSI divergence occurs when price makes a lower low but RSI makes a higher low (bullish divergence) — indicating weakening selling pressure and potential reversal. Bearish divergence is the opposite. withSahib uses 10, 14, and 21-day lookback windows to detect divergence across different timeframes.',
      },
      {
        q: 'Does withSahib give both bullish and bearish swing setups?',
        a: 'Yes. withSahib provides 15 bullish buckets (B1–B15) and 13 bearish buckets (S1–S13) for swing trades, allowing traders to identify both long and short opportunities.',
      },
      {
        q: 'What is the universe of stocks for swing trading research?',
        a: 'The swing trading universe covers 1200–1500 NSE Main Board stocks. Stocks are filtered by average daily turnover (minimum ₹50 lakhs/day over 20 days) to ensure adequate liquidity.',
      },
    ],
  },
  {
    heading: 'Intraday Research',
    items: [
      {
        q: 'What intraday research does withSahib provide?',
        a: 'withSahib provides two-stage intraday research: (1) Evening watchlist at 4 PM using 1-hour charts — stocks showing pattern setups for the next trading day, and (2) Real-time 15-minute alerts during market hours (9:15 AM to 3:30 PM) for entry confirmation signals.',
      },
      {
        q: 'What is the universe for intraday research?',
        a: 'Intraday research covers Nifty 500 stocks only — the most liquid, institutionally tracked stocks on NSE.',
      },
      {
        q: 'How does the 1H + 15M two-stage system work?',
        a: 'At 4 PM, withSahib scans 1-hour charts of Nifty 500 stocks to identify pattern setups and build a watchlist for the next day. During market hours, the system scans 15-minute charts every 15 minutes to detect entry confirmation signals on watchlist stocks. The daily trend alignment is verified before any signal is generated.',
      },
      {
        q: 'What is the Opening Range Breakout (ORB) strategy?',
        a: 'ORB involves marking the high and low of the first 15–30 minutes of trading (9:15–9:45 AM). A breakout above the range high signals a long entry; a breakdown below signals a short. This is one of the most reliable intraday setups used by institutional traders.',
      },
      {
        q: 'How does withSahib handle gap-up and gap-down openings for intraday?',
        a: "Gap openings require special handling. withSahib's intraday system filters out false signals by checking if the gap is supported by volume and trend alignment on the daily chart before generating an alert.",
      },
    ],
  },
  {
    heading: 'Options Research',
    items: [
      {
        q: 'What index options does withSahib cover?',
        a: 'withSahib covers weekly options for all five major indices: Nifty 50 (65 units), Bank Nifty (30 units), Nifty Financial Services/FinNifty (60 units), Nifty Midcap Select (120 units), and Sensex (20 units). Nifty, BankNifty, FinNifty, and MidcapNifty expire on Tuesday. Sensex expires on Thursday.',
      },
      {
        q: 'Does withSahib provide options buying or selling signals?',
        a: 'withSahib provides both — buy-side signals (directional options buying) and sell-side signals (premium collection strategies like Iron Condors, Straddles, Strangles). Sell-side strategies require higher capital and carry different risk profiles.',
      },
      {
        q: 'What stock options does withSahib cover?',
        a: 'withSahib covers F&O eligible NSE stocks — approximately 180 to 200 stocks that have active options contracts. These are the most liquid, institutionally tracked stocks in India.',
      },
      {
        q: 'What is the key pattern for explosive options moves?',
        a: 'The highest probability options setups occur when an underlying shows tight price consolidation with RSI resetting from overbought levels to 55–65 zone, volume drying up, and then a sudden breakout. This compression-expansion pattern can produce 30–100x returns on options in minutes due to gamma acceleration near expiry.',
      },
      {
        q: 'Why do options give 50-100x returns sometimes?',
        a: 'Near expiry, options have very low time value (theta). A small move in the underlying — say 0.5% — can change a deep OTM option from near-zero to significant intrinsic value. Combined with delta and gamma acceleration, this produces exponential returns. This is why withSahib focuses on expiry-week setups.',
      },
      {
        q: 'What is Iron Condor and when does withSahib use it?',
        a: 'An Iron Condor involves selling an OTM Call and OTM Put while buying further OTM options for protection — profiting when the index stays in a range. withSahib uses this strategy in low-volatility, range-bound market conditions.',
      },
      {
        q: 'What is the difference between ATM, ITM, and OTM options?',
        a: 'ATM (At The Money) — strike price closest to current market price. ITM (In The Money) — Call with strike below market price, or Put with strike above. OTM (Out of The Money) — Call with strike above market price, or Put with strike below. withSahib primarily uses ATM and 1-strike OTM for directional buying.',
      },
      {
        q: 'What is Gamma and why does it matter for options near expiry?',
        a: "Gamma measures the rate of change of Delta. Near expiry, Gamma is highest — meaning a small move in the underlying causes a disproportionately large change in the option's delta and price. This is why options explode near expiry on breakouts.",
      },
      {
        q: 'What is IV (Implied Volatility) and how does it affect options pricing?',
        a: "IV reflects the market's expectation of future price movement. High IV means options are expensive — premium sellers benefit. Low IV means options are cheap — buyers benefit. withSahib monitors IV before recommending buy or sell strategies.",
      },
      {
        q: 'What is Theta decay and how does withSahib manage it?',
        a: "Theta is time decay — options lose value every day, accelerating near expiry. For options buyers, this is the enemy — entry timing is critical. withSahib's buy-side signals are designed for quick entries and exits, minimising theta impact.",
      },
    ],
  },
  {
    heading: 'Platform & Technology',
    items: [
      {
        q: "What technology powers withSahib's screener?",
        a: 'withSahib uses a systematic research methodology — Sahib reviews 1500+ NSE stocks daily before market open, applying technical pattern analysis, volume profiling, and multi-timeframe confirmation. The research process is built on Fyers API for live market data.',
      },
      {
        q: 'How does withSahib track signal performance?',
        a: 'Every signal published from May 2026 is logged in the performance tracker — entries, exits, win/loss results, and R:R achieved. Outcomes are tracked and published publicly so anyone can verify the track record. No cherry-picking.',
      },
      {
        q: 'Does withSahib use automated trading or algo trading?',
        a: 'No. withSahib is a research and advisory platform — it identifies setups and generates signals. All final trading decisions are made by the subscriber. This complies with SEBI Research Analyst regulations.',
      },
      {
        q: 'How are signals delivered to subscribers?',
        a: 'Signals are delivered via WhatsApp and email. withSahib reviews all screener outputs before sharing — maintaining research quality and avoiding noise.',
      },
      {
        q: "Is withSahib's track record publicly available?",
        a: "Yes. withSahib maintains transparent track records of all shared signals including entry price, exit price, and percentage gain/loss. Historical performance data is available to subscribers.",
      },
      {
        q: 'Is withSahib a mobile app?',
        a: "withSahib.com is a Progressive Web App (PWA) — it works on any device through your browser and can be installed on your phone's home screen for an app-like experience. Native iOS and Android apps are planned.",
      },
    ],
  },
  {
    heading: 'Pricing & Subscription',
    items: [
      {
        q: 'How much does withSahib subscription cost?',
        a: 'There are 4 plans: Free (₹0/month) — signal previews and basic dashboard; Basic (₹3,999/month) — swing trades, model portfolio, courses; Pro (₹6,999/month) — all signals + research reports + 1 strategy call/month; Elite (₹12,499/month) — everything in Pro plus weekly calls, priority WhatsApp alerts, and direct analyst access. Annual billing saves up to 15%. Visit withsahib.com/pricing for current offers.',
      },
      {
        q: 'Is there a free trial available?',
        a: 'The Free plan requires no credit card and gives access to signal previews, market ticker, news feed, and sample research reports — indefinitely. You can upgrade at any time from your dashboard.',
      },
      {
        q: 'What payment methods does withSahib accept?',
        a: 'withSahib accepts all major payment methods through Razorpay — UPI (GPay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay), net banking, and EMI options.',
      },
      {
        q: 'Can I cancel my subscription anytime?',
        a: 'Yes. Subscriptions can be cancelled anytime from your account settings. You retain access until the end of your current billing period. No cancellation fees or lock-in.',
      },
    ],
  },
  {
    heading: 'Risk & Compliance',
    items: [
      {
        q: "Are withSahib's recommendations guaranteed to make profit?",
        a: "No. Stock market investments are subject to market risks. withSahib provides research and analysis — not guaranteed returns. Past performance does not guarantee future results. All investments should be made based on individual risk appetite and financial situation.",
      },
      {
        q: 'What is SEBI Research Analyst Regulation?',
        a: "SEBI (Research Analysts) Regulations 2014 governs entities providing investment research in India. Registered analysts must pass NISM certification, maintain records, disclose conflicts of interest, and follow a code of conduct. withSahib complies with all these requirements.",
      },
      {
        q: 'Is it safe to follow stock market research from withSahib?',
        a: 'withSahib provides SEBI-compliant research with transparent track records and full rationale. However, all investment decisions carry risk. Subscribers should do their own due diligence and consult a financial advisor for personalised advice.',
      },
      {
        q: 'Does withSahib have any conflict of interest in its recommendations?',
        a: 'withSahib follows SEBI guidelines on conflict of interest disclosure. Any personal positions held in recommended securities are disclosed as required by SEBI regulations.',
      },
      {
        q: 'How do I lodge a complaint against a SEBI-registered intermediary?',
        a: 'Complaints can be filed through the SEBI SCORES (SEBI Complaints Redressal System) portal at scores.sebi.gov.in. You can also contact SEBI directly at sebi.gov.in or call 1800 22 7575 (toll-free).',
      },
    ],
  },
  {
    heading: 'Financial Literacy & Education',
    items: [
      {
        q: 'What is the difference between a Research Analyst and an Investment Advisor?',
        a: "A Research Analyst (SEBI RA) provides research reports and recommendations on securities. An Investment Advisor (SEBI RIA) provides personalised financial planning advice. withSahib currently operates as a SEBI Registered Research Analyst.",
      },
      {
        q: 'What is technical analysis?',
        a: 'Technical analysis is the study of price charts, volume, and indicators to forecast future price movements. It assumes that all information is reflected in price and that patterns repeat. withSahib uses technical analysis as the primary tool for generating research.',
      },
      {
        q: 'What is fundamental analysis and does withSahib use it?',
        a: 'Fundamental analysis evaluates a company\'s financial health, business model, and growth prospects to determine intrinsic value. withSahib primarily uses technical analysis for timing, with fundamental filters for stock quality in swing research.',
      },
      {
        q: 'What is the difference between NSE and BSE?',
        a: "NSE (National Stock Exchange) and BSE (Bombay Stock Exchange) are India's two major stock exchanges. NSE has higher trading volumes and is the primary exchange for derivatives (Nifty futures and options). BSE is the oldest exchange in Asia and home to Sensex.",
      },
      {
        q: 'What is Nifty 50?',
        a: 'Nifty 50 is NSE\'s benchmark index comprising the 50 largest and most liquid Indian companies. It is the most widely tracked index in India and the underlying for the most liquid options contract — Nifty weekly options (expiry: Tuesday, lot size: 65 units).',
      },
      {
        q: 'What is BankNifty?',
        a: 'Bank Nifty is NSE\'s index of the 12 most liquid and large-cap banking stocks. It is highly volatile compared to Nifty and attracts significant options trading volume. Lot size: 30 units, expiry: Tuesday.',
      },
      {
        q: 'What is the difference between futures and options?',
        a: "Futures are contracts to buy/sell an asset at a predetermined price on a future date — both buyer and seller are obligated. Options give the buyer the right (not obligation) to buy (Call) or sell (Put) at a predetermined price. Options buyers have limited risk (premium paid) and unlimited reward potential.",
      },
      {
        q: 'What is Open Interest (OI) in options?',
        a: 'Open Interest is the total number of outstanding options contracts that have not been settled. Rising OI with rising price indicates bullish sentiment; rising OI with falling price indicates bearish sentiment. withSahib monitors OI data for options strategy confirmation.',
      },
      {
        q: 'What is PCR (Put Call Ratio)?',
        a: 'PCR is the ratio of Put volume/OI to Call volume/OI. A PCR above 1 indicates more puts being bought (bearish sentiment); below 1 indicates more calls (bullish). Extreme PCR readings often signal reversals.',
      },
      {
        q: 'What is Max Pain in options?',
        a: "Max Pain is the price at which options buyers collectively lose the most money at expiry — and therefore where options writers (sellers) gain the most. Markets tend to gravitate toward Max Pain near expiry. withSahib uses Max Pain levels as reference points for options strategies.",
      },
      {
        q: 'What is the VIX and how does it affect options?',
        a: 'India VIX (Volatility Index) measures expected market volatility for the next 30 days. High VIX = expensive options (good for sellers, risky for buyers). Low VIX = cheap options (good for buyers). withSahib monitors VIX before recommending options strategies.',
      },
      {
        q: 'What is a Stop Loss and why is it non-negotiable?',
        a: "A Stop Loss is a pre-determined price at which a losing trade is exited to prevent further loss. In options trading, withSahib recommends a 25–30% stop loss on premium paid for buy-side trades. Discipline in stop losses is what separates profitable traders from unprofitable ones.",
      },
    ],
  },
]

export default function FAQPage() {
  const allItems = FAQ_SECTIONS.flatMap((s) => s.items)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* CSS for smooth accordion animation */}
      <style>{`
        details > .faq-answer {
          display: grid;
          grid-template-rows: 0fr;
          overflow: hidden;
          transition: grid-template-rows 0.3s ease;
        }
        details[open] > .faq-answer {
          grid-template-rows: 1fr;
        }
        details > .faq-answer > div {
          overflow: hidden;
        }
        details summary::-webkit-details-marker { display: none; }
        details summary::marker { display: none; }
        details[open] .faq-chevron { transform: rotate(45deg); }
        .faq-chevron { transition: transform 0.3s ease; }
      `}</style>
      <Navbar />
      <main style={{ background: 'var(--bg)', minHeight: '100vh', padding: '80px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '56px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0,200,150,0.07)',
                border: '1px solid rgba(0,200,150,0.18)',
                borderRadius: '20px',
                padding: '6px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--emerald)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}
            >
              Answer Engine Optimised · AEO
            </div>
            <h1
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 400,
                color: 'var(--text)',
                lineHeight: 1.1,
                marginBottom: '20px',
              }}
            >
              Frequently Asked{' '}
              <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>Questions</em>
            </h1>
            <p style={{ fontSize: '17px', color: 'var(--text2)', lineHeight: 1.7, maxWidth: '620px' }}>
              Everything about SEBI Registered Research Analyst Sahib Singh Hora (INH000026266),
              withSahib services, swing trading, intraday picks, options signals, and Indian stock markets.
            </p>
            <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text3)' }}>
              {allItems.length} questions across {FAQ_SECTIONS.length} sections
            </p>
          </div>

          {/* Quick nav */}
          <nav
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '20px 24px',
              marginBottom: '48px',
            }}
          >
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '12px' }}>
              Jump to Section
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {FAQ_SECTIONS.map((s, i) => (
                <a
                  key={i}
                  href={`#section-${i}`}
                  style={{
                    fontSize: '12px',
                    color: 'var(--emerald)',
                    textDecoration: 'none',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    background: 'rgba(0,200,150,0.06)',
                    border: '1px solid rgba(0,200,150,0.15)',
                    lineHeight: 1.5,
                  }}
                >
                  {s.heading}
                </a>
              ))}
            </div>
          </nav>

          {/* Sections */}
          {FAQ_SECTIONS.map((section, si) => (
            <section key={si} id={`section-${si}`} style={{ marginBottom: '56px' }}>
              <h2
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '24px',
                  fontWeight: 400,
                  color: 'var(--text)',
                  marginBottom: '24px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {section.heading}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {section.items.map((item, qi) => (
                  <details
                    key={qi}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <summary
                      style={{
                        padding: '18px 22px',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--text)',
                        cursor: 'pointer',
                        listStyle: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        userSelect: 'none',
                      }}
                    >
                      <span>{item.q}</span>
                      <span
                        className="faq-chevron"
                        style={{
                          flexShrink: 0,
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: 'rgba(0,200,150,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          color: 'var(--emerald)',
                          fontWeight: 300,
                          lineHeight: 1,
                        }}
                      >
                        +
                      </span>
                    </summary>
                    <div className="faq-answer">
                      <div
                        style={{
                          padding: '0 22px 18px',
                          fontSize: '14px',
                          color: 'var(--text2)',
                          lineHeight: 1.8,
                          borderTop: '1px solid var(--border)',
                          paddingTop: '16px',
                        }}
                      >
                        {item.a}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          {/* CTA */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid rgba(0,200,150,0.2)',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              marginTop: '40px',
            }}
          >
            <h3
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '28px',
                fontWeight: 400,
                color: 'var(--text)',
                marginBottom: '12px',
              }}
            >
              Ready to start?
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text2)', marginBottom: '24px' }}>
              Join withSahib free — no credit card required.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/auth/register"
                style={{
                  padding: '12px 28px',
                  background: 'var(--emerald)',
                  color: '#031A13',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Start Free
              </Link>
              <Link
                href="/pricing"
                style={{
                  padding: '12px 28px',
                  border: '1px solid var(--border)',
                  color: 'var(--text2)',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                See Pricing
              </Link>
            </div>
            <p
              style={{
                marginTop: '20px',
                fontSize: '11px',
                color: 'var(--text3)',
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '1px',
              }}
            >
              SEBI RA · INH000026266 · Sahib Singh Hora · withSahib.com
            </p>
          </div>
        </div>
      </main>
      <BookingBanner />
    </>
  )
}
