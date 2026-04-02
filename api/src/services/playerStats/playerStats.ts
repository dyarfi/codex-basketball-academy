import type {
  QueryResolvers,
  MutationResolvers,
  PlayerStatRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

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
    data: input,
  })
}

export const updatePlayerStat: MutationResolvers['updatePlayerStat'] = ({
  id,
  input,
}) => {
  return db.playerStats.update({
    data: input,
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

export const PlayerStat: PlayerStatRelationResolvers = {
  user: (_obj, { root }) => {
    return db.playerStats.findUnique({ where: { id: root?.id } }).user()
  },
}
