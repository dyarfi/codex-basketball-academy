export const schema = gql`
  type Invoice {
    id: String!
    userId: String!
    user: User!
    invoiceNumber: String!
    amount: Float!
    dueDate: DateTime!
    paidDate: DateTime
    status: PaymentStatus!
    description: String
    payments: [Payment]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum PaymentStatus {
    PENDING
    COMPLETED
    FAILED
    REFUNDED
  }

  type Query {
    invoices: [Invoice!]! @requireAuth
    invoice(id: String!): Invoice @requireAuth
  }

  input CreateInvoiceInput {
    userId: String!
    invoiceNumber: String!
    amount: Float!
    dueDate: DateTime!
    paidDate: DateTime
    status: PaymentStatus!
    description: String
  }

  input UpdateInvoiceInput {
    userId: String
    invoiceNumber: String
    amount: Float
    dueDate: DateTime
    paidDate: DateTime
    status: PaymentStatus
    description: String
  }

  type Mutation {
    createInvoice(input: CreateInvoiceInput!): Invoice! @requireAuth
    updateInvoice(id: String!, input: UpdateInvoiceInput!): Invoice!
      @requireAuth
    deleteInvoice(id: String!): Invoice! @requireAuth
  }
`
