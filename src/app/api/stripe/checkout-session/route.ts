import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { logger } from '@/src/lib/logger'
import { stripe } from '@/src/lib/stripe'
import { createClient } from '@/src/lib/supabase/server'
import { Database } from '@/src/types/supabase'

const log = logger.child({
  module: 'api',
  route: '/api/stripe/checkout-session',
  method: 'POST'
})

const admin = createAdminClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(request: NextRequest) {
  const reqLog = log.child({ id: crypto.randomUUID() })

  try {
    const supabase = await createClient()

    const cookieStore = request.cookies

    const shippingRaw = cookieStore.get('@gorestaurant-v0.1.0:shipping')?.value
    const cartRaw = cookieStore.get('@gorestaurant-v0.1.0:cart')?.value

    if (!shippingRaw || !cartRaw) {
      reqLog.warn('Cookies missing')
      return NextResponse.json(
        { statusCode: 400, message: 'Cookies missing!' },
        { status: 400 }
      )
    }

    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) {
      reqLog.warn('Unauthenticated user')
      return NextResponse.json(
        { statusCode: 401, message: 'Unauthenticated user' },
        { status: 401 }
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      reqLog.error({ error: profileError }, 'Profile not found')
      return NextResponse.json(
        { statusCode: 404, message: 'Profile not found' },
        { status: 404 }
      )
    }

    const shipping = JSON.parse(shippingRaw)
    const cart: { id: string; amount: number; store: { id: string } }[] =
      JSON.parse(cartRaw).map(
        (item: {
          productId: string
          productName: string
          productImageURL: string
          priceCents: number
          storeId: string
          storeName: string
          storeImageURL: string
          amount: number
        }) => ({
          id: item.productId,
          amount: item.amount,
          store: { id: item.storeId }
        })
      )
    const product = cart.map(p => ({
      productId: p.id,
      productAmount: p.amount,
      storeId: p.store.id
    }))
    const productIds = [...new Set(product.map(p => p.productId))]
    const storeIds = [...new Set(product.map(p => p.storeId))]
    const [productsRes, storesRes] = await Promise.all([
      supabase
        .from('products')
        .select('id, name, image_url, price_cents')
        .in('id', productIds),
      supabase.from('stores').select('id, stripe_account_id').in('id', storeIds)
    ])
    if (productsRes.error) throw productsRes.error
    if (storesRes.error) throw storesRes.error
    const productsMap = Object.fromEntries(productsRes.data.map(p => [p.id, p]))
    const storesMap = Object.fromEntries(storesRes.data.map(s => [s.id, s]))
    const enrichedProducts = product.map(item => ({
      amount: item.productAmount,
      product: productsMap[item.productId] || null,
      store: storesMap[item.storeId] || null
    }))

    const splits: { storeId: string; productId: string; amount: number }[] = []
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      enrichedProducts.map(p => {
        const amount = p.product.price_cents * p.amount
        // const commission = Math.round(amount * 0.05)
        // const store = amount - commission

        splits.push({
          storeId: p.store.id,
          productId: p.product.id,
          amount: amount
        })

        const item: Stripe.Checkout.SessionCreateParams.LineItem = {
          price_data: {
            currency: 'brl',
            unit_amount: p.product.price_cents,
            product_data: {
              name: p.product.name,
              ...(p.product.image_url && { images: [p.product.image_url] })
            }
          },
          quantity: p.amount
        }
        return item
      })

    let stripeCustomerId: string | null = null
    const { data: customer } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('profile_id', profile.id)
      .single()
    stripeCustomerId = customer?.stripe_customer_id ?? null

    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          profileId: profile.id
        }
      })
      await admin.from('customers').insert([
        {
          profile_id: profile.id,
          stripe_customer_id: stripeCustomer.id
        }
      ])
      stripeCustomerId = stripeCustomer.id
    }

    const baseUrl = process.env.APP_URL

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      metadata: {
        profileId: profile.id,
        shipping_address: shipping.user_location.place_name,
        shipping_geohash: shipping.user_location.geohash
        // splits: JSON.stringify(splits) // Mais de 500 caracteres é proibido
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
      allow_promotion_codes: true,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/canceled`
    })

    await admin
      .from('session_splits')
      .insert({ session_id: session.id, splits: splits })

    const response = NextResponse.json(
      { sessionId: session.id },
      { status: 200 }
    )
    response.cookies.delete('@gorestaurant-v0.1.0:cart')
    return response
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error'
    reqLog.error({ error }, 'Error creating checkout session')
    return NextResponse.json(
      { statusCode: 500, message: errorMessage },
      { status: 500 }
    )
  }
}
