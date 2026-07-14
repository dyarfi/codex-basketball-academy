import { useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { Modal, Button, Group, Loader, Center } from '@mantine/core'
import { FileArrowDown, FileArrowUp } from '@phosphor-icons/react'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { IconMailForward } from '@tabler/icons-react'

import { toast } from '@redwoodjs/web/toast'

import { sendEmailMessage } from 'src/lib/fetch'

import { ASSESSMENT_QUERY } from '../../graphql/certificates-queries'

import { CertificatePDF } from './CertificatePDF'
import {
  buildCertificatePdfProps,
  getCertificatePdfBase64,
  getCertificatePdfFileName,
  getCertificateProgramName,
  getCertificateUserName,
} from './certificatePdfUtils'

interface CertificatePDFViewerProps {
  certificate: any
  isNextPage?: boolean
  size?: string
  buttonText?: string
  onClose?: () => void
}

export const CertificatePDFViewer = ({
  certificate,
  isNextPage = false,
  size = 'xs',
  buttonText = 'View PDF',
  onClose,
}: CertificatePDFViewerProps) => {
  const [opened, setOpened] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  // Use lazy query instead of regular query
  const [getSkillsAssessment, { data }] = useLazyQuery(ASSESSMENT_QUERY)
  const skillsAssessmentsByProgram = data?.skillsAssessmentsByProgram

  const userName = getCertificateUserName(certificate)
  const programName = getCertificateProgramName(certificate)
  const certificatePdfProps = buildCertificatePdfProps({
    certificate,
    nextPage: skillsAssessmentsByProgram,
  })
  const pdfFileName = getCertificatePdfFileName(certificate)

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
      toast.error('Error fetching assessment')
      console.error('Error fetching assessment:', error)
      setIsGenerating(false)
    }
  }

  const handleClose = () => {
    setOpened(false)
    onClose?.()
  }

  const handleSendEmail = async () => {
    const base64Data = await getCertificatePdfBase64(certificatePdfProps)
    console.log({ base64Data })
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
      toast.success(`Message sent to: ${userName}`)
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
              <CertificatePDF {...certificatePdfProps} />
            </PDFViewer>

            <Group justify="flex-end" mt="md">
              <PDFDownloadLink
                document={<CertificatePDF {...certificatePdfProps} />}
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
    </>
  )
}
