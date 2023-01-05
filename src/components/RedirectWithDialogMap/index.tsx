import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { Car, X } from 'phosphor-react'
import { usePosition } from '../../contexts/PositionContext'
import { geographicInformation } from '../../utils/geographicInformation'
import { encodeGeohash } from '../../utils/geohash'
import { Dialog } from '../Dialog'
import { TextInput } from '../TextInput'
import RedirectMap from './RedirectMap'

type RedirectWithDialogMapProps = {
  restaurantId: string
  restaurantPlace: string
  deliveryTime: number | undefined
}
export default function RedirectWithDialogMap({
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
    if (state.temporaryPosition) {
      if (restaurantPlace !== state.temporaryPosition.place) {
        toast.error('Região fora dos limites de entrega para este restaurante.')
      } else if (
        state.temporaryPosition.place &&
        state.temporaryPosition.geohash
      ) {
        router.push(
          `/restaurant/${restaurantId}?geohash=${state.temporaryPosition?.geohash}`
        )
        handleChangePosition()
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
            'flex items-center justify-between w-full px-4 py-2 bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300 rounded-b-[4px]',
            'transition-[background-color] ease-in duration-150',
            'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-light-indigo-300'
          )}
        >
          <div className="flex w-full grid-cols-[auto_1fr_auto]">
            <div className="flex items-center justify-center pr-4">
              <Car className="w-6 h-6 text-light-gray-800" />
            </div>
            <div className="flex flex-col gap-1 items-start">
              {deliveryTime && (
                <span className="flex text-sm line-clamp-1 text-start">
                  Entrega em aproximadamente {(deliveryTime / 60).toFixed(2)}{' '}
                  min
                </span>
              )}
              <span className="flex line-clamp-1 text-start">
                {state.currentPosition?.place_name}
              </span>
            </div>
            <div className="flex pl-4">
              <span className="m-auto font-medium">Mudar</span>
            </div>
          </div>
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

        <RedirectMap onCoordinatesChange={handleCoordinatesChange} />
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
