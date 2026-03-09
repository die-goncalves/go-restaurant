import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/server'
import { RatingClient } from './rating-client'

export const metadata = { title: 'Avaliações | GoRestaurant' }

export default async function RatingPage() {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return <RatingClient user={user} />
}
