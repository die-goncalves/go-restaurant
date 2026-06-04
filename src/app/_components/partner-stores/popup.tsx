'use client'

import mapboxgl from 'mapbox-gl'
import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { css } from '@/styled-system/css'
import { StoreFeature } from '.'

interface PopupProps {
  feature: StoreFeature
  map: mapboxgl.Map | null
}
export default function Popup({ map, feature }: PopupProps) {
  const popupRef = useRef<mapboxgl.Popup | null>(null)
  const container = useMemo(() => {
    if (typeof document === 'undefined') return null
    return document.createElement('div')
  }, [])

  useEffect(() => {
    if (!map || !container) return

    popupRef.current = new mapboxgl.Popup({
      anchor: 'bottom',
      closeOnClick: false,
      closeButton: false,
      offset: 40,
      focusAfterOpen: false,
      className: css({
        '& .mapboxgl-popup-content': {
          paddingInline: '4 !important',
          paddingBlock: '2 !important',
          overflow: 'hidden',
          borderRadius: '0px !important',
          background: 'var(--colors-primary) !important',
          color: 'var(--colors-primary-on) !important'
        },
        '& .mapboxgl-popup-close-button': {
          height: '10',
          width: '10'
        },
        '& .mapboxgl-popup-tip': {
          display: 'none'
        }
      })
    })

    return () => {
      popupRef.current?.remove()
    }
  }, [container, map])

  useEffect(() => {
    if (!container || !feature || !map) return

    popupRef.current
      ?.setLngLat([
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1]
      ])
      .setDOMContent(container)
      .addTo(map)
  }, [container, feature, map])

  if (!container) return null

  return (
    <>
      {createPortal(
        <div className={css({})}>
          <p
            className={css({
              fontFamily: 'serif',
              fontSize: 'lg',
              textAlign: 'center',
              lineHeight: '1.5'
            })}
          >
            {feature?.properties.name}
          </p>
        </div>,
        container
      )}
    </>
  )
}
