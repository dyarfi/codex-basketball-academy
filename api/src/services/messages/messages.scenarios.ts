import type { Prisma, Message } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.MessageCreateArgs>({
  message: {
    one: {
      data: {
        content: 'String',
        updatedAt: '2026-04-02T19:08:17.213Z',
        sender: {
          create: {
            email: 'String20362',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:08:17.477Z',
          },
        },
        recipient: {
          create: {
            email: 'String4099371',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:08:17.742Z',
          },
        },
      },
    },
    two: {
      data: {
        content: 'String',
        updatedAt: '2026-04-02T19:08:17.743Z',
        sender: {
          create: {
            email: 'String7611988',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:08:17.943Z',
          },
        },
        recipient: {
          create: {
            email: 'String1464225',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:08:18.789Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Message, 'message'>
