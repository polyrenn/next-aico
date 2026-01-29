import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import theme from '@/lib/theme'
import '../styles/styles.css';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const toast = useToast();
  
  // Force clear dark mode from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chakra-ui-color-mode');
    }
  }, []);
  
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