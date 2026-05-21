export const schema = gql`
  type Announcement {
    id: Int!
    title: String!
    message: String!
    type: AnnouncementType!
    isActive: Boolean!
    isDismissible: Boolean!
    actionLabel: String
    actionUrl: String
    priority: Int!
    showFrom: DateTime
    showUntil: DateTime
    meta: JSON
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum AnnouncementType {
    INFO
    SUCCESS
    WARNING
    ERROR
  }

  type AnnouncementLists {
    announcements: [Announcement!]!
    count: Int!
  }

  type Query {
    publicAnnouncement: Announcement! @skipAuth
    announcementLists(page: Int!, search: String): AnnouncementLists
      @requireAuth
    # @hasGate(gate: "admin:announcement:lists")
    announcements: [Announcement!]! @requireAuth
    # @hasGate(gate: "admin:announcement:lists")
    announcement(id: Int!): Announcement @requireAuth
    # @hasGates(gates: ["admin:announcement:edit", "admin:announcement:show"])
  }

  input CreateAnnouncementInput {
    title: String!
    message: String!
    type: AnnouncementType!
    isActive: Boolean!
    isDismissible: Boolean!
    actionLabel: String
    actionUrl: String
    imageUrl: String
    priority: Int!
    showFrom: DateTime
    showUntil: DateTime
    meta: JSON
    createdAt: DateTime
    updatedAt: DateTime
    createdById: String
  }

  input UpdateAnnouncementInput {
    title: String
    message: String
    type: AnnouncementType
    isActive: Boolean
    isDismissible: Boolean
    actionLabel: String
    actionUrl: String
    priority: Int
    showFrom: DateTime
    showUntil: DateTime
    meta: JSON
  }

  type Mutation {
    createAnnouncement(input: CreateAnnouncementInput!): Announcement!
      @requireAuth
    # @hasGate(gate: "admin:announcement:new")
    updateAnnouncement(
      id: Int!
      input: UpdateAnnouncementInput!
    ): Announcement! @requireAuth #  @hasGate(gate: "admin:announcement:edit")
    deleteAnnouncement(id: Int!): Announcement! @requireAuth
    # @hasGate(gate: "admin:announcement:delete")
  }
`
