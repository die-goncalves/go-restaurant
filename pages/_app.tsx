import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Barlow_Semi_Condensed } from '@next/font/google'

const barlow_semi_condensed = Barlow_Semi_Condensed({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin']
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-barlow-semi-condensed: ${barlow_semi_condensed.style
            .fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
