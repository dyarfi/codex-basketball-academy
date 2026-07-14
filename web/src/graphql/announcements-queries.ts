import gql from 'graphql-tag'

export const PUBLIC_ANNOUNCEMENT_QUERY = gql`
  query GetPublicAnnouncement($notIn: [Int]) {
    publicAnnouncement(notIn: $notIn) {
      id
      title
      message
      type
      isActive
      isDismissible
      actionLabel
      actionUrl
      priority
      showFrom
      showUntil
      meta
      createdAt
      updatedAt
    }
  }
`

export const ANNOUNCEMENTS_QUERY = gql`
  query GetAnnouncements {
    announcements {
      id
      message
      title
      actionLabel
      actionUrl
      priority
      showFrom
      showUntil
      meta
      createdAt
      updatedAt
      isDismissible
      isActive
      type
      # imageUrl
      # content
      # createdBy {
      #   id
      #   email
      #   profile {
      #     firstName
      #     lastName
      #   }
      # }
    }
  }
`

export const ANNOUNCEMENT_LISTS_QUERY = gql`
  query GetAnnouncementLists($page: Int!, $search: String) {
    announcementLists(page: $page, search: $search) {
      announcements {
        id
        message
        title
        actionLabel
        actionUrl
        priority
        showFrom
        showUntil
        meta
        createdAt
        updatedAt
        isDismissible
        isActive
        type
      }
      count
    }
  }
`

export const ANNOUNCEMENT_QUERY = gql`
  query GetAnnouncement($id: Int!) {
    announcement(id: $id) {
      id
      message
      title
      actionLabel
      actionUrl
      priority
      showFrom
      showUntil
      meta
      createdAt
      updatedAt
      isDismissible
      isActive
      type
      # createdBy {
      #   id
      #   email
      #   profile {
      #     firstName
      #     lastName
      #   }
      # }
    }
  }
`

export const CREATE_ANNOUNCEMENT_MUTATION = gql`
  mutation CreateAnnouncement($input: CreateAnnouncementInput!) {
    createAnnouncement(input: $input) {
      id
      title
      message
      type
      isActive
      isDismissible
      actionLabel
      actionUrl
      priority
      showFrom
      showUntil
      meta
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_ANNOUNCEMENT_MUTATION = gql`
  mutation UpdateAnnouncement($id: Int!, $input: UpdateAnnouncementInput!) {
    updateAnnouncement(id: $id, input: $input) {
      id
      title
      message
      type
      isActive
      isDismissible
      actionLabel
      actionUrl
      priority
      showFrom
      showUntil
      meta
      createdAt
      updatedAt
    }
  }
`

export const DELETE_ANNOUNCEMENT_MUTATION = gql`
  mutation DeleteAnnouncement($id: Int!) {
    deleteAnnouncement(id: $id) {
      id
    }
  }
`
