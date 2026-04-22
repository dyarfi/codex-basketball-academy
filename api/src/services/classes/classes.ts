import type {
  QueryResolvers,
  MutationResolvers,
  ClassRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const classroom: QueryResolvers['classroom'] = ({ id }) => {
  return db.class.findUnique({
    where: { id },
  })
}

export const classes: QueryResolvers['classes'] = () => {
  return db.class.findMany()
}

export const classType: QueryResolvers['classType'] = ({ id }) => {
  return db.class.findUnique({
    where: { id },
  })
}

export const createClass: MutationResolvers['createClass'] = ({ input }) => {
  return db.class.create({
    data: input,
  })
}

export const updateClass: MutationResolvers['updateClass'] = ({
  id,
  input,
}) => {
  return db.class.update({
    data: input,
    where: { id },
  })
}

export const deleteClass: MutationResolvers['deleteClass'] = ({ id }) => {
  return db.class.delete({
    where: { id },
  })
}

export const Class: ClassRelationResolvers = {
  program: (_obj, { root }) => {
    return db.class.findUnique({ where: { id: root?.id } }).program()
  },
  coach: (_obj, { root }) => {
    return db.class.findUnique({ where: { id: root?.id } }).coach()
  },
  enrollments: (_obj, { root }) => {
    return db.class.findUnique({ where: { id: root?.id } }).enrollments()
  },
  attendances: (_obj, { root }) => {
    return db.class.findUnique({ where: { id: root?.id } }).attendances()
  },
}
