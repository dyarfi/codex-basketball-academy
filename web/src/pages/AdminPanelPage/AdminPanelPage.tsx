import { navigate, Link, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

const AdminPanelPage = () => {
  const { currentUser, loading, logOut } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Access Denied
          </h1>
          <p className="mb-4 text-gray-600">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await logOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-bold">User Management</h3>
            <p className="mb-4 text-gray-600">Manage users and their roles</p>
            <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              View Users
            </button>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-bold">Program Management</h3>
            <p className="mb-4 text-gray-600">Create and manage programs</p>
            <Link to={routes.programs()}>
              <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Manage Programs
              </button>
            </Link>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-bold">Class Management</h3>
            <p className="mb-4 text-gray-600">Create and manage classes</p>
            <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Manage Classes
            </button>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-bold">Reports</h3>
            <p className="mb-4 text-gray-600">View analytics and reports</p>
            <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              View Reports
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminPanelPage
