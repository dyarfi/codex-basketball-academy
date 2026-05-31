// api/src/graphql/directives/hasGates/hasGates.js
import {
  createValidatorDirective,
  ForbiddenError,
} from '@redwoodjs/graphql-server'

import { hasGate } from 'src/lib/auth'

export const schema = gql`
  directive @hasGates(gates: [String!]!) on FIELD_DEFINITION
`

const validate = ({ directiveArgs, context }) => {
  const user = context.currentUser
  if (!user) throw new ForbiddenError('You must be logged in')

  // ✅ allow if user has at least one required gate
  const hasAny = directiveArgs.gates.some((g) => hasGate(g, { context }))

  if (!hasAny) {
    throw new ForbiddenError(
      // `Missing required gates: ${directiveArgs.gates.join(', ')}`
      `Not authorized, required gates: ${directiveArgs.gates.join(', ')}`
    )
  }
}

const hasGates = createValidatorDirective(schema, validate)

export default hasGates
