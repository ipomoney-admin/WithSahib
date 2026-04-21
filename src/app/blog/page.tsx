import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Blog — SEBI RA Research, Intraday Tips & Trading Insights | withSahib',
  description:
    'In-depth articles on SEBI registered analyst services, intraday stock tips NSE, Nifty options tips, Bank Nifty calls, swing trading stocks India — by Sahib Singh Hora, SEBI RA INH000026266.',
  keywords: [
    'share market tips', 'intraday tips', 'NSE tips', 'SEBI registered analyst',
    'research analyst India', 'options trading tips', 'Nifty options tips today',
    'Bank Nifty tips', 'swing trading stocks', 'SEBI RA', 'INH000026266',
  ],
  alternates: { canonical: 'https://withsahib.com/blog' },
  openGraph: {
    title: 'Blog — SEBI RA Stock Market Research | withSahib',
    description: 'Intraday tips, options strategies, swing trading and SEBI compliance articles by Sahib Singh Hora (INH000026266).',
    url: 'https://withsahib.com/blog',
  },
}

interface Post {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  dateDisplay: string
  tags: string[]
  body: string[]
}

const POSTS: Post[] = [
  {
    slug: 'how-to-identify-genuine-sebi-registered-research-analyst',
    title: 'How to Identify a Genuine SEBI Registered Research Analyst',
    excerpt: 'With thousands of unregulated "tipsters" operating on Telegram and YouTube, knowing how to verify a SEBI RA is the first step to protecting your capital.',
    category: 'Regulation',
    readTime: '6 min read',
    date: '2026-04-15',
    dateDisplay: 'April 15, 2026',
    tags: ['SEBI', 'Research Analyst', 'INH000026266', 'Investor Safety'],
    body: [
      'A SEBI Registered Research Analyst (RA) is licensed under the SEBI (Research Analysts) Regulations, 2014. They are legally permitted to publish investment research, stock market tips, and trade recommendations. Every SEBI RA carries a unique registration number — for example, Sahib Singh Hora\'s SEBI registration is INH000026266.',
      'Step 1: Check the SEBI Intermediary Portal. Go to sebi.gov.in → Registered Intermediaries → Research Analyst. Search for the registration number or analyst name. Verify: active status, valid licence dates, and registered entity name. For withSahib, search "INH000026266" or "Sahib Singh Hora".',
      'Step 2: Every piece of research from a genuine SEBI RA must display the registration number. If a "research service" — on Telegram, WhatsApp, or YouTube — does not show a SEBI registration number, it is operating illegally under Section 12 of SEBI Act, 1992.',
      'Step 3: SEBI RAs must be NISM Series XV certified. This exam tests securities market knowledge, valuation, and ethics. Sahib Singh Hora is NISM certified. If an analyst cannot prove NISM certification, do not subscribe.',
      'Step 4: Genuine SEBI RAs must disclose conflicts of interest. If they hold a position in a stock they recommend, it must be disclosed in the research note itself. No disclosure is a clear red flag and a regulatory violation.',
      'Step 5: No legitimate SEBI RA can guarantee returns. The phrase "guaranteed profit" or "100% accuracy" is illegal under SEBI regulations. Any service making such claims is operating outside Indian securities law — avoid them entirely.',
      'The bottom line: SEBI registration is the minimum standard for any stock advisory service in India. It does not guarantee returns, but it guarantees accountability. Sahib Singh Hora (INH000026266) at withSahib.com operates under full SEBI compliance — verifiable at sebi.gov.in in 30 seconds.',
    ],
  },
  {
    slug: 'intraday-trading-entry-target-stop-loss-explained',
    title: 'Understanding Intraday Trading: Entry, Target and Stop-Loss Explained',
    excerpt: 'Every intraday call has three numbers: entry, target, and stop-loss. Most retail traders ignore one of them — and it\'s usually the one that destroys their capital.',
    category: 'Trading Education',
    readTime: '8 min read',
    date: '2026-04-10',
    dateDisplay: 'April 10, 2026',
    tags: ['Intraday Trading', 'NSE Tips', 'Stop Loss', 'Risk Management'],
    body: [
      'Intraday trading means buying and selling a stock within the same trading session (9:15 AM – 3:30 PM IST on NSE). Unlike swing trades or investments, intraday positions must be squared off by end of day — or they get auto-squared by the broker.',
      'The Entry Range is the price zone where you initiate the position. A good intraday stock tip from a SEBI RA includes an entry range — not an exact price — because markets are dynamic. If a stock has already moved 2% past the entry range before you act, you skip the trade. Chasing is the #1 mistake in intraday trading.',
      'The Target Price is where you exit with profit. For NSE intraday tips, targets are typically 0.5% to 2.5% from entry depending on the stock\'s Average True Range (ATR). Multiple targets allow partial profit-booking. Target 1 is conservative; Target 2 is if momentum continues.',
      'The Stop-Loss (SL) is the most important number in any intraday call. It is the price at which you admit the trade is wrong and exit to protect capital. A strict stop-loss at 0.5–1% limits damage from any single bad trade. Without a stop-loss, one losing trade can erase weeks of gains.',
      'Risk-to-Reward Ratio: Only take intraday trades where potential reward is at least 2x the risk. If your SL is 50 points on Nifty, your target should be 100 points minimum. This is why SEBI registered analysts like Sahib Singh Hora publish the full rationale — not just a stock name.',
      'Position Sizing: Never risk more than 1–2% of your total capital on a single intraday trade. If your trading capital is ₹5,00,000, maximum risk per trade = ₹5,000–10,000. If your stop-loss is 1% on the stock, your position size = risk amount / SL% = ₹10,000 / 1% = ₹10,00,000 worth — which is too large. Position size accordingly.',
      'All withSahib intraday tips follow this framework — entry, target, SL, and the technical rationale behind the trade. No guesswork. No anonymous tips. Just SEBI-compliant research from a verified analyst.',
    ],
  },
  {
    slug: 'what-is-model-portfolio-why-retail-investors-need-one',
    title: 'What Is a Model Portfolio and Why Every Retail Investor Needs One',
    excerpt: 'Most retail investors own a random collection of stocks they bought based on news and tips. A model portfolio is the opposite — systematic, diversified, and built on research.',
    category: 'Portfolio Strategy',
    readTime: '7 min read',
    date: '2026-04-05',
    dateDisplay: 'April 5, 2026',
    tags: ['Model Portfolio', 'Long Term Investing', 'NSE Equities', 'Portfolio Management'],
    body: [
      'A model portfolio is a pre-defined, researched selection of stocks that together represent an investment strategy — balanced across sectors, market caps, and time horizons. It is the opposite of random stock picking.',
      'Most retail investors in India accumulate stocks based on WhatsApp forwards, CNBC recommendations, or "hot tips" from friends. The result is a portfolio with 15–20 unrelated stocks, zero sector balance, overlapping risks, and no exit strategy.',
      'A SEBI RA model portfolio is different. Every stock in the withSahib model portfolio has: (1) a defined allocation percentage based on conviction and risk, (2) a documented investment thesis — valuation, growth drivers, and risks, (3) a target return horizon, and (4) clear rebalancing rules.',
      'Sector diversification is critical. A good model portfolio spreads capital across IT, banking, pharma, FMCG, auto, and infrastructure — reducing correlation. If IT stocks fall due to US tech weakness, banking or FMCG may hold. This is how institutional investors manage risk.',
      'Quarterly rebalancing means reviewing every position — trimming winners that have become overweight, adding to positions that remain compelling, and exiting those where the thesis has changed. The withSahib model portfolio publishes full rebalancing notes with reasoning.',
      'The withSahib model portfolio is published under SEBI RA regulations and available to Basic plan subscribers and above. It tracks 10–15 NSE-listed stocks with live performance monitoring — not just best stocks to buy recommendations with no accountability.',
    ],
  },
  {
    slug: 'sebi-registered-research-analyst-vs-unregistered-tipsters-2026',
    title: 'SEBI Registered Research Analyst vs Unregistered Tipsters: Why It Matters in 2026',
    excerpt: 'There are over 10,000 unregistered "stock tip" services operating on Telegram and Instagram in India. Here\'s the legal difference between a SEBI RA and an illegal tipster — and why it matters for your money.',
    category: 'Regulation',
    readTime: '9 min read',
    date: '2026-04-18',
    dateDisplay: 'April 18, 2026',
    tags: ['SEBI registered analyst', 'SEBI RA', 'research analyst India', 'INH000026266'],
    body: [
      'In 2026, SEBI has intensified enforcement against unregistered investment advisers and research analysts. Over 100 entities were penalised in 2024-25 alone for providing research recommendations without SEBI registration. Yet millions of retail investors continue to subscribe to illegal tip services — often without knowing it.',
      'Legal Definition: A Research Analyst under SEBI (Research Analysts) Regulations, 2014 is "any person who is primarily responsible for preparation or publication of the content of the research report." Anyone doing this commercially must be registered with SEBI. No registration = illegal.',
      'What a SEBI Registered Research Analyst must do: (1) Display registration number on all research — INH000026266 in Sahib Singh Hora\'s case. (2) Disclose all conflicts of interest. (3) Maintain research records for 5 years. (4) Follow SEBI\'s code of conduct. (5) Submit to SEBI inspections. (6) Carry NISM Series XV certification.',
      'What unregistered tipsters do: (1) Operate anonymously — no name, no accountability. (2) Make "guaranteed return" promises (illegal under SEBI Act). (3) Charge fees without any regulatory framework. (4) Cannot be traced or penalised when they vanish with subscriber money. (5) Often operate multiple Telegram channels simultaneously.',
      'The 2025 SEBI crackdown: SEBI issued 47 orders against unregistered investment advisers in Q1 2025 alone. Under Section 12(1)(b) of SEBI Act, operating as an unregistered RA is punishable with up to ₹25 crore fine or 10 years imprisonment or both. Despite this, thousands of services continue.',
      'How to verify SEBI registration in 30 seconds: Go to sebi.gov.in → Intermediaries/Market Infrastructure → Registered Intermediaries → Research Analyst. Enter INH000026266 to verify Sahib Singh Hora\'s registration. If an analyst\'s number does not appear here, do not pay them a rupee.',
      'withSahib.com operates under full SEBI compliance. Sahib Singh Hora\'s registration INH000026266 is publicly verifiable. Every research note carries the registration number and mandatory SEBI risk disclaimer. This is not optional — it is the law.',
      'The bottom line for 2026: As SEBI enforcement increases, unregistered tip services will face shutdowns with no refunds to subscribers. Your subscription money to an illegal service has zero protection. A SEBI RA subscriber, on the other hand, can file a complaint through SEBI SCORES if they have a grievance.',
    ],
  },
  {
    slug: 'intraday-trading-tips-how-sebi-ra-picks-stocks-every-morning',
    title: 'Intraday Trading Tips: How a SEBI RA Picks Stocks Every Morning',
    excerpt: 'What actually goes into a pre-market intraday call? Here\'s the exact process Sahib Singh Hora uses to pick the best stock to buy today — every trading day, before 9 AM.',
    category: 'Process',
    readTime: '8 min read',
    date: '2026-04-16',
    dateDisplay: 'April 16, 2026',
    tags: ['intraday tips', 'intraday stock tips NSE', 'share market tips today', 'best stock to buy today'],
    body: [
      'Every morning before 9 AM, subscribers to withSahib\'s Pro plan receive the day\'s intraday stock tips for NSE equities. What goes into that call? Here\'s the exact pre-market process — from 6 AM to 8:45 AM.',
      'Step 1 — Global cues (6:00–6:30 AM): Review US market close (Dow, S&P 500, Nasdaq), SGX Nifty futures, Asian market openings, and crude oil / dollar index. These determine the broad market bias for the day — gap-up or gap-down open, and overall sentiment.',
      'Step 2 — Nifty prediction today (6:30–7:00 AM): Analyse Nifty 50 futures using the previous day\'s candlestick, support/resistance zones, and overnight FII/DII data from NSE. This gives the intraday direction bias — bullish, bearish, or neutral/rangebound.',
      'Step 3 — Sector rotation scan (7:00–7:30 AM): Identify which sectors showed strength or weakness in the previous session. If banking stocks saw heavy buying, the next day\'s watchlist skews towards HDFC Bank, ICICI Bank, Axis Bank. Sector momentum is more reliable than random stock picking.',
      'Step 4 — Stock scanner (7:30–8:15 AM): Run a systematic scan on NSE stocks filtered by: (a) volume surge on previous close, (b) stocks near key support/resistance on daily chart, (c) stocks with upcoming catalysts like results or news, (d) FII/DII activity reports. This generates 20–30 candidates.',
      'Step 5 — Technical confirmation (8:15–8:45 AM): Each candidate is checked across multiple timeframes — 15-minute, hourly, and daily charts. Entry is only justified when at least 2 timeframes agree. Entry range, Target 1, Target 2, and stop-loss are defined based on ATR and key levels.',
      'Step 6 — Call publication (8:45 AM): The final 1–3 intraday calls go live on the withSahib dashboard with full technical notes. Each call includes: Stock name, entry range, T1, T2, SL, expected holding time, and the technical rationale. This is the only format a SEBI registered analyst should publish — with full disclosure and reasoning.',
      'This process is repeated every trading day, 250 days a year. It is systematic, rule-based, and SEBI-compliant. Every share market tip from withSahib is the output of this framework — not a gut feel or a WhatsApp forward.',
    ],
  },
  {
    slug: 'bank-nifty-vs-nifty-options-complete-guide-2026',
    title: 'Bank Nifty vs Nifty Options: Complete Guide for Indian Traders in 2026',
    excerpt: 'Bank Nifty tips or Nifty options tips today — which should you trade? Here\'s the complete framework for understanding the difference, the risks, and the strategy.',
    category: 'Options Education',
    readTime: '10 min read',
    date: '2026-04-12',
    dateDisplay: 'April 12, 2026',
    tags: ['Bank Nifty tips', 'Nifty options tips today', 'options trading tips', 'index options India'],
    body: [
      'In 2026, Nifty and Bank Nifty are the two most actively traded index options on NSE. Combined daily turnover exceeds ₹100 lakh crore in notional value. Understanding the difference between the two — and when to trade which — is fundamental for any options trader.',
      'Nifty 50 Options represent the top 50 stocks on NSE by market capitalisation. When you trade Nifty options, you\'re effectively betting on the direction of the broader Indian market. Nifty is slower-moving than Bank Nifty, with lower implied volatility. This makes Nifty options better for theta-positive strategies (selling options) and for traders who prefer controlled moves.',
      'Bank Nifty Options track 12 banking and financial sector stocks including HDFC Bank, ICICI Bank, SBI, Kotak, and Axis Bank. Banking stocks are more volatile than the broader market — they move fast on RBI policy announcements, credit data, quarterly results, and global rate decisions. Bank Nifty can move 500–1,500 points on a big day; Nifty might move 100–300 points.',
      'Expiry schedule comparison: Nifty has weekly expiry on Thursdays. Bank Nifty had weekly expiry on Wednesdays but SEBI\'s 2024-25 circular reduced weekly expiries to one per exchange per week. Check the NSE calendar for current expiry dates, as they change with regulatory updates.',
      'Lot sizes matter: Nifty options lot size is 25 (each contract = 25 units of Nifty). Bank Nifty lot size is 15. At Nifty 24,000, one lot represents ₹6,00,000 notional. At Bank Nifty 52,000, one lot represents ₹7,80,000 notional. Premium outflow depends on the strike and days to expiry.',
      'Which to trade? If you want: (1) Directional bets with big moves — Bank Nifty tips are better, volatility is higher. (2) Premium selling / theta decay strategies — Nifty options are calmer and more predictable. (3) Hedge your equity portfolio — Nifty puts are the standard tool.',
      'withSahib\'s options advisory covers both: Nifty options tips today (published pre-expiry) and Bank Nifty calls using OI analysis, PCR signals, and volatility percentile. Every options call from Sahib Singh Hora (INH000026266) includes the strike, premium range, target, stop-loss, and the full rationale — not just a strike number.',
      'Risk reminder: Options are leveraged instruments. They can expire worthless, resulting in 100% loss of premium paid. The number of profitable options traders in India is a small fraction of those who try. Trade with a verified SEBI RA, defined risk, and strict position sizing.',
    ],
  },
  {
    slug: 'what-is-research-analyst-sebi-definition-registration-services',
    title: 'What Is a Research Analyst? SEBI Definition, Registration & Services Explained',
    excerpt: 'The term "research analyst" is used loosely across the internet. Here\'s the precise SEBI definition, what registration means, and what legitimate research analyst services look like in India.',
    category: 'Education',
    readTime: '7 min read',
    date: '2026-04-08',
    dateDisplay: 'April 8, 2026',
    tags: ['research analyst SEBI', 'SEBI RA', 'research analyst India', 'SEBI registered analyst fees'],
    body: [
      'Under SEBI (Research Analysts) Regulations, 2014, a "research analyst" is defined as: "any person who is primarily responsible for preparation or publication of the content of the research report; or making buy, sell or hold recommendations." This legal definition makes it clear: anyone publishing stock recommendations commercially must be SEBI registered.',
      'How to become a SEBI Research Analyst in India: (1) Pass NISM Series XV: Research Analyst Certification Examination. (2) Meet experience requirements (minimum 2 years in securities research, finance, or related fields). (3) Register with SEBI and pay the prescribed fee. (4) Maintain net worth requirements. (5) Register the entity (individual or firm) with SEBI.',
      'Research Analyst vs Investment Adviser: This is a critical distinction. A Research Analyst (RA) publishes general research reports accessible to all clients — like Sahib Singh Hora\'s intraday calls on withSahib.com. An Investment Adviser (IA) provides personalised advice based on a client\'s specific financial situation, goals, and risk profile. The withSahib platform provides general research, not personalised investment advice.',
      'SEBI registered analyst fees: SEBI RAs are permitted to charge fees for research services. Unlike Investment Advisers (who face fee caps), Research Analysts can set their own fee structures — provided they are disclosed. The withSahib fee structure is: Free (₹0), Basic (₹999/month), Pro (₹2,499/month), Elite (₹5,999/month). All fees are disclosed upfront with no hidden charges.',
      'What legitimate SEBI RA research includes: (1) Full analyst name and SEBI registration number on every report. (2) Clear disclosure of analyst holdings in recommended securities. (3) SEBI-mandated risk disclaimer on every communication. (4) Research records maintained for 5 years. (5) No guaranteed return promises.',
      'Common misconceptions: "SEBI registration means the analyst is good." No — registration means they are legally authorised and accountable. Performance depends on skill and methodology. "SEBI RA can give personalised advice." No — they can only provide general research. Personalised advice requires SEBI IA registration.',
      'Sahib Singh Hora (INH000026266) at withSahib.com is a SEBI Registered Research Analyst. All research on the platform follows SEBI RA regulations — verifiable at sebi.gov.in.',
    ],
  },
  {
    slug: 'swing-trading-stocks-india-2-10-day-holding-strategy',
    title: 'Swing Trading Stocks India: The 2–10 Day Holding Strategy Explained',
    excerpt: 'Swing trading is the perfect middle ground between intraday chaos and long-term waiting. Here\'s the complete methodology for identifying the best NSE stocks for 2–10 day positional trades.',
    category: 'Trading Strategy',
    readTime: '9 min read',
    date: '2026-04-03',
    dateDisplay: 'April 3, 2026',
    tags: ['swing trading stocks', 'best stocks to buy', 'NSE tips', 'positional trading India'],
    body: [
      'Swing trading occupies the most practical space in active trading — longer than intraday (so you don\'t need to watch screens all day), shorter than investing (so you can adapt quickly to market changes). The holding period is 2–10 trading days on NSE-listed stocks.',
      'Who is swing trading for? Working professionals who cannot monitor intraday positions, part-time traders who track markets after hours, and investors who want better returns than buy-and-hold but without the stress of intraday trading. The withSahib Basic plan is designed specifically for this profile.',
      'The swing trading framework used by Sahib Singh Hora (INH000026266): Phase 1 — Market structure. Before picking stocks, identify the trend of Nifty 50 on the weekly chart. In an uptrend, focus on long setups. In a downtrend, focus on shorts or avoid swing trades entirely.',
      'Phase 2 — Sector strength. Use sector index performance (Nifty IT, Nifty Bank, Nifty Pharma, etc.) to identify the strongest sectors. Swing trade stocks from the strongest sectors — they have institutional tailwind behind them.',
      'Phase 3 — Pattern selection. The most reliable swing trading patterns in NSE stocks: (1) Bull flag after a strong momentum move — pullback to 20-day EMA, then continuation. (2) Symmetrical triangle breakout with volume surge. (3) Cup and handle on the daily chart. (4) Pullback to key support in an uptrend.',
      'Phase 4 — Volume confirmation. Pattern breakouts without volume are false. A genuine breakout on NSE stocks should show 1.5x to 3x average volume on the breakout day. Volume is the footprint of institutional participation.',
      'Phase 5 — Entry, target, SL. Entry: on the breakout candle or on a pullback to the breakout level the next day. Target: measured move from the pattern (e.g., flagpole height added to flag breakout point). SL: below the pattern\'s low (for longs) or above the pattern\'s high (for shorts). Never move SL against the trade.',
      'withSahib publishes 3–5 swing trading stock picks per week on the Basic plan. Each pick includes the chart pattern identified, entry range, T1, T2, SL, and the holding timeframe. This is the methodology behind the best stocks to buy — not a random list.',
    ],
  },
  {
    slug: 'how-to-verify-sebi-research-analyst-registration-number',
    title: 'How to Verify a SEBI Research Analyst Registration Number (Step-by-Step)',
    excerpt: 'Verifying INH000026266 or any SEBI RA registration takes less than 60 seconds. Here\'s the exact step-by-step guide — protect yourself from illegal tip services.',
    category: 'Investor Protection',
    readTime: '5 min read',
    date: '2026-04-01',
    dateDisplay: 'April 1, 2026',
    tags: ['SEBI registered research analyst', 'INH000026266', 'verify SEBI RA', 'SEBI registration verification'],
    body: [
      'Before subscribing to any stock advisory service in India, you must verify their SEBI registration. This takes 60 seconds and can save you from losing money to illegal, unaccountable tipsters. Here\'s the exact process.',
      'Step 1: Go to the official SEBI website. Open sebi.gov.in in your browser. Do not use third-party websites claiming to verify SEBI registrations — only the official SEBI portal is authoritative.',
      'Step 2: Navigate to Registered Intermediaries. On the SEBI homepage, click: "Sebiweb" or "Registered Intermediaries" or go directly to sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13 — this is the Research Analyst specific search page.',
      'Step 3: Enter the registration number. In the search field, enter "INH000026266" (for Sahib Singh Hora / withSahib.com) or any other registration number you want to verify. Click Search.',
      'Step 4: Read the results. A valid registration will show: Registration number, Name of analyst/entity, Registration type (Individual RA), Registration date, Validity period, and Status (Active/Suspended/Cancelled). For INH000026266 you will see: Sahib Singh Hora, Active, Valid Apr 2026 – Apr 2031.',
      'Step 5: Cross-verify with the service. The name and entity shown on SEBI\'s portal must match exactly what appears on the research service\'s website, reports, and communications. If there is any discrepancy — wrong name, different entity, or the registration doesn\'t show up — do not subscribe.',
      'Red flags that indicate an unregistered service: (1) No SEBI registration number anywhere on their website or materials. (2) Registration number that returns no results or shows "Cancelled/Suspended" on SEBI portal. (3) Using phrases like "SEBI compliant" or "approved by SEBI" without an actual registration number. (4) Claiming to be a "financial advisor" or "research team" without individual names and SEBI numbers.',
      'withSahib.com: Sahib Singh Hora, SEBI RA INH000026266. Verify right now at sebi.gov.in. Every research note published on withSahib.com displays this registration number and the mandatory SEBI risk disclaimer — as required by law.',
    ],
  },
]

const blogListSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'withSahib — SEBI RA Research Blog',
  url: 'https://withsahib.com/blog',
  description: 'Stock market research, trading education, intraday tips, options strategies, and SEBI compliance articles by Sahib Singh Hora, SEBI RA INH000026266.',
  author: { '@type': 'Person', name: 'Sahib Singh Hora', url: 'https://withsahib.com' },
  blogPost: POSTS.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `https://withsahib.com/blog/${post.slug}`,
    datePublished: post.date,
    author: { '@type': 'Person', name: 'Sahib Singh Hora', identifier: 'INH000026266' },
    keywords: post.tags.join(', '),
    publisher: { '@type': 'Person', name: 'Sahib Singh Hora' },
  })),
}

const CATEGORIES = ['All', 'Regulation', 'Trading Education', 'Process', 'Options Education', 'Education', 'Trading Strategy', 'Portfolio Strategy', 'Investor Protection']

export default function BlogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }} />
      <Navbar />
      <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        {/* Header */}
        <section style={{ padding: '80px 40px 56px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
          <div className="glow-orb glow-emerald" style={{ width: '500px', height: '350px', top: '-60px', right: '10%' }} />
          <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
            <div className="section-tag">9 Articles · SEBI RA Research</div>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.1, marginBottom: 16 }}>
              The withSahib <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>Blog</em>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 600, marginBottom: 28 }}>
              Intraday tips, Nifty options strategy, swing trading stocks, SEBI regulation guides, and share market research — by Sahib Singh Hora, SEBI RA INH000026266.
            </p>
            {/* Category pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <span key={cat} style={{ padding: '5px 14px', background: cat === 'All' ? 'var(--emerald)' : 'rgba(0,200,150,0.07)', border: `1px solid ${cat === 'All' ? 'transparent' : 'rgba(0,200,150,0.18)'}`, borderRadius: 20, fontSize: 12, color: cat === 'All' ? '#031A13' : 'var(--emerald)', fontWeight: cat === 'All' ? 700 : 400 }}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Posts */}
        <section style={{ padding: '56px 40px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {POSTS.map((post) => (
              <article key={post.slug} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
                {/* Article header */}
                <div style={{ padding: '32px 36px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'var(--emerald)', textTransform: 'uppercase', padding: '3px 10px', background: 'rgba(0,200,150,0.08)', borderRadius: 20, border: '1px solid rgba(0,200,150,0.15)' }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text4)' }}>{post.dateDisplay}</span>
                    <span style={{ fontSize: 12, color: 'var(--text4)' }}>·</span>
                    <span style={{ fontSize: 12, color: 'var(--text4)' }}>{post.readTime}</span>
                  </div>

                  <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.25, marginBottom: 10 }}>
                    {post.title}
                  </h2>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 16 }}>{post.excerpt}</p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {post.tags.map((tag) => (
                      <span key={tag} style={{ fontSize: 11, color: 'var(--text3)', padding: '2px 8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5 }}>
                        #{tag.replace(/ /g, '-').toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Article body */}
                <div style={{ borderTop: '1px solid var(--border)', padding: '24px 36px', background: 'var(--bg)' }}>
                  {post.body.map((para, pi) => (
                    <p key={pi} style={{ fontSize: 14, color: pi === 0 ? 'var(--text)' : 'var(--text2)', lineHeight: 1.85, marginBottom: pi < post.body.length - 1 ? 16 : 0, fontWeight: pi === 0 ? 400 : 300 }}>
                      {para}
                    </p>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 36px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--emerald)' }}>S</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>Sahib Singh Hora</div>
                      <div style={{ fontSize: 10, color: 'var(--text4)', fontFamily: 'Courier New, monospace' }}>SEBI RA · INH000026266</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Link href="/services" style={{ padding: '7px 14px', background: 'rgba(0,200,150,0.07)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: 7, fontSize: 12, color: 'var(--emerald)', textDecoration: 'none', fontWeight: 500 }}>
                      View Services
                    </Link>
                    <Link href="/pricing" style={{ padding: '7px 14px', background: 'var(--emerald)', borderRadius: 7, fontSize: 12, color: '#031A13', textDecoration: 'none', fontWeight: 700 }}>
                      Subscribe
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Internal links */}
          <div style={{ marginTop: 40, padding: '28px 32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 14 }}>Related Pages</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[
                { href: '/services', label: 'All SEBI RA Services' },
                { href: '/services/intraday', label: 'Intraday Calls NSE' },
                { href: '/faq', label: 'SEBI RA FAQ' },
                { href: '/about', label: 'About Sahib Singh Hora' },
                { href: '/pricing', label: 'Subscription Plans' },
                { href: '/appointments', label: 'Book Advisory Session' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ padding: '8px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--text2)', textDecoration: 'none' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
