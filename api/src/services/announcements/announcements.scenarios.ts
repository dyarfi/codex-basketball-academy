import type { Prisma, Announcement } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.AnnouncementCreateArgs>({
  announcement: {
    one: {
      data: {
        title: 'String',
        content: 'String',
        updatedAt: '2026-04-02T19:07:20.186Z',
        createdBy: {
          create: {
            email: 'String4725231',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:07:20.502Z',
          },
        },
      },
    },
    two: {
      data: {
        title: 'String',
        content: 'String',
        updatedAt: '2026-04-02T19:07:20.502Z',
        createdBy: {
          create: {
            email: 'String3278689',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:07:20.724Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Announcement, 'announcement'>
