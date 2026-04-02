import type { Prisma, Program } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ProgramCreateArgs>({
  program: {
    one: {
      data: {
        name: 'String',
        level: 'BEGINNER',
        capacity: 7226494,
        durationWeeks: 9950487,
        pricePerMonth: 4350660.95350884,
        updatedAt: '2026-04-02T18:58:49.743Z',
      },
    },
    two: {
      data: {
        name: 'String',
        level: 'BEGINNER',
        capacity: 5732203,
        durationWeeks: 202320,
        pricePerMonth: 1779482.5363728607,
        updatedAt: '2026-04-02T18:58:49.743Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Program, 'program'>
