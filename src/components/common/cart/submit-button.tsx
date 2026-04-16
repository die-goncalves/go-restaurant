import { loadStripe, Stripe } from '@stripe/stripe-js'
import { usePathname, useRouter } from 'next/navigation'
import { MouseEvent, useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { useAuth } from '@/src/contexts/auth-context'
import { useCart } from '@/src/contexts/cart-context'
import { logger } from '@/src/lib/logger'

const log = logger.child({ module: 'client', component: 'Cart' })

let stripePromise: Promise<Stripe | null> | null = null
function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(
      `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
    )
  }
  return stripePromise
}

export function SubmitButton() {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const { session } = useAuth()

  const isDisabled = !!session?.user && !cartCount

  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    if (isPending) return

    if (!session?.user) {
      router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`)
      return
    }

    if (!cartCount) return

    const submitLog = log.child({ handler: 'onSubmit' })

    setIsPending(true)
    try {
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST'
      })
      if (!response.ok) {
        submitLog.error(
          { status: response.status, statusText: response.statusText },
          'Failed to create checkout session'
        )
        throw new Error(`Error creating session: ${response.statusText}`)
      }
      const { sessionId } = await response.json()

      const stripe = await getStripe()
      if (!stripe) {
        submitLog.error({}, 'Stripe failed to load')
        return
      }
      await stripe.redirectToCheckout({ sessionId })
    } catch (error) {
      submitLog.error({ error }, 'Unexpected error during checkout')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      variant={session?.user && !!cartCount ? 'solid' : 'ghost'}
      aria-disabled={isDisabled || isPending}
      onClick={handleSubmit}
    >
      {isPending
        ? 'Processando...'
        : session?.user
          ? !cartCount
            ? 'Carrinho vazio'
            : 'Confirmar'
          : 'Entrar para finalizar'}
    </Button>
  )
}
