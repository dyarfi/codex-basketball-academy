import type { Prisma, Certificate } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.CertificateCreateArgs>({
  certificate: {
    one: {
      data: {
        title: 'String',
        achievementDate: '2026-04-02T19:03:42.864Z',
        certificateNumber: 'String8772009',
        updatedAt: '2026-04-02T19:03:42.864Z',
        user: {
          create: {
            email: 'String3358986',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:03:43.031Z',
          },
        },
        program: {
          create: {
            name: 'String',
            level: 'BEGINNER',
            capacity: 3165220,
            durationWeeks: 7709117,
            pricePerMonth: 911662.1089774268,
            updatedAt: '2026-04-02T19:03:43.219Z',
          },
        },
      },
    },
    two: {
      data: {
        title: 'String',
        achievementDate: '2026-04-02T19:03:43.221Z',
        certificateNumber: 'String2296964',
        updatedAt: '2026-04-02T19:03:43.221Z',
        user: {
          create: {
            email: 'String5300066',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:03:43.390Z',
          },
        },
        program: {
          create: {
            name: 'String',
            level: 'BEGINNER',
            capacity: 5725899,
            durationWeeks: 4983700,
            pricePerMonth: 9844549.726654703,
            updatedAt: '2026-04-02T19:03:43.557Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Certificate, 'certificate'>
