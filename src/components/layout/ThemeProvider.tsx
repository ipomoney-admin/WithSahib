'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('withsahib-theme') as Theme | null
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    const resolved = stored ?? preferred
    setThemeState(resolved)
    applyTheme(resolved)
    setMounted(true)
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
      meta.setAttribute('content', t === 'dark' ? '#06090F' : '#F0F4FA')
    }
  }

  function setTheme(t: Theme) {
    setThemeState(t)
    applyTheme(t)
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }} suppressHydrationWarning>
        {children}
      </div>
    )
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
