'use server'

import { createClient } from '@/src/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { logger } from '@/src/lib/logger'

const log = logger.child({ module: 'actions', action: 'deleteAccount' })

export async function deleteAccount() {
  const reqLog = log.child({ id: crypto.randomUUID() })
  const supabase = await createClient()

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()
  if (error || !user) {
    reqLog.warn({ error }, 'Unauthenticated user')
    return { error: 'Unauthenticated user' }
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        user_id: null,
        full_name: null,
        phone_number: null,
        avatar_url: null
      })
      .eq('user_id', user.id)

    if (error) throw new Error(error.message)
  } catch (error) {
    reqLog.error({ error }, 'Failed to deactivate profile')
    return { error: 'Failed to deactivate profile' }
  }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )

  try {
    const { error } = await admin.auth.admin.deleteUser(user.id)
    if (error) throw new Error(error.message)
  } catch (error) {
    reqLog.error({ error }, 'Failed to delete account')
    return { error: 'Failed to delete account' }
  }
  await supabase.auth.signOut()
  return { success: true }
}
