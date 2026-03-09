import { useEffect, useRef } from 'react'
import { MapPin } from 'phosphor-react'
import mapboxgl from 'mapbox-gl'
import { useFilter } from '../../contexts/filter-context'
import { decodeGeohash } from '../../utils/geohash'
import { municipalitiesCovered } from '../../../municipalitiesCovered'

import 'mapbox-gl/dist/mapbox-gl.css'
import { css } from '@/styled-system/css'

type MapInsideDialogProps = {
  onCoordinatesChange: (coord: { lat: number; lng: number }) => void
}
export function MapInsideDialog({ onCoordinatesChange }: MapInsideDialogProps) {
  const { state } = useFilter()
  const mapContainer = useRef<any>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    map.current = new mapboxgl.Map({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY ?? '',
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-40.25616187455981, -19.022474801531843],
      zoom: 9
    })

    if (state.currentPosition) {
      const { latitude, longitude } = decodeGeohash(
        state.currentPosition.geohash
      )
      map.current.setCenter([longitude, latitude])
      map.current.setZoom(15)
    }

    map.current.on('move', e => {
      if (!map.current) return

      const pinElement = document.getElementById('pin-dialog')

      if (pinElement) {
        pinElement.classList.remove('placed')
      }
    })
    map.current.on('moveend', e => {
      if (!map.current) return

      const pinElement = document.getElementById('pin-dialog')
      if (pinElement && pinElement.classList.contains('inside')) {
        pinElement.classList.add('placed')
        onCoordinatesChange(map.current.getCenter())
      }
    })

    map.current.on('load', e => {
      if (!map.current) return

      map.current.addSource('municipalities-covered', {
        type: 'geojson',
        data: municipalitiesCovered
      })

      map.current.addLayer({
        id: 'municipalities-fill-id',
        type: 'fill',
        source: 'municipalities-covered',
        layout: {},
        paint: {
          'fill-color': '#f59e0b',
          'fill-opacity': 0.1
        }
      })
      map.current.addLayer({
        id: 'municipalities-borders-id',
        type: 'line',
        source: 'municipalities-covered',
        layout: {},
        paint: {
          'line-color': '#000000',
          'line-width': 1
        }
      })

      map.current.on('move', e => {
        if (!map.current) return

        const mapElement = document.getElementById('map-container-dialog')
        let point
        if (mapElement)
          point = new mapboxgl.Point(
            mapElement.offsetWidth / 2,
            mapElement.offsetHeight / 2
          )

        const features = map.current.queryRenderedFeatures(point, {
          layers: ['municipalities-fill-id']
        })

        if (features.length) {
          const pinElement = document.getElementById('pin-dialog')
          if (pinElement) pinElement.classList.add('inside')
        } else {
          const pinElement = document.getElementById('pin-dialog')
          if (pinElement) pinElement.classList.remove('inside')
        }
      })
    })

    map.current.addControl(new mapboxgl.NavigationControl())
    map.current.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }))

    map.current.resize()

    return () => map.current?.remove()
  }, [])

  return (
    <div
      className={css({
        position: 'relative',
        overflow: 'hidden',
        rounded: 'sm',
        h: 'full',
        xs: { mx: '4' }
      })}
    >
      <div
        className={css({
          display: 'flex',
          position: 'absolute',
          overflow: 'visible',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: '10',
          w: '10',
          h: '10'
        })}
      >
        <MapPin
          id="pin-dialog"
          // Tamanho do ícone: 32.5px
          // Ícone está centralizado em div de 40 de altura: 40 - 32.5 = 7.5 -> 7.5/2 = 3.25px
          // Quero que a ponta do pin esteja no centro do div anterior: 40/2 = 20 -> 20 - 3.25 = 16.75
          className={`peer ${css({
            mt: '-16.75px',
            w: '10',
            h: '10',
            zIndex: '10',
            fill: 'light.orange.200',
            color: 'light.gray.800/80',
            transition: 'all 150ms ease-in',
            filter: 'drop-shadow(2px 0 0 #292524cc)',
            '& path': { opacity: '1', strokeWidth: '8px' },
            '& circle': { strokeWidth: '8px' },
            '&:not(.inside)': {
              filter: 'grayscale(1)'
            },
            '&:not(.placed)': {
              transform: 'translateY(-25%)',
              '& + #pin-shadow-dialog::after': {
                boxShadow: '0 0 10px 5px rgba(0,0,0,0.5)'
              }
            },
            '&.placed': {
              transform: 'translateY(0)',
              '& + #pin-shadow-dialog::after': {
                boxShadow: '0 0 5px 5px rgba(0,0,0,0.5)'
              }
            }
          })}`}
          weight="duotone"
        />

        <div
          id="pin-shadow-dialog"
          className={css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            '&::after': {
              content: '""',
              position: 'absolute',
              transition: 'all 150ms ease-in'
            }
          })}
        />
      </div>

      <div
        id="map-container-dialog"
        ref={mapContainer}
        className={css({
          height: '100%'
        })}
      />
    </div>
  )
}
