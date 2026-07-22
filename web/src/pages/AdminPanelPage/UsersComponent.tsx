import React, { useState } from 'react'

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
  ActionIcon,
  Avatar,
  Stack,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import {
  IconSearch,
  IconPlus,
  IconAlertCircle,
  IconCloudDownload,
  IconPassword,
} from '@tabler/icons-react'

import { routes, useParams } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import AdminPagination from 'src/components/AdminPagination/AdminPagination'
import { CrudTable } from 'src/components/CrudTable'
import { ConfirmDelete } from 'src/components/Modals/ConfirmDelete'
import UserModal from 'src/components/Modals/UserModal'
import {
  GET_PAGINATED_USERS,
  UPDATE_USER,
  DELETE_USER,
  CREATE_USER,
} from 'src/graphql/users-queries'
import { sendEmailMessage } from 'src/lib/fetch'
import { formatDateOfBirth } from 'src/lib/formatters'
// import { sendEmailMessage } from 'src/lib/fetch'

type RouteQuery = Record<string, boolean | number | string | null | undefined>
type RouteBuilder = (params?: RouteQuery) => string

const getPageFromParam = (value: unknown) => {
  const parsedPage = Number(value)

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

const UsersPage = () => {
  const PAGE_SIZE = 10
  const { page = 1, search, role } = useParams()

  const { currentUser } = useAuth()

  const [searchQuery, setSearchQuery] = useState(
    typeof search === 'string' ? search : ''
  )
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)
  const [roleFilter, setRoleFilter] = useState<string | null>(
    typeof role === 'string' ? role : null
  )
  const [currentPage, setCurrentPage] = useState(() => getPageFromParam(page))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const variables = {
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: debouncedSearchQuery || undefined,
    role: roleFilter || undefined,
  }
  const { data, loading, error, refetch } = useQuery(GET_PAGINATED_USERS, {
    variables,
  })

  const users = data?.paginatedUsers?.items || []
  const totalUsers = data?.paginatedUsers?.totalCount || 0
  const totalPages =
    data?.paginatedUsers?.totalPages ??
    Math.max(1, Math.ceil(totalUsers / PAGE_SIZE))

  const [updateUser, { loading: isUpdating }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      toast.success('User updated successfully')
      setIsModalOpen(false)
      setSelectedUser(null)
      refetch()
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update user')
    },
    refetchQueries: [{ query: GET_PAGINATED_USERS, variables }],
    awaitRefetchQueries: true,
  })

  const [createUser, { loading: isCreating }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      toast.success('User created successfully')
      setIsModalOpen(false)
      setSelectedUser(null)
      refetch()
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create user')
    },
    refetchQueries: [{ query: GET_PAGINATED_USERS, variables }],
    awaitRefetchQueries: true,
  })

  const [deleteUser, { loading: isDeleting }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      toast.success('User deleted successfully')
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
      refetch()
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete user')
    },
    refetchQueries: [{ query: GET_PAGINATED_USERS, variables }],
    awaitRefetchQueries: true,
  })

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

            profile: {
              firstName: values.profile.firstName,
              lastName: values.profile.lastName,
              dateOfBirth: values.profile.dateOfBirth
                ? new Date(values.profile.dateOfBirth).toISOString()
                : null,
              gender: values.profile.gender || null,
              phoneNumber: values.profile.phoneNumber || null,
              address: values.profile.address || null,
              city: values.profile.city || null,
              state: values.profile.state || null,
              zipCode: values.profile.zipCode || null,
              country: values.profile.country || null,
              position: values.profile.position || null,
              jerseyNumber: values.profile.jerseyNumber || null,
              heightCm: values.profile.heightCm || null,
              weightKg: values.profile.weightKg || null,
              medicalInfo: values.profile.medicalInfo || null,
              emergencyContactName: values.profile.emergencyContactName || null,
              emergencyContactPhone:
                values.profile.emergencyContactPhone || null,
              relationshipToPlayer: values.profile.relationshipToPlayer || null,
              profilePhoto: values.profile.profilePhoto || null,
            },
          },
        },
      })
      // if (values.role === 'PLAYER') {
      //   sendEmailMessage({
      //     template: 'memberAccepted',
      //     subject: 'Your member status',
      //   })
      // }
    } else {
      createUser({
        variables: {
          input: {
            email: values.email,
            role: values.role,
            isActive: values.isActive,

            profile: {
              firstName: values.profile.firstName,
              lastName: values.profile.lastName,
              dateOfBirth: values.profile.dateOfBirth
                ? new Date(values.profile.dateOfBirth).toISOString()
                : null,
              gender: values.profile.gender || null,
              phoneNumber: values.profile.phoneNumber || null,
              address: values.profile.address || null,
              city: values.profile.city || null,
              state: values.profile.state || null,
              zipCode: values.profile.zipCode || null,
              country: values.profile.country || null,
              position: values.profile.position || null,
              jerseyNumber: values.profile.jerseyNumber || null,
              heightCm: values.profile.heightCm || null,
              weightKg: values.profile.weightKg || null,
              medicalInfo: values.profile.medicalInfo || null,
              emergencyContactName: values.profile.emergencyContactName || null,
              emergencyContactPhone:
                values.profile.emergencyContactPhone || null,
              relationshipToPlayer: values.profile.relationshipToPlayer || null,
              profilePhoto: values.profile.profilePhoto || null,
            },
          },
        },
      })
    }
  }

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteUser({
        variables: { id: selectedUser.id },
      })
    }
  }

  const handleResetPassword = (user: any) => {
    // Disabled temporary
    // return sendEmailMessage({
    //   subject: 'You have reset your password',
    //   to: [{ name: user.email, email: user.email }],
    //   messages: 'Thank you for registering',
    // })
  }

  const columns = [
    {
      key: 'profile',
      header: 'Name',
      render: (val: any, user: any) => (
        <Group>
          <Avatar
            src={user?.profile?.profilePhoto}
            name={val?.firstName + ' ' + val?.lastName}
            alt={val?.firstName + ' ' + val?.lastName}
            variant="light"
          />
          <Text size="sm">
            {val?.firstName} {val?.lastName}
            <Text size="xs" fw="bold" c="gray.6">
              {user?.profile.gender} {` `}
              {user?.role === 'PLAYER' || user?.role === 'PROSPECT'
                ? formatDateOfBirth(user?.profile?.dateOfBirth)
                : ''}
            </Text>
          </Text>
          {currentUser?.role === 'ADMIN'}
        </Group>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (val: any) => (
        <Stack justify="start" align="flex-start" gap={3}>
          <Text size="xs">{val}</Text>
          <Button
            title="Reset Password"
            variant="outline"
            size="compact-xs"
            leftSection={<IconPassword stroke={0.5} />}
            m={0}
            onClick={() => handleResetPassword(user)}
          >
            Reset
          </Button>
        </Stack>
      ),
    },
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
      key: 'teamMemberships',
      header: 'Team',
      render: (memberships: any, { coachedTeams = [], role = '' }: any) => {
        if (!memberships?.length && !coachedTeams?.length) {
          return (
            <Text size="sm" c="dimmed">
              Unassigned
            </Text>
          )
        }
        return (
          <Group gap={'xs'} justify="flex-start">
            {memberships &&
              memberships
                .map((m: any) => m.team?.name)
                .filter(Boolean)
                // .join(', ')
                .map((b: any) => (
                  <Badge key={b} variant="outline" size="xs">
                    {b}
                  </Badge>
                ))}
            {coachedTeams &&
              coachedTeams
                .map((m: any) => m)
                .filter(Boolean)
                // .join(', ')
                .map((b: any) => (
                  <Badge key={b} variant="outline" size="xs">
                    {b.team.ageGroup} {b.role.replace('_', ' ')}
                  </Badge>
                ))}
          </Group>
        )
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
          Failed to load users: {error.message}
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
        className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4"
        grow={true}
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
        data={users}
        columns={columns as any}
        isLoading={loading && !data}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {users.length > 0 && totalPages > 1 && (
        <AdminPagination
          label="users"
          totalItems={totalUsers}
          page={currentPage}
          totalPages={totalPages}
          route={routes.adminUsers as RouteBuilder}
          query={{
            search: debouncedSearchQuery || undefined,
            role: roleFilter || undefined,
          }}
          onPageChange={setCurrentPage}
          pageSize={PAGE_SIZE}
        />
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        userData={selectedUser}
        isLoading={selectedUser ? isUpdating : isCreating}
      />

      <ConfirmDelete
        isOpen={isDeleteModalOpen}
        title="Delete User"
        message={`Are you sure you want to delete user "${selectedUser?.email}"? This action will permanently remove their access.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </Container>
  )
}

export default UsersPage
