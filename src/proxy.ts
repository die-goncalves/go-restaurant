import { type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/proxy'
import { logger } from './lib/logger'

const log = logger.child({ module: 'proxy' })

export async function proxy(request: NextRequest) {
  const reqLog = log.child({
    id: crypto.randomUUID(),
    pathname: request.nextUrl.pathname,
    method: request.method
  })

  reqLog.info('Proxy running.')
  // update user's auth session
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
