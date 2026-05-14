import React, { useEffect } from 'react'

import {
  Modal,
  Button,
  Group,
  Stack,
  Select,
  Loader,
  Alert,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'

interface EnrollmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (values: any) => void
  enrollmentData?: any
  classes: any[]
  programs: any[]
  players: any[]
  isLoading?: boolean
  isDataLoading?: boolean
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  enrollmentData,
  classes,
  programs,
  players,
  isLoading = false,
  isDataLoading = false,
}) => {
  const form = useForm({
    initialValues: {
      userId: '',
      classId: '',
      programId: '',
      status: 'ACTIVE',
    },
    validate: {
      userId: (value) => (!value ? 'Player is required' : null),
      classId: (value) => (!value ? 'Class is required' : null),
      programId: (value) => (!value ? 'Program is required' : null),
      status: (value) => (!value ? 'Status is required' : null),
    },
  })

  useEffect(() => {
    if (enrollmentData) {
      form.setValues({
        userId: enrollmentData.userId,
        classId: enrollmentData.classId,
        programId: enrollmentData.programId,
        status: enrollmentData.status,
      })
    } else {
      form.reset()
    }
  }, [enrollmentData, isOpen])

  const handleSubmit = form.onSubmit((values) => {
    onSave(values)
  })

  const playerOptions = (players || []).map((p: any) => ({
    value: p.id,
    label: `${p.profile?.firstName || ''} ${p.profile?.lastName || ''} (${p.email})`,
  }))

  const classOptions = (classes || []).map((c: any) => ({
    value: c.id,
    label: `${c.name} - ${c.scheduleDay} @ ${c.scheduleTime}`,
  }))

  const programOptions = (programs || []).map((p: any) => ({
    value: p.id,
    label: `${p.name} (${p.level})`,
  }))

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={enrollmentData ? 'Edit Enrollment' : 'New Enrollment'}
      size="md"
      centered
    >
      {isDataLoading ? (
        <Group justify="center" p="xl">
          <Loader size="sm" />
        </Group>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack>
            {!playerOptions.length && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="yellow"
                title="Warning"
              >
                No players available. Please create a player first.
              </Alert>
            )}

            <Select
              label="Player"
              placeholder="Select a player"
              data={playerOptions}
              searchable
              {...form.getInputProps('userId')}
              disabled={isLoading || !playerOptions.length}
            />

            <Select
              label="Program"
              placeholder="Select a program"
              data={programOptions}
              searchable
              {...form.getInputProps('programId')}
              disabled={isLoading || !programOptions.length}
            />

            <Select
              label="Class"
              placeholder="Select a class"
              data={classOptions}
              searchable
              {...form.getInputProps('classId')}
              disabled={isLoading || !classOptions.length}
            />

            <Select
              label="Status"
              placeholder="Select status"
              data={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' },
                { value: 'COMPLETED', label: 'Completed' },
              ]}
              {...form.getInputProps('status')}
              disabled={isLoading}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading || isDataLoading}
              >
                {enrollmentData ? 'Update' : 'Create'} Enrollment
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  )
}

export default EnrollmentModal
