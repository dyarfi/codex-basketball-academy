import { mockRedwoodDirective, getDirectiveName } from '@redwoodjs/testing/api'

import attendanceDate from './attendanceDate'

describe('attendanceDate directive', () => {
  it('declares the directive sdl as schema, with the correct name', () => {
    expect(attendanceDate.schema).toBeTruthy()
    expect(getDirectiveName(attendanceDate.schema)).toBe('attendanceDate')
  })

  it('has a attendanceDate implementation transforms the value', () => {
    const mockExecution = mockRedwoodDirective(attendanceDate, {
      mockedResolvedValue: 'foo',
    })

    expect(mockExecution()).toBe('bar')
  })
})
