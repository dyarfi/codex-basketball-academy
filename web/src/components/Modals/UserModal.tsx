import React, { useEffect } from 'react'

import {
  Modal,
  TextInput,
  Select,
  Switch,
  Button,
  Group,
  Stack,
  Text,
} from '@mantine/core'
import { useForm } from '@mantine/form'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  userData?: any // If present, it's an edit
  isLoading?: boolean
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen = false,
  onClose,
  onSave,
  userData,
  isLoading = false,
}) => {
  const form = useForm({
    initialValues: {
      email: '',
      role: 'PLAYER',
      isActive: true,
      profile: {
        firstName: '',
        lastName: '',
      },
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      'profile.firstName': (value) =>
        !value ? 'First name is required' : null,
      'profile.lastName': (value) => (!value ? 'Last name is required' : null),
    },
  })

  useEffect(() => {
    if (userData && isOpen) {
      form.setValues({
        email: userData.email || '',
        role: userData.role || 'PLAYER',
        isActive: userData.isActive !== undefined ? userData.isActive : true,
        profile: {
          firstName: userData.profile?.firstName || '',
          lastName: userData.profile?.lastName || '',
        },
      })
    } else if (!isOpen) {
      form.reset()
    }
  }, [userData, isOpen])

  const handleSubmit = (values: typeof form.values) => {
    onSave(values)
  }

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={userData ? 'Edit User' : 'Create New User'}
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {userData ? (
            <div>
              <Text size="sm" fw={500} className="mb-1 text-gray-600">
                Email
              </Text>
              <Text className="rounded border border-gray-200 bg-gray-50 p-2 text-gray-500">
                {userData.email}
              </Text>
            </div>
          ) : (
            <TextInput
              label="Email Address"
              placeholder="e.g. john@example.com"
              required
              {...form.getInputProps('email')}
            />
          )}

          <Group grow>
            <TextInput
              label="First Name"
              placeholder="John"
              required
              {...form.getInputProps('profile.firstName')}
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              required
              {...form.getInputProps('profile.lastName')}
            />
          </Group>

          <Select
            label="Role"
            placeholder="System role"
            data={[
              { value: 'ADMIN', label: 'Admin' },
              { value: 'COACH', label: 'Coach' },
              { value: 'PLAYER', label: 'Player' },
              { value: 'PARENT', label: 'Parent' },
              { value: 'PROSPECT', label: 'Prospect' },
            ]}
            required
            {...form.getInputProps('role')}
          />

          <Switch
            label="User is Active"
            {...form.getInputProps('isActive', { type: 'checkbox' })}
          />

          {!userData && (
            <Text size="xs" color="dimmed">
              New users will receive an email to set their password.
            </Text>
          )}

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {userData ? 'Save Changes' : 'Create User'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

export default UserModal
