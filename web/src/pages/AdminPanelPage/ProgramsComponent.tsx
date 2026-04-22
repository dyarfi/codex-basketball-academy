import React, { useState, useMemo } from 'react'

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
import { IconSearch, IconPlus, IconAlertCircle } from '@tabler/icons-react'

import { useQuery, useMutation } from '@redwoodjs/web'

import AdminLayout from 'src/components/AdminLayout/AdminLayout'
import { CrudTable } from 'src/components/CrudTable'
import { ConfirmDelete } from 'src/components/Modals/ConfirmDelete'
import ProgramModal from 'src/components/Modals/ProgramModal'
import { ToastContainer } from 'src/components/Toast/Toast'
import { useToast } from 'src/components/Toast/useToast'
import {
  GET_PROGRAMS,
  CREATE_PROGRAM,
  UPDATE_PROGRAM,
  DELETE_PROGRAM,
} from 'src/graphql/programs-queries'

const ProgramsPage = () => {
  const { toasts, success, error: toastError, removeToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<any>(null)

  const { data, loading, error, refetch } = useQuery(GET_PROGRAMS)

  const [createProgram, { loading: isCreating }] = useMutation(CREATE_PROGRAM, {
    onCompleted: () => {
      success('Program created successfully')
      setIsModalOpen(false)
      refetch()
    },
    onError: (err) => {
      toastError(err.message || 'Failed to create program')
    },
  })

  const [updateProgram, { loading: isUpdating }] = useMutation(UPDATE_PROGRAM, {
    onCompleted: () => {
      success('Program updated successfully')
      setIsModalOpen(false)
      setSelectedProgram(null)
      refetch()
    },
    onError: (err) => {
      toastError(err.message || 'Failed to update program')
    },
  })

  const [deleteProgram, { loading: isDeleting }] = useMutation(DELETE_PROGRAM, {
    onCompleted: () => {
      success('Program deleted successfully')
      setIsDeleteModalOpen(false)
      setSelectedProgram(null)
      refetch()
    },
    onError: (err) => {
      toastError(err.message || 'Failed to delete program')
    },
  })

  const programs = data?.programs || []

  const filteredPrograms = useMemo(() => {
    return programs.filter((program: any) => {
      const matchesSearch = program.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesLevel = !levelFilter || program.level === levelFilter
      return matchesSearch && matchesLevel
    })
  }, [programs, searchQuery, levelFilter])

  const handleCreate = () => {
    setSelectedProgram(null)
    setIsModalOpen(true)
  }

  const handleEdit = (program: any) => {
    setSelectedProgram(program)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (program: any) => {
    setSelectedProgram(program)
    setIsDeleteModalOpen(true)
  }

  const handleSave = (values: any) => {
    if (selectedProgram) {
      updateProgram({
        variables: {
          id: selectedProgram.id,
          input: values,
        },
      })
    } else {
      createProgram({
        variables: {
          input: values,
        },
      })
    }
  }

  const handleConfirmDelete = () => {
    if (selectedProgram) {
      deleteProgram({
        variables: { id: selectedProgram.id },
      })
    }
  }

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'level',
      header: 'Level',
      render: (val: string) => {
        const colors: Record<string, string> = {
          BEGINNER: 'green',
          INTERMEDIATE: 'blue',
          ADVANCED: 'orange',
          ELITE: 'red',
        }
        return <Badge color={colors[val] || 'gray'}>{val}</Badge>
      },
    },
    {
      key: 'pricePerMonth',
      header: 'Price/Month',
      render: (val: number) => `$${val.toFixed(2)}`,
    },
    { key: 'capacity', header: 'Capacity' },
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
            Failed to load programs: {error.message}
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
              Programs Management
            </Text>
            <Text size="sm" color="dimmed">
              Create and manage basketball training programs
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleCreate}
            color="blue"
          >
            Add New Program
          </Button>
        </Group>

        <Group
          gap="md"
          mb="lg"
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          <TextInput
            placeholder="Search by program name..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className="flex-1"
          />

          <Select
            placeholder="Filter by level"
            data={[
              { value: '', label: 'All Levels' },
              { value: 'BEGINNER', label: 'Beginner' },
              { value: 'INTERMEDIATE', label: 'Intermediate' },
              { value: 'ADVANCED', label: 'Advanced' },
              { value: 'ELITE', label: 'Elite' },
            ]}
            value={levelFilter || ''}
            onChange={(value) => setLevelFilter(value || null)}
            clearable
          />
        </Group>

        <CrudTable
          data={filteredPrograms}
          columns={columns as any}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <ProgramModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          program={selectedProgram}
          isLoading={isCreating || isUpdating}
        />

        <ConfirmDelete
          isOpen={isDeleteModalOpen}
          title="Delete Program"
          message={`Are you sure you want to delete "${selectedProgram?.name}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isLoading={isDeleting}
        />

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </Container>
    </AdminLayout>
  )
}

export default ProgramsPage
