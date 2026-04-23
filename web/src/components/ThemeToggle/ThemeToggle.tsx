import { ActionIcon, Tooltip } from '@mantine/core'
import { Moon, Sun } from '@phosphor-icons/react'

import { useAppTheme } from 'src/providers/ThemeProvider'

interface ThemeToggleProps {
  className?: string
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { isDark, toggleColorScheme } = useAppTheme()

  return (
    <Tooltip
      label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      position="bottom"
    >
      <ActionIcon
        variant="subtle"
        onClick={toggleColorScheme}
        aria-label="Toggle color scheme"
        className={className}
        style={{
          color: isDark ? 'var(--mantine-color-yellow-4)' : 'var(--mantine-color-blue-6)',
        }}
      >
        {isDark ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
      </ActionIcon>
    </Tooltip>
  )
}

export default ThemeToggle
