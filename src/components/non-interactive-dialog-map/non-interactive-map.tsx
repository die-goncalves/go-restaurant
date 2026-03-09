import { useEffect, useRef } from 'react'
import { ForkKnife, MapPin } from 'phosphor-react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'
import { css } from '@/styled-system/css'

type NonInteractiveMapProps = {
  coordinates: { lat: number; lng: number }
}
export function NonInteractiveMap({ coordinates }: NonInteractiveMapProps) {
  const mapContainer = useRef<any>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    map.current = new mapboxgl.Map({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY ?? '',
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [coordinates.lng, coordinates.lat],
      zoom: 9,
      interactive: false
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
          // Tamanho do ícone: 32.5px
          // Ícone está centralizado em div de 40 de altura: 40 - 32.5 = 7.5 -> 7.5/2 = 3.25px
          // Quero que a ponta do pin esteja no centro do div anterior: 40/2 = 20 -> 20 - 3.25 = 16.75
          className={`peer ${css({
            zIndex: '10',
            mt: '-16.75px',
            w: '10',
            h: '10',
            fill: 'light.orange.200',
            color: 'light.gray.800/80',
            transition: 'all 150ms ease-in',
            filter: 'drop-shadow(2px 0 0 #292524cc)',
            '& path': { opacity: '1', strokeWidth: '8px' },
            '& circle': { strokeWidth: '8px' }
          })}`}
          weight="duotone"
        />

        <div
          className={css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            '&::after': {
              content: '""',
              position: 'absolute',
              transition: 'all 150ms ease-in',
              boxShadow: '0 0 5px 5px rgba(0,0,0,0.5)'
            }
          })}
        />

        <div
          className={css({
            display: 'flex',
            boxSizing: 'content-box',
            position: 'absolute',
            w: '5',
            h: '5',
            top: '0',
            right: '0',
            borderWidth: '2',
            borderColor: 'light.gray.800/80',
            transform: 'translate(25%, -75%)',
            rounded: 'full',
            bg: 'light.gray.100',
            zIndex: '10'
          })}
        >
          <ForkKnife
            className={css({
              m: 'auto',
              w: '4',
              h: '4',
              fill: 'light.orange.300',
              color: 'light.gray.800/80',
              '& path': { opacity: '1' }
            })}
            weight="duotone"
          />
        </div>
      </div>

      <div ref={mapContainer} className={css({ h: 'full' })} />
    </div>
  )
}
