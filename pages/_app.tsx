import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import AuthWrapper from '../components/AuthWrapper'

import Header from '../components/Header'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <AuthWrapper>
        <Header />
        <Component {...pageProps} />
      </AuthWrapper>
    </SessionProvider>
  )
}

export default MyApp
