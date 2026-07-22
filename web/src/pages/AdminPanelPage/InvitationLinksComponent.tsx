import React, { useState, useMemo } from 'react'

import {
  Container,
  Table,
  Group,
  Button,
  Modal,
  TextInput,
  Textarea,
  Badge,
  Text,
  Box,
  ActionIcon,
  Stack,
  Loader,
  Alert,
  CopyButton,
  Tooltip,
  Card,
  Grid,
  NumberInput,
} from '@mantine/core'
import { useDisclosure, useId, randomId } from '@mantine/hooks'
import {
  Trash,
  PencilSimple,
  Plus,
  Copy,
  Check,
  Calendar,
} from '@phosphor-icons/react'
import { IconAlertCircle, IconRecycle } from '@tabler/icons-react'

import { useQuery, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { ConfirmDelete } from 'src/components/Modals/ConfirmDelete'
import {
  GET_INVITATION_LINKS,
  CREATE_INVITATION_LINK,
  UPDATE_INVITATION_LINK,
  DELETE_INVITATION_LINK,
} from 'src/graphql/invitationLinks-queries'
import { useAppTheme } from 'src/providers/ThemeProvider'

export const InvitationLinksComponent = () => {
  const { isDark } = useAppTheme()
  const hash = randomId('')
  const [opened, { open, close }] = useDisclosure(false)
  const [editingLink, setEditingLink] = useState<any>(null)
  const [isDeleteLinkModalOpen, setIsDeleteLinkModalOpen] = useState(false)
  const [linkIdToDelete, setLinkIdToDelete] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    url: '',
    purpose: '',
    maxUses: null as number | null,
    expiresAt: '',
  })
  const {
    data: linksData,
    loading,
    error,
    refetch,
  } = useQuery(GET_INVITATION_LINKS)

  const links = linksData?.invitationLinks || []

  const [createLinkMutation] = useMutation(CREATE_INVITATION_LINK, {
    onCompleted: () => {
      toast.success('Link created successfully')
      refetch()
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create link')
    },
    refetchQueries: [{ query: GET_INVITATION_LINKS }],
    awaitRefetchQueries: true,
  })

  const [updateLinkMutation] = useMutation(UPDATE_INVITATION_LINK, {
    onCompleted: () => {
      toast.success('Link updated successfully')
      refetch()
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update link')
    },
    refetchQueries: [{ query: GET_INVITATION_LINKS }],
    awaitRefetchQueries: true,
  })

  const [deleteLinkMutation] = useMutation(DELETE_INVITATION_LINK, {
    onCompleted: () => {
      toast.success('Link deleted successfully')
      refetch()
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete link')
    },
    refetchQueries: [{ query: GET_INVITATION_LINKS }],
  })

  const handleOpenModal = (link?: any) => {
    if (link) {
      setEditingLink(link)
      setFormData({
        code: link.code,
        url: link.url,
        purpose: link.purpose || '',
        maxUses: link.maxUses || null,
        expiresAt: link.expiresAt
          ? new Date(link.expiresAt).toISOString().split('T')[0]
          : '',
      })
    } else {
      setEditingLink(null)
      setFormData({
        code: '',
        url: '',
        purpose: '',
        maxUses: null,
        expiresAt: '',
      })
    }
    open()
  }

  const handleSaveLink = async () => {
    if (!formData.code.trim()) {
      toast.error('Invitation code is required')
      return
    }

    try {
      const input = {
        code: formData.code,
        url: formData.url,
        purpose: formData.purpose || undefined,
        maxUses: formData.maxUses || undefined,
        expiresAt: formData.expiresAt
          ? new Date(formData.expiresAt).toISOString()
          : undefined,
      }

      if (editingLink) {
        await updateLinkMutation({
          variables: {
            id: editingLink.id,
            input,
          },
        })
      } else {
        await createLinkMutation({
          variables: {
            input,
          },
        })
      }
      refetch()
      close()
    } catch (error) {
      toast.error('Error saving invitation link')
      console.error(error)
    }
  }

  const handleDeleteLink = (id: number) => {
    setLinkIdToDelete(id)
    setIsDeleteLinkModalOpen(true)
  }

  const handleConfirmDeleteLink = async () => {
    if (!linkIdToDelete) return

    try {
      await deleteLinkMutation({ variables: { id: linkIdToDelete } })
      toast.success('Invitation link deleted successfully')
      setIsDeleteLinkModalOpen(false)
      setLinkIdToDelete(null)
      refetch()
    } catch (error) {
      toast.error('Error deleting invitation link')
      console.error(error)
    }
  }

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const isMaxUsesReached = (link: any) => {
    return link.maxUses && link.useCount >= link.maxUses
  }

  const stats = useMemo(() => {
    const total = links.length
    const active = links.filter(
      (link) => !isExpired(link.expiresAt) && !isMaxUsesReached(link)
    ).length
    const expired = links.filter((link) => isExpired(link.expiresAt)).length
    const maxReached = links.filter((link) => isMaxUsesReached(link)).length
    const totalUses = links.reduce((sum, link) => sum + link.useCount, 0)
    return { total, active, expired, maxReached, totalUses }
  }, [links])

  if (loading) {
    return (
      <Container
        size="xl"
        py={{ base: 'sm', sm: 'md', md: 'xl' }}
        px={{ base: 'xs', sm: 'md' }}
      >
        <Group justify="center">
          <Loader size="sm" />
        </Group>
      </Container>
    )
  }

  const surfaceClass = isDark
    ? 'border-slate-800 bg-slate-900'
    : 'border-slate-200 bg-slate-50'

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          variant="filled"
        >
          Failed to load Invitation Links: {error.message}
        </Alert>
      </Container>
    )
  }

  return (
    <Container
      size="xl"
      py={{ base: 'sm', sm: 'md', md: 'xl' }}
      px={{ base: 'xs', sm: 'md' }}
    >
      <Group justify="space-between" mb="lg" grow={true} align="flex-start">
        <div>
          <Text size="lg" fw={700}>
            Invitation Links Management
          </Text>
          <Text size="sm" className="text-slate-500">
            Create and manage invitation links for signup
          </Text>
        </div>
        <Button
          leftSection={<Plus size={16} weight="bold" />}
          onClick={() => handleOpenModal()}
          color="blue"
        >
          New Link
        </Button>
      </Group>
      {/* Stats Cards */}
      <Grid gutter={{ base: 'xs', sm: 'md' }} mb="xl">
        <Grid.Col span={{ base: 12, xs: 6, sm: 3 }}>
          <Card
            shadow="none"
            padding="md"
            radius="md"
            className={`${surfaceClass} border`}
          >
            <Text size="xs" className="text-slate-500" fw={600}>
              Total Links
            </Text>
            <Text size="xl" fw={700}>
              {stats.total}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, sm: 3 }}>
          <Card
            shadow="none"
            padding="md"
            radius="md"
            className={`${surfaceClass} border`}
          >
            <Text size="xs" className="text-slate-500" fw={600}>
              Active
            </Text>
            <Text size="xl" fw={700} className="text-green-600">
              {stats.active}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, sm: 3 }}>
          <Card
            shadow="none"
            padding="md"
            radius="md"
            className={`${surfaceClass} border`}
          >
            <Text size="xs" className="text-slate-500" fw={600}>
              Expired
            </Text>
            <Text size="xl" fw={700} className="text-red-600">
              {stats.expired}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, sm: 3 }}>
          <Card
            shadow="none"
            padding="md"
            radius="md"
            className={`${surfaceClass} border`}
          >
            <Text size="xs" className="text-slate-500" fw={600}>
              Total Uses
            </Text>
            <Text size="xl" fw={700} className="text-blue-600">
              {stats.totalUses}
            </Text>
          </Card>
        </Grid.Col>
      </Grid>
      {links.length === 0 ? (
        <Alert color="blue" icon={<Calendar />}>
          No invitation links yet. Create your first link to get started.
        </Alert>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table
            striped
            highlightOnHover
            className={isDark ? 'bg-slate-800' : 'bg-white'}
          >
            <Table.Thead className={isDark ? 'bg-slate-700' : 'bg-slate-100'}>
              <Table.Tr>
                <Table.Th>Code</Table.Th>
                <Table.Th>Purpose</Table.Th>
                <Table.Th>Uses</Table.Th>
                <Table.Th>URL</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Created By</Table.Th>
                <Table.Th>Expires</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {links.map((link) => {
                const expired = isExpired(link.expiresAt)
                const maxReached = isMaxUsesReached(link)
                const isActive = !expired && !maxReached

                return (
                  <Table.Tr key={link.id}>
                    <Table.Td>
                      <Group gap="xs">
                        <code className="font-mono text-xs">{link.code}</code>
                        <CopyButton value={link.url} timeout={2000}>
                          {({ copied }) => (
                            <Tooltip
                              label={copied ? 'Copied' : 'Copy URL'}
                              withArrow
                              position="right"
                            >
                              <ActionIcon
                                color={copied ? 'teal' : 'gray'}
                                size="sm"
                                variant="subtle"
                              >
                                {copied ? (
                                  <Check size={12} weight="bold" />
                                ) : (
                                  <Copy size={12} weight="bold" />
                                )}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" truncate maxWidth={200}>
                        {link.purpose || '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {link.useCount}
                        {link.maxUses && `/${link.maxUses}`}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" truncate maxWidth={200}>
                        {link.url || '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      {expired ? (
                        <Badge size="sm" color="red" variant="light">
                          Expired
                        </Badge>
                      ) : maxReached ? (
                        <Badge size="sm" color="orange" variant="light">
                          Max Uses Reached
                        </Badge>
                      ) : (
                        <Badge size="sm" color="green" variant="light">
                          Active
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {link.createdBy?.profile
                          ? `${link.createdBy.profile.firstName || ''} ${link.createdBy.profile.lastName || ''}`
                          : link.createdBy?.email || '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {link.expiresAt
                          ? new Date(link.expiresAt).toLocaleDateString()
                          : 'Never'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          size="sm"
                          color="blue"
                          onClick={() => handleOpenModal(link)}
                          variant="light"
                        >
                          <PencilSimple size={16} weight="bold" />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          color="red"
                          onClick={() => handleDeleteLink(link.id)}
                          variant="light"
                        >
                          <Trash size={16} weight="bold" />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>
        </div>
      )}
      {/* Modal */}
      <Modal opened={opened} onClose={close} title="Invitation Link" size="md">
        <Stack gap="md">
          <TextInput
            label="Invitation Code"
            placeholder="e.g., SPRING2026"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            rightSection={
              <ActionIcon
                onClick={() => {
                  setFormData({ ...formData, code: hash })
                }}
              >
                <IconRecycle size={16} />
              </ActionIcon>
            }
          />
          <TextInput
            label="Full URL"
            placeholder="https://example.com/invite/code"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />
          <Textarea
            label="Purpose"
            placeholder="Why is this link being created?"
            value={formData.purpose}
            onChange={(e) =>
              setFormData({ ...formData, purpose: e.target.value })
            }
            minRows={2}
          />
          <NumberInput
            label="Max Uses (optional)"
            placeholder="Leave empty for unlimited"
            min={1}
            value={formData.maxUses}
            onChange={(value) =>
              setFormData({
                ...formData,
                maxUses: value as number | null,
              })
            }
          />
          <TextInput
            label="Expiration Date (optional)"
            type="date"
            value={formData.expiresAt}
            onChange={(e) =>
              setFormData({ ...formData, expiresAt: e.target.value })
            }
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleSaveLink} color="blue">
              {editingLink ? 'Update' : 'Create'} Link
            </Button>
          </Group>
        </Stack>
      </Modal>
      <ConfirmDelete
        isOpen={isDeleteLinkModalOpen}
        title="Delete Invitation Link"
        message="Are you sure you want to delete this invitation link? This action cannot be undone."
        onConfirm={handleConfirmDeleteLink}
        onCancel={() => {
          setIsDeleteLinkModalOpen(false)
          setLinkIdToDelete(null)
        }}
      />{' '}
    </Container>
  )
}

export default InvitationLinksComponent
