import '../../styles/globals.css'
import { useState } from 'react'
import type { AppProps } from 'next/app'
import { Barlow_Semi_Condensed } from '@next/font/google'
import { Notification } from '../components/Notification'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { PositionProvider } from '../contexts/PositionContext'
import { FilterProvider } from '../contexts/FilterContext'

const barlow_semi_condensed = Barlow_Semi_Condensed({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin']
})

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
        domain: 'localhost',
        path: '/',
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 24 * 365
      }
    })
  )

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <PositionProvider>
        <FilterProvider>
          <style jsx global>{`
            :root {
              --font-barlow-semi-condensed: ${barlow_semi_condensed.style
                .fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
          <Notification />
        </FilterProvider>
      </PositionProvider>
    </SessionContextProvider>
  )
}
