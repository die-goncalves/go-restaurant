'use client'

import NextImage from 'next/image'
import { useCallback, useEffect, useRef } from 'react'
import { Tables } from '@/src/types/supabase'
import { parsePoint } from '@/src/utils/parse-point'
import { css } from '@/styled-system/css'
import { MovedLocationIcon } from '../../../components/icons/moved-location'
import { Button } from '../../../components/ui/button'
import { usePartnerStores } from './partner-stores-context'

type PartnerStoresProps = {
  stores: Omit<Tables<'stores_ratings_summary'>, 'created_at'>[]
}
export function PartnerStores({ stores }: PartnerStoresProps) {
  const { store, changeStore } = usePartnerStores()
  const storeRef = useRef<{ [key: string]: HTMLLIElement | null }>({})
  const listRef = useRef<HTMLUListElement | null>(null)
  const skipScrollRef = useRef(false)

  const moveToMap = useCallback(() => {
    const element = document.querySelector('[data-map-container]')
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false
      return
    }

    if (
      store &&
      store.properties.name &&
      storeRef.current &&
      storeRef.current[store.properties.name]
    ) {
      const element = storeRef.current[store.properties.name]
      const container = listRef.current?.closest(
        '[data-scroll-container]'
      ) as HTMLElement | null

      if (element && container) {
        const elementRect = element.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        const viewportHeight = window.innerHeight
        const elementTop = window.scrollY + elementRect.top

        const elementCenter =
          elementTop - viewportHeight / 2 + elementRect.height / 2

        const minScroll = window.scrollY + containerRect.top
        const maxScroll = minScroll + container.offsetHeight - viewportHeight
        const clamped = Math.max(minScroll, Math.min(elementCenter, maxScroll))

        window.scrollTo({
          top: clamped,
          behavior: 'smooth'
        })
      }
    }
  }, [store])

  function storeToFeature(
    store: Omit<
      Tables<'stores_ratings_summary'>,
      'created_at' | 'total_reviews'
    >
  ) {
    const point = parsePoint(store.coordinates)
    if (!point || !store.id || !store.name) return
    changeStore({
      type: 'Feature',
      properties: {
        id: store.id,
        name: store.name
      },
      geometry: {
        type: 'Point',
        coordinates: [point.lng, point.lat]
      }
    })
  }

  return (
    <div className={css({ position: 'relative' })}>
      <h2
        style={{
          backgroundColor:
            'color-mix(in srgb, var(--colors-surface) 84%, transparent)',
          backdropFilter: 'blur(4px)'
        }}
        className={css({
          position: 'sticky',
          top: 0,
          zIndex: '1',
          fontSize: '2xl',
          textAlign: 'center',
          paddingBlock: '4'
        })}
      >
        Parcerias
      </h2>

      <div
        className={css({
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(1, minmax(0, 1fr))',
          overflow: 'hidden',
          paddingBlock: { base: '4', medium: '6', expanded: '8' }
        })}
      >
        <ul
          ref={listRef}
          className={css({
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gridColumnStart: 1,
            gridColumnEnd: 7
          })}
        >
          {stores?.map((s, idx) => {
            return (
              <li
                key={s.name}
                ref={el => {
                  if (s.name) storeRef.current[s.name] = el
                }}
                className={css({
                  '& + li': { marginBlockStart: '8' }
                })}
              >
                <article
                  className={css({
                    display: 'grid',
                    gridTemplateColumns: {
                      base: 'repeat(1, minmax(0, 1fr))',
                      medium: 'repeat(1, minmax(0, 1fr)) min-content',
                      expanded: 'repeat(1, minmax(0, 1fr))',
                      large: 'repeat(1, minmax(0, 1fr)) min-content'
                    },
                    gridTemplateRows: {
                      base: 'var(--sizes-44) min-content',
                      medium: 'repeat(1, minmax(0, 1fr))',
                      expanded: 'var(--sizes-44) min-content',
                      large: 'repeat(1, minmax(0, 1fr))'
                    },
                    gridGap: { base: '4', medium: '6', expanded: '8' },
                    marginInline: {
                      base: 'unset',
                      medium: '6',
                      expanded: 'unset'
                    },
                    marginInlineStart: {
                      base: 'unset',
                      expanded: '6'
                    }
                  })}
                >
                  <div
                    className={css({
                      gridRowStart: {
                        base: 2,
                        medium: 'unset',
                        expanded: 2,
                        large: 'unset'
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      gap: { base: '4' },
                      paddingInline: {
                        base: '4',
                        medium: 'unset',
                        expanded: '8',
                        large: 'unset'
                      },
                      paddingBlockEnd: {
                        base: '4',
                        medium: 'unset',
                        expanded: '8',
                        large: 'unset'
                      }
                    })}
                  >
                    <div className={css({ display: 'flex', gap: '4' })}>
                      <div
                        className={css({
                          fontFamily: 'serif',
                          fontSize: 'xl',
                          textWrap: 'nowrap'
                        })}
                      >
                        <span>#</span> <span>{idx}</span>
                      </div>

                      <h3
                        style={{
                          ...(s.name === store?.properties.name && {
                            textDecoration: 'underline',
                            textUnderlineOffset: '4px',
                            textDecorationColor: 'fg'
                          })
                        }}
                        className={css({
                          width: 'fit-content',
                          textWrap: 'wrap',
                          fontFamily: 'serif',
                          fontSize: 'xl'
                        })}
                      >
                        {s.name}
                      </h3>
                    </div>

                    <p>{s.description}</p>

                    <Button
                      variant="solid"
                      onClick={() => storeToFeature(s)}
                      icon={<MovedLocationIcon />}
                      className={css({
                        display: { base: 'none', expanded: 'inline-flex' },
                        marginTop: 'auto'
                      })}
                    >
                      Ver no mapa
                    </Button>

                    <Button
                      variant="solid"
                      onClick={() => {
                        skipScrollRef.current = true
                        storeToFeature(s)
                        moveToMap()
                      }}
                      icon={<MovedLocationIcon />}
                      className={css({
                        marginTop: 'auto',
                        display: { base: 'inline-flex', expanded: 'none' }
                      })}
                    >
                      Ver no mapa
                    </Button>
                  </div>

                  <div
                    className={css({
                      gridRowStart: {
                        base: 1,
                        medium: 'unset',
                        expanded: 1,
                        large: 'unset'
                      },
                      gridColumnStart: {
                        base: 'unset',
                        medium: 2,
                        expanded: 'unset',
                        large: 2
                      },
                      position: 'relative',
                      width: {
                        base: '100%',
                        medium: '40',
                        expanded: '100%',
                        large: '40'
                      },
                      height: {
                        base: '100%',
                        medium: '40',
                        expanded: '100%',
                        large: '40'
                      }
                    })}
                  >
                    <NextImage
                      className={css({
                        position: 'relative',
                        objectFit: 'cover'
                      })}
                      src={s.image_url ?? ''}
                      alt=""
                      fill
                    />

                    {!!s.total_reviews && (
                      <div
                        className={css({
                          display: 'flex',
                          position: 'relative',
                          background: 'surface',
                          boxSize: '10'
                        })}
                      >
                        <span
                          className={css({
                            margin: 'auto',
                            fontSize: 'lg',
                            fontWeight: '500'
                          })}
                        >
                          {s.average_rating}
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
