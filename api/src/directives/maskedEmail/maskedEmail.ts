import {
  createTransformerDirective,
  TransformerDirectiveFunc,
} from '@redwoodjs/graphql-server'

export const schema = gql`
  directive @maskedEmail(permittedRoles: [String]) on FIELD_DEFINITION
`

const transform: TransformerDirectiveFunc = ({ context, resolvedValue }) => {
  // Split the email into username and domain parts
  const atIndex = resolvedValue.indexOf('@')
  const username = resolvedValue.slice(0, atIndex)
  const domain = resolvedValue.slice(atIndex + 1)

  // Decide how many characters to show (max 3)
  const visibleChars = 2
  const visiblePart = username.slice(0, visibleChars)
  const maskedPart = '*'.repeat(username.length - visibleChars)
  // Rebuild the email
  const result = `${visiblePart}${maskedPart}@${domain}`
  return result
}

const maskedEmail = createTransformerDirective(schema, transform)

export default maskedEmail
