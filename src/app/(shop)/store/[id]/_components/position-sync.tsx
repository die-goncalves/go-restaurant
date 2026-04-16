'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { usePosition } from '@/src/contexts/position-context'
import { geographicInformation } from '@/src/utils/geographic-information'
import { decodeGeohash } from '@/src/utils/geohash'

export function PositionSync() {
  const searchParams = useSearchParams()
  const { handleAddPosition } = usePosition()

  useEffect(() => {
    const controller = new AbortController()

    async function getPositionCoordinates(geohash: string) {
      const { latitude, longitude } = decodeGeohash(geohash)

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?limit=1&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY}`,
        { signal: controller.signal }
      )
      const data = await response.json()
      const { granular, place, place_name } = geographicInformation(
        data.features[0]
      )

      handleAddPosition({
        place_name,
        granular,
        geohash,
        place,
        coordinates: { latitude, longitude }
      })
    }

    const geohash = searchParams.get('geohash')
    if (geohash) getPositionCoordinates(geohash)

    return () => controller.abort()
  }, [handleAddPosition, searchParams])

  return null
}
