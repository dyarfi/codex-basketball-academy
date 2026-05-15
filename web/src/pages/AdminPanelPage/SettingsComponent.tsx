import { useEffect, useState } from 'react'

import { useMutation, useQuery } from '@apollo/client'
import {
  Card,
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  Tabs,
  Loader,
  Alert,
  Badge,
  Container,
  Box,
} from '@mantine/core'
import { CheckCircle, IconContext, WarningCircle } from '@phosphor-icons/react'
import {
  IconBorderBottomPlus,
  IconBorderTopPlus,
  IconFlagCog,
  IconIdBadge,
  IconPhoneCall,
  IconSocial,
  IconTextGrammar,
} from '@tabler/icons-react'

import { AdminLayout } from 'src/components/AdminLayout/AdminLayout'
import {
  SITE_SETTINGS_QUERY,
  SITE_SETTINGS_BY_GROUP_QUERY,
  UPDATE_SITE_SETTING_MUTATION,
} from 'src/graphql/mutations'
import { useAppTheme } from 'src/providers/ThemeProvider'

interface SettingValue {
  id: number
  key: string
  label: string
  group: string
  value: string
  valueType: string
}

const SettingsComponent = () => {
  const { isDark } = useAppTheme()
  const [activeTab, setActiveTab] = useState<string | null>('site_identity')
  const [editedValues, setEditedValues] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [groups, setGroups] = useState<Record<string, SettingValue[]>>({})

  const {
    data: settingsData,
    loading,
    error,
    refetch,
  } = useQuery(SITE_SETTINGS_QUERY)
  const [updateSiteSetting, { loading: updateLoading }] = useMutation(
    UPDATE_SITE_SETTING_MUTATION
  )

  useEffect(() => {
    if (settingsData?.siteSettings) {
      const groupedSettings = settingsData.siteSettings.reduce(
        (acc: Record<string, SettingValue[]>, setting: SettingValue) => {
          if (!acc[setting.group]) {
            acc[setting.group] = []
          }
          acc[setting.group].push(setting)
          return acc
        },
        {}
      )
      setGroups(groupedSettings)

      // Initialize edited values
      const initialValues: Record<string, string> = {}
      settingsData.siteSettings.forEach((setting: SettingValue) => {
        initialValues[setting.id] = setting.value
      })
      setEditedValues(initialValues)
    }
  }, [settingsData])

  const handleValueChange = (id: number, value: string) => {
    setEditedValues((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSave = async (id: number) => {
    const originalSetting = settingsData?.siteSettings.find(
      (s: SettingValue) => s.id === id
    )
    if (!originalSetting || editedValues[id] === originalSetting.value) {
      return
    }

    try {
      await updateSiteSetting({
        variables: {
          id,
          value: editedValues[id],
        },
      })
      setSuccessMessage('Setting updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      refetch()
    } catch (err) {
      console.error('Error updating setting:', err)
    }
  }

  const groupLabels: Record<string, React.ReactElement | string> = {
    site_identity: (
      <Group gap={'xs'}>
        <IconIdBadge size={14} />
        Site Identity
      </Group>
    ),
    header: (
      <Group gap={'xs'}>
        <IconBorderTopPlus size={14} />
        Header
      </Group>
    ),
    footer: (
      <Group gap={'xs'}>
        <IconBorderBottomPlus size={14} />
        Footer
      </Group>
    ),
    content: (
      <Group gap={'xs'}>
        <IconTextGrammar size={14} />
        Content
      </Group>
    ),
    contact: (
      <Group gap={'xs'}>
        <IconPhoneCall size={14} />
        Contact
      </Group>
    ),
    social_media: (
      <Group gap={'xs'}>
        <IconSocial size={14} />
        Social Media
      </Group>
    ),
    features: (
      <Group gap={'xs'}>
        <IconFlagCog size={14} />
        Features
      </Group>
    ),
  }

  const groupOrder = [
    'site_identity',
    'header',
    'footer',
    'content',
    'contact',
    'social_media',
    'features',
  ]

  const orderedGroups = groupOrder.filter((group) => groups[group])

  const surfaceClass = isDark
    ? 'border-slate-800 bg-slate-900'
    : 'border-slate-200 bg-white'

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="sm" />
      </div>
    )

  if (error)
    return (
      <Alert icon={<WarningCircle />} title="Error" color="red">
        Failed to load settings: {error.message}
      </Alert>
    )

  return (
    <AdminLayout>
      <Container size="xl" py="xl">
        <Box className="space-y-4" pb="xl">
          {successMessage && (
            <Alert icon={<CheckCircle />} title="Success" color="green">
              {successMessage}
            </Alert>
          )}

          <Card className={`${surfaceClass} border`} pb="xl">
            <Card.Section inheritPadding py="md">
              <h2 className="text-2xl font-bold">Site Settings</h2>
              <p
                className={`mt-1 text-sm ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Manage all site configuration settings
              </p>
            </Card.Section>

            <Card.Section inheritPadding>
              <Tabs
                value={activeTab}
                onChange={setActiveTab}
                // variant="pills"
                classNames={{
                  tab: isDark
                    ? 'data-[active]:bg-blue-600 data-[active]:text-white'
                    : 'data-[active]:bg-blue-100 data-[active]:text-blue-700',
                }}
              >
                <Tabs.List>
                  {orderedGroups.map((group) => (
                    <Tabs.Tab key={group} value={group}>
                      {groupLabels[group] || group}
                    </Tabs.Tab>
                  ))}
                </Tabs.List>

                {orderedGroups.map((group) => (
                  <Tabs.Panel key={group} value={group} pt="md">
                    <Stack gap="lg">
                      {groups[group]?.map((setting: SettingValue) => (
                        <Card
                          key={setting.id}
                          className={`${surfaceClass} border`}
                          p="md"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{setting.label}</h3>
                              <p
                                className={`text-xs ${
                                  isDark ? 'text-slate-400' : 'text-slate-500'
                                }`}
                              >
                                Key: {setting.key}
                              </p>
                            </div>
                            <Badge
                              size="sm"
                              variant="light"
                              color={
                                setting.valueType === 'text' ? 'blue' : 'green'
                              }
                            >
                              {setting.valueType}
                            </Badge>
                          </div>

                          {setting.valueType === 'boolean' ? (
                            <div className="mb-3 flex gap-2">
                              <Button
                                size="sm"
                                variant={
                                  editedValues[setting.id] === 'true'
                                    ? 'filled'
                                    : 'light'
                                }
                                onClick={() =>
                                  handleValueChange(setting.id, 'true')
                                }
                              >
                                Enabled
                              </Button>
                              <Button
                                size="sm"
                                variant={
                                  editedValues[setting.id] === 'false'
                                    ? 'filled'
                                    : 'light'
                                }
                                color="red"
                                onClick={() =>
                                  handleValueChange(setting.id, 'false')
                                }
                              >
                                Disabled
                              </Button>
                            </div>
                          ) : setting.valueType === 'textarea' ? (
                            <Textarea
                              placeholder="Enter value"
                              value={editedValues[setting.id] || ''}
                              onChange={(e) =>
                                handleValueChange(setting.id, e.target.value)
                              }
                              minRows={3}
                              maxRows={8}
                              className="mb-3"
                            />
                          ) : (
                            <TextInput
                              placeholder="Enter value"
                              value={editedValues[setting.id] || ''}
                              onChange={(e) =>
                                handleValueChange(setting.id, e.target.value)
                              }
                              className="mb-3"
                            />
                          )}

                          <Group justify="flex-end">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => {
                                setEditedValues((prev) => ({
                                  ...prev,
                                  [setting.id]: setting.value,
                                }))
                              }}
                            >
                              Reset
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSave(setting.id)}
                              loading={updateLoading}
                              disabled={
                                editedValues[setting.id] === setting.value
                              }
                            >
                              Save
                            </Button>
                          </Group>
                        </Card>
                      ))}
                    </Stack>
                  </Tabs.Panel>
                ))}
              </Tabs>
            </Card.Section>
          </Card>
        </Box>
      </Container>
    </AdminLayout>
  )
}

export default SettingsComponent
