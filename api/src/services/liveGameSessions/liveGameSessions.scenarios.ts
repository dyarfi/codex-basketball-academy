import type { Prisma, LiveGameSession } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.LiveGameSessionCreateArgs>({
  liveGameSession: {
    one: {
      data: {
        gameName: 'String',
        gameDate: '2026-07-21T02:20:56.712Z',
        roster: { foo: 'bar' },
        statsMap: { foo: 'bar' },
        substitutedOut: { foo: 'bar' },
        substitutionLog: { foo: 'bar' },
        updatedAt: '2026-07-21T02:20:56.712Z',
      },
    },
    two: {
      data: {
        gameName: 'String',
        gameDate: '2026-07-21T02:20:56.712Z',
        roster: { foo: 'bar' },
        statsMap: { foo: 'bar' },
        substitutedOut: { foo: 'bar' },
        substitutionLog: { foo: 'bar' },
        updatedAt: '2026-07-21T02:20:56.712Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<LiveGameSession, 'liveGameSession'>
