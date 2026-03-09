'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { useFilter } from '@/src/contexts/filter-context'
import { useAuth } from '@/src/contexts/auth-context'
import { geographicInformation } from '@/src/utils/geographicInformation'
import { decodeGeohash } from '@/src/utils/geohash'
import { Account } from '@/src/components/account'
import { Sidebar } from '@/src/components/sidebar'
import { SelectedTags } from '@/src/components/selected-tags'
import { RestaurantCard } from '@/src/components/restaurant-card'
import { Skeleton } from '@/src/components/skeleton'
import { SignedUser } from '@/src/components/signed-user'
import { Logo } from '@/src/components/logo'
import { css } from '@/styled-system/css'

const DynamicCart = dynamic(() => import('@/src/components/cart'), {
  ssr: false
})

const restaurantGrid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  gap: '4',
  my: '4',
  sm: { gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '4', my: '6' },
  lg: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', my: '8' },
  xl: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8' },
  '3xl': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '4' }
})

type RestaurantsClientProps = {
  place: string
  geohash: string
  coordinates: { lng: number; lat: number }
  tags: Array<{ id: string; name: string; count: number }>
}
export function RestaurantsClient({
  place,
  geohash,
  coordinates,
  tags
}: RestaurantsClientProps) {
  const { isLoading: isLoadingSession, session } = useAuth()
  const { state, handleAddPosition } = useFilter()
  const router = useRouter() // ✅ substituiu NextRouter

  const lng = state.currentPosition?.coordinates.longitude ?? coordinates.lng
  const lat = state.currentPosition?.coordinates.latitude ?? coordinates.lat
  const currentPlace = state.currentPosition?.place ?? place

  const { data, isLoading, isSuccess } = useQuery({
    // ✅ nova sintaxe do react-query v5
    queryKey: [
      'filter',
      {
        tags: state.tags,
        price: state.price,
        delivery: state.delivery,
        sort: state.sort,
        lng,
        lat,
        place: currentPlace
      }
    ],
    queryFn: async () => {
      try {
        const params = new URLSearchParams()
        if (state.tags?.length)
          state.tags.forEach(tag => params.append('tag', tag))
        if (state.price) params.set('price', String(state.price))
        if (state.sort) params.set('sort', state.sort)
        params.set('delivery', state.delivery)
        params.set('lng', String(lng))
        params.set('lat', String(lat))
        params.set('place', currentPlace)

        const response = await fetch(`/api/filter?${params}`)
        const data = await response.json()
        return data
      } catch (error) {
        console.log({ error })
      }
    },
    staleTime: 24 * 60 * 60
  })

  const filteredData = useMemo(() => data ?? [], [data])

  useEffect(() => {
    async function getPositionCoordinates() {
      const { latitude, longitude } = decodeGeohash(geohash)

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?limit=1&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY}`
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

    if (geohash) {
      getPositionCoordinates()
    } else {
      router.push('/') // ✅ substituiu NextRouter.push
    }
  }, [geohash, handleAddPosition, router])

  return (
    <div className={css({ bg: 'light.gray.100' })}>
      <header
        className={css({
          display: 'flex',
          position: 'sticky',
          top: '0',
          alignItems: 'center',
          justifyContent: 'space-between',
          bg: 'light.gray.100/80',
          backdropFilter: 'blur(4px)',
          zIndex: '10',
          p: '4',
          sm: { px: '6' },
          lg: { px: '8' }
        })}
      >
        <Logo />
        <div className={css({ display: 'flex', gap: '4' })}>
          <DynamicCart />
          {isLoadingSession ? (
            <Skeleton className={css({ h: '10', w: '48' })} />
          ) : session ? (
            <SignedUser />
          ) : (
            <Account />
          )}
        </div>
      </header>

      <div
        className={css({
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          sm: { flexDirection: 'row', mx: '6' },
          lg: { mx: '8' }
        })}
      >
        <Sidebar tags={tags} />

        <main
          className={css({
            display: 'flex',
            flex: '1',
            flexDirection: 'column',
            minH: 'calc(100vh - 4.5rem)',
            bg: 'light.gray.100',
            px: '4',
            sm: { ml: '60', pl: '6', pr: '0' },
            lg: { ml: '80', pl: '4' }
          })}
        >
          <SelectedTags />

          <div className={css({ w: 'full' })}>
            {isLoading && (
              <div className={restaurantGrid}>
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton
                    key={i}
                    className={css({ w: 'full', h: '72', xl: { h: '80' } })}
                  />
                ))}
              </div>
            )}

            {isSuccess && filteredData.length > 0 && (
              <div className={restaurantGrid}>
                {filteredData.map((restaurant: any) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
