'use server'

import { getRoute } from '@/src/utils/directions'
import { logger } from '@/src/lib/logger'

const log = logger.child({ module: 'actions', action: 'getDeliveryRoute' })

type Coordinates = {
  lng: number
  lat: number
}

export async function getDeliveryRoute(
  startRoute: Coordinates,
  endRoute: Coordinates
): Promise<
  | { success: true; data: { distance: number; duration: number } }
  | { success: false; error: string }
> {
  const reqLog = log.child({ id: crypto.randomUUID(), startRoute, endRoute })

  try {
    const result = await getRoute(startRoute, endRoute)
    return { success: true, data: result }
  } catch (error) {
    reqLog.error({ error }, 'Failed to calculate delivery route')
    return { success: false, error: 'Failed to calculate delivery route' }
  }
}
