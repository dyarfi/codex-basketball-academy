export const schema = gql`
  type ClassType {
    id: String!
    programId: String!
    program: Program!
    name: String!
    description: String
    scheduleDay: String!
    scheduleTime: String!
    capacity: Int!
    currentEnrollment: Int!
    startDate: DateTime!
    endDate: DateTime
    coachId: String!
    coach: User!
    coachName: String
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    enrollments: [Enrollment]!
    attendances: [Attendance]!
  }

  type Query {
    classes: [ClassType!]! @requireAuth
    classType(id: String!): ClassType @requireAuth
  }

  input CreateClassTypeInput {
    programId: String!
    name: String!
    description: String
    scheduleDay: String!
    scheduleTime: String!
    capacity: Int!
    startDate: DateTime!
    endDate: DateTime
    coachId: String!
    coachName: String
    isActive: Boolean!
  }

  input UpdateClassTypeInput {
    programId: String
    name: String
    description: String
    scheduleDay: String
    scheduleTime: String
    capacity: Int
    startDate: DateTime
    endDate: DateTime
    coachId: String
    coachName: String
    isActive: Boolean
  }

  type Mutation {
    createClassType(input: CreateClassTypeInput!): ClassType! @requireAuth
    updateClassType(id: String!, input: UpdateClassTypeInput!): ClassType!
      @requireAuth
    deleteClassType(id: String!): ClassType! @requireAuth
  }
`
