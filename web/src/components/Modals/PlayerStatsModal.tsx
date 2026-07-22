import React, { useEffect } from 'react'

import {
  Modal,
  NumberInput,
  Select,
  Button,
  Group,
  Stack,
  TextInput,
  Loader,
} from '@mantine/core'
import { useForm } from '@mantine/form'

interface PlayerStatsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  statData?: any
  users: any[]
  liveGameSessions: any[]
  isLoading?: boolean
  isDataLoading?: boolean
}

const toDateInputValue = (value?: string) => {
  if (!value) return new Date().toISOString().split('T')[0]

  return new Date(value).toISOString().split('T')[0]
}

const PlayerStatsModal: React.FC<PlayerStatsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  statData,
  users = [],
  liveGameSessions = [],
  isLoading = false,
  isDataLoading = false,
}) => {
  const form = useForm({
    initialValues: {
      userId: '',
      liveGameSessionId: null as number | null,
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      minutesPlayed: 0,
    },
    validate: {
      userId: (value) => (!value ? 'Player is required' : null),
      liveGameSessionId: (value) => (!value ? 'Game session is required' : null),
      points: (value) => (value < 0 ? 'Points cannot be negative' : null),
      rebounds: (value) => (value < 0 ? 'Rebounds cannot be negative' : null),
      assists: (value) => (value < 0 ? 'Assists cannot be negative' : null),
      steals: (value) => (value < 0 ? 'Steals cannot be negative' : null),
      blocks: (value) => (value < 0 ? 'Blocks cannot be negative' : null),
      minutesPlayed: (value) =>
        value < 0 ? 'Minutes cannot be negative' : null,
    },
  })

  useEffect(() => {
    if (statData && isOpen) {
      form.setValues({
        userId: statData.userId || '',
        liveGameSessionId: statData.liveGameSessionId || null,
        points: statData.points ?? 0,
        rebounds: statData.rebounds ?? 0,
        assists: statData.assists ?? 0,
        steals: statData.steals ?? 0,
        blocks: statData.blocks ?? 0,
        minutesPlayed: statData.minutesPlayed ?? 0,
      })
    } else if (!isOpen) {
      form.reset()
    }
  }, [statData, isOpen])

  const handleSubmit = (values: typeof form.values) => {
    onSave(values)
  }

  const userOptions = users.map((u) => ({
    value: u.id,
    label:
      `${u.profile?.firstName || ''} ${u.profile?.lastName || ''} (${u.email})`.trim(),
  }))

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  const gameSessionOptions = liveGameSessions.map((session) => ({
    value: session.id.toString(),
    label: `${session.gameName} (${formatDate(session.gameDate)})`,
  }))

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={statData ? 'Edit Player Stats' : 'Create Player Stats'}
      size="lg"
    >
      {isDataLoading ? (
        <Group justify="center" p="xl">
          <Loader size="sm" />
        </Group>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Group grow>
              <Select
                label="Player"
                placeholder="Select player"
                data={userOptions}
                required
                searchable
                {...form.getInputProps('userId')}
              />

              <Select
                label="Game Session"
                placeholder="Select live game session"
                data={gameSessionOptions}
                required
                searchable
                value={form.values.liveGameSessionId?.toString() || ''}
                onChange={(val) => form.setFieldValue('liveGameSessionId', val ? Number(val) : null)}
                error={form.errors.liveGameSessionId}
              />
            </Group>

            <Group grow>
              <NumberInput
                label="Points"
                min={0}
                required
                {...form.getInputProps('points')}
              />
              <NumberInput
                label="Rebounds"
                min={0}
                required
                {...form.getInputProps('rebounds')}
              />
              <NumberInput
                label="Assists"
                min={0}
                required
                {...form.getInputProps('assists')}
              />
            </Group>

            <Group grow>
              <NumberInput
                label="Steals"
                min={0}
                required
                {...form.getInputProps('steals')}
              />
              <NumberInput
                label="Blocks"
                min={0}
                required
                {...form.getInputProps('blocks')}
              />
              <NumberInput
                label="Minutes Played"
                min={0}
                required
                {...form.getInputProps('minutesPlayed')}
              />
            </Group>

            <Group justify="flex-end" mt="xl">
              <Button variant="default" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" loading={isLoading}>
                {statData ? 'Save Changes' : 'Create Stats'}
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  )
}

export default PlayerStatsModal
