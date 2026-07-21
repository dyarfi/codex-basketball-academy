export const schema = gql`
  type LiveGameSession {
    id: String!
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
  }

  type Query {
    liveGameSessionsByName(gameName: String!): [LiveGameSession!]! @requireAuth
    liveGameSessions: [LiveGameSession!]! @requireAuth
    liveGameSession(id: String!): LiveGameSession @requireAuth
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
      id: String!
      input: UpdateLiveGameSessionInput!
    ): LiveGameSession! @requireAuth
    deleteLiveGameSession(id: String!): LiveGameSession! @requireAuth
  }
`
