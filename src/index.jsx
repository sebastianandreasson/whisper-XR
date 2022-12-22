import { Global, MantineProvider } from '@mantine/core'
import React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import App from './App'

const Root = () => {
  return (
    <MantineProvider
      theme={{
        colorScheme: 'dark',
        fontFamily: 'Josefin Sans',
        components: {
          Card: {
            defaultProps: {
              shadow: 'sm',
              radius: 'md',
              p: 'xs',
            },
          },
        },
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Global
        styles={(theme) => ({
          '*, *::before, *::after': {
            boxSizing: 'border-box',
          },
          body: {
            backgroundColor: '#0d0d0d',
          },
        })}
      />
      <App />
    </MantineProvider>
  )
}

const root = ReactDOMClient.createRoot(document.getElementById('root'))
root.render(<Root />)
