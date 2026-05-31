import type {
  QueryResolvers,
  MutationResolvers,
  PaymentRelationResolvers,
} from 'types/graphql'
import { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'

export const payments: QueryResolvers['payments'] = () => {
  return db.payment.findMany()
}

export const paginatedPayments: QueryResolvers['paginatedPayments'] = async ({
  page = 1,
  pageSize = 10,
  search,
  status,
}) => {
  const conditions: Prisma.PaymentWhereInput[] = []
  const searchTerm = search?.trim()

  if (searchTerm) {
    conditions.push({
      OR: [
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          user: {
            is: {
              email: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          user: {
            is: {
              profile: {
                is: {
                  firstName: {
                    contains: searchTerm,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        },
        {
          user: {
            is: {
              profile: {
                is: {
                  lastName: {
                    contains: searchTerm,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        },
      ],
    })
  }

  if (status) {
    conditions.push({ status })
  }

  const where: Prisma.PaymentWhereInput | undefined =
    conditions.length > 0 ? { AND: conditions } : undefined
  const safePageSize = Math.max(1, pageSize)
  const totalCount = await db.payment.count({ where })
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const skip = (currentPage - 1) * safePageSize

  const items = await db.payment.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    skip,
    take: safePageSize,
  })

  return {
    items,
    totalCount,
    currentPage,
    pageSize: safePageSize,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }
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
