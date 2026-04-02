import type { SkillAssessment } from '@prisma/client'

import {
  skillAssessments,
  skillAssessment,
  createSkillAssessment,
  updateSkillAssessment,
  deleteSkillAssessment,
} from './skillAssessments'
import type { StandardScenario } from './skillAssessments.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('skillAssessments', () => {
  scenario(
    'returns all skillAssessments',
    async (scenario: StandardScenario) => {
      const result = await skillAssessments()

      expect(result.length).toEqual(
        Object.keys(scenario.skillAssessment).length
      )
    }
  )

  scenario(
    'returns a single skillAssessment',
    async (scenario: StandardScenario) => {
      const result = await skillAssessment({
        id: scenario.skillAssessment.one.id,
      })

      expect(result).toEqual(scenario.skillAssessment.one)
    }
  )

  scenario('creates a skillAssessment', async (scenario: StandardScenario) => {
    const result = await createSkillAssessment({
      input: {
        userId: scenario.skillAssessment.two.userId,
        programId: scenario.skillAssessment.two.programId,
        shooting: 5204906,
        dribbling: 2559358,
        defense: 23506,
        basketballIQ: 6017239,
        athleticism: 2539700,
        overallScore: 6239277,
        assessmentDate: '2026-04-02T19:04:19.891Z',
        updatedAt: '2026-04-02T19:04:19.891Z',
      },
    })

    expect(result.userId).toEqual(scenario.skillAssessment.two.userId)
    expect(result.programId).toEqual(scenario.skillAssessment.two.programId)
    expect(result.shooting).toEqual(5204906)
    expect(result.dribbling).toEqual(2559358)
    expect(result.defense).toEqual(23506)
    expect(result.basketballIQ).toEqual(6017239)
    expect(result.athleticism).toEqual(2539700)
    expect(result.overallScore).toEqual(6239277)
    expect(result.assessmentDate).toEqual(new Date('2026-04-02T19:04:19.891Z'))
    expect(result.updatedAt).toEqual(new Date('2026-04-02T19:04:19.891Z'))
  })

  scenario('updates a skillAssessment', async (scenario: StandardScenario) => {
    const original = (await skillAssessment({
      id: scenario.skillAssessment.one.id,
    })) as SkillAssessment
    const result = await updateSkillAssessment({
      id: original.id,
      input: { shooting: 4546456 },
    })

    expect(result.shooting).toEqual(4546456)
  })

  scenario('deletes a skillAssessment', async (scenario: StandardScenario) => {
    const original = (await deleteSkillAssessment({
      id: scenario.skillAssessment.one.id,
    })) as SkillAssessment
    const result = await skillAssessment({ id: original.id })

    expect(result).toEqual(null)
  })
})
