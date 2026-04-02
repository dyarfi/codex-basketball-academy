import type { Payment } from '@prisma/client'

import {
  payments,
  payment,
  createPayment,
  updatePayment,
  deletePayment,
} from './payments'
import type { StandardScenario } from './payments.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('payments', () => {
  scenario('returns all payments', async (scenario: StandardScenario) => {
    const result = await payments()

    expect(result.length).toEqual(Object.keys(scenario.payment).length)
  })

  scenario('returns a single payment', async (scenario: StandardScenario) => {
    const result = await payment({ id: scenario.payment.one.id })

    expect(result).toEqual(scenario.payment.one)
  })

  scenario('creates a payment', async (scenario: StandardScenario) => {
    const result = await createPayment({
      input: {
        userId: scenario.payment.two.userId,
        amount: 6482919.032202687,
        status: 'PENDING',
        updatedAt: '2026-04-02T19:02:54.764Z',
      },
    })

    expect(result.userId).toEqual(scenario.payment.two.userId)
    expect(result.amount).toEqual(6482919.032202687)
    expect(result.status).toEqual('PENDING')
    expect(result.updatedAt).toEqual(new Date('2026-04-02T19:02:54.764Z'))
  })

  scenario('updates a payment', async (scenario: StandardScenario) => {
    const original = (await payment({ id: scenario.payment.one.id })) as Payment
    const result = await updatePayment({
      id: original.id,
      input: { amount: 6809191.658319777 },
    })

    expect(result.amount).toEqual(6809191.658319777)
  })

  scenario('deletes a payment', async (scenario: StandardScenario) => {
    const original = (await deletePayment({
      id: scenario.payment.one.id,
    })) as Payment
    const result = await payment({ id: original.id })

    expect(result).toEqual(null)
  })
})
