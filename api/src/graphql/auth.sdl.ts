// api/src/graphql/auth.sdl.ts
export const schema = gql`
  type AuthPayload {
    user: User!
  }

  type Query {
    me: User @requireAuth
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload @skipAuth
    signup(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
      role: Role!
      dateOfBirth: DateTime
    ): AuthPayload @skipAuth
    forgotPassword(email: String!): Boolean @skipAuth
    resetPassword(resetToken: String!, password: String!): AuthPayload @skipAuth
    logout: Boolean @requireAuth
  }
`
