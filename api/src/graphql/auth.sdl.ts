// api/src/graphql/auth.sdl.ts
export const schema = gql`
  type AuthPayload {
    user: User!
  }

  type Query {
    me: User @requireAuth
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    signup(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
      role: Role!
      dateOfBirth: DateTime
    ): AuthPayload
    forgotPassword(email: String!): Boolean
    resetPassword(resetToken: String!, password: String!): AuthPayload
    logout: Boolean @requireAuth
  }
`
