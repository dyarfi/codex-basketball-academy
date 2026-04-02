export const schema = gql`
  type Message {
    id: String!
    senderId: String!
    sender: User!
    recipientId: String!
    recipient: User!
    subject: String
    content: String!
    isRead: Boolean!
    readAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    messages: [Message!]! @requireAuth
    message(id: String!): Message @requireAuth
  }

  input CreateMessageInput {
    senderId: String!
    recipientId: String!
    subject: String
    content: String!
    isRead: Boolean!
    readAt: DateTime
  }

  input UpdateMessageInput {
    senderId: String
    recipientId: String
    subject: String
    content: String
    isRead: Boolean
    readAt: DateTime
  }

  type Mutation {
    createMessage(input: CreateMessageInput!): Message! @requireAuth
    updateMessage(id: String!, input: UpdateMessageInput!): Message!
      @requireAuth
    deleteMessage(id: String!): Message! @requireAuth
  }
`
