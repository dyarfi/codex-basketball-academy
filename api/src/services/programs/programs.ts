import type {
  QueryResolvers,
  MutationResolvers,
  ProgramRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const programs: QueryResolvers['programs'] = () => {
  return db.program.findMany()
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
