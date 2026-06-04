'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { usePosition } from '@/src/contexts/position-context'
import { decodeGeohash, encodeGeohash } from '@/src/utils/geohash'
import { GeocodingResponse } from '@mapbox/search-js-core'
import { toaster } from '@/src/components/ui/toast/toast'

export function PositionSync() {
  const searchParams = useSearchParams()
  const { setPosition } = usePosition()
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const geohash = searchParams.get('geohash')
    if (!geohash) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    async function getPositionCoordinates(geohash: string) {
      const { latitude, longitude } = decodeGeohash(geohash)

      const url = new URL('https://api.mapbox.com/search/geocode/v6/reverse')
      url.searchParams.set('longitude', String(longitude))
      url.searchParams.set('latitude', String(latitude))
      url.searchParams.set('language', 'pt')
      url.searchParams.set('limit', '1')
      url.searchParams.set(
        'access_token',
        process.env.NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY ?? ''
      )

      try {
        const res = await fetch(url, { signal: controller.signal })

        const json: GeocodingResponse = await res.json()

        if (abortRef.current !== controller) return

        if (json.features.length !== 0) {
          const longitude = json.features[0].geometry.coordinates[0]
          const latitude = json.features[0].geometry.coordinates[1]
          const geohash = encodeGeohash({ latitude, longitude })
          const place = json.features[0].properties.context.place?.name
          const fullAddress = json.features[0].properties.full_address

          if (!place || !geohash) {
            toaster.error({
              description: 'Falha ao processar a localização informada.'
            })
            return
          }

          setPosition({
            coordinates: { latitude, longitude },
            geohash,
            fullAddress,
            place
          })
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }

    getPositionCoordinates(geohash)

    return () => {
      controller.abort()
    }
  }, [setPosition, searchParams])

  return null
}
