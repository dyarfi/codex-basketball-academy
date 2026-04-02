export const schema = gql`
  type Certificate {
    id: String!
    userId: String!
    user: User!
    programId: String!
    program: Program!
    classId: String
    title: String!
    description: String
    graduationClass: String
    ageGroupTeam: String
    achievementDate: DateTime!
    certificateNumber: String!
    pdfUrl: String
    qrCode: String
    issuedBy: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    certificates: [Certificate!]! @requireAuth
    certificate(id: String!): Certificate @requireAuth
  }

  input CreateCertificateInput {
    userId: String!
    programId: String!
    classId: String
    title: String!
    description: String
    graduationClass: String
    ageGroupTeam: String
    achievementDate: DateTime!
    certificateNumber: String!
    pdfUrl: String
    qrCode: String
    issuedBy: String
  }

  input UpdateCertificateInput {
    userId: String
    programId: String
    classId: String
    title: String
    description: String
    graduationClass: String
    ageGroupTeam: String
    achievementDate: DateTime
    certificateNumber: String
    pdfUrl: String
    qrCode: String
    issuedBy: String
  }

  type Mutation {
    createCertificate(input: CreateCertificateInput!): Certificate! @requireAuth
    updateCertificate(
      id: String!
      input: UpdateCertificateInput!
    ): Certificate! @requireAuth
    deleteCertificate(id: String!): Certificate! @requireAuth
  }
`
