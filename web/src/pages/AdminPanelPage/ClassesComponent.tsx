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
import { IconSearch, IconPlus, IconAlertCircle } from '@tabler/icons-react'

import { routes, useParams } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'

import AdminLayout from 'src/components/AdminLayout/AdminLayout'
import AdminPagination from 'src/components/AdminPagination/AdminPagination'
import { CrudTable } from 'src/components/CrudTable'
import ClassModal from 'src/components/Modals/ClassModal'
import { ConfirmDelete } from 'src/components/Modals/ConfirmDelete'
import { ToastContainer } from 'src/components/Toast/Toast'
import { useToast } from 'src/components/Toast/useToast'
import {
  GET_PAGINATED_CLASSES,
  CREATE_CLASS,
  UPDATE_CLASS,
  DELETE_CLASS,
} from 'src/graphql/classes-queries'
import { GET_PROGRAMS } from 'src/graphql/programs-queries'
import { GET_COACHES } from 'src/graphql/users-queries'

const getPageFromParam = (value: unknown) => {
  const parsedPage = Number(value)

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

const ClassesPage = () => {
  const PAGE_SIZE = 10
  const { page = 1, search, programId } = useParams()
  const { toasts, success, error: toastError, removeToast } = useToast()
  const [searchQuery, setSearchQuery] = useState(
    typeof search === 'string' ? search : ''
  )
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)
  const [programFilter, setProgramFilter] = useState<string | null>(
    typeof programId === 'string' ? programId : null
  )
  const [currentPage, setCurrentPage] = useState(() => getPageFromParam(page))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const variables = {
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: debouncedSearchQuery || undefined,
    programId: programFilter || undefined,
  }
  const { data, loading, error, refetch } = useQuery(GET_PAGINATED_CLASSES, {
    variables,
  })

  // Fetch programs and coaches for the modal
  const { data: programsData, loading: programsLoading } =
    useQuery(GET_PROGRAMS)
  const { data: coachesData, loading: coachesLoading } = useQuery(GET_COACHES)

  const [createClass, { loading: isCreating }] = useMutation(CREATE_CLASS, {
    onCompleted: () => {
      success('Class created successfully')
      setIsModalOpen(false)
      refetch()
    },
    onError: (err) => {
      toastError(err.message || 'Failed to create class')
    },
    refetchQueries: [{ query: GET_PAGINATED_CLASSES, variables }],
    awaitRefetchQueries: true,
  })

  const [updateClass, { loading: isUpdating }] = useMutation(UPDATE_CLASS, {
    onCompleted: () => {
      success('Class updated successfully')
      setIsModalOpen(false)
      setSelectedClass(null)
      refetch()
    },
    onError: (err) => {
      toastError(err.message || 'Failed to update class')
    },
    refetchQueries: [{ query: GET_PAGINATED_CLASSES, variables }],
    awaitRefetchQueries: true,
  })

  const [deleteClass, { loading: isDeleting }] = useMutation(DELETE_CLASS, {
    onCompleted: () => {
      success('Class deleted successfully')
      setIsDeleteModalOpen(false)
      setSelectedClass(null)
      refetch()
    },
    onError: (err) => {
      toastError(err.message || 'Failed to delete class')
    },
    refetchQueries: [{ query: GET_PAGINATED_CLASSES, variables }],
    awaitRefetchQueries: true,
  })

  const classes = data?.paginatedClasses?.items || []
  const totalClasses = data?.paginatedClasses?.totalCount || 0
  const programs = programsData?.programs || []
  const coaches = useMemo(() => {
    return (coachesData?.users || []).filter((u: any) => u.role === 'COACH')
  }, [coachesData])
  const totalPages =
    data?.paginatedClasses?.totalPages ??
    Math.max(1, Math.ceil(totalClasses / PAGE_SIZE))

  const programOptions = useMemo(() => {
    return programs.map((p: any) => ({ value: p.id, label: p.name }))
  }, [programs])

  const handleCreate = () => {
    setSelectedClass(null)
    setIsModalOpen(true)
  }

  const handleEdit = (cls: any) => {
    setSelectedClass(cls)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (cls: any) => {
    setSelectedClass(cls)
    setIsDeleteModalOpen(true)
  }

  const handleSave = (values: any) => {
    if (selectedClass) {
      updateClass({
        variables: {
          id: selectedClass.id,
          input: values,
        },
      })
    } else {
      createClass({
        variables: {
          input: values,
        },
      })
    }
  }

  const handleConfirmDelete = () => {
    if (selectedClass) {
      deleteClass({
        variables: { id: selectedClass.id },
      })
    }
  }

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'program',
      header: 'Program',
      render: (val: any) => <Text size="sm">{val?.name || 'N/A'}</Text>,
    },
    {
      key: 'coach',
      header: 'Coach',
      render: (val: any) => (
        <Text size="sm">
          {val?.profile?.firstName} {val?.profile?.lastName}
        </Text>
      ),
    },
    {
      key: 'scheduleDay',
      header: 'Schedule',
      render: (_val: any, item: any) => (
        <Text size="sm">
          {item.scheduleDay} @ {item.scheduleTime}
        </Text>
      ),
    },
    {
      key: 'capacity',
      header: 'Enrollment',
      render: (_val: any, item: any) => (
        <Badge
          color={
            item.currentEnrollment >= item.capacity
              ? 'red'
              : item.currentEnrollment >= item.capacity * 0.8
                ? 'orange'
                : 'green'
          }
          variant="light"
        >
          {item.currentEnrollment} / {item.capacity}
        </Badge>
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
            Failed to load classes: {error.message}
          </Alert>
        </Container>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Container size="xl" py="xl">
        <Group justify="space-between" mb="lg">
          <div>
            <Text size="xl" fw={700}>
              Classes Management
            </Text>
            <Text size="sm" color="dimmed">
              Organize and schedule training sessions
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleCreate}
            color="blue"
          >
            Add New Class
          </Button>
        </Group>

        <Group
          gap="md"
          mb="lg"
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          <TextInput
            placeholder="Search by class name..."
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
        </Group>

        <CrudTable
          data={classes}
          columns={columns as any}
          isLoading={loading && !data}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <AdminPagination
          label="classes"
          totalItems={totalClasses}
          page={currentPage}
          totalPages={totalPages}
          route={routes.adminClasses}
          query={{
            search: debouncedSearchQuery || undefined,
            programId: programFilter || undefined,
          }}
          onPageChange={setCurrentPage}
          pageSize={PAGE_SIZE}
        />

        <ClassModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          classData={selectedClass}
          programs={programs}
          coaches={coaches}
          isLoading={isCreating || isUpdating}
          isDataLoading={programsLoading || coachesLoading}
        />

        <ConfirmDelete
          isOpen={isDeleteModalOpen}
          title="Delete Class"
          message={`Are you sure you want to delete "${selectedClass?.name}"? This will also affect enrolled students.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isLoading={isDeleting}
        />

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </Container>
    </AdminLayout>
  )
}

export default ClassesPage
