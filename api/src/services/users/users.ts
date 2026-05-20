import { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const paginatedUsers: QueryResolvers['paginatedUsers'] = async ({
  page = 1,
  pageSize = 10,
  search,
  role,
  isActive,
}) => {
  const conditions: Prisma.UserWhereInput[] = []
  const searchTerm = search?.trim()

  if (searchTerm) {
    conditions.push({
      OR: [
        {
          email: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          profile: {
            is: {
              firstName: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          profile: {
            is: {
              lastName: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    })
  }

  if (role) {
    conditions.push({ role })
  }

  if (typeof isActive === 'boolean') {
    conditions.push({ isActive })
  }

  const where: Prisma.UserWhereInput | undefined =
    conditions.length > 0 ? { AND: conditions } : undefined
  const safePageSize = Math.max(1, pageSize)
  const totalCount = await db.user.count({ where })
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const skip = (currentPage - 1) * safePageSize

  const items = await db.user.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
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
  }
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const createUser: MutationResolvers['createUser'] = ({ input }) => {
  const { email, role, isActive, profile } = input

  return db.user.create({
    data: {
      email,
      role,
      isActive,
      hashedPassword: '', // Placeholder - should be set via password reset or invitation email
      salt: '', // Placeholder - should be set via password reset or invitation email
      profile: {
        create: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          dateOfBirth: profile.dateOfBirth
            ? new Date(profile.dateOfBirth)
            : null,
          phoneNumber: profile.phoneNumber || null,
          address: profile.address || null,
          city: profile.city || null,
          state: profile.state || null,
          zipCode: profile.zipCode || null,
          country: profile.country || null,
          position: profile.position || null,
          jerseyNumber: profile.jerseyNumber || null,
          heightCm: profile.heightCm || null,
          weightKg: profile.weightKg || null,
          medicalInfo: profile.medicalInfo || null,
          emergencyContactName: profile.emergencyContactName || null,
          emergencyContactPhone: profile.emergencyContactPhone || null,
          relationshipToPlayer: profile.relationshipToPlayer || null,
          profilePhoto: profile.profilePhoto || null,
        },
      },
    },
    include: {
      profile: true,
    },
  })
}

export const updateUser: MutationResolvers['updateUser'] = ({ id, input }) => {
  const { profile, ...userInput } = input

  const updateData: Record<string, any> = { ...userInput }

  if (profile) {
    // Handle profile update
    const {
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      country,
      position,
      jerseyNumber,
      heightCm,
      weightKg,
      medicalInfo,
      emergencyContactName,
      emergencyContactPhone,
      relationshipToPlayer,
      playerUserId,
      profilePhoto,
    } = profile

    updateData.profile = {
      update: {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        phoneNumber,
        address,
        city,
        state,
        zipCode,
        country,
        position,
        jerseyNumber,
        heightCm,
        weightKg,
        medicalInfo,
        emergencyContactName,
        emergencyContactPhone,
        relationshipToPlayer,
        playerUserId,
        profilePhoto,
      },
    }
  }

  return db.user.update({
    data: updateData,
    where: { id },
    include: { profile: true },
  })
}

export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const User: UserRelationResolvers = {
  profile: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).profile()
  },
  enrollments: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).enrollments()
  },
  attendances: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).attendances()
  },
  payments: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).payments()
  },
  invoices: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).invoices()
  },
  certificates: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).certificates()
  },
  skillAssessments: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).skillAssessments()
  },
  playerStats: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).playerStats()
  },
  announcements: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).announcements()
  },
  sentMessages: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).sentMessages()
  },
  receivedMessages: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).receivedMessages()
  },
  classesAsTutor: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).classesAsTutor()
  },
}
