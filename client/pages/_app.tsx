import { ChakraProvider } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../utils/createUrqlClient"

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}

export default withUrqlClient(createUrqlClient)(MyApp)