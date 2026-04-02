import type {
  QueryResolvers,
  MutationResolvers,
  ClassTypeRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const classes: QueryResolvers['classes'] = () => {
  return db.class.findMany()
}

export const classType: QueryResolvers['classType'] = ({ id }) => {
  return db.class.findUnique({
    where: { id },
  })
}

export const createClassType: MutationResolvers['createClassType'] = ({
  input,
}) => {
  return db.class.create({
    data: input,
  })
}

export const updateClassType: MutationResolvers['updateClassType'] = ({
  id,
  input,
}) => {
  return db.class.update({
    data: input,
    where: { id },
  })
}

export const deleteClassType: MutationResolvers['deleteClassType'] = ({
  id,
}) => {
  return db.class.delete({
    where: { id },
  })
}

export const ClassType: ClassTypeRelationResolvers = {
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
