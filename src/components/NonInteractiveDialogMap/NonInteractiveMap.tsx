import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import { ForkKnife, MapPin } from 'phosphor-react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

type NonInteractiveMapProps = {
  coordinates: { lat: number; lng: number }
}
export default function NonInteractiveMap({
  coordinates
}: NonInteractiveMapProps) {
  const mapContainer = useRef<any>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    map.current = new mapboxgl.Map({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '',
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
    <div className={clsx('relative overflow-hidden rounded h-full', 'xs:mx-4')}>
      <div
        className={clsx(
          'flex absolute overflow-visible top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10'
        )}
      >
        <MapPin
          // Tamanho do ícone: 32.5px
          // Ícone está centralizado em div de 40 de altura: 40 - 32.5 = 7.5 -> 7.5/2 = 3.25px
          // Quero que a ponta do pin esteja no centro do div anterior: 40/2 = 20 -> 20 - 3.25 = 16.75
          className={clsx(
            'peer z-10 -mt-[16.75px] w-10 h-10 fill-light-orange-200 text-light-gray-800/80 [&_path]:opacity-100 [&_path]:stroke-[8px] [&_circle]:stroke-[8px]',
            'transition-all duration-150 ease-in',
            'drop-shadow-[2px_0_0_#292524cc]'
          )}
          weight="duotone"
        />

        <div
          className={clsx(
            "after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2",
            'after:shadow-[0_0_5px_5px_rgba(0,0,0,0.5)]'
          )}
        />

        <div className="flex box-content absolute w-5 h-5 top-0 right-0 border-2 border-light-gray-800/80 translate-x-1/4 -translate-y-3/4 rounded-full bg-light-gray-100 z-10">
          <ForkKnife
            className="m-auto w-4 h-4 fill-light-orange-300 text-light-gray-800/80 [&_path]:opacity-100"
            weight="duotone"
          />
        </div>
      </div>

      <div id="map-container" ref={mapContainer} className="h-full" />
    </div>
  )
}
