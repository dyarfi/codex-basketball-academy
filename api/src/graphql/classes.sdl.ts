export const schema = gql`
  type Class {
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

  type PaginatedClasses {
    items: [Class!]!
    totalCount: Int!
  }

  type Query {
    classroom(id: String!): Class @requireAuth
    classes: [Class!]! @requireAuth
    classType(id: String!): Class @requireAuth
    paginatedClasses(
      page: Int = 1
      pageSize: Int = 10
      search: String
      programId: String
      coachId: String
      isActive: Boolean
    ): PaginatedClasses! @requireAuth
  }

  input CreateClassInput {
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

  input UpdateClassInput {
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
    createClass(input: CreateClassInput!): Class! @requireAuth
    updateClass(id: String!, input: UpdateClassInput!): Class! @requireAuth
    deleteClass(id: String!): Class! @requireAuth
  }
`
