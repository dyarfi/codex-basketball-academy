import React, { useState } from 'react'

import {
  Alert,
  Badge,
  Button,
  Container,
  Group,
  Loader,
  Select,
  Text,
  TextInput,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconAlertCircle, IconPlus, IconSearch } from '@tabler/icons-react'

import { routes, useParams } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AdminPagination from 'src/components/AdminPagination/AdminPagination'
import { CrudTable } from 'src/components/CrudTable'
import AgeGroupTeamModal from 'src/components/Modals/AgeGroupTeamModal'
import { ConfirmDelete } from 'src/components/Modals/ConfirmDelete'
import {
  CREATE_AGE_GROUP_TEAM,
  DELETE_AGE_GROUP_TEAM,
  GET_PAGINATED_AGE_GROUP_TEAMS,
  UPDATE_AGE_GROUP_TEAM,
} from 'src/graphql/age-group-teams-queries'
import { USERS_QUERY } from 'src/graphql/users-queries'

type RouteQuery = Record<string, boolean | number | string | null | undefined>
type RouteBuilder = (params?: RouteQuery) => string

type UserSummary = {
  id: string
  email: string
  role: string
  isActive?: boolean | null
  teamMemberships?: Array<{
    teamId: string
    team?: { id: string; name: string; ageGroup?: string } | null
  }>
  profile?: {
    firstName?: string | null
    lastName?: string | null
  } | null
}

type TeamCoach = {
  id: number
  userId: string
  teamId: string
  role: string
  isActive: boolean
  joinedAt: string
  user?: UserSummary | null
}

type TeamMembership = {
  id: number
  userId: string
  teamId: string
  user?: UserSummary | null
}

type AgeGroupTeam = {
  id: string
  name: string
  ageGroup: string
  description?: string | null
  coaches: TeamCoach[]
  memberships: TeamMembership[]
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

type PaginatedAgeGroupTeamsData = {
  paginatedAgeGroupTeams: {
    items: AgeGroupTeam[]
    totalCount: number
    totalPages: number
  }
}

type UsersQueryData = {
  usersQuery: UserSummary[]
}

type Column = {
  key: keyof AgeGroupTeam
  header: React.ReactNode
  render?: (
    value: AgeGroupTeam[keyof AgeGroupTeam],
    item: AgeGroupTeam
  ) => React.ReactNode
}

const getPageFromParam = (value: unknown) => {
  const parsedPage = Number(value)

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

const ageGroupOptions = [
  { value: '', label: 'All Age Groups' },
  { value: 'U-6', label: 'U-6' },
  { value: 'U-8', label: 'U-8' },
  { value: 'U-10', label: 'U-10' },
  { value: 'U-12', label: 'U-12' },
  { value: 'U-14', label: 'U-14' },
  { value: 'U-16', label: 'U-16' },
  { value: 'U-18', label: 'U-18' },
]

const getUserName = (user?: UserSummary | null) => {
  const name = [user?.profile?.firstName, user?.profile?.lastName]
    .filter(Boolean)
    .join(' ')

  return name || user?.email || 'Unassigned'
}

const AgeGroupTeamsComponent = () => {
  const PAGE_SIZE = 10
  const { page = 1, search, ageGroup, isActive } = useParams()

  const [searchQuery, setSearchQuery] = useState(
    typeof search === 'string' ? search : ''
  )
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)
  const [ageGroupFilter, setAgeGroupFilter] = useState<string | null>(
    typeof ageGroup === 'string' ? ageGroup : null
  )
  const [statusFilter, setStatusFilter] = useState<string | null>(
    typeof isActive === 'string' ? isActive : null
  )
  const [currentPage, setCurrentPage] = useState(() => getPageFromParam(page))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<AgeGroupTeam | null>(null)

  const variables = {
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: debouncedSearchQuery || undefined,
    ageGroup: ageGroupFilter || undefined,
    isActive:
      statusFilter === null
        ? undefined
        : statusFilter === 'true'
          ? true
          : false,
  }

  const { data, loading, error, refetch } =
    useQuery<PaginatedAgeGroupTeamsData>(GET_PAGINATED_AGE_GROUP_TEAMS, {
      variables,
    })
  const { data: coachesData } = useQuery<UsersQueryData>(USERS_QUERY, {
    variables: { role: 'COACH', isActive: true },
  })
  const { data: playersData } = useQuery<UsersQueryData>(USERS_QUERY, {
    variables: { role: 'PLAYER', isActive: true },
  })

  const [createTeam, { loading: isCreating }] = useMutation(
    CREATE_AGE_GROUP_TEAM,
    {
      onCompleted: () => {
        toast.success('Team created successfully')
        setIsModalOpen(false)
        refetch()
      },
      onError: (err) => toast.error(err.message || 'Failed to create team'),
      refetchQueries: [{ query: GET_PAGINATED_AGE_GROUP_TEAMS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const [updateTeam, { loading: isUpdating }] = useMutation(
    UPDATE_AGE_GROUP_TEAM,
    {
      onCompleted: () => {
        toast.success('Team updated successfully')
        setIsModalOpen(false)
        setSelectedTeam(null)
        refetch()
      },
      onError: (err) => toast.error(err.message || 'Failed to update team'),
      refetchQueries: [{ query: GET_PAGINATED_AGE_GROUP_TEAMS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const [deleteTeam, { loading: isDeleting }] = useMutation(
    DELETE_AGE_GROUP_TEAM,
    {
      onCompleted: () => {
        toast.success('Team deleted successfully')
        setIsDeleteModalOpen(false)
        setSelectedTeam(null)
        refetch()
      },
      onError: (err) => toast.error(err.message || 'Failed to delete team'),
      refetchQueries: [{ query: GET_PAGINATED_AGE_GROUP_TEAMS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const teams = data?.paginatedAgeGroupTeams?.items || []
  const totalTeams = data?.paginatedAgeGroupTeams?.totalCount || 0
  const totalPages =
    data?.paginatedAgeGroupTeams?.totalPages ??
    Math.max(1, Math.ceil(totalTeams / PAGE_SIZE))

  const handleCreate = () => {
    setSelectedTeam(null)
    setIsModalOpen(true)
  }

  const handleEdit = (team: AgeGroupTeam) => {
    setSelectedTeam(team)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (team: AgeGroupTeam) => {
    setSelectedTeam(team)
    setIsDeleteModalOpen(true)
  }

  const handleSave = (values: Record<string, unknown>) => {
    if (selectedTeam) {
      updateTeam({ variables: { id: selectedTeam.id, input: values } })
    } else {
      createTeam({ variables: { input: values } })
    }
  }

  const handleConfirmDelete = () => {
    if (selectedTeam) {
      deleteTeam({ variables: { id: selectedTeam.id } })
    }
  }

  const columns: Column[] = [
    { key: 'name', header: 'Team' },
    {
      key: 'ageGroup',
      header: 'Age Group',
      render: (value) => <Badge color="blue">{String(value)}</Badge>,
    },
    {
      key: 'description',
      header: 'Description',
      render: (value) => (
        <Text c="blue" size="sm">
          {value ? String(value) : '—'}
        </Text>
      ),
    },
    {
      key: 'coaches',
      header: 'Coaches',
      render: (coaches) => {
        const coachList = coaches as TeamCoach[]
        if (!coachList?.length) return <Text size="sm" c="dimmed">Unassigned</Text>
        const formatRole = (role: string) => {
          switch (role) {
            case 'HEAD_COACH':
              return 'Head'
            case 'ASSISTANT':
              return 'Assistant'
            case 'TRAINER':
              return 'Trainer'
            default:
              return role
          }
        }
        return (
          <Text size="sm">
            {coachList.map((c) => `${getUserName(c.user)} (${formatRole(c.role)})`).join(', ')}
          </Text>
        )
      },
    },
    {
      key: 'memberships',
      header: 'Roster',
      render: (memberships) => (
        <Text size="sm">
          {(memberships as TeamMembership[])?.length || 0} players
        </Text>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (value: boolean) => (
        <Badge color={value ? 'green' : 'red'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
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
          Failed to load teams: {error.message}
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
      <Group justify="space-between" mb="lg" grow align="flex-start">
        <div>
          <Text size="lg" fw={700}>
            Age Group Teams
          </Text>
          <Text size="sm" color="dimmed">
            Manage team rosters, coaches, and public team visibility
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
          Add New Team
        </Button>
      </Group>

      <Group
        gap="md"
        mb="lg"
        className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4"
        grow
      >
        <TextInput
          placeholder="Search teams..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          className="flex-1"
        />
        <Select
          placeholder="Age group"
          data={ageGroupOptions}
          value={ageGroupFilter || ''}
          onChange={(value) => setAgeGroupFilter(value || null)}
          clearable
        />
        <Select
          placeholder="Status"
          data={[
            { value: '', label: 'All Statuses' },
            { value: 'true', label: 'Active' },
            { value: 'false', label: 'Inactive' },
          ]}
          value={statusFilter || ''}
          onChange={(value) => setStatusFilter(value || null)}
          clearable
        />
      </Group>

      <CrudTable
        data={teams}
        columns={columns}
        isLoading={loading && !data}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {teams.length > 0 && totalPages > 1 && (
        <AdminPagination
          label="teams"
          totalItems={totalTeams}
          page={currentPage}
          totalPages={totalPages}
          route={routes.adminAgeGroupTeams as RouteBuilder}
          query={{
            search: debouncedSearchQuery || undefined,
            ageGroup: ageGroupFilter || undefined,
            isActive: statusFilter || undefined,
          }}
          onPageChange={setCurrentPage}
          pageSize={PAGE_SIZE}
        />
      )}

      <AgeGroupTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        teamData={selectedTeam}
        coaches={coachesData?.usersQuery || []}
        players={playersData?.usersQuery || []}
        isLoading={selectedTeam ? isUpdating : isCreating}
      />

      <ConfirmDelete
        isOpen={isDeleteModalOpen}
        title="Delete Team"
        message={`Are you sure you want to delete "${selectedTeam?.name}"? All coach and player assignments will be removed.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </Container>
  )
}

export default AgeGroupTeamsComponent
