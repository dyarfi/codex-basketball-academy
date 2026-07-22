import { useSettings } from 'src/providers/SettingsProvider'

export const Contact = ({ textClass }: { textClass?: string }) => {
  const { getSetting } = useSettings()
  const footerAddress = getSetting(
    'footer_address',
    '123 Academy Way, Springfield, IL 62701'
  )
  const footerPhone = getSetting('footer_phone', '+1 (555) 123-4567')
  const footerEmail = getSetting('footer_email', 'info@basketballacademy.com')
  return (
    <div>
      <h3 className="mb-4 font-semibold text-blue-600">Contact Us</h3>
      <div className={`space-y-2 text-sm ${textClass}`}>
        <p>{footerAddress}</p>
        <p>
          <a href={`tel:${footerPhone}`} className="hover:text-blue-600">
            {footerPhone}
          </a>
        </p>
        <p>
          <a href={`mailto:${footerEmail}`} className="hover:text-blue-600">
            {footerEmail}
          </a>
        </p>
      </div>
    </div>
  )
}
