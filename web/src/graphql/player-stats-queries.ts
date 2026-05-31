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
    $dateFrom: DateTime
    $dateTo: DateTime
  ) {
    paginatedPlayerStats(
      page: $page
      pageSize: $pageSize
      search: $search
      userId: $userId
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
