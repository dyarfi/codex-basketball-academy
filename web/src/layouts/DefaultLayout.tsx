import type { ReactNode } from 'react'

import { AppShell, Box } from '@mantine/core'
import { useHeadroom } from '@mantine/hooks'

import { useLocation } from '@redwoodjs/router'
import { Metadata, Head } from '@redwoodjs/web'
import { Toaster } from '@redwoodjs/web/toast'

import Footer from 'src/components/Footer/Footer'
import Navigation from 'src/components/Navigation/Navigation'
import { AnnouncementProvider } from 'src/providers/AnnouncementProvider'

const APP_NAME = process.env.APP_NAME || ''
const APP_URL = process.env.APP_URL || ''

type PublicLayoutProps = {
  children?: ReactNode
  headerChildren?: ReactNode
  metaTags?: Record<string, string>
}

const DefaultLayout = ({
  children,
  headerChildren,
  metaTags,
}: PublicLayoutProps) => {
  const location = useLocation()

  // const [opened, { toggle }] = useDisclosure()
  const pinned = useHeadroom({ fixedAt: 80 })

  // const [scroll, scrollTo] = useWindowScroll()

  // useEffect(() => {
  //   if (scroll.y > 140 && opened) {
  //     toggle()
  //   }
  // }, [opened, scroll.y, toggle])

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
      <AppShell header={{ height: 64 }}>
        <AppShell.Header
          style={{
            transform: `translate3d(0, ${pinned ? 0 : '-110px'}, 0)`,
            transition: 'transform 400ms ease, position 400ms ease',
            backgroundColor: 'var(--mantine-color-body)',
            ...(pinned ? { boxShadow: 'var(--mantine-shadow-md)' } : {}),
          }}
        >
          {/* Navigation */}
          <Navigation />
          {/* Header Item */}
          {headerChildren}
        </AppShell.Header>
        <AppShell.Main>
          <AnnouncementProvider>
            <Box className="min-h-screen w-full">{children}</Box>
            <Box
              pos="relative"
              mih="100%"
              py={{ base: '2.5rem', sm: '4.5rem' }}
              mx={'auto'}
              // style={{
              //   background: 'url(/images/assets/triangle-bg.svg) top center',
              //   backgroundSize: 'contain',
              // }}
            >
              {/* Footer */}
              <Footer />
              {/* Toaster */}
              <Toaster
                toastOptions={{
                  className: 'rw-toast',
                  duration: 4000,
                }}
              />
            </Box>
          </AnnouncementProvider>
        </AppShell.Main>
      </AppShell>
    </>
  )
}

export default DefaultLayout
