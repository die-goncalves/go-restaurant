import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { logger } from '@/src/lib/logger'

const log = logger.child({
  module: 'api',
  route: '/api/cron/keep-alive',
  method: 'GET'
})

const admin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function GET(request: NextRequest) {
  const reqLog = log.child({ id: crypto.randomUUID() })

  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    reqLog.warn('Unauthorized cron attempt')
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await admin
    .from('keepalive_log')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', 1)

  if (error) {
    reqLog.error({ error }, 'Keep alive ping failed')
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
