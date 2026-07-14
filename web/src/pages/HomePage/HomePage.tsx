import { useState } from 'react'

import { Container } from '@mantine/core'

import { Link } from '@redwoodjs/router'

import Footer from 'src/components/Footer/Footer'
import { ContactForm } from 'src/components/Forms/ContactForm'
import Navigation from 'src/components/Navigation/Navigation'
import DefaultLayout from 'src/layouts/DefaultLayout'
import { useAppTheme } from 'src/providers/ThemeProvider'

const HomePage = () => {
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const { isDark } = useAppTheme()

  const testimonials = [
    {
      name: 'Michael Johnson',
      role: 'Player',
      text: "The coaches here are incredible! I've improved my skills so much in just 3 months.",
      image: '🏀',
    },
    {
      name: 'Sarah Williams',
      role: 'Parent',
      text: 'My son loves coming to classes. The program is well-structured and the coaches are very supportive.',
      image: '👨‍👩‍👦',
    },
    {
      name: 'James Chen',
      role: 'Player',
      text: "Best basketball training academy I've ever been to. Highly recommended for anyone serious about basketball.",
      image: '🏀',
    },
  ]

  const programs = [
    { level: 'Beginner', description: 'Perfect for newcomers', icon: '🟢' },
    { level: 'Intermediate', description: 'Build on fundamentals', icon: '🟡' },
    { level: 'Advanced', description: 'Competitive training', icon: '🔴' },
    { level: 'Elite', description: 'Professional prep', icon: '⭐' },
  ]

  const pageClass = isDark
    ? 'bg-slate-950 text-slate-100'
    : 'bg-white text-gray-900'
  const mutedTextClass = isDark ? 'text-slate-300' : 'text-gray-600'
  const headingClass = isDark ? 'text-slate-50' : 'text-gray-900'
  const cardClass = isDark
    ? 'border border-slate-800 bg-slate-900 shadow-lg'
    : 'bg-white shadow hover:shadow-lg'
  const sectionAltClass = isDark ? 'bg-slate-900' : 'bg-gray-50'
  const softAltClass = isDark ? 'bg-slate-900/60' : 'bg-blue-50'

  return (
    <DefaultLayout
      metaTags={{
        title: 'Home of our Basketball Academy Website',
        description: 'Basketball Academy in your town',
      }}
    >
      <div className={`min-h-screen ${pageClass}`}>
        <main>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-20 text-white">
            <div className="mx-auto max-w-7xl text-center">
              <h1 className="mb-6 text-5xl font-bold md:text-6xl">
                Elevate Your Basketball Game
              </h1>
              <p className="mb-8 text-xl text-blue-100 md:text-2xl">
                Train with experienced coaches and join a community of
                basketball enthusiasts
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/programs"
                  className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  Explore Programs
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg border-2 border-white bg-blue-500 px-8 py-3 font-semibold text-white transition hover:bg-blue-400"
                >
                  Get Started Now
                </Link>
              </div>
            </div>
          </section>

          {/* Programs Overview */}
          <section className={`px-4 py-16 ${sectionAltClass}`}>
            <div className="mx-auto max-w-7xl">
              <h2
                className={`mb-12 text-center text-4xl font-bold ${headingClass}`}
              >
                Our Programs
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {programs.map((program) => (
                  <div
                    key={program.level}
                    className={`rounded-lg p-6 text-center transition ${cardClass}`}
                  >
                    <div className="mb-4 text-4xl">{program.icon}</div>
                    <h3 className={`mb-2 text-xl font-bold ${headingClass}`}>
                      {program.level}
                    </h3>
                    <p className={mutedTextClass}>{program.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link
                  to="/programs"
                  className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  View All Programs
                </Link>
              </div>
            </div>
          </section>

          {/* Features Highlights */}
          <section className="px-4 py-16">
            <div className="mx-auto max-w-7xl">
              <h2
                className={`mb-12 text-center text-4xl font-bold ${headingClass}`}
              >
                Why Choose Us
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-4 text-5xl">👨‍🏫</div>
                  <h3 className={`mb-3 text-xl font-bold ${headingClass}`}>
                    Expert Coaches
                  </h3>
                  <p className={mutedTextClass}>
                    Learn from experienced basketball professionals with
                    certified coaching credentials and years of playing and
                    teaching experience.
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-4 text-5xl">📊</div>
                  <h3 className={`mb-3 text-xl font-bold ${headingClass}`}>
                    Skill Tracking
                  </h3>
                  <p className={mutedTextClass}>
                    Monitor your progress with detailed skill assessments,
                    player statistics, and personalized feedback from your
                    coaches.
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-4 text-5xl">🤝</div>
                  <h3 className={`mb-3 text-xl font-bold ${headingClass}`}>
                    Community
                  </h3>
                  <p className={mutedTextClass}>
                    Join a vibrant community of athletes at all levels, make
                    friends, and grow together as basketball enthusiasts.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className={`px-4 py-16 ${softAltClass}`}>
            <div className="mx-auto max-w-7xl">
              <h2
                className={`mb-12 text-center text-4xl font-bold ${headingClass}`}
              >
                How It Works
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {[
                  {
                    number: '1',
                    title: 'Sign Up',
                    description: 'Create your account and choose your role',
                  },
                  {
                    number: '2',
                    title: 'Browse Programs',
                    description: 'Explore programs suited to your level',
                  },
                  {
                    number: '3',
                    title: 'Enroll',
                    description: 'Select classes and complete enrollment',
                  },
                  {
                    number: '4',
                    title: 'Train & Grow',
                    description: 'Start your basketball journey today',
                  },
                ].map((step) => (
                  <div key={step.number} className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                      {step.number}
                    </div>
                    <h3 className={`mb-2 text-lg font-bold ${headingClass}`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${mutedTextClass}`}>
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="px-4 py-16">
            <div className="mx-auto max-w-4xl">
              <h2
                className={`mb-12 text-center text-4xl font-bold ${headingClass}`}
              >
                What Our Members Say
              </h2>
              <div className={`rounded-lg p-8 ${cardClass}`}>
                <div className="text-center">
                  <div className="mb-4 text-5xl">
                    {testimonials[testimonialIndex].image}
                  </div>
                  <blockquote
                    className={`mb-4 text-xl italic ${isDark ? 'text-slate-200' : 'text-gray-700'}`}
                  >
                    "{testimonials[testimonialIndex].text}"
                  </blockquote>
                  <p className={`font-bold ${headingClass}`}>
                    {testimonials[testimonialIndex].name}
                  </p>
                  <p className={`text-sm ${mutedTextClass}`}>
                    {testimonials[testimonialIndex].role}
                  </p>
                </div>
                <div className="mt-6 flex justify-center gap-4">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setTestimonialIndex(index)}
                      className={`h-3 w-3 rounded-full transition ${
                        index === testimonialIndex
                          ? 'bg-blue-600'
                          : 'bg-gray-300'
                      }`}
                      aria-label={`Testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-blue-600 px-4 py-16 text-white">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-4xl font-bold">Ready to Get Started?</h2>
              <p className="mb-8 text-xl text-blue-100">
                Join our community and begin your basketball training journey
                today
              </p>
              <Link
                to="/signup"
                className="inline-block rounded-lg bg-white px-10 py-4 text-lg font-bold text-blue-600 transition hover:bg-blue-50"
              >
                Sign Up Now
              </Link>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-blue-600 px-4 py-16 text-white">
            <Container>
              <ContactForm />
            </Container>
          </section>
        </main>
      </div>
    </DefaultLayout>
  )
}

export default HomePage
