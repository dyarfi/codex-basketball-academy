import { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  SkillAssessmentRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const paginatedSkillAssessments: QueryResolvers['paginatedSkillAssessments'] =
  async ({ page = 1, pageSize = 10, search, programId }) => {
    const conditions: Prisma.SkillAssessmentWhereInput[] = []
    const searchTerm = search?.trim()

    if (searchTerm) {
      conditions.push({
        OR: [
          {
            userId: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            programId: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      })
    }

    if (programId) {
      conditions.push({ programId })
    }

    const where: Prisma.SkillAssessmentWhereInput | undefined =
      conditions.length > 0 ? { AND: conditions } : undefined
    const safePageSize = Math.max(1, pageSize)
    const totalCount = await db.skillAssessment.count({ where })
    const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize))
    const currentPage = Math.min(Math.max(1, page), totalPages)
    const skip = (currentPage - 1) * safePageSize

    const items = await db.skillAssessment.findMany({
      where,
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

export const skillAssessments: QueryResolvers['skillAssessments'] = () => {
  return db.skillAssessment.findMany()
}

export const skillAssessment: QueryResolvers['skillAssessment'] = ({ id }) => {
  return db.skillAssessment.findUnique({
    where: { id },
  })
}

export const skillsAssessmentsByProgram: QueryResolvers['skillsAssessmentsByProgram'] =
  ({ id }) => {
    return db.skillAssessment.findFirst({
      where: { programId: id },
    })
  }

export const createSkillAssessment: MutationResolvers['createSkillAssessment'] =
  ({ input }) => {
    return db.skillAssessment.create({
      data: input,
    })
  }

export const updateSkillAssessment: MutationResolvers['updateSkillAssessment'] =
  ({ id, input }) => {
    return db.skillAssessment.update({
      data: input,
      where: { id },
    })
  }

export const deleteSkillAssessment: MutationResolvers['deleteSkillAssessment'] =
  ({ id }) => {
    return db.skillAssessment.delete({
      where: { id },
    })
  }

// export const topPerformers = async ({ limit = 10, programId }) => {
export const topPerformers = async () => {
  const grouped = await db.skillAssessment.findMany({
    orderBy: {
      overallScore: 'desc',
    },
    include: {
      user: { include: { profile: true } },
    },
    take: 10,
  })

  return grouped
}

export const SkillAssessment: SkillAssessmentRelationResolvers = {
  user: (_obj, { root }) => {
    return db.skillAssessment.findUnique({ where: { id: root?.id } }).user()
  },
  program: (_obj, { root }) => {
    return db.skillAssessment.findUnique({ where: { id: root?.id } }).program()
  },
}
