import gql from 'graphql-tag'

/**
 * Fetch all enrollments
 */
export const GET_ENROLLMENTS = gql`
  query GetEnrollments {
    enrollments {
      id
      userId
      classId
      programId
      status
      enrollmentDate
      completionDate
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
      class {
        id
        name
        scheduleDay
        scheduleTime
      }
      program {
        id
        name
        level
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_PAGINATED_ENROLLMENTS = gql`
  query GetPaginatedEnrollments(
    $page: Int!
    $pageSize: Int!
    $search: String
    $programId: String
    $status: String
  ) {
    paginatedEnrollments(
      page: $page
      pageSize: $pageSize
      search: $search
      programId: $programId
      status: $status
    ) {
      items {
        id
        userId
        classId
        programId
        status
        enrollmentDate
        completionDate
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
        class {
          id
          name
          scheduleDay
          scheduleTime
        }
        program {
          id
          name
          level
        }
        createdAt
        updatedAt
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

/**
 * Fetch a single enrollment by ID
 */
export const GET_ENROLLMENT = gql`
  query GetEnrollment($id: String!) {
    enrollment(id: $id) {
      id
      userId
      classId
      programId
      status
      enrollmentDate
      completionDate
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
      class {
        id
        name
      }
      program {
        id
        name
      }
    }
  }
`

/**
 * Create a new enrollment
 */
export const CREATE_ENROLLMENT = gql`
  mutation CreateEnrollment($input: CreateEnrollmentInput!) {
    createEnrollment(input: $input) {
      id
      userId
      classId
      programId
      status
      enrollmentDate
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

/**
 * Update an existing enrollment
 */
export const UPDATE_ENROLLMENT = gql`
  mutation UpdateEnrollment($id: String!, $input: UpdateEnrollmentInput!) {
    updateEnrollment(id: $id, input: $input) {
      id
      userId
      classId
      programId
      status
      enrollmentDate
      completionDate
      updatedAt
    }
  }
`

/**
 * Delete an enrollment by ID
 */
export const DELETE_ENROLLMENT = gql`
  mutation DeleteEnrollment($id: String!) {
    deleteEnrollment(id: $id) {
      id
      userId
    }
  }
`
