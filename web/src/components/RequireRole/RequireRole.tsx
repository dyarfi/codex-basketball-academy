import { useEffect } from 'react'
import { useNavigate } from '@redwoodjs/router'
import { useAuth } from 'src/auth'

interface RequireRoleProps {
  children: React.ReactNode
  roles: string | string[]
}

const RequireRole = ({ children, roles }: RequireRoleProps) => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login')
      } else {
        const allowedRoles = Array.isArray(roles) ? roles : [roles]
        if (!allowedRoles.includes(user.role)) {
          navigate('/dashboard')
        }
      }
    }
  }, [user, isLoading, roles, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  if (!allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}

export default RequireRole
