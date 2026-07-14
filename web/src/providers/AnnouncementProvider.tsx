import { useEffect, useMemo, type ReactNode } from 'react'

import {
  Badge,
  Box,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  ThemeIcon,
  Title,
  rem,
} from '@mantine/core'
import { useDisclosure, useLocalStorage } from '@mantine/hooks'
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react'
import dayjs from 'dayjs'

import { useQuery } from '@redwoodjs/web'

import { PUBLIC_ANNOUNCEMENT_QUERY } from 'src/graphql/announcements-queries'

type AnnouncementType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'

type PublicAnnouncement = {
  id: number
  title: string
  message: string
  type: AnnouncementType
  isActive: boolean
  isDismissible: boolean
  actionLabel?: string | null
  actionUrl?: string | null
  priority: number
  showFrom?: string | null
  showUntil?: string | null
  meta?: Record<string, unknown> | null
  updatedAt: string
}

type AnnouncementProviderProps = {
  children: ReactNode
}

const TYPE_CONFIG: Record<
  AnnouncementType,
  {
    color: string
    label: string
    icon: typeof IconInfoCircle
  }
> = {
  INFO: { color: 'blue', label: 'Information', icon: IconInfoCircle },
  SUCCESS: { color: 'green', label: 'Update', icon: IconCircleCheck },
  WARNING: { color: 'yellow', label: 'Important', icon: IconAlertTriangle },
  ERROR: { color: 'red', label: 'Urgent', icon: IconX },
}

const DISMISSED_ANNOUNCEMENTS_KEY = 'public-announcements-dismissed'

const isAnnouncementVisible = (announcement?: PublicAnnouncement | null) => {
  if (!announcement?.isActive) {
    return false
  }

  const now = dayjs()
  const startsAfterNow =
    announcement.showFrom && dayjs(announcement.showFrom).isAfter(now)
  const endedBeforeNow =
    announcement.showUntil && dayjs(announcement.showUntil).isBefore(now)

  return !startsAfterNow && !endedBeforeNow
}

const getMetaString = (
  meta: PublicAnnouncement['meta'],
  key: string
): string | undefined => {
  const value = meta?.[key]

  return typeof value === 'string' && value.trim() ? value : undefined
}

const isEvergreenAnnouncement = (announcement: PublicAnnouncement) =>
  !announcement.showFrom && !announcement.showUntil

const getAnnouncementDismissKey = (announcement: PublicAnnouncement) =>
  isEvergreenAnnouncement(announcement)
    ? Number(announcement.id)
    : announcement.id
// : `${announcement.id}:${announcement.updatedAt}`

export const AnnouncementProvider = ({
  children,
}: AnnouncementProviderProps) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [dismissedAnnouncements, setDismissedAnnouncements] = useLocalStorage<
    number[]
  >({
    key: DISMISSED_ANNOUNCEMENTS_KEY,
    defaultValue: [],
  })

  const { data } = useQuery(PUBLIC_ANNOUNCEMENT_QUERY, {
    fetchPolicy: 'cache-and-network',
    ...(dismissedAnnouncements.length > 0 && {
      variables: { notIn: [...dismissedAnnouncements] },
    }),
  })

  // console.log({ dismissedAnnouncements, data })
  const announcement = data?.publicAnnouncement as
    | PublicAnnouncement
    | null
    | undefined

  const dismissalKey = announcement
    ? getAnnouncementDismissKey(announcement)
    : undefined

  const shouldShowAnnouncement = useMemo(() => {
    if (!announcement || !dismissalKey) {
      return false
    }

    if (!isAnnouncementVisible(announcement)) {
      return false
    }

    return !dismissedAnnouncements.includes(dismissalKey)
  }, [announcement, dismissalKey, dismissedAnnouncements])

  useEffect(() => {
    if (shouldShowAnnouncement) {
      open()
    }
  }, [open, shouldShowAnnouncement])

  const handleClose = () => {
    if (announcement?.isDismissible && dismissalKey) {
      setDismissedAnnouncements((current) =>
        current.includes(dismissalKey) ? current : [...current, dismissalKey]
      )
    }

    close()
  }

  const typeConfig = announcement
    ? TYPE_CONFIG[announcement.type]
    : TYPE_CONFIG.INFO
  const Icon = typeConfig.icon
  const imageUrl = getMetaString(announcement?.meta, 'imageUrl')
  const eyebrow = getMetaString(announcement?.meta, 'eyebrow')
  const actionTarget =
    announcement?.actionUrl?.startsWith('http') ||
    announcement?.actionUrl?.startsWith('mailto:')
      ? '_blank'
      : undefined

  return (
    <>
      {children}
      {shouldShowAnnouncement && announcement ? (
        <Modal
          centered
          closeOnClickOutside={announcement.isDismissible}
          closeOnEscape={announcement.isDismissible}
          onClose={handleClose}
          opened={opened}
          radius="md"
          size="lg"
          // title={'Announcement'}
          // withCloseButton={announcement.isDismissible}
          withCloseButton={false}
        >
          <Stack gap="lg">
            {imageUrl ? (
              <Box
                style={{
                  aspectRatio: '16 / 7',
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  borderRadius: rem(8),
                }}
              />
            ) : null}

            <Group align="flex-start" gap="md" wrap="nowrap">
              <ThemeIcon color={typeConfig.color} radius="xl" size={46}>
                <Icon size={24} stroke={1.8} />
              </ThemeIcon>
              <Stack gap={6} style={{ flex: 1 }}>
                <Group gap="xs">
                  <Badge color={typeConfig.color} variant="light">
                    {eyebrow ?? typeConfig.label}
                  </Badge>
                  {/* {announcement.priority > 1 ? (
                    <Badge color="gray" variant="outline">
                      Priority {announcement.priority}
                    </Badge>
                  ) : null} */}
                </Group>
                <Title order={2} size="h3">
                  {announcement.title}
                </Title>
              </Stack>
            </Group>

            <Text c="dimmed" style={{ whiteSpace: 'pre-line' }}>
              {announcement.message}
            </Text>

            <Group justify="flex-end">
              {announcement.isDismissible ? (
                <Button color="gray" onClick={handleClose} variant="subtle">
                  Dismiss
                </Button>
              ) : null}
              {announcement.actionUrl ? (
                <Button
                  color={typeConfig.color}
                  component="a"
                  href={announcement.actionUrl}
                  onClick={handleClose}
                  rel={actionTarget ? 'noreferrer' : undefined}
                  target={actionTarget}
                >
                  {announcement.actionLabel ?? 'Learn more'}
                </Button>
              ) : (
                <Button color={typeConfig.color} onClick={handleClose}>
                  Continue
                </Button>
              )}
            </Group>
          </Stack>
        </Modal>
      ) : null}
    </>
  )
}
