import React, { useEffect } from 'react'

import {
  Button,
  Group,
  Modal,
  MultiSelect,
  Select,
  Stack,
  Switch,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'

type UserOption = {
  id: string
  email: string
  role: string
  isActive?: boolean
  teamId?: string | null
  team?: {
    id: string
    name: string
  } | null
  profile?: {
    firstName?: string | null
    lastName?: string | null
  } | null
}

type TeamData = {
  id: string
  name?: string | null
  ageGroup?: string | null
  description?: string | null
  coachId?: string | null
  players?: UserOption[]
  isActive?: boolean | null
}

type AgeGroupTeamModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Record<string, unknown>) => void
  teamData?: TeamData | null
  coaches: UserOption[]
  players: UserOption[]
  isLoading?: boolean
}

const ageGroupOptions = [
  'U-6',
  'U-8',
  'U-10',
  'U-12',
  'U-14',
  'U-16',
  'U-18',
].map((ageGroup) => ({ value: ageGroup, label: ageGroup }))

const getUserName = (user: UserOption) => {
  const profileName = [user.profile?.firstName, user.profile?.lastName]
    .filter(Boolean)
    .join(' ')

  return profileName || user.email
}

const AgeGroupTeamModal: React.FC<AgeGroupTeamModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teamData,
  coaches,
  players,
  isLoading = false,
}) => {
  const form = useForm({
    initialValues: {
      name: '',
      ageGroup: '',
      description: '',
      coachId: '',
      playerIds: [] as string[],
      isActive: true,
    },
    validate: {
      name: (value) => (value.trim() ? null : 'Team name is required'),
      ageGroup: (value) => (value ? null : 'Age group is required'),
    },
  })

  useEffect(() => {
    if (teamData && isOpen) {
      form.setValues({
        name: teamData.name || '',
        ageGroup: teamData.ageGroup || '',
        description: teamData.description || '',
        coachId: teamData.coachId || '',
        playerIds:
          teamData.players?.map((player: UserOption) => player.id) || [],
        isActive:
          teamData.isActive !== undefined ? Boolean(teamData.isActive) : true,
      })
    } else if (!teamData && isOpen) {
      form.setValues({
        name: '',
        ageGroup: '',
        description: '',
        coachId: '',
        playerIds: [],
        isActive: true,
      })
      form.clearErrors()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamData, isOpen])

  const coachOptions = coaches
    .filter((coach) => coach.role === 'COACH' && coach.isActive !== false)
    .map((coach) => ({
      value: coach.id,
      label: getUserName(coach),
    }))

  const playerOptions = players
    .filter((player) => player.role === 'PLAYER' && player.isActive !== false)
    .map((player) => ({
      value: player.id,
      label: `${getUserName(player)}${
        player.team?.name && player.team.id !== teamData?.id
          ? ` (${player.team.name})`
          : ''
      }`,
    }))

  const handleSubmit = (values: typeof form.values) => {
    onSave({
      name: values.name.trim(),
      ageGroup: values.ageGroup,
      description: values.description.trim() || null,
      coachId: values.coachId || null,
      playerIds: values.playerIds,
      isActive: values.isActive,
    })
  }

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={teamData ? 'Edit Age Group Team' : 'Create Age Group Team'}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Group grow align="flex-start">
            <TextInput
              label="Team Name"
              placeholder="U-14 Development"
              required
              {...form.getInputProps('name')}
            />
            <Select
              label="Age Group"
              placeholder="Select age group"
              data={ageGroupOptions}
              required
              searchable
              {...form.getInputProps('ageGroup')}
            />
          </Group>

          <Textarea
            label="Description"
            placeholder="Team focus, competition level, or roster notes"
            minRows={3}
            {...form.getInputProps('description')}
          />

          <Select
            label="Coach"
            placeholder="Assign a coach"
            data={coachOptions}
            searchable
            clearable
            {...form.getInputProps('coachId')}
          />

          <MultiSelect
            label="Players"
            placeholder="Assign players to this team"
            data={playerOptions}
            searchable
            clearable
            hidePickedOptions
            {...form.getInputProps('playerIds')}
          />

          <Switch
            label="Team is active"
            {...form.getInputProps('isActive', { type: 'checkbox' })}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {teamData ? 'Save Changes' : 'Create Team'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

export default AgeGroupTeamModal
