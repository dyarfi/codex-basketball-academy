import { Group, ActionIcon } from '@mantine/core'
import {
  IconBrandFacebook,
  IconBrandX,
  IconBrandInstagram,
} from '@tabler/icons-react'

import { useSettings } from 'src/providers/SettingsProvider'

export const Social = ({ textClass }: { textClass?: string }) => {
  const { getSetting } = useSettings()
  const facebookUrl = getSetting(
    'facebook_url',
    'https://facebook.com/basketballacademy'
  )
  const twitterUrl = getSetting(
    'twitter_url',
    'https://twitter.com/basketballacademy'
  )
  const instagramUrl = getSetting(
    'instagram_url',
    'https://instagram.com/basketballacademy'
  )
  return (
    <div className={textClass}>
      <h3 className="mb-4 font-semibold text-blue-600">Follow Us</h3>
      <Group>
        {facebookUrl && (
          <ActionIcon
            radius={0}
            autoContrast
            rel="noopener noreferrer"
            aria-label="Facebook"
            size={'sm'}
          >
            <IconBrandFacebook stroke={1} />
          </ActionIcon>
        )}
        {twitterUrl && (
          <ActionIcon
            radius={0}
            autoContrast
            component="a"
            href={twitterUrl}
            rel="noopener noreferrer"
            aria-label="X"
            size={'sm'}
          >
            <IconBrandX stroke={1} />
          </ActionIcon>
        )}
        {instagramUrl && (
          <ActionIcon
            radius={0}
            autoContrast
            component="a"
            href={instagramUrl}
            rel="noopener noreferrer"
            aria-label="X"
            size={'sm'}
          >
            <IconBrandInstagram stroke={1} />
          </ActionIcon>
        )}
      </Group>
    </div>
  )
}
