import { useEffect, useRef, useState } from 'react'

import {
  Alert,
  Button,
  TextInput,
  Select,
  Group,
  Loader,
  Text,
  Badge,
  Grid,
  Container,
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useDebouncedValue } from '@mantine/hooks'
import { Trash, Plus, Pencil } from '@phosphor-icons/react'
import { IconAlertCircle, IconSearch } from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'

import { routes, useParams } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AdminPagination from 'src/components/AdminPagination/AdminPagination'
import { CrudTable } from 'src/components/CrudTable'
import AttendanceModal from 'src/components/Modals/AttendanceModal'

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
  const [attendance, setAttendance] = useState<Record<string, any>>({})
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
  const { data, loading, error, refetch } = useQuery(
    GET_PAGINATED_ATTENDANCES,
    { variables }
  )
  const { data: classesData = [] } = useQuery(CLASSES_QUERY) || []
  const { data: usersData = [] } =
    useQuery(USERS_QUERY, { variables: { role: 'PLAYER' } }) || []

  // Mutations
  const [createAttendance] = useMutation(CREATE_ATTENDANCE_MUTATION, {
    onCompleted: () => {
      refetch()
      handleCloseModal()
      toast.success('Attendance Created Successfully')
    },
  })
  const [updateAttendance] = useMutation(UPDATE_ATTENDANCE_MUTATION, {
    onCompleted: () => {
      refetch()
      handleCloseModal()
      toast.success('Attendance Updated Successfully')
    },
  })
  const [deleteAttendance] = useMutation(DELETE_ATTENDANCE_MUTATION, {
    onCompleted: () => {
      refetch()
      toast.success('Attendance Deleted Successfully')
    },
  })

  const classes = classesData?.classes || []
  const users = usersData?.usersQuery || []
  const attendances = data?.paginatedAttendances?.items || []
  const totalAttendances = data?.paginatedAttendances?.totalCount || 0
  const totalPages =
    attendances?.paginatedAttendances?.totalPages ??
    Math.max(1, Math.ceil(totalAttendances / PAGE_SIZE))

  useEffect(() => {
    if (!hasMountedFilters.current) {
      hasMountedFilters.current = true
      return
    }

    setCurrentPage(1)
  }, [debouncedSearchQuery, filterClass, filterUser, filterDate, filterStatus])

  const handleEdit = (attendance?: any) => {
    if (attendance) {
      setAttendance(attendance)
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
      setAttendance(null)
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
    setAttendance(null)
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

    if (attendance) {
      await updateAttendance({
        variables: {
          id: attendance?.id,
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

  const handleDeleteClick = async (id: any) => {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      await deleteAttendance({
        variables: { id },
      })
    }
  }

  const columns = [
    {
      key: 'attendanceDate',
      header: 'Date',
      render: (val: string) => format(parseISO(val), 'MMM dd, yyyy HH:mm'),
    },
    {
      key: 'class',
      header: 'Class',
      render: (val: Record<string, string>) => val.name,
    },
    {
      key: 'user',
      header: 'User',
      render: (val: Record<string, string[]>) => (
        <Text size="sm">
          {val.profile?.firstName} {val.profile?.lastName}
          <Text size="xs" c="gray">
            {val.email}
          </Text>
        </Text>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val: string) => (
        <Badge color={ATTENDANCE_STATUS_COLORS[val]} variant="light" size="sm">
          {val}
        </Badge>
      ),
    },
    { key: 'notes', header: 'Notes' },
  ]

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
          Failed to load attendance records: {error.message}
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
            Attendance Records
          </Text>
          <Text size="sm" color="dimmed">
            Manage users attendance and others
          </Text>
        </div>
        <Button leftSection={<Plus size={16} />} onClick={() => handleEdit()}>
          Add Attendance
        </Button>
      </Group>

      <Group
        gap="sm"
        mb="lg"
        className="rounded-lg border border-gray-200 bg-white p-1 sm:p-2"
        grow={true}
      >
        <Grid p="md" gutter="md">
          <Grid.Col span={{ base: 12 }}>
            <TextInput
              label="Search"
              placeholder="Search by player, email, class, or notes"
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
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
                  `${u.profile?.firstName} ${u.profile?.lastName}` || u.email,
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
      </Group>

      <CrudTable
        data={attendances}
        columns={columns as any}
        isLoading={loading && !data}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {attendances.length > 0 && totalPages > 1 && (
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
      )}

      <AttendanceModal
        isOpen={opened}
        onClose={handleCloseModal}
        onSave={handleSave}
        attendanceData={attendance}
        classes={classes}
        users={users}
      />
    </Container>
  )
}
