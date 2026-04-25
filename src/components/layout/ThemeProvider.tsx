'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    const saved = localStorage.getItem('withsahib-theme')
    setTheme((saved as Theme) || 'light')
  }, [])

  function applyTheme(t: Theme) {
    const html = document.documentElement
    html.classList.remove('dark', 'light')
    html.classList.add(t)
    html.setAttribute('data-theme', t)
    localStorage.setItem('withsahib-theme', t)
    // Update mobile status bar
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', t === 'dark' ? '#080D0A' : '#F5F4F0')
    }
  }

  function setTheme(t: Theme) {
    setThemeState(t)
    applyTheme(t)
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
