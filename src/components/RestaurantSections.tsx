import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import scrollIntoView from 'scroll-into-view'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import debounce from 'lodash.debounce'
import { ListPlus } from 'phosphor-react'
import { TFoodRating, TFoods } from '../types'
import { FoodCard } from './FoodCard'

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
  foods: Array<
    Omit<
      TFoods,
      | 'restaurant_id'
      | 'stripe_food_id'
      | 'stripe_price_id'
      | 'created_at'
      | 'updated_at'
    > & {
      food_rating: Array<
        Omit<TFoodRating, 'food_id' | 'created_at' | 'updated_at'>
      >
    }
  >
  tags: string[]
}
export default function RestaurantSections({
  tags,
  foods
}: RestaurantSectionsProps) {
  const navRef = useRef<HTMLDivElement>(null)
  const [activeSectionId, setActiveSectionId] = useState('')
  const [visibilityNavLinks, setVisibilityNavLinks] = useState<{
    [key: string]: { isIntersecting: boolean; id: string; tag: string }
  }>({})
  const hidden = useRef<
    [string, { isIntersecting: boolean; id: string; tag: string }][]
  >([])

  const throttledEventHandler = useRef(
    debounce(value => setActiveSectionId(value), 50)
  )

  const useHandleNavLinks = (
    setVisibilityNavLinks: React.Dispatch<
      React.SetStateAction<{
        [key: string]: {
          isIntersecting: boolean
          id: string
          tag: string
        }
      }>
    >
  ) => {
    const observer = useRef<IntersectionObserver>()
    useEffect(() => {
      const callbackFunction = (entries: IntersectionObserverEntry[]) => {
        let updatedEntries: {
          [key: string]: {
            isIntersecting: boolean
            id: string
            tag: string
          }
        } = {}
        entries.forEach(entryElement => {
          if (entryElement.isIntersecting) {
            updatedEntries[entryElement.target.id] = {
              isIntersecting: true,
              id: entryElement.target.id,
              tag: entryElement.target.innerHTML
            }
          } else {
            updatedEntries[entryElement.target.id] = {
              isIntersecting: false,
              id: entryElement.target.id,
              tag: entryElement.target.innerHTML
            }
          }
        })
        setVisibilityNavLinks(prev => ({
          ...prev,
          ...updatedEntries
        }))
      }

      if (observer.current) {
        observer.current.disconnect()
      }

      observer.current = new IntersectionObserver(callbackFunction, {
        root: navRef.current,
        rootMargin: '0px',
        threshold: 1
      })

      let entryElements: Element[] = []
      if (navRef.current) entryElements = Array.from(navRef.current.children)
      entryElements.forEach(element => observer.current?.observe(element))

      return () => observer.current?.disconnect()
    }, [setVisibilityNavLinks])
  }
  useHandleNavLinks(setVisibilityNavLinks)

  const useGetActiveSection = (
    setActiveSectionId: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const entryElementsRef = useRef<{
      [key: string]: IntersectionObserverEntry
    }>({})

    const observer = useRef<IntersectionObserver>()
    useEffect(() => {
      const callbackFunction = (entries: IntersectionObserverEntry[]) => {
        entryElementsRef.current = entries.reduce((acc, entryElement) => {
          return {
            ...acc,
            [entryElement.target.id]: entryElement
          }
        }, entryElementsRef.current)

        const visibleEntries: IntersectionObserverEntry[] = []
        Object.keys(entryElementsRef.current).forEach(key => {
          const entryElement = entryElementsRef.current[key]
          if (entryElement.isIntersecting) {
            visibleEntries.push(entryElement)
          }
        })

        if (visibleEntries.length === 1) {
          if (visibleEntries[0]['intersectionRatio'] >= 0.5) {
            throttledEventHandler.current(
              visibleEntries[0].target.id.replace('section', 'button')
            )
          } else {
            throttledEventHandler.current('')
          }
        } else if (visibleEntries.length > 1) {
          throttledEventHandler.current(
            visibleEntries[0].target.id.replace('section', 'button')
          )
        } else {
          throttledEventHandler.current('')
        }
      }

      if (observer.current) {
        observer.current.disconnect()
      }

      observer.current = new IntersectionObserver(callbackFunction, {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      })

      const entryElements = Array.from(document.querySelectorAll('section'))
      entryElements.forEach(element => observer.current?.observe(element))

      return () => observer.current?.disconnect()
    }, [setActiveSectionId])
  }
  useGetActiveSection(setActiveSectionId)

  hidden.current = Object.entries(visibilityNavLinks).filter(
    entry => !entry[1].isIntersecting
  )

  return (
    <div className="p-[1rem_2rem_0_2rem]">
      <div className="w-full sticky top-0 bg-light-gray-100 shadow-sm items-center z-[3]">
        <div className="grid grid-cols-[2fr_1fr] w-full h-min">
          <div className="flex justify-between">
            <div
              className="flex flex-1 flex-wrap flex-row max-h-10 pr-4 overflow-clip gap-4"
              ref={navRef}
            >
              {tags.map((tag, index) => (
                <button
                  className={clsx(
                    'flex p-2 rounded',
                    'transition-[transform, box-shadow] ease-in duration-150',
                    'outline-none focus:ring-2 focus:ring-inset focus:ring-light-indigo-300',
                    activeSectionId === `button-${tag}`
                      ? 'bg-light-orange-200 [&:not(:disabled):hover]:bg-light-orange-300'
                      : 'text-light-gray-800 [&:not(:disabled):hover]:bg-light-gray-200',
                    hidden.current.flatMap(y => y[0]).includes(`button-${tag}`)
                      ? 'invisible'
                      : 'visible'
                  )}
                  key={`button-key-${tag}`}
                  id={`button-${tag}`}
                  onClick={() => scrollFunction(`section-${tag}`)}
                >
                  {tag}
                </button>
              ))}
            </div>

            {!!hidden.current.length && (
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
                      'flex flex-col gap-2 items-center w-40 min-w-max bg-light-gray-100 border-t-2 border-light-gray-200 shadow-md rounded p-2'
                    )}
                  >
                    <DropdownMenu.Label className="text-light-gray-500">
                      + categorias
                    </DropdownMenu.Label>

                    {hidden.current.map(h => (
                      <DropdownMenu.Item key={h[1].tag} asChild>
                        <button
                          className={clsx(
                            'flex items-center w-full p-2 rounded',
                            'transition-[transform, box-shadow] ease-in duration-150',
                            'outline-none focus:ring-2 focus:ring-inset focus:ring-light-indigo-300',
                            activeSectionId === `button-${h[1].tag}`
                              ? 'bg-light-orange-200 [&:not(:disabled):hover]:bg-light-orange-300'
                              : 'text-light-gray-800 [&:not(:disabled):hover]:bg-light-gray-200'
                          )}
                          id={`button-${h[1].tag}`}
                          onClick={() => scrollFunction(`section-${h[1].tag}`)}
                        >
                          {h[1].tag}
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

      <div className="flex flex-col gap-0 items-start z-0 pb-8">
        {tags.map(tag => {
          return (
            <section
              className="w-full"
              key={`section-${tag}`}
              id={`section-${tag}`}
            >
              <p className="text-2xl pt-8 pb-4">{tag}</p>
              <div className="grid grid-cols-3 gap-6">
                {foods
                  .map((f: any) => {
                    if (tag === f.tag) {
                      const rating =
                        f.food_rating.length > 0
                          ? f.food_rating.reduce(function (
                              acc: any,
                              currentValue: { rating: any }
                            ) {
                              return acc + currentValue.rating
                            },
                            0) / f.food_rating.length
                          : undefined
                      return <FoodCard key={f.id} food={f} />
                    }
                  })
                  .filter((item: any) => item)}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
