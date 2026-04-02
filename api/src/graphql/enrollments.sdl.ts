export const schema = gql`
  type Enrollment {
    id: String!
    userId: String!
    user: User!
    classId: String!
    class: Class!
    programId: String!
    program: Program!
    enrollmentDate: DateTime!
    completionDate: DateTime
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    enrollments: [Enrollment!]! @requireAuth
    enrollment(id: String!): Enrollment @requireAuth
  }

  input CreateEnrollmentInput {
    userId: String!
    classId: String!
    programId: String!
    enrollmentDate: DateTime!
    completionDate: DateTime
    status: String!
  }

  input UpdateEnrollmentInput {
    userId: String
    classId: String
    programId: String
    enrollmentDate: DateTime
    completionDate: DateTime
    status: String
  }

  type Mutation {
    createEnrollment(input: CreateEnrollmentInput!): Enrollment! @requireAuth
    updateEnrollment(id: String!, input: UpdateEnrollmentInput!): Enrollment!
      @requireAuth
    deleteEnrollment(id: String!): Enrollment! @requireAuth
  }
`
