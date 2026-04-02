export const schema = gql`
  type Program {
    id: String!
    name: String!
    description: String
    level: ProgramLevel!
    minAge: Int
    maxAge: Int
    capacity: Int!
    durationWeeks: Int!
    pricePerMonth: Float!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    classes: [Class]!
    enrollments: [Enrollment]!
    certificates: [Certificate]!
    skillAssessments: [SkillAssessment]!
  }

  enum ProgramLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
    ELITE
  }

  type Query {
    programs: [Program!]! @requireAuth
    program(id: String!): Program @requireAuth
  }

  input CreateProgramInput {
    name: String!
    description: String
    level: ProgramLevel!
    minAge: Int
    maxAge: Int
    capacity: Int!
    durationWeeks: Int!
    pricePerMonth: Float!
    isActive: Boolean!
  }

  input UpdateProgramInput {
    name: String
    description: String
    level: ProgramLevel
    minAge: Int
    maxAge: Int
    capacity: Int
    durationWeeks: Int
    pricePerMonth: Float
    isActive: Boolean
  }

  type Mutation {
    createProgram(input: CreateProgramInput!): Program! @requireAuth
    updateProgram(id: String!, input: UpdateProgramInput!): Program!
      @requireAuth
    deleteProgram(id: String!): Program! @requireAuth
  }
`
