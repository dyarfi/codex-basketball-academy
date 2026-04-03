// web/src/components/RoleRoute.tsx
import { useAuth } from 'src/providers/AuthProvider'
import { navigate } from '@redwoodjs/router'
import { useEffect } from 'react'

interface RoleRouteProps {
  requiredRoles: string | string[]
  children: React.ReactNode
}

export const RoleRoute: React.FC<RoleRouteProps> = ({
  requiredRoles,
  children,
}) => {
  const { hasRole, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRole(requiredRoles)) {
      navigate('/dashboard')
    }
  }, [isLoading, isAuthenticated, requiredRoles, hasRole])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !hasRole(requiredRoles)) {
    return null
  }

  return <>{children}</>
}
