import gql from 'graphql-tag'

export const ATTENDANCES_QUERY = gql`
  query GetAttendances {
    attendances {
      id
      classId
      userId
      attendanceDate
      status
      notes
      createdAt
      updatedAt
      class {
        id
        name
      }
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
    }
  }
`

export const GET_PAGINATED_ATTENDANCES = gql`
  query GetPaginatedAttendances(
    $page: Int!
    $pageSize: Int!
    $search: String
    $classId: String
    $userId: String
    $date: DateTime
    $status: AttendanceStatus
  ) {
    paginatedAttendances(
      page: $page
      pageSize: $pageSize
      search: $search
      classId: $classId
      userId: $userId
      date: $date
      status: $status
    ) {
      items {
        id
        classId
        userId
        attendanceDate
        status
        notes
        createdAt
        updatedAt
        class {
          id
          name
        }
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
      totalCount
      currentPage
      pageSize
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
`

export const ATTENDANCE_QUERY = gql`
  query GetAttendance($id: String!) {
    attendance(id: $id) {
      id
      classId
      userId
      attendanceDate
      status
      notes
      createdAt
      updatedAt
      class {
        id
        name
      }
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
    }
  }
`

export const ATTENDANCES_BY_CLASS_QUERY = gql`
  query GetAttendancesByClass($classId: String!) {
    attendancesByClass(classId: $classId) {
      id
      classId
      userId
      attendanceDate
      status
      notes
      createdAt
      updatedAt
      class {
        id
        name
      }
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
    }
  }
`

export const ATTENDANCES_BY_USER_QUERY = gql`
  query GetAttendancesByUser($userId: String!) {
    attendancesByUser(userId: $userId) {
      id
      classId
      userId
      attendanceDate
      status
      notes
      createdAt
      updatedAt
      class {
        id
        name
      }
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
    }
  }
`

export const ATTENDANCES_BY_DATE_QUERY = gql`
  query GetAttendancesByDate($date: DateTime!) {
    attendancesByDate(date: $date) {
      id
      classId
      userId
      attendanceDate
      status
      notes
      createdAt
      updatedAt
      class {
        id
        name
      }
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
    }
  }
`

export const CREATE_ATTENDANCE_MUTATION = gql`
  mutation CreateAttendance($input: CreateAttendanceInput!) {
    createAttendance(input: $input) {
      id
      classId
      userId
      attendanceDate
      status
      notes
      createdAt
      updatedAt
      class {
        id
        name
      }
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
    }
  }
`

export const UPDATE_ATTENDANCE_MUTATION = gql`
  mutation UpdateAttendance($id: String!, $input: UpdateAttendanceInput!) {
    updateAttendance(id: $id, input: $input) {
      id
      classId
      userId
      attendanceDate
      status
      notes
      createdAt
      updatedAt
      class {
        id
        name
      }
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
    }
  }
`

export const DELETE_ATTENDANCE_MUTATION = gql`
  mutation DeleteAttendance($id: String!) {
    deleteAttendance(id: $id) {
      id
    }
  }
`

export const BULK_CREATE_ATTENDANCE_MUTATION = gql`
  mutation BulkCreateAttendance($input: [CreateAttendanceInput!]!) {
    bulkCreateAttendance(input: $input) {
      id
      classId
      userId
      attendanceDate
      status
      notes
      createdAt
      updatedAt
      class {
        id
        name
      }
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
    }
  }
`
