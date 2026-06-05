import { useEffect, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { Modal, Button, Group, Loader, Center } from '@mantine/core'
import { FileArrowDown, FileArrowUp } from '@phosphor-icons/react'
import { PDFDownloadLink, PDFViewer, pdf } from '@react-pdf/renderer'
import { IconMailForward } from '@tabler/icons-react'
import { format } from 'date-fns'

import { ToastContainer } from 'src/components/Toast/Toast'
import { useToast } from 'src/components/Toast/useToast'
import { sendEmailMessage } from 'src/lib/fetch'

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
  const { toasts, success, error: toastError, removeToast } = useToast()
  // Use lazy query instead of regular query
  const [
    getSkillsAssessment,
    { data: { skillsAssessmentsByProgram } = '', loading: loadingAssessment },
  ] = useLazyQuery(ASSESSMENT_QUERY)

  const userName = certificate.user?.profile
    ? `${certificate.user.profile.firstName} ${certificate.user.profile.lastName}`
    : certificate.user?.email || 'Certificate Recipient'

  const programName = certificate.program?.name || 'Program'

  const getPdfBase64 = async () => {
    // 1. Generate the PDF instance from your React component tree
    const docInstance = pdf(
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
      />
    )

    // 2. Convert the compiled PDF into a binary Blob
    const blob = await docInstance.toBlob()

    // 3. Use FileReader to handle the binary-to-Base64 conversion asynchronously
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result

        // OPTIONAL: Strip out the data URL prefix if you only want raw attachment data
        // e.g., removes "data:application/pdf;base64,"
        const cleanBase64 = base64String?.split(',')[1]

        resolve(cleanBase64)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const pdfFileName = `Certificate-${certificate.certificateNumber}-${Date.now()}.pdf`

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

  const handleSendEmail = async () => {
    const base64Data = await getPdfBase64()
    await sendEmailMessage({
      subject: programName,
      sender: {
        name: 'Defrian',
        email: 'defrian.yarfi@gmail.com',
      },
      to: [
        {
          name: 'Defrian',
          email: 'defrian.yarfi@gmail.com',
        },
      ],
      messages: 'test',
      attachment: [
        {
          content: base64Data as string,
          name: pdfFileName,
        },
      ],
    }).then((result) => {
      success(`Message sent to: ${userName}`)
      console.log({ result })
    })
  }

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
                {({ loading, blob }) => (
                  <Button
                    leftSection={<FileArrowDown size={14} />}
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Download PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
              <Button
                leftSection={<IconMailForward size={14} />}
                onClick={handleSendEmail}
              >
                Send Email
              </Button>
            </Group>
          </div>
        )}
      </Modal>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
