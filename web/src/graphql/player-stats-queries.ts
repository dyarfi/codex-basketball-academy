import gql from 'graphql-tag'

export const GET_PLAYER_STATS = gql`
  query GetPlayerStats {
    playerStats {
      id
      userId
      liveGameSessionId
      points
      rebounds
      assists
      steals
      blocks
      minutesPlayed
      liveGameSession {
        id
        gameName
        gameDate
      }
      createdAt
      updatedAt
      user {
        id
        email
        profile {
          firstName
          lastName
          jerseyNumber
          position
        }
      }
    }
  }
`

export const GET_PAGINATED_PLAYER_STATS = gql`
  query GetPaginatedPlayerStats(
    $page: Int
    $pageSize: Int
    $search: String
    $userId: String
    $liveGameSessionId: Int
  ) {
    paginatedPlayerStats(
      page: $page
      pageSize: $pageSize
      search: $search
      userId: $userId
      liveGameSessionId: $liveGameSessionId
    ) {
      items {
        id
        userId
        liveGameSessionId
        points
        rebounds
        assists
        steals
        blocks
        minutesPlayed
        liveGameSession {
          id
          gameName
          gameDate
        }
        createdAt
        updatedAt
        user {
          id
          email
          profile {
            firstName
            lastName
            jerseyNumber
            position
          }
        }
      }
      totalCount
      currentPage
      pageSize
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
`

export const GET_PLAYER_STAT = gql`
  query GetPlayerStat($id: String!) {
    playerStat(id: $id) {
      id
      userId
      liveGameSessionId
      points
      rebounds
      assists
      steals
      blocks
      minutesPlayed
      liveGameSession {
        id
        gameName
        gameDate
      }
      createdAt
      updatedAt
      user {
        id
        email
        profile {
          firstName
          lastName
          jerseyNumber
          position
        }
      }
    }
  }
`

export const CREATE_PLAYER_STAT = gql`
  mutation CreatePlayerStat($input: CreatePlayerStatInput!) {
    createPlayerStat(input: $input) {
      id
      userId
      liveGameSessionId
      points
      rebounds
      assists
      steals
      blocks
      minutesPlayed
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_PLAYER_STAT = gql`
  mutation UpdatePlayerStat($id: String!, $input: UpdatePlayerStatInput!) {
    updatePlayerStat(id: $id, input: $input) {
      id
      userId
      liveGameSessionId
      points
      rebounds
      assists
      steals
      blocks
      minutesPlayed
      createdAt
      updatedAt
    }
  }
`

export const DELETE_PLAYER_STAT = gql`
  mutation DeletePlayerStat($id: String!) {
    deletePlayerStat(id: $id) {
      id
    }
  }
`

export const CREATE_BULK_PLAYER_STATS = gql`
  mutation CreateBulkPlayerStats($inputs: [CreateBulkPlayerStatsInput!]!) {
    createBulkPlayerStats(inputs: $inputs) {
      id
      userId
      liveGameSessionId
      points
      rebounds
      assists
      steals
      blocks
      minutesPlayed
      createdAt
      updatedAt
    }
  }
`

