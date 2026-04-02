import { useNavigate } from '@redwoodjs/router'
import { useAuth, logOut } from 'src/auth'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()

  const handleLogout = async () => {
    await logOut()
    navigate('/login')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-800">Basketball Academy</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.profile?.firstName}!</h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold">{user?.email}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-lg font-semibold capitalize">{user?.role?.toLowerCase()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="text-lg font-semibold">
                {user?.profile?.firstName} {user?.profile?.lastName}
              </p>
            </div>
          </div>

          {user?.role === 'ADMIN' && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Admin Options</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                View Admin Panel
              </button>
            </div>
          )}

          {user?.role === 'COACH' && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Coach Options</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Manage Classes
              </button>
            </div>
          )}

          {(user?.role === 'PLAYER' || user?.role === 'PARENT') && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Enroll in Programs</h3>
              <p className="text-gray-600">View available programs and enroll today!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
