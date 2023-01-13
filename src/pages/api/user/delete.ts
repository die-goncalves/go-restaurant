import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query as { id: string }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_SECRET_KEY || ''
  )

  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(id)

  if (error) res.status(500).send({ data: null, error })

  res.status(200).send({ data, error: null })
}
