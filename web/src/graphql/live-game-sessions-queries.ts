import gql from 'graphql-tag'

export const GET_LIVE_GAME_SESSIONS = gql`
  query GetLiveGameSessions($gameName: String!) {
    liveGameSessionsByName(gameName: $gameName) {
      id
      gameName
      gameDate
      selectedTeamId
      roster
      statsMap
      substitutedOut
      substitutionLog
      gameMinute
      gameStarted
      gameFinished
      elapsedSeconds
      createdAt
      updatedAt
      team {
        id
        name
        ageGroup
      }
    }
  }
`

export const CREATE_LIVE_GAME_SESSION = gql`
  mutation CreateLiveGameSession($input: CreateLiveGameSessionInput!) {
    createLiveGameSession(input: $input) {
      id
      gameName
      gameDate
      selectedTeamId
      roster
      statsMap
      substitutedOut
      substitutionLog
      gameMinute
      gameStarted
      gameFinished
      elapsedSeconds
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_LIVE_GAME_SESSION = gql`
  mutation UpdateLiveGameSession(
    $id: String!
    $input: UpdateLiveGameSessionInput!
  ) {
    updateLiveGameSession(id: $id, input: $input) {
      id
      gameName
      gameDate
      selectedTeamId
      roster
      statsMap
      substitutedOut
      substitutionLog
      gameMinute
      gameStarted
      gameFinished
      elapsedSeconds
      createdAt
      updatedAt
    }
  }
`

export const DELETE_LIVE_GAME_SESSION = gql`
  mutation DeleteLiveGameSession($id: String!) {
    deleteLiveGameSession(id: $id) {
      id
    }
  }
`
