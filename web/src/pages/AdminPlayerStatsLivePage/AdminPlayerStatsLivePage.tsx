import React, { useMemo, useState } from 'react'

import {
  Alert,
  Anchor,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Collapse,
  Container,
  Divider,
  Group,
  Loader,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Table,
  Text,
  Title,
  TextInput,
  Tooltip,
  ActionIcon,
  Stack,
  Timeline,
  ThemeIcon,
  Box,
  Grid,
  Flex,
} from '@mantine/core'
import { useDebouncedCallback, useLocalStorage } from '@mantine/hooks'
import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconArrowsExchange,
  IconChevronDown,
  IconChevronUp,
  IconCircleCheck,
  IconDeviceFloppy,
  IconMinus,
  IconPlus,
  IconRefresh,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react'

import { Link, navigate, routes } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { AdminLayout } from 'src/components/AdminLayout/AdminLayout'
import { GET_AGE_GROUP_TEAMS } from 'src/graphql/age-group-teams-queries'
import { CREATE_BULK_PLAYER_STATS } from 'src/graphql/player-stats-queries'
import { GET_USERS } from 'src/graphql/users-queries'

interface PlayerStatsState {
  points: number
  rebounds: number
  assists: number
  steals: number
  blocks: number
  minutesPlayed: number
}

interface RosterPlayer {
  id: string
  email: string
  profile?: {
    firstName: string
    lastName: string
    jerseyNumber?: number
    position?: string
    profilePhoto?: string
  }
}

interface SubstitutionEvent {
  type: 'OUT' | 'IN'
  playerId: string
  playerName: string
  minute: number
  timestamp: string
}

const getPlayerName = (player: RosterPlayer) => {
  const name = `${player.profile?.firstName || ''} ${
    player.profile?.lastName || ''
  }`.trim()
  return name || player.email || 'Unknown Player'
}

const DRAFT_KEY = 'live_stats_draft'

interface DraftSession {
  gameName: string
  gameDate: string
  selectedTeamId: string | null
  roster: RosterPlayer[]
  statsMap: Record<string, PlayerStatsState>
  substitutedOut: string[]
  substitutionLog: SubstitutionEvent[]
  gameMinute: number
}

const AdminPlayerStatsLivePage = () => {
  // ─── Mantine useLocalStorage – persists the whole draft session ──────────────
  const [draft, setDraft, removeDraft] = useLocalStorage<DraftSession | null>({
    key: DRAFT_KEY,
    defaultValue: null,
    getInitialValueInEffect: false,
  })

  // Game Setup State – seeded from draft when present
  const [gameName, setGameName] = useState(draft?.gameName ?? '')
  const [gameDate, setGameDate] = useState(() => {
    if (draft?.gameDate) return draft.gameDate
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(
    draft?.selectedTeamId ?? null
  )

  // Live Stats State – seeded from draft when present
  const [roster, setRoster] = useState<RosterPlayer[]>(draft?.roster ?? [])
  const [statsMap, setStatsMap] = useState<Record<string, PlayerStatsState>>(
    draft?.statsMap ?? {}
  )
  const [individualPlayerSelect, setIndividualPlayerSelect] = useState<
    string | null
  >(null)

  // ─── Substitution State ───────────────────────────────────────────────────────
  const [substitutedOut, setSubstitutedOut] = useState<Set<string>>(
    new Set(draft?.substitutedOut ?? [])
  )
  const [substitutionLog, setSubstitutionLog] = useState<SubstitutionEvent[]>(
    draft?.substitutionLog ?? []
  )
  const [gameMinute, setGameMinute] = useState<number>(draft?.gameMinute ?? 1)
  const [showSubLog, setShowSubLog] = useState(false)
  // ─────────────────────────────────────────────────────────────────────────────

  // hasDraft is derived – no extra state needed
  const hasDraft = draft !== null

  // ─── useDebouncedCallback – autosave 500ms after last change ─────────────────
  const persistDraft = useDebouncedCallback(
    (session: DraftSession) => setDraft(session),
    500
  )
  // ─────────────────────────────────────────────────────────────────────────────

  const handleClearDraft = () => {
    persistDraft.cancel()
    removeDraft()
    setGameName('')
    const today = new Date()
    setGameDate(today.toISOString().split('T')[0])
    setSelectedTeamId(null)
    setRoster([])
    setStatsMap({})
    setSubstitutedOut(new Set())
    setSubstitutionLog([])
    setGameMinute(1)
    toast.success('Draft cleared')
  }

  // Helper to build a full DraftSession snapshot
  const buildDraftSnapshot = (
    overrides: Partial<DraftSession> = {}
  ): DraftSession => ({
    gameName,
    gameDate,
    selectedTeamId,
    roster,
    statsMap,
    substitutedOut: Array.from(substitutedOut),
    substitutionLog,
    gameMinute,
    ...overrides,
  })

  // Queries & Mutations
  const {
    data: teamsData,
    loading: teamsLoading,
    error: teamsError,
  } = useQuery(GET_AGE_GROUP_TEAMS)
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS)

  const [createBulkPlayerStats, { loading: isSaving }] = useMutation(
    CREATE_BULK_PLAYER_STATS,
    {
      onCompleted: () => {
        persistDraft.cancel()
        removeDraft()
        toast.success('Live game stats saved successfully')
        navigate(routes.adminPlayerStats())
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to save player stats')
      },
    }
  )

  // Format team selections
  const teamOptions = useMemo(() => {
    return (teamsData?.ageGroupTeams || [{ value: '', label: '' }]).map(
      (team: any) => ({
        value: team.id,
        label: `${team.name} (${team.ageGroup})`,
      })
    )
  }, [teamsData])

  // Filter out users who are players for individual adding
  const allPlayers = useMemo(() => {
    return (usersData?.users || [{ value: '', label: '' }]).filter(
      (u: any) => u.role === 'PLAYER'
    )
  }, [usersData])

  // Dropdown for adding players manually (excluding already added ones)
  const playerOptions = useMemo(() => {
    const rosterIds = new Set(roster.map((p) => p.id))
    return allPlayers
      .filter((p: any) => !rosterIds.has(p.id))
      .map((p: any) => ({
        value: p.id,
        label: `${getPlayerName(p)} (${p.email})`,
      }))
  }, [allPlayers, roster])

  // Handle Team Selection - Load Roster
  const handleTeamChange = (teamId: string | null) => {
    setSelectedTeamId(teamId)
    if (!teamId) {
      persistDraft(buildDraftSnapshot({ selectedTeamId: teamId }))
      return
    }

    const selectedTeam = (teamsData?.ageGroupTeams || []).find(
      (t: any) => t.id === teamId
    )

    if (selectedTeam && selectedTeam.players) {
      const teamPlayers = selectedTeam.players as RosterPlayer[]
      setRoster(teamPlayers)

      // Initialize stats for players
      const newStatsMap: Record<string, PlayerStatsState> = {}
      teamPlayers.forEach((p) => {
        newStatsMap[p.id] = {
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          minutesPlayed: 0,
        }
      })
      setStatsMap(newStatsMap)
      // Reset substitution state on new team load
      setSubstitutedOut(new Set())
      setSubstitutionLog([])
      persistDraft(
        buildDraftSnapshot({
          selectedTeamId: teamId,
          roster: teamPlayers,
          statsMap: newStatsMap,
          substitutedOut: [],
          substitutionLog: [],
        })
      )
      toast.success(
        `Loaded ${teamPlayers.length} players from ${selectedTeam.name}`
      )
    }
  }

  // Handle adding an individual player manually
  const handleAddPlayer = () => {
    if (!individualPlayerSelect) return

    const playerToAdd = allPlayers.find(
      (p: any) => p.id === individualPlayerSelect
    )
    if (playerToAdd) {
      const newRoster = [...roster, playerToAdd]
      const newStatsMap = {
        ...statsMap,
        [playerToAdd.id]: {
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          minutesPlayed: 0,
        },
      }
      setRoster(newRoster)
      setStatsMap(newStatsMap)
      setIndividualPlayerSelect(null)
      persistDraft(
        buildDraftSnapshot({ roster: newRoster, statsMap: newStatsMap })
      )
      toast.success(`Added ${getPlayerName(playerToAdd)} to live scoreboard`)
    }
  }

  // Remove player from roster
  const handleRemovePlayer = (playerId: string) => {
    const newRoster = roster.filter((p) => p.id !== playerId)
    const newStatsMap = { ...statsMap }
    delete newStatsMap[playerId]
    const newSubstitutedOut = new Set(substitutedOut)
    newSubstitutedOut.delete(playerId)
    const newLog = substitutionLog.filter((e) => e.playerId !== playerId)
    setRoster(newRoster)
    setStatsMap(newStatsMap)
    setSubstitutedOut(newSubstitutedOut)
    setSubstitutionLog(newLog)
    persistDraft(
      buildDraftSnapshot({
        roster: newRoster,
        statsMap: newStatsMap,
        substitutedOut: Array.from(newSubstitutedOut),
        substitutionLog: newLog,
      })
    )
  }

  // ─── Toggle Substitution ──────────────────────────────────────────────────────
  const handleToggleSubstitution = (player: RosterPlayer) => {
    const isBenched = substitutedOut.has(player.id)
    const newSubstitutedOut = new Set(substitutedOut)
    const eventType: 'IN' | 'OUT' = isBenched ? 'IN' : 'OUT'

    if (isBenched) {
      newSubstitutedOut.delete(player.id)
    } else {
      newSubstitutedOut.add(player.id)
    }

    const event: SubstitutionEvent = {
      type: eventType,
      playerId: player.id,
      playerName: getPlayerName(player),
      minute: gameMinute,
      timestamp: new Date().toISOString(),
    }

    const newLog = [...substitutionLog, event]
    setSubstitutedOut(newSubstitutedOut)
    setSubstitutionLog(newLog)
    persistDraft(
      buildDraftSnapshot({
        substitutedOut: Array.from(newSubstitutedOut),
        substitutionLog: newLog,
      })
    )

    toast.success(
      eventType === 'OUT'
        ? `${getPlayerName(player)} subbed OUT at minute ${gameMinute}`
        : `${getPlayerName(player)} subbed IN at minute ${gameMinute}`
    )
  }
  // ─────────────────────────────────────────────────────────────────────────────

  // Update specific stats for a player
  const updateStat = (
    playerId: string,
    statKey: keyof PlayerStatsState,
    amount: number
  ) => {
    const currentStats = statsMap[playerId] || {
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      minutesPlayed: 0,
    }
    const newValue = Math.max(0, currentStats[statKey] + amount)
    const newStatsMap = {
      ...statsMap,
      [playerId]: { ...currentStats, [statKey]: newValue },
    }
    setStatsMap(newStatsMap)
    persistDraft(buildDraftSnapshot({ statsMap: newStatsMap }))
  }

  // Calculate live team totals (all players, including benched)
  const teamTotals = useMemo(() => {
    const totals = { points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0 }
    Object.values(statsMap).forEach((stat) => {
      totals.points += stat.points
      totals.rebounds += stat.rebounds
      totals.assists += stat.assists
      totals.steals += stat.steals
      totals.blocks += stat.blocks
    })
    return totals
  }, [statsMap])

  // Count on-court players
  const onCourtCount = roster.length - substitutedOut.size

  // Save Stats
  const handleSaveStats = () => {
    if (!gameName.trim()) {
      toast.error('Please enter a Game Name')
      return
    }
    if (!gameDate) {
      toast.error('Please select a Game Date')
      return
    }
    if (roster.length === 0) {
      toast.error('Please add at least one player to the roster')
      return
    }

    // Normalize date to ISO start of day
    const normalizedDate = new Date(`${gameDate}T00:00:00`).toISOString()

    const inputs = roster.map((player) => {
      const stats = statsMap[player.id] || {
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        minutesPlayed: 0,
      }

      return {
        userId: player.id,
        gameDate: normalizedDate,
        gameName: gameName.trim(),
        points: stats.points,
        rebounds: stats.rebounds,
        assists: stats.assists,
        steals: stats.steals,
        blocks: stats.blocks,
        minutesPlayed: stats.minutesPlayed,
      }
    })

    createBulkPlayerStats({
      variables: {
        inputs,
      },
    })
  }

  if (teamsError) {
    return (
      <AdminLayout>
        <Container size="xl" py="xl">
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            Failed to load teams: {teamsError.message}
          </Alert>
        </Container>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Container size="xl" py="md">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs mb="lg" separator="→">
          <Anchor component={Link} to={routes.adminPanel()} size="sm">
            Admin Panel
          </Anchor>
          <Anchor component={Link} to={routes.adminPlayerStats()} size="sm">
            Player Stats
          </Anchor>
          <Text size="sm" c="dimmed">
            Live Scoreboard
          </Text>
        </Breadcrumbs>

        {/* Page Header */}
        <Group justify="space-between" mb="lg">
          <Stack gap={2}>
            <Group gap="xs" align="center">
              <Title order={2}>Live Game Scoreboard</Title>
              {hasDraft && (
                <Badge
                  color="teal"
                  variant="dot"
                  rightSection={<IconCircleCheck size={12} />}
                  size="md"
                >
                  Draft Saved
                </Badge>
              )}
            </Group>
            <Text size="sm" c="dimmed">
              Track and log player stats live in real-time during a game.
            </Text>
          </Stack>
          <Group gap="xs">
            {hasDraft && (
              <Button
                leftSection={<IconRefresh size={16} />}
                variant="subtle"
                color="red"
                size="sm"
                onClick={handleClearDraft}
              >
                Clear Draft
              </Button>
            )}
            <Button
              leftSection={<IconArrowLeft size={16} />}
              variant="outline"
              color="gray"
              component={Link}
              to={routes.adminPlayerStats()}
            >
              Back to Stats
            </Button>
          </Group>
        </Group>

        {/* Setup and Live Totals Grid */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="xl">
          {/* Game Setup Card */}
          <Card withBorder shadow="sm" p="md" radius="md">
            <Text size="md" fw={700} mb="sm" c="blue">
              Game Information & Roster Setup
            </Text>
            <Stack gap="md">
              <TextInput
                label="Game Name"
                placeholder="e.g. Springfield Tournament Finals"
                value={gameName}
                onChange={(e) => {
                  const val = e.currentTarget.value
                  setGameName(val)
                  persistDraft(buildDraftSnapshot({ gameName: val }))
                }}
                required
              />
              <TextInput
                label="Game Date"
                type="date"
                value={gameDate}
                onChange={(e) => {
                  const val = e.currentTarget.value
                  setGameDate(val)
                  persistDraft(buildDraftSnapshot({ gameDate: val }))
                }}
                required
              />
              <Select
                label="Select Team (Loads Roster)"
                placeholder={
                  teamsLoading ? 'Loading teams...' : 'Select a team'
                }
                data={!teamsLoading && teamOptions}
                value={selectedTeamId}
                onChange={handleTeamChange}
                disabled={teamsLoading}
                clearable
                searchable
              />
            </Stack>
          </Card>

          {/* Live Team Totals Card */}
          <Card
            withBorder
            shadow="sm"
            p="md"
            radius="md"
            bg="blue.0"
            style={{ border: '1px solid var(--mantine-color-blue-3)' }}
          >
            <Text size="md" fw={700} mb="xs" c="blue.8">
              Live Team Scoreboard Totals
            </Text>
            <Text size="xs" c="dimmed" mb="md">
              Live sums computed from all active player records below.
            </Text>
            <SimpleGrid cols={5} spacing="xs" style={{ textAlign: 'center' }}>
              <Paper p="xs" radius="sm" withBorder>
                <Text size="xs" fw={700} c="dimmed">
                  PTS
                </Text>
                <Text
                  size="xl"
                  fw={900}
                  c="blue.8"
                  className="animate-[bounce_1600ms]"
                >
                  {teamTotals.points}
                </Text>
              </Paper>
              <Paper p="xs" radius="sm" withBorder>
                <Text size="xs" fw={700} c="dimmed">
                  REB
                </Text>
                <Text
                  size="xl"
                  fw={900}
                  c="teal.8"
                  className="animate-[bounce_1600ms]"
                >
                  {teamTotals.rebounds}
                </Text>
              </Paper>
              <Paper p="xs" radius="sm" withBorder>
                <Text size="xs" fw={700} c="dimmed">
                  AST
                </Text>
                <Text
                  size="xl"
                  fw={900}
                  c="violet.8"
                  className="animate-[bounce_1600ms]"
                >
                  {teamTotals.assists}
                </Text>
              </Paper>
              <Paper p="xs" radius="sm" withBorder>
                <Text size="xs" fw={700} c="dimmed">
                  STL
                </Text>
                <Text
                  size="xl"
                  fw={900}
                  c="orange.8"
                  className="animate-[bounce_1600ms]"
                >
                  {teamTotals.steals}
                </Text>
              </Paper>
              <Paper p="xs" radius="sm" withBorder>
                <Text size="xs" fw={700} c="dimmed">
                  BLK
                </Text>
                <Text
                  size="xl"
                  fw={900}
                  c="red.8"
                  className="animate-[bounce_1600ms]"
                >
                  {teamTotals.blocks}
                </Text>
              </Paper>
            </SimpleGrid>
            <Group justify="space-between" mt="lg">
              <Group gap="xs">
                <Text size="sm" fw={600} c="gray.7">
                  Roster: {roster.length} Players
                </Text>
                <Text size="xs" c="dimmed">
                  ·
                </Text>
                <Badge color="green" variant="dot" size="sm">
                  {onCourtCount} On Court
                </Badge>
                {substitutedOut.size > 0 && (
                  <>
                    <Text size="xs" c="dimmed">
                      ·
                    </Text>
                    <Badge color="gray" variant="dot" size="sm">
                      {substitutedOut.size} Benched
                    </Badge>
                  </>
                )}
              </Group>
              <Badge color="blue" variant="dot">
                Live Tracker Active
              </Badge>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Roster Selection & Manual Addition */}
        <Card withBorder shadow="sm" p="md" radius="md" mb="xl">
          <Grid align="start" justify="flex-start">
            <Grid.Col span={6}>
              <Text size="md" fw={700} mb="sm">
                Add Individual Players
              </Text>
              <Group grow>
                <Select
                  maw={'500px'}
                  placeholder="Search or select player to add..."
                  data={playerOptions || [{ value: '', label: '' }]}
                  value={individualPlayerSelect}
                  onChange={setIndividualPlayerSelect}
                  searchable
                  clearable
                  disabled={usersLoading}
                  leftSection={<IconUsers size={16} />}
                />
                <Button
                  onClick={handleAddPlayer}
                  disabled={!individualPlayerSelect}
                  color="blue"
                  maw={'130px'}
                >
                  Add Player
                </Button>
              </Group>
            </Grid.Col>
            <Grid.Col span={6}>
              {/* Game Clock / Substitution Minute Control */}
              {roster.length > 0 && (
                <Stack align="stretch" justify="center" gap="4">
                  <Text size="md" fw={700}>
                    Substitution Controls
                  </Text>
                  <NumberInput
                    label="Current Game Minute"
                    description="Used to log when substitutions happen"
                    placeholder="e.g. 24"
                    value={gameMinute}
                    onChange={(val) => {
                      const num = typeof val === 'number' ? val : 1
                      setGameMinute(num)
                      persistDraft(buildDraftSnapshot({ gameMinute: num }))
                    }}
                    min={1}
                    max={200}
                    style={{ width: 200 }}
                  />
                  <Text size="sm" c="dimmed">
                    Click the{' '}
                    <Badge size="xs" color="green" variant="filled">
                      Playing
                    </Badge>{' '}
                    /{' '}
                    <Badge size="xs" color="gray" variant="filled">
                      Benched
                    </Badge>{' '}
                    badge on each player row to toggle substitution status.
                  </Text>
                </Stack>
              )}
            </Grid.Col>
          </Grid>
        </Card>

        {/* Live Stat Tracker Table */}
        <Card
          withBorder
          shadow="sm"
          p="0"
          radius="md"
          mb="lg"
          style={{ overflowX: 'auto' }}
        >
          {roster.length === 0 ? (
            <Stack align="center" gap="xs" py="xl">
              <IconUsers size={48} color="var(--mantine-color-gray-4)" />
              <Text c="dimmed" size="sm">
                No players added to the roster yet. Choose a team or add players
                manually to begin.
              </Text>
            </Stack>
          ) : (
            <Table highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: '100px', textAlign: 'center' }}>
                    Status
                  </Table.Th>
                  <Table.Th style={{ width: '220px' }}>Player</Table.Th>
                  <Table.Th style={{ width: '190px', textAlign: 'center' }}>
                    Points (PTS)
                  </Table.Th>
                  <Table.Th style={{ width: '130px', textAlign: 'center' }}>
                    Rebounds (REB)
                  </Table.Th>
                  <Table.Th style={{ width: '130px', textAlign: 'center' }}>
                    Assists (AST)
                  </Table.Th>
                  <Table.Th style={{ width: '130px', textAlign: 'center' }}>
                    Steals (STL)
                  </Table.Th>
                  <Table.Th style={{ width: '130px', textAlign: 'center' }}>
                    Blocks (BLK)
                  </Table.Th>
                  <Table.Th style={{ width: '190px', textAlign: 'center' }}>
                    Minutes (MIN)
                  </Table.Th>
                  <Table.Th style={{ width: '50px', textAlign: 'center' }}>
                    Remove
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {roster.map((player) => {
                  const stats = statsMap[player.id] || {
                    points: 0,
                    rebounds: 0,
                    assists: 0,
                    steals: 0,
                    blocks: 0,
                    minutesPlayed: 0,
                  }
                  const isBenched = substitutedOut.has(player.id)

                  return (
                    <Table.Tr
                      key={player.id}
                      style={{
                        opacity: isBenched ? 0.5 : 1,
                        backgroundColor: isBenched
                          ? 'var(--mantine-color-gray-1)'
                          : undefined,
                        transition:
                          'opacity 0.25s ease, background-color 0.25s ease',
                      }}
                    >
                      {/* Substitution Status Toggle */}
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Tooltip
                          label={
                            isBenched
                              ? `Sub IN at minute ${gameMinute}`
                              : `Sub OUT at minute ${gameMinute}`
                          }
                          withArrow
                        >
                          <Badge
                            color={isBenched ? 'gray' : 'green'}
                            variant="filled"
                            size="xs"
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleToggleSubstitution(player)}
                            leftSection={<IconArrowsExchange size={10} />}
                          >
                            {isBenched ? 'Benched' : 'Playing'}
                          </Badge>
                        </Tooltip>
                      </Table.Td>

                      {/* Player Profile & Details */}
                      <Table.Td>
                        <Group gap="xs">
                          <Avatar
                            src={player.profile?.profilePhoto}
                            radius="xl"
                            size="md"
                            color={isBenched ? 'gray' : 'blue'}
                          >
                            {player.profile?.firstName?.[0]}
                            {player.profile?.lastName?.[0]}
                          </Avatar>
                          <div>
                            <Text
                              size="sm"
                              fw={600}
                              c={isBenched ? 'dimmed' : undefined}
                            >
                              {getPlayerName(player)}
                            </Text>
                            <Group gap="xs">
                              {player.profile?.jerseyNumber !== undefined && (
                                <Badge
                                  size="xs"
                                  color={isBenched ? 'gray' : 'gray'}
                                >
                                  #{player.profile.jerseyNumber}
                                </Badge>
                              )}
                              {player.profile?.position && (
                                <Text size="xs" c="dimmed">
                                  {player.profile.position}
                                </Text>
                              )}
                            </Group>
                          </div>
                        </Group>
                      </Table.Td>

                      {/* Points Tracker (+3, +2, +1, -1) */}
                      <Table.Td>
                        <Stack gap="xs" align="center">
                          <Badge
                            variant="filled"
                            size="lg"
                            color="blue"
                            style={{ minWidth: '45px' }}
                          >
                            {stats.points} PTS
                          </Badge>
                          <Group gap={4}>
                            <Button
                              size="xs"
                              variant="light"
                              color="red"
                              px={6}
                              onClick={() =>
                                updateStat(player.id, 'points', -1)
                              }
                            >
                              -1
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              color="blue"
                              px={6}
                              onClick={() => updateStat(player.id, 'points', 1)}
                            >
                              +1
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              color="blue"
                              px={6}
                              onClick={() => updateStat(player.id, 'points', 2)}
                            >
                              +2
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              color="blue"
                              px={6}
                              onClick={() => updateStat(player.id, 'points', 3)}
                            >
                              +3
                            </Button>
                          </Group>
                        </Stack>
                      </Table.Td>

                      {/* Rebounds Tracker */}
                      <Table.Td>
                        <Stack gap="xs" align="center">
                          <Text fw={700} size="sm">
                            {stats.rebounds}
                          </Text>
                          <Group gap={4}>
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="gray"
                              onClick={() =>
                                updateStat(player.id, 'rebounds', -1)
                              }
                            >
                              <IconMinus size={12} />
                            </ActionIcon>
                            <ActionIcon
                              size="sm"
                              variant="filled"
                              color="teal"
                              onClick={() =>
                                updateStat(player.id, 'rebounds', 1)
                              }
                            >
                              <IconPlus size={12} />
                            </ActionIcon>
                          </Group>
                        </Stack>
                      </Table.Td>

                      {/* Assists Tracker */}
                      <Table.Td>
                        <Stack gap="xs" align="center">
                          <Text fw={700} size="sm">
                            {stats.assists}
                          </Text>
                          <Group gap={4}>
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="gray"
                              onClick={() =>
                                updateStat(player.id, 'assists', -1)
                              }
                            >
                              <IconMinus size={12} />
                            </ActionIcon>
                            <ActionIcon
                              size="sm"
                              variant="filled"
                              color="violet"
                              onClick={() =>
                                updateStat(player.id, 'assists', 1)
                              }
                            >
                              <IconPlus size={12} />
                            </ActionIcon>
                          </Group>
                        </Stack>
                      </Table.Td>

                      {/* Steals Tracker */}
                      <Table.Td>
                        <Stack gap="xs" align="center">
                          <Text fw={700} size="sm">
                            {stats.steals}
                          </Text>
                          <Group gap={4}>
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="gray"
                              onClick={() =>
                                updateStat(player.id, 'steals', -1)
                              }
                            >
                              <IconMinus size={12} />
                            </ActionIcon>
                            <ActionIcon
                              size="sm"
                              variant="filled"
                              color="orange"
                              onClick={() => updateStat(player.id, 'steals', 1)}
                            >
                              <IconPlus size={12} />
                            </ActionIcon>
                          </Group>
                        </Stack>
                      </Table.Td>

                      {/* Blocks Tracker */}
                      <Table.Td>
                        <Stack gap="xs" align="center">
                          <Text fw={700} size="sm">
                            {stats.blocks}
                          </Text>
                          <Group gap={4}>
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="gray"
                              onClick={() =>
                                updateStat(player.id, 'blocks', -1)
                              }
                            >
                              <IconMinus size={12} />
                            </ActionIcon>
                            <ActionIcon
                              size="sm"
                              variant="filled"
                              color="red"
                              onClick={() => updateStat(player.id, 'blocks', 1)}
                            >
                              <IconPlus size={12} />
                            </ActionIcon>
                          </Group>
                        </Stack>
                      </Table.Td>

                      {/* Minutes Played (+5, +1, -1, -5) */}
                      <Table.Td>
                        <Stack gap="xs" align="center">
                          <Badge variant="light" color="gray" size="md">
                            {stats.minutesPlayed} MIN
                          </Badge>
                          <Group gap={4}>
                            <Button
                              size="xs"
                              variant="light"
                              color="red"
                              px={4}
                              onClick={() =>
                                updateStat(player.id, 'minutesPlayed', -5)
                              }
                            >
                              -5
                            </Button>
                            <Button
                              size="xs"
                              variant="light"
                              color="red"
                              px={6}
                              onClick={() =>
                                updateStat(player.id, 'minutesPlayed', -1)
                              }
                            >
                              -1
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              color="gray"
                              px={6}
                              onClick={() =>
                                updateStat(player.id, 'minutesPlayed', 1)
                              }
                            >
                              +1
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              color="gray"
                              px={4}
                              onClick={() =>
                                updateStat(player.id, 'minutesPlayed', 5)
                              }
                            >
                              +5
                            </Button>
                          </Group>
                        </Stack>
                      </Table.Td>

                      {/* Remove player */}
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Tooltip label="Remove player from this scoreboard">
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => handleRemovePlayer(player.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Table.Td>
                    </Table.Tr>
                  )
                })}
              </Table.Tbody>
            </Table>
          )}
        </Card>

        {/* Substitution Log */}
        {substitutionLog.length > 0 && (
          <Card withBorder shadow="sm" p="md" radius="md" mb="xl">
            <Group
              justify="space-between"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowSubLog((v) => !v)}
            >
              <Group gap="xs">
                <ThemeIcon size="md" variant="light" color="orange" radius="xl">
                  <IconArrowsExchange size={16} />
                </ThemeIcon>
                <Text size="md" fw={700}>
                  Substitution Log
                </Text>
                <Badge color="orange" variant="light" size="sm">
                  {substitutionLog.length} event
                  {substitutionLog.length !== 1 ? 's' : ''}
                </Badge>
              </Group>
              <ActionIcon variant="subtle" color="gray">
                {showSubLog ? (
                  <IconChevronUp size={16} />
                ) : (
                  <IconChevronDown size={16} />
                )}
              </ActionIcon>
            </Group>

            <Collapse in={showSubLog}>
              <Divider my="sm" />
              <Timeline
                active={substitutionLog.length - 1}
                bulletSize={28}
                lineWidth={2}
                mt="sm"
              >
                {substitutionLog.map((event, index) => (
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
            </Collapse>
          </Card>
        )}

        {/* Footer Actions */}
        {roster.length > 0 && (
          <Group justify="flex-end" mb="xl">
            <Button
              variant="outline"
              color="gray"
              component={Link}
              to={routes.adminPlayerStats()}
            >
              Cancel
            </Button>
            <Button
              color="teal"
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={handleSaveStats}
              loading={isSaving}
            >
              Save Game Stats
            </Button>
          </Group>
        )}
      </Container>
    </AdminLayout>
  )
}

export default AdminPlayerStatsLivePage
