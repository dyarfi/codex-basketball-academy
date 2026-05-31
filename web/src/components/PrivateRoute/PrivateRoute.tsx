import { useEffect } from 'react'

import { navigate } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { currentUser, loading } = useAuth()

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login')
    }
  }, [currentUser, loading, navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return <>{children}</>
}

export default PrivateRoute
