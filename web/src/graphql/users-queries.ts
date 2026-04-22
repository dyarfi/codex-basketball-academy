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
      profile {
        firstName
        lastName
      }
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
      profile {
        firstName
        lastName
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
      }
    }
  }
`
