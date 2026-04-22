import { useEffect } from 'react'

import { Link, navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

const DashboardPage = () => {
  const {
    currentUser = '',
    loading: isLoading,
    logOut,
    isAuthenticated,
  } = useAuth()

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
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Basketball Academy
            </h1>
            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">
            Welcome, {currentUser?.profile?.firstName}!
          </h2>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold">{currentUser?.email}</p>
            </div>
            <div className="rounded bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-lg font-semibold capitalize">
                {currentUser?.role?.toLowerCase()}
              </p>
            </div>
            <div className="rounded bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="text-lg font-semibold">
                {currentUser?.profile?.firstName}{' '}
                {currentUser?.profile?.lastName}
              </p>
            </div>
          </div>

          {currentUser?.role === 'ADMIN' && (
            <div className="mt-6">
              <h3 className="mb-4 text-xl font-bold">Admin Options</h3>
              <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                <Link to="/admin-panel">View Admin Panel</Link>
              </button>
            </div>
          )}

          {currentUser?.role === 'COACH' && (
            <div className="mt-6">
              <h3 className="mb-4 text-xl font-bold">Coach Options</h3>
              <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                <Link to="/coach-page">Manage Classes</Link>
              </button>
            </div>
          )}

          {(currentUser?.role === 'PLAYER' ||
            currentUser?.role === 'PARENT') && (
            <div className="mt-6">
              <h3 className="mb-4 text-xl font-bold">Enroll in Programs</h3>
              <p className="text-gray-600">
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
