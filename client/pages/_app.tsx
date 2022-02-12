import { ChakraProvider } from '@chakra-ui/react'
import { createClient, Provider } from 'urql'

const client = createClient({ url: "http://localhost:4000/graphql"})

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
