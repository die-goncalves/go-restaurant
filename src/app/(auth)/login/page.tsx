import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Footer } from '@/src/components/common/footer'
import { Header } from '@/src/components/common/header'
import { createClient } from '@/src/lib/supabase/server'
import { LoginClient } from './_components/login-client'

export const metadata: Metadata = {
  title: 'Login | GoRestaurant'
}

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ redirectTo?: string }>
}) {
  const { redirectTo } = await searchParams
  const decoded = redirectTo
    ? decodeURIComponent(redirectTo)
    : '/dashboard/account'
  const safeRedirect = decoded.startsWith('/') ? decoded : '/dashboard/account'

  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (user) redirect(safeRedirect)

  return (
    <>
      <Header />
      <LoginClient redirectTo={safeRedirect} />
      <Footer />
    </>
  )
}
