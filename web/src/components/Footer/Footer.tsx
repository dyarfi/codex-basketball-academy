import { useSettings } from 'src/providers/SettingsProvider'
import { useAppTheme } from 'src/providers/ThemeProvider'

import { Contact } from './Component/Contact'
import { Links } from './Component/Links'
import { Social } from './Component/Social'

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
          {isContact && <Contact textClass={textClass} />}

          {/* Quick Links */}
          {isLinks && <Links textClass={textClass} />}

          {/* Social Media */}
          {isSocial && <Social textClass={textClass} />}
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
