import type { Attendance } from '@prisma/client'

import {
  attendances,
  attendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from './attendances'
import type { StandardScenario } from './attendances.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('attendances', () => {
  scenario('returns all attendances', async (scenario: StandardScenario) => {
    const result = await attendances()

    expect(result.length).toEqual(Object.keys(scenario.attendance).length)
  })

  scenario(
    'returns a single attendance',
    async (scenario: StandardScenario) => {
      const result = await attendance({ id: scenario.attendance.one.id })

      expect(result).toEqual(scenario.attendance.one)
    }
  )

  scenario('creates a attendance', async (scenario: StandardScenario) => {
    const result = await createAttendance({
      input: {
        classId: scenario.attendance.two.classId,
        userId: scenario.attendance.two.userId,
        attendanceDate: '2026-04-02T19:01:19.449Z',
        status: 'PRESENT',
        updatedAt: '2026-04-02T19:01:19.449Z',
      },
    })

    expect(result.classId).toEqual(scenario.attendance.two.classId)
    expect(result.userId).toEqual(scenario.attendance.two.userId)
    expect(result.attendanceDate).toEqual(new Date('2026-04-02T19:01:19.449Z'))
    expect(result.status).toEqual('PRESENT')
    expect(result.updatedAt).toEqual(new Date('2026-04-02T19:01:19.449Z'))
  })

  scenario('updates a attendance', async (scenario: StandardScenario) => {
    const original = (await attendance({
      id: scenario.attendance.one.id,
    })) as Attendance
    const result = await updateAttendance({
      id: original.id,
      input: { attendanceDate: '2026-04-03T19:01:19.649Z' },
    })

    expect(result.attendanceDate).toEqual(new Date('2026-04-03T19:01:19.649Z'))
  })

  scenario('deletes a attendance', async (scenario: StandardScenario) => {
    const original = (await deleteAttendance({
      id: scenario.attendance.one.id,
    })) as Attendance
    const result = await attendance({ id: original.id })

    expect(result).toEqual(null)
  })
})
