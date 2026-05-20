import type {
  QueryResolvers,
  MutationResolvers,
  CertificateRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import {
  generateCertificateNumber,
  generateVerificationCode,
} from 'src/lib/helper'
import { logger } from 'src/lib/logger'

// Auto-issue certificate for completed enrollment
export async function issueCertificateForCompletedEnrollment(enrollment: any) {
  try {
    // Check if certificate already exists for this enrollment
    const existingCert = await db.certificate.findFirst({
      where: {
        userId: enrollment.userId,
        classId: enrollment.classId,
        programId: enrollment.programId,
      },
    })

    if (existingCert) {
      logger.info(`Certificate already exists for enrollment ${enrollment.id}`)
      return existingCert
    }

    // Create new certificate with ISSUED status
    const certificate = await db.certificate.create({
      data: {
        userId: enrollment.userId,
        programId: enrollment.programId,
        classId: enrollment.classId || null,
        title: `${enrollment.program?.name || 'Program'} Completion Certificate`,
        description: `Successfully completed ${enrollment.class?.name || 'class'}`,
        achievementDate: enrollment.completionDate || new Date(),
        certificateNumber: generateCertificateNumber(),
        verificationCode: generateVerificationCode(),
        status: 'ISSUED',
        verifiedAt: new Date(),
        issuedBy: 'SYSTEM',
      },
    })

    logger.info(
      `Auto-issued certificate ${certificate.id} for enrollment ${enrollment.id}`
    )
    return certificate
  } catch (error) {
    logger.error(`Failed to auto-issue certificate for enrollment: ${error}`)
    throw error
  }
}

export const certificates: QueryResolvers['certificates'] = () => {
  return db.certificate.findMany({
    orderBy: {
      id: 'desc',
    },
  })
}

export const certificate: QueryResolvers['certificate'] = ({ id }) => {
  return db.certificate.findUnique({
    where: { id },
  })
}

export const verifyCertificateByCode: QueryResolvers['verifyCertificateByCode'] =
  async ({ verificationCode }) => {
    return await db.certificate.findUnique({
      where: { verificationCode },
      include: {
        user: {
          include: { profile: true },
        },
        program: true,
      },
    })
  }

export const createCertificate: MutationResolvers['createCertificate'] = ({
  input,
}) => {
  return db.certificate.create({
    data: input,
  })
}

export const updateCertificate: MutationResolvers['updateCertificate'] = ({
  id,
  input,
}) => {
  return db.certificate.update({
    data: input,
    where: { id },
  })
}

export const deleteCertificate: MutationResolvers['deleteCertificate'] = ({
  id,
}) => {
  return db.certificate.delete({
    where: { id },
  })
}

export const verifyCertificate: MutationResolvers['verifyCertificate'] = ({
  id,
}) => {
  return db.certificate.update({
    where: { id },
    data: {
      status: 'ISSUED',
      verifiedAt: new Date(),
    },
  })
}

export const revokeCertificate: MutationResolvers['revokeCertificate'] = ({
  id,
  reason,
}) => {
  return db.certificate.update({
    where: { id },
    data: {
      status: 'REVOKED',
      revokedAt: new Date(),
      revokedReason: reason,
    },
  })
}

export const Certificate: CertificateRelationResolvers = {
  user: (_obj, { root }) => {
    return db.certificate.findUnique({ where: { id: root?.id } }).user()
  },
  program: (_obj, { root }) => {
    return db.certificate.findUnique({ where: { id: root?.id } }).program()
  },
  class: (_obj, { root }) => {
    return db.certificate.findUnique({ where: { id: root?.id } }).class?.(_obj)
  },
}
