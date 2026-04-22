// api/src/services/auth/auth.ts
import type { QueryResolvers, MutationResolvers } from 'types/graphql'
import { v4 as uuid } from 'uuid'

import { hashPassword } from '@redwoodjs/auth-dbauth-api'

import { db } from 'src/lib/db'

// Constants
const ONE_HOUR_MS = 60 * 60 * 1000
const PASSWORD_STRENGTH_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/

export const me: QueryResolvers['me'] = (_obj, _args, { currentUser }) => {
  if (!currentUser) {
    throw new Error('Not authenticated')
  }

  return db.user.findUniqueOrThrow({
    where: { id: currentUser.id },
    select: {
      id: true,
      email: true,
      role: true,
    },
    // include: {
    //   role: true,
    //   profile: true,
    // },
  })
}

export const signup: MutationResolvers['signup'] = async (
  _obj,
  { email, password, firstName, lastName, role, dateOfBirth }
) => {
  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new Error('Email already registered')
    }

    // Validate password strength (min 8 chars, uppercase, lowercase, number)
    if (!PASSWORD_STRENGTH_REGEX.test(password)) {
      throw new Error(
        'Password must be at least 8 characters with uppercase, lowercase, and number'
      )
    }

    // Hash password using dbAuth utility
    const { hashedPassword, salt } = hashPassword(password)

    // Create user with profile
    const user = await db.user.create({
      data: {
        email,
        hashedPassword,
        salt,
        role,
        profile: {
          create: {
            firstName,
            lastName,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          },
        },
      },
      include: {
        profile: true,
      },
    })

    return { user }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Signup failed')
  }
}

export const forgotPassword: MutationResolvers['forgotPassword'] = async (
  _obj,
  { email }
) => {
  try {
    const user = await db.user.findUnique({ where: { email } })

    if (!user) {
      // Return true regardless (security: don't expose email existence)
      return true
    }

    // Generate reset token that expires in 1 hour
    const resetToken = uuid()
    const resetTokenExpiresAt = new Date(Date.now() + ONE_HOUR_MS)

    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiresAt,
      },
    })

    // TODO: Send email with reset link
    // For now, log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Reset password link: http://localhost:3000/reset-password?token=${resetToken}`
      )
    }

    return true
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Forgot password failed')
  }
}

export const resetPassword: MutationResolvers['resetPassword'] = async (
  _obj,
  { resetToken, password }
) => {
  try {
    const user = await db.user.findFirst({
      where: {
        resetToken,
        resetTokenExpiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      throw new Error('Reset token is invalid or expired')
    }

    // Validate password strength
    if (!PASSWORD_STRENGTH_REGEX.test(password)) {
      throw new Error(
        'Password must be at least 8 characters with uppercase, lowercase, and number'
      )
    }

    // Hash new password
    const { hashedPassword, salt } = hashPassword(password)

    // Update user and clear reset token
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        hashedPassword,
        salt,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
      include: {
        profile: true,
      },
    })

    return { user: updatedUser }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Reset password failed')
  }
}

export const logout: MutationResolvers['logout'] = () => {
  // dbAuth handles session clearing on client
  return true
}
