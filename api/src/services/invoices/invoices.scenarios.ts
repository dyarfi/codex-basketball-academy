import type { Prisma, Invoice } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.InvoiceCreateArgs>({
  invoice: {
    one: {
      data: {
        invoiceNumber: 'String1753953',
        amount: 1287845.8772458434,
        dueDate: '2026-04-02T19:02:18.467Z',
        updatedAt: '2026-04-02T19:02:18.467Z',
        user: {
          create: {
            email: 'String220500',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:02:18.807Z',
          },
        },
      },
    },
    two: {
      data: {
        invoiceNumber: 'String8007618',
        amount: 6262474.765543895,
        dueDate: '2026-04-02T19:02:18.807Z',
        updatedAt: '2026-04-02T19:02:18.807Z',
        user: {
          create: {
            email: 'String1443600',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:02:19.000Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Invoice, 'invoice'>
