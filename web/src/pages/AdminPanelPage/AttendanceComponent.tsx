import { useEffect, useRef, useState } from 'react'

import {
  Alert,
  Table,
  Button,
  Modal,
  TextInput,
  Select,
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
  Container,
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useDebouncedValue } from '@mantine/hooks'
import { Trash, Plus, Pencil } from '@phosphor-icons/react'
import { IconAlertCircle, IconSearch } from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'

import { routes, useParams } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'

import { AdminLayout } from 'src/components/AdminLayout'
import AdminPagination from 'src/components/AdminPagination/AdminPagination'

import {
  GET_PAGINATED_ATTENDANCES,
  CREATE_ATTENDANCE_MUTATION,
  UPDATE_ATTENDANCE_MUTATION,
  DELETE_ATTENDANCE_MUTATION,
} from '../../graphql/attendances-queries'
import { CLASSES_QUERY } from '../../graphql/classes-queries'
import { USERS_QUERY } from '../../graphql/users-queries'
import '@mantine/dates/styles.css'

type AttendanceFormData = {
  classId: string
  userId: string
  attendanceDate: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  notes: string
}

const ATTENDANCE_STATUS_COLORS: Record<string, string> = {
  PRESENT: 'green',
  ABSENT: 'red',
  LATE: 'yellow',
  EXCUSED: 'blue',
}

type RouteQuery = Record<string, boolean | number | string | null | undefined>
type RouteBuilder = (params?: RouteQuery) => string

const getPageFromParam = (value: unknown) => {
  const parsedPage = Number(value)

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

const getDateVariable = (value: string | null) => {
  if (!value) {
    return undefined
  }

  const parsedDate = new Date(value)

  return Number.isNaN(parsedDate.getTime())
    ? undefined
    : parsedDate.toISOString()
}

export const AttendanceComponent = () => {
  const PAGE_SIZE = 10
  const { page = 1, search, classId, userId, date, status } = useParams()
  const [searchQuery, setSearchQuery] = useState(
    typeof search === 'string' ? search : ''
  )
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)
  const [currentPage, setCurrentPage] = useState(() => getPageFromParam(page))
  const hasMountedFilters = useRef(false)
  const [opened, setOpened] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<AttendanceFormData>({
    classId: '',
    userId: '',
    attendanceDate: format(new Date(), 'yyyy-MM-dd HH:mm'),
    status: 'PRESENT',
    notes: '',
  })

  // Filters
  const [filterClass, setFilterClass] = useState<string | null>(
    typeof classId === 'string' ? classId : null
  )
  const [filterUser, setFilterUser] = useState<string | null>(
    typeof userId === 'string' ? userId : null
  )
  const [filterDate, setFilterDate] = useState<string | null>(
    typeof date === 'string' ? date : null
  )
  const [filterStatus, setFilterStatus] = useState<string | null>(
    typeof status === 'string' ? status : null
  )

  const variables = {
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: debouncedSearchQuery || undefined,
    classId: filterClass || undefined,
    userId: filterUser || undefined,
    date: getDateVariable(filterDate),
    status: filterStatus || undefined,
  }

  // Queries
  const {
    data: attendancesData,
    loading: attendancesLoading,
    error: attendancesError,
    refetch,
  } = useQuery(GET_PAGINATED_ATTENDANCES, { variables })
  const { data: classesData = [] } = useQuery(CLASSES_QUERY) || []
  const { data: usersData = [] } = useQuery(USERS_QUERY) || []

  // Mutations
  const [createAttendance] = useMutation(CREATE_ATTENDANCE_MUTATION, {
    onCompleted: () => {
      refetch()
      handleCloseModal()
    },
  })
  const [updateAttendance] = useMutation(UPDATE_ATTENDANCE_MUTATION, {
    onCompleted: () => {
      refetch()
      handleCloseModal()
    },
  })
  const [deleteAttendance] = useMutation(DELETE_ATTENDANCE_MUTATION, {
    onCompleted: () => {
      refetch()
    },
  })

  const classes = classesData?.classes || []
  const users = usersData?.users || []
  const attendances = attendancesData?.paginatedAttendances?.items || []
  const totalAttendances =
    attendancesData?.paginatedAttendances?.totalCount || 0
  const totalPages =
    attendancesData?.paginatedAttendances?.totalPages ??
    Math.max(1, Math.ceil(totalAttendances / PAGE_SIZE))

  useEffect(() => {
    if (!hasMountedFilters.current) {
      hasMountedFilters.current = true
      return
    }

    setCurrentPage(1)
  }, [
    debouncedSearchQuery,
    filterClass,
    filterUser,
    filterDate,
    filterStatus,
  ])

  const handleOpenModal = (attendance?: any) => {
    if (attendance) {
      setEditingId(attendance.id)
      setFormData({
        classId: attendance.classId,
        userId: attendance.userId,
        attendanceDate: format(
          parseISO(attendance.attendanceDate),
          'yyyy-MM-dd HH:mm'
        ),
        status: attendance.status,
        notes: attendance.notes || '',
      })
    } else {
      setEditingId(null)
      setFormData({
        classId: '',
        userId: '',
        attendanceDate: format(new Date(), 'yyyy-MM-dd HH:mm'),
        status: 'PRESENT',
        notes: '',
      })
    }
    setOpened(true)
  }

  const handleCloseModal = () => {
    setOpened(false)
    setEditingId(null)
  }

  const handleSave = async () => {
    if (!formData.classId || !formData.userId || !formData.attendanceDate) {
      alert('Please fill in all required fields')
      return
    }

    const input = {
      classId: formData.classId,
      userId: formData.userId,
      attendanceDate: new Date(formData.attendanceDate).toISOString(),
      status: formData.status,
      notes: formData.notes || null,
    }

    if (editingId) {
      await updateAttendance({
        variables: {
          id: editingId,
          input,
        },
      })
    } else {
      await createAttendance({
        variables: {
          input,
        },
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      await deleteAttendance({
        variables: { id },
      })
    }
  }

  if (attendancesLoading && !attendancesData) {
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

  if (attendancesError) {
    return (
      <AdminLayout>
        <Container size="xl" py="xl">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            variant="filled"
          >
            Failed to load attendance records: {attendancesError.message}
          </Alert>
        </Container>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Container
        size="xl"
        py={{ base: 'sm', sm: 'md', md: 'xl' }}
        px={{ base: 'xs', sm: 'md' }}
      >
        <Stack gap="lg">
          <Card withBorder p="lg">
            <Card.Section withBorder inheritPadding py="md">
              <Group justify="space-between">
                <Text fw={800} size="lg">
                  Attendance Records
                </Text>
                <Button
                  leftSection={<Plus size={16} />}
                  onClick={() => handleOpenModal()}
                >
                  Add Attendance
                </Button>
              </Group>
            </Card.Section>

            <Card.Section>
              <Grid p="md" gutter="md">
                <Grid.Col span={{ base: 12 }}>
                  <TextInput
                    label="Search"
                    placeholder="Search by player, email, class, or notes"
                    leftSection={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.currentTarget.value)
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Select
                    label="Filter by Class"
                    placeholder="All Classes"
                    data={classes.map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                    value={filterClass}
                    onChange={setFilterClass}
                    clearable
                    searchable
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Select
                    label="Filter by User"
                    placeholder="All Users"
                    data={users.map((u) => ({
                      value: u.id,
                      label:
                        `${u.profile?.firstName} ${u.profile?.lastName}` ||
                        u.email,
                    }))}
                    value={filterUser}
                    onChange={setFilterUser}
                    clearable
                    searchable
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <DateTimePicker
                    clearable
                    valueFormat="YYYY-MM-DD HH:mm"
                    label="Filter by Date"
                    placeholder="Attendance Date"
                    value={filterDate || ''}
                    onChange={setFilterDate}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Select
                    label="Filter by Status"
                    placeholder="All Status"
                    data={[
                      { value: 'PRESENT', label: 'Present' },
                      { value: 'ABSENT', label: 'Absent' },
                      { value: 'LATE', label: 'Late' },
                      { value: 'EXCUSED', label: 'Excused' },
                    ]}
                    value={filterStatus}
                    onChange={setFilterStatus}
                    clearable
                  />
                </Grid.Col>
              </Grid>
            </Card.Section>

            <Card.Section>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Class</Table.Th>
                    <Table.Th>User</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Notes</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {attendances.length > 0 ? (
                    attendances.map((attendance) => (
                      <Table.Tr key={attendance.id}>
                        <Table.Td>
                          {format(
                            parseISO(attendance.attendanceDate),
                            'MMM dd, yyyy HH:mm'
                          )}
                          {/* {JSON.stringify(attendance.attendanceDate)} */}
                        </Table.Td>
                        <Table.Td>{attendance.class?.name}</Table.Td>
                        <Table.Td>
                          {attendance.user?.profile?.firstName}{' '}
                          {attendance.user?.profile?.lastName ||
                            attendance.user?.email}
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={ATTENDANCE_STATUS_COLORS[attendance.status]}
                            variant="light"
                            size="sm"
                          >
                            {attendance.status}
                          </Badge>
                        </Table.Td>
                        <Table.Td>{attendance.notes}</Table.Td>
                        <Table.Td>
                          <Group gap={0}>
                            <ActionIcon
                              size="sm"
                              color="blue"
                              variant="subtle"
                              onClick={() => handleOpenModal(attendance)}
                            >
                              <Pencil size={16} />
                            </ActionIcon>
                            <ActionIcon
                              size="sm"
                              color="red"
                              variant="subtle"
                              onClick={() => handleDelete(attendance.id)}
                            >
                              <Trash size={16} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Center py="xl">
                          <Text c="dimmed">No attendance records found</Text>
                        </Center>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Card.Section>

            <AdminPagination
              label="attendance records"
              totalItems={totalAttendances}
              page={currentPage}
              totalPages={totalPages}
              route={routes.adminAttendances as RouteBuilder}
              query={{
                search: debouncedSearchQuery || undefined,
                classId: filterClass || undefined,
                userId: filterUser || undefined,
                date: filterDate || undefined,
                status: filterStatus || undefined,
              }}
              onPageChange={setCurrentPage}
              pageSize={PAGE_SIZE}
            />
          </Card>

          <Modal
            opened={opened}
            onClose={handleCloseModal}
            title={editingId ? 'Edit Attendance' : 'Add Attendance'}
            centered
          >
            <Stack gap="md">
              <Select
                label="Class"
                placeholder="Select a class"
                data={classes.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
                value={formData.classId}
                onChange={(value) =>
                  setFormData({ ...formData, classId: value || '' })
                }
                searchable
                required
              />

              <Select
                label="User"
                placeholder="Select a user"
                data={users.map((u) => ({
                  value: u.id,
                  label:
                    `${u.profile?.firstName} ${u.profile?.lastName}` || u.email,
                }))}
                value={formData.userId}
                onChange={(value) =>
                  setFormData({ ...formData, userId: value || '' })
                }
                searchable
                required
              />

              <DateTimePicker
                clearable
                valueFormat="YYYY-MM-DD HH:mm"
                label="Attendance Date"
                placeholder="Attendance Date"
                value={formData.attendanceDate}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    attendanceDate: e as string,
                  })
                }}
                required
              />

              <Select
                label="Status"
                placeholder="Select status"
                data={[
                  { value: 'PRESENT', label: 'Present' },
                  { value: 'ABSENT', label: 'Absent' },
                  { value: 'LATE', label: 'Late' },
                  { value: 'EXCUSED', label: 'Excused' },
                ]}
                value={formData.status}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    status: (value as any) || 'PRESENT',
                  })
                }
                required
              />

              <Textarea
                label="Notes"
                placeholder="Optional notes about attendance"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.currentTarget.value })
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
