import { redirect } from 'next/navigation'
import { Section } from '@/src/components/common/section'
import { logger } from '@/src/lib/logger'
import { createClient } from '@/src/lib/supabase/server'
import { Tables } from '@/src/types/supabase'
import { css } from '@/styled-system/css'
import { OrderHistory } from './_components/order-history'

const log = logger.child({
  module: 'server',
  route: '/dashboard/order'
})

type OrderProductItem = Pick<
  Tables<'order_products'>,
  'id' | 'quantity' | 'price_cents'
> & {
  product: Pick<Tables<'products'>, 'id' | 'name' | 'image_url' | 'price_cents'>
  store: Pick<Tables<'stores'>, 'id' | 'name' | 'image_url'>
}
export type Order = Omit<
  Tables<'orders'>,
  'customer_id' | 'expires_at' | 'payment_intent' | 'profile_id'
> & {
  order_products: OrderProductItem[]
}

export const metadata = { title: 'Pedidos | GoRestaurant' }

export default async function OrderPage() {
  const reqLog = log.child({ id: crypto.randomUUID() })

  const supabase = await createClient()
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    reqLog.warn({ error: authError }, 'Unauthenticated user — redirecting')
    redirect('/')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (profileError || !profile) {
    reqLog.error({ error: profileError }, 'Profile not found')
    redirect('/')
  }

  const { data, error: ordersError } = await supabase
    .from('orders')
    .select(
      `
        id,
        status,
        payment_status,
        shipping_amount,
        shipping_address,
        created_at,
        updated_at,
        order_products (
          id,
          quantity,
          price_cents,
          product:products ( id, name, image_url, price_cents ),
          store:stores ( id, name, image_url )
        )
      `
    )
    .eq('profile_id', profile.id)
    .order('created_at', { ascending: false })

  if (ordersError) {
    reqLog.error({ error: ordersError }, 'Error fetching orders')
  }

  return (
    <article
      aria-labelledby="order-heading"
      className={css({
        minHeight: 'calc(100dvh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8'
      })}
    >
      <header
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '2'
        })}
      >
        <h1 id="order-heading" className={css({ textStyle: '2xl' })}>
          Meus pedidos
        </h1>
        <p>
          Gerencie suas compras, verifique confirmações de pagamento e veja o
          progresso de seus pedidos.
        </p>
      </header>

      <Section
        label="Histórico de pedidos"
        description="Consulte suas transações anteriores e informações detalhadas de cada
            pedido."
      >
        <OrderHistory data={data as Order[]} />
      </Section>
    </article>
  )
}
