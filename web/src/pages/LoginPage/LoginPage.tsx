import { useState, useEffect } from 'react'

import { Link, navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import ThemeToggle from 'src/components/ThemeToggle/ThemeToggle'
import { useSettings } from 'src/providers/SettingsProvider'
import { useAppTheme } from 'src/providers/ThemeProvider'

const LoginPage = () => {
  const {
    isAuthenticated,
    logIn,
    loading: authLoading,
    currentUser,
  } = useAuth()
  const { isDark } = useAppTheme()
  const { getSetting, loading } = useSettings()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const siteName = getSetting('site_name', 'BC Academy')
  const siteLogo = getSetting('site_logo', '')
  // console.log({ isAuthenticated })
  // console.log({ currentUser })

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.dashboard(), { replace: true })
    }
  }, [isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const response = await logIn({
        username: email,
        password: password,
      })
      if (response.error) {
        setError(response.error)
      } else {
        navigate(routes.dashboard())
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const isLoading = authLoading || submitting

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="mb-4 flex justify-end">
            <ThemeToggle />
          </div>
          {!loading && (
            <h3
              className={`mt-6 text-center text-4xl font-extrabold tracking-tight ${
                isDark ? 'text-slate-50' : 'text-gray-700'
              }`}
            >
              <Link to="/">
                {siteLogo} {siteName}
              </Link>
            </h3>
          )}
          <p
            className={`mt-2 text-center text-sm ${
              isDark ? 'text-slate-400' : 'text-gray-600'
            }`}
          >
            Admin Portal Access
          </p>
        </div>

        <form
          className={`mt-8 space-y-6 rounded-xl p-8 shadow-lg ${
            isDark
              ? 'border border-slate-800 bg-slate-900'
              : 'border border-gray-100 bg-white'
          }`}
          onSubmit={handleSubmit}
        >
          {error && (
            <div
              className={`rounded-md border p-4 ${
                isDark
                  ? 'border-red-900 bg-red-950/40'
                  : 'border-red-100 bg-red-50'
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  isDark ? 'text-red-300' : 'text-red-800'
                }`}
              >
                {error}
              </p>
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label
                htmlFor="email"
                className={`mb-1 block text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={`relative block w-full appearance-none rounded-lg border px-3 py-2 placeholder-gray-500 transition-all focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm ${
                  isDark
                    ? 'border-slate-700 bg-slate-950 text-slate-100'
                    : 'border-gray-300 text-gray-900'
                }`}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className={`mb-1 block text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className={`relative block w-full appearance-none rounded-lg border px-3 py-2 placeholder-gray-500 transition-all focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${
                  isDark
                    ? 'border-slate-700 bg-slate-950 text-slate-100'
                    : 'border-gray-300 text-gray-900'
                }`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember-me"
                className={`ml-2 block cursor-pointer text-sm ${
                  isDark ? 'text-slate-100' : 'text-gray-900'
                }`}
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                title="Forgot Password"
                className="font-medium text-blue-600 transition-colors hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <svg
                  className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Signing in...</span>
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
