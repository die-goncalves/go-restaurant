import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { GlobeHemisphereWest, X } from 'phosphor-react'
import { useFilter } from '../../contexts/FilterContext'
import { geographicInformation } from '../../utils/geographicInformation'
import { encodeGeohash } from '../../utils/geohash'
import { Dialog } from '../Dialog'
import { TextInput } from '../TextInput'
import MapInsideDialog from './MapInsideDialog'

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
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates.lng},${coordinates.lat}.json?limit=1&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}`
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
          className={clsx(
            'flex items-center justify-between w-full px-4 py-2 bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
            'transition-[background-color] ease-in duration-150',
            'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-light-indigo-300'
          )}
        >
          <div className="flex items-center gap-2">
            <GlobeHemisphereWest className="w-8 h-8 text-light-orange-500" />
            <div className="flex flex-col items-start">
              <span>Agora em</span>
              <span>{state.currentPosition?.place}</span>
            </div>
          </div>
          <span className="font-medium">Mudar</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Content
        onCloseInteractOverlay={() => setOpen(false)}
        className="flex flex-col h-3/4 w-1/3"
      >
        <header className="flex p-4 items-center justify-between">
          <p className="text-xl font-medium">
            Escolha seu novo endereço de entrega
          </p>
          <Dialog.Close>
            <button
              className={clsx(
                'p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                'transition-[background-color] ease-in duration-150',
                'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
              )}
            >
              <X className="w-6 h-6" />
            </button>
          </Dialog.Close>
        </header>

        <MapInsideDialog onCoordinatesChange={handleCoordinatesChange} />
        <footer className="flex justify-center p-4 gap-4">
          <TextInput
            placeholder="Clique no mapa e verá o endereço aqui"
            readOnly
            value={state.temporaryPosition?.place_name ?? ''}
          />

          <button
            className={clsx(
              'ml-auto py-2 px-4 rounded bg-light-green-200 [&:not(:disabled):hover]:bg-light-green-300',
              'transition-[background-color] ease-in duration-150',
              'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
            )}
            onClick={handleSubmit}
          >
            Confirmar
          </button>
        </footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
