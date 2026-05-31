import gql from 'graphql-tag'

/**
 * Fetch paginated media list
 */
export const GET_MEDIA_LISTS = gql`
  query GetMediaLists($page: Int!, $search: String) {
    mediaLists(page: $page, search: $search) {
      medias {
        id
        name
        url
        pathName
        mimeType
        size
        publicId
        isPublic
        order
        folderId
        uploadedAt
      }
      count
    }
  }
`

/**
 * Fetch all media
 */
export const GET_MEDIAS = gql`
  query GetMedias {
    medias {
      id
      name
      url
      pathName
      mimeType
      size
      publicId
      isPublic
      order
      folderId
      uploadedAt
    }
  }
`

/**
 * Fetch a single media by ID
 */
export const GET_MEDIA = gql`
  query GetMedia($id: Int!) {
    media(id: $id) {
      id
      name
      url
      pathName
      mimeType
      size
      publicId
      isPublic
      order
      folderId
      uploadedAt
    }
  }
`

/**
 * Create a new media
 */
export const CREATE_MEDIA = gql`
  mutation CreateMedia($input: CreateMediaInput!) {
    createMedia(input: $input) {
      id
      name
      url
      mimeType
      size
      isPublic
      uploadedAt
    }
  }
`

/**
 * Update an existing media
 */
export const UPDATE_MEDIA = gql`
  mutation UpdateMedia($id: Int!, $input: UpdateMediaInput!) {
    updateMedia(id: $id, input: $input) {
      id
      name
      url
      pathName
      mimeType
      size
      publicId
      isPublic
      order
      folderId
      uploadedAt
    }
  }
`

/**
 * Delete a media by ID
 */
export const DELETE_MEDIA = gql`
  mutation DeleteMedia($id: Int!) {
    deleteMedia(id: $id) {
      id
      name
      url
    }
  }
`
