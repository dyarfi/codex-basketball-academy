import type { Prisma, Payment } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PaymentCreateArgs>({
  payment: {
    one: {
      data: {
        amount: 8927593.771471307,
        status: 'PENDING',
        updatedAt: '2026-04-02T19:02:56.307Z',
        user: {
          create: {
            email: 'String1616377',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:02:56.403Z',
          },
        },
      },
    },
    two: {
      data: {
        amount: 1043098.7398521729,
        status: 'PENDING',
        updatedAt: '2026-04-02T19:02:56.403Z',
        user: {
          create: {
            email: 'String9785339',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:02:56.527Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Payment, 'payment'>
