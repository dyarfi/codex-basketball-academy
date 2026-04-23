import type {
  QueryResolvers,
  MutationResolvers,
  ClassRelationResolvers,
} from 'types/graphql'
import { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'

export const classroom: QueryResolvers['classroom'] = ({ id }) => {
  return db.class.findUnique({
    where: { id },
  })
}

export const classes: QueryResolvers['classes'] = () => {
  return db.class.findMany()
}

export const paginatedClasses: QueryResolvers['paginatedClasses'] = async ({
  page = 1,
  pageSize = 10,
  search,
  programId,
  coachId,
  isActive,
}) => {
  const conditions: Prisma.ClassWhereInput[] = []
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
        {
          coachName: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          program: {
            is: {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    })
  }

  if (programId) {
    conditions.push({ programId })
  }

  if (coachId) {
    conditions.push({ coachId })
  }

  if (typeof isActive === 'boolean') {
    conditions.push({ isActive })
  }

  const where: Prisma.ClassWhereInput | undefined =
    conditions.length > 0 ? { AND: conditions } : undefined
  const safePage = Math.max(1, page)
  const safePageSize = Math.max(1, pageSize)
  const skip = (safePage - 1) * safePageSize

  const [items, totalCount] = await Promise.all([
    db.class.findMany({
      where,
      orderBy: { startDate: 'desc' },
      skip,
      take: safePageSize,
    }),
    db.class.count({ where }),
  ])

  return {
    items,
    totalCount,
  }
}

export const classType: QueryResolvers['classType'] = ({ id }) => {
  return db.class.findUnique({
    where: { id },
  })
}

export const createClass: MutationResolvers['createClass'] = ({ input }) => {
  return db.class.create({
    data: input,
  })
}

export const updateClass: MutationResolvers['updateClass'] = ({
  id,
  input,
}) => {
  return db.class.update({
    data: input,
    where: { id },
  })
}

export const deleteClass: MutationResolvers['deleteClass'] = ({ id }) => {
  return db.class.delete({
    where: { id },
  })
}

export const Class: ClassRelationResolvers = {
  program: (_obj, { root }) => {
    return db.class.findUnique({ where: { id: root?.id } }).program()
  },
  coach: (_obj, { root }) => {
    return db.class.findUnique({ where: { id: root?.id } }).coach()
  },
  enrollments: (_obj, { root }) => {
    return db.class.findUnique({ where: { id: root?.id } }).enrollments()
  },
  attendances: (_obj, { root }) => {
    return db.class.findUnique({ where: { id: root?.id } }).attendances()
  },
}
