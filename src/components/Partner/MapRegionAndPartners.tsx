import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { FeatureCollection } from 'geojson'
import { municipalitiesCovered } from '../../../municipalitiesCovered'
import { useMediaQuery } from 'react-responsive'

import 'mapbox-gl/dist/mapbox-gl.css'

type MapRegionAndPartnersProp = {
  geoJSON: FeatureCollection
}
export default function MapRegionAndPartners({
  geoJSON
}: MapRegionAndPartnersProp) {
  const mapContainer = useRef<any>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  const is3xs = useMediaQuery({ minWidth: 320, maxWidth: 359 })
  const is2xs = useMediaQuery({ minWidth: 360, maxWidth: 411 })
  const isxs = useMediaQuery({ minWidth: 412, maxWidth: 639 })
  const issm = useMediaQuery({ minWidth: 640, maxWidth: 767 })
  const ismd = useMediaQuery({ minWidth: 768, maxWidth: 1023 })
  const islg = useMediaQuery({ minWidth: 1024 })
  const breakpoint = ((): string => {
    if (is3xs) return '3xs'
    if (is2xs) return '2xs'
    if (isxs) return 'xs'
    if (issm) return 'sm'
    if (ismd) return 'md'
    if (islg) return 'lg'
    return ''
  })()

  useEffect(() => {
    // const breakpoint = getCurrentBreakpoint()

    map.current = new mapboxgl.Map({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '',
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center:
        breakpoint === '3xs'
          ? [-40.0712, -18.9029]
          : breakpoint === '2xs'
          ? [-40.4074, -19.3035]
          : breakpoint === 'xs'
          ? [-40.6689, -19.673]
          : breakpoint === 'sm'
          ? [-40.6443, -19.0702]
          : breakpoint === 'md'
          ? [-40.6555, -19.6273]
          : breakpoint === 'lg'
          ? [-42.0681, -19.442]
          : [-42.5295, -19.4766],
      zoom: 7
    })

    map.current.on('load', () => {
      if (!map.current) return

      map.current.addSource('places', {
        type: 'geojson',
        data: geoJSON
      })
      geoJSON.features.forEach((item: any) => {
        if (map.current) {
          const popup = new mapboxgl.Popup({
            closeOnClick: true,
            maxWidth: 'none',
            offset: 40,
            anchor: 'bottom'
          }).setHTML(`
            <div class="restaurant-container">
              <img class="restaurant-img" src=${item.properties.image.src} alt=${item.properties.image.alt} />
    
              <div class="restaurant-content">
                <header class="restaurant-header">
                  <div>
                    <span>${item.properties.name}</span>
                    <svg class="restaurant-icon-star" xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill=${item.properties.starColor} viewBox="0 0 256 256">
                      <rect width="256" height="256" fill="none"></rect>
                      <line x1="128" y1="24" x2="128" y2="189.4" fill="none" stroke=${item.properties.starColor} stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line>
                      <path d="M220.2,116.6l8.7-7.3c5.9-4.9,2.9-14.8-4.8-15.3l-11.5-.7" fill="none" stroke=${item.properties.starColor} stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path>
                      <path d="M184.1,168.9l-3.3-13.1a8.7,8.7,0,0,1,2.9-8.8l10-8.4" fill="none" stroke=${item.properties.starColor} stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path>
                      <path d="M178.2,91l-13.1-.8a8.3,8.3,0,0,1-7.3-5.4L152.7,72,135.8,29.4a8.3,8.3,0,0,0-15.6,0l-22,55.4a8.3,8.3,0,0,1-7.3,5.4L31.9,94c-7.7.5-10.7,10.4-4.8,15.3L72.3,147a8.7,8.7,0,0,1,2.9,8.8L61.7,209c-2.3,9,7.3,16.3,15,11.4l46.9-29.7a8.2,8.2,0,0,1,8.8,0l11.5,7.3" fill="none" stroke=${item.properties.starColor} stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path>
                      <path d="M173,216.5l9.8,6.2c6.5,4.1,14.5-2,12.6-9.5l-2.8-10.9" fill="none" stroke=${item.properties.starColor} stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path>
                    </svg>
                  </div>
                  <div class="restaurant-phone">
                    <svg class="restaurant-icon-phone" xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 256 256">
                      <rect width="256" height="256" fill="none"></rect>
                      <path d="M159.4,40A80.1,80.1,0,0,1,216,96.6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"></path><path d="M151.1,70.9a47.9,47.9,0,0,1,34,34" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"></path><path d="M92.5,124.8a83.6,83.6,0,0,0,39,38.9,8,8,0,0,0,7.9-.6l25-16.7a7.9,7.9,0,0,1,7.6-.7l46.8,20.1a7.9,7.9,0,0,1,4.8,8.3A48,48,0,0,1,176,216,136,136,0,0,1,40,80,48,48,0,0,1,81.9,32.4a7.9,7.9,0,0,1,8.3,4.8l20.1,46.9a8,8,0,0,1-.6,7.5L93,117A8,8,0,0,0,92.5,124.8Z" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"></path>
                    </svg>
                    <span>${item.properties.phone}</span>
                  </div>
                </header>
                <main class="restaurant-main">
                  <span class="restaurant-description">${item.properties.description}</span>
                </main>
              </div>
            </div>
          `)

          new mapboxgl.Marker({ color: '#fcd34d' })
            .setLngLat(item.geometry.coordinates)
            .setPopup(popup)
            .addTo(map.current)
            .getElement()
            .addEventListener('click', () => {
              if (map.current)
                map.current.flyTo({
                  center:
                    breakpoint === '3xs' ||
                    breakpoint === '2xs' ||
                    breakpoint === 'xs' ||
                    breakpoint === 'sm' ||
                    breakpoint === 'md'
                      ? [
                          item.geometry.coordinates[0],
                          item.geometry.coordinates[1]
                        ]
                      : breakpoint === 'lg'
                      ? [
                          item.geometry.coordinates[0] - 0.0105,
                          item.geometry.coordinates[1]
                        ]
                      : [
                          item.geometry.coordinates[0] - 0.0125,
                          item.geometry.coordinates[1]
                        ],
                  zoom: 14
                })
            })
        }
      })
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
    })

    map.current.scrollZoom.disable()

    const navigationControl = new mapboxgl.NavigationControl()
    document
      .getElementById('navigation')
      ?.appendChild(navigationControl.onAdd(map.current))
    const scaleControl = new mapboxgl.ScaleControl({ unit: 'metric' })
    document
      .getElementById('scale')
      ?.appendChild(scaleControl.onAdd(map.current))
    const attributionControl = new mapboxgl.AttributionControl()
    document
      .getElementById('attribution')
      ?.appendChild(attributionControl.onAdd(map.current))

    const bottomLeftMapbox = document.getElementsByClassName(
      'mapboxgl-ctrl-bottom-left'
    )[0]
    const cloned = bottomLeftMapbox.cloneNode(true)
    const doc = document.getElementById('inside-map')
    if (doc) doc.appendChild(cloned)

    map.current.resize()

    return () => {
      map.current?.remove()
      map.current?.removeControl(navigationControl)
      map.current?.removeControl(scaleControl)
      map.current?.removeControl(attributionControl)
      document.getElementById('inside-map')?.removeChild(cloned)
    }
  }, [breakpoint, geoJSON])

  return (
    <div
      ref={mapContainer}
      className={clsx(
        'flex overflow-hidden h-full',
        '[&_.mapboxgl-popup-close-button]:hidden',
        '[&_.mapboxgl-popup-content]:border-2 [&_.mapboxgl-popup-content]:border-light-gray-200 [&_.mapboxgl-popup-content]:drop-shadow-lg [&_.mapboxgl-popup-content]:p-0 [&_.mapboxgl-popup-content]:bg-light-gray-100 [&_.mapboxgl-popup-content]:rounded',
        '[&_.restaurant-container]:flex',
        '[&_.restaurant-img]:w-24 [&_.restaurant-img]:object-cover',
        '[&_.restaurant-content]:p-2 [&_.restaurant-content_span]:text-base [&_.restaurant-content_span]:font-sans [&_.restaurant-content_span]:text-light-gray-800',
        '[&_.restaurant-header]:flex [&_.restaurant-header]:flex-col [&_.restaurant-header>div]:flex [&_.restaurant-header>div]:justify-between [&_.restaurant-header_div:first-child_span]:font-medium',
        '[&_.restaurant-phone]:flex [&_.restaurant-phone]:gap-2 [&_.restaurant-phone]:mr-auto',
        '[&_.restaurant-description]:line-clamp-4 [&_.restaurant-description]:text-sm [&_.restaurant-description]:text-justify',
        '[&_.restaurant-icon-star]:w-6 [&_.restaurant-icon-star]:h-6',
        '[&_.restaurant-icon-phone]:w-6 [&_.restaurant-icon-phone]:h-6 [&_.restaurant-icon-phone_path]:stroke-light-gray-800',
        'sm:[&_.mapboxgl-popup-content]:w-96 sm:[&_.restaurant-img]:inline-flex sm:[&_.restaurant-img]:min-h-full',
        '2xs:[&_.mapboxgl-popup-content]:w-64',
        '3xs:[&_.mapboxgl-popup-content]:w-52 3xs:[&_.restaurant-img]:hidden'
      )}
    />
  )
}
