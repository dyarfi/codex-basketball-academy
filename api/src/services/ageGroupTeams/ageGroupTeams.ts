import { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  AgeGroupTeamRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const ageGroupTeams: QueryResolvers['ageGroupTeams'] = () => {
  return db.ageGroupTeam.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export const publicAgeGroupTeams: QueryResolvers['publicAgeGroupTeams'] =
  () => {
    return db.ageGroupTeam.findMany({
      where: { isActive: true },
      orderBy: [{ ageGroup: 'desc' }, { createdAt: 'desc' }],
      include: {
        coach: { include: { profile: true } },
        players: {
          where: { isActive: true, role: 'PLAYER' },
          include: { profile: true },
          orderBy: { createdAt: 'desc' },
          limit: 15,
        },
      },
    })
  }

export const paginatedAgeGroupTeams: QueryResolvers['paginatedAgeGroupTeams'] =
  async ({ page = 1, pageSize = 10, search, ageGroup, isActive }) => {
    const conditions: Prisma.AgeGroupTeamWhereInput[] = []
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

    if (ageGroup) {
      conditions.push({ ageGroup })
    }

    if (typeof isActive === 'boolean') {
      conditions.push({ isActive })
    }

    const where: Prisma.AgeGroupTeamWhereInput | undefined =
      conditions.length > 0 ? { AND: conditions } : undefined
    const safePageSize = Math.max(1, pageSize)
    const totalCount = await db.ageGroupTeam.count({ where })
    const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize))
    const currentPage = Math.min(Math.max(1, page), totalPages)
    const skip = (currentPage - 1) * safePageSize

    const items = await db.ageGroupTeam.findMany({
      where,
      orderBy: [{ name: 'asc' }, { id: 'desc' }],
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

export const ageGroupTeam: QueryResolvers['ageGroupTeam'] = ({ id }) => {
  return db.ageGroupTeam.findUnique({
    where: { id },
  })
}

export const createAgeGroupTeam: MutationResolvers['createAgeGroupTeam'] = ({
  input,
}) => {
  const { playerIds, ...rest } = input
  return db.ageGroupTeam.create({
    data: {
      ...rest,
      players: playerIds
        ? {
            connect: playerIds.map((id) => ({ id })),
          }
        : undefined,
    },
  })
}

export const updateAgeGroupTeam: MutationResolvers['updateAgeGroupTeam'] = ({
  id,
  input,
}) => {
  const { playerIds, ...rest } = input
  return db.ageGroupTeam.update({
    where: { id },
    data: {
      ...rest,
      players: playerIds
        ? {
            set: playerIds.map((id) => ({ id })),
          }
        : undefined,
    },
  })
}

export const deleteAgeGroupTeam: MutationResolvers['deleteAgeGroupTeam'] = ({
  id,
}) => {
  return db.ageGroupTeam.delete({
    where: { id },
  })
}

export const AgeGroupTeam: AgeGroupTeamRelationResolvers = {
  coach: (_obj, { root }) => {
    return db.ageGroupTeam.findUnique({ where: { id: root?.id } }).coach()
  },
  players: (_obj, { root }) => {
    return db.ageGroupTeam.findUnique({ where: { id: root?.id } }).players()
  },
}
