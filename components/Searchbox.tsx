import clsx from 'clsx'
import { useState, useEffect, ChangeEvent } from 'react'
import NextLink from 'next/link'
import { MapPin } from 'phosphor-react'
import { TextInput } from './TextInput'
import geohash from 'ngeohash'

export type GeographicFeatureWithCoordinates = {
  coordinates: {
    latitude: number
    longitude: number
  }
  geohash: string
  place_name: string | undefined
  granular: { id: string; text: string } | undefined
  place: string | undefined
}

type Feature = {
  place_name: string
  geometry: {
    coordinates: Array<number>
  }
  context: Array<{ id: string; text: string }>
}

type FeaturesCollection = {
  features: Array<Feature>
}

function generateGeographicInformation(feature: any): {
  place_name: string | undefined
  granular: { id: string; text: string } | undefined
  place: string | undefined
} {
  const typeFeatureContext = [
    'address',
    'neighborhood',
    'locality',
    'place',
    'district',
    'postcode',
    'region',
    'country'
  ]

  const dataTypesAvailable = typeFeatureContext.map(type => {
    const separate_types = feature.context.find((ctx: any) =>
      ctx.id.includes(type)
    )
    if (separate_types) {
      return { id: type, text: separate_types.text }
    } else return undefined
  })

  return {
    place_name: feature.place_name,
    granular: dataTypesAvailable.find(type => type),
    place: dataTypesAvailable[3] ? dataTypesAvailable[3].text : undefined
  }
}

function encodeGeohash(coord: { latitude: number; longitude: number }) {
  return geohash.encode(coord.latitude, coord.longitude, 15)
}

const geographicFeatures = (data: FeaturesCollection) => {
  let allFeatures: Array<GeographicFeatureWithCoordinates> = []

  for (const item of data.features) {
    const { granular, place, place_name } = generateGeographicInformation(item)
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
  const [userInput, setUserInput] = useState<string>('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<Array<any>>([])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShowSuggestions(true)
    setUserInput(event.target.value)
  }

  useEffect(() => {
    if (userInput && userInput.length !== 0) {
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${userInput}.json?bbox=-41.87537769666548,-21.311923538580672,-39.6882975718911,-17.875156159159033&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}&limit=3`
      )
        .then(response => response.json())
        .then(data => {
          setFilteredSuggestions(geographicFeatures(data))
        })
    } else {
      setFilteredSuggestions([])
    }
  }, [userInput])

  return (
    <form className="flex-1 max-w-lg">
      <div className="flex flex-1 gap-2">
        <div className="flex-1 relative">
          <TextInput
            value={userInput}
            onChange={handleChange}
            placeholder="Endereço de entrega"
          />

          {showSuggestions && (
            <div className="flex flex-col absolute top-full w-full mt-2 bg-light-gray-100 rounded gap-2">
              {filteredSuggestions &&
                filteredSuggestions.map(
                  (item: GeographicFeatureWithCoordinates) => {
                    return (
                      <NextLink
                        className={clsx(
                          'flex items-center py-2 px-3 text-sm bg-light-gray-200 hover:bg-light-gray-300 rounded',
                          'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-light-indigo-300'
                        )}
                        href="#"
                        key={item.place_name}
                      >
                        <span className="mr-3">
                          <MapPin className="w-4 h-4" />
                        </span>
                        {item.place_name}
                      </NextLink>
                    )
                  }
                )}
            </div>
          )}
        </div>

        <button
          onClick={() => {}}
          className={clsx(
            'ml-auto py-2 px-4 rounded bg-light-orange-200 [&:not(:disabled):hover]:bg-light-orange-300',
            'transition-[background-color] ease-in duration-150',
            'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
          )}
        >
          Pesquisar
        </button>
      </div>
    </form>
  )
}
