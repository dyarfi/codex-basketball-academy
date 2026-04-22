// web/src/components/RoleRoute.tsx
import { useEffect } from 'react'

import { navigate, routes } from '@redwoodjs/router'

import { useAuth } from '../auth'

interface RoleRouteProps {
  requiredRoles: string | string[]
  children: React.ReactNode
}

export const RoleRoute: React.FC<RoleRouteProps> = ({
  requiredRoles,
  children,
}) => {
  const { hasRole, loading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated && !hasRole(requiredRoles)) {
      navigate(routes.dashboard())
    }
  }, [loading, isAuthenticated, requiredRoles, hasRole])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !hasRole(requiredRoles)) {
    return null
  }

  return <>{children}</>
}
