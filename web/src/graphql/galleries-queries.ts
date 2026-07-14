import { gql } from '@apollo/client'

export const GET_GALLERIES = gql`
  query GetGalleries {
    galleries {
      id
      name
      slug
      description
      status
      userId
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
      images {
        id
        name
        description
        image
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_PAGINATED_GALLERIES = gql`
  query GetPaginatedGalleries($page: Int!, $pageSize: Int!, $search: String) {
    paginatedGalleries(page: $page, pageSize: $pageSize, search: $search) {
      items {
        id
        name
        slug
        description
        status
        userId
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
        images {
          id
          name
          description
          image
        }
        createdAt
        updatedAt
      }
      totalCount
      currentPage
      pageSize
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
`

export const GET_GALLERY = gql`
  query GetGallery($id: Int!) {
    gallery(id: $id) {
      id
      name
      slug
      description
      status
      userId
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
      images {
        id
        name
        description
        image
      }
      createdAt
      updatedAt
    }
  }
`

export const CREATE_GALLERY = gql`
  mutation CreateGallery($input: CreateGalleryInput!) {
    createGallery(input: $input) {
      id
      name
      slug
      description
      status
      userId
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_GALLERY = gql`
  mutation UpdateGallery($id: Int!, $input: UpdateGalleryInput!) {
    updateGallery(id: $id, input: $input) {
      id
      name
      slug
      description
      status
      userId
      createdAt
      updatedAt
    }
  }
`

export const DELETE_GALLERY = gql`
  mutation DeleteGallery($id: Int!) {
    deleteGallery(id: $id) {
      id
    }
  }
`

export const GET_GALLERY_MEDIAS = gql`
  query GetGalleryMedias {
    galleryMedias {
      id
      name
      description
      image
      galleryId
      gallery {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_GALLERY_MEDIA = gql`
  query GetGalleryMedia($id: Int!) {
    galleryMedia(id: $id) {
      id
      name
      description
      image
      galleryId
      gallery {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`

export const CREATE_GALLERY_MEDIA = gql`
  mutation CreateGalleryMedia($input: CreateGalleryMediaInput!) {
    createGalleryMedia(input: $input) {
      id
      name
      description
      image
      galleryId
      gallery {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_GALLERY_MEDIA = gql`
  mutation UpdateGalleryMedia($id: Int!, $input: UpdateGalleryMediaInput!) {
    updateGalleryMedia(id: $id, input: $input) {
      id
      name
      description
      image
      galleryId
      createdAt
      updatedAt
    }
  }
`

export const DELETE_GALLERY_MEDIA = gql`
  mutation DeleteGalleryMedia($id: Int!) {
    deleteGalleryMedia(id: $id) {
      id
    }
  }
`
