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

// Site Settings Queries
export const SITE_SETTINGS_QUERY = gql`
  query SiteSettings {
    siteSettings {
      id
      key
      label
      group
      value
      valueType
      createdAt
      updatedAt
    }
  }
`

export const SITE_SETTINGS_BY_GROUP_QUERY = gql`
  query SiteSettingsByGroup($group: String!) {
    siteSettingsByGroup(group: $group) {
      id
      key
      label
      group
      value
      valueType
      createdAt
      updatedAt
    }
  }
`

export const SITE_SETTING_BY_KEY_QUERY = gql`
  query SiteSettingByKey($key: String!) {
    siteSettingByKey(key: $key) {
      id
      key
      label
      group
      value
      valueType
      createdAt
      updatedAt
    }
  }
`

// Site Settings Mutations
export const UPDATE_SITE_SETTING_MUTATION = gql`
  mutation UpdateSiteSetting(
    $id: Int!
    $label: String
    $value: String
    $valueType: String
  ) {
    updateSiteSetting(
      id: $id
      label: $label
      value: $value
      valueType: $valueType
    ) {
      id
      key
      label
      group
      value
      valueType
      updatedAt
    }
  }
`

export const CREATE_SITE_SETTING_MUTATION = gql`
  mutation CreateSiteSetting(
    $key: String!
    $label: String!
    $group: String!
    $value: String!
    $valueType: String
  ) {
    createSiteSetting(
      key: $key
      label: $label
      group: $group
      value: $value
      valueType: $valueType
    ) {
      id
      key
      label
      group
      value
      valueType
      createdAt
      updatedAt
    }
  }
`

export const DELETE_SITE_SETTING_MUTATION = gql`
  mutation DeleteSiteSetting($id: Int!) {
    deleteSiteSetting(id: $id)
  }
`
