// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import { ToastProvider } from 'src/providers/ToastProvider'
import Routes from 'src/Routes'

import './index.css'

// const App = ({ children }: AppProps) => (
const App = () => (
  <FatalErrorBoundary page={FatalErrorPage as any}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <ColorSchemeScript />
      <MantineProvider>
        <RedwoodApolloProvider>
          <ToastProvider>
            <Routes />
          </ToastProvider>
        </RedwoodApolloProvider>
      </MantineProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
