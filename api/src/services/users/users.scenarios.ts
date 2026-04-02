import type { Prisma, User } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        email: 'String4703198',
        hashedPassword: 'String',
        salt: 'String',
        updatedAt: '2026-04-02T18:57:03.068Z',
      },
    },
    two: {
      data: {
        email: 'String3216827',
        hashedPassword: 'String',
        salt: 'String',
        updatedAt: '2026-04-02T18:57:03.068Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
