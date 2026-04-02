import type { Certificate } from '@prisma/client'

import {
  certificates,
  certificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from './certificates'
import type { StandardScenario } from './certificates.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('certificates', () => {
  scenario('returns all certificates', async (scenario: StandardScenario) => {
    const result = await certificates()

    expect(result.length).toEqual(Object.keys(scenario.certificate).length)
  })

  scenario(
    'returns a single certificate',
    async (scenario: StandardScenario) => {
      const result = await certificate({ id: scenario.certificate.one.id })

      expect(result).toEqual(scenario.certificate.one)
    }
  )

  scenario('creates a certificate', async (scenario: StandardScenario) => {
    const result = await createCertificate({
      input: {
        userId: scenario.certificate.two.userId,
        programId: scenario.certificate.two.programId,
        title: 'String',
        achievementDate: '2026-04-02T19:03:38.938Z',
        certificateNumber: 'String7221056',
        updatedAt: '2026-04-02T19:03:38.938Z',
      },
    })

    expect(result.userId).toEqual(scenario.certificate.two.userId)
    expect(result.programId).toEqual(scenario.certificate.two.programId)
    expect(result.title).toEqual('String')
    expect(result.achievementDate).toEqual(new Date('2026-04-02T19:03:38.938Z'))
    expect(result.certificateNumber).toEqual('String7221056')
    expect(result.updatedAt).toEqual(new Date('2026-04-02T19:03:38.938Z'))
  })

  scenario('updates a certificate', async (scenario: StandardScenario) => {
    const original = (await certificate({
      id: scenario.certificate.one.id,
    })) as Certificate
    const result = await updateCertificate({
      id: original.id,
      input: { title: 'String2' },
    })

    expect(result.title).toEqual('String2')
  })

  scenario('deletes a certificate', async (scenario: StandardScenario) => {
    const original = (await deleteCertificate({
      id: scenario.certificate.one.id,
    })) as Certificate
    const result = await certificate({ id: original.id })

    expect(result).toEqual(null)
  })
})
