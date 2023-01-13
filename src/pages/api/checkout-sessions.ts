import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import nookies from 'nookies'
import Stripe from 'stripe'
import { supabase } from '../../services/supabaseClient'

// This is your test secret API key.
const stripe = new Stripe(`${process.env.STRIPE_API_KEY}`, {
  apiVersion: '2022-11-15',
  typescript: true
})
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    try {
      const cookies = nookies.get({ req: request })
      const shipping = JSON.parse(cookies['@gorestaurant-v0.1.0:shipping'])
      const cart = JSON.parse(cookies['@gorestaurant-v0.1.0:cart'])
      const jwt = JSON.parse(cookies['@gorestaurant-v0.1.0:auth-token'])

      const line_items = cart.map(
        (food: { stripe_price_id: string; amount: number }) => ({
          price: food.stripe_price_id,
          quantity: food.amount
        })
      )

      const supabaseServerClient = createServerSupabaseClient(
        {
          req: request,
          res: response
        },
        {
          cookieOptions: {
            name: '@gorestaurant-v0.1.0:auth-token',
            domain: 'localhost',
            path: '/',
            sameSite: 'lax',
            secure: false,
            maxAge: 60 * 60 * 24 * 365
          }
        }
      )
      const {
        data: { user }
      } = await supabaseServerClient.auth.getUser(jwt[0])

      if (user) {
        let stripeCustomerId: string | null = null
        const { data } = await supabase
          .from('stripe_customer')
          .select('*')
          .eq('customer_id', user.id)

        stripeCustomerId =
          data && data.length ? data[0].stripe_customer_id : null

        if (!stripeCustomerId) {
          const stripeCustomer = await stripe.customers.create({
            email: user.email
          })
          await supabase.from('stripe_customer').insert([
            {
              customer_id: user.id,
              stripe_customer_id: stripeCustomer.id
            }
          ])
          stripeCustomerId = stripeCustomer.id
        }

        const session = await stripe.checkout.sessions.create({
          customer: stripeCustomerId,
          line_items,
          metadata: {
            shipping_address: shipping.user_location.place_name,
            shipping_geohash: shipping.user_location.geohash
          },
          shipping_options: [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: shipping.price * 100,
                  currency: 'brl'
                },
                display_name: `${shipping.distance} km longe do restaurante`
              }
            }
          ],
          payment_method_types: ['card'],
          mode: 'payment',
          allow_promotion_codes: true,
          success_url: `${process.env.STRIPE_SUCCESS_URL}/?success=true`,
          cancel_url: `${process.env.STRIPE_CANCEL_URL}/?canceled=true`
        })

        nookies.destroy({ res: response }, '@gorestaurant-v0.1.0:cart', {
          path: '/'
        })
        response.status(200).json({ sessionId: session.id })
        // response.redirect(303, session.url)
      } else {
        response.status(401).end('Usuário não autenticado')
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Internal server error'
      response.status(500).json({ statusCode: 500, message: errorMessage })
    }
  } else {
    response.setHeader('Allow', 'POST')
    response.status(405).end('Método não permitido')
  }
}
