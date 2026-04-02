import type { Prisma, Attendance } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.AttendanceCreateArgs>({
  attendance: {
    one: {
      data: {
        attendanceDate: '2026-04-02T19:01:29.504Z',
        status: 'PRESENT',
        updatedAt: '2026-04-02T19:01:29.504Z',
        class: {
          create: {
            name: 'String',
            scheduleDay: 'String',
            scheduleTime: 'String',
            capacity: 3171559,
            startDate: '2026-04-02T19:01:29.824Z',
            updatedAt: '2026-04-02T19:01:29.824Z',
            program: {
              create: {
                name: 'String',
                level: 'BEGINNER',
                capacity: 1916961,
                durationWeeks: 8886203,
                pricePerMonth: 9724777.860282362,
                updatedAt: '2026-04-02T19:01:30.407Z',
              },
            },
            coach: {
              create: {
                email: 'String9763001',
                hashedPassword: 'String',
                salt: 'String',
                updatedAt: '2026-04-02T19:01:31.632Z',
              },
            },
          },
        },
        user: {
          create: {
            email: 'String2415316',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:01:31.890Z',
          },
        },
      },
    },
    two: {
      data: {
        attendanceDate: '2026-04-02T19:01:31.909Z',
        status: 'PRESENT',
        updatedAt: '2026-04-02T19:01:31.914Z',
        class: {
          create: {
            name: 'String',
            scheduleDay: 'String',
            scheduleTime: 'String',
            capacity: 3362315,
            startDate: '2026-04-02T19:01:32.283Z',
            updatedAt: '2026-04-02T19:01:32.283Z',
            program: {
              create: {
                name: 'String',
                level: 'BEGINNER',
                capacity: 1415367,
                durationWeeks: 1037783,
                pricePerMonth: 5138035.294009233,
                updatedAt: '2026-04-02T19:01:32.446Z',
              },
            },
            coach: {
              create: {
                email: 'String3835778',
                hashedPassword: 'String',
                salt: 'String',
                updatedAt: '2026-04-02T19:01:32.591Z',
              },
            },
          },
        },
        user: {
          create: {
            email: 'String1067643',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2026-04-02T19:01:33.523Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Attendance, 'attendance'>
