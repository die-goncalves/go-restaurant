import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { GlobeHemisphereWest, X } from 'phosphor-react'
import { useFilter } from '../../contexts/filter-context'
import { geographicInformation } from '../../utils/geographicInformation'
import { encodeGeohash } from '../../utils/geohash'
import { Dialog } from '../dialog'
import { TextInput } from '../text-input'
import { MapInsideDialog } from './map-inside-dialog'
import { css, cx } from '@/styled-system/css'

export function DialogMap() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [coordinates, setCoordinates] = useState<{
    lat: number
    lng: number
  }>()
  const { state, handleTempPosition } = useFilter()

  function handleSubmit() {
    if (state.temporaryPosition) {
      if (state.temporaryPosition.place && state.temporaryPosition.geohash) {
        router.push(
          `/restaurants?place=${state.temporaryPosition.place}&geohash=${state.temporaryPosition.geohash}`
        )
        setOpen(false)
      } else {
        toast.error(
          'Não conseguimos obter as coordenadas do endereço, por favor indique no mapa.'
        )
      }
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
            transition: 'background-color 150ms ease-in',
            outline: 'none',
            '&:not(:disabled):hover': { bg: 'light.gray.300' },
            _focus: {
              boxShadow: 'inset 0 0 0 2px var(--colors-light-indigo-300)'
            }
          })}
        >
          <div
            className={css({ display: 'flex', alignItems: 'center', gap: '2' })}
          >
            <GlobeHemisphereWest
              className={css({ w: '8', h: '8', color: 'light.orange.500' })}
            />
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              })}
            >
              <span>Agora em</span>
              <span>{state.currentPosition?.place}</span>
            </div>
          </div>
          <span className={css({ fontWeight: 'medium' })}>Mudar</span>
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

        <MapInsideDialog onCoordinatesChange={handleCoordinatesChange} />

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
