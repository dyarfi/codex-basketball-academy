import { useEffect, useRef, useState } from 'react'

import {
  Alert,
  Button,
  Modal,
  TextInput,
  Group,
  Stack,
  Loader,
  Text,
  Badge,
  Card,
  Textarea,
  Switch,
  Container,
  Select,
  NumberInput,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { Plus } from '@phosphor-icons/react'
import { IconAlertCircle, IconSearch } from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'

import { routes, useParams } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import AdminPagination from 'src/components/AdminPagination/AdminPagination'
import { CrudTable } from 'src/components/CrudTable'

import {
  ANNOUNCEMENT_LISTS_QUERY,
  CREATE_ANNOUNCEMENT_MUTATION,
  UPDATE_ANNOUNCEMENT_MUTATION,
  DELETE_ANNOUNCEMENT_MUTATION,
} from '../../graphql/announcements-queries'

type RouteQuery = Record<string, boolean | number | string | null | undefined>
type RouteBuilder = (params?: RouteQuery) => string

const getPageFromParam = (value: unknown) => {
  const parsedPage = Number(value)

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

const AnnouncementComponent = () => {
  const PAGE_SIZE = 10
  const { page = 1, search } = useParams()
  const { currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState(
    typeof search === 'string' ? search : ''
  )
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)
  const [currentPage, setCurrentPage] = useState(() => getPageFromParam(page))
  const hasMountedSearch = useRef(false)
  const [opened, setOpened] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    // publishDate: format(new Date(), 'yyyy-MM-dd'),
    // expiryDate: '',
    actionLabel: '',
    actionUrl: '',
    priority: 0,
    type: 'INFO',
    isActive: true,
    isDismissible: true,
  })

  const variables = {
    page: currentPage,
    search: debouncedSearchQuery || undefined,
  }

  // Queries
  const { data, loading, error, refetch } = useQuery(ANNOUNCEMENT_LISTS_QUERY, {
    variables,
  })

  // Mutations
  const [createAnnouncement] = useMutation(CREATE_ANNOUNCEMENT_MUTATION, {
    onCompleted: () => {
      refetch()
      handleCloseModal()
      toast.success('Announcement Created Successfully')
    },
  })
  const [updateAnnouncement] = useMutation(UPDATE_ANNOUNCEMENT_MUTATION, {
    onCompleted: () => {
      refetch()
      handleCloseModal()
      toast.success('Announcement Updated Successfully')
    },
  })
  const [deleteAnnouncement] = useMutation(DELETE_ANNOUNCEMENT_MUTATION, {
    onCompleted: () => {
      refetch()
      toast.success('Announcement Deleted Successfully')
    },
  })

  const announcements = data?.announcementLists?.announcements || []
  const totalAnnouncements = data?.announcementLists?.count || 0
  const totalPages = Math.max(1, Math.ceil(totalAnnouncements / PAGE_SIZE))

  useEffect(() => {
    if (!hasMountedSearch.current) {
      hasMountedSearch.current = true
      return
    }

    setCurrentPage(1)
  }, [debouncedSearchQuery])

  const handleOpenModal = (announcement?: any) => {
    if (announcement) {
      setEditingId(announcement.id)
      setFormData({
        title: announcement.title,
        message: announcement.message,
        isActive: announcement.isActive,
        actionLabel: announcement.actionLabel,
        actionUrl: announcement.actionUrl,
        priority: announcement.priority,
        type: announcement.type,
        isDismissible: announcement.isDismissible,
      })
    } else {
      setEditingId(null)
      setFormData({
        title: '',
        message: '',
        actionLabel: '',
        actionUrl: '',
        priority: 0,
        type: 'INFO',
        isActive: true,
        isDismissible: true,
      })
    }
    setOpened(true)
  }

  const handleCloseModal = () => {
    setOpened(false)
    setEditingId(null)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.message) {
      alert('Please fill in all required fields')
      return
    }

    const input = {
      title: formData.title,
      message: formData.message,
      actionLabel: formData.actionLabel,
      actionUrl: formData.actionUrl,
      priority: formData.priority,
      type: formData.type,
      isActive: formData.isActive,
      isDismissible: formData.isDismissible,
      ...(editingId ? {} : { createdById: currentUser?.id }),
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
          input: { ...input, createdById: currentUser?.id },
        },
      })
    }
  }

  const handleDelete = async (announcement: any) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      await deleteAnnouncement({
        variables: { id: announcement.id },
      })
    }
  }

  if (loading && !data) {
    return (
      <Container size="xl" py="xl">
        <Group justify="center" p="xl">
          <Loader size="sm" />
        </Group>
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          variant="filled"
        >
          Failed to load announcements: {error.message}
        </Alert>
      </Container>
    )
  }

  const columns = [
    {
      key: 'title',
      header: 'Title',
      thClassName: 'w-64',
    },
    {
      key: 'message',
      header: 'Message',
      render: (val: string) => val,
      thClassName: 'w-96',
    },
    {
      key: 'type',
      header: 'Type',
      render: (val: string) => (
        <Badge color={val === 'INFO' ? 'blue' : 'red'}>{val}</Badge>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (val: string) => format(parseISO(val), 'MMM dd, yyyy'),
    },
    {
      key: 'isDismissible',
      header: 'Dismissible',
      render: (val: boolean) => (
        <Badge color={val ? 'green' : 'red'}>{val ? 'Yes' : 'No'}</Badge>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (val: boolean) => (
        <Badge color={val ? 'green' : 'red'}>
          {val ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ]

  return (
    <Container
      size="xl"
      py={{ base: 'sm', sm: 'md', md: 'xl' }}
      px={{ base: 'xs', sm: 'md' }}
    >
      {/* <Stack gap="lg"> */}
      <Card bg="transparent" shadow="none">
        <Card.Section py="md">
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

        <Card.Section pb="md">
          <Group
            gap="md"
            className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4"
            grow={true}
          >
            <TextInput
              placeholder="Search by title or message..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              className="flex-1"
            />
          </Group>
        </Card.Section>

        <Card.Section>
          <CrudTable
            data={announcements}
            columns={columns as any}
            isLoading={loading && !data}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        </Card.Section>

        <AdminPagination
          label="announcements"
          totalItems={totalAnnouncements}
          page={currentPage}
          totalPages={totalPages}
          route={routes.adminAnnouncements as RouteBuilder}
          query={{
            search: debouncedSearchQuery || undefined,
          }}
          onPageChange={setCurrentPage}
          pageSize={PAGE_SIZE}
        />
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
            label="Message"
            placeholder="Announcement message"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.currentTarget.value })
            }
            required
          />
          <NumberInput
            label="Priority"
            placeholder="1"
            min={0}
            value={formData.priority}
            onChange={(value) =>
              setFormData({
                ...formData,
                priority:
                  typeof value === 'number' ? value : Number(value) || 0,
              })
            }
          />
          <TextInput
            label="Action Label"
            placeholder="Join.."
            value={formData.actionLabel}
            onChange={(e) =>
              setFormData({ ...formData, actionLabel: e.currentTarget.value })
            }
          />
          <TextInput
            label="Action URL"
            placeholder="https://..."
            value={formData.actionUrl}
            onChange={(e) =>
              setFormData({ ...formData, actionUrl: e.currentTarget.value })
            }
          />
          <Select
            label="Type"
            placeholder="Select type"
            data={['INFO', 'SUCCESS', 'WARNING', 'ERROR']}
            value={formData.type}
            required
            onChange={(value) =>
              setFormData({ ...formData, type: value || 'INFO' })
            }
          />
          <Switch
            label="Dismissible"
            checked={formData.isDismissible}
            onChange={(event) =>
              setFormData({
                ...formData,
                isDismissible: event.currentTarget.checked,
              })
            }
            description="Dismiss not showing on user"
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
            description="Not displayed on user"
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
      {/* </Stack> */}
    </Container>
  )
}

export default AnnouncementComponent
