import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/server'
import { RatingClient } from './rating-client'
import { logger } from '@/src/lib/logger'

const log = logger.child({ module: 'server', page: 'RatingPage' })

export const metadata = { title: 'Avaliações | GoRestaurant' }

export default async function RatingPage() {
  const reqLog = log.child({ id: crypto.randomUUID() })
  const supabase = await createClient()

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()
  if (error || !user) {
    reqLog.warn({ error }, 'Unauthenticated user — redirecting')
    redirect('/')
  }

  let profile: { id: string }
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (error) {
      reqLog.error({ error }, 'Error fetching profile')
      throw new Error('Error fetching profile')
    }
    profile = { id: data.id }
  } catch (error) {
    reqLog.error({ error }, 'Unexpected error fetching profile')
    redirect('/')
  }

  try {
    const { data, error } = await supabase
      .from('order_products')
      .select(
        `
          id,
          quantity,
          price_cents,
          order:orders ( id, payment_status, created_at ),
          product:products ( id, name, image_url ),
          store:stores ( id, name, image_url ),
          product_ratings ( id, stars, comment, created_at, updated_at )
        `
      )
      .eq('orders.profile_id', profile.id)
      .eq('orders.payment_status', 'paid')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error('Error fetching products')
    }

    return <RatingClient products={data} profileId={profile.id} />
  } catch (error) {
    reqLog.error({ error }, 'Unexpected error fetching products')
    redirect('/')
  }
}
