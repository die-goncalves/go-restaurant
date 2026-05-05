'use server'

import { createClient as createAdminClient } from '@supabase/supabase-js'
import { logger } from '@/src/lib/logger'
import { createClient } from '@/src/lib/supabase/server'

const log = logger.child({ module: 'actions', action: 'deleteAccount' })

const admin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function deleteAccount() {
  const reqLog = log.child({ id: crypto.randomUUID() })
  const supabase = await createClient()

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()
  if (authError || !user) {
    reqLog.warn({ error: authError }, 'Unauthenticated user')
    return { error: 'Unauthenticated user' }
  }

  const { data: profileData, error: profileError } = await supabase
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
    .select('id')
    .single()

  if (profileError || !profileData) {
    reqLog.error({ error: profileError }, 'Failed to deactivate profile')
    return { error: 'Failed to deactivate profile' }
  }

  const { error: deleteUserError } = await admin.auth.admin.deleteUser(user.id)
  if (deleteUserError) {
    reqLog.error({ error: deleteUserError }, 'Failed to delete auth user')

    const { error: rollbackError } = await supabase
      .from('profiles')
      .update({
        is_deleted: false,
        deleted_at: null,
        user_id: user.id
      })
      .eq('id', profileData.id)

    if (rollbackError) {
      reqLog.error(
        { error: rollbackError },
        'Failed to rollback profile soft delete — profile may be in inconsistent state'
      )
    }

    return { error: 'Failed to delete auth user' }
  }

  try {
    await supabase.auth.signOut()
  } catch (error) {
    reqLog.warn(
      { error },
      'Failed to sign out after account deletion — session may already be invalid'
    )
  }

  return { success: true }
}
