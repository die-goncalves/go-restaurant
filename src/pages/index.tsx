import Head from 'next/head'
import NextImage from 'next/image'
import { Account } from '../components/Account'
import { SignedUser } from '../components/SignedUser'
import { DrawerMap } from '../components/DrawerMap'
import { Typewriter } from '../components/Typewriter'
import Searchbox from '../components/Searchbox'
import { Skeleton } from '../components/Skeleton'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { isLoading, session } = useAuth()

  return (
    <div className="h-screen">
      <Head>
        <title>Página inicial | GoRestaurant</title>
      </Head>

      <div className="flex">
        <div className="w-[60vw] h-screen bg-light-gray-100">
          <header className="flex px-[3.75rem] py-4 items-center justify-between bg-light-gray-100">
            <NextImage src="/logo.svg" alt="pizza" width="32" height="32" />

            {isLoading ? (
              <Skeleton className="h-10 w-48" />
            ) : session ? (
              <SignedUser />
            ) : (
              <Account />
            )}
          </header>
          <div className="flex flex-col px-[3.75rem] pt-[6.25rem]">
            <div className="flex flex-col gap-4 items-start">
              <Typewriter />

              <p className="text-2xl font-regular">
                Faça pedidos de suas comidas favoritas em restaurantes pertos de
                você
              </p>
            </div>

            <div className="flex mt-8 mb-4 gap-2">
              <Searchbox />

              <DrawerMap />
            </div>
          </div>
        </div>

        <div className="w-[40vw] h-screen relative">
          <NextImage
            className="w-[60vw]"
            src="https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Frutas"
            objectFit="cover"
            fill
          />
        </div>
      </div>
    </div>
  )
}
