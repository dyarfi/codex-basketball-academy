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
  Text,
  ActionIcon,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconPlus, IconTrash } from '@tabler/icons-react'

type UserOption = {
  id: string
  email: string
  role: string
  isActive?: boolean
  teamMemberships?: Array<{
    teamId: string
    team?: { id: string; name: string } | null
  }>
  profile?: {
    firstName?: string | null
    lastName?: string | null
  } | null
}

type TeamCoach = {
  userId: string
  role: string
}

type TeamMembership = {
  userId: string
}

type TeamData = {
  id: string
  name?: string | null
  ageGroup?: string | null
  description?: string | null
  coaches?: TeamCoach[]
  memberships?: TeamMembership[]
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
      coaches: [] as TeamCoach[],
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
        coaches: teamData.coaches?.map((c) => ({
          userId: c.userId,
          role: c.role,
        })) || [],
        playerIds: teamData.memberships?.map((m) => m.userId) || [],
        isActive:
          teamData.isActive !== undefined ? Boolean(teamData.isActive) : true,
      })
    } else if (!teamData && isOpen) {
      form.setValues({
        name: '',
        ageGroup: '',
        description: '',
        coaches: [],
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
    .map((player) => {
      // Get current team name if player is assigned to a different team
      const currentMembership = player.teamMemberships?.find(
        (m) => m.teamId !== teamData?.id
      )
      const teamLabel = currentMembership?.team?.name
        ? ` (${currentMembership.team.name})`
        : ''
      return {
        value: player.id,
        label: `${getUserName(player)}${teamLabel}`,
      }
    })

  const addCoach = () => {
    form.setFieldValue('coaches', [
      ...form.values.coaches,
      { userId: '', role: 'ASSISTANT' },
    ])
  }

  const removeCoach = (index: number) => {
    form.setFieldValue(
      'coaches',
      form.values.coaches.filter((_, i) => i !== index)
    )
  }

  const handleSubmit = (values: typeof form.values) => {
    onSave({
      name: values.name.trim(),
      ageGroup: values.ageGroup,
      description: values.description.trim() || null,
      coaches: values.coaches.filter((c) => c.userId),
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

          <div>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>Coaches & Roles</Text>
              <Button
                variant="light"
                size="xs"
                leftSection={<IconPlus size={14} />}
                onClick={addCoach}
              >
                Add Coach
              </Button>
            </Group>

            {form.values.coaches.length === 0 ? (
              <Text size="xs" c="dimmed" fs="italic" py="xs" style={{ border: '1px dashed #ced4da', borderRadius: '4px', textAlign: 'center' }}>
                No coaches assigned. Click "Add Coach" to assign a coach.
              </Text>
            ) : (
              <Stack gap="xs">
                {form.values.coaches.map((item, index) => (
                  <Group key={index} gap="sm" align="flex-end">
                    <Select
                      label={index === 0 ? "Coach" : null}
                      placeholder="Select coach"
                      data={coachOptions}
                      searchable
                      required
                      {...form.getInputProps(`coaches.${index}.userId`)}
                      style={{ flex: 2 }}
                    />
                    <Select
                      label={index === 0 ? "Role" : null}
                      placeholder="Select role"
                      data={[
                        { value: 'HEAD_COACH', label: 'Head Coach' },
                        { value: 'ASSISTANT', label: 'Assistant Coach' },
                        { value: 'TRAINER', label: 'Trainer' },
                      ]}
                      required
                      {...form.getInputProps(`coaches.${index}.role`)}
                      style={{ flex: 1.5 }}
                    />
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => removeCoach(index)}
                      size="lg"
                      style={{ marginBottom: '4px' }}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>
            )}
          </div>

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
