import React, { useEffect } from 'react'

import {
  Modal,
  TextInput,
  NumberInput,
  Select,
  Button,
  Group,
  Stack,
  Textarea,
  Loader,
} from '@mantine/core'
import { useForm } from '@mantine/form'

interface SkillAssessmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  assessmentData?: any // If present, it's an edit
  users: any[] // List of available users (players)
  programs: any[] // List of available programs
  isLoading?: boolean
  isDataLoading?: boolean
}

const SkillAssessmentModal: React.FC<SkillAssessmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  assessmentData,
  users = [],
  programs = [],
  isLoading = false,
  isDataLoading = false,
}) => {
  const form = useForm({
    initialValues: {
      userId: '',
      programId: '',
      shooting: 50,
      dribbling: 50,
      defense: 50,
      basketballIQ: 50,
      athleticism: 50,
      overallScore: 50,
      feedback: '',
      assessedBy: '',
      assessmentDate: new Date().toISOString().split('T')[0],
    },
    validate: {
      userId: (value) => (!value ? 'Player is required' : null),
      programId: (value) => (!value ? 'Program is required' : null),
      shooting: (value) =>
        value < 0 || value > 100 ? 'Score must be between 0-100' : null,
      dribbling: (value) =>
        value < 0 || value > 100 ? 'Score must be between 0-100' : null,
      defense: (value) =>
        value < 0 || value > 100 ? 'Score must be between 0-100' : null,
      basketballIQ: (value) =>
        value < 0 || value > 100 ? 'Score must be between 0-100' : null,
      athleticism: (value) =>
        value < 0 || value > 100 ? 'Score must be between 0-100' : null,
      overallScore: (value) =>
        value < 0 || value > 100 ? 'Score must be between 0-100' : null,
      assessmentDate: (value) =>
        !value ? 'Assessment date is required' : null,
    },
  })

  useEffect(() => {
    if (assessmentData && isOpen) {
      form.setValues({
        userId: assessmentData.userId || '',
        programId: assessmentData.programId || '',
        shooting: assessmentData.shooting || 50,
        dribbling: assessmentData.dribbling || 50,
        defense: assessmentData.defense || 50,
        basketballIQ: assessmentData.basketballIQ || 50,
        athleticism: assessmentData.athleticism || 50,
        overallScore: assessmentData.overallScore || 50,
        feedback: assessmentData.feedback || '',
        assessedBy: assessmentData.assessedBy || '',
        assessmentDate: assessmentData.assessmentDate
          ? new Date(assessmentData.assessmentDate)
              .toISOString()
              .split('T')[0]
          : new Date().toISOString().split('T')[0],
      })
    } else if (!isOpen) {
      form.reset()
    }
  }, [assessmentData, isOpen])

  const handleSubmit = (values: typeof form.values) => {
    onSave({
      ...values,
      assessmentDate: new Date(values.assessmentDate).toISOString(),
    })
  }

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.profile?.firstName} ${u.profile?.lastName} (${u.email})`,
  }))

  const programOptions = programs.map((p) => ({
    value: p.id,
    label: p.name,
  }))

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        assessmentData
          ? 'Edit Skill Assessment'
          : 'Create New Skill Assessment'
      }
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
                disabled={!!assessmentData}
                {...form.getInputProps('userId')}
              />

              <Select
                label="Program"
                placeholder="Select program"
                data={programOptions}
                required
                searchable
                disabled={!!assessmentData}
                {...form.getInputProps('programId')}
              />
            </Group>

            <Group grow>
              <NumberInput
                label="Shooting (0-100)"
                min={0}
                max={100}
                required
                {...form.getInputProps('shooting')}
              />
              <NumberInput
                label="Dribbling (0-100)"
                min={0}
                max={100}
                required
                {...form.getInputProps('dribbling')}
              />
            </Group>

            <Group grow>
              <NumberInput
                label="Defense (0-100)"
                min={0}
                max={100}
                required
                {...form.getInputProps('defense')}
              />
              <NumberInput
                label="Basketball IQ (0-100)"
                min={0}
                max={100}
                required
                {...form.getInputProps('basketballIQ')}
              />
            </Group>

            <Group grow>
              <NumberInput
                label="Athleticism (0-100)"
                min={0}
                max={100}
                required
                {...form.getInputProps('athleticism')}
              />
              <NumberInput
                label="Overall Score (0-100)"
                min={0}
                max={100}
                required
                {...form.getInputProps('overallScore')}
              />
            </Group>

            <Group grow>
              <TextInput
                label="Assessed By"
                placeholder="Coach or assessor name"
                {...form.getInputProps('assessedBy')}
              />
              <TextInput
                label="Assessment Date"
                type="date"
                required
                {...form.getInputProps('assessmentDate')}
              />
            </Group>

            <Textarea
              label="Feedback"
              placeholder="Add any assessment notes or feedback"
              rows={3}
              {...form.getInputProps('feedback')}
            />

            <Group justify="flex-end" mt="xl">
              <Button variant="default" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" loading={isLoading}>
                {assessmentData ? 'Save Changes' : 'Create Assessment'}
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  )
}

export default SkillAssessmentModal
