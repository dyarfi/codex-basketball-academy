import type {
  QueryResolvers,
  MutationResolvers,
  AttendanceRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const attendances: QueryResolvers['attendances'] = () => {
  return db.attendance.findMany()
}

export const attendance: QueryResolvers['attendance'] = ({ id }) => {
  return db.attendance.findUnique({
    where: { id },
  })
}

export const createAttendance: MutationResolvers['createAttendance'] = ({
  input,
}) => {
  return db.attendance.create({
    data: input,
  })
}

export const updateAttendance: MutationResolvers['updateAttendance'] = ({
  id,
  input,
}) => {
  return db.attendance.update({
    data: input,
    where: { id },
  })
}

export const deleteAttendance: MutationResolvers['deleteAttendance'] = ({
  id,
}) => {
  return db.attendance.delete({
    where: { id },
  })
}

export const Attendance: AttendanceRelationResolvers = {
  class: (_obj, { root }) => {
    return db.attendance.findUnique({ where: { id: root?.id } }).class()
  },
  user: (_obj, { root }) => {
    return db.attendance.findUnique({ where: { id: root?.id } }).user()
  },
}
