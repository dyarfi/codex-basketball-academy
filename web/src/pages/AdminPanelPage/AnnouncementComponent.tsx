import { useState } from 'react'

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
  Grid,
  Textarea,
  Input,
  Switch,
  rem,
  Container,
} from '@mantine/core'
import { Trash, Plus, Pencil, Calendar } from '@phosphor-icons/react'
import { format, parseISO } from 'date-fns'

import { AdminLayout } from 'src/components/AdminLayout'

import {
  ANNOUNCEMENTS_QUERY,
  CREATE_ANNOUNCEMENT_MUTATION,
  UPDATE_ANNOUNCEMENT_MUTATION,
  DELETE_ANNOUNCEMENT_MUTATION,
} from '../../graphql/announcements-queries'

const AnnouncementComponent = () => {
  const [opened, setOpened] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    publishDate: format(new Date(), 'yyyy-MM-dd'),
    expiryDate: '',
    isActive: true,
  })

  // Queries
  const { data, loading, refetch } = useQuery(ANNOUNCEMENTS_QUERY)

  // Mutations
  const [createAnnouncement] = useMutation(CREATE_ANNOUNCEMENT_MUTATION, {
    onCompleted: () => {
      refetch()
      handleCloseModal()
    },
  })
  const [updateAnnouncement] = useMutation(UPDATE_ANNOUNCEMENT_MUTATION, {
    onCompleted: () => {
      refetch()
      handleCloseModal()
    },
  })
  const [deleteAnnouncement] = useMutation(DELETE_ANNOUNCEMENT_MUTATION, {
    onCompleted: () => {
      refetch()
    },
  })

  const announcements = data?.announcements || []

  const handleOpenModal = (announcement?: any) => {
    if (announcement) {
      setEditingId(announcement.id)
      setFormData({
        title: announcement.title,
        content: announcement.content,
        imageUrl: announcement.imageUrl || '',
        publishDate: format(parseISO(announcement.publishDate), 'yyyy-MM-dd'),
        expiryDate: announcement.expiryDate
          ? format(parseISO(announcement.expiryDate), 'yyyy-MM-dd')
          : '',
        isActive: announcement.isActive,
      })
    } else {
      setEditingId(null)
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        publishDate: format(new Date(), 'yyyy-MM-dd'),
        expiryDate: '',
        isActive: true,
      })
    }
    setOpened(true)
  }

  const handleCloseModal = () => {
    setOpened(false)
    setEditingId(null)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      alert('Please fill in all required fields')
      return
    }

    const input = {
      title: formData.title,
      content: formData.content,
      imageUrl: formData.imageUrl || null,
      publishDate: new Date(formData.publishDate).toISOString(),
      expiryDate: formData.expiryDate
        ? new Date(formData.expiryDate).toISOString()
        : null,
      isActive: formData.isActive,
    }

    if (editingId) {
      await updateAnnouncement({
        variables: {
          id: editingId,
          input,
        },
      })
    } else {
      await createAnnouncement({
        variables: {
          input,
        },
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      await deleteAnnouncement({
        variables: { id },
      })
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <Container size="xl" py="xl">
          <Group justify="center" p="xl">
            <Loader size="sm" />
          </Group>
        </Container>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Container size="xl" py="xl">
        <Stack gap="lg">
          <Card withBorder p="lg">
            <Card.Section withBorder inheritPadding py="md">
              <Group justify="space-between">
                <Text fw={500} size="lg">
                  Announcements
                </Text>
                <Button
                  leftSection={<Plus size={16} />}
                  onClick={() => handleOpenModal()}
                >
                  Add Announcement
                </Button>
              </Group>
            </Card.Section>

            <Card.Section>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Publish Date</Table.Th>
                    <Table.Th>Expiry Date</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {announcements.length > 0 ? (
                    announcements.map((announcement) => (
                      <Table.Tr key={announcement.id}>
                        <Table.Td>{announcement.title}</Table.Td>
                        <Table.Td>
                          {format(
                            parseISO(announcement.publishDate),
                            'MMM dd, yyyy'
                          )}
                        </Table.Td>
                        <Table.Td>
                          {announcement.expiryDate
                            ? format(
                                parseISO(announcement.expiryDate),
                                'MMM dd, yyyy'
                              )
                            : '-'}
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={announcement.isActive ? 'green' : 'red'}
                            variant="light"
                          >
                            {announcement.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={0}>
                            <ActionIcon
                              size="sm"
                              color="blue"
                              variant="subtle"
                              onClick={() => handleOpenModal(announcement)}
                            >
                              <Pencil size={16} />
                            </ActionIcon>
                            <ActionIcon
                              size="sm"
                              color="red"
                              variant="subtle"
                              onClick={() => handleDelete(announcement.id)}
                            >
                              <Trash size={16} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={5}>
                        <Center py="xl">
                          <Text c="dimmed">No announcements found</Text>
                        </Center>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Card.Section>
          </Card>

          <Modal
            opened={opened}
            onClose={handleCloseModal}
            title={editingId ? 'Edit Announcement' : 'Add Announcement'}
            centered
          >
            <Stack gap="md">
              <TextInput
                label="Title"
                placeholder="Announcement title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.currentTarget.value })
                }
                required
              />
              <Textarea
                label="Content"
                placeholder="Announcement content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.currentTarget.value })
                }
                required
              />
              <TextInput
                label="Image URL"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.currentTarget.value })
                }
              />
              <Input
                type="date"
                label="Publish Date"
                value={formData.publishDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    publishDate: e.currentTarget.value,
                  })
                }
                required
              />
              <Input
                type="date"
                label="Expiry Date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expiryDate: e.currentTarget.value,
                  })
                }
              />
              <Switch
                label="Active"
                checked={formData.isActive}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    isActive: event.currentTarget.checked,
                  })
                }
              />
              <Group justify="flex-end">
                <Button variant="default" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </Group>
            </Stack>
          </Modal>
        </Stack>
      </Container>
    </AdminLayout>
  )
}

export default AnnouncementComponent
