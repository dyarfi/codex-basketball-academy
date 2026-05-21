export const schema = gql`
  enum CertificateStatus {
    DRAFT
    ISSUED
    REVOKED
    EXPIRED
  }

  type Certificate {
    id: String!
    userId: String!
    user: User!
    programId: String!
    program: Program!
    classId: String
    class: Class
    title: String!
    description: String
    graduationClass: String
    ageGroupTeam: String
    achievementDate: DateTime!
    certificateNumber: String!
    pdfUrl: String
    qrCode: String
    issuedBy: String
    templateId: String
    signatureUrl: String
    verificationCode: String!
    status: CertificateStatus!
    expiryDate: DateTime
    verifiedAt: DateTime
    revokedAt: DateTime
    revokedReason: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    certificates: [Certificate!]! @requireAuth
    certificate(id: String!): Certificate @requireAuth
    verifyCertificateByCode(verificationCode: String!): Certificate @skipAuth
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
    verificationCode: String!
    pdfUrl: String
    qrCode: String
    issuedBy: String
    templateId: String
    signatureUrl: String
    expiryDate: DateTime
    status: CertificateStatus
    verifiedAt: DateTime
    revokedAt: DateTime
    revokedReason: String
    createdAt: DateTime
    updatedAt: DateTime
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
    verificationCode: String!
    pdfUrl: String
    qrCode: String
    issuedBy: String
    templateId: String
    signatureUrl: String
    expiryDate: DateTime
    status: CertificateStatus
    verifiedAt: DateTime
    revokedAt: DateTime
    revokedReason: String
  }

  type Mutation {
    createCertificate(input: CreateCertificateInput!): Certificate! @requireAuth
    updateCertificate(
      id: String!
      input: UpdateCertificateInput!
    ): Certificate! @requireAuth
    deleteCertificate(id: String!): Certificate! @requireAuth
    verifyCertificate(id: String!): Certificate! @requireAuth
    revokeCertificate(id: String!, reason: String!): Certificate! @requireAuth
  }
`
