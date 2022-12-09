// pages/_app.js
import { ChakraProvider } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react';
import '../styles.css';
function MyApp({ Component, pageProps }) {
  const toast = useToast();
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp