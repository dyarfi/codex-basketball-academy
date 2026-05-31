export const schema = gql`
  type Payment {
    id: String!
    userId: String!
    user: User!
    amount: Float!
    currency: String!
    status: PaymentStatus!
    stripePaymentIntentId: String
    stripeTransactionId: String
    description: String
    invoiceId: String
    invoice: Invoice
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type PaginatedPayments {
    items: [Payment!]!
    totalCount: Int!
    currentPage: Int!
    pageSize: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  enum PaymentStatus {
    PENDING
    COMPLETED
    FAILED
    REFUNDED
  }

  type Query {
    payments: [Payment!]! @requireAuth
    payment(id: String!): Payment @requireAuth
    paginatedPayments(
      page: Int = 1
      pageSize: Int = 10
      search: String
      status: PaymentStatus
    ): PaginatedPayments! @requireAuth
  }

  input CreatePaymentInput {
    userId: String!
    amount: Float!
    currency: String!
    status: PaymentStatus!
    stripePaymentIntentId: String
    stripeTransactionId: String
    description: String
    invoiceId: String
  }

  input UpdatePaymentInput {
    userId: String
    amount: Float
    currency: String
    status: PaymentStatus
    stripePaymentIntentId: String
    stripeTransactionId: String
    description: String
    invoiceId: String
  }

  type Mutation {
    createPayment(input: CreatePaymentInput!): Payment! @requireAuth
    updatePayment(id: String!, input: UpdatePaymentInput!): Payment!
      @requireAuth
    deletePayment(id: String!): Payment! @requireAuth
  }
`
