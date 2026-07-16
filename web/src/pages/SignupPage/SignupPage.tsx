import { useState, useEffect } from 'react'

import { Group, Loader, Container } from '@mantine/core'

import { Link, navigate, useParams } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import Footer from 'src/components/Footer/Footer'
import BlankLayout from 'src/layouts/BlankLayout'
import { useSettings } from 'src/providers/SettingsProvider'

const SignupPage = () => {
  const { isAuthenticated, loading: isLoading, signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const { getSetting, loading: settingsLoading } = useSettings()
  const { invite: codeInvite } = useParams()
  const enableSignUpInvite: boolean =
    getSetting('enable_signup_invite', 'true') === 'true' ? true : false
  const siteName: string = getSetting('site_name', 'Basketball Academy')
  const siteLogo: string = getSetting('site_logo', '')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    gender: '',
    role: 'PROSPECT' as const,
    dateOfBirth: '',
  })
  const [error, setError] = useState('')

  // const [signup, { loading }] = useMutation(SIGNUP_MUTATION, {
  //   onCompleted: () => {
  //     navigate('/dashboard')
  //   },
  //   onError: (err) => {
  //     setError(err.message || 'Signup failed')
  //   },
  // })

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, isLoading])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.gender
    ) {
      setError('All fields are required')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (
      formData.password.length < 8 ||
      !/[a-z]/.test(formData.password) ||
      !/[A-Z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password)
    ) {
      setError(
        'Password must be at least 8 characters with uppercase, lowercase, and number'
      )
      return
    }
    try {
      setLoading(true)
      const response = await signUp({
        username: formData.email,
        password: formData.password,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender || null,
        role: formData.role,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString()
          : null,
      })
      if (response.message) {
        toast.success(response.message)
      } else if (response.error) {
        toast.error(response.error)
      } else {
        // user is signed in automatically
        toast.success('Welcome!')
      }
      setLoading(false)
    } catch (err: any) {
      toast.error(err.message || 'Signup failed')
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Container
        size="xl"
        py={{ base: 'sm', sm: 'md', md: 'xl' }}
        px={{ base: 'xs', sm: 'md' }}
      >
        <Group justify="center">
          <Loader size="sm" />
        </Group>
      </Container>
    )
  }

  if (!enableSignUpInvite && !codeInvite) {
    return navigate('/')
  }

  return (
    <BlankLayout
      metaTags={{
        title: 'Programs of our Basketball Academy Website',
        description: 'Basketball Academy in your town',
      }}
    >
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create Account
            </h2>
            <p className="mt-2 text-center">
              <Link
                to="/"
                className="font-bold text-blue-600 hover:text-blue-500"
              >
                {siteLogo} {siteName}
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  disabled={settingsLoading}
                  id="firstName"
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  disabled={settingsLoading}
                  id="lastName"
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  disabled={settingsLoading}
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth (Optional)
                </label>
                <input
                  disabled={settingsLoading}
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Gender
                </div>
                <div className="inline-flex">
                  <label htmlFor="gender[Male]" className={'mr-2'}>
                    <input
                      disabled={settingsLoading}
                      id="gender[Male]"
                      name="gender"
                      type="radio"
                      required
                      value={'Male'}
                      onChange={handleChange}
                      className={'mr-1'}
                    />
                    Male
                  </label>
                  <label htmlFor="gender[Female]">
                    <input
                      disabled={settingsLoading}
                      id="gender[Female]"
                      name="gender"
                      type="radio"
                      required
                      value={'Female'}
                      onChange={handleChange}
                      className={'mr-1'}
                    />
                    Female
                  </label>
                </div>
              </div>

              {/* <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="PLAYER">Player</option>
                <option value="PARENT">Parent</option>
                <option value="COACH">Coach</option>
                <option value="PROSPECT">Prospect</option>
              </select>
            </div> */}

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  disabled={settingsLoading}
                  id="password"
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  disabled={settingsLoading}
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <p className="text-xs text-gray-500">
                Password must be at least 8 characters with uppercase,
                lowercase, and numbers.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || settingsLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </form>
          <Footer type="social" />
        </div>
      </div>
    </BlankLayout>
  )
}

export default SignupPage
