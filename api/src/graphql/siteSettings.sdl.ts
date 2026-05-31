export const schema = gql`
  type SiteSetting {
    id: Int!
    key: String!
    label: String!
    group: String!
    value: String!
    valueType: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    siteSettings: [SiteSetting!]! @requireAuth
    siteSettingsByGroup(group: String!): [SiteSetting!]! @requireAuth
    siteSetting(id: Int!): SiteSetting @requireAuth
    siteSettingByKey(key: String!): SiteSetting @requireAuth
  }

  type Mutation {
    createSiteSetting(
      key: String!
      label: String!
      group: String!
      value: String!
      valueType: String
    ): SiteSetting! @requireAuth

    updateSiteSetting(
      id: Int!
      label: String
      value: String
      valueType: String
    ): SiteSetting! @requireAuth

    deleteSiteSetting(id: Int!): Boolean! @requireAuth
  }
`
