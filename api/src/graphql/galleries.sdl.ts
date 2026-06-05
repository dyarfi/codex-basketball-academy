export const schema = gql`
  type Gallery {
    id: Int!
    name: String!
    slug: String
    description: String
    user: User
    userId: String
    images: [GalleryMedia]!
    status: Int!
    createdAt: DateTime!
    updatedAt: DateTime
  }

  type GalleryMedia {
    id: Int!
    name: String!
    description: String
    image: String!
    gallery: Gallery
    galleryId: Int
    createdAt: DateTime!
    updatedAt: DateTime
  }

  type PaginatedGalleries {
    items: [Gallery!]!
    totalCount: Int!
    currentPage: Int!
    pageSize: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type Query {
    publicGallery: [Gallery!]! @skipAuth
    galleries: [Gallery!]! @requireAuth
    paginatedGalleries(
      page: Int!
      pageSize: Int!
      search: String
    ): PaginatedGalleries! @requireAuth
    gallery(id: Int!): Gallery @requireAuth
    galleryMedias: [GalleryMedia!]! @requireAuth
    galleryMedia(id: Int!): GalleryMedia @requireAuth
  }

  input CreateGalleryInput {
    name: String!
    description: String
    userId: String
  }

  input UpdateGalleryInput {
    name: String
    description: String
    userId: String
    status: Int
  }

  input CreateGalleryMediaInput {
    name: String!
    description: String
    image: String!
    galleryId: Int
  }

  input UpdateGalleryMediaInput {
    name: String
    description: String
    image: String
    galleryId: Int
  }

  type Mutation {
    createGallery(input: CreateGalleryInput!): Gallery! @requireAuth
    updateGallery(id: Int!, input: UpdateGalleryInput!): Gallery! @requireAuth
    deleteGallery(id: Int!): Gallery! @requireAuth
    createGalleryMedia(input: CreateGalleryMediaInput!): GalleryMedia!
      @requireAuth
    updateGalleryMedia(
      id: Int!
      input: UpdateGalleryMediaInput!
    ): GalleryMedia! @requireAuth
    deleteGalleryMedia(id: Int!): GalleryMedia! @requireAuth
  }
`
