import React, { useEffect, useMemo, useRef, useState } from 'react'

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
  Switch,
  Grid,
} from '@mantine/core'
import {
  useDebouncedCallback,
  useFullscreen,
  useLocalStorage,
} from '@mantine/hooks'
import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconArrowsExchange,
  IconChevronDown,
  IconChevronUp,
  IconCircleCheck,
  IconClock,
  IconDeviceFloppy,
  IconEyePlus,
  IconMinus,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerStop,
  IconPlus,
  IconRefresh,
  IconTrash,
  IconUsers,
  IconMaximize,
  IconMinimize,
  IconStopwatch,
  IconUserPlus,
} from '@tabler/icons-react'

import { Link, navigate, routes } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { AdminLayout } from 'src/components/AdminLayout/AdminLayout'
import { GET_AGE_GROUP_TEAMS } from 'src/graphql/age-group-teams-queries'
import {
  // GET_LIVE_GAME_SESSIONS,
  CREATE_LIVE_GAME_SESSION,
  UPDATE_LIVE_GAME_SESSION,
  // DELETE_LIVE_GAME_SESSION,
} from 'src/graphql/live-game-sessions-queries'
import { CREATE_BULK_PLAYER_STATS } from 'src/graphql/player-stats-queries'
import { GET_USERS } from 'src/graphql/users-queries'

interface PlayerStatsState {
  points: number
  rebounds: number
  assists: number
  steals: number
  blocks: number
  minutesPlayed: number
  secondsPlayed?: number
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
  id?: number | null
  gameName: string
  gameDate: string
  selectedTeamId: string | null
  roster: RosterPlayer[]
  statsMap: Record<string, PlayerStatsState>
  substitutedOut: string[]
  substitutionLog: SubstitutionEvent[]
  gameMinute: number
  gameStarted: boolean
  gameFinished?: boolean
  elapsedSeconds: number
}

const AdminPlayerStatsLivePage = () => {
  // ─── Mantine useLocalStorage – persists the whole draft session ──────────────
  const [draft, setDraft, removeDraft] = useLocalStorage<DraftSession | null>({
    key: DRAFT_KEY,
    defaultValue: null,
    getInitialValueInEffect: false,
  })

  const [dbSessionId, setDbSessionId] = useState<number | null>(
    draft?.id ?? null
  )

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
  const [gameStarted, setGameStarted] = useState<boolean>(
    draft?.gameStarted ?? false
  )
  const [gameFinished, setGameFinished] = useState<boolean>(
    draft?.gameFinished ?? false
  )
  // ─── Timer State ──────────────────────────────────────────────────────────────
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(
    draft?.elapsedSeconds ?? 0
  )
  const [timerRunning, setTimerRunning] = useState<boolean>(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // ─────────────────────────────────────────────────────────────────────────────
  const [showSubLog, setShowSubLog] = useState(false)
  // ─────────────────────────────────────────────────────────────────────────────

  // Keep the "active button" state separate from your stats
  const [activeButton, setActiveButton] = useState<{
    playerId: string
    statKey: keyof PlayerStatsState
    amount: number
  } | null>(null)

  // Track the recently updated stat
  const [changedStat, setChangedStat] = useState<{
    playerId: string
    statKey: keyof PlayerStatsState
  } | null>(null)

  // hasDraft is derived – no extra state needed
  const hasDraft = draft !== null

  // ─── useDebouncedCallback – autosave 500ms after last change ─────────────────
  const persistDraft = useDebouncedCallback(
    (session: DraftSession) => setDraft(session),
    500
  )
  // ─────────────────────────────────────────────────────────────────────────────

  // ---- Fullscreen handler -----------------
  const { ref, toggle, fullscreen } = useFullscreen()
  // ─────────────────────────────────────────────────────────────────────────────

  // ─── Timer interval – auto-syncs elapsed minutes → gameMinute ────────────────
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1
          // Sync game minute (1-based, floor of elapsed minutes + 1)
          const nextMinute = Math.floor(next / 60) + 1
          setGameMinute(nextMinute)
          return next
        })

        // Accumulate minutesPlayed/secondsPlayed for active (on-court) players
        setStatsMap((prevStatsMap) => {
          const updated = { ...prevStatsMap }
          roster.forEach((player) => {
            const isBenched = substitutedOut.has(player.id)
            if (!isBenched) {
              const current = updated[player.id] || {
                points: 0,
                rebounds: 0,
                assists: 0,
                steals: 0,
                blocks: 0,
                minutesPlayed: 0,
                secondsPlayed: 0,
              }
              const currentSecs =
                current.secondsPlayed ?? current.minutesPlayed * 60
              const nextSecs = currentSecs + 1
              updated[player.id] = {
                ...current,
                secondsPlayed: nextSecs,
                minutesPlayed: Math.floor(nextSecs / 60),
              }
            }
          })
          return updated
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [timerRunning, roster, substitutedOut])

  // Periodic draft auto-save during active play (every 5 seconds)
  useEffect(() => {
    if (gameStarted && elapsedSeconds > 0 && elapsedSeconds % 5 === 0) {
      setDraft(buildDraftSnapshot())
    }
  }, [elapsedSeconds, gameStarted])
  // ─────────────────────────────────────────────────────────────────────────────

  const handleClearDraft = () => {
    persistDraft.cancel()
    removeDraft()
    setDbSessionId(null)
    setGameName('')
    const today = new Date()
    setGameDate(today.toISOString().split('T')[0])
    setSelectedTeamId(null)
    setRoster([])
    setStatsMap({})
    setSubstitutedOut(new Set())
    setSubstitutionLog([])
    setGameMinute(1)
    setGameStarted(false)
    setGameFinished(false)
    setElapsedSeconds(0)
    setTimerRunning(false)
    toast.success('Draft cleared')
  }

  const handleStartGame = () => {
    if (!gameName.trim()) {
      toast.error('Please enter a Game Name')
      return
    }
    if (!gameDate) {
      toast.error('Please select a Game Date')
      return
    }
    if (roster.length === 0) {
      toast.error('Please add at least 1 player to the roster')
      return
    }
    if (roster.length < 3) {
      toast.error('Please add at least 3 player to start game')
      return
    }
    setGameStarted(true)
    setTimerRunning(true)
    persistDraft(buildDraftSnapshot({ gameStarted: true }))
    toast.success('Game started! Timer running.')
  }

  const handleStopGame = () => {
    setTimerRunning(false)
    setGameFinished(true)
    persistDraft(
      buildDraftSnapshot({
        gameFinished: true,
      })
    )
    toast.success(
      'Game finished! You can now make final adjustments and save stats.'
    )
  }

  const handlePauseTimer = () => {
    setTimerRunning(false)
    persistDraft(buildDraftSnapshot({ elapsedSeconds }))
  }

  const handleResumeTimer = () => {
    setTimerRunning(true)
  }

  // Helper to build a full DraftSession snapshot
  const buildDraftSnapshot = (
    overrides: Partial<DraftSession> = {}
  ): DraftSession => ({
    id: dbSessionId,
    gameName,
    gameDate,
    selectedTeamId,
    roster,
    statsMap,
    substitutedOut: Array.from(substitutedOut),
    substitutionLog,
    gameMinute,
    gameStarted,
    gameFinished,
    elapsedSeconds,
    ...overrides,
  })

  // Queries & Mutations
  const {
    data: teamsData,
    loading: teamsLoading,
    error: teamsError,
  } = useQuery(GET_AGE_GROUP_TEAMS)
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS)

  // const { data: sessionsData, refetch: refetchSessions } = useQuery(
  //   GET_LIVE_GAME_SESSIONS
  // )

  const [createLiveGameSession, { loading: isCreatingSession }] = useMutation(
    CREATE_LIVE_GAME_SESSION,
    {
      onCompleted: (data) => {
        const newId = data.createLiveGameSession.id
        setDbSessionId(newId)
        persistDraft(buildDraftSnapshot({ id: newId }))
        saveBulkStats(newId)
        // refetchSessions()
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to save live session')
      },
    }
  )

  const [updateLiveGameSession, { loading: isUpdatingSession }] = useMutation(
    UPDATE_LIVE_GAME_SESSION,
    {
      onCompleted: () => {
        if (dbSessionId) {
          saveBulkStats(dbSessionId)
        }
        // refetchSessions()
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to update live session')
      },
    }
  )

  // const [deleteLiveGameSession] = useMutation(DELETE_LIVE_GAME_SESSION, {
  //   onCompleted: () => {
  //     refetchSessions()
  //     toast.success('Live session deleted successfully')
  //   },
  //   onError: (err) => {
  //     toast.error(err.message || 'Failed to delete live session')
  //   },
  // })

  const [createBulkPlayerStats, { loading: isSaving }] = useMutation(
    CREATE_BULK_PLAYER_STATS,
    {
      onCompleted: () => {
        persistDraft.cancel()
        removeDraft()
        // if (dbSessionId) {
        //   deleteLiveGameSession({
        //     variables: { id: dbSessionId },
        //   }).catch(() => {})
        // }
        toast.success(
          `Live game stats ${gameName && `${gameName} `}saved successfully`
        )
        navigate(routes.adminPlayerStats())
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to save player stats')
      },
    }
  )

  // const handleLoadSession = (session: any) => {
  //   setDbSessionId(session.id)
  //   setGameName(session.gameName)
  //   const dateStr = session.gameDate ? session.gameDate.split('T')[0] : ''
  //   setGameDate(dateStr)
  //   setSelectedTeamId(session.selectedTeamId)
  //   setRoster(session.roster)
  //   setStatsMap(session.statsMap)
  //   setSubstitutedOut(new Set(session.substitutedOut))
  //   setSubstitutionLog(session.substitutionLog)
  //   setGameMinute(session.gameMinute)
  //   setGameStarted(session.gameStarted)
  //   setGameFinished(session.gameFinished)
  //   setElapsedSeconds(session.elapsedSeconds)
  //   setTimerRunning(false)

  //   setDraft({
  //     id: session.id,
  //     gameName: session.gameName,
  //     gameDate: dateStr,
  //     selectedTeamId: session.selectedTeamId,
  //     roster: session.roster,
  //     statsMap: session.statsMap,
  //     substitutedOut: session.substitutedOut,
  //     substitutionLog: session.substitutionLog,
  //     gameMinute: session.gameMinute,
  //     gameStarted: session.gameStarted,
  //     gameFinished: session.gameFinished,
  //     elapsedSeconds: session.elapsedSeconds,
  //   })

  //   toast.success(`Loaded live session: ${session.gameName}`)
  // }

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
    const rosterIds = new Set(roster.map((r) => r.id))
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

    if (selectedTeam && selectedTeam.memberships) {
      const teamPlayers = (selectedTeam.memberships as any[])
        .map((m) => m.user)
        .filter(Boolean) as RosterPlayer[]
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
          secondsPlayed: 0,
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
          secondsPlayed: 0,
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

    // Check the player status
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

    setSubstitutedOut(newSubstitutedOut)
    const newLog = gameStarted ? [...substitutionLog, event] : substitutionLog
    if (gameStarted) {
      setSubstitutionLog(newLog)
    }

    persistDraft(
      buildDraftSnapshot({
        substitutedOut: Array.from(newSubstitutedOut),
        substitutionLog: newLog,
      })
    )

    toast.success(
      eventType === 'OUT'
        ? `${getPlayerName(player)} subbed OUT at minute ${gameMinute == 1 && !gameStarted ? 0 : gameMinute}`
        : `${getPlayerName(player)} subbed IN at minute ${gameMinute == 1 && !gameStarted ? 0 : gameMinute}`
    )
  }
  // ─────────────────────────────────────────────────────────────────────────────

  // Update specific stats for a player
  const updateStat = (
    playerId: string,
    statKey: keyof PlayerStatsState,
    amount: number
  ) => {
    // Track the recently updated stat
    setChangedStat({ playerId, statKey })
    // Highlight the clicked button
    setActiveButton({
      playerId,
      statKey,
      amount,
    })

    // Logic for player stat map
    const currentStats = statsMap[playerId] || {
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      minutesPlayed: 0,
      secondsPlayed: 0,
    }
    const newValue = Math.max(0, currentStats[statKey] + amount)

    // If updating minutesPlayed, align secondsPlayed as well
    const newSecondsValue =
      statKey === 'minutesPlayed'
        ? newValue * 60
        : (currentStats.secondsPlayed ?? currentStats.minutesPlayed * 60)

    const newStatsMap = {
      ...statsMap,
      [playerId]: {
        ...currentStats,
        [statKey]: newValue,
        secondsPlayed: newSecondsValue,
      },
    }
    setStatsMap(newStatsMap)
    persistDraft(buildDraftSnapshot({ statsMap: newStatsMap }))

    // Remove Track highlight after 300ms
    setTimeout(() => {
      setChangedStat(null)
    }, 300)
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

  // Save Stats – also upserts the live session to DB for audit trail
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
      toast.error('Please add at least 1 player to the roster')
      return
    }

    // Normalize date to ISO start of day
    const normalizedDate = new Date(`${gameDate}T00:00:00`).toISOString()

    // Upsert the live session snapshot to DB as an audit record
    const sessionInput = {
      gameName: gameName.trim(),
      gameDate: normalizedDate,
      selectedTeamId,
      roster,
      statsMap,
      substitutedOut: Array.from(substitutedOut),
      substitutionLog,
      gameMinute,
      gameStarted,
      gameFinished,
      elapsedSeconds,
    }
    if (dbSessionId) {
      updateLiveGameSession({
        variables: { id: dbSessionId, input: sessionInput },
      })
    } else {
      createLiveGameSession({ variables: { input: sessionInput } })
    }
  }

  const saveBulkStats = (sessionId: number) => {
    const inputs = roster.map((player) => {
      const stats = statsMap[player.id] || {
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        minutesPlayed: 0,
        secondsPlayed: 0,
      }

      return {
        userId: player.id,
        liveGameSessionId: sessionId,
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

  // Handle animated class
  const classScoreAnim = 'animate-[scorePop_300ms_ease-in-out]'
  const classButtonAnim = 'animate-[pulse_600ms_linear]'
  // Handle game not started not finished
  const isGameNoStartNoFinish: boolean =
    !gameStarted && !gameFinished && !timerRunning
  // Handle game started not finished
  const isGameStartNoFinish: boolean = gameStarted && !gameFinished
  // Handle game idle
  const isGameIdle: boolean = gameFinished && !gameStarted && !timerRunning
  // Handle game minimum player quota
  const isGameMinStart: boolean = onCourtCount < 3
  // Handle player added
  const isRosterAdded: boolean = roster.length > 0
  // Handle fullscren css mode
  const CSSFullscreen: string = fullscreen ? 'white' : ''
  // Handle warning text
  const warningMessage = isGameMinStart
    ? '3 Player minimum'
    : isGameNoStartNoFinish
      ? 'Start the game first'
      : isGameStartNoFinish
        ? 'Stop the game to save'
        : 'Save final game stats'

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
      <Container
        ref={ref}
        size="xl"
        py="md"
        bg={CSSFullscreen}
        style={{ overflowY: 'auto', overflowX: 'hidden' }}
      >
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
        <Group justify="space-between" mb="lg" align="start">
          <Stack gap={2}>
            <Group gap="xs" align="center">
              <Title order={2}>Live Game Scoreboard</Title>
              {dbSessionId ? (
                <Badge
                  color="blue"
                  variant="dot"
                  rightSection={<IconCircleCheck size={12} />}
                  size="md"
                >
                  Cloud Saved
                </Badge>
              ) : hasDraft ? (
                <Badge
                  color="teal"
                  variant="dot"
                  rightSection={<IconCircleCheck size={12} />}
                  size="md"
                >
                  Local Draft
                </Badge>
              ) : null}
              <Button
                radius={'lg'}
                onClick={toggle}
                size="compact-xs"
                leftSection={
                  fullscreen ? (
                    <IconMinimize size={14} />
                  ) : (
                    <IconMaximize size={14} />
                  )
                }
              >
                {fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              </Button>
            </Group>
            <Text size="sm" c="dimmed">
              Track and log player stats live in real-time during a game.
            </Text>
          </Stack>
          <Group gap="xs">
            {!gameFinished && hasDraft && !gameStarted && (
              <Button
                leftSection={<IconRefresh size={16} />}
                variant="light"
                color="red"
                size="sm"
                onClick={handleClearDraft}
                className={classButtonAnim}
              >
                Clear Draft
              </Button>
            )}
            {isRosterAdded && (
              <>
                {isGameNoStartNoFinish && (
                  <Button
                    leftSection={<IconPlayerPlay size={16} />}
                    color="green"
                    size="sm"
                    disabled={isGameMinStart}
                    title={
                      isGameMinStart ? '3 Player minimum' : 'Start the Game'
                    }
                    onClick={handleStartGame}
                    className={classButtonAnim}
                  >
                    Start Game
                  </Button>
                )}
                {isGameStartNoFinish && (
                  <>
                    {timerRunning ? (
                      <Button
                        leftSection={<IconPlayerPause size={16} />}
                        color="orange"
                        size="sm"
                        onClick={handlePauseTimer}
                        className={classButtonAnim}
                      >
                        Pause Game
                      </Button>
                    ) : (
                      <Button
                        leftSection={<IconPlayerPlay size={16} />}
                        color="green"
                        size="sm"
                        onClick={handleResumeTimer}
                        className={classButtonAnim}
                      >
                        Resume Game
                      </Button>
                    )}
                    <Button
                      leftSection={<IconPlayerStop size={16} />}
                      color="red"
                      size="sm"
                      onClick={handleStopGame}
                      className={classButtonAnim}
                    >
                      Finish Game
                    </Button>
                  </>
                )}
                {gameFinished && (
                  <Badge color="red" size="lg" variant="filled">
                    Game Finished!
                  </Badge>
                )}
              </>
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
        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg" mb="sm">
          {/* Game Setup Card */}
          <Card withBorder shadow="sm" p="md" radius="md">
            <Group justify="space-between" align="stretch">
              <Text size="md" fw={700} mb="sm" c="blue">
                Game Information & Roster Setup
                <Text size="xs" c="dimmed">
                  Live game scoreboard information & roster setup.
                </Text>
              </Text>
              <IconUserPlus size={28} color="var(--mantine-color-blue-8)" />
            </Group>
            <Stack gap="lg" mb={'md'}>
              <Group grow>
                <TextInput
                  disabled={gameFinished || gameStarted}
                  label="Game Name"
                  placeholder="e.g. Springfield Tournament Finals."
                  value={gameName}
                  onChange={(e) => {
                    const val = e.currentTarget.value
                    setGameName(val)
                    persistDraft(buildDraftSnapshot({ gameName: val }))
                  }}
                  required
                />
                <TextInput
                  disabled={gameFinished || gameStarted}
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
              </Group>
              <Select
                comboboxProps={{ withinPortal: false }}
                label="Select Team (Loads Roster)"
                placeholder={
                  teamsLoading ? 'Loading teams...' : 'Select a team.'
                }
                data={!teamsLoading && teamOptions}
                value={selectedTeamId}
                onChange={handleTeamChange}
                disabled={teamsLoading || gameFinished || gameStarted}
                clearable
                searchable
              />
              {/* Roster Selection & Manual Addition */}
              {/* <Group justify="stretch" align="end" grow> */}
              <Grid grow justify="flex-end" align="end">
                <Grid.Col span={{ lg: 6 }}>
                  <Select
                    comboboxProps={{
                      withinPortal: false,
                      dropdownPadding: 0,
                      // width: 404,
                    }}
                    // width={400}
                    // miw={280}
                    label="Add Individual Players"
                    placeholder="Search or select player to add..."
                    data={playerOptions || [{ value: '', label: '' }]}
                    value={individualPlayerSelect}
                    onChange={setIndividualPlayerSelect}
                    searchable
                    clearable
                    disabled={usersLoading}
                    leftSection={<IconUsers size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={{ lg: 1 }}>
                  <Button
                    onClick={handleAddPlayer}
                    disabled={!individualPlayerSelect}
                    color="blue"
                    miw={100}
                    tt="uppercase"
                    // size="compact-lg"
                  >
                    Add
                  </Button>
                </Grid.Col>
              </Grid>
              {/* </Group> */}
            </Stack>

            {/* {!gameStarted &&
              !gameFinished &&
              sessionsData?.liveGameSessions?.length > 0 && (
                <>
                  <Divider
                    my="md"
                    label="Resume Saved Live Session"
                    labelPosition="center"
                  />
                  <Stack gap="xs" mt="xs">
                    {sessionsData.liveGameSessions.map((s: any) => (
                      <Paper key={s.id} withBorder p="xs" radius="sm">
                        <Group justify="space-between">
                          <Stack gap={2}>
                            <Text size="sm" fw={600}>
                              {s.gameName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {s.gameDate ? s.gameDate.split('T')[0] : ''} ·{' '}
                              {s.roster ? s.roster.length : 0} Players
                            </Text>
                          </Stack>
                          <Group gap="xs">
                            <Button
                              size="compact-xs"
                              color="blue"
                              onClick={() => handleLoadSession(s)}
                            >
                              Load
                            </Button>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() => {
                                if (
                                  confirm(
                                    `Are you sure you want to delete the saved session "${s.gameName}"?`
                                  )
                                ) {
                                  deleteLiveGameSession({
                                    variables: { id: s.id },
                                  })
                                }
                              }}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Group>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                </>
              )} */}
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
            <Group justify="space-between" align="stretch">
              <Text size="md" fw={700} mb="xs" c="blue.8">
                Live Team Scoreboard Totals
                <Text size="xs" c="dimmed">
                  Live totals from active players.
                </Text>
              </Text>
              <IconEyePlus size={28} color="var(--mantine-color-blue-8)" />
            </Group>
            <SimpleGrid
              cols={5}
              spacing="xs"
              style={{ textAlign: 'center' }}
              my={'lg'}
            >
              <Paper p="xs" radius="sm" withBorder>
                <Text size="xs" fw={700} c="dimmed">
                  PTS
                </Text>
                <Text
                  size="xl"
                  fw={900}
                  c="blue.8"
                  className={
                    changedStat?.statKey === 'points' ? classScoreAnim : ''
                  }
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
                  className={
                    changedStat?.statKey === 'rebounds' ? classScoreAnim : ''
                  }
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
                  className={
                    changedStat?.statKey === 'assists' ? classScoreAnim : ''
                  }
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
                  className={
                    changedStat?.statKey === 'steals' ? classScoreAnim : ''
                  }
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
                  className={
                    changedStat?.statKey === 'blocks' ? classScoreAnim : ''
                  }
                >
                  {teamTotals.blocks}
                </Text>
              </Paper>
            </SimpleGrid>
            <Group justify="space-between" mt="lg" mb={'md'}>
              <Group gap="xs">
                <Text size="sm" fw={600} c="gray.7">
                  Roster: {roster.length} Players
                </Text>
                <Text size="xs" c="dimmed">
                  ·
                </Text>
                <Badge color="green" variant="dot" size="md">
                  {onCourtCount} On Court
                </Badge>
                {substitutedOut.size > 0 && (
                  <>
                    <Text size="xs" c="dimmed">
                      ·
                    </Text>
                    <Badge color="gray" variant="dot" size="md">
                      {substitutedOut.size} Benched
                    </Badge>
                  </>
                )}
              </Group>
              <Badge
                color={gameFinished ? 'red' : gameStarted ? 'green' : 'gray'}
                variant="dot"
              >
                {gameFinished
                  ? 'Game Finished'
                  : gameStarted
                    ? 'Live Tracker Active'
                    : 'Game Not Started'}
              </Badge>
            </Group>
          </Card>

          {/* Game Setup Scoreboard */}
          <Card withBorder shadow="sm" p="md" radius="md">
            {/* Game Clock / Substitution Minute Control */}
            {/* {isRosterAdded && ( */}
            <>
              <Stack
                align="stretch"
                justify="center"
                gap="sm"
                className={classButtonAnim}
              >
                <Group justify="space-between" align="stretch">
                  <Text size="md" fw={700} c="blue.8">
                    Live Game Clock
                    <Text size="xs" c="dimmed">
                      Scoreboard live game clock.
                    </Text>
                  </Text>
                  <IconStopwatch
                    size={28}
                    color="var(--mantine-color-blue-8)"
                  />
                </Group>
                {/* Timer Display */}
                <Paper
                  withBorder
                  p="sm"
                  mt={2}
                  radius="md"
                  style={{
                    background: gameStarted
                      ? timerRunning
                        ? 'linear-gradient(135deg, var(--mantine-color-green-0), var(--mantine-color-teal-0))'
                        : 'linear-gradient(135deg, var(--mantine-color-orange-0), var(--mantine-color-yellow-0))'
                      : 'var(--mantine-color-gray-0)',
                    border: gameStarted
                      ? timerRunning
                        ? '1.5px solid var(--mantine-color-green-4)'
                        : '1.5px solid var(--mantine-color-orange-4)'
                      : '1.5px solid var(--mantine-color-gray-3)',
                    textAlign: 'center',
                  }}
                >
                  <Group justify="center" align="center" gap="xs" mb={2}>
                    <IconClock
                      size={14}
                      color={
                        gameStarted
                          ? timerRunning
                            ? 'var(--mantine-color-green-7)'
                            : 'var(--mantine-color-orange-7)'
                          : 'var(--mantine-color-gray-5)'
                      }
                    />
                    <Text
                      size="xs"
                      fw={600}
                      c={
                        gameFinished
                          ? 'red.7'
                          : gameStarted
                            ? timerRunning
                              ? 'green.7'
                              : 'orange.7'
                            : 'dimmed'
                      }
                    >
                      {gameFinished
                        ? 'FINISHED'
                        : gameStarted
                          ? timerRunning
                            ? 'LIVE'
                            : 'PAUSED'
                          : 'NOT STARTED'}
                    </Text>
                  </Group>
                  <Text
                    fw={900}
                    fz={{ base: 'h1', lg: '3.2rem' }}
                    style={{
                      fontFamily: 'monospace',
                      letterSpacing: '0.05em',
                      color: gameFinished
                        ? 'var(--mantine-color-red-8)'
                        : gameStarted
                          ? timerRunning
                            ? 'var(--mantine-color-green-8)'
                            : 'var(--mantine-color-orange-7)'
                          : 'var(--mantine-color-gray-5)',
                    }}
                  >
                    {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:
                    {String(elapsedSeconds % 60).padStart(2, '0')}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Minute{' '}
                    <Text span fw={700} c={gameStarted ? 'orange.7' : 'dimmed'}>
                      {gameMinute}
                    </Text>
                  </Text>
                </Paper>

                {/* Pause / Resume Controls (only visible if game started and not finished) */}
                {isGameStartNoFinish && (
                  <Group gap="xs" mt={gameStarted ? 4 : 1}>
                    {timerRunning ? (
                      <Button
                        size="xs"
                        leftSection={<IconPlayerPause size={13} />}
                        color="orange"
                        variant="filled"
                        onClick={handlePauseTimer}
                        style={{ flex: 1 }}
                      >
                        Pause Clock
                      </Button>
                    ) : (
                      <Button
                        size="xs"
                        leftSection={<IconPlayerPlay size={13} />}
                        color="green"
                        variant="filled"
                        onClick={handleResumeTimer}
                        style={{ flex: 1 }}
                      >
                        Resume Clock
                      </Button>
                    )}
                  </Group>
                )}

                {!gameStarted && !gameFinished && (
                  <Text
                    mt={1}
                    size="sm"
                    c="blue.8"
                    className="animate-pulse"
                    ta="center"
                  >
                    Add players to <b>start</b> the game!
                  </Text>
                )}

                <Text size="xs" c="dimmed" mt={gameStarted ? 2 : 1}>
                  Click the{' '}
                  <Badge
                    size="xs"
                    color="teal"
                    variant="filled"
                    title="Playing"
                    leftSection={<IconArrowsExchange size={10} />}
                    style={{ verticalAlign: 'middle' }}
                  >
                    IN
                  </Badge>{' '}
                  /{' '}
                  <Badge
                    size="xs"
                    color="var(--mantine-color-gray-3)"
                    c="var(--mantine-color-gray-6)"
                    variant="filled"
                    title="Benched"
                    leftSection={<IconArrowsExchange size={10} />}
                    style={{ verticalAlign: 'middle' }}
                  >
                    OUT
                  </Badge>{' '}
                  switch on each player row to sub at the current minute.
                </Text>
                {gameFinished && (
                  <Text size="sm" c="red.8" className="animate-pulse">
                    <b>GAME FINISHED!</b> You can now make final adjustments and{' '}
                    <b>Save Game Stats</b>!
                  </Text>
                )}
              </Stack>
            </>
            {/* )} */}
          </Card>
        </SimpleGrid>

        {/* Pre-game warning banner */}
        {isRosterAdded && isGameNoStartNoFinish && (
          <Alert
            icon={<IconPlayerPlay size={16} />}
            title="Game Not Started"
            color="orange"
            variant="light"
            mb="md"
          >
            Stat tracking is disabled. Press{' '}
            <Text c="green" component="span" fw="bold" fz="sm">
              Start Game
            </Text>{' '}
            button to enable Points, Rebounds, Assists, Steals, Blocks, and
            Minutes controls.
          </Alert>
        )}

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
                  <Table.Th style={{ minWidth: '100px', textAlign: 'center' }}>
                    Status
                  </Table.Th>
                  <Table.Th style={{ minWidth: '170px' }}>Player</Table.Th>
                  <Table.Th
                    style={{
                      width: '140px',
                      textAlign: 'center',
                      minWidth: '150px',
                    }}
                  >
                    Points (PTS)
                  </Table.Th>
                  <Table.Th style={{ minWidth: '40px', textAlign: 'center' }}>
                    Rebounds (REB)
                  </Table.Th>
                  <Table.Th style={{ minWidth: '60px', textAlign: 'center' }}>
                    Assists (AST)
                  </Table.Th>
                  <Table.Th style={{ minWidth: '70px', textAlign: 'center' }}>
                    Steals (STL)
                  </Table.Th>
                  <Table.Th style={{ minWidth: '70px', textAlign: 'center' }}>
                    Blocks (BLK)
                  </Table.Th>
                  <Table.Th style={{ minWidth: '140px', textAlign: 'center' }}>
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
                    secondsPlayed: 0,
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
                          <Stack gap={2} justify="stretch" align="center">
                            <Text size="xs" tt="uppercase">
                              {isBenched ? 'Benched' : 'Playing'}
                            </Text>
                            <Switch
                              checked={!isBenched}
                              onChange={() => handleToggleSubstitution(player)}
                              color="teal"
                              size="lg"
                              onLabel={
                                <Text fw="bold" size="11">
                                  IN
                                </Text>
                              }
                              offLabel={
                                <Text fw="bold" size="11">
                                  OUT
                                </Text>
                              }
                              thumbIcon={
                                !isBenched ? (
                                  <IconArrowsExchange
                                    size={14}
                                    color="var(--mantine-color-teal-6)"
                                  />
                                ) : (
                                  <IconArrowsExchange
                                    size={14}
                                    color="var(--mantine-color-red-6)"
                                  />
                                )
                              }
                            />
                          </Stack>
                        </Tooltip>
                      </Table.Td>

                      {/* Player Profile & Details */}
                      <Table.Td>
                        <Group gap="xs">
                          <Avatar
                            src={player.profile?.profilePhoto}
                            radius="xl"
                            size="md"
                            variant={player.profile?.profilePhoto}
                            style={{ border: '1px solid #dddddd' }}
                            color={isBenched ? 'gray' : 'blue'}
                          >
                            {player.profile?.firstName?.[0]}
                            {player.profile?.lastName?.[0]}
                          </Avatar>
                          <Stack gap="4">
                            <Text
                              size="sm"
                              fw={600}
                              c={isBenched ? 'dimmed' : undefined}
                            >
                              {getPlayerName(player)}
                            </Text>
                            {player.profile?.jerseyNumber !== undefined && (
                              <Badge
                                size="md"
                                variant="outline"
                                color={isBenched ? 'gray' : 'green'}
                              >
                                #{player.profile.jerseyNumber}
                              </Badge>
                            )}
                            {player.profile?.position && (
                              <Text size="xs" c="dimmed">
                                {player.profile.position}
                              </Text>
                            )}
                          </Stack>
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
                            className={
                              changedStat?.playerId === player.id &&
                              changedStat?.statKey === 'points'
                                ? classScoreAnim
                                : ''
                            }
                          >
                            {stats.points} PTS
                          </Badge>
                          <Group gap={4}>
                            <Button
                              size="xs"
                              variant={
                                activeButton?.playerId === player.id &&
                                activeButton?.statKey === 'points' &&
                                activeButton?.amount === -1
                                  ? 'light'
                                  : 'outline'
                              }
                              color="red"
                              px={6}
                              disabled={isGameNoStartNoFinish}
                              onClick={() =>
                                updateStat(player.id, 'points', -1)
                              }
                            >
                              -1
                            </Button>
                            <Button
                              size="xs"
                              variant={
                                activeButton?.playerId === player.id &&
                                activeButton?.statKey === 'points' &&
                                activeButton?.amount === 1
                                  ? 'light'
                                  : 'outline'
                              }
                              color="blue"
                              px={6}
                              disabled={isGameNoStartNoFinish}
                              onClick={() => updateStat(player.id, 'points', 1)}
                            >
                              +1
                            </Button>
                            <Button
                              size="xs"
                              variant={
                                activeButton?.playerId === player.id &&
                                activeButton?.statKey === 'points' &&
                                activeButton?.amount === 2
                                  ? 'light'
                                  : 'outline'
                              }
                              color="blue"
                              px={6}
                              disabled={isGameNoStartNoFinish}
                              onClick={() => updateStat(player.id, 'points', 2)}
                            >
                              +2
                            </Button>
                            <Button
                              size="xs"
                              variant={
                                activeButton?.playerId === player.id &&
                                activeButton?.statKey === 'points' &&
                                activeButton?.amount === 3
                                  ? 'light'
                                  : 'outline'
                              }
                              color="blue"
                              px={6}
                              disabled={isGameNoStartNoFinish}
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
                          <Text
                            fw={700}
                            size="sm"
                            className={
                              changedStat?.playerId === player.id &&
                              changedStat?.statKey === 'rebounds'
                                ? classScoreAnim
                                : ''
                            }
                          >
                            {stats.rebounds}
                          </Text>
                          <Group gap={4}>
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="gray"
                              disabled={isGameNoStartNoFinish}
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
                              disabled={isGameNoStartNoFinish}
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
                          <Text
                            fw={700}
                            size="sm"
                            className={
                              changedStat?.playerId === player.id &&
                              changedStat?.statKey === 'assists'
                                ? classScoreAnim
                                : ''
                            }
                          >
                            {stats.assists}
                          </Text>
                          <Group gap={4}>
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="gray"
                              disabled={isGameNoStartNoFinish}
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
                              disabled={isGameNoStartNoFinish}
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
                          <Text
                            fw={700}
                            size="sm"
                            className={
                              changedStat?.playerId === player.id &&
                              changedStat?.statKey === 'steals'
                                ? classScoreAnim
                                : ''
                            }
                          >
                            {stats.steals}
                          </Text>
                          <Group gap={4}>
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="gray"
                              disabled={isGameNoStartNoFinish}
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
                              disabled={isGameNoStartNoFinish}
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
                          <Text
                            fw={700}
                            size="sm"
                            className={
                              changedStat?.playerId === player.id &&
                              changedStat?.statKey === 'blocks'
                                ? classScoreAnim
                                : ''
                            }
                          >
                            {stats.blocks}
                          </Text>
                          <Group gap={4}>
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="gray"
                              disabled={isGameNoStartNoFinish}
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
                              disabled={isGameNoStartNoFinish}
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
                          <Badge
                            variant="light"
                            color="gray"
                            size="md"
                            className={
                              changedStat?.playerId === player.id &&
                              changedStat?.statKey === 'minutesPlayed'
                                ? classScoreAnim
                                : ''
                            }
                          >
                            {stats.minutesPlayed} MIN
                          </Badge>
                          <Group gap={4}>
                            <Button
                              size="xs"
                              variant="light"
                              color="red"
                              px={4}
                              disabled={isGameNoStartNoFinish}
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
                              disabled={isGameNoStartNoFinish}
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
                              disabled={isGameNoStartNoFinish}
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
                              disabled={isGameNoStartNoFinish}
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
                        <Tooltip
                          label={
                            isGameNoStartNoFinish || isGameIdle
                              ? 'Remove player from this scoreboard'
                              : isGameStartNoFinish || !gameFinished
                                ? 'Cannot remove while game started'
                                : 'Cannot remove while game finished'
                          }
                        >
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            disabled={
                              isGameStartNoFinish || isGameIdle || gameFinished
                            }
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
                  <Text size="xs" c="gray.6" my={0}>
                    {draft?.gameName}
                  </Text>
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
            </Collapse>
          </Card>
        )}

        {/* Footer Actions */}
        {isRosterAdded && (
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
              loading={isSaving || isCreatingSession || isUpdatingSession}
              disabled={
                isGameMinStart ||
                isGameStartNoFinish ||
                isGameIdle ||
                !gameFinished
              }
              id="hover-save"
            >
              Save Game Stats
            </Button>
            <Tooltip target="#hover-save" label={warningMessage} />
          </Group>
        )}
      </Container>
    </AdminLayout>
  )
}

export default AdminPlayerStatsLivePage
