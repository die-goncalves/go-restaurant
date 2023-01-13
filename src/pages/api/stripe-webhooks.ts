/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import Stripe from 'stripe'
import { supabase } from '../../services/supabaseClient'

const stripe = new Stripe(`${process.env.STRIPE_API_KEY}`, {
  apiVersion: '2022-11-15',
  typescript: true
})

export const config = { api: { bodyParser: false } }

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === 'POST') {
    const signature = request.headers['stripe-signature']
    // This is your Stripe CLI webhook secret for testing your endpoint locally.
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
    const reqBuffer = await buffer(request)

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        reqBuffer,
        signature!,
        endpointSecret!
      )
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Internal server error'
      response.status(400).send(`Webhook Error: ${errorMessage}`)
      return
    }

    // Handle the event
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
              shipping_amount:
                checkoutSession.shipping_cost!.amount_total / 100,
              shipping_rate: checkoutSession.shipping_cost?.shipping_rate,
              shipping_address: checkoutSession.metadata!.shipping_address,
              shipping_geohash: checkoutSession.metadata!.shipping_geohash
            },
            created_at: new Date(created * 1000).toISOString().toLocaleString(),
            expires_at: new Date(expires_at * 1000)
              .toISOString()
              .toLocaleString()
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
      // // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    response.status(200).end()
  } else {
    response.setHeader('Allow', 'POST')
    response.status(405).end('Método não permitido')
  }
}
