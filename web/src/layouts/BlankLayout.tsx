import type { ReactNode } from 'react'

import { AppShell, Box } from '@mantine/core'

import { useLocation } from '@redwoodjs/router'
import { Metadata, Head } from '@redwoodjs/web'
import { Toaster } from '@redwoodjs/web/toast'

const APP_NAME = process.env.APP_NAME || ''
const APP_URL = process.env.APP_URL || ''

type BlankLayoutProps = {
  children?: ReactNode
  metaTags?: Record<string, string>
}

const BlankLayout = ({ children, metaTags }: BlankLayoutProps) => {
  const location = useLocation()

  return (
    <>
      {/* Redwood Head */}
      <Head>
        <link rel="canonical" href={location.href} />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&amp;family=Oswald:wght@500;600;700&amp;display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
          rel="stylesheet"
        />
        <style>
          {`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .grain-overlay {
            background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
            opacity: 0.05;
        }
        .diagonal-cut {
            clip-path: polygon(0 0, 100% 0, 100% 85%, 0% 100%);
        }
        .card-hover-effect:hover .program-image {
            transform: scale(1.05);
        }`}
        </style>
      </Head>
      <Metadata
        og={{
          site_name: APP_NAME,
          image: APP_URL + '/favicon.png',
          url: location.href,
        }}
        {...metaTags}
      />
      <AppShell>
        <AppShell.Main>
          <Box>{children}</Box>
          <Toaster
            toastOptions={{
              className: 'rw-toast',
              duration: 4000,
            }}
          />
        </AppShell.Main>
      </AppShell>
    </>
  )
}

export default BlankLayout
