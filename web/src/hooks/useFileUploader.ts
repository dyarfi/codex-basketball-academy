import { useState } from 'react'

import type { FindMedias, FindMediasVariables } from 'types/graphql'

import { useParams } from '@redwoodjs/router'
import { TypedDocumentNode, useMutation } from '@redwoodjs/web'

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/upload`
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET

// const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload'
// const UPLOAD_PRESET = 'realestate_upload'

const QUERY: TypedDocumentNode<FindMedias, FindMediasVariables> = gql`
  query FindMediaListsUploader($page: Int! = 1, $search: String!) {
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
    }
  }
`

const CREATE_FILE_MUTATION = gql`
  mutation CreateFileMutation($input: CreateMediaInput!) {
    createMedia(input: $input) {
      id
      name
      url
      mimeType
      size
      folderId
      pathName
      # propertyId
    }
  }
`

export function useFileUploader({
  folderId,
  // propertyId,
  onProgress,
}: {
  folderId?: string
  propertyId?: string
  onProgress?: (percent: number, file: File) => void
}) {
  const { page = 1, search = '' } = useParams()
  const [createMedia, { loading }] = useMutation(CREATE_FILE_MUTATION, {
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY, variables: { page, search } }],
    awaitRefetchQueries: true,
  })
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])

  const uploadFileToCloudinary = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()

      formData.append('file', file)
      formData.append('folder', `assets/${folderId}`)
      formData.append('upload_preset', UPLOAD_PRESET)

      xhr.open('POST', CLOUDINARY_URL)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress(percent, file)
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }

      xhr.onerror = () => reject(new Error('Upload error'))
      xhr.send(formData)
    })
  }

  const uploadFiles = async (files: File[], maxRetries = 2) => {
    setUploading(true)
    setErrors([])
    const results = []

    for (const file of files) {
      let attempts = 0
      const uploaded = null

      while (attempts <= maxRetries) {
        try {
          const data = await uploadFileToCloudinary(file)
          const { pathname } = new URL(data.secure_url)
          const result = await createMedia({
            variables: {
              input: {
                // name: file.name,
                name: data.original_filename,
                url: data.secure_url,
                publicId: data.public_id,
                mimeType: file.type,
                size: file.size,
                folderId,
                isPublic: true,
                order: 1,
                uploadedAt: new Date(),
                pathName: pathname,
              },
            },
          })

          results.push(result.data.createMedia)
          break // successful upload, exit retry loop
        } catch (error) {
          attempts++
          if (attempts > maxRetries) {
            console.error(`Failed to upload ${file.name}:`, error)
            setErrors((prev) => [...prev, `${file.name}: ${error.message}`])
          }
        }
      }
    }

    setUploadedFiles(results)
    setUploading(false)
    return results
  }

  return {
    uploadFiles,
    uploading,
    errors,
    uploadedFiles,
    loading,
  }
}
