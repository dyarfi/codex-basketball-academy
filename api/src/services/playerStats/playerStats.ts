import { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  PlayerStatsRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const paginatedPlayerStats: QueryResolvers['paginatedPlayerStats'] =
  async ({ page = 1, pageSize = 10, search, userId, dateFrom, dateTo }) => {
    const conditions: Prisma.PlayerStatsWhereInput[] = []
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
                    OR: [
                      {
                        firstName: {
                          contains: searchTerm,
                          mode: 'insensitive',
                        },
                      },
                      {
                        lastName: {
                          contains: searchTerm,
                          mode: 'insensitive',
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            gameName: {
              contains: searchTerm,
            },
          },
        ],
      })
    }

    if (userId) {
      conditions.push({ userId })
    }

    if (dateFrom || dateTo) {
      conditions.push({
        gameDate: {
          ...(dateFrom ? { gte: dateFrom } : {}),
          ...(dateTo ? { lte: dateTo } : {}),
        },
      })
    }

    const where: Prisma.PlayerStatsWhereInput | undefined =
      conditions.length > 0 ? { AND: conditions } : undefined
    const safePageSize = Math.max(1, pageSize)
    const totalCount = await db.playerStats.count({ where })
    const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize))
    const currentPage = Math.min(Math.max(1, page), totalPages)
    const skip = (currentPage - 1) * safePageSize

    const items = await db.playerStats.findMany({
      where,
      orderBy: [{ gameDate: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
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

export const playerStats: QueryResolvers['playerStats'] = () => {
  return db.playerStats.findMany()
}

export const playerStat: QueryResolvers['playerStat'] = ({ id }) => {
  return db.playerStats.findUnique({
    where: { id },
  })
}

export const createPlayerStat: MutationResolvers['createPlayerStat'] = ({
  input,
}) => {
  return db.playerStats.create({
    data: input as Prisma.PlayerStatsUncheckedCreateInput,
  })
}

export const updatePlayerStat: MutationResolvers['updatePlayerStat'] = ({
  id,
  input,
}) => {
  const data = Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== null)
  ) as Prisma.PlayerStatsUncheckedUpdateInput

  return db.playerStats.update({
    data,
    where: { id },
  })
}

export const deletePlayerStat: MutationResolvers['deletePlayerStat'] = ({
  id,
}) => {
  return db.playerStats.delete({
    where: { id },
  })
}

export const PlayerStats: PlayerStatsRelationResolvers = {
  user: (_obj, { root }) => {
    return db.playerStats.findUniqueOrThrow({ where: { id: root?.id } }).user()
  },
}
