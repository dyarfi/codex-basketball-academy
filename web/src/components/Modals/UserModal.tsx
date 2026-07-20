import React, { useEffect, useState } from 'react'

import {
  Modal,
  TextInput,
  Select,
  Switch,
  Button,
  Image,
  Group,
  Stack,
  Text,
  Tabs,
  NumberInput,
  FileButton,
  Box,
  Avatar,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'

import { uploadCloud } from 'src/lib/fetch'
import { formatDateOfBirth } from 'src/lib/formatters'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: Record<string, any>) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userData?: Record<string, any> // If present, it's an edit
  isLoading?: boolean
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen = false,
  onClose,
  onSave,
  userData,
  isLoading = false,
}) => {
  const [fileUpload, setFileUpload] = useState<File | null>(null)
  const [prepareSave, setPrepareSave] = useState<boolean | false>(false)
  const form = useForm({
    initialValues: {
      email: '',
      role: 'PLAYER',
      isActive: true,
      profile: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        position: '',
        jerseyNumber: '',
        heightCm: '',
        weightKg: '',
        medicalInfo: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        relationshipToPlayer: '',
        profilePhoto: '',
      },
    },
    validate: {
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : 'Invalid email',
      profile: {
        gender: (value: string) =>
          value === 'Male' || value === 'Female' ? null : 'False gender format',
      },
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
          gender: userData.profile?.gender || '',
          dateOfBirth: userData.profile?.dateOfBirth
            ? new Date(userData.profile.dateOfBirth).toISOString().split('T')[0]
            : '',
          phoneNumber: userData.profile?.phoneNumber || '',
          address: userData.profile?.address || '',
          city: userData.profile?.city || '',
          state: userData.profile?.state || '',
          zipCode: userData.profile?.zipCode || '',
          country: userData.profile?.country || '',
          position: userData.profile?.position || '',
          jerseyNumber: userData.profile?.jerseyNumber?.toString() || '',
          heightCm: userData.profile?.heightCm?.toString() || '',
          weightKg: userData.profile?.weightKg?.toString() || '',
          medicalInfo: userData.profile?.medicalInfo || '',
          emergencyContactName: userData.profile?.emergencyContactName || '',
          emergencyContactPhone: userData.profile?.emergencyContactPhone || '',
          relationshipToPlayer: userData.profile?.relationshipToPlayer || '',
          profilePhoto: userData.profile?.profilePhoto || '',
        },
      })
    } else if (!isOpen) {
      form.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, isOpen])

  const handleSubmit = async (values: typeof form.values) => {
    // Set prepared submit
    setPrepareSave(true)
    // Validate required profile fields
    if (!values.profile.firstName) {
      form.setFieldError('profile.firstName', 'First name is required')
      return
    }
    if (!values.profile.lastName) {
      form.setFieldError('profile.lastName', 'Last name is required')
      return
    }
    if (!values.profile.gender) {
      form.setFieldError('profile.gender', 'Gender is required')
      return
    }
    // Prepare upload
    let uploaded: unknown = null
    if (fileUpload) {
      try {
        // Upload to cloud folder
        uploaded = await uploadCloud(fileUpload, 'profile')
        form.setFieldValue('profile.profilePhoto', uploaded?.secure_url)
      } catch (e) {
        console.log(e)
        form.setFieldError(
          'profile.profilePhoto',
          'Upload Profile Photo failed!'
        )
      }
    }
    // Convert string numbers to actual numbers
    const processedValues = {
      ...values,
      profile: {
        ...values.profile,
        jerseyNumber: values.profile.jerseyNumber
          ? parseInt(values.profile.jerseyNumber)
          : undefined,
        heightCm: values.profile.heightCm
          ? parseFloat(values.profile.heightCm)
          : undefined,
        weightKg: values.profile.weightKg
          ? parseFloat(values.profile.weightKg)
          : undefined,
        profilePhoto: fileUpload
          ? uploaded?.secure_url
          : values.profile.profilePhoto,
      },
    }
    // Process submit
    try {
      onSave(processedValues)
    } catch (e) {
      console.log(e)
    }
    setPrepareSave(false)
  }

  const onChangeFile = (value: any) => {
    setFileUpload(value)
    form.setFieldValue('profile.profilePhoto', value?.name)
  }

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={userData ? 'Edit User' : 'Create New User'}
      size="xl"
      scrollAreaComponent={Tabs}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Tabs defaultValue="basic">
          <Tabs.List>
            <Tabs.Tab value="basic">Basic Info</Tabs.Tab>
            <Tabs.Tab value="contact">Contact Details</Tabs.Tab>
            {form.values.role === 'PLAYER' && (
              <Tabs.Tab value="player">Player Details</Tabs.Tab>
            )}
            <Tabs.Tab value="emergency">Emergency</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="basic" pt="md">
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
                  error={form.errors['profile.firstName']}
                  {...form.getInputProps('profile.firstName')}
                />
                <TextInput
                  label="Last Name"
                  placeholder="Doe"
                  required
                  error={form.errors['profile.lastName']}
                  {...form.getInputProps('profile.lastName')}
                />
                <TextInput
                  label="Gender"
                  placeholder="Male/Female"
                  required
                  error={form.errors['profile.gender']}
                  {...form.getInputProps('profile.gender')}
                />
              </Group>

              <TextInput
                label={`Date of Birth ${formatDateOfBirth(form.getValues()?.profile?.dateOfBirth)}`}
                type="date"
                {...form.getInputProps('profile.dateOfBirth')}
              />

              <TextInput
                label="Profile Photo"
                disabled
                leftSection={
                  userData?.profile.profilePhoto && (
                    <Box>
                      <Tooltip
                        label={
                          <Image src={userData?.profile.profilePhoto} h={400} />
                        }
                      >
                        <Avatar
                          radius={'none'}
                          style={{ cursor: 'pointer' }}
                          bd={'1px solid grey'}
                          src={userData?.profile.profilePhoto}
                          h={28}
                          w={22}
                        />
                      </Tooltip>
                    </Box>
                  )
                }
                leftSectionWidth={48}
                rightSection={
                  <FileButton
                    onChange={onChangeFile}
                    accept="image/png,image/jpeg"
                  >
                    {(props) => (
                      <Button {...props} size="xs">
                        {userData?.profile.profilePhoto ? 'CHANGE' : 'SELECT'}
                      </Button>
                    )}
                  </FileButton>
                }
                rightSectionWidth={87}
                {...form.getInputProps('profile.profilePhoto')}
              />

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

              {form.values.role === 'PLAYER' && (
                <Text size="xs" c="dimmed">
                  To assign this player to an Age Group Team, go to the Age
                  Group Teams page and edit the team.
                </Text>
              )}

              {!userData && (
                <Text size="xs" color="dimmed">
                  New users will receive an email to set their password.
                </Text>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="contact" pt="md">
            <Stack gap="md">
              <TextInput
                label="Phone Number"
                placeholder="+1-234-567-8900"
                {...form.getInputProps('profile.phoneNumber')}
              />
              <TextInput
                label="Address"
                placeholder="123 Main Street"
                {...form.getInputProps('profile.address')}
              />
              <Group grow>
                <TextInput
                  label="City"
                  placeholder="New York"
                  {...form.getInputProps('profile.city')}
                />
                <TextInput
                  label="State"
                  placeholder="NY"
                  {...form.getInputProps('profile.state')}
                />
              </Group>
              <Group grow>
                <TextInput
                  label="Zip Code"
                  placeholder="10001"
                  {...form.getInputProps('profile.zipCode')}
                />
                <TextInput
                  label="Country"
                  placeholder="United States"
                  {...form.getInputProps('profile.country')}
                />
              </Group>
            </Stack>
          </Tabs.Panel>

          {form.values.role === 'PLAYER' && (
            <Tabs.Panel value="player" pt="md">
              <Stack gap="md">
                <TextInput
                  label="Position"
                  placeholder="e.g., Guard, Forward"
                  {...form.getInputProps('profile.position')}
                />
                <NumberInput
                  label="Jersey Number"
                  placeholder="23"
                  {...form.getInputProps('profile.jerseyNumber')}
                />
                <Group grow>
                  <NumberInput
                    label="Height (cm)"
                    placeholder="180"
                    {...form.getInputProps('profile.heightCm')}
                  />
                  <NumberInput
                    label="Weight (kg)"
                    placeholder="85"
                    {...form.getInputProps('profile.weightKg')}
                  />
                </Group>
                <TextInput
                  label="Medical Information"
                  placeholder="Allergies, injuries, etc."
                  {...form.getInputProps('profile.medicalInfo')}
                />
              </Stack>
            </Tabs.Panel>
          )}

          <Tabs.Panel value="emergency" pt="md">
            <Stack gap="md">
              <TextInput
                label="Emergency Contact Name"
                placeholder="Parent/Guardian name"
                {...form.getInputProps('profile.emergencyContactName')}
              />
              <TextInput
                label="Emergency Contact Phone"
                placeholder="+1-234-567-8900"
                {...form.getInputProps('profile.emergencyContactPhone')}
              />
              <TextInput
                label="Relationship to Contact"
                placeholder="Parent, Guardian, etc."
                {...form.getInputProps('profile.relationshipToPlayer')}
              />
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Group justify="flex-end" mt="xl">
          <Button
            variant="default"
            onClick={onClose}
            disabled={prepareSave}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={prepareSave}
            disabled={isLoading}
            loaderProps={{ type: 'dots' }}
          >
            {userData ? 'Save Changes' : 'Create User'}
          </Button>
        </Group>
      </form>
    </Modal>
  )
}

export default UserModal
