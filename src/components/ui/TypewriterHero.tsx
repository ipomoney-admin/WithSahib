'use client'

import { useEffect, useState } from 'react'

const PHRASES = [
  'Before the Market Opens.',
  'Built on Research, Not Tips.',
  'With Defined Risk. Always.',
  'By a SEBI Registered Analyst.',
  'For Traders Who Plan Ahead.',
]

const TYPE_DELAY = 60
const DELETE_DELAY = 30
const PAUSE_AFTER_TYPE = 2000
const PAUSE_AFTER_DELETE = 400

export function TypewriterHero() {
  const [displayText, setDisplayText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setShowCursor((v) => !v), 500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const phrase = PHRASES[phraseIndex] ?? ''

    if (isTyping) {
      if (displayText.length < phrase.length) {
        const t = setTimeout(
          () => setDisplayText(phrase.slice(0, displayText.length + 1)),
          TYPE_DELAY,
        )
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setIsTyping(false), PAUSE_AFTER_TYPE)
      return () => clearTimeout(t)
    }

    if (displayText.length > 0) {
      const t = setTimeout(
        () => setDisplayText(displayText.slice(0, -1)),
        DELETE_DELAY,
      )
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setPhraseIndex((i) => (i + 1) % PHRASES.length)
      setIsTyping(true)
    }, PAUSE_AFTER_DELETE)
    return () => clearTimeout(t)
  }, [displayText, phraseIndex, isTyping])

  return (
    <h1
      className="animate-fade-up-1"
      style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(40px, 5.2vw, 70px)',
        fontWeight: 700,
        lineHeight: 1.05,
        color: 'var(--text)',
        marginBottom: '24px',
        letterSpacing: '-0.02em',
      }}
    >
      Structured Trade Ideas.
      <br />
      <em
        style={{
          display: 'inline-block',
          fontStyle: 'italic',
          fontWeight: 700,
          color: 'var(--orange)',
          minHeight: '1.1em',
        }}
      >
        {displayText}
        <span
          style={{
            display: 'inline-block',
            width: '3px',
            height: '0.85em',
            background: 'var(--orange)',
            marginLeft: '3px',
            verticalAlign: 'middle',
            borderRadius: '1px',
            opacity: showCursor ? 1 : 0,
          }}
        />
      </em>
    </h1>
  )
}
