import clsx from 'clsx'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import router from 'next/router'
import { MagnifyingGlass, MapPin } from 'phosphor-react'
import toast from 'react-hot-toast'
import {
  TFeaturesCollection,
  TGeographicFeatureWithCoordinates
} from '../types'
import { usePosition } from '../contexts/PositionContext'
import { geographicInformation } from '../utils/geographicInformation'
import { encodeGeohash } from '../utils/geohash'
import { TextInput } from './TextInput'
import scrollIntoView from 'scroll-into-view'
import { useMediaQuery } from 'react-responsive'

const geographicFeatures = (data: TFeaturesCollection) => {
  let allFeatures: Array<TGeographicFeatureWithCoordinates> = []

  for (const item of data.features) {
    const { granular, place, place_name } = geographicInformation(item)
    let eachFeature = {
      coordinates: {
        latitude: item.geometry.coordinates[1],
        longitude: item.geometry.coordinates[0]
      },
      geohash: encodeGeohash({
        latitude: item.geometry.coordinates[1],
        longitude: item.geometry.coordinates[0]
      }),
      granular,
      place_name,
      place
    }
    allFeatures.push(eachFeature)
  }
  return allFeatures
}

export default function Searchbox() {
  const { state, handleAddPosition } = usePosition()
  const [userInput, setUserInput] = useState<string>('')
  const [showOptions, setShowOptions] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState<Array<any>>([])

  const isAtLeast640 = useMediaQuery({ minWidth: 640 })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isAtLeast640)
      scrollIntoView(event.currentTarget, {
        cancellable: true,
        time: 1000,
        align: { top: 0, topOffset: 16 },
        ease: function easeInCirc(x: number): number {
          return 1 - Math.sqrt(1 - Math.pow(x, 2))
        }
      })
    setShowOptions(true)
    setUserInput(event.target.value)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (state.currentPosition) {
      if (state.currentPosition.place && state.currentPosition.geohash) {
        router.push(
          `/restaurants?place=${state.currentPosition.place}&geohash=${state.currentPosition.geohash}`
        )
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

  const handleClickOption = (item: TGeographicFeatureWithCoordinates) => {
    setShowOptions(false)

    handleAddPosition({
      coordinates: item.coordinates,
      geohash: item.geohash,
      granular: item.granular,
      place: item.place,
      place_name: item.place_name
    })

    setUserInput(item.place_name ?? '')
  }

  useEffect(() => {
    async function getFilteredOptions() {
      if (userInput && userInput.length !== 0) {
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${userInput}.json?bbox=-41.87537769666548,-21.311923538580672,-39.6882975718911,-17.875156159159033&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}&limit=3`
        )
          .then(response => response.json())
          .then(data => {
            setFilteredOptions(geographicFeatures(data))
          })
      } else {
        setFilteredOptions([])
      }
    }

    getFilteredOptions()
  }, [userInput])

  useEffect(() => {
    if (state.currentPosition) {
      setShowOptions(false)
      setUserInput(state.currentPosition.place_name ?? '')
    } else setUserInput('')
  }, [state.currentPosition])

  return (
    <form className="flex-1 max-w-lg" onSubmit={handleSubmit}>
      <div className={clsx('sm:gap-2', 'flex flex-1 gap-1')}>
        <div className={clsx('sm:relative', 'flex-1')}>
          <TextInput
            value={userInput}
            onChange={handleChange}
            placeholder="Endereço de entrega"
          />

          {showOptions && !!filteredOptions.length && (
            <div className="flex flex-col absolute top-full w-full mt-2 bg-light-gray-200 rounded gap-2 p-2 z-[3] border-2 border-light-gray-300">
              {filteredOptions.map(
                (item: TGeographicFeatureWithCoordinates) => {
                  return (
                    <button
                      onClick={() => handleClickOption(item)}
                      className={clsx(
                        'flex text-left items-center py-2 px-3 text-sm bg-light-gray-100 [&:not(:disabled):hover]:bg-light-gray-300 rounded border-2 border-light-gray-300',
                        'transition-[background-color] ease-in duration-150',
                        'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-light-indigo-300'
                      )}
                      key={item.place_name}
                    >
                      <span className="flex-none mr-3">
                        <MapPin className="w-4 h-4 flex-none" />
                      </span>
                      {item.place_name}
                    </button>
                  )
                }
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className={clsx(
            'md:py-2 md:px-4',
            'ml-auto p-2 rounded bg-light-orange-200 [&:not(:disabled):hover]:bg-light-orange-300',
            'transition-[background-color] ease-in duration-150',
            'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
          )}
        >
          <span className={clsx('sm:inline', 'hidden')}>Pesquisar</span>

          <MagnifyingGlass
            className={clsx('sm:hidden', 'w-6 h-6 text-light-gray-800')}
          />
        </button>
      </div>
    </form>
  )
}
