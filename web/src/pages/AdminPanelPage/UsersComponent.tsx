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
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import {
  PDFDownloadLink,
  Document,
  Page,
  Text as TextPdf,
} from '@react-pdf/renderer'
import {
  IconSearch,
  IconPlus,
  IconAlertCircle,
  IconCloudDownload,
} from '@tabler/icons-react'

import { routes, useParams } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'

import AdminPagination from 'src/components/AdminPagination/AdminPagination'
import { CrudTable } from 'src/components/CrudTable'
import { ConfirmDelete } from 'src/components/Modals/ConfirmDelete'
import UserModal from 'src/components/Modals/UserModal'
import { ToastContainer } from 'src/components/Toast/Toast'
import { useToast } from 'src/components/Toast/useToast'
import {
  GET_PAGINATED_USERS,
  UPDATE_USER,
  DELETE_USER,
  CREATE_USER,
} from 'src/graphql/users-queries'

type RouteQuery = Record<string, boolean | number | string | null | undefined>
type RouteBuilder = (params?: RouteQuery) => string

const getPageFromParam = (value: unknown) => {
  const parsedPage = Number(value)

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

const UsersPage = () => {
  const PAGE_SIZE = 10
  const { page = 1, search, role } = useParams()
  const { toasts, success, error: toastError, removeToast } = useToast()
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
    refetchQueries: [{ query: GET_PAGINATED_USERS, variables }],
    awaitRefetchQueries: true,
  })

  const [createUser, { loading: isCreating }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      success('User created successfully')
      setIsModalOpen(false)
      setSelectedUser(null)
      refetch()
    },
    onError: (err) => {
      toastError(err.message || 'Failed to create user')
    },
    refetchQueries: [{ query: GET_PAGINATED_USERS, variables }],
    awaitRefetchQueries: true,
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
    refetchQueries: [{ query: GET_PAGINATED_USERS, variables }],
    awaitRefetchQueries: true,
  })

  const users = data?.paginatedUsers?.items || []
  const totalUsers = data?.paginatedUsers?.totalCount || 0
  const totalPages =
    data?.paginatedUsers?.totalPages ??
    Math.max(1, Math.ceil(totalUsers / PAGE_SIZE))

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

  const columns = [
    {
      key: 'profile',
      header: 'Name',
      render: (val: any, user: any) => (
        <Group>
          <Text size="sm">
            {val?.firstName} {val?.lastName}
          </Text>
          {user.role === 'PLAYER' && (
            <ActionIcon
              size="sm"
              onClick={() => {
                setSelectedUser(val)
              }}
            >
              <PDFDownloadLink
                document={
                  <Document>
                    <Page>
                      <TextPdf>First Name: {val?.firstName}</TextPdf>
                      <TextPdf>Last Name: {val?.lastName}</TextPdf>
                      <TextPdf>Birthdate: {val?.dateOfBirth}</TextPdf>
                      <TextPdf>Position: {val?.position}</TextPdf>
                      <TextPdf>Number:{val?.jerseyNumber}</TextPdf>
                      <TextPdf>JSON:{JSON.stringify(val)}</TextPdf>
                    </Page>
                  </Document>
                }
                fileName={`${val?.firstName}-${val?.dateOfBirth}.pdf`}
              >
                <IconCloudDownload size="14" />
              </PDFDownloadLink>
            </ActionIcon>
          )}
        </Group>
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

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </Container>
  )
}

export default UsersPage
