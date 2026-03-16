import Stripe from 'stripe'
import { createClient } from '@/src/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/src/lib/stripe'

type SplitItem = {
  storeId: string
  productId: string
  amount: number
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event: Stripe.Event
  try {
    if (process.env.STRIPE_WEBHOOK_SECRET_KEY && signature) {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET_KEY
      )
    } else {
      event = JSON.parse(body) as Stripe.Event
    }
  } catch (err) {
    console.error('[webhook] Assinatura inválida:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.payment_status === 'paid') {
        try {
          // 1. Buscar splits
          const { data: sessionSplits, error: splitsError } = await supabase
            .from('session_splits')
            .select('splits')
            .eq('session_id', session.id)
            .single()
          if (splitsError || !sessionSplits) {
            throw new Error(
              `Splits não encontrados para sessão ${session.id}: ${splitsError?.message}`
            )
          }
          const splits = sessionSplits?.splits as SplitItem[]

          const userId = session.metadata!.userId
          if (!userId) {
            throw new Error(
              `userId ausente no metadata da sessão ${session.id}`
            )
          }

          // 2. Salvar o pedido
          const { error: orderError } = await supabase.from('orders').upsert(
            {
              id: session.id,
              user_id: userId,
              customer_id: session.customer as string,
              payment_intent: session.payment_intent as string,
              status: session.status,
              payment_status: session.payment_status,
              shipping_address: {
                rate: (session.shipping_cost?.shipping_rate ?? '') as string,
                address: session.metadata!.shipping_address,
                geohash: session.metadata!.shipping_geohash
              },
              shipping_amount: session.shipping_cost!.amount_total,
              created_at: new Date(session.created * 1000).toISOString(),
              expires_at: new Date(session.expires_at * 1000).toISOString()
            },
            { onConflict: 'id', ignoreDuplicates: true }
          )
          if (orderError) {
            throw new Error(
              `Erro ao salvar pedido ${session.id}: ${orderError.message}`
            )
          }

          // 3. Buscar line_items expandidos
          const enrichedSession = await stripe.checkout.sessions.retrieve(
            session.id,
            {
              expand: ['line_items']
            }
          )
          const lineItems = enrichedSession.line_items?.data ?? []

          // 4. Montar e salvar order_products (sem transfer_id ainda)
          const orderProducts = lineItems.map((item, index) => {
            const split = splits[index]
            return {
              order_id: session.id,
              store_id: split.storeId, // UUID da loja
              product_id: split.productId,
              quantity: item.quantity ?? 1,
              price_cents: item.price?.unit_amount ?? 0
            }
          })
          const { error: orderProductsError } = await supabase
            .from('order_products')
            .insert(orderProducts)
            .select('id, product_id')
          if (orderProductsError) {
            throw new Error(
              `Erro ao salvar produtos da sessão ${session.id}: ${orderProductsError.message}`
            )
          }

          // 5. Buscar charge para transferências
          const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent as string
          )
          if (!paymentIntent.latest_charge) {
            throw new Error(
              `Charge não encontrado para payment_intent ${paymentIntent.id}`
            )
          }
          const latestChargeId = paymentIntent.latest_charge as string

          // 6. Agrupar splits por loja e transferir
          const splitsByStore = splits.reduce<
            Record<string, { amount: number; products: SplitItem[] }>
          >((acc, item) => {
            acc[item.storeId] ??= { amount: 0, products: [] }
            acc[item.storeId].amount += item.amount
            acc[item.storeId].products.push(item)
            return acc
          }, {})
          for (const [storeId, { amount }] of Object.entries(splitsByStore)) {
            const { data: store, error: storeError } = await supabase
              .from('stores')
              .select('id, stripe_account_id, commission_rate')
              .eq('id', storeId)
              .single()
            if (storeError || !store?.stripe_account_id) {
              console.error(
                `[checkout.session.completed] Loja ${storeId} não encontrada ou sem conta Stripe — pulando transferência`
              )
              continue
            }

            const rate = store.commission_rate ?? 0.05 // fallback para 5%

            let transfer: Stripe.Response<Stripe.Transfer>
            try {
              transfer = await stripe.transfers.create({
                amount: Math.round(amount * (1 - rate)),
                currency: 'brl',
                destination: store.stripe_account_id,
                transfer_group: session.id,
                description: `Split do pedido ${session.id}`,
                source_transaction: latestChargeId
              })
            } catch (transferError) {
              console.error(
                `[checkout.session.completed] Erro ao transferir para loja ${storeId}:`,
                transferError
              )
              continue
            }

            const { error: orderTransfersError } = await supabase
              .from('order_transfers')
              .insert({
                order_id: session.id,
                store_id: store.id,
                stripe_transfer_id: transfer.id,
                gross_amount: amount,
                commission_rate: store.commission_rate,
                transferred_amount: Math.round(amount * (1 - rate))
              })
            if (orderTransfersError) {
              console.error(
                `[checkout.session.completed] Erro ao salvar transferência ${transfer.id} no banco:`,
                orderTransfersError.message
              )
            }

            const { error: updateProductsError } = await supabase
              .from('order_products')
              .update({ transfer_id: transfer.id })
              .eq('order_id', session.id)
              .eq('store_id', store.id)
            if (updateProductsError) {
              console.error(
                `[checkout.session.completed] Erro ao atualizar transfer_id nos produtos da loja ${storeId}:`,
                updateProductsError.message
              )
            }
          }
          // 7. Limpar splits temporários
          const { error: deleteError } = await supabase
            .from('session_splits')
            .delete()
            .eq('session_id', session.id)
          if (deleteError) {
            console.error(
              `[checkout.session.completed] Erro ao deletar session_splits ${session.id}:`,
              deleteError.message
            )
          }
        } catch (err) {
          console.error('[checkout.session.completed] Erro crítico:', err)
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          )
        }
      }

      break
    }
    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      const { error } = await supabase
        .from('session_splits')
        .delete()
        .eq('session_id', session.id)
      if (error) {
        console.error(
          `[checkout.session.expired] Erro ao deletar splits da sessão ${session.id}:`,
          error.message
        )
      }

      break
    }
    default:
      console.log(`[webhook] Evento não tratado: ${event.type}`)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
