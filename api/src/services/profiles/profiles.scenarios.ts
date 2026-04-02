import type { Prisma, Profile } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ProfileCreateArgs>({
  profile: {
    one: {
      data: {
        firstName: 'String',
        lastName: 'String',
        updatedAt: '2026-04-02T18:57:58.905Z',
        user: {
          create: {
            email: 'String1189411',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T18:57:59.377Z',
          },
        },
      },
    },
    two: {
      data: {
        firstName: 'String',
        lastName: 'String',
        updatedAt: '2026-04-02T18:57:59.377Z',
        user: {
          create: {
            email: 'String3922121',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T18:58:00.396Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Profile, 'profile'>
