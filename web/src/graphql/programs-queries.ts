import gql from 'graphql-tag'

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
    }
  }
`

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

export const DELETE_PROGRAM = gql`
  mutation DeleteProgram($id: String!) {
    deleteProgram(id: $id) {
      id
      name
    }
  }
`
