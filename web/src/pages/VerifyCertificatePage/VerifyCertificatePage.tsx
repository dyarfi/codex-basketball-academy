import { useEffect, useState } from 'react'

import { useQuery } from '@apollo/client'
import {
  Container,
  Paper,
  Stack,
  Group,
  Text,
  Badge,
  Button,
  Loader,
  Center,
  Alert,
  Divider,
} from '@mantine/core'
import {
  Download,
  CheckCircle,
  WarningCircle,
  QrCode,
} from '@phosphor-icons/react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { format, parseISO } from 'date-fns'
import gql from 'graphql-tag'

import { useParams, useLocation } from '@redwoodjs/router'

import { CertificatePDF } from '../../components/CertificatePDF'

const VERIFY_CERTIFICATE_QUERY = gql`
  query VerifyCertificateByCode($verificationCode: String!) {
    verifyCertificateByCode(verificationCode: $verificationCode) {
      id
      certificateNumber
      title
      description
      graduationClass
      ageGroupTeam
      achievementDate
      expiryDate
      signatureUrl
      status
      pdfUrl
      verifiedAt
      revokedReason
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
      program {
        id
        name
      }
    }
  }
`

const VerifyCertificatePage = () => {
  const { code } = useParams()
  const { data, loading, error } = useQuery(VERIFY_CERTIFICATE_QUERY, {
    variables: { verificationCode: code },
    skip: !code,
  })

  const certificate = data?.verifyCertificateByCode

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ISSUED':
        return 'green'
      case 'DRAFT':
        return 'gray'
      case 'REVOKED':
        return 'red'
      case 'EXPIRED':
        return 'yellow'
      default:
        return 'blue'
    }
  }

  const getStatusIcon = (status: string) => {
    return status === 'ISSUED' ? (
      <CheckCircle size={20} weight="fill" />
    ) : (
      <WarningCircle size={20} weight="fill" />
    )
  }

  if (!code) {
    return (
      <Container size="sm" py="xl">
        <Alert
          icon={<WarningCircle size={16} />}
          title="Invalid Certificate Code"
          color="yellow"
        >
          No certificate code provided. Please scan a valid QR code.
        </Alert>
      </Container>
    )
  }

  if (loading) {
    return (
      <Container size="sm" py="xl">
        <Center p="xl">
          <Stack align="center">
            <Loader />
            <Text>Verifying certificate...</Text>
          </Stack>
        </Center>
      </Container>
    )
  }

  if (error || !certificate) {
    return (
      <Container size="sm" py="xl">
        <Alert
          icon={<WarningCircle size={16} />}
          title="Certificate Not Found"
          color="red"
        >
          The certificate could not be verified. Please check the QR code and
          try again.
        </Alert>
      </Container>
    )
  }

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Paper p="lg" radius="md" withBorder>
          {/* Status Section */}
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Group>
                  {getStatusIcon(certificate.status)}
                  <Text fw={700} size="lg">
                    Certificate Verification
                  </Text>
                </Group>
                <Badge
                  color={getStatusColor(certificate.status)}
                  variant="light"
                  size="lg"
                >
                  {certificate.status}
                </Badge>
              </Stack>
            </Group>

            <Divider my="sm" />

            {/* Certificate Details */}
            <Stack gap="md">
              <div>
                <Text size="sm" c="dimmed" fw={500}>
                  Certificate Number
                </Text>
                <Text size="md" fw={600}>
                  {certificate.certificateNumber}
                </Text>
              </div>

              <div>
                <Text size="sm" c="dimmed" fw={500}>
                  Title
                </Text>
                <Text size="md" fw={600}>
                  {certificate.title}
                </Text>
              </div>

              {certificate.description && (
                <div>
                  <Text size="sm" c="dimmed" fw={500}>
                    Description
                  </Text>
                  <Text size="md">{certificate.description}</Text>
                </div>
              )}

              <Group grow>
                <div>
                  <Text size="sm" c="dimmed" fw={500}>
                    Recipient
                  </Text>
                  <Text size="md" fw={600}>
                    {certificate.user?.profile
                      ? `${certificate.user.profile.firstName} ${certificate.user.profile.lastName}`
                      : certificate.user?.email}
                  </Text>
                </div>

                <div>
                  <Text size="sm" c="dimmed" fw={500}>
                    Program
                  </Text>
                  <Text size="md" fw={600}>
                    {certificate.program?.name}
                  </Text>
                </div>
              </Group>

              {certificate.graduationClass && (
                <div>
                  <Text size="sm" c="dimmed" fw={500}>
                    Graduation Class
                  </Text>
                  <Text size="md">{certificate.graduationClass}</Text>
                </div>
              )}

              {certificate.ageGroupTeam && (
                <div>
                  <Text size="sm" c="dimmed" fw={500}>
                    Age Group/Team
                  </Text>
                  <Text size="md">{certificate.ageGroupTeam}</Text>
                </div>
              )}

              <Group grow>
                <div>
                  <Text size="sm" c="dimmed" fw={500}>
                    Achievement Date
                  </Text>
                  <Text size="md" fw={600}>
                    {format(
                      parseISO(certificate.achievementDate),
                      'MMM dd, yyyy'
                    )}
                  </Text>
                </div>

                {certificate.expiryDate && (
                  <div>
                    <Text size="sm" c="dimmed" fw={500}>
                      Expiry Date
                    </Text>
                    <Text size="md" fw={600}>
                      {format(parseISO(certificate.expiryDate), 'MMM dd, yyyy')}
                    </Text>
                  </div>
                )}
              </Group>

              {certificate.verifiedAt && (
                <div>
                  <Text size="sm" c="dimmed" fw={500}>
                    Verified At
                  </Text>
                  <Text size="md">
                    {format(parseISO(certificate.verifiedAt), 'PPpp')}
                  </Text>
                </div>
              )}

              {certificate.status === 'REVOKED' &&
                certificate.revokedReason && (
                  <Alert
                    icon={<WarningCircle size={16} />}
                    title="Revocation Reason"
                    color="red"
                  >
                    {certificate.revokedReason}
                  </Alert>
                )}
            </Stack>

            <Divider my="sm" />

            {/* Action Buttons */}
            <Group justify="center">
              {/* {certificate.pdfUrl && (
                <Button
                  component="a"
                  href={certificate.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftSection={<Download size={18} />}
                  size="md"
                  color="blue"
                >
                  Download Certificate PDF
                </Button>
              )} */}
              <PDFDownloadLink
                document={
                  <CertificatePDF
                    certificateNumber={certificate.certificateNumber}
                    title={certificate.title}
                    description={certificate.description}
                    userName={
                      certificate.user.profile.firstName +
                      ' ' +
                      certificate.user.profile.lastName
                    }
                    programName={certificate.program.name}
                    achievementDate={certificate.achievementDate}
                    graduationClass={certificate.graduationClass}
                    ageGroupTeam={certificate.ageGroupTeam}
                    issuedBy={certificate.issuedBy}
                    expiryDate={certificate.expiryDate}
                    signatureUrl={certificate.signatureUrl}
                  />
                }
                fileName={`${certificate.certificateNumber}.pdf`}
              >
                {({ loading }) => (
                  <Button
                    component="a"
                    disabled={loading}
                    // href={certificate.pdfUrl}
                    // target="_blank"
                    // rel="noopener noreferrer"
                    leftSection={<Download size={18} />}
                    size="md"
                    color="blue"
                  >
                    {loading ? 'Generating...' : 'Download Certificate PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            </Group>

            {/* Footer */}
            <Text size="xs" c="dimmed" ta="center">
              Verification Code: {code?.substring(0, 8)}...
            </Text>
          </Stack>
        </Paper>

        {/* Info Alert */}
        <Alert
          icon={<QrCode size={16} />}
          title="About This Certificate"
          variant="light"
        >
          This certificate has been verified using its unique QR code. The
          information displayed here is authentic and cannot be modified.
        </Alert>
      </Stack>
    </Container>
  )
}

export default VerifyCertificatePage
