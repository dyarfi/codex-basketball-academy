import { ActionIcon, Group } from '@mantine/core'
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
} from '@tabler/icons-react'

import { useSettings } from 'src/providers/SettingsProvider'
import { useAppTheme } from 'src/providers/ThemeProvider'

const Footer = ({
  type = '',
}: {
  type?: 'social' | 'links' | 'contact' | ''
}) => {
  const { isDark } = useAppTheme()
  const { getSetting, loading } = useSettings()

  const footerText = getSetting(
    'footer_text',
    '© 2026 Basketball Academy. All rights reserved.'
  )
  const footerAddress = getSetting(
    'footer_address',
    '123 Academy Way, Springfield, IL 62701'
  )
  const footerPhone = getSetting('footer_phone', '+1 (555) 123-4567')
  const footerEmail = getSetting('footer_email', 'info@basketballacademy.com')
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

  const footerClass = isDark
    ? 'border-t border-slate-800 bg-slate-950'
    : 'border-t border-slate-200 bg-slate-50'

  const textClass = isDark ? 'text-slate-300' : 'text-slate-700'

  if (loading) return null

  const isContact = type === 'contact' || type === ''
  const isSocial = type === 'social' || type === ''
  const isLinks = type === 'links' || type === ''

  return (
    <footer
      className={`${footerClass} py-12`}
      // style={{
      //   background: 'url(/images/assets/triangle-bg.svg) top center',
      //   backgroundSize: 'contain',
      // }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Contact Info */}
          {isContact && (
            <div>
              <h3 className="mb-4 font-semibold text-blue-600">Contact Us</h3>
              <div className={`space-y-2 text-sm ${textClass}`}>
                <p>{footerAddress}</p>
                <p>
                  <a
                    href={`tel:${footerPhone}`}
                    className="hover:text-blue-600"
                  >
                    {footerPhone}
                  </a>
                </p>
                <p>
                  <a
                    href={`mailto:${footerEmail}`}
                    className="hover:text-blue-600"
                  >
                    {footerEmail}
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Quick Links */}
          {isLinks && (
            <div>
              <h3 className="mb-4 font-semibold text-blue-600">Quick Links</h3>
              <ul className={`space-y-2 text-sm ${textClass}`}>
                <li>
                  <a href="/programs" className="hover:text-blue-600">
                    Programs
                  </a>
                </li>
                <li>
                  <a href="/gallery" className="hover:text-blue-600">
                    Gallery
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-blue-600">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-blue-600">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="hover:text-blue-600">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-blue-600">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/signup" className="hover:text-blue-600">
                    Sign Up
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Social Media */}
          {isSocial && (
            <div>
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
          )}
        </div>

        {/* Copyright */}
        <div
          className={`mt-8 border-t border-slate-200 pt-8 text-center text-sm ${textClass}`}
        >
          {footerText}
        </div>
      </div>
    </footer>
  )
}

export default Footer
