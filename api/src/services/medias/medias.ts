import type { QueryResolvers, MutationResolvers } from 'types/graphql'

// import { ForbiddenError } from '@redwoodjs/graphql-server'
// import { hasGate } from 'src/lib/auth'

import { db } from 'src/lib/db'

/* List per page */
const LIST_PER_PAGE = 10

export const mediaLists: QueryResolvers['mediaLists'] = async ({
  page = 1,
  search = '',
}) => {
  // if (!hasGate('admin:media:lists')) {
  //   throw new ForbiddenError("You don't have access to this resources")
  // }
  const offset = (page - 1) * LIST_PER_PAGE
  const searchParams = search
    ? {
        where: {
          OR: [
            {
              name: {
                contains: search,
              },
            },
            {
              url: {
                contains: search,
              },
            },
            {
              pathName: {
                contains: search,
              },
            },
            {
              publicId: {
                contains: search,
              },
            },
          ],
          // AND: {
          //   status: 1,
          // },
        },
      }
    : ''

  const result = {
    medias: await db.media.findMany({
      take: LIST_PER_PAGE,
      skip: offset,
      ...searchParams,
      orderBy: { uploadedAt: 'desc' },
    }),
  }

  return {
    ...result,
    count: await db.media.count({ ...searchParams }),
  }
}

export const medias: QueryResolvers['medias'] = () => {
  return db.media.findMany({ orderBy: { uploadedAt: 'desc' }, take: 5 })
}

export const media: QueryResolvers['media'] = ({ id }) => {
  return db.media.findUnique({
    where: { id },
  })
}

export const createMedia: MutationResolvers['createMedia'] = ({ input }) => {
  return db.media.create({
    data: input,
  })
}

export const updateMedia: MutationResolvers['updateMedia'] = ({
  id,
  input,
}) => {
  return db.media.update({
    data: input,
    where: { id },
  })
}

export const deleteMedia: MutationResolvers['deleteMedia'] = ({ id }) => {
  return db.media.delete({
    where: { id },
  })
}
