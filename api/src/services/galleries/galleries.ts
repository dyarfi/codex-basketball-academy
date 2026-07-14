import { Prisma } from '@prisma/client'
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

export const paginatedGalleries: QueryResolvers['paginatedGalleries'] = async ({
  page = 1,
  pageSize = 10,
  search,
}) => {
  const conditions: Prisma.GalleryWhereInput[] = []
  const searchTerm = search?.trim()

  if (searchTerm) {
    conditions.push({
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ],
    })
  }

  const where: Prisma.GalleryWhereInput | undefined =
    conditions.length > 0 ? { AND: conditions } : undefined
  const safePageSize = Math.max(1, pageSize)
  const totalCount = await db.gallery.count({ where })
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const skip = (currentPage - 1) * safePageSize

  const items = await db.gallery.findMany({
    where,
    include: { user: true, images: true },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    skip,
    take: safePageSize,
  })

  return {
    items,
    totalCount,
    currentPage,
    pageSize: safePageSize,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }
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
