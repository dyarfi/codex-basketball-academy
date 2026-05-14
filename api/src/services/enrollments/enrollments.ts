import type {
  QueryResolvers,
  MutationResolvers,
  EnrollmentRelationResolvers,
} from 'types/graphql'
import { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'

export const enrollments: QueryResolvers['enrollments'] = () => {
  return db.enrollment.findMany()
}

export const enrollment: QueryResolvers['enrollment'] = ({ id }) => {
  return db.enrollment.findUnique({
    where: { id },
  })
}

export const paginatedEnrollments: QueryResolvers['paginatedEnrollments'] =
  async ({
    page = 1,
    pageSize = 10,
    search,
    programId,
    status,
  }) => {
    const conditions: Prisma.EnrollmentWhereInput[] = []
    const searchTerm = search?.trim()

    if (searchTerm) {
      conditions.push({
        OR: [
          {
            user: {
              is: {
                email: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
          },
          {
            user: {
              is: {
                profile: {
                  is: {
                    firstName: {
                      contains: searchTerm,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            },
          },
          {
            class: {
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

    if (status) {
      conditions.push({ status })
    }

    const where: Prisma.EnrollmentWhereInput | undefined =
      conditions.length > 0 ? { AND: conditions } : undefined
    const safePageSize = Math.max(1, pageSize)
    const totalCount = await db.enrollment.count({ where })
    const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize))
    const currentPage = Math.min(Math.max(1, page), totalPages)
    const skip = (currentPage - 1) * safePageSize

    const items = await db.enrollment.findMany({
      where,
      orderBy: [{ enrollmentDate: 'desc' }, { id: 'desc' }],
      skip,
      take: safePageSize,
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        class: true,
        program: true,
      },
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

export const createEnrollment: MutationResolvers['createEnrollment'] = ({
  input,
}) => {
  return db.enrollment.create({
    data: input,
  })
}

export const updateEnrollment: MutationResolvers['updateEnrollment'] = ({
  id,
  input,
}) => {
  return db.enrollment.update({
    data: input,
    where: { id },
  })
}

export const deleteEnrollment: MutationResolvers['deleteEnrollment'] = ({
  id,
}) => {
  return db.enrollment.delete({
    where: { id },
  })
}

export const Enrollment: EnrollmentRelationResolvers = {
  user: (_obj, { root }) => {
    return db.enrollment.findUnique({ where: { id: root?.id } }).user()
  },
  class: (_obj, { root }) => {
    return db.enrollment.findUnique({ where: { id: root?.id } }).class()
  },
  program: (_obj, { root }) => {
    return db.enrollment.findUnique({ where: { id: root?.id } }).program()
  },
}
