import type {
  QueryResolvers,
  MutationResolvers,
  PaymentRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const payments: QueryResolvers['payments'] = () => {
  return db.payment.findMany()
}

export const payment: QueryResolvers['payment'] = ({ id }) => {
  return db.payment.findUnique({
    where: { id },
  })
}

export const createPayment: MutationResolvers['createPayment'] = ({
  input,
}) => {
  return db.payment.create({
    data: input,
  })
}

export const updatePayment: MutationResolvers['updatePayment'] = ({
  id,
  input,
}) => {
  return db.payment.update({
    data: input,
    where: { id },
  })
}

export const deletePayment: MutationResolvers['deletePayment'] = ({ id }) => {
  return db.payment.delete({
    where: { id },
  })
}

export const Payment: PaymentRelationResolvers = {
  user: (_obj, { root }) => {
    return db.payment.findUnique({ where: { id: root?.id } }).user()
  },
  invoice: (_obj, { root }) => {
    return db.payment.findUnique({ where: { id: root?.id } }).invoice()
  },
}
