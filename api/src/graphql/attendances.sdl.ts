export const schema = gql`
  type Attendance {
    id: String!
    classId: String!
    class: Class!
    userId: String!
    user: User!
    attendanceDate: DateTime!
    status: AttendanceStatus!
    notes: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum AttendanceStatus {
    PRESENT
    ABSENT
    LATE
    EXCUSED
  }

  type Query {
    attendances: [Attendance!]! @requireAuth
    attendance(id: String!): Attendance @requireAuth
    attendancesByClass(classId: String!): [Attendance!]! @requireAuth
    attendancesByUser(userId: String!): [Attendance!]! @requireAuth
    attendancesByDate(date: DateTime!): [Attendance!]! @requireAuth
  }

  input CreateAttendanceInput {
    classId: String!
    userId: String!
    attendanceDate: DateTime!
    status: AttendanceStatus!
    notes: String
  }

  input UpdateAttendanceInput {
    classId: String
    userId: String
    attendanceDate: DateTime
    status: AttendanceStatus
    notes: String
  }

  type Mutation {
    createAttendance(input: CreateAttendanceInput!): Attendance! @requireAuth
    updateAttendance(id: String!, input: UpdateAttendanceInput!): Attendance!
      @requireAuth
    deleteAttendance(id: String!): Attendance! @requireAuth
    bulkCreateAttendance(input: [CreateAttendanceInput!]!): [Attendance!]!
      @requireAuth
  }
`
