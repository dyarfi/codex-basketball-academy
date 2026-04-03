import gql from 'graphql-tag'

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($resetToken: String!, $password: String!) {
    resetPassword(resetToken: $resetToken, password: $password) {
      user {
        id
        email
      }
    }
  }
`

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
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
  }
`

export const SIGNUP_MUTATION = gql`
  mutation Signup(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $role: Role!
    $dateOfBirth: DateTime
  ) {
    signup(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      role: $role
      dateOfBirth: $dateOfBirth
    ) {
      user {
        id
        email
        role
        isActive
        profile {
          firstName
          lastName
          dateOfBirth
        }
      }
    }
  }
`
