import type {
  QueryResolvers,
  MutationResolvers,
  GalleryMediaRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const galleryMedias: QueryResolvers['galleryMedias'] = () => {
  return db.galleryMedia.findMany()
}

export const galleryMedia: QueryResolvers['galleryMedia'] = ({ id }) => {
  return db.galleryMedia.findUnique({
    where: { id },
  })
}

export const createGalleryMedia: MutationResolvers['createGalleryMedia'] = ({
  input,
}) => {
  return db.galleryMedia.create({
    data: input,
  })
}

export const updateGalleryMedia: MutationResolvers['updateGalleryMedia'] = ({
  id,
  input,
}) => {
  return db.galleryMedia.update({
    data: input,
    where: { id },
  })
}

export const deleteGalleryMedia: MutationResolvers['deleteGalleryMedia'] = ({
  id,
}) => {
  return db.galleryMedia.delete({
    where: { id },
  })
}

export const GalleryMedia: GalleryMediaRelationResolvers = {
  gallery: (_obj, { root }) => {
    return db.galleryMedia.findUnique({ where: { id: root?.id } }).gallery()
  },
}
