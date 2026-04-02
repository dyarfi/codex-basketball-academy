import type { Profile } from '@prisma/client'

import {
  profiles,
  profile,
  createProfile,
  updateProfile,
  deleteProfile,
} from './profiles'
import type { StandardScenario } from './profiles.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('profiles', () => {
  scenario('returns all profiles', async (scenario: StandardScenario) => {
    const result = await profiles()

    expect(result.length).toEqual(Object.keys(scenario.profile).length)
  })

  scenario('returns a single profile', async (scenario: StandardScenario) => {
    const result = await profile({ id: scenario.profile.one.id })

    expect(result).toEqual(scenario.profile.one)
  })

  scenario('creates a profile', async (scenario: StandardScenario) => {
    const result = await createProfile({
      input: {
        userId: scenario.profile.two.userId,
        firstName: 'String',
        lastName: 'String',
        updatedAt: '2026-04-02T18:57:54.374Z',
      },
    })

    expect(result.userId).toEqual(scenario.profile.two.userId)
    expect(result.firstName).toEqual('String')
    expect(result.lastName).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2026-04-02T18:57:54.374Z'))
  })

  scenario('updates a profile', async (scenario: StandardScenario) => {
    const original = (await profile({ id: scenario.profile.one.id })) as Profile
    const result = await updateProfile({
      id: original.id,
      input: { firstName: 'String2' },
    })

    expect(result.firstName).toEqual('String2')
  })

  scenario('deletes a profile', async (scenario: StandardScenario) => {
    const original = (await deleteProfile({
      id: scenario.profile.one.id,
    })) as Profile
    const result = await profile({ id: original.id })

    expect(result).toEqual(null)
  })
})
