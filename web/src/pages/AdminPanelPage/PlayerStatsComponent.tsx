import React, { useMemo, useState } from 'react'

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

import AdminPagination from 'src/components/AdminPagination/AdminPagination'
import { CrudTable } from 'src/components/CrudTable'
import { ConfirmDelete } from 'src/components/Modals/ConfirmDelete'
import PlayerStatsModal from 'src/components/Modals/PlayerStatsModal'
import { useToast } from 'src/components/Toast/useToast'
import {
  CREATE_PLAYER_STAT,
  DELETE_PLAYER_STAT,
  GET_PAGINATED_PLAYER_STATS,
  UPDATE_PLAYER_STAT,
} from 'src/graphql/player-stats-queries'
import { GET_USERS } from 'src/graphql/users-queries'

type RouteQuery = Record<string, boolean | number | string | null | undefined>
type RouteBuilder = (params?: RouteQuery) => string

const getPageFromParam = (value: unknown) => {
  const parsedPage = Number(value)

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

const getPlayerName = (user?: {
  email: string
  profile: { firstName: string; lastName: string }
}) => {
  const name = `${user?.profile?.firstName || ''} ${
    user?.profile?.lastName || ''
  }`.trim()

  return name || user?.email || 'Unknown player'
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

const getStatTotal = (stat: any) =>
  stat.points + stat.rebounds + stat.assists + stat.steals + stat.blocks

const toStartOfDayIso = (value: string) =>
  new Date(`${value}T00:00:00`).toISOString()

const toEndOfDayIso = (value: string) =>
  new Date(`${value}T23:59:59.999`).toISOString()

const PlayerStatsComponent = () => {
  const PAGE_SIZE = 10
  const { page = 1, search, userId } = useParams()
  const { success, error: toastError } = useToast()
  const [searchQuery, setSearchQuery] = useState(
    typeof search === 'string' ? search : ''
  )
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)
  const [playerFilter, setPlayerFilter] = useState<string | null>(
    typeof userId === 'string' ? userId : null
  )
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [currentPage, setCurrentPage] = useState(() => getPageFromParam(page))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedStat, setSelectedStat] = useState<any>(null)

  const variables = {
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: debouncedSearchQuery || undefined,
    userId: playerFilter || undefined,
    dateFrom: dateFrom ? toStartOfDayIso(dateFrom) : undefined,
    dateTo: dateTo ? toEndOfDayIso(dateTo) : undefined,
  }

  const { data, loading, error, refetch } = useQuery(
    GET_PAGINATED_PLAYER_STATS,
    {
      variables,
    }
  )
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS)

  // const totalItems = usersData?.totalCount || 0
  // const totalPages =
  //   usersData?.totalPages ?? Math.max(1, Math.ceil(totalItems / PAGE_SIZE))

  const [createPlayerStat, { loading: isCreating }] = useMutation(
    CREATE_PLAYER_STAT,
    {
      onCompleted: () => {
        success('Player stats created successfully')
        setIsModalOpen(false)
        refetch()
      },
      onError: (err) => {
        toastError(err.message || 'Failed to create player stats')
      },
      refetchQueries: [{ query: GET_PAGINATED_PLAYER_STATS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const [updatePlayerStat, { loading: isUpdating }] = useMutation(
    UPDATE_PLAYER_STAT,
    {
      onCompleted: () => {
        success('Player stats updated successfully')
        setIsModalOpen(false)
        setSelectedStat(null)
        refetch()
      },
      onError: (err) => {
        toastError(err.message || 'Failed to update player stats')
      },
      refetchQueries: [{ query: GET_PAGINATED_PLAYER_STATS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const [deletePlayerStat, { loading: isDeleting }] = useMutation(
    DELETE_PLAYER_STAT,
    {
      onCompleted: () => {
        success('Player stats deleted successfully')
        setIsDeleteModalOpen(false)
        setSelectedStat(null)
        refetch()
      },
      onError: (err) => {
        toastError(err.message || 'Failed to delete player stats')
      },
      refetchQueries: [{ query: GET_PAGINATED_PLAYER_STATS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const stats = data?.paginatedPlayerStats?.items || []
  const totalStats = data?.paginatedPlayerStats?.totalCount || 0
  const totalPages =
    data?.paginatedPlayerStats?.totalPages ??
    Math.max(1, Math.ceil(totalStats / PAGE_SIZE))
  const players = useMemo(() => {
    return (usersData?.users || []).filter((u: any) => u.role === 'PLAYER')
  }, [usersData])

  const playerOptions = useMemo(() => {
    return players.map((player: any) => ({
      value: player.id,
      label: getPlayerName(player),
    }))
  }, [players])

  const handleCreate = () => {
    setSelectedStat(null)
    setIsModalOpen(true)
  }

  const handleEdit = (stat: any) => {
    setSelectedStat(stat)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (stat: any) => {
    setSelectedStat(stat)
    setIsDeleteModalOpen(true)
  }

  const handleSave = (values: any) => {
    if (selectedStat) {
      updatePlayerStat({
        variables: {
          id: selectedStat.id,
          input: values,
        },
      })
    } else {
      createPlayerStat({
        variables: {
          input: values,
        },
      })
    }
  }

  const handleConfirmDelete = () => {
    if (selectedStat) {
      deletePlayerStat({
        variables: { id: selectedStat.id },
      })
    }
  }

  const columns = [
    {
      key: 'user',
      header: 'Player',
      render: (val: any) => (
        <div>
          <Text size="sm" fw={500}>
            {getPlayerName(val)}
          </Text>
          <Text size="xs" c="dimmed">
            {val?.email}
          </Text>
        </div>
      ),
    },
    {
      key: 'gameDate',
      header: 'Game Date',
      render: (val: string) => <Text size="sm">{formatDate(val)}</Text>,
    },
    {
      key: 'gameName',
      header: 'Game Name',
      render: (val: string) => <Text size="sm">{val}</Text>,
    },
    {
      key: 'points',
      header: 'PTS',
      render: (val: number) => <Badge variant="light">{val}</Badge>,
    },
    {
      key: 'rebounds',
      header: 'REB',
      render: (val: number) => <Text size="sm">{val}</Text>,
    },
    {
      key: 'assists',
      header: 'AST',
      render: (val: number) => <Text size="sm">{val}</Text>,
    },
    {
      key: 'steals',
      header: 'STL',
      render: (val: number) => <Text size="sm">{val}</Text>,
    },
    {
      key: 'blocks',
      header: 'BLK',
      render: (val: number) => <Text size="sm">{val}</Text>,
    },
    {
      key: 'minutesPlayed',
      header: 'MIN',
      render: (val: number) => <Text size="sm">{val}</Text>,
    },
    {
      key: 'id',
      header: 'Total',
      render: (_val: string, item: any) => (
        <Badge color="blue" variant="dot">
          {getStatTotal(item)}
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
          Failed to load player stats: {error.message}
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
            Player Stats Management
          </Text>
          <Text size="sm" c="dimmed">
            Track and manage player game performance
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleCreate}
          color="blue"
        >
          Add Player Stats
        </Button>
      </Group>

      <Group
        gap="md"
        mb="lg"
        className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4"
        grow={true}
      >
        <TextInput
          placeholder="Search by player name or email..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          className="flex-1"
        />

        <Select
          placeholder="Filter by player"
          data={[{ value: '', label: 'All Players' }, ...playerOptions]}
          value={playerFilter || ''}
          onChange={(value) => setPlayerFilter(value || null)}
          clearable
          searchable
        />

        <TextInput
          type="date"
          placeholder="From date"
          value={dateFrom}
          onChange={(event) => setDateFrom(event.currentTarget.value)}
        />

        <TextInput
          type="date"
          placeholder="To date"
          value={dateTo}
          onChange={(event) => setDateTo(event.currentTarget.value)}
        />
      </Group>

      <CrudTable
        data={stats}
        columns={columns as any}
        isLoading={loading && !data}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyText="No player stats found"
      />

      {stats.length > 0 && totalPages > 1 && (
        <AdminPagination
          label="playerStats"
          page={currentPage}
          totalPages={totalPages}
          totalItems={totalStats}
          route={routes.adminPlayerStats as RouteBuilder}
          onPageChange={(newPage) => {
            setCurrentPage(newPage)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          pageSize={PAGE_SIZE}
        />
      )}

      <PlayerStatsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        statData={selectedStat}
        users={players}
        isLoading={isCreating || isUpdating}
        isDataLoading={usersLoading}
      />

      <ConfirmDelete
        isOpen={isDeleteModalOpen}
        title="Delete Player Stats"
        message={`Are you sure you want to delete the stats for "${getPlayerName(
          selectedStat?.user
        )}" on ${
          selectedStat?.gameDate
            ? formatDate(selectedStat.gameDate)
            : 'this game'
        }?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </Container>
  )
}

export default PlayerStatsComponent
