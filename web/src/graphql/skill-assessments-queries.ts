import gql from 'graphql-tag'

/**
 * Fetch all skill assessments
 */
export const GET_SKILL_ASSESSMENTS = gql`
  query GetSkillAssessments {
    skillAssessments {
      id
      userId
      programId
      shooting
      dribbling
      defense
      basketballIQ
      athleticism
      overallScore
      feedback
      assessedBy
      assessmentDate
      createdAt
      updatedAt
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
      program {
        id
        name
      }
    }
  }
`

/**
 * Fetch paginated skill assessments
 */
export const GET_PAGINATED_SKILL_ASSESSMENTS = gql`
  query GetPaginatedSkillAssessments(
    $page: Int!
    $pageSize: Int!
    $search: String
    $programId: String
  ) {
    paginatedSkillAssessments(
      page: $page
      pageSize: $pageSize
      search: $search
      programId: $programId
    ) {
      items {
        id
        userId
        programId
        shooting
        dribbling
        defense
        basketballIQ
        athleticism
        overallScore
        feedback
        assessedBy
        assessmentDate
        createdAt
        updatedAt
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
        program {
          id
          name
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

/**
 * Fetch a single skill assessment by ID
 */
export const GET_SKILL_ASSESSMENT = gql`
  query GetSkillAssessment($id: String!) {
    skillAssessment(id: $id) {
      id
      userId
      programId
      shooting
      dribbling
      defense
      basketballIQ
      athleticism
      overallScore
      feedback
      assessedBy
      assessmentDate
      createdAt
      updatedAt
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
      program {
        id
        name
      }
    }
  }
`

/**
 * Create a new skill assessment
 */
export const CREATE_SKILL_ASSESSMENT = gql`
  mutation CreateSkillAssessment($input: CreateSkillAssessmentInput!) {
    createSkillAssessment(input: $input) {
      id
      userId
      programId
      shooting
      dribbling
      defense
      basketballIQ
      athleticism
      overallScore
      feedback
      assessedBy
      assessmentDate
      createdAt
      updatedAt
    }
  }
`

/**
 * Update an existing skill assessment
 */
export const UPDATE_SKILL_ASSESSMENT = gql`
  mutation UpdateSkillAssessment(
    $id: String!
    $input: UpdateSkillAssessmentInput!
  ) {
    updateSkillAssessment(id: $id, input: $input) {
      id
      userId
      programId
      shooting
      dribbling
      defense
      basketballIQ
      athleticism
      overallScore
      feedback
      assessedBy
      assessmentDate
      createdAt
      updatedAt
    }
  }
`

/**
 * Delete a skill assessment by ID
 */
export const DELETE_SKILL_ASSESSMENT = gql`
  mutation DeleteSkillAssessment($id: String!) {
    deleteSkillAssessment(id: $id) {
      id
    }
  }
`
