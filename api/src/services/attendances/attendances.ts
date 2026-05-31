import type { Prisma } from '@prisma/client'
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

export const paginatedAttendances: QueryResolvers['paginatedAttendances'] =
  async ({
    page = 1,
    pageSize = 10,
    search,
    classId,
    userId,
    date,
    status,
  }) => {
    const conditions: Prisma.AttendanceWhereInput[] = []
    const searchTerm = search?.trim()

    if (searchTerm) {
      conditions.push({
        OR: [
          {
            notes: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            class: {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          },
          {
            user: {
              email: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          },
          {
            user: {
              profile: {
                is: {
                  firstName: {
                    contains: searchTerm,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            user: {
              profile: {
                is: {
                  lastName: {
                    contains: searchTerm,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        ],
      })
    }

    if (classId) {
      conditions.push({ classId })
    }

    if (userId) {
      conditions.push({ userId })
    }

    if (date) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      conditions.push({
        attendanceDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      })
    }

    if (status) {
      conditions.push({ status })
    }

    const where: Prisma.AttendanceWhereInput | undefined =
      conditions.length > 0 ? { AND: conditions } : undefined
    const safePageSize = Math.max(1, pageSize)
    const totalCount = await db.attendance.count({ where })
    const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize))
    const currentPage = Math.min(Math.max(1, page), totalPages)
    const skip = (currentPage - 1) * safePageSize

    const items = await db.attendance.findMany({
      where,
      include: { class: true, user: { include: { profile: true } } },
      orderBy: [{ attendanceDate: 'desc' }, { id: 'desc' }],
      skip,
      take: safePageSize,
    })

    return {
      items,
      totalCount,
      currentPage,
      pageSize: safePageSize,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    } as any
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
