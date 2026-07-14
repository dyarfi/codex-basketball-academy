import { useState, useEffect } from 'react'

import { useMutation, useQuery } from '@apollo/client'
import {
  Table,
  Button,
  Modal,
  TextInput,
  Group,
  Stack,
  Loader,
  Center,
  ActionIcon,
  Text,
  Badge,
  Card,
  Container,
  Select,
  Textarea,
  Input,
  Image,
  Paper,
  Divider,
  Switch,
} from '@mantine/core'
import {
  TrashIcon,
  Plus,
  Eye,
  Download,
  PencilIcon,
  XIcon,
  QrCode,
} from '@phosphor-icons/react'
import { format, parseISO } from 'date-fns'

import { CertificatePDFViewer } from 'src/components/CertificatePDF/CertificatePDFViewer'
import {
  generateCertificateQR,
  generateVerificationCode,
} from 'src/lib/qrCodeGenerator'
import { useAppTheme } from 'src/providers/ThemeProvider'

import {
  CERTIFICATES_QUERY,
  CREATE_CERTIFICATE_MUTATION,
  UPDATE_CERTIFICATE_MUTATION,
  DELETE_CERTIFICATE_MUTATION,
  VERIFY_CERTIFICATE_MUTATION,
  REVOKE_CERTIFICATE_MUTATION,
} from '../../graphql/certificates-queries'
import { GET_CLASSES } from '../../graphql/classes-queries'
import { GET_PROGRAMS } from '../../graphql/programs-queries'
import { GET_USERS } from '../../graphql/users-queries'

/*
Done. I extracted the reusable PDF logic into certificatePdfUtils.tsx and updated CertificatePDFViewer.tsx to use it.
You can now reuse it in other pages like:

import {
  buildCertificatePdfProps,
  getCertificatePdfBase64,
  getCertificatePdfFileName,
} from 'src/components/CertificatePDF/certificatePdfUtils'

const pdfProps = buildCertificatePdfProps({
  certificate,
  nextPage: skillsAssessmentsByProgram,
  isDark,
})

const base64 = await getCertificatePdfBase64(pdfProps)
const fileName = getCertificatePdfFileName(certificate)
*/

const CertificateComponent = () => {
  const { isDark } = useAppTheme()
  const [opened, setOpened] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [revokeModalOpened, setRevokeModalOpened] = useState(false)
  const [certificateToRevoke, setCertificateToRevoke] = useState<string | null>(
    null
  )
  const [revokeReason, setRevokeReason] = useState('')
  const [qrCodeLoading, setQrCodeLoading] = useState(false)
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    userId: '',
    programId: '',
    classId: '',
    title: '',
    description: '',
    graduationClass: '',
    ageGroupTeam: '',
    achievementDate: format(new Date(), 'yyyy-MM-dd'),
    certificateNumber: '',
    pdfUrl: '',
    qrCode: '',
    issuedBy: '',
    templateId: '',
    signatureUrl: '',
    expiryDate: '',
    status: 'DRAFT',
    verificationCode: '',
    withAssessment: false,
  })

  // Queries
  const { data, loading, refetch } = useQuery(CERTIFICATES_QUERY)
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS)
  const { data: programsData, loading: programsLoading } =
    useQuery(GET_PROGRAMS)
  const { data: classesData, loading: classesLoading } = useQuery(GET_CLASSES)

  // Generate QR code when required fields change
  const handleGenerateQRCode = async () => {
    if (
      !formData.certificateNumber ||
      !formData.userId ||
      !formData.programId
    ) {
      alert(
        'Please fill in Certificate Number, Player, and Program first to generate QR code'
      )
      return
    }

    try {
      setQrCodeLoading(true)

      // Generate verification code if not already present
      const verificationCode =
        formData.verificationCode || generateVerificationCode()

      // Generate QR code data URL
      const qrDataUrl = await generateCertificateQR({
        certificateNumber: formData.certificateNumber,
        verificationCode: verificationCode,
        userId: formData.userId,
        programId: formData.programId,
      })

      // Update form data with QR code
      setFormData((prev) => ({
        ...prev,
        qrCode: qrDataUrl,
        verificationCode: verificationCode,
      }))

      // Show preview
      setQrCodePreview(qrDataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
      alert('Failed to generate QR code. Please try again.')
    } finally {
      setQrCodeLoading(false)
    }
  }

  // Auto-generate QR code preview when certificate number changes
  useEffect(() => {
    if (
      formData.certificateNumber &&
      formData.userId &&
      formData.programId &&
      formData.verificationCode
    ) {
      handleGenerateQRCode()
    }
  }, []) // Only run on mount

  // Mutations
  const [createCertificate] = useMutation(CREATE_CERTIFICATE_MUTATION, {
    onCompleted: () => {
      refetch()
      handleCloseModal()
    },
  })
  const [updateCertificate] = useMutation(UPDATE_CERTIFICATE_MUTATION, {
    onCompleted: () => {
      refetch()
      handleCloseModal()
    },
  })
  const [deleteCertificate] = useMutation(DELETE_CERTIFICATE_MUTATION, {
    onCompleted: () => {
      refetch()
    },
  })
  const [verifyCertificate] = useMutation(VERIFY_CERTIFICATE_MUTATION, {
    onCompleted: () => {
      refetch()
    },
  })
  const [revokeCertificate] = useMutation(REVOKE_CERTIFICATE_MUTATION, {
    onCompleted: () => {
      refetch()
      handleCloseRevokeModal()
    },
  })

  const certificates = data?.certificates || []
  const users = usersData?.users || []
  const programs = programsData?.programs || []
  const classes = classesData?.classes || []

  // Build select options
  const userOptions = users
    .filter((u) => u.role === 'PLAYER')
    .map((u) => ({
      value: u.id,
      label: u.profile
        ? `${u.profile.firstName} ${u.profile.lastName} (${u.email})`
        : u.email,
    }))

  const programOptions = programs
    .filter((p) => p.isActive)
    .map((p) => ({
      value: p.id,
      label: `${p.name} (${p.level})`,
    }))

  const classOptions = classes
    .filter((c) => !formData.programId || c.program?.id === formData.programId)
    .map((c) => ({
      value: c.id,
      label: `${c.name} - ${c.scheduleDay} ${c.scheduleTime}`,
    }))

  // Functions
  const handleOpenModal = (certificate?: any) => {
    if (certificate) {
      setEditingId(certificate.id)
      setFormData({
        userId: certificate.userId || '',
        programId: certificate.programId || '',
        classId: certificate.classId || '',
        title: certificate.title || '',
        description: certificate.description || '',
        graduationClass: certificate.graduationClass || '',
        ageGroupTeam: certificate.ageGroupTeam || '',
        achievementDate: format(
          parseISO(certificate.achievementDate),
          'yyyy-MM-dd'
        ),
        certificateNumber: certificate.certificateNumber || '',
        pdfUrl: certificate.pdfUrl || '',
        qrCode: certificate.qrCode || '',
        issuedBy: certificate.issuedBy || '',
        templateId: certificate.templateId || '',
        signatureUrl: certificate.signatureUrl || '',
        expiryDate: certificate.expiryDate
          ? format(parseISO(certificate.expiryDate), 'yyyy-MM-dd')
          : '',
        status: certificate.status || 'DRAFT',
        verificationCode: certificate.verificationCode || '',
        withAssessment: certificate.withAssessment || false,
      })
      // Set preview if QR code exists
      if (certificate.qrCode) {
        setQrCodePreview(certificate.qrCode)
      }
    } else {
      setEditingId(null)
      const newVerificationCode = generateVerificationCode()
      setFormData({
        userId: '',
        programId: '',
        classId: '',
        title: '',
        description: '',
        graduationClass: '',
        ageGroupTeam: '',
        achievementDate: format(new Date(), 'yyyy-MM-dd'),
        certificateNumber: '',
        pdfUrl: '',
        qrCode: '',
        issuedBy: '',
        templateId: '',
        signatureUrl: '',
        expiryDate: '',
        status: 'DRAFT',
        verificationCode: newVerificationCode,
        withAssessment: false,
      })
      setQrCodePreview(null)
    }
    setOpened(true)
  }

  const handleCloseModal = () => {
    setOpened(false)
    setEditingId(null)
    setQrCodePreview(null)
  }

  const handleCloseRevokeModal = () => {
    setRevokeModalOpened(false)
    setCertificateToRevoke(null)
    setRevokeReason('')
  }

  const handleSave = async () => {
    if (
      !formData.userId ||
      !formData.programId ||
      !formData.title ||
      !formData.certificateNumber
    ) {
      alert('Please fill in all required fields')
      return
    }

    const input = {
      userId: formData.userId,
      programId: formData.programId,
      classId: formData.classId || null,
      title: formData.title,
      description: formData.description || null,
      graduationClass: formData.graduationClass || null,
      ageGroupTeam: formData.ageGroupTeam || null,
      achievementDate: new Date(formData.achievementDate).toISOString(),
      certificateNumber: formData.certificateNumber,
      pdfUrl: formData.pdfUrl || null,
      qrCode: formData.qrCode || null,
      issuedBy: formData.issuedBy || null,
      templateId: formData.templateId || null,
      withAssessment: formData.withAssessment || null,
      signatureUrl: formData.signatureUrl || null,
      expiryDate: formData.expiryDate
        ? new Date(formData.expiryDate).toISOString()
        : null,
      status: formData.status,
      verificationCode: formData.verificationCode || generateVerificationCode(),
    }

    if (editingId) {
      await updateCertificate({
        variables: {
          id: editingId,
          input,
        },
      })
    } else {
      await createCertificate({
        variables: {
          input,
        },
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      await deleteCertificate({
        variables: { id },
      })
    }
  }

  const handleVerify = async (id: string) => {
    await verifyCertificate({
      variables: { id },
    })
  }

  const handleRevokeClick = (id: string) => {
    setCertificateToRevoke(id)
    setRevokeModalOpened(true)
  }

  const handleRevokeSubmit = async () => {
    if (!revokeReason) {
      alert('Please provide a reason for revocation')
      return
    }
    if (certificateToRevoke) {
      await revokeCertificate({
        variables: {
          id: certificateToRevoke,
          reason: revokeReason,
        },
      })
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'gray'
      case 'ISSUED':
        return 'green'
      case 'REVOKED':
        return 'red'
      case 'EXPIRED':
        return 'yellow'
      default:
        return 'blue'
    }
  }

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Group justify="center" p="xl">
          <Loader size="sm" />
        </Group>
      </Container>
    )
  }

  return (
    <Container
      size="xl"
      py={{ base: 'sm', sm: 'md', md: 'xl' }}
      px={{ base: 'xs', sm: 'md' }}
    >
      <Stack gap="lg">
        <Card withBorder p="lg" shadow="none">
          <Card.Section withBorder inheritPadding py="md">
            <Group justify="space-between">
              <Text fw={500} size="lg">
                Certificates
              </Text>
              <Button
                leftSection={<Plus size={16} />}
                onClick={() => handleOpenModal()}
              >
                Add Certificate
              </Button>
            </Group>
          </Card.Section>

          <Card.Section>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Certificate #</Table.Th>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Program</Table.Th>
                  <Table.Th>Achievement Date</Table.Th>
                  <Table.Th w="74">Status</Table.Th>
                  <Table.Th w="388">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {certificates.length > 0 ? (
                  certificates.map((certificate) => (
                    <Table.Tr key={certificate.id}>
                      <Table.Td>{certificate.certificateNumber}</Table.Td>
                      <Table.Td>
                        {certificate.user?.profile &&
                          `${certificate.user.profile.firstName} ${certificate.user.profile.lastName}`}
                        {certificate.user?.email && (
                          <Text size="xs" c="dimmed">
                            {certificate.user?.email}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>{certificate.title}</Table.Td>
                      <Table.Td>{certificate.program?.name}</Table.Td>
                      <Table.Td>
                        {format(
                          parseISO(certificate.achievementDate),
                          'MMM dd, yyyy'
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={getStatusBadgeColor(certificate.status)}
                          variant="light"
                          size="xs"
                        >
                          {certificate.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs" wrap="wrap">
                          {certificate.status === 'ISSUED' && (
                            <CertificatePDFViewer
                              certificate={certificate}
                              isNextPage={certificate.withAssessment}
                              buttonText="View"
                            />
                          )}
                          <Button
                            size="xs"
                            color="blue"
                            variant="light"
                            leftSection={<PencilIcon size={16} />}
                            onClick={() => handleOpenModal(certificate)}
                            title="Edit"
                          >
                            Edit
                          </Button>
                          {certificate.status === 'DRAFT' && (
                            <ActionIcon
                              size="sm"
                              color="green"
                              variant="subtle"
                              onClick={() => handleVerify(certificate.id)}
                              title="Issue/Verify"
                            >
                              <Eye size={16} />
                            </ActionIcon>
                          )}
                          {certificate.status === 'ISSUED' && (
                            <Button
                              size="xs"
                              color="orange"
                              variant="light"
                              leftSection={<XIcon size={16} />}
                              onClick={() => handleRevokeClick(certificate.id)}
                              title="Revoke"
                            >
                              Revoke
                            </Button>
                          )}
                          {certificate.pdfUrl && (
                            <ActionIcon
                              size="sm"
                              color="purple"
                              variant="subtle"
                              component="a"
                              href={certificate.pdfUrl}
                              target="_blank"
                              title="Download PDF"
                            >
                              <Download size={16} />
                            </ActionIcon>
                          )}
                          <Button
                            size="xs"
                            color="red"
                            variant="light"
                            leftSection={<TrashIcon size={16} />}
                            onClick={() => handleDelete(certificate.id)}
                            title="Delete"
                          >
                            Delete
                          </Button>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={7}>
                      <Center py="xl">
                        <Text c="dimmed">No certificates found</Text>
                      </Center>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Card.Section>
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          opened={opened}
          onClose={handleCloseModal}
          title={editingId ? 'Edit Certificate' : 'Add Certificate'}
          centered
          size="lg"
        >
          <Stack gap="md">
            <Group grow>
              <Select
                label="Player"
                placeholder="Select player"
                searchable
                clearable
                data={userOptions}
                value={formData.userId}
                onChange={(value) =>
                  setFormData({ ...formData, userId: value || '' })
                }
                required
              />
              <Select
                label="Program"
                placeholder="Select program"
                searchable
                data={programOptions}
                value={formData.programId}
                onChange={(value) =>
                  setFormData({ ...formData, programId: value || '' })
                }
                required
              />
            </Group>
            <Select
              label="Class (Optional)"
              placeholder="Select class"
              searchable
              clearable
              data={classOptions}
              value={formData.classId}
              onChange={(value) =>
                setFormData({ ...formData, classId: value || '' })
              }
              disabled={!formData.programId}
            />
            <TextInput
              label="Title"
              placeholder="Certificate title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.currentTarget.value })
              }
              required
            />
            <TextInput
              label="Certificate Number"
              placeholder="e.g., CERT-2026-001"
              value={formData.certificateNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  certificateNumber: e.currentTarget.value,
                })
              }
              required
            />
            <Textarea
              label="Description"
              placeholder="Certificate description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.currentTarget.value,
                })
              }
            />
            <Group grow>
              <TextInput
                label="Graduation Class"
                placeholder="e.g., Class of 2026"
                value={formData.graduationClass}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    graduationClass: e.currentTarget.value,
                  })
                }
              />
              <TextInput
                label="Age Group/Team"
                placeholder="e.g., U-12 Team A"
                value={formData.ageGroupTeam}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ageGroupTeam: e.currentTarget.value,
                  })
                }
              />
            </Group>
            <Group grow>
              <TextInput
                type="date"
                label="Achievement Date"
                value={formData.achievementDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    achievementDate: e.currentTarget.value,
                  })
                }
                required
              />
              <TextInput
                type="date"
                label="Expiry Date (Optional)"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expiryDate: e.currentTarget.value,
                  })
                }
              />
            </Group>
            <Group grow>
              <TextInput
                label="Issued By"
                placeholder="Name/ID of issuer"
                value={formData.issuedBy}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    issuedBy: e.currentTarget.value,
                  })
                }
              />
              <TextInput
                label="Template ID"
                placeholder="Template ID"
                value={formData.templateId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    templateId: e.currentTarget.value,
                  })
                }
              />
            </Group>
            <Group grow>
              <TextInput
                label="PDF URL"
                placeholder="https://..."
                value={formData.pdfUrl}
                onChange={(e) =>
                  setFormData({ ...formData, pdfUrl: e.currentTarget.value })
                }
              />
              <TextInput
                label="Signature URL"
                placeholder="https://..."
                value={formData.signatureUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    signatureUrl: e.currentTarget.value,
                  })
                }
              />
            </Group>
            <Divider my="sm" />
            <Stack gap="sm">
              <Group justify="space-between" align="center">
                <Text fw={500} size="sm">
                  QR Code
                </Text>
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<QrCode size={16} />}
                  onClick={handleGenerateQRCode}
                  loading={qrCodeLoading}
                  disabled={
                    !formData.certificateNumber ||
                    !formData.userId ||
                    !formData.programId
                  }
                >
                  {formData.qrCode ? 'Regenerate' : 'Generate'} QR Code
                </Button>
              </Group>
              {qrCodePreview && (
                <Paper p="md" withBorder>
                  <Stack align="center">
                    <Image
                      src={qrCodePreview}
                      alt="QR Code Preview"
                      width={200}
                      height={200}
                      fit="contain"
                    />
                    <Text size="xs" c="dimmed">
                      Certificate #: {formData.certificateNumber}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Verification: {formData.verificationCode?.substring(0, 8)}
                      ...
                    </Text>
                  </Stack>
                </Paper>
              )}
              {!qrCodePreview && (
                <Paper p="md" withBorder bg={isDark ? 'dark.7' : 'gray.0'}>
                  <Center p="xl">
                    <Text size="sm" c="dimmed">
                      QR code will be generated when you fill in Certificate
                      Number, Player, and Program
                    </Text>
                  </Center>
                </Paper>
              )}
            </Stack>
            <Select
              label="Status"
              placeholder="Select status"
              data={['DRAFT', 'ISSUED', 'REVOKED', 'EXPIRED']}
              value={formData.status}
              onChange={(value) =>
                setFormData({ ...formData, status: value || 'DRAFT' })
              }
              required
            />
            <Switch
              label="With Assessment"
              type="checkbox"
              defaultChecked={formData.withAssessment}
              onChange={(e) =>
                setFormData({ ...formData, withAssessment: e.target.checked })
              }
            />
            <Group justify="flex-end">
              <Button variant="light" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingId ? 'Update' : 'Create'}
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Revoke Modal */}
        <Modal
          opened={revokeModalOpened}
          onClose={handleCloseRevokeModal}
          title="Revoke Certificate"
          centered
        >
          <Stack gap="md">
            <Textarea
              label="Reason for Revocation"
              placeholder="Enter reason..."
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.currentTarget.value)}
              required
            />
            <Group justify="flex-end">
              <Button variant="light" onClick={handleCloseRevokeModal}>
                Cancel
              </Button>
              <Button color="red" onClick={handleRevokeSubmit}>
                Revoke
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  )
}

export default CertificateComponent
