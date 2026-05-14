import gql from 'graphql-tag'

/**
 * Fetch all classes
 */
export const GET_CLASSES = gql`
  query GetClasses {
    classes {
      id
      name
      description
      scheduleDay
      scheduleTime
      capacity
      currentEnrollment
      isActive
      startDate
      endDate
      program {
        id
        name
      }
      coach {
        id
        email
        profile {
          firstName
          lastName
        }
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_PAGINATED_CLASSES = gql`
  query GetPaginatedClasses(
    $page: Int!
    $pageSize: Int!
    $search: String
    $programId: String
    $coachId: String
    $isActive: Boolean
  ) {
    paginatedClasses(
      page: $page
      pageSize: $pageSize
      search: $search
      programId: $programId
      coachId: $coachId
      isActive: $isActive
    ) {
      items {
        id
        name
        description
        scheduleDay
        scheduleTime
        capacity
        currentEnrollment
        isActive
        startDate
        endDate
        program {
          id
          name
        }
        coach {
          id
          email
          profile {
            firstName
            lastName
          }
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
 * Fetch a single class by ID
 */
export const GET_CLASS = gql`
  query GetClass($id: String!) {
    classroom(id: $id) {
      id
      name
      description
      scheduleDay
      scheduleTime
      capacity
      currentEnrollment
      isActive
      startDate
      endDate
      programId
      coachId
    }
  }
`

/**
 * Create a new class
 */
export const CREATE_CLASS = gql`
  mutation CreateClass($input: CreateClassInput!) {
    createClass(input: $input) {
      id
      name
      isActive
      createdAt
    }
  }
`

/**
 * Update an existing class
 */
export const UPDATE_CLASS = gql`
  mutation UpdateClass($id: String!, $input: UpdateClassInput!) {
    updateClass(id: $id, input: $input) {
      id
      name
      isActive
      updatedAt
    }
  }
`

/**
 * Delete a class by ID
 */
export const DELETE_CLASS = gql`
  mutation DeleteClass($id: String!) {
    deleteClass(id: $id) {
      id
      name
    }
  }
`

export const CLASSES_QUERY = gql`
  query GetClasses {
    classes {
      id
      name
      description
      scheduleDay
      scheduleTime
      capacity
      currentEnrollment
      isActive
      startDate
      endDate
      program {
        id
        name
      }
      coach {
        id
        email
        profile {
          firstName
          lastName
        }
      }
      createdAt
      updatedAt
    }
  }
`
