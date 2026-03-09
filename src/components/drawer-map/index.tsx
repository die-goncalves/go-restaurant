'use client'

import { useEffect, useState } from 'react'
import { GlobeHemisphereWest, X } from 'phosphor-react'
import { usePosition } from '../../contexts/position-context'
import { geographicInformation } from '../../utils/geographicInformation'
import { encodeGeohash } from '../../utils/geohash'
import { Drawer } from '../drawer'
import { TextInput } from '../text-input'
import { Map } from './map'
import { css, cx } from '@/styled-system/css'

const actionButton = css.raw({
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
})

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
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates?.lng},${coordinates?.lat}.json?limit=1&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY}`
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
        <button className={css(actionButton, { display: 'flex', w: 'fit' })}>
          <GlobeHemisphereWest className={css({ w: '6', h: '6' })} />
        </button>
      </Drawer.Trigger>
      <Drawer.Content
        className={cx(
          css({
            display: 'flex',
            flexDirection: 'column',
            w: 'full',
            lg: { w: 'calc(40% + 12px)' }
          })
        )}
      >
        <header
          className={css({
            display: 'flex',
            p: '4',
            alignItems: 'center',
            justifyContent: 'space-between'
          })}
        >
          <Drawer.Title asChild>
            <p className={css({ fontSize: 'xl', fontWeight: 'medium' })}>
              Onde você está?
            </p>
          </Drawer.Title>
          <Drawer.Close>
            <button className={css(actionButton)}>
              <X className={css({ w: '6', h: '6' })} />
            </button>
          </Drawer.Close>
        </header>

        <Map onCoordinatesChange={handleCoordinatesChange} />
        <footer
          className={css({
            display: 'flex',
            justifyContent: 'center',
            p: '4',
            gap: '4'
          })}
        >
          <TextInput
            placeholder="Clique no mapa e verá o endereço aqui"
            readOnly
            value={state.temporaryPosition?.place_name ?? ''}
          />

          <button
            className={css({
              ml: 'auto',
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
              }
            })}
            onClick={handleSubmit}
          >
            Confirmar
          </button>
        </footer>
      </Drawer.Content>
    </Drawer.Root>
  )
}
