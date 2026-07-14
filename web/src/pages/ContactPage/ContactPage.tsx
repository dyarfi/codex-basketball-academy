import {
  Container,
  Card,
  Text,
  SimpleGrid,
  Stack,
  Flex,
  Box,
} from '@mantine/core'
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconClock,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
} from '@tabler/icons-react'

import { ContactForm } from 'src/components/Forms/ContactForm'
import DefaultLayout from 'src/layouts/DefaultLayout'
import { useAppTheme } from 'src/providers/ThemeProvider'

const ContactPage = () => {
  const { isDark } = useAppTheme()

  const pageClass = isDark
    ? 'bg-slate-950 text-slate-100'
    : 'bg-slate-50 text-slate-900'
  const textClass = isDark ? 'text-slate-300' : 'text-slate-600'
  const titleColor = isDark ? 'text-slate-100' : 'text-slate-800'
  const cardClass = isDark
    ? 'border border-slate-800 bg-slate-900/60 backdrop-blur shadow-lg'
    : 'bg-white border border-slate-100 shadow-sm'

  return (
    <DefaultLayout
      metaTags={{
        title: 'Contact Us',
        description:
          'Get in touch with our Basketball Academy. Send us a message or find our training location.',
      }}
    >
      <div
        className={`min-h-screen ${pageClass} transition-colors duration-300`}
      >
        {/* Hero Header */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 px-4 py-20 text-white">
          <div className="grain-overlay absolute inset-0 opacity-10"></div>
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-12 translate-x-12 rounded-full bg-white opacity-5"></div>
          <Container size="lg" className="relative z-10 text-center">
            <span className="mb-4 inline-block rounded-full bg-blue-500/30 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-blue-200">
              Get in Touch
            </span>
            <h1 className="mb-4 text-[48px] font-bold uppercase leading-none md:text-[60px]">
              WE'D LOVE TO HEAR FROM YOU
            </h1>
            <p className="mx-auto max-w-2xl font-body-lg text-lg leading-relaxed text-blue-100 md:text-xl">
              Have questions about registration, class schedules, or private
              training? Shoot us a message or visit us in person.
            </p>
          </Container>
        </section>

        {/* Content Section */}
        <section className="px-4 py-16">
          <Container size="lg">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              {/* Left Column: Contact Info & Map */}
              <Stack gap="xl">
                <Card className={`${cardClass} rounded-2xl p-8`}>
                  <h2
                    className={`text-2xl font-bold uppercase ${titleColor} mb-6`}
                  >
                    Contact Details
                  </h2>

                  <Stack gap="lg">
                    <Flex align="flex-start" gap="md">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/60">
                        <IconMapPin size={20} />
                      </div>
                      <div>
                        <Text size="sm" fw={600} className={titleColor}>
                          Our Location
                        </Text>
                        <Text size="sm" className={textClass}>
                          123 Academy Way, Springfield, IL 62701
                        </Text>
                      </div>
                    </Flex>

                    <Flex align="flex-start" gap="md">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/60">
                        <IconPhone size={20} />
                      </div>
                      <div>
                        <Text size="sm" fw={600} className={titleColor}>
                          Call Us
                        </Text>
                        <Text size="sm" className={textClass}>
                          +1 (555) 123-4567
                        </Text>
                      </div>
                    </Flex>

                    <Flex align="flex-start" gap="md">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/60">
                        <IconMail size={20} />
                      </div>
                      <div>
                        <Text size="sm" fw={600} className={titleColor}>
                          Email Us
                        </Text>
                        <Text size="sm" className={textClass}>
                          info@basketballacademy.com
                        </Text>
                      </div>
                    </Flex>

                    <Flex align="flex-start" gap="md">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/60">
                        <IconClock size={20} />
                      </div>
                      <div>
                        <Text size="sm" fw={600} className={titleColor}>
                          Academy Hours
                        </Text>
                        <Text size="sm" className={textClass}>
                          Mon - Fri: 8:00 AM - 9:00 PM
                        </Text>
                        <Text size="sm" className={textClass}>
                          Sat - Sun: 9:00 AM - 6:00 PM
                        </Text>
                      </div>
                    </Flex>
                  </Stack>

                  {/* Social Follow */}
                  <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800/80">
                    <Text size="sm" fw={600} className={`${titleColor} mb-4`}>
                      Follow Us On Social Media
                    </Text>
                    <Flex gap="md">
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-blue-600 hover:text-white dark:bg-slate-800/85 dark:text-slate-400"
                      >
                        <IconBrandFacebook size={20} />
                      </a>
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-blue-500 hover:text-white dark:bg-slate-800/85 dark:text-slate-400"
                      >
                        <IconBrandTwitter size={20} />
                      </a>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-pink-600 hover:text-white dark:bg-slate-800/85 dark:text-slate-400"
                      >
                        <IconBrandInstagram size={20} />
                      </a>
                    </Flex>
                  </div>
                </Card>

                {/* Map Mock Section */}
                <Card
                  className={`${cardClass} relative h-72 overflow-hidden rounded-2xl p-0`}
                >
                  <Box
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-89.6501,39.7817,13,0/600x300?access_token=mock')`,
                      background:
                        'radial-gradient(circle, #3b82f6 10%, #1e3a8a 100%)',
                    }}
                  />
                  {/* Styled grid-pattern/court-pattern backdrop for the mockup map */}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <Stack
                    justify="flex-end"
                    p="lg"
                    className="absolute inset-0 z-10 text-white"
                  >
                    <Flex align="center" gap="xs">
                      <IconMapPin size={18} className="text-orange-500" />
                      <Text fw={700}>Springfield Training Hub</Text>
                    </Flex>
                    <Text size="xs" className="opacity-90">
                      123 Academy Way, Springfield, IL 62701
                    </Text>
                  </Stack>
                </Card>
              </Stack>

              {/* Right Column: Contact Form */}
              <div className="flex h-full flex-col justify-start">
                <ContactForm />
              </div>
            </SimpleGrid>
          </Container>
        </section>
      </div>
    </DefaultLayout>
  )
}

export default ContactPage
