import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { GlobeHemisphereWest, X } from 'phosphor-react'
import { usePosition } from '../../contexts/PositionContext'
import { geographicInformation } from '../../utils/geographicInformation'
import { encodeGeohash } from '../../utils/geohash'
import { Drawer } from '../Drawer'
import { TextInput } from '../TextInput'
import MapInsideDrawer from './MapInsideDrawer'

export function DrawerMap() {
  const [open, setOpen] = useState(false)
  const [coordinates, setCoordinates] = useState<{
    lat: number
    lng: number
  }>()
  const { state, handleChangePosition, handleTempPosition } = usePosition()

  function handleSubmit() {
    handleChangePosition()
    setOpen(false)
  }

  function handleCoordinatesChange(coord: { lat: number; lng: number }) {
    setCoordinates(coord)
  }

  useEffect(() => {
    async function newGeographicCoordinates() {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates?.lng},${coordinates?.lat}.json?limit=1&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}`
      )
      const data = await response.json()

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
    }
    if (coordinates) newGeographicCoordinates()
  }, [coordinates, handleTempPosition])

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger>
        <button
          className={clsx(
            'flex p-2 w-fit rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
            'transition-[background-color] ease-in duration-150',
            'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
          )}
        >
          <GlobeHemisphereWest className="w-6 h-6" />
        </button>
      </Drawer.Trigger>
      <Drawer.Content
        className={clsx('lg:w-[calc(40%+12px)]', 'flex flex-col w-full')}
      >
        <header className="flex p-4 items-center justify-between">
          <p className="text-xl font-medium">Onde você está?</p>
          <Drawer.Close>
            <button
              className={clsx(
                'p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                'transition-[background-color] ease-in duration-150',
                'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
              )}
            >
              <X className="w-6 h-6" />
            </button>
          </Drawer.Close>
        </header>

        <MapInsideDrawer onCoordinatesChange={handleCoordinatesChange} />
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
      </Drawer.Content>
    </Drawer.Root>
  )
}
