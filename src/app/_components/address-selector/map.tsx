'use client'

import mapboxgl from 'mapbox-gl'
import { useEffect, useRef } from 'react'
import { LocationOnIcon } from '@/src/components/icons/location-on'
import { mesh } from '@/src/lib/mesh'
import { css } from '@/styled-system/css'

type MapProps = {
  onChange: (coordinates: {
    latitude: number
    longitude: number
  }) => Promise<void>
}
export function Map({ onChange }: MapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    mapboxgl.accessToken =
      process.env.NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY ?? ''

    const instance = new mapboxgl.Map({
      container: mapContainerRef.current,
      bounds: [
        [-40.4056, -19.1605],
        [-39.7209, -18.4441]
      ],
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

    return () => {
      instance.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    mapRef.current.on('move', ({ target }) => {
      if (mapContainerRef.current) {
        const point = new mapboxgl.Point(
          mapContainerRef.current.offsetWidth / 2,
          mapContainerRef.current.offsetHeight / 2
        )

        const features =
          target.queryRenderedFeatures(point, {
            layers: ['urban-areas-fill']
          }) ?? []

        if (features.length) {
          markerRef.current?.classList.add('inside')
        } else {
          markerRef.current?.classList.remove('inside')
        }
      }
    })
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    mapRef.current.on('moveend', ({ target }) => {
      if (markerRef.current?.classList.contains('inside')) {
        const { lat, lng } = target.getCenter()
        onChange({ latitude: lat, longitude: lng })
      }
    })
  }, [onChange])

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
      <div
        className={css({
          display: 'flex',
          position: 'absolute',
          top: '50%',
          left: '50%',
          boxSize: '10',
          transform: 'translate(-50%, -100%)'
        })}
      >
        <div
          className={css({
            position: 'relative',
            marginTop: '3.333px',
            width: '10',
            _icon: { fill: 'primary' },
            transitionProperty: 'opacity',
            transitionDuration: '200ms',
            transitionTimingFunction:
              'token(easings.expressive-default-effects)',
            '&:not(.inside)': {
              opacity: 0.64,
              transitionDuration: '150ms',
              transitionTimingFunction: 'token(easings.expressive-fast-effects)'
            }
          })}
          ref={markerRef}
        >
          <LocationOnIcon />
        </div>
      </div>
    </>
  )
}
