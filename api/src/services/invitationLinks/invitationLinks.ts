// import { nanoid } from 'nanoid'
import type {
  QueryResolvers,
  MutationResolvers,
  InvitationLinkRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { generateVerificationCode } from 'src/lib/helper'

export const createInvitationLinkPublic = async () => {
  const code = await generateVerificationCode(10)
  const url = `${process.env.APP_URL}/invite/${code}`
  return { url, code }
}

export const useInvitationLink = async ({ code }) => {
  const link = await db.invitationLink.findUnique({ where: { code } })
  if (!link || (link.expiresAt && link.expiresAt < new Date())) {
    throw new Error('Invitation expired or not found')
  }

  if (link.maxUses && link.useCount >= link.maxUses) {
    throw new Error('Invitation link exceeded usage limit')
  }

  await db.invitationLink.update({
    where: { code },
    data: {
      useCount: { increment: 1 },
      usedAt: new Date(),
    },
  })

  return true
}

export const getValidInvitationLink = async ({ code }) => {
  const link = await db.invitationLink.findUnique({
    where: { code },
  })

  if (!link || (link.expiresAt && new Date(link.expiresAt) < new Date())) {
    throw new Error('Link expired or not found')
  }

  return link
}

export const invitationLinkPublic: QueryResolvers['invitationLinkPublic'] =
  async ({ code }) => {
    const link = await db.invitationLink.findUnique({
      where: { code },
    })

    if (!link || (link.expiresAt && new Date(link.expiresAt) < new Date())) {
      throw new Error('Link expired or not found')
    }

    return link
  }

export const invitationLinks: QueryResolvers['invitationLinks'] = () => {
  return db.invitationLink.findMany()
}

export const invitationLink: QueryResolvers['invitationLink'] = ({ id }) => {
  return db.invitationLink.findUnique({
    where: { id },
  })
}

export const createInvitationLink: MutationResolvers['createInvitationLink'] =
  ({ input }) => {
    input.createdById = context.currentUser.id
    input.useCount = 0
    return db.invitationLink.create({
      data: input,
    })
  }

export const updateInvitationLink: MutationResolvers['updateInvitationLink'] =
  ({ id, input }) => {
    input.createdById = context.currentUser.id
    return db.invitationLink.update({
      data: input,
      where: { id },
    })
  }

export const deleteInvitationLink: MutationResolvers['deleteInvitationLink'] =
  ({ id }) => {
    return db.invitationLink.delete({
      where: { id },
    })
  }

export const InvitationLink: InvitationLinkRelationResolvers = {
  createdBy: (_obj, { root }) => {
    return db.invitationLink.findUnique({ where: { id: root?.id } }).createdBy()
  },
}
