import gql from 'graphql-tag'

export const CERTIFICATES_QUERY = gql`
  query GetCertificates {
    certificates {
      id
      userId
      programId
      classId
      title
      description
      graduationClass
      ageGroupTeam
      achievementDate
      certificateNumber
      pdfUrl
      qrCode
      issuedBy
      templateId
      signatureUrl
      verificationCode
      withAssessment
      status
      expiryDate
      verifiedAt
      revokedAt
      revokedReason
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

export const CERTIFICATE_QUERY = gql`
  query GetCertificate($id: String!) {
    certificate(id: $id) {
      id
      userId
      programId
      classId
      title
      description
      graduationClass
      ageGroupTeam
      achievementDate
      certificateNumber
      pdfUrl
      qrCode
      issuedBy
      templateId
      signatureUrl
      verificationCode
      withAssessment
      status
      expiryDate
      verifiedAt
      revokedAt
      revokedReason
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

export const ASSESSMENT_QUERY = gql`
  query GetSkillsAssessmentByProgram($id: String!) {
    skillsAssessmentsByProgram(id: $id) {
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

export const CREATE_CERTIFICATE_MUTATION = gql`
  mutation CreateCertificate($input: CreateCertificateInput!) {
    createCertificate(input: $input) {
      id
      userId
      programId
      classId
      title
      description
      graduationClass
      ageGroupTeam
      achievementDate
      certificateNumber
      pdfUrl
      qrCode
      issuedBy
      templateId
      signatureUrl
      verificationCode
      withAssessment
      status
      expiryDate
      verifiedAt
      revokedAt
      revokedReason
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_CERTIFICATE_MUTATION = gql`
  mutation UpdateCertificate($id: String!, $input: UpdateCertificateInput!) {
    updateCertificate(id: $id, input: $input) {
      id
      userId
      programId
      classId
      title
      description
      graduationClass
      ageGroupTeam
      achievementDate
      certificateNumber
      pdfUrl
      qrCode
      issuedBy
      templateId
      signatureUrl
      verificationCode
      withAssessment
      status
      expiryDate
      verifiedAt
      revokedAt
      revokedReason
      createdAt
      updatedAt
    }
  }
`

export const DELETE_CERTIFICATE_MUTATION = gql`
  mutation DeleteCertificate($id: String!) {
    deleteCertificate(id: $id) {
      id
    }
  }
`

export const VERIFY_CERTIFICATE_MUTATION = gql`
  mutation VerifyCertificate($id: String!) {
    verifyCertificate(id: $id) {
      id
      status
      verifiedAt
    }
  }
`

export const REVOKE_CERTIFICATE_MUTATION = gql`
  mutation RevokeCertificate($id: String!, $reason: String!) {
    revokeCertificate(id: $id, reason: $reason) {
      id
      status
      revokedAt
      revokedReason
    }
  }
`
