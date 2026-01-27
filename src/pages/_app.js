import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react';
import theme from '@/lib/theme'
import '../styles/styles.css';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const toast = useToast();
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}

export default MyApp