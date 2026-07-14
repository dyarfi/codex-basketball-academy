import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'

import { useLocalStorage } from '@mantine/hooks'

export type AppColorScheme = 'light' | 'dark'

interface ThemeContextValue {
  colorScheme: AppColorScheme
  isDark: boolean
  toggleColorScheme: () => void
  setColorScheme: (value: AppColorScheme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const COLOR_SCHEME_STORAGE_KEY = 'basketball-academy-color-scheme'

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [colorScheme, setColorScheme] = useLocalStorage<AppColorScheme>({
    key: COLOR_SCHEME_STORAGE_KEY,
    defaultValue: 'light',
  })

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorScheme,
      isDark: colorScheme === 'dark',
      toggleColorScheme: () =>
        setColorScheme((current) => (current === 'dark' ? 'light' : 'dark')),
      setColorScheme,
    }),
    [colorScheme, setColorScheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useAppTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider')
  }

  return context
}
