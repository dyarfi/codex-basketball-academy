export const schema = gql`
  type SkillAssessment {
    id: String!
    userId: String!
    user: User!
    programId: String!
    program: Program!
    shooting: Int!
    dribbling: Int!
    defense: Int!
    basketballIQ: Int!
    athleticism: Int!
    overallScore: Int!
    feedback: String
    assessedBy: String
    assessmentDate: DateTime!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    skillAssessments: [SkillAssessment!]! @requireAuth
    skillAssessment(id: String!): SkillAssessment @requireAuth
  }

  input CreateSkillAssessmentInput {
    userId: String!
    programId: String!
    shooting: Int!
    dribbling: Int!
    defense: Int!
    basketballIQ: Int!
    athleticism: Int!
    overallScore: Int!
    feedback: String
    assessedBy: String
    assessmentDate: DateTime!
  }

  input UpdateSkillAssessmentInput {
    userId: String
    programId: String
    shooting: Int
    dribbling: Int
    defense: Int
    basketballIQ: Int
    athleticism: Int
    overallScore: Int
    feedback: String
    assessedBy: String
    assessmentDate: DateTime
  }

  type Mutation {
    createSkillAssessment(input: CreateSkillAssessmentInput!): SkillAssessment!
      @requireAuth
    updateSkillAssessment(
      id: String!
      input: UpdateSkillAssessmentInput!
    ): SkillAssessment! @requireAuth
    deleteSkillAssessment(id: String!): SkillAssessment! @requireAuth
  }
`
