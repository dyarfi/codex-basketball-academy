export const schema = gql`
  type Announcement {
    id: String!
    createdById: String!
    createdBy: User!
    title: String!
    content: String!
    imageUrl: String
    publishDate: DateTime!
    expiryDate: DateTime
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    announcements: [Announcement!]! @requireAuth
    announcement(id: String!): Announcement @requireAuth
  }

  input CreateAnnouncementInput {
    createdById: String!
    title: String!
    content: String!
    imageUrl: String
    publishDate: DateTime!
    expiryDate: DateTime
    isActive: Boolean!
  }

  input UpdateAnnouncementInput {
    createdById: String
    title: String
    content: String
    imageUrl: String
    publishDate: DateTime
    expiryDate: DateTime
    isActive: Boolean
  }

  type Mutation {
    createAnnouncement(input: CreateAnnouncementInput!): Announcement!
      @requireAuth
    updateAnnouncement(
      id: String!
      input: UpdateAnnouncementInput!
    ): Announcement! @requireAuth
    deleteAnnouncement(id: String!): Announcement! @requireAuth
  }
`
