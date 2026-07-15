import gql from 'graphql-tag'

export const GET_PLAYER_STATS = gql`
  query GetPlayerStats {
    playerStats {
      id
      userId
      gameDate
      gameName
      points
      rebounds
      assists
      steals
      blocks
      minutesPlayed
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
    $page: Int!
    $pageSize: Int!
    $search: String
    $userId: String
    $gameName: String
    $dateFrom: DateTime
    $dateTo: DateTime
  ) {
    paginatedPlayerStats(
      page: $page
      pageSize: $pageSize
      search: $search
      userId: $userId
      gameName: $gameName
      dateFrom: $dateFrom
      dateTo: $dateTo
    ) {
      items {
        id
        userId
        gameDate
        gameName
        points
        rebounds
        assists
        steals
        blocks
        minutesPlayed
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
      gameDate
      gameName
      points
      rebounds
      assists
      steals
      blocks
      minutesPlayed
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
      gameDate
      gameName
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
      gameDate
      gameName
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
      gameDate
      gameName
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

export const GET_UNIQUE_GAME_NAME = gql`
  query GetPlayerStatsByGameName {
    playerStatsByGameName {
      id
      gameName
    }
  }
`
