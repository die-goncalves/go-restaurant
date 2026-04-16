'use client'

import { useEffect, useState } from 'react'
import { DirectionsCarIcon } from '@/src/components/icons/directions-car'
import { DistanceIcon } from '@/src/components/icons/distance'
import { usePosition } from '@/src/contexts/position-context'
import { setCookie } from '@/src/utils/cookies'
import { getRoute } from '@/src/utils/directions'
import { css } from '@/styled-system/css'

type DeliveryProps = {
  coordinates: {
    lat: number
    lng: number
  } | null
}
export function Delivery({ coordinates }: DeliveryProps) {
  const { state } = usePosition()

  const [priceDistanceAndTime, setPriceDistanceAndTime] = useState<{
    price: number | undefined
    distance: number
    time: number
  }>()

  useEffect(() => {
    async function deliveryInfo() {
      if (state?.currentPosition && coordinates) {
        const result = await getRoute(
          {
            lng: state.currentPosition.coordinates.longitude,
            lat: state.currentPosition.coordinates.latitude
          },
          { lng: coordinates.lng, lat: coordinates.lat }
        )

        const price = Math.round(result.distance / 1000) * 0.12

        setPriceDistanceAndTime({
          price,
          distance: result.distance,
          time: result.duration
        })

        setCookie(
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
  }, [coordinates, state])

  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: '2'
      })}
    >
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          gap: '2',
          color: 'surface.on'
        })}
      >
        <div className={css({ alignSelf: 'start' })}>
          <div
            className={css({
              height: '10',
              minWidth: '10',
              display: 'inline-flex',
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center'
            })}
          >
            <DistanceIcon className={css({ width: '5', height: '5' })} />
          </div>
        </div>

        <p>
          {priceDistanceAndTime
            ? `${priceDistanceAndTime.distance.toFixed(2)} metros de distância de você`
            : 'Adicione um local de entrega'}
        </p>
      </div>

      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          gap: '2',
          color: 'surface.on'
        })}
      >
        <div className={css({ alignSelf: 'start' })}>
          <div
            className={css({
              height: '10',
              minWidth: '10',
              display: 'inline-flex',
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center'
            })}
          >
            <DirectionsCarIcon className={css({ width: '5', height: '5' })} />
          </div>
        </div>
        <p>
          {priceDistanceAndTime
            ? `R$${priceDistanceAndTime.price?.toFixed(2)} para entregar`
            : 'Adicione um local de entrega'}
        </p>
      </div>
    </div>
  )
}
