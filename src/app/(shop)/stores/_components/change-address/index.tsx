'use client'

import { GeocodingResponse } from '@mapbox/search-js-core'
import { Portal } from '@zag-js/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CloseIcon } from '@/src/components/icons/close'
import { MovedLocationIcon } from '@/src/components/icons/moved-location'
import { Button } from '@/src/components/ui/button'
import { Dialog } from '@/src/components/ui/dialog/index'
import { toaster } from '@/src/components/ui/toast/toast'
import { usePosition } from '@/src/contexts/position-context'
import { logger } from '@/src/lib/logger'
import { encodeGeohash } from '@/src/utils/geohash'
import { css } from '@/styled-system/css'
import { Map } from './map'

const log = logger.child({
  module: 'client',
  page: 'Stores',
  component: 'ChangeAddress'
})

export function ChangeAddress() {
  const router = useRouter()
  const [mapReady, setMapReady] = useState(false)
  const [node, setNode] = useState<HTMLDivElement | null>(null)
  const { state, setPending, confirmPending } = usePosition()
  const abortRef = useRef<AbortController | null>(null)

  const coordinates = useMemo(() => {
    return state.currentPosition
      ? {
          lat: state.currentPosition.coordinates.latitude,
          lng: state.currentPosition.coordinates.longitude
        }
      : null
  }, [state.currentPosition])

  const handleContentRef = useCallback((n: HTMLDivElement | null) => {
    setNode(n)
  }, [])

  const handleChangeCoordinates = useCallback(
    async (coordinates: { latitude: number; longitude: number }) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      const url = new URL('https://api.mapbox.com/search/geocode/v6/reverse')
      url.searchParams.set('longitude', String(coordinates.longitude))
      url.searchParams.set('latitude', String(coordinates.latitude))
      url.searchParams.set('language', 'pt')
      url.searchParams.set('limit', '1')
      url.searchParams.set(
        'access_token',
        process.env.NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY ?? ''
      )

      try {
        const res = await fetch(url, { signal: controller.signal })

        const json: GeocodingResponse = await res.json()

        if (abortRef.current !== controller) return

        if (json.features.length !== 0) {
          const longitude = json.features[0].geometry.coordinates[0]
          const latitude = json.features[0].geometry.coordinates[1]
          const geohash = encodeGeohash({ latitude, longitude })
          const place = json.features[0].properties.context.place?.name
          const fullAddress = json.features[0].properties.full_address

          if (!place || !geohash) {
            toaster.error({
              description: 'Falha ao processar a localização informada.'
            })
            return
          }

          setPending({
            coordinates: { latitude, longitude },
            geohash,
            fullAddress,
            place
          })
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        log.error(
          { error, coordinates },
          'Error fetching coordinates from Mapbox'
        )
      }
    },
    [setPending]
  )

  function handleSubmit(onSuccess: () => void) {
    const pending = state.pendingPosition
    if (!pending) {
      toaster.error({
        description: 'Falha ao processar a localização informada.'
      })
      return
    }

    confirmPending()
    const params = new URLSearchParams({
      place: pending.place,
      geohash: pending.geohash
    }).toString()
    router.push(`/stores?${params}`)
    onSuccess()
  }

  useEffect(() => {
    if (!node) return

    const handler = () => setMapReady(true)
    node.addEventListener('animationend', handler, { once: true })

    return () => node.removeEventListener('animationend', handler)
  }, [node])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  return (
    <div>
      <Dialog.Root
        size="md"
        onOpenChange={({ open }) => {
          if (!open) setMapReady(false)
        }}
      >
        <Dialog.Trigger asChild>
          <Button
            variant="solid"
            icon={<MovedLocationIcon />}
            iconPlacement="left"
            className={css({ width: { base: 'unset', expanded: '100%' } })}
          >
            Mude seu endereço
          </Button>
        </Dialog.Trigger>

        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content ref={handleContentRef}>
              {({ setOpen }) => (
                <>
                  <header
                    className={css({
                      display: 'flex',
                      paddingBlockStart: { base: '4', medium: '6' },
                      paddingBlockEnd: '4',
                      paddingInline: { base: '4', medium: '6' },
                      alignItems: 'start',
                      justifyContent: 'space-between'
                    })}
                  >
                    <Dialog.Title
                      as="h2"
                      className={css({
                        minHeight: '10',
                        justifySelf: 'center',
                        textStyle: 'xl',
                        paddingTop: 'calc((40px - 1.4em) / 2)'
                      })}
                    >
                      Mude seu endereço
                    </Dialog.Title>

                    <Dialog.CloseTrigger asChild>
                      <Button className={css({ padding: 0 })}>
                        <CloseIcon />
                      </Button>
                    </Dialog.CloseTrigger>
                  </header>

                  <main
                    className={css({
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'auto'
                    })}
                  >
                    <Dialog.Description
                      className={css({
                        paddingInline: { base: '4', medium: '6' }
                      })}
                    >
                      <p>Mova o mapa para definir o novo ponto de entrega</p>
                    </Dialog.Description>

                    <div
                      className={css({
                        position: 'relative',
                        width: '100%',
                        height: '50dvh'
                      })}
                    >
                      {mapReady && (
                        <Map
                          onChange={handleChangeCoordinates}
                          point={coordinates}
                        />
                      )}
                    </div>
                  </main>

                  <footer
                    className={css({
                      display: 'flex',
                      paddingBlockStart: '4',
                      paddingBlockEnd: { base: '4', medium: '6' },
                      paddingInline: { base: '4', medium: '6' },
                      flexDirection: 'column',
                      gap: '4'
                    })}
                  >
                    <div className={css({ height: '10' })}>
                      <p>{state.pendingPosition?.fullAddress ?? ''}</p>
                    </div>

                    <div
                      className={css({
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '2'
                      })}
                    >
                      <Button variant="ghost" onClick={() => setOpen(false)}>
                        Fechar
                      </Button>

                      <Button
                        variant="solid"
                        onClick={() => handleSubmit(() => setOpen(false))}
                      >
                        Confirmar
                      </Button>
                    </div>
                  </footer>
                </>
              )}
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </div>
  )
}
