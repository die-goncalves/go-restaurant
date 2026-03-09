'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlass, MapPin } from 'phosphor-react'
import toast from 'react-hot-toast'
import {
  TFeaturesCollection,
  TGeographicFeatureWithCoordinates
} from '../types'
import { usePosition } from '../contexts/position-context'
import { geographicInformation } from '../utils/geographicInformation'
import { encodeGeohash } from '../utils/geohash'
import { TextInput } from './text-input'
import scrollIntoView from 'scroll-into-view'
import { useMediaQuery } from 'react-responsive'
import { css } from '@/styled-system/css'

const geographicFeatures = (data: TFeaturesCollection) => {
  const allFeatures: Array<TGeographicFeatureWithCoordinates> = []

  for (const item of data.features) {
    const { granular, place, place_name } = geographicInformation(item)
    const eachFeature = {
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

export function Searchbox() {
  const router = useRouter()
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
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${userInput}.json?bbox=-41.87537769666548,-21.311923538580672,-39.6882975718911,-17.875156159159033&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY}&limit=3`
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
    <form className={css({ flex: '1', maxW: 'lg' })} onSubmit={handleSubmit}>
      <div
        className={css({
          display: 'flex',
          flex: '1',
          gap: '1',
          sm: { gap: '2' }
        })}
      >
        <div
          className={css({
            flex: '1',
            sm: { position: 'relative' }
          })}
        >
          <TextInput
            value={userInput}
            onChange={handleChange}
            placeholder="Endereço de entrega"
          />

          {showOptions && !!filteredOptions.length && (
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                top: 'full',
                w: 'full',
                mt: '2',
                bg: 'light.gray.200',
                rounded: 'sm',
                gap: '2',
                p: '2',
                zIndex: '3',
                borderWidth: '2',
                borderColor: 'light.gray.300'
              })}
            >
              {filteredOptions.map(
                (item: TGeographicFeatureWithCoordinates) => {
                  return (
                    <button
                      onClick={() => handleClickOption(item)}
                      className={css({
                        display: 'flex',
                        textAlign: 'left',
                        alignItems: 'center',
                        py: '2',
                        px: '3',
                        fontSize: 'sm',
                        bg: 'light.gray.100',
                        rounded: 'sm',
                        borderWidth: '2',
                        borderColor: 'light.gray.300',
                        transition: 'background-color 150ms ease-in',
                        outline: 'none',
                        '&:not(:disabled):hover': { bg: 'light.gray.300' },
                        _focus: {
                          boxShadow:
                            'inset 0 0 0 2px var(--colors-light-indigo-300)'
                        }
                      })}
                      key={item.place_name}
                    >
                      <span className={css({ flexShrink: '0', mr: '3' })}>
                        <MapPin
                          className={css({ w: '4', h: '4', flexShrink: '0' })}
                        />
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
          className={css({
            ml: 'auto',
            p: '2',
            rounded: 'sm',
            bg: 'light.orange.200',
            transition: 'background-color 150ms ease-in',
            outline: 'none',
            '&:not(:disabled):hover': { bg: 'light.orange.300' },
            _focus: {
              outlineStyle: 'solid',
              outlineWidth: '2',
              outlineOffset: '2',
              outlineColor: 'light.indigo.300'
            },
            md: { py: '2', px: '4' }
          })}
        >
          <span className={css({ display: 'none', sm: { display: 'inline' } })}>
            Pesquisar
          </span>

          <MagnifyingGlass
            className={css({
              w: '6',
              h: '6',
              color: 'light.gray.800',
              sm: { display: 'none' }
            })}
          />
        </button>
      </div>
    </form>
  )
}
