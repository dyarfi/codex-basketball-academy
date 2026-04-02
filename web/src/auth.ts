import { useEffect, useState, useCallback } from 'react'

export type User = {
  id: string
  email: string
  role: 'ADMIN' | 'COACH' | 'PLAYER' | 'PARENT' | 'PROSPECT'
  profile?: {
    firstName: string
    lastName: string
    dateOfBirth?: string
  }
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isError: boolean
}

// Simple in-memory user store (for demo purposes - should use a real backend)
const mockUsers: Record<string, User & { password: string }> = {
  'admin@basketball.com': {
    id: 'admin-1',
    email: 'admin@basketball.com',
    password: 'Admin@123',
    role: 'ADMIN',
    profile: {
      firstName: 'Admin',
      lastName: 'User',
    },
  },
}

const useAuth = () => {
  const [auth, setAuth] = useState<AuthContextType>({
    user: null,
    isLoading: true,
    isError: false,
  })

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem('auth_user')
        if (userStr) {
          const user = JSON.parse(userStr)
          setAuth({ user, isLoading: false, isError: false })
        } else {
          setAuth({ user: null, isLoading: false, isError: false })
        }
      } catch (error) {
        setAuth({ user: null, isLoading: false, isError: true })
      }
    }

    checkAuth()
  }, [])

  return auth
}

export const logIn = async (
  email: string,
  password: string
): Promise<{ error?: string; user?: User }> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockUser = mockUsers[email]

    if (!mockUser || mockUser.password !== password) {
      return { error: 'Invalid email or password' }
    }

    const user: User = {
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
      profile: mockUser.profile,
    }

    localStorage.setItem('auth_user', JSON.stringify(user))
    return { user }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export const logOut = async (): Promise<void> => {
  try {
    localStorage.removeItem('auth_user')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

export const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: string,
  dateOfBirth?: string
): Promise<{ error?: string }> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if user already exists
    if (mockUsers[email]) {
      return { error: 'Email already registered' }
    }

    // In a real app, this would call an API endpoint to create the user in the database
    // For now, we'll just store it in mockUsers
    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      email,
      password,
      role: role as 'ADMIN' | 'COACH' | 'PLAYER' | 'PARENT' | 'PROSPECT',
      profile: {
        firstName,
        lastName,
        dateOfBirth,
      },
    }

    mockUsers[email] = newUser

    return {}
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export const forgotPassword = async (email: string): Promise<{ error?: string }> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, this would send a password reset email
    // For now, we'll just return success
    return {}
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export const resetPassword = async (
  token: string,
  password: string
): Promise<{ error?: string }> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, this would verify the token and update the password
    return {}
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export { useAuth }

