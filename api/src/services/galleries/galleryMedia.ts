import type {
  QueryResolvers,
  MutationResolvers,
  GalleryMediaRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const galleryMedias: QueryResolvers['galleryMedias'] = () => {
  return db.galleryMedia.findMany({
    include: {
      gallery: true,
    },
  })
}

export const galleryMedia: QueryResolvers['galleryMedia'] = ({ id }) => {
  return db.galleryMedia.findUnique({
    where: { id },
    include: {
      gallery: true,
    },
  })
}

interface CreateGalleryMediaInput {
  name: string
  description?: string
  image: string
  galleryId?: number
}

export const createGalleryMedia: MutationResolvers['createGalleryMedia'] = ({
  input,
}) => {
  return db.galleryMedia.create({
    data: {
      name: input.name,
      description: input.description,
      image: input.image,
      galleryId: input.galleryId,
    },
    include: {
      gallery: true,
    },
  })
}

interface UpdateGalleryMediaInput {
  name?: string
  description?: string
  image?: string
  galleryId?: number
}

export const updateGalleryMedia: MutationResolvers['updateGalleryMedia'] = ({
  id,
  input,
}) => {
  return db.galleryMedia.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      image: input.image,
      galleryId: input.galleryId,
    },
    include: {
      gallery: true,
    },
  })
}

export const deleteGalleryMedia: MutationResolvers['deleteGalleryMedia'] = ({
  id,
}) => {
  return db.galleryMedia.delete({
    where: { id },
    include: {
      gallery: true,
    },
  })
}

export const GalleryMedia: GalleryMediaRelationResolvers = {
  gallery: (_obj, { root }) => {
    return db.galleryMedia.findUnique({ where: { id: root?.id } }).gallery()
  },
}
