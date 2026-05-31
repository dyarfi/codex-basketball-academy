// api/src/graphql/directives/hasGate/hasGate.js
import {
  createValidatorDirective,
  // ForbiddenError,
} from '@redwoodjs/graphql-server'

import { requireGate } from 'src/lib/auth'

export const schema = gql`
  directive @hasGate(gate: String!) on FIELD_DEFINITION
`

const validate = ({ directiveArgs, context }) => {
  requireGate(directiveArgs.gate, { context })
}

const hasGate = createValidatorDirective(schema, validate)

export default hasGate
