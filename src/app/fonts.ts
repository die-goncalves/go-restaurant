import { Figtree } from 'next/font/google'
import localFont from 'next/font/local'

export const gambarino = localFont({
  src: '../fonts/gambarino-regular.woff2',
  display: 'swap',
  variable: '--font-gambarino'
})

export const figtree = Figtree({
  display: 'swap',
  variable: '--font-figtree'
})
