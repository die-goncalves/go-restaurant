'use client'

import mapboxgl from 'mapbox-gl'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { mesh } from '@/src/lib/mesh'
import { css } from '@/styled-system/css'
import { StoreFeatureCollection } from '.'
import { usePartnerStores } from './partner-stores-context'

const Marker = dynamic(() => import('./markers'), {
  ssr: false
})
const Popup = dynamic(() => import('./popup'), {
  ssr: false
})

type MapProps = {
  geojson: StoreFeatureCollection
}
export function Map({ geojson }: MapProps) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const { store } = usePartnerStores()

  useEffect(() => {
    if (!mapContainerRef.current) return

    mapboxgl.accessToken =
      process.env.NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY ?? ''

    const instance = new mapboxgl.Map({
      container: mapContainerRef.current,
      // https://labs.mapbox.com/location-helper/
      bounds: [
        [-40.4056, -19.1605],
        [-39.7209, -18.4441]
      ],
      projection: 'mercator', //equirectangular
      style: 'mapbox://styles/mapbox/streets-v12',
      // //  STANDARD
      // style: 'mapbox://styles/mapbox/standard'
      // config: {
      //   basemap: {
      //     lightPreset: 'dawn',
      //     theme: 'default'
      //   }
      // }
      cooperativeGestures: true,
      language: 'pt',
      locale: {
        'AttributionControl.ToggleAttribution': 'Alternar atribuição',
        'FullscreenControl.Enter': 'Entrar em modo tela cheia',
        'FullscreenControl.Exit': 'Sair do modo tela cheia',
        'GeolocateControl.FindMyLocation': 'Encontrar minha localização',
        'GeolocateControl.LocationNotAvailable': 'Localização não disponível',
        'LogoControl.Title': 'Página inicial do Mapbox',
        'Map.Title': 'Mapa',
        'NavigationControl.ResetBearing': 'Redefinir orientação para o norte',
        'NavigationControl.ZoomIn': 'Aumentar zoom',
        'NavigationControl.ZoomOut': 'Diminuir zoom',
        'ScrollZoomBlocker.CtrlMessage':
          'Use ctrl + scroll para dar zoom no mapa',
        'ScrollZoomBlocker.CmdMessage': 'Use ⌘ + scroll para dar zoom no mapa',
        'TouchPanBlocker.Message': 'Use dois dedos para mover o mapa'
      }
    })

    instance.addControl(
      new mapboxgl.NavigationControl({
        showZoom: false,
        visualizePitch: true
      })
    )
    instance.addControl(new mapboxgl.ScaleControl())

    instance.on('style.load', () => {
      instance.addSource('urban-areas', {
        type: 'geojson',
        data: mesh
      })

      instance.addLayer({
        id: 'urban-areas-fill',
        type: 'fill',
        slot: 'middle',
        source: 'urban-areas',
        layout: {},
        paint: {
          'fill-color': '#000',
          'fill-opacity': 0 // 0.125
        }
      })

      instance.addLayer({
        id: 'urban-areas-border',
        type: 'line',
        source: 'urban-areas',
        layout: {},
        paint: {
          'line-color': '#000',
          'line-width': 1
        }
      })
    })

    mapRef.current = instance
    setMap(instance)

    return () => {
      instance.remove()
      mapRef.current = null
      setMap(null)
    }
  }, [])

  useEffect(() => {
    if (!store || !mapRef.current) return

    mapRef.current.flyTo({
      center: [store.geometry.coordinates[0], store.geometry.coordinates[1]],
      zoom: 13,
      duration: 1000
    })
  }, [store])

  return (
    <>
      <div
        className={css({
          position: 'relative',
          width: '100%',
          height: '100%'
        })}
        ref={mapContainerRef}
      />
      {geojson.features.map((f, idx) => (
        <Marker key={idx} feature={f} map={map} />
      ))}

      {store && <Popup feature={store} map={map} />}
    </>
  )
}
