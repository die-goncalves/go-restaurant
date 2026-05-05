import { redirect } from 'next/navigation'
import { Section } from '@/src/components/common/section'
import { logger } from '@/src/lib/logger'
import { createClient } from '@/src/lib/supabase/server'
import { Tables } from '@/src/types/supabase'
import { css } from '@/styled-system/css'
import { RatingsAndComments } from './_components/ratings-and-comments'

const log = logger.child({ module: 'server', route: '/dashboard/rating' })

export type OrderProductItem = Pick<
  Tables<'order_products'>,
  'id' | 'quantity' | 'price_cents'
> & {
  order: Pick<Tables<'orders'>, 'id' | 'payment_status' | 'created_at'>
  product: Pick<Tables<'products'>, 'id' | 'name' | 'image_url'>
  store: Pick<Tables<'stores'>, 'id' | 'name' | 'image_url'>
  product_ratings: Pick<
    Tables<'product_ratings'>,
    'id' | 'stars' | 'comment' | 'created_at' | 'updated_at'
  >[]
}

export const metadata = { title: 'Avaliações | GoRestaurant' }

export default async function RatingPage() {
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

  const { data, error: orderProductsError } = await supabase
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

  if (orderProductsError) {
    reqLog.error({ error: orderProductsError }, 'Error fetching orders')
  }

  return (
    <article
      aria-labelledby="rating-heading"
      className={css({
        minHeight: 'calc(100dvh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8'
      })}
    >
      <header
        className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}
      >
        <h1 id="rating-heading" className={css({ textStyle: '2xl' })}>
          Avaliação da compra
        </h1>
        <p>
          Compartilhe suas impressões sobre os produtos e ajude outras pessoas a
          tomarem as melhores decisões.
        </p>
      </header>

      <Section
        label="Nota e Comentários"
        description="Atribua uma nota para cada produto recebido e compartilhe detalhes
          sobre a qualidade, o atendimento da loja e o processo de entrega."
      >
        <RatingsAndComments products={data} profileId={profile.id} />
      </Section>
    </article>
  )
}
