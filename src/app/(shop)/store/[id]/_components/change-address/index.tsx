'use client'

import { Portal } from '@zag-js/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { CloseIcon } from '@/src/components/icons/close'
import { MovedLocationIcon } from '@/src/components/icons/moved-location'
import { Button } from '@/src/components/ui/button'
import { Dialog } from '@/src/components/ui/dialog/index'
import { usePosition } from '@/src/contexts/position-context'
import { logger } from '@/src/lib/logger'
import { geographicInformation } from '@/src/utils/geographic-information'
import { encodeGeohash } from '@/src/utils/geohash'
import { css } from '@/styled-system/css'
import { Map } from './map'

const log = logger.child({ module: 'client', component: 'ChangeAddress' })

type ChangeAddressProps = {
  id: string | null
  neighborhood: string | null
  coord: {
    lat: number
    lng: number
  } | null
}
export function ChangeAddress({ id, neighborhood, coord }: ChangeAddressProps) {
  const router = useRouter()
  const [mapReady, setMapReady] = useState(false)
  const [node, setNode] = useState<HTMLDivElement | null>(null)
  const { state, handleTempPosition, handleChangePosition } = usePosition()
  const abortRef = useRef<AbortController | null>(null)

  const handleContentRef = useCallback((n: HTMLDivElement | null) => {
    setNode(n)
  }, [])

  const handleChangeCoordinates = useCallback(
    async (coord: { lat: number; lng: number }) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${coord.lng},${coord.lat}.json?limit=1&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY}`,
          { signal: controller.signal }
        )
        const data = await response.json()

        if (abortRef.current !== controller) return

        if (data.features.length !== 0) {
          const { granular, place, place_name } = geographicInformation(
            data.features[0]
          )
          handleTempPosition({
            coordinates: {
              latitude: data.features[0].geometry.coordinates[1],
              longitude: data.features[0].geometry.coordinates[0]
            },
            geohash: encodeGeohash({
              latitude: data.features[0].geometry.coordinates[1],
              longitude: data.features[0].geometry.coordinates[0]
            }),
            granular,
            place_name,
            place
          })
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        log.error({ error, coord }, 'Error fetching coordinates from Mapbox')
      }
    },
    [handleTempPosition]
  )

  function handleSubmit(onSuccess: () => void) {
    const pos = state.temporaryPosition
    if (!pos) {
      toast.error(
        'Não conseguimos obter as coordenadas do endereço, por favor indique no mapa.'
      )
      return
    }
    if (neighborhood !== pos.place) {
      toast.error('Região fora dos limites de entrega para este restaurante.')
      return
    }
    if (pos.place && pos.geohash) {
      router.push(`/store/${id}?geohash=${pos.geohash}`)
      handleChangePosition()
      onSuccess()
    } else {
      toast.error(
        'Não conseguimos obter as coordenadas do endereço, por favor indique no mapa.'
      )
    }
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
            className={css({ paddingInlineStart: '2.5', gap: '4.5' })}
            aria-label="Ver localização da loja"
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
                        <Map onChange={handleChangeCoordinates} point={coord} />
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
                      <p>{state.temporaryPosition?.place_name ?? ''}</p>
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
