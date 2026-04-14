/*
 * New version for handling cookies still under development: https://developer.mozilla.org/en-US/docs/Web/API/CookieStore
 */

type SetCookie = {
  name: string
  value: string | undefined
  maxAge?: number
  expires?: Date
  domain?: string
  path?: string
  // httpOnly?: boolean
  secure?: boolean
  // partitioned?: boolean
  priority?: 'low' | 'medium' | 'high'
  sameSite?: boolean | 'lax' | 'strict' | 'none'
}

type CookieOptions = Omit<SetCookie, 'name' | 'value'>

/**
 * Retrieves the value of a cookie by name.
 *
 * @param name - The name of the cookie to retrieve.
 * @returns The decoded cookie value, or `undefined` if not found.
 *
 * @example
 * const token = getCookie('cart')
 */
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
  return match ? decodeURIComponent(match.split('=')[1]) : undefined
}

/**
 * Sets a cookie in the browser.
 *
 * @param name - The name of the cookie.
 * @param value - The value to store in the cookie.
 * @param options - Optional cookie attributes.
 * @param options.maxAge - Lifetime in seconds. Takes precedence over `expires` if both are set.
 * @param options.expires - Expiration date. If omitted, the cookie is session-only.
 * @param options.domain - Cookie domain. Defaults to the current domain only.
 * @param options.path - Cookie path. Defaults to `'/'`.
 * @param options.secure - Send only over HTTPS. Defaults to `true`.
 * @param options.sameSite - SameSite enforcement. `true` resolves to `'strict'`, `false` to `'lax'`. Defaults to `'lax'`.
 * @param options.priority - Cookie priority hint (`'low'`, `'medium'`, `'high'`).
 *
 * @example
 * setCookie('cart', JSON.stringify(items), { maxAge: 60 * 60 * 24 * 365 })
 */
function setCookie(name: string, value: string, options: CookieOptions = {}) {
  if (typeof document === 'undefined') return
  const {
    maxAge,
    expires,
    domain,
    path = '/',
    secure = true,
    sameSite = 'lax',
    priority
  } = options

  const resolvedSameSite =
    sameSite === true ? 'strict' : sameSite === false ? 'lax' : sameSite

  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    maxAge !== undefined ? `Max-Age=${maxAge}` : '',
    expires ? `Expires=${expires.toUTCString()}` : '',
    domain ? `Domain=${domain}` : '',
    `Path=${path}`,
    secure ? 'Secure' : '',
    `SameSite=${resolvedSameSite}`,
    priority ? `Priority=${priority}` : ''
  ]

  document.cookie = parts.filter(Boolean).join('; ')
}

/**
 * Deletes a cookie by setting its `Max-Age` to `0`.
 *
 * @param name - The name of the cookie to delete.
 * @param path - The path the cookie was set on. Must match the original path. Defaults to `'/'`.
 *
 * @example
 * deleteCookie('cart')
 */
function deleteCookie(name: string, path = '/') {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; Max-Age=0; Path=${path}`
}

export { getCookie, setCookie, deleteCookie }
