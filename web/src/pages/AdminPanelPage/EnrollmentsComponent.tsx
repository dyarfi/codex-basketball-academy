import React, { useMemo, useState } from 'react'

import {
  Container,
  Group,
  Button,
  Badge,
  TextInput,
  Select,
  Text,
  Loader,
  Alert,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { CheckCircleIcon, TrashIcon } from '@phosphor-icons/react'
import { IconSearch, IconPlus, IconAlertCircle } from '@tabler/icons-react'

import { routes, useParams } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'

import AdminLayout from 'src/components/AdminLayout/AdminLayout'
import AdminPagination from 'src/components/AdminPagination/AdminPagination'
import { CrudTable } from 'src/components/CrudTable'
import { ConfirmDelete } from 'src/components/Modals/ConfirmDelete'
import EnrollmentModal from 'src/components/Modals/EnrollmentModal'
import { ToastContainer } from 'src/components/Toast/Toast'
import { useToast } from 'src/components/Toast/useToast'
import { GET_CLASSES } from 'src/graphql/classes-queries'
import {
  GET_PAGINATED_ENROLLMENTS,
  CREATE_ENROLLMENT,
  UPDATE_ENROLLMENT,
  DELETE_ENROLLMENT,
  COMPLETE_ENROLLMENT,
} from 'src/graphql/enrollments-queries'
import { GET_PROGRAMS } from 'src/graphql/programs-queries'
import { GET_USERS } from 'src/graphql/users-queries'

const getPageFromParam = (value: unknown) => {
  const parsedPage = Number(value)

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

const EnrollmentsComponent = () => {
  const PAGE_SIZE = 10
  const { page = 1, search, programId, status } = useParams()
  const { toasts, success, error: toastError, removeToast } = useToast()
  const [searchQuery, setSearchQuery] = useState(
    typeof search === 'string' ? search : ''
  )
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)
  const [programFilter, setProgramFilter] = useState<string | null>(
    typeof programId === 'string' ? programId : null
  )
  const [statusFilter, setStatusFilter] = useState<string | null>(
    typeof status === 'string' ? status : null
  )
  const [currentPage, setCurrentPage] = useState(() => getPageFromParam(page))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null)

  const variables = {
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: debouncedSearchQuery || undefined,
    programId: programFilter || undefined,
    status: statusFilter || undefined,
  }

  const { data, loading, error, refetch } = useQuery(
    GET_PAGINATED_ENROLLMENTS,
    {
      variables,
    }
  )

  // Fetch programs, classes, and users for the modal
  const { data: programsData, loading: programsLoading } =
    useQuery(GET_PROGRAMS)
  const { data: classesData, loading: classesLoading } = useQuery(GET_CLASSES)
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS)

  const [createEnrollment, { loading: isCreating }] = useMutation(
    CREATE_ENROLLMENT,
    {
      onCompleted: () => {
        success('Enrollment created successfully')
        setIsModalOpen(false)
        refetch()
      },
      onError: (err) => {
        toastError(err.message || 'Failed to create enrollment')
      },
      refetchQueries: [{ query: GET_PAGINATED_ENROLLMENTS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const [updateEnrollment, { loading: isUpdating }] = useMutation(
    UPDATE_ENROLLMENT,
    {
      onCompleted: () => {
        success('Enrollment updated successfully')
        setIsModalOpen(false)
        setSelectedEnrollment(null)
        refetch()
      },
      onError: (err) => {
        toastError(err.message || 'Failed to update enrollment')
      },
      refetchQueries: [{ query: GET_PAGINATED_ENROLLMENTS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const [deleteEnrollment, { loading: isDeleting }] = useMutation(
    DELETE_ENROLLMENT,
    {
      onCompleted: () => {
        success('Enrollment deleted successfully')
        setIsDeleteModalOpen(false)
        setSelectedEnrollment(null)
        refetch()
      },
      onError: (err) => {
        toastError(err.message || 'Failed to delete enrollment')
      },
      refetchQueries: [{ query: GET_PAGINATED_ENROLLMENTS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const [completeEnrollment, { loading: isCompleting }] = useMutation(
    COMPLETE_ENROLLMENT,
    {
      onCompleted: (data) => {
        const email = data?.completeEnrollment?.user?.email
        success(
          `Enrollment completed! Certificate auto-issued${email ? ` for ${email}` : ''}`
        )
        refetch()
      },
      onError: (err) => {
        toastError(err.message || 'Failed to complete enrollment')
      },
      refetchQueries: [{ query: GET_PAGINATED_ENROLLMENTS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const enrollments = data?.paginatedEnrollments?.items || []
  const totalEnrollments = data?.paginatedEnrollments?.totalCount || 0
  const programs = programsData?.programs || []
  const classes = classesData?.classes || []
  const players = useMemo(() => {
    return (usersData?.users || []).filter((u: any) => u.role === 'PLAYER')
  }, [usersData])

  const totalPages =
    data?.paginatedEnrollments?.totalPages ??
    Math.max(1, Math.ceil(totalEnrollments / PAGE_SIZE))

  const programOptions = useMemo(() => {
    return programs.map((p: any) => ({ value: p.id, label: p.name }))
  }, [programs])

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'COMPLETED', label: 'Completed' },
  ]

  const handleCreate = () => {
    setSelectedEnrollment(null)
    setIsModalOpen(true)
  }

  const handleEdit = (enrollment: any) => {
    setSelectedEnrollment(enrollment)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (enrollment: any) => {
    setSelectedEnrollment(enrollment)
    setIsDeleteModalOpen(true)
  }

  const handleSave = (values: any) => {
    if (selectedEnrollment) {
      updateEnrollment({
        variables: {
          id: selectedEnrollment.id,
          input: {
            ...values,
            enrollmentDate: new Date().toISOString(),
          },
        },
      })
    } else {
      createEnrollment({
        variables: {
          input: {
            ...values,
            enrollmentDate: new Date().toISOString(),
          },
        },
      })
    }
  }

  const handleConfirmDelete = () => {
    if (selectedEnrollment) {
      deleteEnrollment({
        variables: { id: selectedEnrollment.id },
      })
    }
  }

  const handleCompleteEnrollment = (enrollment: any) => {
    completeEnrollment({ variables: { id: enrollment.id } })
  }

  const columns = [
    {
      key: 'user',
      header: 'Player',
      render: (val: any) => (
        <Text size="sm">
          {val?.profile?.firstName} {val?.profile?.lastName}
        </Text>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      render: (val: any) => <Text size="sm">{val?.name || 'N/A'}</Text>,
    },
    {
      key: 'program',
      header: 'Program',
      render: (val: any) => <Text size="sm">{val?.name || 'N/A'}</Text>,
    },
    {
      key: 'status',
      header: 'Status',
      thClassName: 'w-32',
      render: (val: string) => (
        <Badge
          size="xs"
          color={
            val === 'ACTIVE' ? 'green' : val === 'COMPLETED' ? 'blue' : 'red'
          }
        >
          {val}
        </Badge>
      ),
    },
    {
      key: 'enrollmentDate',
      header: 'Enrollment Date',
      render: (val: string) => (
        <Text size="sm">{new Date(val).toLocaleDateString()}</Text>
      ),
    },
    {
      key: 'completionDate',
      header: 'Completion Date',
      render: (val: string) => (
        <Text size="sm">{val ? new Date(val).toLocaleDateString() : '-'}</Text>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, enrollment: any) => (
        <Group gap="xs" wrap="nowrap">
          {enrollment.status === 'ACTIVE' && !enrollment.completionDate && (
            <Button
              size="xs"
              variant="light"
              color="green"
              leftSection={<CheckCircleIcon size={14} />}
              onClick={() => handleCompleteEnrollment(enrollment)}
              loading={isCompleting}
            >
              Complete
            </Button>
          )}
          <Button
            size="xs"
            color="red"
            variant="light"
            leftSection={<TrashIcon size={14} />}
            onClick={() => handleDeleteClick(enrollment)}
          >
            Delete
          </Button>
        </Group>
      ),
    },
  ]

  if (loading && !data) {
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

  if (error) {
    return (
      <AdminLayout>
        <Container size="xl" py="xl">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            variant="filled"
          >
            Failed to load enrollments: {error.message}
          </Alert>
        </Container>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Container size="xl" py={{ base: 'sm', sm: 'md', md: 'xl' }} px={{ base: 'xs', sm: 'md' }}>
        <Group justify="space-between" mb="lg" grow={true} align="flex-start">
          <div>
            <Text size="xl" fw={700}>
              Enrollments Management
            </Text>
            <Text size="sm" color="dimmed">
              Manage player enrollments in classes and programs
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleCreate}
            color="blue"
          >
            Add New Enrollment
          </Button>
        </Group>

        <Group
          gap="md"
          mb="lg"
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          <TextInput
            placeholder="Search by player name or class..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className="flex-1"
          />

          <Select
            placeholder="Filter by program"
            data={[{ value: '', label: 'All Programs' }, ...programOptions]}
            value={programFilter || ''}
            onChange={(value) => setProgramFilter(value || null)}
            clearable
          />

          <Select
            placeholder="Filter by status"
            data={[{ value: '', label: 'All Status' }, ...statusOptions]}
            value={statusFilter || ''}
            onChange={(value) => setStatusFilter(value || null)}
            clearable
          />
        </Group>

        <CrudTable
          data={enrollments}
          columns={columns as any}
          isLoading={loading && !data}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          showActions={false}
        />

        <AdminPagination
          label="enrollments"
          totalItems={totalEnrollments}
          page={currentPage}
          totalPages={totalPages}
          route={routes.adminEnrollments}
          query={{
            search: debouncedSearchQuery || undefined,
            programId: programFilter || undefined,
            status: statusFilter || undefined,
          }}
          onPageChange={setCurrentPage}
          pageSize={PAGE_SIZE}
        />

        <EnrollmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          enrollmentData={selectedEnrollment}
          programs={programs}
          classes={classes}
          players={players}
          isLoading={isCreating || isUpdating}
          isDataLoading={programsLoading || classesLoading || usersLoading}
        />

        <ConfirmDelete
          isOpen={isDeleteModalOpen}
          title="Delete Enrollment"
          message={`Are you sure you want to delete this enrollment for ${selectedEnrollment?.user?.profile?.firstName}?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isLoading={isDeleting}
        />

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </Container>
    </AdminLayout>
  )
}

export default EnrollmentsComponent
