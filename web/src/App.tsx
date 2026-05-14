// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import { SettingsProvider } from 'src/providers/SettingsProvider'
import { ThemeProvider, useAppTheme } from 'src/providers/ThemeProvider'
import { ToastProvider } from 'src/providers/ToastProvider'
import Routes from 'src/Routes'

import './index.css'

const AppShell = () => {
  const { colorScheme } = useAppTheme()

  return (
    <FatalErrorBoundary page={FatalErrorPage as any}>
      <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
        <ColorSchemeScript
          defaultColorScheme="light"
          forceColorScheme={colorScheme}
        />
        <MantineProvider forceColorScheme={colorScheme}>
          <RedwoodApolloProvider>
            <SettingsProvider>
              <ToastProvider>
                <Routes />
              </ToastProvider>
            </SettingsProvider>
          </RedwoodApolloProvider>
        </MantineProvider>
      </RedwoodProvider>
    </FatalErrorBoundary>
  )
}

const App = () => (
  <ThemeProvider>
    <AppShell />
  </ThemeProvider>
)

export default App
