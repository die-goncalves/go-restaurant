import clsx from 'clsx'
import Head from 'next/head'
import NextImage from 'next/image'
import { Account } from '../components/Account'
import { SignedUser } from '../components/SignedUser'
import { useSessionContext } from '@supabase/auth-helpers-react'
import { GlobeHemisphereWest, X } from 'phosphor-react'
import { Drawer } from '../components/Drawer'
import { TextInput } from '../components/TextInput'
import DrawerMap from '../components/Maps/DrawerMap'
import { Typewriter } from '../components/Typewriter'
import Searchbox from '../components/Searchbox'
import { Skeleton } from '../components/Skeleton'

export default function Home() {
  const { isLoading, session } = useSessionContext()

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

              <Drawer.Root>
                <Drawer.Trigger>
                  <button
                    className={clsx(
                      'flex p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                      'transition-[background-color] ease-in duration-150',
                      'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                    )}
                  >
                    <GlobeHemisphereWest className="w-6 h-6" />
                  </button>
                </Drawer.Trigger>
                <Drawer.Content className="flex flex-col w-2/5">
                  <header className="flex p-4 items-center justify-between">
                    <p className="text-xl font-medium">Onde você está?</p>
                    <Drawer.Close>
                      <button
                        className={clsx(
                          'p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                          'transition-[background-color] ease-in duration-150',
                          'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                        )}
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </Drawer.Close>
                  </header>
                  <DrawerMap />
                  <footer className="flex justify-center p-4 gap-4">
                    <TextInput
                      placeholder="Clique no mapa e verá o endereço aqui"
                      readOnly
                    />

                    <button
                      className={clsx(
                        'ml-auto py-2 px-4 rounded bg-light-green-200 [&:not(:disabled):hover]:bg-light-green-300',
                        'transition-[background-color] ease-in duration-150',
                        'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                      )}
                    >
                      Confirmar
                    </button>
                  </footer>
                </Drawer.Content>
              </Drawer.Root>
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
