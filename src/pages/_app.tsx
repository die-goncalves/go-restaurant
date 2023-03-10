import '../../styles/globals.css'
import { useState } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Barlow_Semi_Condensed } from '@next/font/google'
import { Notification } from '../components/Notification'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { PositionProvider } from '../contexts/PositionContext'
import { FilterProvider } from '../contexts/FilterContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CartProvider } from '../contexts/CartContext'
import { AuthProvider } from '../contexts/AuthContext'

const barlow_semi_condensed = Barlow_Semi_Condensed({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin']
})

const queryClient = new QueryClient()

export default function App({
  Component,
  pageProps
}: AppProps<{
  initialSession: Session
}>) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient({
      cookieOptions: {
        name: '@gorestaurant-v0.1.0:auth-token',
        domain: `${process.env.NEXT_PUBLIC_DOMAIN_APP}`,
        path: '/',
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 24 * 365
      }
    })
  )

  return (
    <>
      <style jsx global>{`
        :root {
          --font-barlow-semi-condensed: ${barlow_semi_condensed.style
            .fontFamily};
        }
      `}</style>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>

      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <AuthProvider>
          <PositionProvider>
            <FilterProvider>
              <CartProvider>
                <QueryClientProvider client={queryClient}>
                  <Component {...pageProps} />
                  <Notification />
                  <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
              </CartProvider>
            </FilterProvider>
          </PositionProvider>
        </AuthProvider>
      </SessionContextProvider>
    </>
  )
}
