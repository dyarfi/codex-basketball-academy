import gql from 'graphql-tag'

const AGE_GROUP_TEAM_FIELDS = gql`
  fragment AgeGroupTeamFields on AgeGroupTeam {
    id
    name
    ageGroup
    description
    coachId
    isActive
    createdAt
    updatedAt
    coach {
      id
      email
      profile {
        firstName
        lastName
        profilePhoto
      }
    }
    players {
      id
      email
      teamId
      profile {
        firstName
        lastName
        position
        jerseyNumber
        profilePhoto
      }
    }
  }
`

export const GET_AGE_GROUP_TEAMS = gql`
  query GetAgeGroupTeams {
    ageGroupTeams {
      ...AgeGroupTeamFields
    }
  }
  ${AGE_GROUP_TEAM_FIELDS}
`

export const GET_PUBLIC_AGE_GROUP_TEAMS = gql`
  query GetPublicAgeGroupTeams {
    publicAgeGroupTeams {
      ...AgeGroupTeamFields
    }
  }
  ${AGE_GROUP_TEAM_FIELDS}
`

export const GET_PAGINATED_AGE_GROUP_TEAMS = gql`
  query GetPaginatedAgeGroupTeams(
    $page: Int!
    $pageSize: Int!
    $search: String
    $ageGroup: String
    $isActive: Boolean
  ) {
    paginatedAgeGroupTeams(
      page: $page
      pageSize: $pageSize
      search: $search
      ageGroup: $ageGroup
      isActive: $isActive
    ) {
      items {
        ...AgeGroupTeamFields
      }
      totalCount
      currentPage
      pageSize
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
  ${AGE_GROUP_TEAM_FIELDS}
`

export const CREATE_AGE_GROUP_TEAM = gql`
  mutation CreateAgeGroupTeam($input: CreateAgeGroupTeamInput!) {
    createAgeGroupTeam(input: $input) {
      ...AgeGroupTeamFields
    }
  }
  ${AGE_GROUP_TEAM_FIELDS}
`

export const UPDATE_AGE_GROUP_TEAM = gql`
  mutation UpdateAgeGroupTeam($id: String!, $input: UpdateAgeGroupTeamInput!) {
    updateAgeGroupTeam(id: $id, input: $input) {
      ...AgeGroupTeamFields
    }
  }
  ${AGE_GROUP_TEAM_FIELDS}
`

export const DELETE_AGE_GROUP_TEAM = gql`
  mutation DeleteAgeGroupTeam($id: String!) {
    deleteAgeGroupTeam(id: $id) {
      id
      name
    }
  }
`
