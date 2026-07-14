import { useEffect } from 'react'

import { Modal, Stack, Select, Textarea, Group, Button } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { format } from 'date-fns'

interface AttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: Record<string, any>) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attendanceData?: Record<string, any> | null // If present, it's an edit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  classes?: Record<string, any> // If present, it's an edit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  users?: Record<string, any>
  isLoading?: boolean
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen = false,
  onClose,
  onSave,
  attendanceData = null,
  classes = [],
  users = [],
  isLoading = false,
}) => {
  const form = useForm({
    initialValues: {
      classId: '',
      userId: '',
      attendanceDate: format(new Date(), 'yyyy-MM-dd HH:mm'),
      status: 'PRESENT',
      teamId: '',
      notes: '',
    },
    // validate: {
    //   email: (value: string) =>
    //     /^\S+@\S+$/.test(value) ? null : 'Invalid email',
    // },
  })

  useEffect(() => {
    if (attendanceData && isOpen) {
      form.setValues({
        classId: attendanceData.classId || '',
        userId: attendanceData.userId || '',
        attendanceDate:
          format(new Date(attendanceData.attendanceDate), 'yyyy-MM-dd HH:mm') ||
          format(new Date(), 'yyyy-MM-dd HH:mm'),
        status: attendanceData.status || 'PRESENT',
        teamId: attendanceData.teamId || '',
        notes: attendanceData.notes || '',
      })
    } else if (!isOpen) {
      form.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceData, isOpen])

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={attendanceData ? 'Edit Attendance' : 'Add Attendance'}
      centered
    >
      <Stack gap="md">
        <Select
          label="Class"
          placeholder="Select a class"
          data={classes.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          searchable
          required
          {...form.getInputProps('classId')}
        />

        <Select
          label="User"
          placeholder="Select a user"
          data={users.map((u: unknown) => ({
            value: u.id,
            label: `${u.profile?.firstName} ${u.profile?.lastName}` || u.email,
          }))}
          searchable
          required
          {...form.getInputProps('userId')}
        />

        <DateTimePicker
          clearable
          valueFormat="YYYY-MM-DD HH:mm"
          label="Attendance Date"
          placeholder="Attendance Date"
          required
          {...form.getInputProps('attendanceDate')}
        />

        <Select
          label="Status"
          placeholder="Select status"
          data={[
            { value: 'PRESENT', label: 'Present' },
            { value: 'ABSENT', label: 'Absent' },
            { value: 'LATE', label: 'Late' },
            { value: 'EXCUSED', label: 'Excused' },
          ]}
          required
          {...form.getInputProps('status')}
        />

        <Textarea
          label="Notes"
          placeholder="Optional notes about attendance"
          {...form.getInputProps('notes')}
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isLoading}
            loaderProps={{ type: 'dots' }}
          >
            {attendanceData ? 'Update' : 'Create'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default AttendanceModal
