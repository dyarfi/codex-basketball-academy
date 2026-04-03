// web/src/contexts/AuthContext.tsx
import { createContext } from 'react'

export type User = {
  id: string
  email: string
  role: 'ADMIN' | 'COACH' | 'PLAYER' | 'PARENT' | 'PROSPECT'
  isActive: boolean
  createdAt: string
  updatedAt: string
  profile?: {
    firstName: string
    lastName: string
    dateOfBirth?: string
  }
}

export type AuthContextType = {
  user: User | null
  isLoading: boolean
  isError: string | null
  isAuthenticated: boolean
  hasRole: (roles: string | string[]) => boolean
  checkRole: (roles: string | string[]) => boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
)

export const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: true,
  isError: null,
  isAuthenticated: false,
  hasRole: () => false,
  checkRole: () => false,
}
