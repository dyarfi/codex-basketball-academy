import { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  PlayerStatsRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const paginatedPlayerStats: QueryResolvers['paginatedPlayerStats'] =
  async ({
    page = 1,
    pageSize = 10,
    search,
    userId,
    liveGameSessionId,
  }) => {
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
            liveGameSession: {
              is: {
                gameName: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
          },
        ],
      })
    }

    if (userId) {
      conditions.push({ userId })
    }

    if (liveGameSessionId) {
      conditions.push({ liveGameSessionId })
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
      orderBy: [{ id: 'desc' }],
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

export const createBulkPlayerStats: MutationResolvers['createBulkPlayerStats'] =
  async ({ inputs }) => {
    const results = []
    for (const input of inputs) {
      const existing = await db.playerStats.findFirst({
        where: {
          userId: input.userId,
          liveGameSessionId: input.liveGameSessionId,
        },
      })

      if (existing) {
        const updated = await db.playerStats.update({
          where: { id: existing.id },
          data: {
            points: input.points,
            rebounds: input.rebounds,
            assists: input.assists,
            steals: input.steals,
            blocks: input.blocks,
            minutesPlayed: input.minutesPlayed,
          },
        })
        results.push(updated)
      } else {
        const created = await db.playerStats.create({
          data: input as Prisma.PlayerStatsUncheckedCreateInput,
        })
        results.push(created)
      }
    }
    return results
  }

export const PlayerStats: PlayerStatsRelationResolvers = {
  user: (_obj, { root }) => {
    return db.playerStats.findUniqueOrThrow({ where: { id: root?.id } }).user()
  },
  liveGameSession: (_obj, { root }) => {
    return db.playerStats.findUnique({ where: { id: root?.id } }).liveGameSession()
  },
}
