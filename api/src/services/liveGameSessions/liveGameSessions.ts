import type {
  QueryResolvers,
  MutationResolvers,
  LiveGameSessionRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const liveGameSessionsByName: QueryResolvers['liveGameSessionsByName'] =
  ({ gameName }) => {
    return db.liveGameSession.findMany({
      where: { gameName },
    })
  }

export const liveGameSessions: QueryResolvers['liveGameSessions'] = () => {
  return db.liveGameSession.findMany({
    where: { gameFinished: true },
    orderBy: { createdAt: 'desc' },
  })
}

export const liveGameSession: QueryResolvers['liveGameSession'] = ({ id }) => {
  return db.liveGameSession.findUnique({
    where: { id },
  })
}

export const createLiveGameSession: MutationResolvers['createLiveGameSession'] =
  ({ input }) => {
    return db.liveGameSession.create({
      data: input,
    })
  }

export const updateLiveGameSession: MutationResolvers['updateLiveGameSession'] =
  ({ id, input }) => {
    return db.liveGameSession.update({
      data: input,
      where: { id },
    })
  }

export const deleteLiveGameSession: MutationResolvers['deleteLiveGameSession'] =
  ({ id }) => {
    return db.liveGameSession.delete({
      where: { id },
    })
  }

export const LiveGameSession: LiveGameSessionRelationResolvers = {
  team: (_obj, { root }) => {
    return db.liveGameSession.findUnique({ where: { id: root?.id } }).team()
  },
  playerStats: (_obj, { root }) => {
    return db.liveGameSession
      .findUnique({ where: { id: root?.id } })
      .playerStats()
  },
}
