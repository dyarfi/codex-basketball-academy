export const schema = gql`
  type User {
    id: String!
    email: String!
    role: Role!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    profile: Profile
    enrollments: [Enrollment]
    attendances: [Attendance]
    payments: [Payment]
    invoices: [Invoice]
    certificates: [Certificate]
    skillAssessments: [SkillAssessment]
    playerStats: [PlayerStats]
    announcements: [Announcement]
    sentMessages: [Message]
    receivedMessages: [Message]
    classesAsTutor: [Class]
    teamId: String
    team: AgeGroupTeam
    teamsAsCoach: [AgeGroupTeam]
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
    usersQuery(search: String, role: Role, isActive: Boolean): [User!]!
      @requireAuth
  }

  input CreateUserInput {
    email: String!
    role: Role!
    isActive: Boolean!
    profile: CreateProfileInput!
    teamId: String
  }

  input CreateProfileInput {
    firstName: String!
    lastName: String!
    gender: String
    dateOfBirth: DateTime
    phoneNumber: String
    address: String
    city: String
    state: String
    zipCode: String
    country: String
    position: String
    jerseyNumber: Int
    heightCm: Float
    weightKg: Float
    medicalInfo: String
    emergencyContactName: String
    emergencyContactPhone: String
    relationshipToPlayer: String
    profilePhoto: String
  }

  input UpdateUserInput {
    email: String
    role: Role
    isActive: Boolean
    profile: UpdateProfileInput
    teamId: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: String!): User! @requireAuth
  }
`
