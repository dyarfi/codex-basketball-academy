import type {
  QueryResolvers,
  MutationResolvers,
  EnrollmentRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const enrollments: QueryResolvers['enrollments'] = () => {
  return db.enrollment.findMany()
}

export const enrollment: QueryResolvers['enrollment'] = ({ id }) => {
  return db.enrollment.findUnique({
    where: { id },
  })
}

export const createEnrollment: MutationResolvers['createEnrollment'] = ({
  input,
}) => {
  return db.enrollment.create({
    data: input,
  })
}

export const updateEnrollment: MutationResolvers['updateEnrollment'] = ({
  id,
  input,
}) => {
  return db.enrollment.update({
    data: input,
    where: { id },
  })
}

export const deleteEnrollment: MutationResolvers['deleteEnrollment'] = ({
  id,
}) => {
  return db.enrollment.delete({
    where: { id },
  })
}

export const Enrollment: EnrollmentRelationResolvers = {
  user: (_obj, { root }) => {
    return db.enrollment.findUnique({ where: { id: root?.id } }).user()
  },
  class: (_obj, { root }) => {
    return db.enrollment.findUnique({ where: { id: root?.id } }).class()
  },
  program: (_obj, { root }) => {
    return db.enrollment.findUnique({ where: { id: root?.id } }).program()
  },
}
