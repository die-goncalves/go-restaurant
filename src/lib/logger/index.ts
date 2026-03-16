import pino from 'pino'

const isBrowser = typeof window !== 'undefined'
const isDev = process.env.NODE_ENV === 'development'

const sensitive = new Map([
  ['stripe_account_id', { nested: true, reason: 'Stripe sensitive' }],
  ['stripe_customer_id', { nested: true, reason: 'Stripe sensitive' }],
  ['payment_intent', { nested: true, reason: 'Stripe sensitive' }],
  ['password', { nested: true, reason: 'Auth sensitive' }]
])
const redactPaths = [...sensitive.entries()].flatMap(([key, { nested }]) =>
  nested ? [key, `*.${key}`] : [key]
)

export const logger = pino({
  browser: isBrowser ? { asObject: true } : undefined,
  transport:
    !isBrowser && isDev
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  base: { service: 'app', env: process.env.NODE_ENV },
  redact: isDev ? undefined : { paths: redactPaths, censor: '[REDACTED]' }
})
