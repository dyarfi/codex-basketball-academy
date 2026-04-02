import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { DbAuthHandler, DbAuthOptions } from '@redwoodjs/auth-dbauth-api'
import { hash, hashPassword, hashToken, isSaltedPassword } from '@redwoodjs/auth-dbauth-api/dist/util'

export const handler = async (event, context) => {
  const dbAuthHandler = new DbAuthHandler(event, context, {
    db: db,
    loggerConfig: {
      logger,
      options: {},
    },
    signupFields: ['username', 'email', 'firstName', 'lastName', 'dateOfBirth', 'role'],
    passwordValidation: (password: string) => {
      return password.length >= 8
    },
    tokenExpiresIn: 60 * 60 * 24 * 365, // 1 year
    useResetToken: true,
  } as DbAuthOptions)

  return dbAuthHandler.invoke()
}
