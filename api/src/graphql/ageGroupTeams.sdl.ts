export const schema = gql`
  type AgeGroupTeam {
    id: String!
    name: String!
    ageGroup: String!
    description: String
    coachId: String
    coach: User
    players: [User!]!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
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
    coachId: String
    playerIds: [String!]
    isActive: Boolean
  }

  input UpdateAgeGroupTeamInput {
    name: String
    ageGroup: String
    description: String
    coachId: String
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
