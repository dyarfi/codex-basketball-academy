export const schema = gql`
  type PlayerStats {
    id: String!
    userId: String!
    user: User!
    gameDate: DateTime!
    gameName: String!
    points: Int!
    rebounds: Int!
    assists: Int!
    steals: Int!
    blocks: Int!
    minutesPlayed: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type PaginatedPlayerStats {
    items: [PlayerStats!]!
    totalCount: Int!
    currentPage: Int!
    pageSize: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type Query {
    playerStats: [PlayerStats!]! @requireAuth
    playerStat(id: String!): PlayerStats @requireAuth
    playerStatsByGameName: [PlayerStats!]! @requireAuth
    paginatedPlayerStats(
      page: Int = 1
      pageSize: Int = 10
      search: String
      userId: String
      gameName: String
      dateFrom: DateTime
      dateTo: DateTime
    ): PaginatedPlayerStats! @requireAuth
  }

  input CreatePlayerStatInput {
    userId: String!
    gameDate: DateTime!
    gameName: String!
    points: Int!
    rebounds: Int!
    assists: Int!
    steals: Int!
    blocks: Int!
    minutesPlayed: Int!
  }

  input UpdatePlayerStatInput {
    userId: String
    gameDate: DateTime
    gameName: String
    points: Int
    rebounds: Int
    assists: Int
    steals: Int
    blocks: Int
    minutesPlayed: Int
  }

  type Mutation {
    createPlayerStat(input: CreatePlayerStatInput!): PlayerStats! @requireAuth
    updatePlayerStat(id: String!, input: UpdatePlayerStatInput!): PlayerStats!
      @requireAuth
    deletePlayerStat(id: String!): PlayerStats! @requireAuth
    createBulkPlayerStats(
      inputs: [CreateBulkPlayerStatsInput!]!
    ): [PlayerStats!]! @requireAuth
  }

  input CreateBulkPlayerStatsInput {
    userId: String!
    gameDate: DateTime!
    gameName: String!
    points: Int!
    rebounds: Int!
    assists: Int!
    steals: Int!
    blocks: Int!
    minutesPlayed: Int!
  }
`
