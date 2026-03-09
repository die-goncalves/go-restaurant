import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/server'
import { OrderClient } from './order-client'

export const metadata = { title: 'Pedidos | GoRestaurant' }

export default async function OrderPage() {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return <OrderClient user={user} />
}
