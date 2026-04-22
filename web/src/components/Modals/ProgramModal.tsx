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
} from '@mantine/core'
import { useForm } from '@mantine/form'

interface ProgramModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  program?: any // If present, it's an edit
  isLoading?: boolean
}

const ProgramModal: React.FC<ProgramModalProps> = ({
  isOpen,
  onClose,
  onSave,
  program,
  isLoading = false,
}) => {
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      level: 'BEGINNER',
      minAge: 5,
      maxAge: 18,
      capacity: 20,
      durationWeeks: 12,
      pricePerMonth: 150,
      isActive: true,
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name is too short' : null),
      pricePerMonth: (value) => (value < 0 ? 'Price cannot be negative' : null),
    },
  })

  useEffect(() => {
    if (program && isOpen) {
      form.setValues({
        name: program.name || '',
        description: program.description || '',
        level: program.level || 'BEGINNER',
        minAge: program.minAge || 5,
        maxAge: program.maxAge || 18,
        capacity: program.capacity || 20,
        durationWeeks: program.durationWeeks || 12,
        pricePerMonth: program.pricePerMonth || 150,
        isActive: program.isActive !== undefined ? program.isActive : true,
      })
    } else if (!isOpen) {
      form.reset()
    }
  }, [program, isOpen])

  const handleSubmit = (values: typeof form.values) => {
    onSave(values)
  }

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={program ? 'Edit Program' : 'Create New Program'}
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Program Name"
            placeholder="e.g. Junior Elite Academy"
            required
            {...form.getInputProps('name')}
          />

          <Textarea
            label="Description"
            placeholder="Describe the program goal and focus"
            rows={3}
            {...form.getInputProps('description')}
          />

          <Select
            label="Level"
            placeholder="Select skill level"
            data={[
              { value: 'BEGINNER', label: 'Beginner' },
              { value: 'INTERMEDIATE', label: 'Intermediate' },
              { value: 'ADVANCED', label: 'Advanced' },
              { value: 'ELITE', label: 'Elite' },
            ]}
            required
            {...form.getInputProps('level')}
          />

          <Group grow>
            <NumberInput
              label="Min Age"
              min={3}
              max={100}
              {...form.getInputProps('minAge')}
            />
            <NumberInput
              label="Max Age"
              min={3}
              max={100}
              {...form.getInputProps('maxAge')}
            />
          </Group>

          <Group grow>
            <NumberInput
              label="Capacity"
              min={1}
              {...form.getInputProps('capacity')}
            />
            <NumberInput
              label="Duration (Weeks)"
              min={1}
              {...form.getInputProps('durationWeeks')}
            />
          </Group>

          <NumberInput
            label="Price per Month ($)"
            decimalScale={2}
            fixedDecimalScale
            min={0}
            {...form.getInputProps('pricePerMonth')}
          />

          <Switch
            label="Program is Active"
            {...form.getInputProps('isActive', { type: 'checkbox' })}
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {program ? 'Save Changes' : 'Create Program'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

export default ProgramModal
