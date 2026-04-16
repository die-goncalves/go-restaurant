'use client'

import { Point } from 'geojson'
import mapboxgl from 'mapbox-gl'
import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { LocationOnIcon } from '@/src/components/icons/location-on'
import { css } from '@/styled-system/css'

type MarkerProps = {
  point: Point['coordinates']
  map: mapboxgl.Map | null
}
export default function Marker({ map, point }: MarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const container = useMemo(() => {
    if (typeof document === 'undefined') return null
    return document.createElement('div')
  }, [])

  useEffect(() => {
    if (!map || !container) return

    markerRef.current = new mapboxgl.Marker(container, {
      anchor: 'bottom',
      offset: [0, 3.333]
    })
      .setLngLat([point[0], point[1]])
      .addTo(map)

    return () => {
      markerRef.current?.remove()
    }
  }, [map, container, point])

  if (!container) return null

  return (
    <>
      {createPortal(
        <div
          className={css({
            position: 'relative',
            cursor: 'pointer',
            width: '10',
            fill: 'surface.on'
          })}
        >
          <LocationOnIcon />
        </div>,
        container
      )}
    </>
  )
}
