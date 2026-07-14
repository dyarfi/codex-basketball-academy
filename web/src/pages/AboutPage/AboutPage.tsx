import {
  Container,
  Badge,
  Card,
  Text,
  SimpleGrid,
  BackgroundImage,
} from '@mantine/core'
import {
  IconTrophy,
  IconTarget,
  IconRocket,
  IconFlame,
  IconHeart,
} from '@tabler/icons-react'

import DefaultLayout from 'src/layouts/DefaultLayout'
import { useAppTheme } from 'src/providers/ThemeProvider'

const AboutPage = () => {
  const { isDark } = useAppTheme()

  const pageClass = isDark
    ? 'bg-slate-950 text-slate-100'
    : 'bg-slate-50 text-slate-900'
  const textClass = isDark ? 'text-slate-300' : 'text-slate-600'
  const titleColor = isDark ? 'text-slate-100' : 'text-slate-800'
  const cardClass = isDark
    ? 'border border-slate-800 bg-slate-900/60 backdrop-blur shadow-lg hover:border-blue-500/50'
    : 'bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-500/50'

  const coreValues = [
    {
      title: 'Discipline',
      description:
        'Consistency in training, focus on detail, and respect for the game guidelines.',
      icon: <IconFlame className="h-6 w-6 text-orange-500" />,
      bg: isDark ? 'bg-orange-950/45' : 'bg-orange-50',
    },
    {
      title: 'Integrity',
      description:
        'Playing with honor, respecting referees, opponents, teammates, and coaches.',
      icon: <IconTarget className="h-6 w-6 text-blue-500" />,
      bg: isDark ? 'bg-blue-950/45' : 'bg-blue-50',
    },
    {
      title: 'Growth',
      description:
        'Commitment to continuous skill refinement, mental growth, and overall health.',
      icon: <IconRocket className="h-6 w-6 text-green-500" />,
      bg: isDark ? 'bg-green-950/45' : 'bg-green-50',
    },
    {
      title: 'Teamwork',
      description:
        'Lifting each other up, communicating clearly, and achieving greatness together.',
      icon: <IconHeart className="h-6 w-6 text-rose-500" />,
      bg: isDark ? 'bg-rose-950/45' : 'bg-rose-50',
    },
  ]

  const coaches = [
    {
      name: 'Marcus Carter',
      role: 'Founder & Head Coach',
      bio: 'Former D1 standout and pro basketball player with 15+ years of coaching experience. Passionate about player development and elite coaching strategies.',
      credentials: 'USA Basketball Gold Licensed Coach',
      avatar: '🏀',
    },
    {
      name: 'Sarah Jenkins',
      role: 'Elite Youth Coach',
      bio: 'Former NCAA champion coach specializing in youth technical base building, agility workouts, and court awareness skills.',
      credentials: 'FIBA Certified Coach',
      avatar: '⛹️‍♀️',
    },
    {
      name: 'Derrick Vance',
      role: 'Strength & Conditioning Coach',
      bio: 'Certified Athletic Trainer specializing in basketball-specific vertical growth, stamina building, and injury prevention.',
      credentials: 'CSCS (Certified Strength & Conditioning Specialist)',
      avatar: '⚡',
    },
  ]

  return (
    <DefaultLayout
      metaTags={{
        title: 'About Us',
        description:
          'Learn about our basketball academy, our founder, coaching staff, mission, and core values.',
      }}
    >
      <div
        className={`min-h-screen ${pageClass} transition-colors duration-300`}
      >
        {/* Hero Section */}
        <section
          className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 px-4 py-24 text-white"
          // style={{
          //   // backgroundImage:
          //   //   'url("https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=2200&q=85")',
          //   // backgroundImage: 'url("/images/assets/banner1.jpg")',
          //   backgroundPosition: 'top center',
          //   backgroundSize: 'cover',
          //   backgroundRepeat: 'no-repeat',
          //   backgroundBlendMode: 'darken',
          // }}
        >
          <div
          // style={{
          //   // backgroundImage:
          //   //   'url("https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=2200&q=85")',
          //   backgroundImage: 'url("/images/assets/banner1.jpg")',
          //   backgroundPosition: 'top center',
          //   backgroundSize: 'cover',
          //   backgroundRepeat: 'no-repeat',
          //   backgroundBlendMode: 'darken',
          // }}
          >
            <div className="grain-overlay absolute inset-0 opacity-10"></div>
            <div className="absolute right-0 top-0 h-96 w-96 -translate-y-12 translate-x-12 rounded-full bg-white opacity-5"></div>
            <Container size="lg" className="relative z-10">
              <div className="max-w-3xl">
                <span className="mb-4 inline-block rounded-full bg-blue-500/30 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-blue-200">
                  Forged By The Pros
                </span>
                <h1 className="mb-6 text-[48px] font-black uppercase leading-none md:text-[60px]">
                  ELEVATING YOUR GAME <br />
                  <span className="text-orange-400">ON & OFF THE COURT</span>
                </h1>
                <p className="max-w-2xl font-body-lg text-lg leading-relaxed text-blue-100 md:text-xl">
                  Since 2018, Basketball Academy has been dedicated to
                  cultivating talent, building character, and developing
                  Springfield's top-tier youth athletes.
                </p>
              </div>
            </Container>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="px-4 py-16">
          <Container size="lg">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              <Card
                className={`${cardClass} rounded-2xl p-8 transition duration-300`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <IconTarget size={24} />
                </div>
                <h2
                  className={`text-2xl font-bold uppercase ${titleColor} mb-4`}
                >
                  Our Mission
                </h2>
                <p className={`${textClass} font-body-md leading-relaxed`}>
                  To empower young athletes by teaching core fundamentals,
                  fostering competitive spirit, and building characters that
                  succeed both on and off the court. We aim to instill values
                  that transcend basketball.
                </p>
              </Card>

              <Card
                className={`${cardClass} rounded-2xl p-8 transition duration-300`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
                  <IconTrophy size={24} />
                </div>
                <h2
                  className={`text-2xl font-bold uppercase ${titleColor} mb-4`}
                >
                  Our Vision
                </h2>
                <p className={`${textClass} font-body-md leading-relaxed`}>
                  To build a world-class training ecosystem that produces
                  professional athletes, D1 collegiate standouts, and leaders of
                  tomorrow. We strive to be the standard of athletic training in
                  the region.
                </p>
              </Card>
            </SimpleGrid>
          </Container>
        </section>

        {/* Key Stats Section */}
        <section className={`${isDark ? 'bg-slate-900/40' : 'bg-blue-50/50'}`}>
          <BackgroundImage
            src="https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=2200&q=85"
            // radius="md"
            // opacity={0.5}
          >
            <Container size="lg" px={4} py={12}>
              <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
                <div className="p-4">
                  <div className="mb-2 font-headline-lg text-[56px] font-extrabold leading-none text-blue-600">
                    94%
                  </div>
                  <div
                    className={`font-label-lg text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                  >
                    Skill Increase Rate
                  </div>
                </div>
                <div className="border-y border-slate-200 p-4 md:border-x md:border-y-0 dark:border-slate-800">
                  <div className="mb-2 font-headline-lg text-[56px] font-extrabold leading-none text-orange-500">
                    12:1
                  </div>
                  <div
                    className={`font-label-lg text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                  >
                    Player-To-Coach Ratio
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2 font-headline-lg text-[56px] font-extrabold leading-none text-blue-600">
                    200+
                  </div>
                  <div
                    className={`font-label-lg text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                  >
                    D1 College Placements
                  </div>
                </div>
              </div>
            </Container>
          </BackgroundImage>
        </section>

        {/* Core Values Section */}
        <section className="px-4 py-16">
          <Container size="lg">
            <div className="mb-12 text-center">
              <span className="font-label-lg text-sm font-semibold uppercase tracking-wider text-blue-600">
                How We Play
              </span>
              <h2
                className={`mt-2 font-headline-md text-3xl font-bold uppercase md:text-4xl ${titleColor}`}
              >
                Our Core Values
              </h2>
            </div>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
              {coreValues.map((value, idx) => (
                <Card
                  key={idx}
                  className={`${cardClass} flex flex-col justify-between rounded-2xl p-6 transition duration-300`}
                >
                  <div>
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${value.bg}`}
                    >
                      {value.icon}
                    </div>
                    <h3 className={`text-xl font-bold ${titleColor} mb-2`}>
                      {value.title}
                    </h3>
                    <p className={`${textClass} font-body-sm leading-relaxed`}>
                      {value.description}
                    </p>
                  </div>
                </Card>
              ))}
            </SimpleGrid>
          </Container>
        </section>

        {/* Coaching Team Section */}
        <section
          className={`px-4 py-16 ${isDark ? 'bg-slate-900/30' : 'bg-slate-100/50'}`}
        >
          <Container size="lg">
            <div className="mb-12 text-center">
              <span className="font-label-lg text-sm font-semibold uppercase tracking-wider text-blue-600">
                Professional Guidance
              </span>
              <h2
                className={`mt-2 text-3xl font-black uppercase md:text-4xl ${titleColor}`}
              >
                Meet Our Coaches
              </h2>
            </div>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
              {coaches.map((coach, idx) => (
                <Card
                  key={idx}
                  className={`${cardClass} flex flex-col justify-between rounded-2xl p-6 text-center transition duration-300`}
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-blue-200 bg-blue-100 text-5xl shadow-inner dark:border-blue-900/50 dark:bg-blue-950">
                      {coach.avatar}
                    </div>
                    <h3
                      className={`text-xl font-bold ${titleColor} mb-1 font-headline-sm`}
                    >
                      {coach.name}
                    </h3>
                    <Badge
                      color="blue"
                      variant="light"
                      size="md"
                      mb="md"
                      className="font-semibold uppercase"
                    >
                      {coach.role}
                    </Badge>
                    <p
                      className={`${textClass} mb-4 font-body-sm leading-relaxed`}
                    >
                      "{coach.bio}"
                    </p>
                  </div>
                  <div className="mt-auto border-t border-slate-100 pt-4 dark:border-slate-800/80">
                    <Text
                      size="xs"
                      fw={500}
                      c="dimmed"
                      className="uppercase tracking-wider"
                    >
                      Credentials
                    </Text>
                    <Text
                      size="xs"
                      fw={600}
                      className={`${titleColor} font-body-sm`}
                    >
                      {coach.credentials}
                    </Text>
                  </div>
                </Card>
              ))}
            </SimpleGrid>
          </Container>
        </section>
      </div>
    </DefaultLayout>
  )
}

export default AboutPage
