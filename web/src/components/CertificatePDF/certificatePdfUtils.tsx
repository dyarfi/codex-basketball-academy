import { pdf } from '@react-pdf/renderer'

import { CertificatePDF, CertificatePDFProps } from './CertificatePDF'

type CertificateProfile = {
  firstName?: string | null
  lastName?: string | null
}

type CertificateUser = {
  email?: string | null
  profile?: CertificateProfile | null
}

type CertificateProgram = {
  name?: string | null
}

export type CertificatePdfSource = {
  certificateNumber: string
  title: string
  description?: string | null
  achievementDate: string
  graduationClass?: string | null
  ageGroupTeam?: string | null
  issuedBy?: string | null
  expiryDate?: string | null
  signatureUrl?: string | null
  templateId?: string | null
  verifiedAt?: string | null
  user?: CertificateUser | null
  program?: CertificateProgram | null
}

type BuildCertificatePdfPropsOptions = {
  certificate: CertificatePdfSource
  nextPage?: CertificatePDFProps['nextPage']
}

export type CertificatePdfBase64Options = {
  stripDataUrlPrefix?: boolean
}

export const getCertificateUserName = (certificate: CertificatePdfSource) => {
  const profile = certificate.user?.profile
  const profileName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(' ')

  return profileName || certificate.user?.email || 'Certificate Recipient'
}

export const getCertificateProgramName = (certificate: CertificatePdfSource) =>
  certificate.program?.name || 'Program'

export const buildCertificatePdfProps = ({
  certificate,
  nextPage,
}: BuildCertificatePdfPropsOptions): CertificatePDFProps => ({
  certificateNumber: certificate.certificateNumber,
  title: certificate.title,
  description: certificate.description || undefined,
  userName: getCertificateUserName(certificate),
  programName: getCertificateProgramName(certificate),
  achievementDate: certificate.achievementDate,
  graduationClass: certificate.graduationClass || undefined,
  ageGroupTeam: certificate.ageGroupTeam || undefined,
  issuedBy: certificate.issuedBy || undefined,
  expiryDate: certificate.expiryDate || undefined,
  verifiedAt: certificate.verifiedAt || undefined,
  signatureUrl: certificate.signatureUrl || undefined,
  templateId: certificate.templateId || undefined,
  nextPage,
})

export const renderCertificatePdf = (props: CertificatePDFProps) => (
  <CertificatePDF {...props} />
)

export const getCertificatePdfBlob = async (props: CertificatePDFProps) => {
  const docInstance = pdf(renderCertificatePdf(props))

  return docInstance.toBlob()
}

export const blobToBase64 = (
  blob: Blob,
  { stripDataUrlPrefix = true }: CertificatePdfBase64Options = {}
) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Unable to convert PDF blob to Base64.'))
        return
      }

      resolve(
        stripDataUrlPrefix ? reader.result.split(',')[1] || '' : reader.result
      )
    }

    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export const getCertificatePdfBase64 = async (
  props: CertificatePDFProps,
  options?: CertificatePdfBase64Options
) => {
  const blob = await getCertificatePdfBlob(props)

  return blobToBase64(blob, options)
}

export const getCertificatePdfFileName = (
  certificate: Pick<CertificatePdfSource, 'certificateNumber'>,
  timestamp = Date.now()
) => `Certificate-${certificate.certificateNumber}-${timestamp}.pdf`
