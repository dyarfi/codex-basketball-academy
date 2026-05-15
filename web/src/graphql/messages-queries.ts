import gql from 'graphql-tag'

export const GET_MESSAGES = gql`
  query GetMessages {
    messages {
      id
      senderId
      recipientId
      subject
      content
      isRead
      readAt
      createdAt
      updatedAt
      sender {
        id
        email
        profile {
          firstName
          lastName
        }
      }
      recipient {
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

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
      senderId
      recipientId
      subject
      content
      isRead
      readAt
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_MESSAGE = gql`
  mutation UpdateMessage($id: String!, $input: UpdateMessageInput!) {
    updateMessage(id: $id, input: $input) {
      id
      senderId
      recipientId
      subject
      content
      isRead
      readAt
      createdAt
      updatedAt
    }
  }
`

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: String!) {
    deleteMessage(id: $id) {
      id
    }
  }
`
