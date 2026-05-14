import type {
  QueryResolvers,
  MutationResolvers,
  AttendanceRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const attendances: QueryResolvers['attendances'] = () => {
  return db.attendance.findMany({
    include: { class: true, user: { include: { profile: true } } },
    orderBy: { attendanceDate: 'desc' },
  })
}

export const attendance: QueryResolvers['attendance'] = ({ id }) => {
  return db.attendance.findUnique({
    where: { id },
    include: { class: true, user: { include: { profile: true } } },
  })
}

export const attendancesByClass: QueryResolvers['attendancesByClass'] = ({
  classId,
}) => {
  return db.attendance.findMany({
    where: { classId },
    include: { class: true, user: { include: { profile: true } } },
    orderBy: { attendanceDate: 'desc' },
  })
}

export const attendancesByUser: QueryResolvers['attendancesByUser'] = ({
  userId,
}) => {
  return db.attendance.findMany({
    where: { userId },
    include: { class: true, user: { include: { profile: true } } },
    orderBy: { attendanceDate: 'desc' },
  })
}

export const attendancesByDate: QueryResolvers['attendancesByDate'] = ({
  date,
}) => {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  return db.attendance.findMany({
    where: {
      attendanceDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: { class: true, user: { include: { profile: true } } },
    orderBy: { attendanceDate: 'desc' },
  })
}

export const createAttendance: MutationResolvers['createAttendance'] = ({
  input,
}) => {
  return db.attendance.create({
    data: input,
    include: { class: true, user: { include: { profile: true } } },
  })
}

export const updateAttendance: MutationResolvers['updateAttendance'] = ({
  id,
  input,
}) => {
  return db.attendance.update({
    data: input,
    where: { id },
    include: { class: true, user: { include: { profile: true } } },
  })
}

export const deleteAttendance: MutationResolvers['deleteAttendance'] = ({
  id,
}) => {
  return db.attendance.delete({
    where: { id },
    include: { class: true, user: { include: { profile: true } } },
  })
}

export const bulkCreateAttendance: MutationResolvers['bulkCreateAttendance'] =
  ({ input }) => {
    return db.attendance.createMany({
      data: input,
      skipDuplicates: true,
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
