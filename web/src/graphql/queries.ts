// web/src/graphql/queries.ts
import gql from 'graphql-tag'

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      role
      isActive
      createdAt
      updatedAt
      profile {
        firstName
        lastName
        dateOfBirth
      }
    }
  }
`
