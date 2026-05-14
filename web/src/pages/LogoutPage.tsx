import { useEffect } from 'react'

import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

const LogoutPage = () => {
  const { isAuthenticated, logOut } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      logOut()
    }
    return navigate(routes.login(), { replace: true })
  }, [isAuthenticated, logOut])

  return (
    <>
      <Metadata title="Logging out.." />
      <div>logging out..</div>
    </>
  )
}

export default LogoutPage
