import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const createUser: MutationResolvers['createUser'] = ({ input }) => {
  return db.user.create({
    data: input,
  })
}

export const updateUser: MutationResolvers['updateUser'] = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const User: UserRelationResolvers = {
  profile: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).profile()
  },
  enrollments: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).enrollments()
  },
  attendances: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).attendances()
  },
  payments: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).payments()
  },
  invoices: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).invoices()
  },
  certificates: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).certificates()
  },
  skillAssessments: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).skillAssessments()
  },
  playerStats: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).playerStats()
  },
  announcements: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).announcements()
  },
  sentMessages: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).sentMessages()
  },
  receivedMessages: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).receivedMessages()
  },
  classesAsTutor: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).classesAsTutor()
  },
}
