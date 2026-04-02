import type { Program } from '@prisma/client'

import {
  programs,
  program,
  createProgram,
  updateProgram,
  deleteProgram,
} from './programs'
import type { StandardScenario } from './programs.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('programs', () => {
  scenario('returns all programs', async (scenario: StandardScenario) => {
    const result = await programs()

    expect(result.length).toEqual(Object.keys(scenario.program).length)
  })

  scenario('returns a single program', async (scenario: StandardScenario) => {
    const result = await program({ id: scenario.program.one.id })

    expect(result).toEqual(scenario.program.one)
  })

  scenario('creates a program', async () => {
    const result = await createProgram({
      input: {
        name: 'String',
        level: 'BEGINNER',
        capacity: 2036501,
        durationWeeks: 2926809,
        pricePerMonth: 1582716.667877524,
        updatedAt: '2026-04-02T18:58:47.361Z',
      },
    })

    expect(result.name).toEqual('String')
    expect(result.level).toEqual('BEGINNER')
    expect(result.capacity).toEqual(2036501)
    expect(result.durationWeeks).toEqual(2926809)
    expect(result.pricePerMonth).toEqual(1582716.667877524)
    expect(result.updatedAt).toEqual(new Date('2026-04-02T18:58:47.361Z'))
  })

  scenario('updates a program', async (scenario: StandardScenario) => {
    const original = (await program({ id: scenario.program.one.id })) as Program
    const result = await updateProgram({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a program', async (scenario: StandardScenario) => {
    const original = (await deleteProgram({
      id: scenario.program.one.id,
    })) as Program
    const result = await program({ id: original.id })

    expect(result).toEqual(null)
  })
})
