import type { Prisma, SkillAssessment } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SkillAssessmentCreateArgs>({
  skillAssessment: {
    one: {
      data: {
        shooting: 9711868,
        dribbling: 940783,
        defense: 1155471,
        basketballIQ: 3212424,
        athleticism: 6027636,
        overallScore: 4095486,
        assessmentDate: '2026-04-02T19:04:24.571Z',
        updatedAt: '2026-04-02T19:04:24.571Z',
        user: {
          create: {
            email: 'String3861502',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:04:25.082Z',
          },
        },
        program: {
          create: {
            name: 'String',
            level: 'BEGINNER',
            capacity: 1130088,
            durationWeeks: 580982,
            pricePerMonth: 3019764.31729206,
            updatedAt: '2026-04-02T19:04:25.524Z',
          },
        },
      },
    },
    two: {
      data: {
        shooting: 5470032,
        dribbling: 6013967,
        defense: 3747392,
        basketballIQ: 7948472,
        athleticism: 5881069,
        overallScore: 4271755,
        assessmentDate: '2026-04-02T19:04:25.582Z',
        updatedAt: '2026-04-02T19:04:25.582Z',
        user: {
          create: {
            email: 'String9482289',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:04:26.327Z',
          },
        },
        program: {
          create: {
            name: 'String',
            level: 'BEGINNER',
            capacity: 6386025,
            durationWeeks: 8146481,
            pricePerMonth: 6159674.095760108,
            updatedAt: '2026-04-02T19:04:26.976Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<SkillAssessment, 'skillAssessment'>
