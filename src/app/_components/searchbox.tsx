'use client'

import { GeocodingFeature, GeocodingResponse } from '@mapbox/search-js-core'
import { Portal } from '@zag-js/react'
import { useRouter } from 'next/navigation'
import { SubmitEventHandler, useState } from 'react'
import { UnfoldMoreIcon } from '@/src/components/icons/unfold-more'
import { Button } from '@/src/components/ui/button'
import { Combobox } from '@/src/components/ui/combobox'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { useScrollArea } from '@/src/components/ui/scroll-area/use-scroll-area'
import { toaster } from '@/src/components/ui/toast/toast'
import { usePosition } from '@/src/contexts/position-context'
import { useAsyncList } from '@/src/hooks/use-async-list'
import { encodeGeohash } from '@/src/utils/geohash'
import { css } from '@/styled-system/css'

export function Searchbox() {
  const router = useRouter()
  const { setPosition } = usePosition()
  const [selectedFeature, setSelectedFeature] =
    useState<GeocodingFeature | null>(null)

  const onSubmit: SubmitEventHandler<HTMLFormElement> = evt => {
    evt.preventDefault()

    if (!selectedFeature) {
      toaster.error({ description: 'Falha ao processar o endereço da lista.' })
      return
    }

    const longitude = selectedFeature.geometry.coordinates[0]
    const latitude = selectedFeature.geometry.coordinates[1]
    const geohash = encodeGeohash({ longitude, latitude })
    const place = selectedFeature.properties.context.place?.name
    const fullAddress = selectedFeature.properties.full_address

    if (!place || !geohash) {
      toaster.error({
        description: 'Falha ao processar a localização informada.'
      })
      return
    }

    setPosition({
      coordinates: { longitude, latitude },
      geohash,
      fullAddress,
      place
    })

    router.push(`/stores?place=${place}&geohash=${geohash}`)
  }

  const scrollAreaApi = useScrollArea()
  const asyncListApi = useAsyncList<GeocodingFeature>({
    async load({ signal, filterText }) {
      if (!filterText) return { items: [] }

      const url = new URL('https://api.mapbox.com/search/geocode/v6/forward')
      url.searchParams.set('q', filterText)
      url.searchParams.set('language', 'pt')
      url.searchParams.set(
        'types',
        'address,secondary_address,street,neighborhood,postcode,locality,place'
      )
      url.searchParams.set('bbox', '-40.4056,-19.1605,-39.7209,-18.4441')
      url.searchParams.set('limit', '3')
      url.searchParams.set(
        'access_token',
        process.env.NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY ?? ''
      )
      const res = await fetch(url, { signal })

      const json: GeocodingResponse = await res.json()

      return {
        items: json.features
      }
    },
    initialItems: [],
    initialFilterText: ''
  })

  return (
    <form
      onSubmit={onSubmit}
      className={css({
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: { base: 'column', medium: 'row' },
        gap: '2',
        paddingInline: '4',
        width: 'clamp(var(--sizes-72), 100%, var(--sizes-breakpoint-medium))'
      })}
    >
      <Combobox.Root
        name="feature"
        items={asyncListApi.items}
        itemToValue={item => item.id}
        itemToString={item => item.properties.full_address}
        onInputValueChange={({ inputValue }) => {
          asyncListApi.setFilterText(inputValue)
        }}
        onValueChange={({ items }) => {
          setSelectedFeature(items[0] ?? null)
        }}
        scrollToIndexFn={details => {
          if (!details.index) return
          const el = details.getElement()
          const parent = el?.parentElement
          const parentParent = parent?.parentElement

          if (el && parent && parentParent) {
            setTimeout(() => {
              const ulRect = parent.getBoundingClientRect()
              const liRect = el.getBoundingClientRect()
              const parentRect = parentParent.getBoundingClientRect()

              const offsetElTop = liRect.top - ulRect.top + parent.scrollTop + 8
              const offsetElBottom =
                liRect.top -
                ulRect.top +
                parent.scrollTop +
                liRect.height -
                parentRect.height +
                8

              scrollAreaApi.scrollTo({
                top: offsetElBottom,
                behavior: 'smooth'
              })
            })
          }
        }}
      >
        <Combobox.Label
          className={css({
            position: 'absolute',
            justifySelf: 'center',
            top: 0,
            left: '50%',
            transform: 'translate(-50%, 0)'
          })}
        >
          Digite seu endereço
        </Combobox.Label>
        <Combobox.Control className={css({ marginBlockStart: '8' })}>
          <Combobox.Input />
          <Combobox.Trigger>
            <UnfoldMoreIcon />
          </Combobox.Trigger>
        </Combobox.Control>

        <Portal>
          <Combobox.Positioner>
            <Combobox.Content
              {...(asyncListApi.loading && { 'data-loading': '' })}
              className={css({
                _after: {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  zIndex: -1,
                  background: 'transparent',
                  borderRadius: 'inherit',
                  pointerEvents: 'none',
                  transitionProperty: 'background',
                  transitionDuration: '150ms',
                  transitionTimingFunction:
                    'token(easings.expressive-fast-effects)'
                },
                _loading: {
                  _after: {
                    backgroundSize: '400% 100%',
                    background:
                      'linear-gradient(90deg, #00000000 24%, var(--colors-black-alpha-300) 50%, #00000000 76%)',
                    animationName: 'shimmer',
                    animationDuration: '1000ms',
                    animationIterationCount: 'infinite'
                  }
                }
              })}
            >
              <div
                className={css({
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: 'inherit',
                  overflow: 'auto'
                })}
              >
                <ScrollArea.RootProvider
                  api={scrollAreaApi}
                  size="sm"
                  variant="hover"
                >
                  <ScrollArea.Viewport className={css({ padding: 0 })}>
                    <ScrollArea.Content className={css({ padding: 0 })}>
                      {asyncListApi.empty && (
                        <Combobox.Item item={{}}>
                          <Combobox.ItemText item={{}}>
                            Nenhum resultado encontrado
                          </Combobox.ItemText>
                        </Combobox.Item>
                      )}

                      {asyncListApi.items.map(item => {
                        return (
                          <Combobox.Item key={item.id} item={item}>
                            <Combobox.ItemText item={item}>
                              {item.properties.full_address}
                            </Combobox.ItemText>
                            <Combobox.ItemIndicator item={item} />
                          </Combobox.Item>
                        )
                      })}
                    </ScrollArea.Content>
                  </ScrollArea.Viewport>

                  <ScrollArea.Scrollbar orientation="vertical">
                    <ScrollArea.Thumb orientation="vertical" />
                  </ScrollArea.Scrollbar>
                  <ScrollArea.Scrollbar orientation="horizontal">
                    <ScrollArea.Thumb orientation="horizontal" />
                  </ScrollArea.Scrollbar>

                  <ScrollArea.Corner />
                </ScrollArea.RootProvider>
              </div>
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>

      <Button
        variant="solid"
        className={css({ width: { base: '100%', medium: 'auto' } })}
      >
        Confirmar
      </Button>
    </form>
  )
}
