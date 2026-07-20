import gql from 'graphql-tag'

/**
 * Fetch all users
 */
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      role
      isActive
      createdAt
      updatedAt
      teamMemberships {
        id
        teamId
        team {
          id
          name
          ageGroup
        }
      }
      profile {
        firstName
        lastName
        gender
        jerseyNumber
        profilePhoto
        position
      }
    }
  }
`

export const GET_PAGINATED_USERS = gql`
  query GetPaginatedUsers(
    $page: Int!
    $pageSize: Int!
    $search: String
    $role: Role
    $isActive: Boolean
  ) {
    paginatedUsers(
      page: $page
      pageSize: $pageSize
      search: $search
      role: $role
      isActive: $isActive
    ) {
      items {
        id
        email
        role
        isActive
        createdAt
        updatedAt
        teamMemberships {
          id
          teamId
          team {
            id
            name
            ageGroup
          }
        }
        profile {
          firstName
          lastName
          gender
          dateOfBirth
          phoneNumber
          address
          city
          state
          zipCode
          country
          position
          jerseyNumber
          heightCm
          weightKg
          medicalInfo
          emergencyContactName
          emergencyContactPhone
          relationshipToPlayer
          profilePhoto
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

/**
 * Fetch a single user by ID
 */
export const GET_USER = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      email
      role
      isActive
      teamMemberships {
        id
        teamId
        team {
          id
          name
          ageGroup
        }
      }
      profile {
        firstName
        lastName
        gender
        dateOfBirth
        phoneNumber
        address
        city
        state
        zipCode
        country
        position
        jerseyNumber
        heightCm
        weightKg
        medicalInfo
        emergencyContactName
        emergencyContactPhone
        relationshipToPlayer
        profilePhoto
      }
    }
  }
`

/**
 * Update an existing user
 */
export const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      role
      isActive
      teamMemberships {
        id
        teamId
        team {
          id
          name
          ageGroup
        }
      }
      profile {
        firstName
        lastName
        gender
        dateOfBirth
        phoneNumber
        address
        city
        state
        zipCode
        country
        position
        jerseyNumber
        heightCm
        weightKg
        medicalInfo
        emergencyContactName
        emergencyContactPhone
        relationshipToPlayer
        profilePhoto
      }
    }
  }
`

/**
 * Create a new user
 */
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      role
      isActive
      teamMemberships {
        id
        teamId
        team {
          id
          name
          ageGroup
        }
      }
      profile {
        firstName
        lastName
        gender
        dateOfBirth
        phoneNumber
        address
        city
        state
        zipCode
        country
        position
        jerseyNumber
        heightCm
        weightKg
        medicalInfo
        emergencyContactName
        emergencyContactPhone
        relationshipToPlayer
        profilePhoto
      }
    }
  }
`

/**
 * Delete a user by ID
 */
export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id) {
      id
      email
    }
  }
`

/**
 * Fetch all coaches (users with role COACH)
 */
export const GET_COACHES = gql`
  query GetCoaches {
    users {
      id
      email
      role
      profile {
        firstName
        lastName
        gender
        dateOfBirth
        jerseyNumber
        position
        profilePhoto
      }
    }
  }
`

/**
 * Fetch all users by condition (e.g., role, isActive)
 */
export const USERS_QUERY = gql`
  query GetUsersQuery($search: String, $role: Role, $isActive: Boolean) {
    usersQuery(search: $search, role: $role, isActive: $isActive) {
      id
      email
      role
      isActive
      createdAt
      updatedAt
      teamMemberships {
        id
        teamId
        team {
          id
          name
          ageGroup
        }
      }
      profile {
        firstName
        lastName
        gender
      }
    }
  }
`
