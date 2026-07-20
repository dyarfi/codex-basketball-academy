export const schema = gql`
  type TeamCoach {
    id: Int!
    userId: String!
    teamId: String!
    role: CoachRole!
    joinedAt: DateTime!
    leftAt: DateTime
    isActive: Boolean!
    user: User
    team: AgeGroupTeam
  }

  type TeamMembership {
    id: Int!
    userId: String!
    teamId: String!
    user: User
    team: AgeGroupTeam
  }

  type AgeGroupTeam {
    id: String!
    name: String!
    ageGroup: String!
    description: String
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    coaches: [TeamCoach!]!
    memberships: [TeamMembership!]!
  }

  type PaginatedAgeGroupTeams {
    items: [AgeGroupTeam!]!
    totalCount: Int!
    currentPage: Int!
    pageSize: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  enum CoachRole {
    HEAD_COACH
    ASSISTANT
    TRAINER
  }

  type Query {
    ageGroupTeams: [AgeGroupTeam!]! @requireAuth
    publicAgeGroupTeams: [AgeGroupTeam!]! @skipAuth
    ageGroupTeam(id: String!): AgeGroupTeam @requireAuth
    paginatedAgeGroupTeams(
      page: Int = 1
      pageSize: Int = 10
      search: String
      ageGroup: String
      isActive: Boolean
    ): PaginatedAgeGroupTeams! @requireAuth
  }

  input CreateAgeGroupTeamInput {
    name: String!
    ageGroup: String!
    description: String
    coachIds: [String!]
    playerIds: [String!]
    isActive: Boolean
  }

  input UpdateAgeGroupTeamInput {
    name: String
    ageGroup: String
    description: String
    coachIds: [String!]
    playerIds: [String!]
    isActive: Boolean
  }

  type Mutation {
    createAgeGroupTeam(input: CreateAgeGroupTeamInput!): AgeGroupTeam!
      @requireAuth(roles: ["ADMIN"])
    updateAgeGroupTeam(
      id: String!
      input: UpdateAgeGroupTeamInput!
    ): AgeGroupTeam! @requireAuth(roles: ["ADMIN"])
    deleteAgeGroupTeam(id: String!): AgeGroupTeam!
      @requireAuth(roles: ["ADMIN"])
  }
`
