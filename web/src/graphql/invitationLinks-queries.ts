import { gql } from '@apollo/client'

export const GET_INVITATION_LINKS = gql`
  query GetInvitationLinks {
    invitationLinks {
      id
      code
      url
      purpose
      maxUses
      useCount
      expiresAt
      usedAt
      createdBy {
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

export const GET_INVITATION_LINK = gql`
  query GetInvitationLink($id: Int!) {
    invitationLink(id: $id) {
      id
      code
      url
      purpose
      maxUses
      useCount
      expiresAt
      usedAt
      createdBy {
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

export const CREATE_INVITATION_LINK = gql`
  mutation CreateInvitationLink($input: CreateInvitationLinkInput!) {
    createInvitationLink(input: $input) {
      id
      code
      url
      purpose
      maxUses
      useCount
      expiresAt
      usedAt
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_INVITATION_LINK = gql`
  mutation UpdateInvitationLink($id: Int!, $input: UpdateInvitationLinkInput!) {
    updateInvitationLink(id: $id, input: $input) {
      id
      code
      url
      purpose
      maxUses
      useCount
      expiresAt
      usedAt
      createdAt
      updatedAt
    }
  }
`

export const DELETE_INVITATION_LINK = gql`
  mutation DeleteInvitationLink($id: Int!) {
    deleteInvitationLink(id: $id) {
      id
    }
  }
`
