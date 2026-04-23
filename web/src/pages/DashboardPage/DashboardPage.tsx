import { useEffect } from 'react'

import { Link, navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import ThemeToggle from 'src/components/ThemeToggle/ThemeToggle'
import { useAppTheme } from 'src/providers/ThemeProvider'

const DashboardPage = () => {
  const {
    currentUser,
    loading: isLoading,
    logOut,
    isAuthenticated,
  } = useAuth()
  const { isDark } = useAppTheme()
  const headingClass = isDark ? 'text-slate-50' : 'text-gray-900'
  const mutedClass = isDark ? 'text-slate-400' : 'text-gray-600'
  const user = currentUser as
    | {
        email?: string
        role?: string
        profile?: {
          firstName?: string
          lastName?: string
        }
      }
    | null

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.dashboard(), { replace: true })
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    logOut()
    return navigate(routes.login(), { replace: true })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className={`text-xl ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <nav
        className={`shadow ${
          isDark ? 'border-b border-slate-800 bg-slate-950' : 'bg-white'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className={`text-2xl font-bold ${headingClass}`}>
              Basketball Academy
            </h1>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          className={`rounded-lg p-6 shadow ${
            isDark ? 'border border-slate-800 bg-slate-900' : 'bg-white'
          }`}
        >
          <h2 className={`mb-4 text-2xl font-bold ${headingClass}`}>
            Welcome, {user?.profile?.firstName}!
          </h2>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <div
              className={`rounded p-4 ${
                isDark ? 'bg-slate-800' : 'bg-gray-50'
              }`}
            >
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Email
              </p>
              <p className={`text-lg font-semibold ${headingClass}`}>
                {user?.email}
              </p>
            </div>
            <div
              className={`rounded p-4 ${
                isDark ? 'bg-slate-800' : 'bg-gray-50'
              }`}
            >
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Role
              </p>
              <p className={`text-lg font-semibold capitalize ${headingClass}`}>
                {user?.role?.toLowerCase()}
              </p>
            </div>
            <div
              className={`rounded p-4 ${
                isDark ? 'bg-slate-800' : 'bg-gray-50'
              }`}
            >
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Full Name
              </p>
              <p className={`text-lg font-semibold ${headingClass}`}>
                {user?.profile?.firstName} {user?.profile?.lastName}
              </p>
            </div>
          </div>

          {user?.role === 'ADMIN' && (
            <div className="mt-6">
              <h3 className={`mb-4 text-xl font-bold ${headingClass}`}>
                Admin Options
              </h3>
              <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                <Link to="/admin-panel">View Admin Panel</Link>
              </button>
            </div>
          )}

          {user?.role === 'COACH' && (
            <div className="mt-6">
              <h3 className={`mb-4 text-xl font-bold ${headingClass}`}>
                Coach Options
              </h3>
              <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                <Link to="/coach-page">Manage Classes</Link>
              </button>
            </div>
          )}

          {(user?.role === 'PLAYER' || user?.role === 'PARENT') && (
            <div className="mt-6">
              <h3 className={`mb-4 text-xl font-bold ${headingClass}`}>
                Enroll in Programs
              </h3>
              <p className={mutedClass}>
                View available programs and enroll today!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
