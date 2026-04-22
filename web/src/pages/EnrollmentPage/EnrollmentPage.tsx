import { useEffect, useMemo, useState } from 'react'

import { Link, navigate, routes, useLocation } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { CREATE_ENROLLMENT } from 'src/graphql/enrollments-queries'
import { GET_PROGRAM } from 'src/graphql/programs-queries'

type EnrollmentFormData = {
  playerFirstName: string
  playerLastName: string
  playerDateOfBirth: string
  playerEmail: string
  playerPhone: string
  parentFirstName: string
  parentLastName: string
  parentEmail: string
  parentPhone: string
  emergencyContactName: string
  emergencyContactPhone: string
  relationship: string
  termsAccepted: boolean
}

type ProgramClass = {
  id: string
  name: string
  scheduleDay: string
  scheduleTime: string
  capacity: number
  currentEnrollment: number
}

type Program = {
  id: string
  name: string
  level: string
  pricePerMonth: number
  classes: ProgramClass[]
}

const defaultErrors: Record<string, string> = {}

const EnrollmentPage = () => {
  const location = useLocation()
  const { currentUser } = useAuth()
  const searchParams = new URLSearchParams(location.search)
  const programId = searchParams.get('program') || ''
  const classesParam = searchParams.get('classes') || ''

  const [step, setStep] = useState(1)
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>(defaultErrors)

  const [formData, setFormData] = useState<EnrollmentFormData>({
    playerFirstName: currentUser?.profile?.firstName || '',
    playerLastName: currentUser?.profile?.lastName || '',
    playerDateOfBirth: currentUser?.profile?.dateOfBirth
      ? new Date(currentUser.profile.dateOfBirth).toISOString().slice(0, 10)
      : '',
    playerEmail: currentUser?.email || '',
    playerPhone: currentUser?.profile?.phoneNumber || '',
    parentFirstName: '',
    parentLastName: '',
    parentEmail: '',
    parentPhone: '',
    emergencyContactName: currentUser?.profile?.emergencyContactName || '',
    emergencyContactPhone: currentUser?.profile?.emergencyContactPhone || '',
    relationship: currentUser?.profile?.relationshipToPlayer || '',
    termsAccepted: false,
  })

  useEffect(() => {
    if (!currentUser) {
      return
    }

    setFormData((current) => ({
      ...current,
      playerFirstName: current.playerFirstName || currentUser.profile?.firstName || '',
      playerLastName: current.playerLastName || currentUser.profile?.lastName || '',
      playerDateOfBirth:
        current.playerDateOfBirth ||
        (currentUser.profile?.dateOfBirth
          ? new Date(currentUser.profile.dateOfBirth).toISOString().slice(0, 10)
          : ''),
      playerEmail: current.playerEmail || currentUser.email || '',
      playerPhone: current.playerPhone || currentUser.profile?.phoneNumber || '',
      emergencyContactName:
        current.emergencyContactName ||
        currentUser.profile?.emergencyContactName ||
        '',
      emergencyContactPhone:
        current.emergencyContactPhone ||
        currentUser.profile?.emergencyContactPhone ||
        '',
      relationship:
        current.relationship ||
        currentUser.profile?.relationshipToPlayer ||
        (currentUser.role === 'PARENT' ? 'Parent' : 'Guardian'),
    }))
  }, [currentUser])

  const { data, loading, error } = useQuery<{ program: Program | null }>(GET_PROGRAM, {
    variables: { id: programId },
    skip: !programId,
  })

  const selectedClassIds = useMemo(
    () => classesParam.split(',').map((item) => item.trim()).filter(Boolean),
    [classesParam]
  )

  const program = data?.program
  const selectedClasses = useMemo(() => {
    if (!program) {
      return []
    }

    return program.classes.filter((classItem) =>
      selectedClassIds.includes(classItem.id)
    )
  }, [program, selectedClassIds])

  const [createEnrollment, { loading: isSubmitting }] = useMutation(
    CREATE_ENROLLMENT
  )

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (stepNum === 1) {
      if (!formData.playerFirstName.trim()) {
        newErrors.playerFirstName = 'First name is required'
      }
      if (!formData.playerLastName.trim()) {
        newErrors.playerLastName = 'Last name is required'
      }
      if (!formData.playerDateOfBirth) {
        newErrors.playerDateOfBirth = 'Date of birth is required'
      }
      if (!formData.playerEmail.trim()) {
        newErrors.playerEmail = 'Email is required'
      }
      if (!formData.playerPhone.trim()) {
        newErrors.playerPhone = 'Phone number is required'
      }
    } else if (stepNum === 2) {
      if (!formData.parentFirstName.trim()) {
        newErrors.parentFirstName = 'Parent first name is required'
      }
      if (!formData.parentLastName.trim()) {
        newErrors.parentLastName = 'Parent last name is required'
      }
      if (!formData.parentEmail.trim()) {
        newErrors.parentEmail = 'Parent email is required'
      }
      if (!formData.parentPhone.trim()) {
        newErrors.parentPhone = 'Parent phone is required'
      }
      if (!formData.emergencyContactName.trim()) {
        newErrors.emergencyContactName = 'Emergency contact name is required'
      }
      if (!formData.emergencyContactPhone.trim()) {
        newErrors.emergencyContactPhone = 'Emergency contact phone is required'
      }
    } else if (stepNum === 3) {
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the terms and conditions'
      }
      if (!currentUser?.id) {
        newErrors.submit = 'You must be logged in to enroll.'
      }
      if (!programId || selectedClasses.length === 0) {
        newErrors.submit = 'Program and class selection are required.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((current) => current + 1)
    }
  }

  const handlePrevious = () => {
    setStep((current) => current - 1)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((current) => ({
      ...current,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(3) || !currentUser?.id) {
      return
    }

    try {
      await Promise.all(
        selectedClasses.map((classItem) =>
          createEnrollment({
            variables: {
              input: {
                userId: currentUser.id,
                classId: classItem.id,
                programId,
                enrollmentDate: new Date().toISOString(),
                status: 'ACTIVE',
              },
            },
          })
        )
      )

      setEnrollmentSuccess(true)
      setTimeout(() => {
        navigate(routes.dashboard())
      }, 2000)
    } catch (mutationError) {
      const message =
        mutationError instanceof Error ? mutationError.message : 'Enrollment failed'

      setErrors({
        submit: message.includes('Unique constraint')
          ? 'You are already enrolled in one of the selected classes.'
          : message,
      })
    }
  }

  const isProgramSelectionInvalid =
    !programId || !classesParam || (!loading && (!program || selectedClasses.length === 0))

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading enrollment details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          Failed to load enrollment details. {error.message}
        </div>
      </div>
    )
  }

  if (isProgramSelectionInvalid) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="mx-auto flex h-16 max-w-4xl items-center px-4 sm:px-6 lg:px-8">
            <Link to={routes.home()} className="text-2xl font-bold text-blue-600">
              🏀 Basketball Academy
            </Link>
          </div>
        </nav>

        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Enrollment Selection Missing
          </h1>
          <p className="mb-6 text-gray-600">
            Choose a program and at least one class before starting enrollment.
          </p>
          <Link
            to={routes.ProgramsListPage()}
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Programs
          </Link>
        </div>
      </div>
    )
  }

  if (enrollmentSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-md rounded-lg bg-white p-12 text-center shadow-lg">
          <div className="mb-6 text-6xl">✓</div>
          <h1 className="mb-4 text-3xl font-bold text-green-600">
            Enrollment Successful!
          </h1>
          <p className="mb-6 text-gray-600">
            Your enrollment has been recorded for {program?.name}. We&apos;re
            redirecting you back to your dashboard now.
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to={routes.home()} className="text-2xl font-bold text-blue-600">
            🏀 Basketball Academy
          </Link>
          <Link
            to={routes.ProgramsDetailPage({ id: programId })}
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            Back to Program
          </Link>
        </div>
      </nav>

      <main className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">Enrollment</h1>
            <p className="mt-2 text-gray-600">
              {program?.name} • {selectedClasses.length} class
              {selectedClasses.length === 1 ? '' : 'es'} selected
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {selectedClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="rounded-lg border border-blue-100 bg-blue-50 p-4"
                >
                  <div className="font-semibold text-gray-900">{classItem.name}</div>
                  <div className="text-sm text-gray-600">
                    {classItem.scheduleDay} at {classItem.scheduleTime}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex flex-1 items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                      stepNum <= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {stepNum < step ? '✓' : stepNum}
                  </div>
                  {stepNum < 4 && (
                    <div
                      className={`mx-2 h-1 flex-1 ${
                        stepNum < step ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>Player Info</span>
              <span>Parent Info</span>
              <span>Review</span>
              <span>Complete</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-lg bg-white p-8 shadow-lg">
            {errors.submit && (
              <div className="mb-6 rounded-md bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800">{errors.submit}</p>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Player Information
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="playerFirstName"
                        value={formData.playerFirstName}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.playerFirstName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.playerFirstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="playerLastName"
                        value={formData.playerLastName}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.playerLastName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.playerLastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="playerDateOfBirth"
                      value={formData.playerDateOfBirth}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.playerDateOfBirth && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.playerDateOfBirth}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Player Email *
                      </label>
                      <input
                        type="email"
                        name="playerEmail"
                        value={formData.playerEmail}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.playerEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.playerEmail}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="playerPhone"
                        value={formData.playerPhone}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.playerPhone && (
                        <p className="mt-1 text-sm text-red-600">{errors.playerPhone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Parent / Guardian Information
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="parentFirstName"
                        value={formData.parentFirstName}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.parentFirstName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.parentFirstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="parentLastName"
                        value={formData.parentLastName}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.parentLastName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.parentLastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.parentEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.parentEmail}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.parentPhone && (
                        <p className="mt-1 text-sm text-red-600">{errors.parentPhone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Emergency Contact Name *
                      </label>
                      <input
                        type="text"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.emergencyContactName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.emergencyContactName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Emergency Contact Phone *
                      </label>
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.emergencyContactPhone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.emergencyContactPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Relationship to Player
                    </label>
                    <select
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Parent">Parent</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Review & Confirm
                </h2>

                <div className="space-y-6">
                  <div className="rounded-lg bg-gray-50 p-6">
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">
                      Enrollment Summary
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <span className="font-semibold">Program:</span> {program?.name}
                      </p>
                      <p>
                        <span className="font-semibold">Player:</span>{' '}
                        {formData.playerFirstName} {formData.playerLastName}
                      </p>
                      <p>
                        <span className="font-semibold">Parent/Guardian:</span>{' '}
                        {formData.parentFirstName} {formData.parentLastName}
                      </p>
                      <p>
                        <span className="font-semibold">Classes:</span>{' '}
                        {selectedClasses.map((item) => item.name).join(', ')}
                      </p>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      I confirm the enrollment details are accurate and accept the
                      academy terms and participation requirements.
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="text-sm text-red-600">{errors.termsAccepted}</p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {isSubmitting ? 'Submitting...' : 'Complete Enrollment'}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default EnrollmentPage
