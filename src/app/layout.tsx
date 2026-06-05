import type { Metadata, Viewport } from 'next'
import './globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import { RootProvider } from '../providers/root-providers'
import { figtree, gambarino } from './fonts'

export const metadata: Metadata = {
  title: 'GoRestaurant',
  description: 'App'
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
    <html
      lang="pt-BR"
      data-color-mode={'light'}
      className={`${gambarino.variable} ${figtree.variable}`}
    >
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
