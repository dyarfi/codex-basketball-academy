import { useEffect, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { Modal, Button, Group, Loader, Center } from '@mantine/core'
import { FileArrowDown, FileArrowUp } from '@phosphor-icons/react'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { format } from 'date-fns'

import { ASSESSMENT_QUERY } from '../../graphql/certificates-queries'

import { CertificatePDF } from './CertificatePDF'

interface CertificatePDFViewerProps {
  certificate: any
  isDark?: boolean
  isNextPage?: boolean
  size?: string
  buttonText?: string
  onClose?: () => void
}

export const CertificatePDFViewer = ({
  certificate,
  isDark = false,
  isNextPage = false,
  size = 'xs',
  buttonText = 'View PDF',
  onClose,
}: CertificatePDFViewerProps) => {
  const [opened, setOpened] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  // Use lazy query instead of regular query
  const [
    getSkillsAssessment,
    { data: { skillsAssessmentsByProgram } = '', loading: loadingAssessment },
  ] = useLazyQuery(ASSESSMENT_QUERY)

  const userName = certificate.user?.profile
    ? `${certificate.user.profile.firstName} ${certificate.user.profile.lastName}`
    : certificate.user?.email || 'Certificate Recipient'

  const programName = certificate.program?.name || 'Program'

  const handleOpen = async () => {
    try {
      // Execute the query here
      if (isNextPage) {
        await getSkillsAssessment({
          variables: { id: certificate.programId },
        })
      }

      // Simulate generation delay for better UX
      setTimeout(() => {
        setIsGenerating(false)
        setOpened(true)
      }, 500)
    } catch (error) {
      console.error('Error fetching assessment:', error)
      setIsGenerating(false)
    }
  }

  const handleClose = () => {
    setOpened(false)
    onClose?.()
  }

  const pdfFileName = `Certificate-${certificate.certificateNumber}-${Date.now()}.pdf`

  return (
    <>
      <Button
        size={size}
        variant="light"
        color="violet"
        leftSection={<FileArrowUp size={16} />}
        onClick={handleOpen}
        title="View PDF"
      >
        {buttonText}
      </Button>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={`Certificate: ${certificate.certificateNumber}`}
        size="xl"
        centered
      >
        {isGenerating ? (
          <Center py="xl">
            <Loader size="sm" />
          </Center>
        ) : (
          <div>
            <PDFViewer
              // height={isNextPage ? 1200 : 600}
              height={600}
              style={{ width: '100%' }}
            >
              <CertificatePDF
                certificateNumber={certificate.certificateNumber}
                title={certificate.title}
                description={certificate.description}
                userName={userName}
                programName={programName}
                achievementDate={certificate.achievementDate}
                graduationClass={certificate.graduationClass}
                ageGroupTeam={certificate.ageGroupTeam}
                issuedBy={certificate.issuedBy}
                expiryDate={certificate.expiryDate}
                // verifiedAt={format(certificate.verifiedAt, 'DD-MM-YYYY')}
                verifiedAt={certificate.verifiedAt}
                signatureUrl={certificate.signatureUrl}
                templateId={certificate.templateId}
                nextPage={skillsAssessmentsByProgram}
                isDark={isDark}
              />
            </PDFViewer>

            <Group justify="flex-end" mt="md">
              <PDFDownloadLink
                document={
                  <CertificatePDF
                    certificateNumber={certificate.certificateNumber}
                    title={certificate.title}
                    description={certificate.description}
                    userName={userName}
                    programName={programName}
                    achievementDate={certificate.achievementDate}
                    graduationClass={certificate.graduationClass}
                    ageGroupTeam={certificate.ageGroupTeam}
                    issuedBy={certificate.issuedBy}
                    expiryDate={certificate.expiryDate}
                    signatureUrl={certificate.signatureUrl}
                    templateId={certificate.templateId}
                    nextPage={skillsAssessmentsByProgram}
                    isDark={isDark}
                  />
                }
                fileName={pdfFileName}
              >
                {({ loading }) => (
                  <Button
                    leftSection={<FileArrowDown size={14} />}
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Download PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            </Group>
          </div>
        )}
      </Modal>
    </>
  )
}
