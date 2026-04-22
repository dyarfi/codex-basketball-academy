import { useMemo, useState } from 'react'

import { Link, navigate, routes, useParams } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import { GET_PROGRAM, GET_PROGRAMS } from 'src/graphql/programs-queries'

type ProgramClass = {
  id: string
  name: string
  description?: string | null
  scheduleDay: string
  scheduleTime: string
  capacity: number
  currentEnrollment: number
  coachName?: string | null
  startDate: string
  endDate?: string | null
  coach?: {
    profile?: {
      firstName?: string | null
      lastName?: string | null
    } | null
  } | null
}

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
  classes: ProgramClass[]
}

const levelColors = {
  BEGINNER: 'bg-green-100 text-green-800',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
  ADVANCED: 'bg-red-100 text-red-800',
  ELITE: 'bg-purple-100 text-purple-800',
}

const ProgramDetailsPage = () => {
  const { id } = useParams()
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])

  const {
    data,
    loading,
    error,
  } = useQuery<{ program: Program | null }>(GET_PROGRAM, {
    variables: { id },
    skip: !id,
  })
  const { data: programsData } = useQuery<{ programs: Program[] }>(GET_PROGRAMS)

  const program = data?.program

  const relatedPrograms = useMemo(() => {
    const allPrograms = programsData?.programs ?? []
    return allPrograms
      .filter((item) => item.id !== id && item.isActive)
      .slice(0, 3)
  }, [programsData, id])

  const toggleClass = (classId: string) => {
    setSelectedClasses((current) =>
      current.includes(classId)
        ? current.filter((item) => item !== classId)
        : [...current, classId]
    )
  }

  const handleEnroll = () => {
    if (!program || selectedClasses.length === 0) {
      return
    }

    navigate(
      `${routes.EnrollmentPage()}?program=${encodeURIComponent(program.id)}&classes=${encodeURIComponent(selectedClasses.join(','))}`
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading program details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-4xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          Failed to load program details. {error.message}
        </div>
      </div>
    )
  }

  if (!program || !program.isActive) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <Link to={routes.home()} className="text-2xl font-bold text-blue-600">
              🏀 Basketball Academy
            </Link>
          </div>
        </nav>
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Program Not Found</h1>
          <Link
            to={routes.ProgramsListPage()}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Back to Programs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to={routes.home()} className="text-2xl font-bold text-blue-600">
            🏀 Basketball Academy
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to={routes.ProgramsListPage()}
              className="font-medium text-gray-700 hover:text-blue-600"
            >
              Programs
            </Link>
            <Link
              to={routes.dashboard()}
              className="font-medium text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <div className="border-b bg-white px-4 py-4">
          <div className="mx-auto max-w-7xl text-sm text-gray-600">
            <Link
              to={routes.ProgramsListPage()}
              className="text-blue-600 hover:text-blue-700"
            >
              Programs
            </Link>
            {' > '}
            <span className="text-gray-900">{program.name}</span>
          </div>
        </div>

        <section className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-12 text-white">
          <div className="mx-auto flex max-w-7xl items-start justify-between gap-8">
            <div>
              <h1 className="mb-4 text-4xl font-bold">{program.name}</h1>
              <span
                className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${levelColors[program.level]}`}
              >
                {program.level}
              </span>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">${program.pricePerMonth}</div>
              <div className="text-blue-100">/month</div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="rounded-xl bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Program Overview
              </h2>
              <p className="leading-7 text-gray-700">
                {program.description || 'No description available yet.'}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {program.durationWeeks} weeks
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Age Range</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {program.minAge ?? 'Any'} - {program.maxAge ?? 'Any'}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Program Capacity</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {program.capacity} players
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Available Classes
                  </h2>
                  <p className="text-gray-600">
                    Choose one or more class groups before continuing to enrollment.
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  {program.classes.length} classes
                </span>
              </div>

              {program.classes.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-gray-600">
                  No active classes are attached to this program yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {program.classes.map((classItem) => {
                    const coachDisplayName =
                      classItem.coachName ||
                      `${classItem.coach?.profile?.firstName || ''} ${classItem.coach?.profile?.lastName || ''}`.trim() ||
                      'Coach TBA'
                    const isSelected = selectedClasses.includes(classItem.id)
                    const availableSeats =
                      classItem.capacity - classItem.currentEnrollment

                    return (
                      <label
                        key={classItem.id}
                        className={`block cursor-pointer rounded-xl border p-5 transition ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex gap-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleClass(classItem.id)}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                  {classItem.name}
                                </h3>
                                <p className="mt-1 text-gray-600">
                                  {classItem.description || 'Class details available on enrollment.'}
                                </p>
                              </div>
                              <span
                                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                  availableSeats <= 0
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-green-100 text-green-700'
                                }`}
                              >
                                {availableSeats > 0
                                  ? `${availableSeats} seats left`
                                  : 'Full'}
                              </span>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-700 md:grid-cols-2">
                              <div>
                                <span className="font-semibold">Schedule:</span>{' '}
                                {classItem.scheduleDay} at {classItem.scheduleTime}
                              </div>
                              <div>
                                <span className="font-semibold">Coach:</span>{' '}
                                {coachDisplayName}
                              </div>
                              <div>
                                <span className="font-semibold">Starts:</span>{' '}
                                {new Date(classItem.startDate).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-semibold">Ends:</span>{' '}
                                {classItem.endDate
                                  ? new Date(classItem.endDate).toLocaleDateString()
                                  : 'TBD'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Ready to Enroll?
              </h2>
              <p className="mb-6 text-gray-600">
                Pick your preferred classes and continue to the enrollment form.
              </p>
              <button
                onClick={handleEnroll}
                disabled={selectedClasses.length === 0}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Continue to Enrollment
              </button>
              {selectedClasses.length === 0 && (
                <p className="mt-3 text-sm text-amber-600">
                  Select at least one class to continue.
                </p>
              )}
            </section>

            {relatedPrograms.length > 0 && (
              <section className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Related Programs
                </h2>
                <div className="space-y-4">
                  {relatedPrograms.map((item) => (
                    <Link
                      key={item.id}
                      to={routes.ProgramsDetailPage({ id: item.id })}
                      className="block rounded-lg border border-gray-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.level}</div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}

export default ProgramDetailsPage
