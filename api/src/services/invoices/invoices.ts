import type {
  QueryResolvers,
  MutationResolvers,
  InvoiceRelationResolvers,
} from 'types/graphql'
import { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'

export const invoices: QueryResolvers['invoices'] = () => {
  return db.invoice.findMany()
}

export const paginatedInvoices: QueryResolvers['paginatedInvoices'] = async ({
  page = 1,
  pageSize = 10,
  search,
  status,
}) => {
  const conditions: Prisma.InvoiceWhereInput[] = []
  const searchTerm = search?.trim()

  if (searchTerm) {
    conditions.push({
      OR: [
        {
          invoiceNumber: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
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

  const where: Prisma.InvoiceWhereInput | undefined =
    conditions.length > 0 ? { AND: conditions } : undefined
  const safePage = Math.max(1, page)
  const safePageSize = Math.max(1, pageSize)
  const skip = (safePage - 1) * safePageSize

  const [items, totalCount] = await Promise.all([
    db.invoice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: safePageSize,
    }),
    db.invoice.count({ where }),
  ])

  return {
    items,
    totalCount,
  }
}

export const invoice: QueryResolvers['invoice'] = ({ id }) => {
  return db.invoice.findUnique({
    where: { id },
  })
}

export const createInvoice: MutationResolvers['createInvoice'] = ({
  input,
}) => {
  return db.invoice.create({
    data: input,
  })
}

export const updateInvoice: MutationResolvers['updateInvoice'] = ({
  id,
  input,
}) => {
  return db.invoice.update({
    data: input,
    where: { id },
  })
}

export const deleteInvoice: MutationResolvers['deleteInvoice'] = ({ id }) => {
  return db.invoice.delete({
    where: { id },
  })
}

export const Invoice: InvoiceRelationResolvers = {
  user: (_obj, { root }) => {
    return db.invoice.findUnique({ where: { id: root?.id } }).user()
  },
  payments: (_obj, { root }) => {
    return db.invoice.findUnique({ where: { id: root?.id } }).payments()
  },
}
