import { stripe } from '@/src/lib/stripe'
import { createClient } from '@/src/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export default async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const cookieStore = request.cookies

    const shippingRaw = cookieStore.get('@gorestaurant-v0.1.0:shipping')?.value
    const cartRaw = cookieStore.get('@gorestaurant-v0.1.0:cart')?.value
    const jwtRaw = cookieStore.get('@gorestaurant-v0.1.0:auth-token')?.value

    if (!shippingRaw || !cartRaw || !jwtRaw) {
      return NextResponse.json(
        { statusCode: 400, message: 'Cookies missing!' },
        { status: 400 }
      )
    }

    const shipping = JSON.parse(shippingRaw)
    const cart = JSON.parse(cartRaw)
    const jwt = JSON.parse(jwtRaw)

    const line_items = cart.map(
      (food: { stripe_price_id: string; amount: number }) => ({
        price: food.stripe_price_id,
        quantity: food.amount
      })
    )

    const {
      data: { user }
    } = await supabase.auth.getUser(jwt[0])

    if (!user) {
      return NextResponse.json(
        { statusCode: 401, message: 'Unauthenticated user' },
        { status: 401 }
      )
    }

    let stripeCustomerId: string | null = null
    const { data } = await supabase
      .from('stripe_customer')
      .select('*')
      .eq('customer_id', user.id)

    stripeCustomerId = data && data.length ? data[0].stripe_customer_id : null

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

    const response = NextResponse.json(
      { sessionId: session.id },
      { status: 200 }
    )
    response.cookies.delete('@gorestaurant-v0.1.0:cart')
    return response
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { statusCode: 500, message: errorMessage },
      { status: 500 }
    )
  }
}
