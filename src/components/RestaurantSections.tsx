import clsx from 'clsx'
import { useEffect, useReducer, useRef } from 'react'
import scrollIntoView from 'scroll-into-view'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import debounce from 'lodash.debounce'
import { ListPlus } from 'phosphor-react'
import { TFoodRating, TFoods, TRestaurant, TTag } from '../types'
import { FoodCard } from './FoodCard'

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
        ).reduce((acc, current) => {
          return {
            ...acc,
            ...{
              [current[0]]: {
                tag: current[1].target.innerHTML,
                intersectionRatio: current[1].intersectionRatio
              }
            }
          }
        }, {} as { [key: string]: TElement })
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
  let e = document.getElementById(id)
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
  tags: Array<{ id: string; name: string }>
  restaurant: Pick<TRestaurant, 'id' | 'name' | 'image'> & {
    foods: Array<
      Omit<TFoods, 'created_at' | 'updated_at'> & {
        food_rating: Array<Omit<TFoodRating, 'created_at' | 'updated_at'>>
      } & {
        tag: Omit<TTag, 'created_at' | 'updated_at'>
      }
    >
  }
}
export default function RestaurantSections({
  tags,
  restaurant
}: RestaurantSectionsProps) {
  const [state, dispatch] = useReducer(reducer, {
    elements: {},
    activeId: ''
  })
  const navRef = useRef<HTMLDivElement>(null)
  const navObserver = useRef<IntersectionObserver>()
  const sectionObserver = useRef<IntersectionObserver>()
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

  return (
    <div className="pt-4">
      <div
        className={clsx(
          'w-full sticky top-0 bg-light-gray-100 shadow-sm items-center z-[3]',
          'lg:px-8',
          'sm:px-6',
          'px-4'
        )}
      >
        <div
          className={clsx(
            'lg:grid lg:grid-cols-[2fr_1fr] lg:w-full lg:h-min',
            'flex'
          )}
        >
          <div className="flex justify-between">
            <div
              className="flex flex-1 flex-wrap flex-row max-h-10 pr-4 overflow-clip gap-4"
              ref={navRef}
            >
              {tags.map(tag => (
                <button
                  className={clsx(
                    'flex p-2 rounded',
                    'transition-[transform, box-shadow] ease-in duration-150',
                    'outline-none focus:ring-2 focus:ring-inset focus:ring-light-indigo-300',
                    state.activeId === `btn-${tag.id}`
                      ? 'bg-light-orange-200 [&:not(:disabled):hover]:bg-light-orange-300'
                      : 'text-light-gray-800 [&:not(:disabled):hover]:bg-light-gray-200'
                  )}
                  key={`key-btn-${tag.id}`}
                  id={`btn-${tag.id}`}
                  onClick={() => scrollFunction(`sect-${tag.id}`)}
                >
                  {tag.name}
                </button>
              ))}
            </div>

            {!!Object.values<TElement>(state.elements).filter(
              el => el.intersectionRatio < 0.5
            ).length && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    className={clsx(
                      'p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                      'transition-[background-color] ease-in duration-150',
                      'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                    )}
                    aria-label="Mais categorias"
                  >
                    <ListPlus className="w-6 h-6 text-light-gray-800" />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    sideOffset={5}
                    className={clsx(
                      'flex flex-col gap-2 items-center w-40 min-w-max bg-light-gray-100 border-t-2 border-light-gray-200 shadow-md rounded p-2 z-30'
                    )}
                  >
                    <DropdownMenu.Label className="text-light-gray-500">
                      + categorias
                    </DropdownMenu.Label>

                    {Object.entries<TElement>(state.elements)
                      .filter(el => el[1].intersectionRatio < 0.5)
                      .map(item => (
                        <DropdownMenu.Item key={`key-${item[0]}`} asChild>
                          <button
                            className={clsx(
                              'flex items-center w-full p-2 rounded',
                              'transition-[transform, box-shadow] ease-in duration-150',
                              'outline-none focus:ring-2 focus:ring-inset focus:ring-light-indigo-300',
                              state.activeId === item[0]
                                ? 'bg-light-orange-200 [&:not(:disabled):hover]:bg-light-orange-300'
                                : 'text-light-gray-800 [&:not(:disabled):hover]:bg-light-gray-200'
                            )}
                            id={item[0]}
                            onClick={() =>
                              scrollFunction(
                                `sect-${item[0].replace('btn-', '')}`
                              )
                            }
                          >
                            {item[1].tag}
                          </button>
                        </DropdownMenu.Item>
                      ))}

                    <DropdownMenu.Arrow className="fill-light-gray-200" />
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
        </div>
      </div>

      <div
        className={clsx(
          'flex flex-col gap-0 items-start z-0 pb-8',
          'lg:px-8',
          'sm:px-6',
          'px-4'
        )}
      >
        {tags.map(tag => {
          return (
            <section
              className="w-full"
              key={`sect-${tag.id}`}
              id={`sect-${tag.id}`}
            >
              <p className="text-2xl pt-8 pb-4">{tag.name}</p>
              <div
                className={clsx(
                  'lg:grid-cols-3 lg:gap-6',
                  'sm:grid-cols-2',
                  'grid grid-cols-1 gap-4'
                )}
              >
                {restaurant.foods
                  .map(f => {
                    if (tag.id === f.tag.id) {
                      return (
                        <FoodCard
                          key={f.id}
                          restaurant={{
                            id: restaurant.id,
                            name: restaurant.name,
                            image: restaurant.image
                          }}
                          food={f}
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
