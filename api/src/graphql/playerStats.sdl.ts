export const schema = gql`
  type PlayerStats {
    id: String!
    userId: String!
    user: User!
    gameDate: DateTime!
    points: Int!
    rebounds: Int!
    assists: Int!
    steals: Int!
    blocks: Int!
    minutesPlayed: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    playerStats: [PlayerStats!]! @requireAuth
    playerStat(id: String!): PlayerStats @requireAuth
  }

  input CreatePlayerStatInput {
    userId: String!
    gameDate: DateTime!
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
    points: Int
    rebounds: Int
    assists: Int
    steals: Int
    blocks: Int
    minutesPlayed: Int
  }

  type Mutation {
    createPlayerStat(input: CreatePlayerStatInput!): PlayerStats!
      @requireAuth
    updatePlayerStat(
      id: String!
      input: UpdatePlayerStatInput!
    ): PlayerStats! @requireAuth
    deletePlayerStat(id: String!): PlayerStats! @requireAuth
  }
`
