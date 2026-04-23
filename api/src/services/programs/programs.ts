import type {
  QueryResolvers,
  MutationResolvers,
  ProgramRelationResolvers,
} from 'types/graphql'
import { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'

export const programs: QueryResolvers['programs'] = () => {
  return db.program.findMany()
}

export const paginatedPrograms: QueryResolvers['paginatedPrograms'] = async ({
  page = 1,
  pageSize = 10,
  search,
  level,
  isActive,
}) => {
  const conditions: Prisma.ProgramWhereInput[] = []
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

  if (level) {
    conditions.push({ level })
  }

  if (typeof isActive === 'boolean') {
    conditions.push({ isActive })
  }

  const where: Prisma.ProgramWhereInput | undefined =
    conditions.length > 0 ? { AND: conditions } : undefined
  const safePage = Math.max(1, page)
  const safePageSize = Math.max(1, pageSize)
  const skip = (safePage - 1) * safePageSize

  const [items, totalCount] = await Promise.all([
    db.program.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: safePageSize,
    }),
    db.program.count({ where }),
  ])

  return {
    items,
    totalCount,
  }
}

export const program: QueryResolvers['program'] = ({ id }) => {
  return db.program.findUnique({
    where: { id },
  })
}

export const createProgram: MutationResolvers['createProgram'] = ({
  input,
}) => {
  return db.program.create({
    data: input,
  })
}

export const updateProgram: MutationResolvers['updateProgram'] = ({
  id,
  input,
}) => {
  return db.program.update({
    data: input,
    where: { id },
  })
}

export const deleteProgram: MutationResolvers['deleteProgram'] = ({ id }) => {
  return db.program.delete({
    where: { id },
  })
}

export const Program: ProgramRelationResolvers = {
  classes: (_obj, { root }) => {
    return db.program.findUnique({ where: { id: root?.id } }).classes()
  },
  enrollments: (_obj, { root }) => {
    return db.program.findUnique({ where: { id: root?.id } }).enrollments()
  },
  certificates: (_obj, { root }) => {
    return db.program.findUnique({ where: { id: root?.id } }).certificates()
  },
  skillAssessments: (_obj, { root }) => {
    return db.program.findUnique({ where: { id: root?.id } }).skillAssessments()
  },
}
