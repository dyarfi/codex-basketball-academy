export const schema = gql`
  type GalleryMedia {
    id: Int!
    name: String!
    description: String!
    galleryId: Int
    gallery: Gallery
    image: String!
    createdAt: DateTime!
    updatedAt: DateTime
  }

  type Query {
    galleryMedias: [GalleryMedia!]! @requireAuth
    # @hasGate(gate: "admin:galleryMedia:lists")
    galleryMedia(id: Int!): GalleryMedia @requireAuth
    # @hasGates(gates: ["admin:galleryMedia:show", "admin:galleryMedia:edit"])
  }

  input CreateGalleryMediaInput {
    name: String!
    description: String!
    galleryId: Int
    image: String!
  }

  input UpdateGalleryMediaInput {
    name: String
    description: String
    galleryId: Int
    image: String
  }

  type Mutation {
    createGalleryMedia(input: CreateGalleryMediaInput!): GalleryMedia!
      @requireAuth
    # @hasGate(gate: "admin:galleryMedia:new")
    updateGalleryMedia(
      id: Int!
      input: UpdateGalleryMediaInput!
    ): GalleryMedia! @requireAuth # @hasGate(gate: "admin:galleryMedia:edit")
    deleteGalleryMedia(id: Int!): GalleryMedia! @requireAuth
    # @hasGate(gate: "admin:galleryMedia:delete")
  }
`
