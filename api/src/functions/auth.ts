// api/src/functions/auth.ts
import { AuthHandler } from '@redwoodjs/auth-dbauth-handler'
import { db } from 'src/lib/db'

export const handler = new AuthHandler(
  {
    database: db,
    authModelAccessor: 'user',
  },
  {
    userId: 'id',
    username: 'email',
    hashedPassword: 'hashedPassword',
    salt: 'salt',
    loginHandler: async (user) => user,
    logoutHandler: () => true,
    signup: {
      handler: async ({ email, password }) => {
        // Signup validation happens in GraphQL resolver
        // This just handles session creation
        const user = await db.user.findUnique({ where: { email } })
        return user
      },
      errors: {
        'email not provided': 'Email is required',
        'password not provided': 'Password is required',
        'email already exists': 'Email already registered',
      },
      passwordValidationErrorMessage:
        'Password must be at least 8 characters with uppercase, lowercase, and number',
    },
    forgotPassword: {
      handler: async (user) => {
        // Return user so reset token can be sent
        return user
      },
      errors: {
        'email not found': 'Email not found',
      },
    },
    resetPassword: {
      errors: {
        'resetToken invalid': 'Reset token is invalid or expired',
        'resetToken expired': 'Reset token has expired',
        'email not found': 'Email not found',
      },
    },
  }
).handler
