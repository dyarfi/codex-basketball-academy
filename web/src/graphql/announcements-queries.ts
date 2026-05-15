import gql from 'graphql-tag'

export const ANNOUNCEMENTS_QUERY = gql`
  query GetAnnouncements {
    announcements {
      id
      createdById
      title
      content
      imageUrl
      publishDate
      expiryDate
      isActive
      createdAt
      updatedAt
      createdBy {
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

export const ANNOUNCEMENT_QUERY = gql`
  query GetAnnouncement($id: String!) {
    announcement(id: $id) {
      id
      createdById
      title
      content
      imageUrl
      publishDate
      expiryDate
      isActive
      createdAt
      updatedAt
      createdBy {
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

export const CREATE_ANNOUNCEMENT_MUTATION = gql`
  mutation CreateAnnouncement($input: CreateAnnouncementInput!) {
    createAnnouncement(input: $input) {
      id
      title
      content
      imageUrl
      publishDate
      expiryDate
      isActive
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_ANNOUNCEMENT_MUTATION = gql`
  mutation UpdateAnnouncement($id: String!, $input: UpdateAnnouncementInput!) {
    updateAnnouncement(id: $id, input: $input) {
      id
      title
      content
      imageUrl
      publishDate
      expiryDate
      isActive
      createdAt
      updatedAt
    }
  }
`

export const DELETE_ANNOUNCEMENT_MUTATION = gql`
  mutation DeleteAnnouncement($id: String!) {
    deleteAnnouncement(id: $id) {
      id
    }
  }
`
