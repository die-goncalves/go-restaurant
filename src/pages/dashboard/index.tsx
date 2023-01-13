import clsx from 'clsx'
import { useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import NextImage from 'next/image'
import NextRouter from 'next/router'
import { createServerSupabaseClient, User } from '@supabase/auth-helpers-nextjs'
import { X } from 'phosphor-react'
import toast from 'react-hot-toast'
import { api } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { SignedUser } from '../../components/SignedUser'
import { DashboardNavigation } from '../../components/DashboardNavigation'
import { Dialog } from '../../components/Dialog'

type ProfileProps = {
  user: User
}
export default function Profile({ user }: ProfileProps) {
  const [open, setOpen] = useState(false)
  const { signOut } = useAuth()

  async function deleteAccount() {
    const { error: signOutError } = await signOut()
    if (!signOutError) NextRouter.push('/')

    const response = await api.get(`/api/user/delete`, {
      params: {
        id: user.id
      }
    })
    if (response.data.error) {
      toast.error('Erro ao tentar excluir a conta')
    } else {
      toast.success('Conta excluída')
    }
  }

  return (
    <div className="bg-light-gray-100 overflow-auto scrollbar-gutter-stable">
      <Head>
        <title>Dashboard | GoRestaurant</title>
      </Head>
      <div className="flex flex-col">
        <header className="flex px-[3.75rem] py-4 items-center justify-between bg-light-gray-100">
          <NextImage src="/logo.svg" alt="pizza" width="32" height="32" />

          <SignedUser />
        </header>
        <div className="flex px-[3.75rem] h-[calc(100vh-4.5rem)]">
          <DashboardNavigation />

          <div className="flex flex-1 py-4">
            <div className="flex flex-1 h-max justify-between items-center py-2 px-4 shadow-md bg-light-gray-200">
              <div className="flex flex-col gap-1">
                <p className="text-lg">Deletar conta</p>
                <p className="bg-light-red-200/50">
                  Tenha cuidado, esta ação é irreversível
                </p>
              </div>
              <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger>
                  <button
                    className={clsx(
                      'ml-auto py-2 px-4 rounded bg-light-gray-300 [&:not(:disabled):hover]:bg-light-gray-400',
                      'transition-[background-color, outline] ease-in duration-150',
                      'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                    )}
                  >
                    Deletar
                  </button>
                </Dialog.Trigger>
                <Dialog.Content
                  className="w-96"
                  onCloseInteractOverlay={() => setOpen(false)}
                >
                  <header className="flex p-4 items-center justify-between">
                    <p className="text-xl font-medium">
                      Confirmação de exclusão
                    </p>
                    <Dialog.Close>
                      <button
                        className={clsx(
                          'p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                          'transition-[background-color, outline] ease-in duration-150',
                          'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                        )}
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </Dialog.Close>
                  </header>
                  <main className="relative flex flex-col p-4">
                    <p>Tem a certeza de que quer deletar a sua conta?</p>
                  </main>
                  <footer className="flex items-center p-4">
                    <div className="flex ml-auto justify-end gap-2">
                      <button
                        className={clsx(
                          'py-2 px-4 rounded bg-light-gray-100 [&:not(:disabled):hover]:bg-light-gray-200',
                          'transition-[background-color, outline] ease-in duration-150',
                          'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                        )}
                        onClick={() => setOpen(false)}
                      >
                        Cancelar
                      </button>
                      <button
                        className={clsx(
                          'py-2 px-4 rounded bg-light-red-200 [&:not(:disabled):hover]:bg-light-red-300',
                          'transition-[background-color, outline] ease-in duration-150',
                          'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300',
                          'disabled:cursor-not-allowed disabled:opacity-80'
                        )}
                        onClick={deleteAccount}
                      >
                        Quero excluir
                      </button>
                    </div>
                  </footer>
                </Dialog.Content>
              </Dialog.Root>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx, {
    cookieOptions: {
      name: '@gorestaurant-v0.1.0:auth-token',
      domain: 'localhost',
      path: '/',
      sameSite: 'lax',
      secure: false,
      maxAge: 60 * 60 * 24 * 365
    }
  })

  // Check if we have a session
  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }

  return {
    props: {
      initialSession: session,
      user: session.user
    }
  }
}
