export const schema = gql`
  type LiveGameSession {
    id: Int!
    gameName: String!
    gameDate: DateTime!
    selectedTeamId: String
    team: AgeGroupTeam
    roster: JSON!
    statsMap: JSON!
    substitutedOut: JSON!
    substitutionLog: JSON!
    gameMinute: Int!
    gameStarted: Boolean!
    gameFinished: Boolean!
    elapsedSeconds: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    playerStats: [PlayerStats]!
  }

  type Query {
    liveGameSessionsByName(gameName: String!): [LiveGameSession!]! @requireAuth
    liveGameSessions: [LiveGameSession!]! @requireAuth
    liveGameSession(id: Int!): LiveGameSession @requireAuth
  }

  input CreateLiveGameSessionInput {
    gameName: String!
    gameDate: DateTime!
    selectedTeamId: String
    roster: JSON!
    statsMap: JSON!
    substitutedOut: JSON!
    substitutionLog: JSON!
    gameMinute: Int!
    gameStarted: Boolean!
    gameFinished: Boolean!
    elapsedSeconds: Int!
  }

  input UpdateLiveGameSessionInput {
    gameName: String
    gameDate: DateTime
    selectedTeamId: String
    roster: JSON
    statsMap: JSON
    substitutedOut: JSON
    substitutionLog: JSON
    gameMinute: Int
    gameStarted: Boolean
    gameFinished: Boolean
    elapsedSeconds: Int
  }

  type Mutation {
    createLiveGameSession(input: CreateLiveGameSessionInput!): LiveGameSession!
      @requireAuth
    updateLiveGameSession(
      id: Int!
      input: UpdateLiveGameSessionInput!
    ): LiveGameSession! @requireAuth
    deleteLiveGameSession(id: Int!): LiveGameSession! @requireAuth
  }
`
