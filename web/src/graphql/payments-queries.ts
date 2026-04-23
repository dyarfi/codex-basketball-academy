import gql from 'graphql-tag'

export const GET_PAGINATED_PAYMENTS = gql`
  query GetPaginatedPayments(
    $page: Int!
    $pageSize: Int!
    $search: String
    $status: PaymentStatus
  ) {
    paginatedPayments(
      page: $page
      pageSize: $pageSize
      search: $search
      status: $status
    ) {
      items {
        id
        userId
        user {
          email
          profile {
            firstName
            lastName
          }
        }
        amount
        currency
        status
        description
        createdAt
      }
      totalCount
    }
  }
`

export const GET_PAGINATED_INVOICES = gql`
  query GetPaginatedInvoices(
    $page: Int!
    $pageSize: Int!
    $search: String
    $status: PaymentStatus
  ) {
    paginatedInvoices(
      page: $page
      pageSize: $pageSize
      search: $search
      status: $status
    ) {
      items {
        id
        userId
        user {
          email
          profile {
            firstName
            lastName
          }
        }
        invoiceNumber
        amount
        dueDate
        paidDate
        status
        description
        createdAt
      }
      totalCount
    }
  }
`
