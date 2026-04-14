import type { Metadata, Viewport } from 'next'
import './globals.css'
import { RootProvider } from '../providers/root-providers'
import { figtree, gambarino } from './fonts'

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
    <html lang="eng" className={`${gambarino.variable} ${figtree.variable}`}>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
