import type { LiveGameSession } from '@prisma/client'

import {
  liveGameSessions,
  liveGameSession,
  createLiveGameSession,
  updateLiveGameSession,
  deleteLiveGameSession,
} from './liveGameSessions'
import type { StandardScenario } from './liveGameSessions.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('liveGameSessions', () => {
  scenario(
    'returns all liveGameSessions',
    async (scenario: StandardScenario) => {
      const result = await liveGameSessions()

      expect(result.length).toEqual(
        Object.keys(scenario.liveGameSession).length
      )
    }
  )

  scenario(
    'returns a single liveGameSession',
    async (scenario: StandardScenario) => {
      const result = await liveGameSession({
        id: scenario.liveGameSession.one.id,
      })

      expect(result).toEqual(scenario.liveGameSession.one)
    }
  )

  scenario('creates a liveGameSession', async () => {
    const result = await createLiveGameSession({
      input: {
        gameName: 'String',
        gameDate: '2026-07-21T02:20:56.181Z',
        roster: { foo: 'bar' },
        statsMap: { foo: 'bar' },
        substitutedOut: { foo: 'bar' },
        substitutionLog: { foo: 'bar' },
        updatedAt: '2026-07-21T02:20:56.181Z',
      },
    })

    expect(result.gameName).toEqual('String')
    expect(result.gameDate).toEqual(new Date('2026-07-21T02:20:56.181Z'))
    expect(result.roster).toEqual({ foo: 'bar' })
    expect(result.statsMap).toEqual({ foo: 'bar' })
    expect(result.substitutedOut).toEqual({ foo: 'bar' })
    expect(result.substitutionLog).toEqual({ foo: 'bar' })
    expect(result.updatedAt).toEqual(new Date('2026-07-21T02:20:56.181Z'))
  })

  scenario('updates a liveGameSession', async (scenario: StandardScenario) => {
    const original = (await liveGameSession({
      id: scenario.liveGameSession.one.id,
    })) as LiveGameSession
    const result = await updateLiveGameSession({
      id: original.id,
      input: { gameName: 'String2' },
    })

    expect(result.gameName).toEqual('String2')
  })

  scenario('deletes a liveGameSession', async (scenario: StandardScenario) => {
    const original = (await deleteLiveGameSession({
      id: scenario.liveGameSession.one.id,
    })) as LiveGameSession
    const result = await liveGameSession({ id: original.id })

    expect(result).toEqual(null)
  })
})
