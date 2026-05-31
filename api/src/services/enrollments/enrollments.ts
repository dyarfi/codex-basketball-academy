import { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  EnrollmentRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { issueCertificateForCompletedEnrollment } from 'src/services/certificates'

export const enrollments: QueryResolvers['enrollments'] = () => {
  return db.enrollment.findMany()
}

export const enrollment: QueryResolvers['enrollment'] = ({ id }) => {
  return db.enrollment.findUnique({
    where: { id },
  })
}

export const paginatedEnrollments: QueryResolvers['paginatedEnrollments'] =
  async ({ page = 1, pageSize = 10, search, programId, status }) => {
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

export const updateEnrollment: MutationResolvers['updateEnrollment'] = async ({
  id,
  input,
}) => {
  // Get the current enrollment before updating
  const currentEnrollment = await db.enrollment.findUnique({
    where: { id },
  })

  // Update the enrollment
  const updatedEnrollment = await db.enrollment.update({
    data: input,
    where: { id },
    include: {
      user: true,
      class: true,
      program: true,
    },
  })

  // Check if enrollment was marked as completed
  const isMarkedComplete =
    input.completionDate &&
    input.status === 'COMPLETED' &&
    (!currentEnrollment?.completionDate ||
      currentEnrollment?.status !== 'COMPLETED')

  if (isMarkedComplete) {
    try {
      logger.info(
        `Enrollment ${id} marked as completed. Triggering certificate issuance...`
      )
      await issueCertificateForCompletedEnrollment(updatedEnrollment)
    } catch (error) {
      logger.error(
        `Error auto-issuing certificate for enrollment ${id}: ${error}`
      )
      // Don't fail the enrollment update if certificate issuance fails
      // The certificate can be issued manually later
    }
  }

  return updatedEnrollment
}

export const completeEnrollment: MutationResolvers['completeEnrollment'] =
  async ({ id }) => {
    return updateEnrollment({
      id,
      input: {
        status: 'COMPLETED',
        completionDate: new Date(),
      },
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
