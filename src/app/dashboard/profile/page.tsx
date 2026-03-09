import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ProfileClient } from './profile-client'
import { createClient } from '@/src/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Dashboard | GoRestaurant',
  icons: {
    icon: '/favicon-32x32.png'
  }
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return <ProfileClient user={user} />
}
