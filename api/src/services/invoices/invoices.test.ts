import type { Invoice } from '@prisma/client'

import {
  invoices,
  invoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from './invoices'
import type { StandardScenario } from './invoices.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('invoices', () => {
  scenario('returns all invoices', async (scenario: StandardScenario) => {
    const result = await invoices()

    expect(result.length).toEqual(Object.keys(scenario.invoice).length)
  })

  scenario('returns a single invoice', async (scenario: StandardScenario) => {
    const result = await invoice({ id: scenario.invoice.one.id })

    expect(result).toEqual(scenario.invoice.one)
  })

  scenario('creates a invoice', async (scenario: StandardScenario) => {
    const result = await createInvoice({
      input: {
        userId: scenario.invoice.two.userId,
        invoiceNumber: 'String9940962',
        amount: 241390.09797162324,
        dueDate: '2026-04-02T19:02:13.701Z',
        updatedAt: '2026-04-02T19:02:13.701Z',
      },
    })

    expect(result.userId).toEqual(scenario.invoice.two.userId)
    expect(result.invoiceNumber).toEqual('String9940962')
    expect(result.amount).toEqual(241390.09797162324)
    expect(result.dueDate).toEqual(new Date('2026-04-02T19:02:13.701Z'))
    expect(result.updatedAt).toEqual(new Date('2026-04-02T19:02:13.701Z'))
  })

  scenario('updates a invoice', async (scenario: StandardScenario) => {
    const original = (await invoice({ id: scenario.invoice.one.id })) as Invoice
    const result = await updateInvoice({
      id: original.id,
      input: { invoiceNumber: 'String94951712' },
    })

    expect(result.invoiceNumber).toEqual('String94951712')
  })

  scenario('deletes a invoice', async (scenario: StandardScenario) => {
    const original = (await deleteInvoice({
      id: scenario.invoice.one.id,
    })) as Invoice
    const result = await invoice({ id: original.id })

    expect(result).toEqual(null)
  })
})
