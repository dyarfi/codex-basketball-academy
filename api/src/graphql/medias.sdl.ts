export const schema = gql`
  type Media {
    id: Int!
    name: String!
    url: String!
    pathName: String
    mimeType: String!
    size: Int!
    publicId: String
    isPublic: Boolean!
    order: Int!
    folderId: String
    uploadedAt: DateTime!
  }

  type MediaLists {
    medias: [Media!]!
    count: Int!
  }

  type Query {
    mediaLists(page: Int!, search: String): MediaLists
      @requireAuth
      @hasGates(gates: ["admin:media:*"])
    medias: [Media!]! @requireAuth
    media(id: Int!): Media @requireAuth
    # @hasGates(gates: ["media:lists", "media:lists"])
    # @hasGate(gate: "admin:media:lists")
  }

  input CreateMediaInput {
    name: String!
    url: String!
    pathName: String
    mimeType: String!
    size: Int!
    publicId: String
    isPublic: Boolean!
    order: Int!
    folderId: String
    uploadedAt: DateTime!
  }

  input UpdateMediaInput {
    name: String
    url: String
    pathName: String
    mimeType: String
    size: Int
    publicId: String
    isPublic: Boolean
    order: Int
    folderId: String
    uploadedAt: DateTime
  }

  type Mutation {
    createMedia(input: CreateMediaInput!): Media! @requireAuth
    updateMedia(id: Int!, input: UpdateMediaInput!): Media! @requireAuth
    deleteMedia(id: Int!): Media! @requireAuth
  }
`
