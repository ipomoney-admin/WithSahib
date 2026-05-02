'use client'
import { useState, useEffect } from 'react'

const QUOTES = [
  "The market is a device for transferring money from the impatient to the patient.",
  "Plan the trade. Trade the plan.",
  "Jo darr gaya, samjho mar gaya — but in trading, jo ruka, wahi jita.",
  "Your biggest enemy in the market is the person in the mirror.",
  "Process se pyaar karo, result apne aap aayega.",
  "Cut losses short. Let profits run. Repeat.",
  "Market mein entry easy hai, exit ka discipline sikhna padta hai.",
  "One bad trade doesn't define you. One bad habit does.",
  "Price is the only truth the market tells you.",
  "Emotion is the enemy of execution.",
  "Jo dikh raha hai woh sach hai — chart kabhi jhooth nahi bolta.",
  "Risk pehle socho, reward baad mein.",
  "Markets are never wrong — opinions often are.",
  "Ek loss se mat ghabrao. Pattern se darr lagana chahiye.",
  "The trend is your friend — until it ends.",
  "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.",
  "Apni trade ki size utni rakho jitni ki neend na udey.",
  "Consistency beats brilliance in the long run.",
  "Stop trying to predict. Start trying to respond.",
  "The goal is not to be right. The goal is to make money.",
  "Jo trade samajh mein nahi aata, usse skip karna bhi ek skill hai.",
  "Every loss is tuition paid at the market's university.",
  "Discipline is the bridge between goals and accomplishment.",
  "Market aapko opportunity deta hai — preparation aapki zimmedari hai.",
  "The first loss is the best loss.",
  "Trade what you see, not what you think.",
  "Koi bhi setup 100% guarantee nahi deta. Position size karo accordingly.",
  "In trading, the more you work on your mind, the more money you make.",
  "Sahi time pe baahar nikalna, andar jaane se zyada important hai.",
  "The market will be here tomorrow. Your capital must be too.",
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
