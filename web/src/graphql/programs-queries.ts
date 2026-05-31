import gql from 'graphql-tag'

/**
 * Fetch all programs
 */
export const GET_PROGRAMS = gql`
  query GetPrograms {
    programs {
      id
      name
      description
      level
      minAge
      maxAge
      capacity
      durationWeeks
      pricePerMonth
      isActive
      createdAt
      updatedAt
    }
  }
`

export const GET_PAGINATED_PROGRAMS = gql`
  query GetPaginatedPrograms(
    $page: Int!
    $pageSize: Int!
    $search: String
    $level: ProgramLevel
    $isActive: Boolean
  ) {
    paginatedPrograms(
      page: $page
      pageSize: $pageSize
      search: $search
      level: $level
      isActive: $isActive
    ) {
      items {
        id
        name
        description
        level
        minAge
        maxAge
        capacity
        durationWeeks
        pricePerMonth
        isActive
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
 * Fetch a single program by ID
 */
export const GET_PROGRAM = gql`
  query GetProgram($id: String!) {
    program(id: $id) {
      id
      name
      description
      level
      minAge
      maxAge
      capacity
      durationWeeks
      pricePerMonth
      isActive
      createdAt
      updatedAt
      classes {
        id
        name
        description
        scheduleDay
        scheduleTime
        capacity
        currentEnrollment
        coachName
        startDate
        endDate
        coach {
          id
          profile {
            firstName
            lastName
          }
        }
      }
    }
  }
`

/**
 * Create a new program
 */
export const CREATE_PROGRAM = gql`
  mutation CreateProgram($input: CreateProgramInput!) {
    createProgram(input: $input) {
      id
      name
      description
      level
      minAge
      maxAge
      capacity
      durationWeeks
      pricePerMonth
      isActive
      createdAt
      updatedAt
    }
  }
`

/**
 * Update an existing program
 */
export const UPDATE_PROGRAM = gql`
  mutation UpdateProgram($id: String!, $input: UpdateProgramInput!) {
    updateProgram(id: $id, input: $input) {
      id
      name
      description
      level
      minAge
      maxAge
      capacity
      durationWeeks
      pricePerMonth
      isActive
      createdAt
      updatedAt
    }
  }
`

/**
 * Delete a program by ID
 */
export const DELETE_PROGRAM = gql`
  mutation DeleteProgram($id: String!) {
    deleteProgram(id: $id) {
      id
      name
    }
  }
`
