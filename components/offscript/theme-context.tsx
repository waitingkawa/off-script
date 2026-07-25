'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type GlobalTheme = 'light' | 'dark'

export interface ThemeOption {
  id: GlobalTheme
  label: string
  cnLabel: string
  colorDot: string
  bgPreview: string
  description: string
}

export const GLOBAL_THEMES: ThemeOption[] = [
  {
    id: 'light',
    label: 'Light Mode',
    cnLabel: '白天模式',
    colorDot: '#4e6b8e',
    bgPreview: '#e5eaf0',
    description: 'Muted blue daytime theme',
  },
  {
    id: 'dark',
    label: 'Dark Mode',
    cnLabel: '黑夜模式',
    colorDot: '#1e293b',
    bgPreview: '#0f172a',
    description: 'Dark slate nighttime theme',
  },
]

interface ThemeContextType {
  theme: GlobalTheme
  setTheme: (theme: GlobalTheme) => void
  themeInfo: ThemeOption
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  themeInfo: GLOBAL_THEMES[0],
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<GlobalTheme>('light')

  useEffect(() => {
    // Read stored preference if any
    const saved = localStorage.getItem('offscript-theme') as GlobalTheme
    if (saved && GLOBAL_THEMES.some((t) => t.id === saved)) {
      setTheme(saved)
    }
  }, [])

  const handleSetTheme = (newTheme: GlobalTheme) => {
    setTheme(newTheme)
    localStorage.setItem('offscript-theme', newTheme)
  }

  const themeInfo = GLOBAL_THEMES.find((t) => t.id === theme) || GLOBAL_THEMES[0]

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, themeInfo }}>
      <div data-theme={theme} className="contents">
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
