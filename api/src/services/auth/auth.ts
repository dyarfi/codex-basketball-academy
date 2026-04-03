// api/src/services/auth/auth.ts
import type { QueryResolvers, MutationResolvers } from 'types/graphql'
import { db } from 'src/lib/db'
import { hashPassword } from '@redwoodjs/auth-dbauth-api'
import { v4 as uuid } from 'uuid'

export const me: QueryResolvers['me'] = (_obj, _args, { currentUser }) => {
  if (!currentUser) {
    throw new Error('Not authenticated')
  }

  return db.user.findUnique({
    where: { id: currentUser.id },
    include: {
      profile: true,
    },
  })
}

export const signup: MutationResolvers['signup'] = async (
  _obj,
  { email, password, firstName, lastName, role, dateOfBirth }
) => {
  // Check if user already exists
  const existingUser = await db.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new Error('Email already registered')
  }

  // Validate password strength (min 8 chars, uppercase, lowercase, number)
  if (
    password.length < 8 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
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
}

export const forgotPassword: MutationResolvers['forgotPassword'] = async (
  _obj,
  { email }
) => {
  const user = await db.user.findUnique({ where: { email } })

  if (!user) {
    // Return true regardless (security: don't expose email existence)
    return true
  }

  // Generate reset token that expires in 1 hour
  const resetToken = uuid()
  const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000)

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
}

export const resetPassword: MutationResolvers['resetPassword'] = async (
  _obj,
  { resetToken, password }
) => {
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
  if (
    password.length < 8 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
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
}

export const logout: MutationResolvers['logout'] = () => {
  // dbAuth handles session clearing on client
  return true
}
