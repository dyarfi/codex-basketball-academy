import { useMemo, useState } from 'react'

import { Link, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import Footer from 'src/components/Footer/Footer'
import Navigation from 'src/components/Navigation/Navigation'
import { GET_PROGRAMS } from 'src/graphql/programs-queries'
import DefaultLayout from 'src/layouts/DefaultLayout'

type Program = {
  id: string
  name: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE'
  description?: string | null
  pricePerMonth: number
  durationWeeks: number
  minAge?: number | null
  maxAge?: number | null
  capacity: number
  isActive: boolean
}

const levelColors = {
  BEGINNER: 'bg-green-100 text-green-800 border-green-300',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  ADVANCED: 'bg-red-100 text-red-800 border-red-300',
  ELITE: 'bg-purple-100 text-purple-800 border-purple-300',
}

const levelIcons = {
  BEGINNER: '🟢',
  INTERMEDIATE: '🟡',
  ADVANCED: '🔴',
  ELITE: '⭐',
}

const ProgramsListPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL')
  const { data, loading, error } = useQuery<{ programs: Program[] }>(
    GET_PROGRAMS
  )

  const programs = data?.programs ?? []

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      if (!program.isActive) {
        return false
      }

      const query = searchTerm.trim().toLowerCase()
      const matchesSearch =
        query.length === 0 ||
        program.name.toLowerCase().includes(query) ||
        program.description?.toLowerCase().includes(query)
      const matchesLevel =
        selectedLevel === 'ALL' || program.level === selectedLevel

      return matchesSearch && matchesLevel
    })
  }, [programs, searchTerm, selectedLevel])

  return (
    <DefaultLayout
      metaTags={{
        title: 'Programs of our Basketball Academy Website',
        description: 'Basketball Academy in your town',
      }}
    >
      <main>
        <section className="bg-blue-600 px-4 py-12 text-white">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-4 text-4xl font-bold">Our Basketball Programs</h1>
            <p className="text-lg text-blue-100">
              Browse live academy programs and find the right fit for your next
              season.
            </p>
          </div>
        </section>

        {/* <section className="top-16"> */}
        <section className="sticky top-0 z-40 bg-white px-4 py-6 shadow-sm">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Search Programs
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="level"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Filter by Level
              </label>
              <select
                id="level"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="ELITE">Elite</option>
              </select>
            </div>
          </div>
        </section>

        <section className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            {loading && (
              <div className="py-12 text-center text-xl text-gray-500">
                Loading programs...
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
                Failed to load programs. {error.message}
              </div>
            )}

            {!loading && !error && filteredPrograms.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-xl text-gray-500">
                  No programs found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedLevel('ALL')
                  }}
                  className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {!loading && !error && filteredPrograms.length > 0 && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPrograms.map((program) => (
                  <article
                    key={program.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                      <div className="mb-4 flex items-center justify-between">
                        <span
                          className={`rounded-full border px-3 py-1 text-sm font-bold ${levelColors[program.level]}`}
                        >
                          {levelIcons[program.level]} {program.level}
                        </span>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            ${program.pricePerMonth}
                          </div>
                          <div className="text-sm text-blue-100">/month</div>
                        </div>
                      </div>
                      <h2 className="mb-2 text-2xl font-bold">
                        {program.name}
                      </h2>
                      <p className="line-clamp-2 text-blue-100">
                        {program.description || 'No description available yet.'}
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="mb-6 space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-semibold text-gray-900">
                            {program.durationWeeks} weeks
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Age Range</span>
                          <span className="font-semibold text-gray-900">
                            {program.minAge ?? 'Any'} -{' '}
                            {program.maxAge ?? 'Any'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Capacity</span>
                          <span className="font-semibold text-gray-900">
                            {program.capacity} players
                          </span>
                        </div>
                      </div>

                      <Link
                        to={routes.ProgramsDetailPage({ id: program.id })}
                        className="block w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                      >
                        View Program Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </DefaultLayout>
  )
}

export default ProgramsListPage
