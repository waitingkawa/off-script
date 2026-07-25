'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type GlobalTheme =
  | 'warm-sand'
  | 'terracotta'
  | 'cool-gray'
  | 'muted-blue'
  | 'sage'
  | 'dark-slate'

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
    id: 'warm-sand',
    label: 'Warm Sand',
    cnLabel: '暖沙',
    colorDot: '#a68b6d',
    bgPreview: '#f2f0ea',
    description: 'Calm, organic warm beige tone',
  },
  {
    id: 'terracotta',
    label: 'Terracotta',
    cnLabel: '冷淡红',
    colorDot: '#b56d56',
    bgPreview: '#f0e8e6',
    description: 'Low-saturation clay & earth tone',
  },
  {
    id: 'cool-gray',
    label: 'Cool Gray',
    cnLabel: '冷淡灰',
    colorDot: '#626673',
    bgPreview: '#e9ebed',
    description: 'Subtle slate & cool monochrome tone',
  },
  {
    id: 'muted-blue',
    label: 'Muted Blue',
    cnLabel: '冷淡蓝',
    colorDot: '#4e6b8e',
    bgPreview: '#e5eaf0',
    description: 'Nordic steel blue & fog tone',
  },
  {
    id: 'sage',
    label: 'Muted Sage',
    cnLabel: '冷淡绿',
    colorDot: '#527050',
    bgPreview: '#e4e9e2',
    description: 'Quiet eucalyptus & moss green tone',
  },
  {
    id: 'dark-slate',
    label: 'Dark Slate',
    cnLabel: '夜间深冷',
    colorDot: '#d88268',
    bgPreview: '#191b1f',
    description: 'Focus night mode for low light',
  },
]

interface ThemeContextType {
  theme: GlobalTheme
  setTheme: (theme: GlobalTheme) => void
  themeInfo: ThemeOption
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'warm-sand',
  setTheme: () => {},
  themeInfo: GLOBAL_THEMES[0],
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<GlobalTheme>('warm-sand')

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
