import clsx from 'clsx'
import Head from 'next/head'
import NextImage from 'next/image'
import { shimmerBase64 } from '../utils/blurDataURL'
import { Account } from '../components/Account'
import { SignedUser } from '../components/SignedUser'
import { DrawerMap } from '../components/DrawerMap'
import { Typewriter } from '../components/Typewriter'
import Searchbox from '../components/Searchbox'
import { Skeleton } from '../components/Skeleton'
import { useAuth } from '../contexts/AuthContext'
import { Partners } from '../components/Partner'
import { Footer } from '../components/Footer'
import { Help } from '../components/Help'
import { Presentation } from '../components/Presentation'
import { Logo } from '../components/Logo'

export default function Home() {
  const { isLoading, session } = useAuth()

  return (
    <div className="flex flex-col relative bg-light-gray-100 mx-auto max-w-[1920px] pb-8">
      <Head>
        <title>Página inicial | GoRestaurant</title>
      </Head>

      <Presentation />

      <div
        className={clsx(
          'lg:h-[100vh] lg:flex-row',
          'md:h-[60vh]',
          'sm:h-[100vh]',
          'xs:h-[60vh]',
          '2xs:h-[80vh]',
          'flex flex-col h-screen'
        )}
      >
        <div className={clsx('lg:w-[60%]', 'w-full')}>
          <header
            className={clsx(
              'lg:px-8',
              'sm:px-6',
              'flex p-4 items-center justify-between bg-light-gray-100'
            )}
          >
            <Logo named />

            {isLoading ? (
              <Skeleton className="h-10 w-48" />
            ) : session ? (
              <SignedUser />
            ) : (
              <Account />
            )}
          </header>

          <div
            className={clsx(
              'lg:px-8 lg:mt-8',
              'sm:px-6 sm:mt-6',
              'flex flex-col px-4 mt-4'
            )}
          >
            <div className="flex flex-col gap-4 items-start">
              <Typewriter />

              <p className="text-2xl font-regular">
                Faça pedidos de suas comidas favoritas em restaurantes perto de
                você
              </p>
            </div>

            <div
              className={clsx(
                'sm:gap-2',
                'relative flex flex-row mt-8 mb-2 gap-1'
              )}
            >
              <Searchbox />

              <DrawerMap />
            </div>
          </div>
        </div>

        <div
          className={clsx(
            'lg:w-[40%] lg:h-screen',
            'relative w-full h-full opacity-90'
          )}
        >
          <div
            className={clsx(
              'lg:hidden',
              'absolute w-full h-1/3 bg-white/10 z-[1] bg-gradient-to-b from-light-gray-100'
            )}
          ></div>
          <NextImage
            className="object-cover"
            src="https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Frutas"
            fill
            placeholder="blur"
            blurDataURL={shimmerBase64}
            sizes="(max-width: 768px) 100vw, (min-width: 769px) 80vw"
          />
        </div>
      </div>

      <Partners />

      <Footer />

      <Help />
    </div>
  )
}
