import type { Prisma, Enrollment } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.EnrollmentCreateArgs>({
  enrollment: {
    one: {
      data: {
        updatedAt: '2026-04-02T19:00:35.148Z',
        user: {
          create: {
            email: 'String4012',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:00:35.495Z',
          },
        },
        class: {
          create: {
            name: 'String',
            scheduleDay: 'String',
            scheduleTime: 'String',
            capacity: 2007906,
            startDate: '2026-04-02T19:00:35.802Z',
            updatedAt: '2026-04-02T19:00:35.802Z',
            program: {
              create: {
                name: 'String',
                level: 'BEGINNER',
                capacity: 3099926,
                durationWeeks: 1342160,
                pricePerMonth: 6629882.538339218,
                updatedAt: '2026-04-02T19:00:36.004Z',
              },
            },
            coach: {
              create: {
                email: 'String9268588',
                hashedPassword: 'String',
                salt: 'String',
                updatedAt: '2026-04-02T19:00:36.200Z',
              },
            },
          },
        },
        program: {
          create: {
            name: 'String',
            level: 'BEGINNER',
            capacity: 4622315,
            durationWeeks: 255427,
            pricePerMonth: 143476.52379219866,
            updatedAt: '2026-04-02T19:00:36.451Z',
          },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2026-04-02T19:00:36.451Z',
        user: {
          create: {
            email: 'String2228833',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:00:36.982Z',
          },
        },
        class: {
          create: {
            name: 'String',
            scheduleDay: 'String',
            scheduleTime: 'String',
            capacity: 8531519,
            startDate: '2026-04-02T19:00:37.334Z',
            updatedAt: '2026-04-02T19:00:37.334Z',
            program: {
              create: {
                name: 'String',
                level: 'BEGINNER',
                capacity: 4393182,
                durationWeeks: 2833111,
                pricePerMonth: 4188187.0427959324,
                updatedAt: '2026-04-02T19:00:37.491Z',
              },
            },
            coach: {
              create: {
                email: 'String7555681',
                hashedPassword: 'String',
                salt: 'String',
                updatedAt: '2026-04-02T19:00:37.595Z',
              },
            },
          },
        },
        program: {
          create: {
            name: 'String',
            level: 'BEGINNER',
            capacity: 1353839,
            durationWeeks: 3886393,
            pricePerMonth: 7094328.227708455,
            updatedAt: '2026-04-02T19:00:37.887Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Enrollment, 'enrollment'>
