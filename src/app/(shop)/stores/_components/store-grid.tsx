'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { DeliveryData, PickUpData } from '@/src/app/api/filter/route'
import { useFilter } from '@/src/contexts/filter-context'
import { usePosition } from '@/src/contexts/position-context'
import { logger } from '@/src/lib/logger'
import { StoreCard } from './store-card'

const log = logger.child({ module: 'client', component: 'StoreGrid' })

const ONE_DAY_MS = 24 * 60 * 60 * 1000

type FilterResult = Array<PickUpData | DeliveryData>

type StoreGridProps = {
  fallbackCoordinates: { lng: number; lat: number }
  fallbackPlace: string | undefined
}
export function StoreGrid({
  fallbackPlace,
  fallbackCoordinates
}: StoreGridProps) {
  const { state: filter } = useFilter()
  const { state: position } = usePosition()

  const lng =
    position.currentPosition?.coordinates.longitude ?? fallbackCoordinates.lng
  const lat =
    position.currentPosition?.coordinates.latitude ?? fallbackCoordinates.lat
  const place = position.currentPosition?.place ?? fallbackPlace

  const { data } = useQuery({
    queryKey: [
      'filter',
      {
        categories: filter.categories,
        priceRange: filter.priceRange,
        deliveryMode: filter.deliveryMode,
        sort: filter.sort,
        lng,
        lat,
        place
      }
    ],
    queryFn: async () => {
      const queryLog = log.child({
        hook: 'useQuery',
        queryKey: 'filter',
        categories: filter.categories,
        priceRange: filter.priceRange,
        deliveryMode: filter.deliveryMode,
        sort: filter.sort,
        lng,
        lat,
        place
      })

      const params = new URLSearchParams()
      filter.categories.forEach(c => params.append('categories', c))
      if (filter.priceRange != null)
        params.set('priceRange', String(filter.priceRange))
      if (filter.sort) params.set('sort', filter.sort)
      params.set('deliveryMode', filter.deliveryMode)
      params.set('lng', String(lng))
      params.set('lat', String(lat))
      if (place) params.set('place', place)

      queryLog.debug({ params: params.toString() }, 'Fetching stores')

      let response: Response
      try {
        response = await fetch(`/api/filter?${params}`)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Network error'
        queryLog.error({ message }, 'Fetch failed')
        throw new Error(message)
      }

      if (!response.ok) {
        const message = `Filter API error: ${response.status} ${response.statusText}`
        queryLog.error({ status: response.status }, message)
        throw new Error(message)
      }

      try {
        const data: FilterResult = await response.json()
        queryLog.debug({ count: data.length }, 'Stores fetched')
        return data
      } catch {
        throw new Error('Failed to parse response JSON')
      }
    },
    staleTime: ONE_DAY_MS
  })

  const filteredData = useMemo(() => data, [data])

  return filteredData?.map(store => <StoreCard key={store.id} store={store} />)
}
