export const schema = gql`
  type User {
    id: String!
    email: String!
    role: Role!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    profile: Profile
    enrollments: [Enrollment]!
    attendances: [Attendance]!
    payments: [Payment]!
    invoices: [Invoice]!
    certificates: [Certificate]!
    skillAssessments: [SkillAssessment]!
    playerStats: [PlayerStats]!
    announcements: [Announcement]!
    sentMessages: [Message]!
    receivedMessages: [Message]!
    classesAsTutor: [Class]!
  }

  type PaginatedUsers {
    items: [User!]!
    totalCount: Int!
    currentPage: Int!
    pageSize: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  enum Role {
    ADMIN
    COACH
    PLAYER
    PARENT
    PROSPECT
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: String!): User @requireAuth
    paginatedUsers(
      page: Int = 1
      pageSize: Int = 10
      search: String
      role: Role
      isActive: Boolean
    ): PaginatedUsers! @requireAuth
  }

  input CreateUserInput {
    email: String!
    role: Role!
    isActive: Boolean!
  }

  input UpdateUserInput {
    email: String
    role: Role
    isActive: Boolean
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: String!): User! @requireAuth
  }
`
