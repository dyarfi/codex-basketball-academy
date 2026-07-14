import type { Prisma } from '@prisma/client'
import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

/* List per page */
const LIST_PER_PAGE = 10

export const announcementLists: QueryResolvers['announcementLists'] = async ({
  page = 1,
  search = '',
}) => {
  const searchTerm = search?.trim() ?? ''
  const where: Prisma.AnnouncementWhereInput | undefined = searchTerm
    ? {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            message: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      }
    : undefined

  const totalCount = await db.announcement.count({ where })
  const totalPages = Math.max(1, Math.ceil(totalCount / LIST_PER_PAGE))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const offset = (currentPage - 1) * LIST_PER_PAGE

  const result = {
    announcements: await db.announcement.findMany({
      take: LIST_PER_PAGE,
      skip: offset,
      where,
      orderBy: { id: 'desc' },
    }),
  }

  return {
    ...result,
    count: totalCount,
  }
}

export const publicAnnouncement: QueryResolvers['publicAnnouncement'] = ({
  notIn,
}) => {
  const now = new Date()
  // logger.info('Fetching public announcement with notIn:', notIn)
  console.log('Fetching public announcement with notIn:', notIn)
  return db.announcement.findFirst({
    where: {
      ...(notIn && { id: { notIn: [...notIn] } }),
      isActive: true,
      OR: [{ showFrom: null }, { showFrom: { lte: now } }],
      AND: [
        {
          OR: [{ showUntil: null }, { showUntil: { gte: now } }],
        },
      ],
    },
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
  })
}

export const announcements: QueryResolvers['announcements'] = () => {
  return db.announcement.findMany({ orderBy: { id: 'desc' } })
}

export const announcement: QueryResolvers['announcement'] = ({ id }) => {
  return db.announcement.findUnique({
    where: { id },
  })
}

export const createAnnouncement: MutationResolvers['createAnnouncement'] = ({
  input,
}) => {
  input.createdById = 1 // TODO: get from auth context
  input.publishDate = new Date() // TODO: get from input or set to current date
  input.expiryDate = new Date(input.showUntil) // TODO: get from input or set to showUntil date
  input.isActive = input.showFrom <= new Date() && input.showUntil >= new Date() // TODO: set to true if current date is between showFrom and showUntil, otherwise set to false
  input.priority = input.priority || 0 // TODO: set to 0 if not provided
  input.message = input.content || '' // TODO: set to empty string if not provided
  input.type = input.type || 'INFO' // TODO: set to 'info' if not provided
  input.isDismissible = input.isDismissible || false // TODO: set to false if not provided
  return db.announcement.create({
    data: input,
  })
}

export const updateAnnouncement: MutationResolvers['updateAnnouncement'] = ({
  id,
  input,
}) => {
  return db.announcement.update({
    data: input,
    where: { id },
  })
}

export const deleteAnnouncement: MutationResolvers['deleteAnnouncement'] = ({
  id,
}) => {
  return db.announcement.delete({
    where: { id },
  })
}
