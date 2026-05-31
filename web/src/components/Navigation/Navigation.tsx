import { Link } from '@redwoodjs/router'

import ThemeToggle from 'src/components/ThemeToggle/ThemeToggle'
import { useSettings } from 'src/providers/SettingsProvider'
import { useAppTheme } from 'src/providers/ThemeProvider'

const Navigation = () => {
  const { isDark } = useAppTheme()
  const { getSetting, loading } = useSettings()

  const siteName = getSetting('site_name', '🏀 Basketball Academy')
  const siteLogo = getSetting('site_logo', '')

  const navClass = isDark
    ? 'sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 shadow-sm backdrop-blur'
    : 'sticky top-0 z-50 bg-white shadow-sm'

  if (loading) return null

  return (
    <nav className={navClass}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            {siteLogo} {siteName}
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              to="/programs"
              className={`font-medium hover:text-blue-600 ${
                isDark ? 'text-slate-200' : 'text-gray-700'
              }`}
            >
              Programs
            </Link>
            <Link
              to="/login"
              className={`font-medium hover:text-blue-600 ${
                isDark ? 'text-slate-200' : 'text-gray-700'
              }`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
