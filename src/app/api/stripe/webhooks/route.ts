import Stripe from 'stripe'
import { createClient } from '@/src/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/src/lib/stripe'

export const config = { api: { bodyParser: false } }

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
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object as Stripe.Checkout.Session
      const {
        id,
        customer,
        status,
        line_items,
        created,
        expires_at,
        payment_status,
        payment_intent
      } = await stripe.checkout.sessions.retrieve(checkoutSession.id, {
        expand: ['line_items']
      })

      if (payment_status === 'paid')
        await supabase.from('checkout_session').insert({
          id,
          customer_id: customer,
          payment_intent_id: payment_intent,
          status,
          payment_status,
          line_items: line_items?.data.map(food => ({
            food_id: food.price?.product,
            quantity: food.quantity
          })),
          shipping_options: {
            shipping_amount: checkoutSession.shipping_cost!.amount_total / 100,
            shipping_rate: checkoutSession.shipping_cost?.shipping_rate,
            shipping_address: checkoutSession.metadata!.shipping_address,
            shipping_geohash: checkoutSession.metadata!.shipping_geohash
          },
          created_at: new Date(created * 1000).toISOString().toLocaleString(),
          expires_at: new Date(expires_at * 1000).toISOString().toLocaleString()
        })
      break
    case 'payment_intent.succeeded':
      const succeededPayment = event.data.object as Stripe.PaymentIntent
      const { data: checkoutSessionForPaymentSucceeded } = await supabase
        .from('checkout_session')
        .select('id')
        .eq('payment_intent_id', succeededPayment.id)
        .single()

      if (checkoutSessionForPaymentSucceeded)
        await supabase
          .from('checkout_session')
          .update({
            status: 'complete',
            payment_status: 'paid',
            updated_at: new Date().toISOString().toLocaleString()
          })
          .eq('payment_intent_id', succeededPayment.id)
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
