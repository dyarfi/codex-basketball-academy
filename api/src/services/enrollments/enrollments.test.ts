import type { Enrollment } from '@prisma/client'

import {
  enrollments,
  enrollment,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from './enrollments'
import type { StandardScenario } from './enrollments.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('enrollments', () => {
  scenario('returns all enrollments', async (scenario: StandardScenario) => {
    const result = await enrollments()

    expect(result.length).toEqual(Object.keys(scenario.enrollment).length)
  })

  scenario(
    'returns a single enrollment',
    async (scenario: StandardScenario) => {
      const result = await enrollment({ id: scenario.enrollment.one.id })

      expect(result).toEqual(scenario.enrollment.one)
    }
  )

  scenario('creates a enrollment', async (scenario: StandardScenario) => {
    const result = await createEnrollment({
      input: {
        userId: scenario.enrollment.two.userId,
        classId: scenario.enrollment.two.classId,
        programId: scenario.enrollment.two.programId,
        updatedAt: '2026-04-02T19:00:28.490Z',
      },
    })

    expect(result.userId).toEqual(scenario.enrollment.two.userId)
    expect(result.classId).toEqual(scenario.enrollment.two.classId)
    expect(result.programId).toEqual(scenario.enrollment.two.programId)
    expect(result.updatedAt).toEqual(new Date('2026-04-02T19:00:28.490Z'))
  })

  scenario('updates a enrollment', async (scenario: StandardScenario) => {
    const original = (await enrollment({
      id: scenario.enrollment.one.id,
    })) as Enrollment
    const result = await updateEnrollment({
      id: original.id,
      input: { updatedAt: '2026-04-03T19:00:29.180Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2026-04-03T19:00:29.180Z'))
  })

  scenario('deletes a enrollment', async (scenario: StandardScenario) => {
    const original = (await deleteEnrollment({
      id: scenario.enrollment.one.id,
    })) as Enrollment
    const result = await enrollment({ id: original.id })

    expect(result).toEqual(null)
  })
})
