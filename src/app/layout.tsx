import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Barlow_Semi_Condensed } from 'next/font/google'
import { RootProvider } from '../providers/root-providers'

const barlow_semi_condensed = Barlow_Semi_Condensed({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-barlow-semi-condensed'
})

export const metadata: Metadata = {
  title: 'GoRestaurant',
  description: 'App',
  icons: {
    icon: '/favicon-32x32.png'
  }
}

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="eng" className={`${barlow_semi_condensed.variable}`}>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
