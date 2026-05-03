'use client'
import { useState, useEffect } from 'react'

const QUOTES = [
  "The market is a device for transferring money from the impatient to the patient.",
  "Plan the trade. Trade the plan.",
  "The trader who hesitates often misses — but the trader who plans never panics.",
  "Your biggest enemy in the market is the person in the mirror.",
  "Fall in love with the process. The results will follow.",
  "Cut losses short. Let profits run. Repeat.",
  "Getting in is easy. Knowing when to get out is the real skill.",
  "One bad trade doesn't define you. One bad habit does.",
  "Price is the only truth the market tells you.",
  "Emotion is the enemy of execution.",
  "Every candle tells a story. Learn to read it.",
  "Think about risk first, returns second — that's the professional mindset.",
  "Markets are never wrong — opinions often are.",
  "One bad day can erase a week of gains. Protect your capital first.",
  "The trend is your friend — until it ends.",
  "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.",
  "Size your positions so you can sleep at night — and think clearly in the morning.",
  "Consistency beats brilliance in the long run.",
  "Stop trying to predict. Start trying to respond.",
  "The goal is not to be right. The goal is to make money.",
  "Knowing when to skip a trade is a skill most traders never develop.",
  "Every loss is tuition paid at the market's university.",
  "Discipline is the bridge between goals and accomplishment.",
  "The market rewards preparation, not participation.",
  "The first loss is the best loss.",
  "Trade what you see, not what you think.",
  "No setup guarantees a win. Size accordingly.",
  "In trading, the more you work on your mind, the more money you make.",
  "Ignoring noise is a skill. Most traders never develop it.",
  "The market will be here tomorrow. Your capital must be too.",
  "Today's loss is tomorrow's lesson — if you're willing to learn.",
  "Setting a stop-loss is not weakness — it's the mark of a professional.",
  "The most important level on any chart is your stop-loss.",
  "When everyone is buying, ask why. When everyone is selling, ask why harder.",
  "Those who only read charts react. Those who understand structure anticipate.",
  "The market doesn't make you wrong — your own bias does.",
]

export function TradingQuote() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % QUOTES.length
  const quote = QUOTES[dayIndex]

  return (
    <p
      style={{
        fontFamily: 'Playfair Display, Georgia, serif',
        fontStyle: 'italic',
        fontSize: '14px',
        color: 'var(--text3)',
        lineHeight: 1.65,
        marginTop: '10px',
        maxWidth: '600px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
    >
      &ldquo;{quote}&rdquo;
    </p>
  )
}
