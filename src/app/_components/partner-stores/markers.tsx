'use client'

import mapboxgl from 'mapbox-gl'
import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { css } from '@/styled-system/css'
import { LocationOnIcon } from '../../../components/icons/location-on'
import { StoreFeature } from '.'
import { usePartnerStores } from './partner-stores-context'

interface MarkerProps {
  feature: StoreFeature
  map: mapboxgl.Map | null
}

export default function Marker({ map, feature }: MarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const container = useMemo(() => {
    if (typeof document === 'undefined') return null
    return document.createElement('div')
  }, [])
  const { changeStore } = usePartnerStores()

  useEffect(() => {
    if (!map || !container) return

    markerRef.current = new mapboxgl.Marker(container, {
      anchor: 'bottom',
      offset: [0, 3.333]
    })
      .setLngLat([
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1]
      ])
      .addTo(map)

    return () => {
      markerRef.current?.remove()
    }
  }, [feature, map, container])

  if (!container) return null

  return (
    <>
      {createPortal(
        <div
          onClick={() => changeStore(feature)}
          className={css({
            position: 'relative',
            cursor: 'pointer',
            width: '10',
            _icon: {
              fill: 'surface.on'
            }
          })}
        >
          <LocationOnIcon />
        </div>,
        container
      )}
    </>
  )
}
