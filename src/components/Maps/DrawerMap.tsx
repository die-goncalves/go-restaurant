import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { MapPin } from 'phosphor-react'
import mapboxgl from 'mapbox-gl'
import { municipalitiesCovered } from '../../../municipalitiesCovered'

import 'mapbox-gl/dist/mapbox-gl.css'

export default function DrawerMap() {
  const mapContainer = useRef<any>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const position = useRef<any>(null)

  useEffect(() => {
    map.current = new mapboxgl.Map({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '',
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-40.31, -19.03],
      zoom: 8.9
    })

    map.current.on('move', e => {
      if (!map.current) return

      const pinElement = document.getElementById('pin')

      if (pinElement) {
        pinElement.classList.remove('placed')
      }
    })
    map.current.on('moveend', e => {
      if (!map.current) return

      const pinElement = document.getElementById('pin')
      if (pinElement && pinElement.classList.contains('inside')) {
        pinElement.classList.add('placed')
        position.current = map.current.getCenter()
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

        const mapElement = document.getElementById('map-container')
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
          const pinElement = document.getElementById('pin')
          if (pinElement) pinElement.classList.add('inside')
        } else {
          const pinElement = document.getElementById('pin')
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
    <div className="relative mx-4 overflow-hidden rounded h-full">
      <div
        className={clsx(
          'flex absolute overflow-visible top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10'
        )}
      >
        <MapPin
          id="pin"
          // Tamanho do ícone: 32.5px
          // Ícone está centralizado em div de 40 de altura: 40 - 32.5 = 7.5 -> 7.5/2 = 3.25px
          // Quero que a ponta do pin esteja no centro do div anterior: 40/2 = 20 -> 20 - 3.25 = 16.75
          className={clsx(
            'peer z-10 -mt-[16.75px] w-10 h-10 fill-light-orange-200 text-light-gray-800/80 [&_path]:opacity-100 [&_path]:stroke-[8px] [&_circle]:stroke-[8px]',
            'transition-all duration-150 ease-in',
            '[&:not(.inside)]:grayscale',
            '[&:not(.placed)]:-translate-y-1/4',
            '[&.placed]:-translate-y-0',
            'drop-shadow-[2px_0_0_#292524cc]'
          )}
          weight="duotone"
        />

        <div
          className={clsx(
            "after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2",
            'after:transition after:duration-150 after:ease-in',
            'peer-[:not(.placed)]:after:shadow-[0_0_10px_5px_rgba(0,0,0,0.5)]',
            'peer-[.placed]:after:shadow-[0_0_5px_5px_rgba(0,0,0,0.5)]'
          )}
        />
      </div>

      <div id="map-container" ref={mapContainer} className="h-full" />
    </div>
  )
}
