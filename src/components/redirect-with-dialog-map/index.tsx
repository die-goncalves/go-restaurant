'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Car, X } from 'phosphor-react'
import { usePosition } from '../../contexts/position-context'
import { geographicInformation } from '../../utils/geographicInformation'
import { encodeGeohash } from '../../utils/geohash'
import { Dialog } from '../dialog'
import { TextInput } from '../text-input'
import { RedirectMap } from './redirect-map'
import { css, cx } from '@/styled-system/css'

type RedirectWithDialogMapProps = {
  restaurantId: string
  restaurantPlace: string
  deliveryTime: number | undefined
}
export function RedirectWithDialogMap({
  restaurantId,
  restaurantPlace,
  deliveryTime
}: RedirectWithDialogMapProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [coordinates, setCoordinates] = useState<{
    lat: number
    lng: number
  }>()
  const { state, handleTempPosition, handleChangePosition } = usePosition()

  function handleSubmit() {
    const pos = state.temporaryPosition
    if (!pos) {
      toast.error(
        'Não conseguimos obter as coordenadas do endereço, por favor indique no mapa.'
      )
      return
    }
    if (restaurantPlace !== pos.place) {
      toast.error('Região fora dos limites de entrega para este restaurante.')
      return
    }
    if (pos.place && pos.geohash) {
      router.push(`/restaurant/${restaurantId}?geohash=${pos.geohash}`)
      handleChangePosition()
      setOpen(false)
    } else {
      toast.error(
        'Não conseguimos obter as coordenadas do endereço, por favor indique no mapa.'
      )
    }
  }

  function handleCoordinatesChange(coord: { lat: number; lng: number }) {
    setCoordinates(coord)
  }

  useEffect(() => {
    async function newGeographicCoordinates() {
      if (coordinates) {
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates.lng},${coordinates.lat}.json?limit=1&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY}`
        )
          .then(response => response.json())
          .then(data => {
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
          })
      }
    }
    newGeographicCoordinates()
  }, [coordinates, handleTempPosition])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button
          className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            w: 'full',
            px: '4',
            py: '2',
            bg: 'light.gray.200',
            borderBottomRadius: '4px',
            transition: 'background-color 150ms ease-in',
            outline: 'none',
            '&:not(:disabled):hover': { bg: 'light.gray.300' },
            _focus: {
              boxShadow: 'inset 0 0 0 2px var(--colors-light-indigo-300)'
            }
          })}
        >
          <div
            className={css({
              display: 'flex',
              w: 'full',
              gridTemplateColumns: 'auto 1fr auto'
            })}
          >
            <div
              className={css({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pr: '4'
              })}
            >
              <Car
                className={css({ w: '6', h: '6', color: 'light.gray.800' })}
              />
            </div>
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '1',
                alignItems: 'flex-start'
              })}
            >
              {deliveryTime && (
                <span
                  className={css({
                    fontSize: 'sm',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: '1',
                    textAlign: 'start'
                  })}
                >
                  Entrega em aproximadamente {(deliveryTime / 60).toFixed(2)}{' '}
                  min
                </span>
              )}
              <span
                className={css({
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitLineClamp: '1',
                  textAlign: 'start'
                })}
              >
                {state.currentPosition?.place_name}
              </span>
            </div>
            <div className={css({ display: 'flex', pl: '4' })}>
              <span className={css({ m: 'auto', fontWeight: 'medium' })}>
                Mudar
              </span>
            </div>
          </div>
        </button>
      </Dialog.Trigger>
      <Dialog.Content
        onCloseInteractOverlay={() => setOpen(false)}
        className={cx(
          css({
            display: 'flex',
            flexDirection: 'column',
            h: '3/4',
            w: 'calc(100vw - 2rem)',
            sm: { w: '2/3' },
            lg: { w: '1/2' },
            xl: { w: '2/5' }
          })
        )}
      >
        <header
          className={css({
            display: 'flex',
            gap: '4',
            p: '4',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            sm: { alignItems: 'center' }
          })}
        >
          <Dialog.Title asChild>
            <p className={css({ fontSize: 'xl', fontWeight: 'medium' })}>
              Escolha seu novo endereço de entrega
            </p>
          </Dialog.Title>

          <Dialog.Close>
            <button
              className={css({
                p: '2',
                rounded: 'sm',
                bg: 'light.gray.200',
                transition: 'background-color 150ms ease-in',
                outline: 'none',
                '&:not(:disabled):hover': { bg: 'light.gray.300' },
                _focus: {
                  outlineStyle: 'solid',
                  outlineWidth: '2',
                  outlineOffset: '2',
                  outlineColor: 'light.indigo.300'
                }
              })}
            >
              <X className={css({ w: '6', h: '6' })} />
            </button>
          </Dialog.Close>
        </header>

        <RedirectMap onCoordinatesChange={handleCoordinatesChange} />
        <footer
          className={css({
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: '4',
            gap: '4',
            sm: { flexDirection: 'row' }
          })}
        >
          <TextInput
            placeholder="Clique no mapa e verá o endereço aqui"
            readOnly
            value={state.temporaryPosition?.place_name ?? ''}
          />

          <button
            className={css({
              py: '2',
              px: '4',
              rounded: 'sm',
              bg: 'light.green.200',
              transition: 'background-color 150ms ease-in',
              outline: 'none',
              '&:not(:disabled):hover': { bg: 'light.green.300' },
              _focus: {
                outlineStyle: 'solid',
                outlineWidth: '2',
                outlineOffset: '2',
                outlineColor: 'light.indigo.300'
              },
              sm: { ml: 'auto' }
            })}
            onClick={handleSubmit}
          >
            Confirmar
          </button>
        </footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
