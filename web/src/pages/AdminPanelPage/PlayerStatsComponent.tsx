import React, { useMemo, useState } from 'react'

import {
  Alert,
  AnchorStylesNames,
  Badge,
  Box,
  Button,
  Container,
  Group,
  Loader,
  Select,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  Timeline,
  Title,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  // IconBasketHeart,
  IconEyePlus,
  // IconHomeStats,
  IconPlus,
  IconSearch,
  IconStopwatch,
  // IconStopwatch,
} from '@tabler/icons-react'

import { routes, useParams, navigate } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AdminPagination from 'src/components/AdminPagination/AdminPagination'
import { CrudTable } from 'src/components/CrudTable'
import { ConfirmDelete } from 'src/components/Modals/ConfirmDelete'
import PlayerStatsModal from 'src/components/Modals/PlayerStatsModal'
import { GET_LIVE_GAME_SESSIONS } from 'src/graphql/live-game-sessions-queries'
import {
  CREATE_PLAYER_STAT,
  DELETE_PLAYER_STAT,
  GET_PAGINATED_PLAYER_STATS,
  UPDATE_PLAYER_STAT,
  GET_UNIQUE_GAME_NAME,
} from 'src/graphql/player-stats-queries'
import { GET_USERS } from 'src/graphql/users-queries'
import { formatDatetime } from 'src/lib/formatters'

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

  const [searchQuery, setSearchQuery] = useState(
    typeof search === 'string' ? search : ''
  )
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)
  const [playerFilter, setPlayerFilter] = useState<string | null>(
    typeof userId === 'string' ? userId : null
  )
  const [gameNameFilter, setGameNameFilter] = useState<string | null>()
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
    gameName: gameNameFilter || undefined,
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
  const { data: { playerStatsByGameName } = [], loading: gameNameLoading } =
    useQuery(GET_UNIQUE_GAME_NAME)

  const [createPlayerStat, { loading: isCreating }] = useMutation(
    CREATE_PLAYER_STAT,
    {
      onCompleted: () => {
        toast.success('Player stats created successfully')
        setIsModalOpen(false)
        refetch()
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to create player stats')
      },
      refetchQueries: [{ query: GET_PAGINATED_PLAYER_STATS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const [updatePlayerStat, { loading: isUpdating }] = useMutation(
    UPDATE_PLAYER_STAT,
    {
      onCompleted: () => {
        toast.success('Player stats updated successfully')
        setIsModalOpen(false)
        setSelectedStat(null)
        refetch()
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to update player stats')
      },
      refetchQueries: [{ query: GET_PAGINATED_PLAYER_STATS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const [deletePlayerStat, { loading: isDeleting }] = useMutation(
    DELETE_PLAYER_STAT,
    {
      onCompleted: () => {
        toast.success('Player stats deleted successfully')
        setIsDeleteModalOpen(false)
        setSelectedStat(null)
        refetch()
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to delete player stats')
      },
      refetchQueries: [{ query: GET_PAGINATED_PLAYER_STATS, variables }],
      awaitRefetchQueries: true,
    }
  )

  const { data: sessionsData, refetch: refetchSessions } = useQuery(
    GET_LIVE_GAME_SESSIONS,
    {
      variables: { gameName: gameNameFilter },
      skip: !gameNameFilter,
    }
  )
  const { liveGameSessionsByName } = sessionsData || {}

  const stats = data?.paginatedPlayerStats?.items || []
  const totalStats = data?.paginatedPlayerStats?.totalCount || 0
  const totalPages =
    data?.paginatedPlayerStats?.totalPages ??
    Math.max(1, Math.ceil(totalStats / PAGE_SIZE))
  const players = useMemo(() => {
    return (usersData?.users || []).filter((u: any) => u.role === 'PLAYER')
  }, [usersData])

  const gameOptions = useMemo(() => {
    return (playerStatsByGameName || [{ value: '', label: '' }])
      .filter(({ gameName }: any) => gameName != null && gameName !== '')
      .map(({ gameName }: any) => ({
        value: gameName,
        label: gameName,
      }))
  }, [playerStatsByGameName])

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
        <Group gap={'sm'}>
          <Box id={val.id}>
            <Text size="sm" fw={500}>
              {getPlayerName(val)}{' '}
              <Badge variant="outline" size="sm" ml={2}>
                #{val?.profile?.jerseyNumber}
              </Badge>
            </Text>
            <Text size="xs" c="dimmed" my={2}>
              {val?.email}{' '}
            </Text>
            <Text size="xs" c="green">
              {val?.profile?.position}
            </Text>
          </Box>
        </Group>
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
      <Group justify="space-between" mb="lg" grow align="flex-start">
        <div>
          <Text size="lg" fw={700}>
            Player Stats Management
          </Text>
          <Text size="sm" c="dimmed">
            Track and manage player game performance
          </Text>
        </div>
        <Group gap="xs" grow>
          <Button
            leftSection={<IconEyePlus size={16} />}
            onClick={() => navigate(routes.adminPlayerStatsLive())}
            color="teal"
            variant="outline"
          >
            Add Live Stats
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleCreate}
            color="blue"
          >
            Add Player Stats
          </Button>
        </Group>
      </Group>

      <Group
        gap="md"
        mb="lg"
        className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4"
        grow
      >
        <TextInput
          placeholder="Search by player name or email..."
          description="Player Name or Email"
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          className="flex-1"
        />

        <Select
          placeholder="Filter by game name"
          description="Game Name"
          data={[{ value: '', label: 'All Game' }, ...gameOptions]}
          value={gameNameFilter || ''}
          onChange={(value) => setGameNameFilter(value || null)}
          clearable
          searchable
        />

        <Select
          placeholder="Filter by player"
          description="Player"
          data={[{ value: '', label: 'All Players' }, ...playerOptions]}
          value={playerFilter || ''}
          onChange={(value) => setPlayerFilter(value || null)}
          clearable
          searchable
        />

        <TextInput
          type="date"
          placeholder="From date"
          description="From Date"
          value={dateFrom}
          onChange={(event) => setDateFrom(event.currentTarget.value)}
        />

        <TextInput
          type="date"
          placeholder="To date"
          description="To Date"
          value={dateTo}
          onChange={(event) => setDateTo(event.currentTarget.value)}
        />
      </Group>

      {/* Game stats history */}
      {gameNameFilter && liveGameSessionsByName?.length > 0 && (
        <Alert variant="info" icon={<IconStopwatch />} mb={'lg'}>
          <Title size="h4" c="blue.8">
            Game Log: {gameNameFilter}
          </Title>
          {liveGameSessionsByName &&
            liveGameSessionsByName.map((sessions) => (
              <>
                <Group>
                  <div>{sessions?.gameMinute} Minute</div>
                  <div>{formatDate(sessions?.gameDate)}</div>
                  <div>
                    {sessions?.team?.name} - ({sessions?.team?.ageGroup})
                  </div>
                </Group>
                <Timeline
                  active={sessions?.substitutionLog.length - 1}
                  bulletSize={28}
                  lineWidth={2}
                  mt="sm"
                >
                  {sessions?.substitutionLog.map((event, index) => (
                    <Timeline.Item
                      key={`${event.playerId}-${event.timestamp}-${index}`}
                      bullet={
                        <ThemeIcon
                          size={22}
                          variant="filled"
                          color={event.type === 'OUT' ? 'red' : 'green'}
                          radius="xl"
                        >
                          {event.type === 'OUT' ? (
                            <IconArrowRight size={12} />
                          ) : (
                            <IconArrowLeft size={12} />
                          )}
                        </ThemeIcon>
                      }
                      title={
                        <Group gap="xs">
                          <Text size="sm" fw={600}>
                            {event.playerName}
                          </Text>
                          <Badge
                            size="xs"
                            color={event.type === 'OUT' ? 'red' : 'green'}
                            variant="filled"
                          >
                            {event.type === 'OUT' ? 'Subbed OUT' : 'Subbed IN'}
                          </Badge>
                        </Group>
                      }
                      className="animate-[pulse_300ms_ease-in-out]"
                    >
                      <Text size="xs" c="dimmed">
                        Minute {event.minute} &nbsp;·&nbsp;{' '}
                        {new Date(event.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </>
            ))}
        </Alert>
      )}

      <CrudTable
        data={stats}
        columns={columns as any}
        isLoading={loading && !data}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyText="No player stats found"
        isDisableDelete={true}
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
