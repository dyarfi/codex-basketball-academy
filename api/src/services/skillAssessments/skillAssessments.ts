import type {
  QueryResolvers,
  MutationResolvers,
  SkillAssessmentRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const skillAssessments: QueryResolvers['skillAssessments'] = () => {
  return db.skillAssessment.findMany()
}

export const skillAssessment: QueryResolvers['skillAssessment'] = ({ id }) => {
  return db.skillAssessment.findUnique({
    where: { id },
  })
}

export const createSkillAssessment: MutationResolvers['createSkillAssessment'] =
  ({ input }) => {
    return db.skillAssessment.create({
      data: input,
    })
  }

export const updateSkillAssessment: MutationResolvers['updateSkillAssessment'] =
  ({ id, input }) => {
    return db.skillAssessment.update({
      data: input,
      where: { id },
    })
  }

export const deleteSkillAssessment: MutationResolvers['deleteSkillAssessment'] =
  ({ id }) => {
    return db.skillAssessment.delete({
      where: { id },
    })
  }

export const SkillAssessment: SkillAssessmentRelationResolvers = {
  user: (_obj, { root }) => {
    return db.skillAssessment.findUnique({ where: { id: root?.id } }).user()
  },
  program: (_obj, { root }) => {
    return db.skillAssessment.findUnique({ where: { id: root?.id } }).program()
  },
}
