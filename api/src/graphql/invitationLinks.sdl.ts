export const schema = gql`
  type InvitationLink {
    id: Int!
    code: String!
    url: String!
    createdById: Int
    createdBy: User
    purpose: String
    expiresAt: DateTime
    usedAt: DateTime
    maxUses: Int
    useCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type CreateInvitationLinkInputPublic {
    code: String!
    url: String!
  }

  type Query {
    # createInvitationLinkPublic: CreateInvitationLinkInputPublic @skipAuth
    invitationLinks: [InvitationLink!]! @requireAuth
    invitationLink(id: Int!): InvitationLink @requireAuth
    invitationLinkPublic(code: String!): InvitationLink @skipAuth
  }

  input CreateInvitationLinkInput {
    code: String!
    url: String!
    createdById: Int
    purpose: String
    expiresAt: DateTime
    usedAt: DateTime
    maxUses: Int
    #useCount: Int!
  }

  input UpdateInvitationLinkInput {
    code: String
    url: String
    createdById: Int
    purpose: String
    expiresAt: DateTime
    usedAt: DateTime
    maxUses: Int
    useCount: Int
  }
  type Mutation {
    useInvitationLink(code: String!): Boolean! @skipAuth @requireAuth
    createInvitationLinkPublic(input: Boolean): InvitationLink! @skipAuth
    createInvitationLink(input: CreateInvitationLinkInput!): InvitationLink!
      @requireAuth
    # @hasGate(gate: "admin:invitationLinks:new")
    updateInvitationLink(
      id: Int!
      input: UpdateInvitationLinkInput!
    ): InvitationLink! @requireAuth # @hasGate(gate: "admin:invitationLinks:edit")
    deleteInvitationLink(id: Int!): InvitationLink! @requireAuth
    # @hasGate(gate: "admin:invitationLinks:delete")
  }
`
