import type {
  QueryResolvers,
  MutationResolvers,
  GalleryRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const publicGallery: QueryResolvers['publicGallery'] = () => {
  return db.gallery.findMany({ orderBy: { createdAt: 'desc' } })
}

export const galleries: QueryResolvers['galleries'] = () => {
  return db.gallery.findMany({ orderBy: { createdAt: 'asc' } })
}

export const gallery: QueryResolvers['gallery'] = ({ id }) => {
  return db.gallery.findUnique({
    where: { id },
  })
}

export const createGallery: MutationResolvers['createGallery'] = ({
  input,
}) => {
  input.userId = context.currentUser.id
  return db.gallery.create({
    data: input,
  })
}

export const updateGallery: MutationResolvers['updateGallery'] = ({
  id,
  input,
}) => {
  input.userId = context.currentUser.id
  return db.gallery.update({
    data: input,
    where: { id },
  })
}

export const deleteGallery: MutationResolvers['deleteGallery'] = ({ id }) => {
  return db.gallery.delete({
    where: { id },
  })
}

export const Gallery: GalleryRelationResolvers = {
  user: (_obj, { root }) => {
    return db.gallery.findUnique({ where: { id: root?.id } }).user()
  },
  images: (_obj, { root }) => {
    return db.gallery.findUnique({ where: { id: root?.id } }).images()
  },
}
