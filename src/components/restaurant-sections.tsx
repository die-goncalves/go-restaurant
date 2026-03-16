'use client'

import { useEffect, useReducer, useRef } from 'react'
import scrollIntoView from 'scroll-into-view'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import debounce from 'lodash.debounce'
import { ListPlus } from 'phosphor-react'
import { TFoodRating, TFoods, TRestaurant, TTag } from '../types'
import { FoodCard } from '@/src/components/food-card'
import { css } from '@/styled-system/css'
import { Store } from '../app/restaurant/[id]/page'

const categoryButton = (isActive: boolean) =>
  css({
    display: 'flex',
    p: '2',
    rounded: 'sm',
    transition: 'all 150ms ease-in',
    outline: 'none',
    _focus: {
      boxShadow: 'inset 0 0 0 2px var(--colors-light-indigo-300)'
    },
    bg: isActive ? 'light.orange.200' : 'transparent',
    color: isActive ? 'inherit' : 'light.gray.800',
    '&:not(:disabled):hover': {
      bg: isActive ? 'light.orange.300' : 'light.gray.200'
    }
  })

enum Actions {
  'fill',
  'active'
}
type TActions = {
  type: keyof typeof Actions
  payload?: any
}
type TElement = {
  tag: string
  intersectionRatio: number
}
type TData = {
  elements: { [key: string]: TElement }
  activeId: string
}

function reducer(state: TData, action: TActions) {
  switch (action.type) {
    case 'fill': {
      return {
        ...state,
        elements: Object.entries<IntersectionObserverEntry>(
          action.payload.entries
        ).reduce(
          (acc, current) => {
            return {
              ...acc,
              ...{
                [current[0]]: {
                  tag: current[1].target.innerHTML,
                  intersectionRatio: current[1].intersectionRatio
                }
              }
            }
          },
          {} as { [key: string]: TElement }
        )
      }
    }
    case 'active': {
      return { ...state, activeId: action.payload.value }
    }
    default:
      throw Error('Ação desconhecida: ' + action.type)
  }
}

function scrollFunction(id: string) {
  const e = document.getElementById(id)
  if (e) {
    scrollIntoView(e, {
      cancellable: true,
      time: 1000,
      align: { top: 0, topOffset: 35 },
      ease: function easeInCirc(x: number): number {
        return 1 - Math.sqrt(1 - Math.pow(x, 2))
      }
    })
  }
}

type RestaurantSectionsProps = {
  tags: string[]
  restaurant: Store
}
export function RestaurantSections({
  tags,
  restaurant
}: RestaurantSectionsProps) {
  const [state, dispatch] = useReducer(reducer, {
    elements: {},
    activeId: ''
  })
  const navRef = useRef<HTMLDivElement>(null)
  const navObserver = useRef<IntersectionObserver>(null)
  const sectionObserver = useRef<IntersectionObserver>(null)
  const sectionsRef = useRef<{ [key: string]: IntersectionObserverEntry }>({})
  const tagsRef = useRef<{ [key: string]: IntersectionObserverEntry }>({})

  useEffect(() => {
    const callbackFunction = (entries: IntersectionObserverEntry[]) => {
      tagsRef.current = entries.reduce((acc, entryElement) => {
        return {
          ...acc,
          [entryElement.target.id]: entryElement
        }
      }, tagsRef.current)

      dispatch({
        type: 'fill',
        payload: {
          entries: tagsRef.current
        }
      })
    }

    if (navObserver.current) {
      navObserver.current.disconnect()
    }

    navObserver.current = new IntersectionObserver(callbackFunction, {
      root: navRef.current,
      rootMargin: '0px',
      threshold: 1
    })

    let entryElements: Element[] = []
    if (navRef.current) entryElements = Array.from(navRef.current.children)
    entryElements.forEach(element => navObserver.current?.observe(element))

    return () => navObserver.current?.disconnect()
  }, [])

  const throttledEventHandler = useRef(
    debounce(value => dispatch({ type: 'active', payload: { value } }), 50)
  )

  useEffect(() => {
    const callbackFunction = (entries: IntersectionObserverEntry[]) => {
      sectionsRef.current = entries.reduce((acc, entryElement) => {
        return {
          ...acc,
          [entryElement.target.id]: entryElement
        }
      }, sectionsRef.current)

      const visibleSections = Object.entries(sectionsRef.current).reduce(
        (acc, currentSection) => {
          if (currentSection[1].isIntersecting) {
            return {
              ...acc,
              [currentSection[0]]: currentSection[1]
            }
          } else return acc
        },
        {} as { [key: string]: IntersectionObserverEntry }
      )

      const values = Object.values(visibleSections)
      if (values.length === 1) {
        if (values[0]['intersectionRatio'] >= 0.5) {
          throttledEventHandler.current(
            values[0].target.id.replace('sect', 'btn')
          )
        } else {
          throttledEventHandler.current('')
        }
      } else if (values.length > 1) {
        throttledEventHandler.current(
          values[0].target.id.replace('sect', 'btn')
        )
      } else {
        throttledEventHandler.current('')
      }
    }

    if (sectionObserver.current) {
      sectionObserver.current.disconnect()
    }

    sectionObserver.current = new IntersectionObserver(callbackFunction, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    })

    const entryElements = Array.from(document.querySelectorAll('section'))
    entryElements.forEach(element => sectionObserver.current?.observe(element))

    return () => sectionObserver.current?.disconnect()
  }, [])

  const hiddenElements = Object.entries<TElement>(state.elements).filter(
    ([, el]) => el.intersectionRatio < 0.5
  )

  return (
    <div
      className={css({
        pt: '4'
      })}
    >
      <div
        className={css({
          w: 'full',
          position: 'sticky',
          top: '0',
          bg: 'light.gray.100',
          shadow: 'xs',
          alignItems: 'center',
          zIndex: '3',
          px: '4',
          sm: { px: '6' },
          lg: { px: '8' }
        })}
      >
        <div
          className={css({
            display: 'flex',
            lg: {
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              w: 'full',
              h: 'min'
            }
          })}
        >
          <div
            className={css({
              display: 'flex',
              justifyContent: 'space-between'
            })}
          >
            <div
              className={css({
                display: 'flex',
                flex: '1',
                flexWrap: 'wrap',
                flexDirection: 'row',
                maxH: '10',
                pr: '4',
                overflow: 'clip',
                gap: '4'
              })}
              ref={navRef}
            >
              {tags.map(tag => (
                <button
                  className={categoryButton(state.activeId === `btn-${tag}`)}
                  key={`key-btn-${tag}`}
                  id={`btn-${tag}`}
                  onClick={() => scrollFunction(`sect-${tag}`)}
                >
                  {tag}
                </button>
              ))}
            </div>

            {!!hiddenElements.length && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    aria-label="Mais categorias"
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
                    <ListPlus
                      className={css({
                        w: '6',
                        h: '6',
                        color: 'light.gray.800'
                      })}
                    />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    sideOffset={5}
                    className={css({
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2',
                      alignItems: 'center',
                      w: '40',
                      minW: 'max',
                      bg: 'light.gray.100',
                      borderTopWidth: '2',
                      borderTopColor: 'light.gray.200',
                      shadow: 'md',
                      rounded: 'sm',
                      p: '2',
                      zIndex: '30'
                    })}
                  >
                    <DropdownMenu.Label
                      className={css({ color: 'light.gray.500' })}
                    >
                      + categorias
                    </DropdownMenu.Label>

                    {hiddenElements.map(([id, el]) => (
                      <DropdownMenu.Item key={`key-${id}`} asChild>
                        <button
                          id={id}
                          onClick={() =>
                            scrollFunction(`sect-${id.replace('btn-', '')}`)
                          }
                          className={categoryButton(state.activeId === id)}
                        >
                          {el.tag}
                        </button>
                      </DropdownMenu.Item>
                    ))}

                    <DropdownMenu.Arrow
                      className={css({ fill: 'light.gray.200' })}
                    />
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
        </div>
      </div>

      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          alignItems: 'flex-start',
          zIndex: '0',
          pb: '8',
          px: '4',
          sm: { px: '6' },
          lg: { px: '8' }
        })}
      >
        {tags.map(tag => {
          return (
            <section
              className={css({ w: 'full' })}
              key={`sect-${tag}`}
              id={`sect-${tag}`}
            >
              <p className={css({ fontSize: '2xl', pt: '8', pb: '4' })}>
                {tag}
              </p>
              <div
                className={css({
                  display: 'grid',
                  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                  gap: '4',
                  sm: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
                  lg: {
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: '6'
                  }
                })}
              >
                {restaurant.products
                  .map(p => {
                    if (p.sections.includes(tag)) {
                      return (
                        <FoodCard
                          key={p.id}
                          restaurant={{
                            id: restaurant.id!,
                            name: restaurant.name!,
                            imageURL: restaurant.image_url!
                          }}
                          food={p}
                        />
                      )
                    }
                  })
                  .filter(item => item)}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
