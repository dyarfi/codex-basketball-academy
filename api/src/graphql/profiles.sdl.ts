export const schema = gql`
  type Profile {
    id: String!
    userId: String!
    user: User!
    firstName: String!
    lastName: String!
    gender: String
    dateOfBirth: DateTime
    phoneNumber: String
    address: String
    city: String
    state: String
    zipCode: String
    country: String
    position: String
    jerseyNumber: Int
    heightCm: Float
    weightKg: Float
    medicalInfo: String
    emergencyContactName: String
    emergencyContactPhone: String
    relationshipToPlayer: String
    playerUserId: String
    profilePhoto: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    profiles: [Profile!]! @requireAuth
    profile(id: String!): Profile @requireAuth
  }

  input CreateProfileInput {
    firstName: String!
    lastName: String!
    gender: String
    dateOfBirth: DateTime
    phoneNumber: String
    address: String
    city: String
    state: String
    zipCode: String
    country: String
    position: String
    jerseyNumber: Int
    heightCm: Float
    weightKg: Float
    medicalInfo: String
    emergencyContactName: String
    emergencyContactPhone: String
    relationshipToPlayer: String
    playerUserId: String
    profilePhoto: String
  }

  input UpdateProfileInput {
    firstName: String
    lastName: String
    gender: String
    dateOfBirth: DateTime
    phoneNumber: String
    address: String
    city: String
    state: String
    zipCode: String
    country: String
    position: String
    jerseyNumber: Int
    heightCm: Float
    weightKg: Float
    medicalInfo: String
    emergencyContactName: String
    emergencyContactPhone: String
    relationshipToPlayer: String
    playerUserId: String
    profilePhoto: String
  }

  type Mutation {
    createProfile(input: CreateProfileInput!): Profile! @requireAuth
    updateProfile(id: String!, input: UpdateProfileInput!): Profile!
      @requireAuth
    deleteProfile(id: String!): Profile! @requireAuth
  }
`
