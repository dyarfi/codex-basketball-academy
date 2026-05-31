import { useEffect } from 'react'

import { navigate } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

interface RequireRoleProps {
  children: React.ReactNode
  roles: string | string[]
}

const RequireRole = ({ children, roles }: RequireRoleProps) => {
  const { currentUser, loading: isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        navigate('/')
      } else {
        const allowedRoles = Array.isArray(roles) ? roles : [roles]
        // if (!allowedRoles.includes(currentUser.role)) {
        //   navigate('/dashboard')
        // }
        if (!allowedRoles.includes(currentUser.role)) {
          navigate('/')
        }
      }
    }
  }, [currentUser, isLoading, roles, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  if (!allowedRoles.includes(currentUser.role)) {
    return null
  }

  return <>{children}</>
}

export default RequireRole
