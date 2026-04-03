// web/src/providers/AuthProvider.tsx
import { useContext, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import {
  AuthContext,
  defaultAuthContext,
  type AuthContextType,
  type User,
} from 'src/contexts/AuthContext'
import { GET_CURRENT_USER } from 'src/graphql/queries'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthContextType>(
    defaultAuthContext
  )

  const [getCurrentUser] = useLazyQuery(GET_CURRENT_USER, {
    fetchPolicy: 'no-cache',
  })

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await getCurrentUser()

        if (error || !data?.me) {
          setAuthState({
            user: null,
            isLoading: false,
            isError: error?.message || null,
            isAuthenticated: false,
            hasRole: () => false,
            checkRole: () => false,
          })
        } else {
          const user = data.me as User
          setAuthState({
            user,
            isLoading: false,
            isError: null,
            isAuthenticated: true,
            hasRole: (roles) => checkUserRole(user, roles),
            checkRole: (roles) => checkUserRole(user, roles),
          })
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Authentication check failed'
        setAuthState({
          user: null,
          isLoading: false,
          isError: errorMessage,
          isAuthenticated: false,
          hasRole: () => false,
          checkRole: () => false,
        })
      }
    }

    checkAuth()
  }, [getCurrentUser])

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  )
}

// Helper function to check if user has required role(s)
const checkUserRole = (
  user: User | null,
  roles: string | string[]
): boolean => {
  if (!user) return false

  const rolesToCheck = Array.isArray(roles) ? roles : [roles]
  return rolesToCheck.includes(user.role)
}

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook to get authenticated user (throws if not authenticated)
export const useAuthenticatedUser = (): User => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    throw new Error('useAuthenticatedUser must be used in authenticated context')
  }

  return user
}
