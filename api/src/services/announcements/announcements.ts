import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

/* List per page */
const LIST_PER_PAGE = 10

export const announcementLists: QueryResolvers['announcementLists'] = async ({
  page = 1,
  search = '',
}) => {
  const offset = (page - 1) * LIST_PER_PAGE
  const searchParams =
    search.trim() !== ''
      ? {
          where: {
            OR: [
              {
                title: {
                  contains: search,
                },
              },
              {
                message: {
                  contains: search,
                },
              },
            ],
          },
        }
      : ''

  const result = {
    announcements: await db.announcement.findMany({
      take: LIST_PER_PAGE,
      skip: offset,
      ...searchParams,
      orderBy: { id: 'desc' },
    }),
  }

  return {
    ...result,
    count: await db.announcement.count({ ...searchParams }),
  }
}

export const publicAnnouncement: QueryResolvers['publicAnnouncement'] = () => {
  return db.announcement.findFirst({ where: { isActive: true } })
}

export const announcements: QueryResolvers['announcements'] = () => {
  return db.announcement.findMany()
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
