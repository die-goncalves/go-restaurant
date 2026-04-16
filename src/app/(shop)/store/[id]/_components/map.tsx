'use client'

import mapboxgl from 'mapbox-gl'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { mesh } from '@/src/lib/mesh'
import { css } from '@/styled-system/css'

const Marker = dynamic(() => import('./marker'), {
  ssr: false
})

type MapProps = {
  point: {
    lat: number
    lng: number
  } | null
}
export function Map({ point }: MapProps) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    mapboxgl.accessToken =
      process.env.NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY ?? ''

    const instance = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: point!,
      zoom: 13,
      projection: 'mercator',
      style: 'mapbox://styles/mapbox/streets-v12',
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
  }, [point])

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
      {point && <Marker point={[point.lng, point.lat]} map={map} />}
    </>
  )
}
