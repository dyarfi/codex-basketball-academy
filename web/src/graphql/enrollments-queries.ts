import gql from 'graphql-tag'

export const CREATE_ENROLLMENT = gql`
  mutation CreateEnrollment($input: CreateEnrollmentInput!) {
    createEnrollment(input: $input) {
      id
      userId
      classId
      programId
      status
      enrollmentDate
    }
  }
`
