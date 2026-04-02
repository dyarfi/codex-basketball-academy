import type { APIGatewayEvent, Context } from 'aws-lambda'
import { db } from './db'

type RedwoodContext = Context & {
  currentUser?: Record<string, unknown>
}

/**
 * Used by the `requireAuth()` directive in GraphQL to check if a user is
 * authenticated.
 *
 * If you need to support unauthenticated requests, you can update this to return
 * `false` for unauthenticated requests.
 */
export const isAuthenticated = (user?: Record<string, unknown>) => {
  return !!user
}

/**
 * Used by the `requireAuth()` directive in GraphQL to check if a user has a
 * specific role or roles.
 *
 * Roles are passed in by the `requireAuth()` directive if you have configured
 * them in your `redwood.toml`.
 */
export const hasRole = (
  user: Record<string, unknown>,
  roles: string | string[]
): boolean => {
  if (!user) {
    return false
  }

  if (!roles || roles.length === 0) {
    return true
  }

  const rolesToCheck = Array.isArray(roles) ? roles : [roles]

  return rolesToCheck.includes(user.role as string)
}

/**
 * This is used by the @requireAuth() directive in GraphQL
 */
export const requireAuth = ({ roles }: { roles?: string | string[] } = {}) => {
  return (user?: Record<string, unknown>) => {
    if (!isAuthenticated(user)) {
      throw new Error('User is not authenticated')
    }

    if (roles && !hasRole(user, roles)) {
      throw new Error(
        `User does not have the required role(s): ${Array.isArray(roles) ? roles.join(', ') : roles}`
      )
    }

    return user
  }
}

/**
 * Retrieves the current user from the database based on the user ID in the context.
 * This is called by the `currentUser()` query in GraphQL.
 */
export const getCurrentUser = async (
  _user: Record<string, unknown>,
  _params: Record<string, unknown>,
  context: RedwoodContext
) => {
  if (!context.currentUser) {
    return null
  }

  return db.user.findUnique({
    where: { id: context.currentUser.id as string },
    include: {
      profile: true,
    },
  })
}
