import { parseISO, isValid, format } from 'date-fns'
import gql from 'graphql-tag'

import { createTransformerDirective } from '@redwoodjs/graphql-server'
import type { TransformerDirectiveFunc } from '@redwoodjs/graphql-server'

export const schema = gql`
  directive @attendanceDate on INPUT_FIELD_DEFINITION | FIELD_DEFINITION
`

const attendanceDate: TransformerDirectiveFunc = ({ resolvedValue }) => {
  if (!resolvedValue) {
    return resolvedValue
  }

  // Parse ISO datetime string
  const parsed = parseISO(resolvedValue)

  if (!isValid(parsed)) {
    throw new Error(
      `Invalid attendanceDate format. Expected ISO datetime, got: ${resolvedValue}`
    )
  }

  // Format as yyyy-MM-dd HH:mm
  return format(parsed, 'yyyy-MM-dd HH:mm')
}

const attendanceDateDirective = createTransformerDirective(
  schema,
  attendanceDate
)

export default attendanceDateDirective
