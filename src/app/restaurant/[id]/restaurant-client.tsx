'use client'

import { useEffect, useMemo, useState } from 'react'
import NextImage from 'next/image'
import { useSearchParams } from 'next/navigation'
import { setCookie } from 'nookies'
import { WhatsappLogo } from 'phosphor-react'
import {
  TFoodRating,
  TFoods,
  TOperatingHours,
  TRestaurant,
  TTag
} from '@/src/types'
import { usePosition } from '@/src/contexts/position-context'
import { useAuth } from '@/src/contexts/auth-context'
import { whenOpen } from '@/src/utils/restaurantOperation'
import { decodeGeohash } from '@/src/utils/geohash'
import { geographicInformation } from '@/src/utils/geographicInformation'
import { getRouteTimeAndDistance } from '@/src/utils/directionsMapBox'
import { shimmerBase64 } from '@/src/utils/blurDataURL'
import { Account } from '@/src/components/account'
import { Breadcrumb } from '@/src/components/breadcrumb'
import { Rating } from '@/src/components/rating'
import { TextTag } from '@/src/components/tag/text-tag'
import { NonInteractiveDialogMap } from '@/src/components/non-interactive-dialog-map'
import { RestaurantOpeningHours } from '@/src/components/restaurant-opening-hours'
import { SignedUser } from '@/src/components/signed-user'
import { Skeleton } from '@/src/components/skeleton'
import { Logo } from '@/src/components/logo'
import { css } from '@/styled-system/css'
import { RestaurantSections } from '@/src/components/restaurant-sections'
import { RedirectWithDialogMap } from '@/src/components/redirect-with-dialog-map'
import { Cart } from '@/src/components/cart'
import { Store } from './page'

type RestaurantClientProps = {
  restaurant: Store
}

export function RestaurantClient({ restaurant }: RestaurantClientProps) {
  const { isLoading, session } = useAuth()
  const { state, handleAddPosition } = usePosition()
  const searchParams = useSearchParams()
  const [priceDistanceAndTime, setPriceDistanceAndTime] = useState<{
    price: number | undefined
    distance: number
    time: number
  }>()

  useEffect(() => {
    async function deliveryInfo() {
      if (state?.currentPosition) {
        const result = await getRouteTimeAndDistance(
          {
            lng: state.currentPosition.coordinates.longitude,
            lat: state.currentPosition.coordinates.latitude
          },
          { lng: restaurant.coordinates.lng!, lat: restaurant.coordinates.lat! }
        )
        const price = Math.round(result.distance / 1000) * 0.12

        setPriceDistanceAndTime({
          price,
          distance: result.distance,
          time: result.duration
        })

        setCookie(
          null,
          '@gorestaurant-v0.1.0:shipping',
          JSON.stringify({
            price: price.toFixed(2),
            distance: (result.distance / 1000).toFixed(2),
            time: (result.duration / 60).toFixed(2),
            user_location: state.currentPosition
          }),
          { maxAge: 60 * 60 * 24 * 365, path: '/' }
        )
      }
    }

    deliveryInfo()
  }, [restaurant, state])

  useEffect(() => {
    async function getPositionCoordinates(geohash: string) {
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

    const geohash = searchParams.get('geohash')
    if (geohash) getPositionCoordinates(geohash)
  }, [handleAddPosition, searchParams])

  const sections = useMemo(() => {
    const menu = restaurant.products.reduce<
      Record<string, { id: string; name: string }[]>
    >((acc, product, index) => {
      const id = String(index + 1)

      product.sections.forEach(section => {
        acc[section] ??= []
        acc[section].push({ id, name: product.name })
      })

      return acc
    }, {})
    const sortedMenu = (
      Object.entries(menu) as [string, { id: string; name: string }[]][]
    )
      .map(
        ([section, products]) =>
          [
            section,
            [...products].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
          ] as [string, { id: string; name: string }[]]
      )
      .sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'))

    return sortedMenu
  }, [restaurant])

  return (
    <div
      className={css({
        minH: '100vh',
        bg: 'light.gray.100'
      })}
    >
      <header
        className={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: '4',
          sm: { px: '6' },
          lg: { px: '8' }
        })}
      >
        <Logo />
        <div className={css({ display: 'flex', gap: '4' })}>
          <Cart />
          {isLoading ? (
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
          flexDirection: 'column',
          px: '4',
          gap: '4',
          w: 'full',
          h: 'min',
          sm: {
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            px: '6',
            gap: '1'
          },
          lg: { px: '8', gap: '0' },
          xl: { gap: '8' }
        })}
      >
        <div>
          <Breadcrumb.Root>
            <Breadcrumb.Link isHomePage href="/">
              Página inicial
            </Breadcrumb.Link>
            <Breadcrumb.Link
              href={`/restaurants?place=${restaurant.neighborhood}&geohash=${state.currentPosition?.geohash}`}
            >
              {restaurant.neighborhood}
            </Breadcrumb.Link>
            <Breadcrumb.Link href="#" isCurrentPage>
              {restaurant.name}
            </Breadcrumb.Link>
          </Breadcrumb.Root>

          <div
            className={css({
              display: 'flex',
              mt: '3',
              alignItems: 'center',
              gap: '2'
            })}
          >
            <h1 className={css({ fontSize: '3xl', fontWeight: 'medium' })}>
              {restaurant.name}
            </h1>
            {/* <RestaurantOpeningHours
              operatingHours={restaurant.operating_hours}
              isRestaurantOpen={restaurant.is_open}
            /> */}
          </div>

          <div
            className={css({
              display: 'flex',
              mt: '2',
              alignItems: 'center',
              gap: '1'
            })}
          >
            <Rating
              rating={restaurant.average_rating!}
              reviews={restaurant.total_reviews!}
            />
          </div>

          <div
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              pt: '2',
              gap: '2'
            })}
          >
            {sections.map(([section, _products]) => (
              <TextTag key={section}>{section}</TextTag>
            ))}
          </div>

          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              pt: '2',
              lg: {
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'nowrap',
                gap: '0.5'
              }
            })}
          >
            <span>{`${priceDistanceAndTime?.distance.toFixed(2)} metros de distância de você`}</span>
            <span
              className={css({
                display: 'none',
                mx: '2',
                w: '1',
                h: '1',
                rounded: 'full',
                bg: 'light.gray.200',
                lg: { display: 'block' }
              })}
            />
            <span>{`R$${priceDistanceAndTime?.price?.toFixed(2)} para entrega`}</span>
          </div>

          <div className={css({ pt: '2' })}>
            <span>{restaurant.description}</span>
          </div>

          <div
            className={css({
              display: 'flex',
              pt: '2',
              alignItems: 'center',
              gap: '2'
            })}
          >
            {/* <NonInteractiveDialogMap
              coordinates={restaurant.coordinates}
              address={restaurant.address}
            /> */}
            <span>{restaurant.address}</span>
          </div>

          <div className={css({ display: 'flex', pt: '2' })}>
            <WhatsappLogo
              className={css({ w: '6', h: '6', color: 'green.500' })}
              weight="light"
            />
            <span className={css({ ml: '1' })}>{restaurant.phone_number}</span>
          </div>
        </div>

        <div className={css({ display: 'flex', flexDirection: 'column' })}>
          <div
            className={css({
              display: 'flex',
              position: 'relative',
              overflow: 'hidden',
              borderTopRadius: 'sm',
              h: '64',
              sm: { h: 'full' }
            })}
          >
            <NextImage
              src={restaurant.image_url!}
              alt={restaurant.name!}
              fill
              className={css({ objectFit: 'cover' })}
              placeholder="blur"
              blurDataURL={shimmerBase64}
              sizes="(max-width: 768px) 70vw, (min-width: 769px) 30vw"
            />
          </div>
          {/* <RedirectWithDialogMap
            restaurantId={restaurant.id}
            restaurantPlace={restaurant.neighborhood}
            deliveryTime={priceDistanceAndTime?.time}
          /> */}
        </div>
      </div>

      <RestaurantSections
        tags={sections.map(([section, _products]) => section)}
        restaurant={restaurant}
      />
    </div>
  )
}
