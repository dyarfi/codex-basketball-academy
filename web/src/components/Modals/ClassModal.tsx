import React, { useEffect } from 'react'

import {
  Modal,
  TextInput,
  NumberInput,
  Select,
  Switch,
  Button,
  Group,
  Stack,
  Textarea,
  Loader,
} from '@mantine/core'
import { useForm } from '@mantine/form'

interface ClassModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  classData?: any // If present, it's an edit
  programs: any[] // List of available programs for selection
  coaches: any[] // List of available coaches for selection
  isLoading?: boolean
  isDataLoading?: boolean
}

const ClassModal: React.FC<ClassModalProps> = ({
  isOpen,
  onClose,
  onSave,
  classData,
  programs = [],
  coaches = [],
  isLoading = false,
  isDataLoading = false,
}) => {
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      programId: '',
      coachId: '',
      scheduleDay: 'Monday',
      scheduleTime: '16:00',
      capacity: 15,
      isActive: true,
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name is too short' : null),
      programId: (value) => (!value ? 'Program is required' : null),
      coachId: (value) => (!value ? 'Coach is required' : null),
    },
  })

  useEffect(() => {
    if (classData && isOpen) {
      form.setValues({
        name: classData.name || '',
        description: classData.description || '',
        programId: classData.programId || '',
        coachId: classData.coachId || '',
        scheduleDay: classData.scheduleDay || 'Monday',
        scheduleTime: classData.scheduleTime || '16:00',
        capacity: classData.capacity || 15,
        isActive: classData.isActive !== undefined ? classData.isActive : true,
      })
    } else if (!isOpen) {
      form.reset()
    }
  }, [classData, isOpen])

  const handleSubmit = (values: typeof form.values) => {
    onSave(values)
  }

  const programOptions = programs.map((p) => ({
    value: p.id,
    label: p.name,
  }))

  const coachOptions = coaches.map((c) => ({
    value: c.id,
    label: `${c.profile?.firstName} ${c.profile?.lastName} (${c.email})`,
  }))

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={classData ? 'Edit Class' : 'Create New Class'}
      size="md"
    >
      {isDataLoading ? (
        <Group justify="center" p="xl">
          <Loader size="sm" />
        </Group>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Class Name"
              placeholder="e.g. U14 Fundamentals - Group A"
              required
              {...form.getInputProps('name')}
            />

            <Select
              label="Program"
              placeholder="Assign to program"
              data={programOptions}
              required
              searchable
              {...form.getInputProps('programId')}
            />

            <Select
              label="Coach"
              placeholder="Assign a coach"
              data={coachOptions}
              required
              searchable
              {...form.getInputProps('coachId')}
            />

            <Textarea
              label="Description"
              placeholder="Optional class-specific details"
              rows={2}
              {...form.getInputProps('description')}
            />

            <Group grow>
              <Select
                label="Day"
                data={[
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ]}
                {...form.getInputProps('scheduleDay')}
              />
              <TextInput
                label="Time"
                placeholder="e.g. 16:00"
                {...form.getInputProps('scheduleTime')}
              />
            </Group>

            <NumberInput
              label="Capacity"
              min={1}
              {...form.getInputProps('capacity')}
            />

            <Switch
              label="Class is Active"
              {...form.getInputProps('isActive', { type: 'checkbox' })}
            />

            <Group justify="flex-end" mt="xl">
              <Button variant="default" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" loading={isLoading}>
                {classData ? 'Save Changes' : 'Create Class'}
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  )
}

export default ClassModal
