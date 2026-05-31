import { useState } from 'react'

import { Link, navigate } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

type Enrollment = {
  id: string
  programName: string
  className: string
  level: string
  enrollmentDate: string
  status: string
}

type Certificate = {
  id: string
  title: string
  programName: string
  achievementDate: string
  pdfUrl?: string
}

type Payment = {
  id: string
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  date: string
  description: string
}

const UserProfilePage = () => {
  const { currentUser } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [editFormData, setEditFormData] = useState({
    firstName: currentUser?.profile?.firstName || '',
    lastName: currentUser?.profile?.lastName || '',
    email: currentUser?.email || '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })

  // Mock data
  const enrollments: Enrollment[] = [
    {
      id: '1',
      programName: 'Fundamentals 101',
      className: 'Monday & Wednesday - 10:00 AM',
      level: 'BEGINNER',
      enrollmentDate: '2026-04-15',
      status: 'ACTIVE',
    },
    {
      id: '2',
      programName: 'Intermediate Skills',
      className: 'Tuesday & Thursday - 4:00 PM',
      level: 'INTERMEDIATE',
      enrollmentDate: '2026-03-01',
      status: 'ACTIVE',
    },
  ]

  const certificates: Certificate[] = [
    {
      id: '1',
      title: 'Basketball Fundamentals Completion',
      programName: 'Fundamentals 101',
      achievementDate: '2025-12-15',
      pdfUrl: '#',
    },
  ]

  const payments: Payment[] = [
    {
      id: '1',
      amount: 49.99,
      status: 'COMPLETED',
      date: '2026-04-01',
      description: 'Fundamentals 101 - April Payment',
    },
    {
      id: '2',
      amount: 79.99,
      status: 'COMPLETED',
      date: '2026-04-01',
      description: 'Intermediate Skills - April Payment',
    },
    {
      id: '3',
      amount: 49.99,
      status: 'PENDING',
      date: '2026-05-01',
      description: 'Fundamentals 101 - May Payment',
    },
  ]

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                🏀 Basketball Academy
              </Link>
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="font-medium text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Please Log In
          </h1>
          <p className="mb-6 text-gray-600">
            You need to be logged in to view your profile.
          </p>
          <Link
            to="/login"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditFormData({ ...editFormData, [name]: value })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(true)
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false)
      setShowEditModal(false)
    }, 1000)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    setIsEditing(true)
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false)
      setShowPasswordModal(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      alert('Password updated successfully')
    }, 1000)
  }

  const handleLogout = async () => {
    // await logOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              🏀 Basketball Academy
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/programs"
                className="font-medium text-gray-700 hover:text-blue-600"
              >
                Programs
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Profile Header */}
        <div className="mb-8 rounded-lg bg-white p-8 shadow">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="text-6xl">👤</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentUser?.profile?.firstName}{' '}
                  {currentUser?.profile?.lastName}
                </h1>
                <p className="text-gray-600">Role: {currentUser?.role}</p>
                <p className="text-gray-600">Email: {currentUser?.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="rounded-lg border-2 border-blue-600 px-6 py-2 font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar - Quick Stats */}
          <div className="lg:col-span-1">
            <div className="space-y-6 rounded-lg bg-white p-6 shadow">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {enrollments.length}
                </div>
                <p className="mt-1 text-sm text-gray-600">Active Classes</p>
              </div>
              <div className="border-t" />
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">
                  {certificates.length}
                </div>
                <p className="mt-1 text-sm text-gray-600">Certificates</p>
              </div>
              <div className="border-t" />
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600">
                  $
                  {payments
                    .filter((p) => p.status === 'COMPLETED')
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toFixed(2)}
                </div>
                <p className="mt-1 text-sm text-gray-600">Total Paid</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8 lg:col-span-3">
            {/* Enrolled Programs */}
            <section className="rounded-lg bg-white p-8 shadow">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Enrolled Programs
              </h2>

              {enrollments.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="mb-4 text-gray-600">
                    You are not enrolled in any programs yet.
                  </p>
                  <Link
                    to="/programs"
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    Browse Programs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="rounded-lg border border-gray-200 p-6 transition hover:border-blue-400"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {enrollment.programName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {enrollment.className}
                          </p>
                        </div>
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                          {enrollment.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Level: {enrollment.level}</span>
                        <span>Enrolled: {enrollment.enrollmentDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Certificates */}
            <section className="rounded-lg bg-white p-8 shadow">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Certificates
              </h2>

              {certificates.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-600">
                    No certificates yet. Complete programs to earn certificates!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6"
                    >
                      <div className="mb-4 text-3xl">📜</div>
                      <h3 className="mb-2 font-bold text-gray-900">
                        {cert.title}
                      </h3>
                      <p className="mb-4 text-sm text-gray-600">
                        {cert.programName}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          Achieved: {cert.achievementDate}
                        </span>
                        <a
                          href={cert.pdfUrl}
                          className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-700"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Payment History */}
            <section className="rounded-lg bg-white p-8 shadow">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Payment History
              </h2>

              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {payment.description}
                      </p>
                      <p className="text-sm text-gray-600">{payment.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          payment.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Edit Profile
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editFormData.firstName}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editFormData.lastName}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editFormData.phoneNumber}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={editFormData.city}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={editFormData.state}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isEditing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Change Password
            </h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isEditing ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfilePage
