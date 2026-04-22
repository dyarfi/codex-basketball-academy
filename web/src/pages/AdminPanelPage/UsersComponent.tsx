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
import UserModal from 'src/components/Modals/UserModal'
import { ToastContainer } from 'src/components/Toast/Toast'
import { useToast } from 'src/components/Toast/useToast'
import { GET_USERS, UPDATE_USER, DELETE_USER } from 'src/graphql/users-queries'

const UsersPage = () => {
  const { toasts, success, error: toastError, removeToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const { data, loading, error, refetch } = useQuery(GET_USERS)

  const [updateUser, { loading: isUpdating }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      success('User updated successfully')
      setIsModalOpen(false)
      setSelectedUser(null)
      refetch()
    },
    onError: (err) => {
      toastError(err.message || 'Failed to update user')
    },
  })

  const [deleteUser, { loading: isDeleting }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      success('User deleted successfully')
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
      refetch()
    },
    onError: (err) => {
      toastError(err.message || 'Failed to delete user')
    },
  })

  const users = data?.users || []

  const filteredUsers = useMemo(() => {
    return users.filter((user: any) => {
      const fullName = `${user.profile?.firstName || ''} ${
        user.profile?.lastName || ''
      }`.toLowerCase()
      const matchesSearch =
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fullName.includes(searchQuery.toLowerCase())

      const matchesRole = !roleFilter || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, roleFilter])

  const handleCreate = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleSave = (values: any) => {
    if (selectedUser) {
      updateUser({
        variables: {
          id: selectedUser.id,
          input: {
            email: values.email,
            role: values.role,
            isActive: values.isActive,
          },
        },
      })
    } else {
      toastError(
        'User creation needs an invitation/password setup flow and is not enabled yet.'
      )
    }
  }

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteUser({
        variables: { id: selectedUser.id },
      })
    }
  }

  const columns = [
    {
      key: 'profile',
      header: 'Name',
      render: (val: any) => (
        <Text size="sm">
          {val?.firstName} {val?.lastName}
        </Text>
      ),
    },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (val: string) => {
        const colors: Record<string, string> = {
          ADMIN: 'red',
          COACH: 'blue',
          PLAYER: 'green',
          PARENT: 'purple',
          PROSPECT: 'gray',
        }
        return <Badge color={colors[val] || 'gray'}>{val}</Badge>
      },
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
    {
      key: 'createdAt',
      header: 'Joined',
      render: (val: string) => (
        <Text size="sm">{new Date(val).toLocaleDateString()}</Text>
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
            Failed to load users: {error.message}
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
              Users Management
            </Text>
            <Text size="sm" color="dimmed">
              Manage system users, roles, and access permissions
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleCreate}
            color="blue"
          >
            Add New User
          </Button>
        </Group>

        <Group
          gap="md"
          mb="lg"
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          <TextInput
            placeholder="Search by name or email..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className="flex-1"
          />

          <Select
            placeholder="Filter by role"
            data={[
              { value: '', label: 'All Roles' },
              { value: 'ADMIN', label: 'Admin' },
              { value: 'COACH', label: 'Coach' },
              { value: 'PLAYER', label: 'Player' },
              { value: 'PARENT', label: 'Parent' },
              { value: 'PROSPECT', label: 'Prospect' },
            ]}
            value={roleFilter || ''}
            onChange={(value) => setRoleFilter(value || null)}
            clearable
          />
        </Group>

        <CrudTable
          data={filteredUsers}
          columns={columns as any}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          userData={selectedUser}
          isLoading={isUpdating}
        />

        <ConfirmDelete
          isOpen={isDeleteModalOpen}
          title="Delete User"
          message={`Are you sure you want to delete user "${selectedUser?.email}"? This action will permanently remove their access.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isLoading={isDeleting}
        />

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </Container>
    </AdminLayout>
  )
}

export default UsersPage
