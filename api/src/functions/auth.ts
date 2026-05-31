import type { APIGatewayProxyEvent, Context } from 'aws-lambda'

import { DbAuthHandler } from '@redwoodjs/auth-dbauth-api'
import type { DbAuthHandlerOptions, UserType } from '@redwoodjs/auth-dbauth-api'
import type { Role } from '@prisma/client'

import { cookieName } from '../lib/auth'
import { db } from '../lib/db'

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  const forgotPasswordOptions: DbAuthHandlerOptions['forgotPassword'] = {
    handler: (user) => user,
    expires: 60 * 60 * 24,
    errors: {
      usernameNotFound: 'Email not found',
      usernameRequired: 'Email is required',
    },
  }

  const loginOptions: DbAuthHandlerOptions['login'] = {
    handler: (user) => {
      if (!user.isActive) {
        throw new Error('Please activate your account first!')
      } else {
        return user
      }
    },
    errors: {
      usernameOrPasswordMissing: 'Email and password are required',
      usernameNotFound: 'Email ${username} not found',
      incorrectPassword: 'Incorrect password for ${username}',
    },
    expires: 60 * 60 * 24 * 30,
  }

  const resetPasswordOptions: DbAuthHandlerOptions['resetPassword'] = {
    handler: () => true,
    allowReusedPassword: true,
    errors: {
      resetTokenExpired: 'resetToken is expired',
      resetTokenInvalid: 'resetToken is invalid',
      resetTokenRequired: 'resetToken is required',
      reusedPassword: 'Must choose a new password',
    },
  }

  interface UserAttributes {
    email?: string
    username: string
    firstName?: string
    lastName?: string
    role?: Role
    roles?: string
    dateOfBirth?: string | null
    profile?: {
      firstName?: string
      lastName?: string
      role?: Role
      dateOfBirth?: string | null
    }
  }

  const signupOptions: DbAuthHandlerOptions<
    UserType,
    UserAttributes
  >['signup'] = {
    handler: ({ username, hashedPassword, salt, userAttributes }) => {
      // if (process.env.ALLOW_ADMIN_SIGNUP !== 'true') {
      //   throw new Error('Admin signup is disabled')
      // }
      const profileAttributes = userAttributes?.profile
      const dateOfBirth =
        userAttributes?.dateOfBirth ?? profileAttributes?.dateOfBirth

      return db.user.create({
        data: {
          hashedPassword,
          salt,
          email: userAttributes?.email || username,
          role: userAttributes?.role || profileAttributes?.role || 'PROSPECT',
          profile: {
            create: {
              firstName:
                userAttributes?.firstName || profileAttributes?.firstName || '',
              lastName:
                userAttributes?.lastName || profileAttributes?.lastName || '',
              dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            },
          },
        },
        include: {
          profile: true,
        },
      })
    },
    passwordValidation: () => true,
    errors: {
      fieldMissing: '${field} is required',
      usernameTaken: 'Email `${username}` already in use',
    },
  }

  const authHandler = new DbAuthHandler(event, context, {
    db,
    authModelAccessor: 'user',
    authFields: {
      id: 'id',
      username: 'email',
      hashedPassword: 'hashedPassword',
      salt: 'salt',
      resetToken: 'resetToken',
      resetTokenExpiresAt: 'resetTokenExpiresAt',
    },
    allowedUserFields: ['id', 'email', 'role'],
    cookie: {
      name: cookieName,
      attributes: {
        HttpOnly: true,
        Path: '/',
        SameSite: 'Strict',
        Secure: process.env.NODE_ENV !== 'development',
      },
    },
    forgotPassword: forgotPasswordOptions,
    login: loginOptions,
    resetPassword: resetPasswordOptions,
    signup: signupOptions,
  })

  return authHandler.invoke()
}
