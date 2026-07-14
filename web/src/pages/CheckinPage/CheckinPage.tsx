import { useEffect, useState } from 'react'

import { useParams, navigate } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

const GET_INVITATION = gql`
  query InvitationLink($code: String!) {
    invitationLinkPublic(code: $code) {
      id
      url
      purpose
      expiresAt
      useCount
      maxUses
      usedAt
    }
  }
`

const USE_INVITATION = gql`
  mutation UseInvitationLink($code: String!) {
    useInvitationLink(code: $code)
  }
`

const CheckinPage = () => {
  const { code } = useParams()
  const { currentUser } = useAuth()
  const [message, setMessage] = useState('Checking you in...')

  const { data, loading, error } = useQuery(GET_INVITATION, {
    variables: { code },
    skip: !code,
  })

  const [useInvitation] = useMutation(USE_INVITATION)
  useEffect(() => {
    if (error) {
      setMessage(
        // `There is something wrong with the system... ${error?.cause?.extensions?.originalError?.message}`
        `There is something wrong with the system... ${error.graphQLErrors?.[0]?.extensions?.originalError?.message}`
      )
    }
  }, [error])
  useEffect(() => {
    if (loading || error || !data?.invitationLinkPublic) return

    const checkAndUse = async () => {
      const invite = data.invitationLinkPublic
      const isExpired =
        invite.expiresAt && new Date(invite.expiresAt) < new Date()
      const isOverLimit = invite.maxUses && invite.useCount >= invite.maxUses
      let inviteUrl = invite.url

      if (isExpired) {
        setMessage('This invitation link has expired.')
        return
      }

      if (isOverLimit) {
        setMessage(
          'This invitation link has already been used the maximum number of times.'
        )
        return
      }

      if (!inviteUrl) {
        inviteUrl = 'signup'
      }

      try {
        await useInvitation({ variables: { code } })
        setMessage('Invitation accepted! Redirecting...')
        setTimeout(() => {
          // Redirect to registration, onboarding, etc.
          navigate(`/${inviteUrl}?invite=${code}`)
        }, 1500)
      } catch (e) {
        setMessage('Failed to use invitation link.')
      }
    }
    checkAndUse()
  }, [data, loading, error, useInvitation, code])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="mb-4 text-2xl font-bold">
        Hi, {currentUser?.profile?.firstName}
      </h1>
      <h1 className="mb-4 text-2xl font-bold">We are checking you in</h1>
      <p>{message}</p>
    </div>
  )
}

export default CheckinPage
