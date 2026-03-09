'use client'

import { useEffect, useState } from 'react'
import { FeatureCollection } from 'geojson'
import { ParallaxProvider, ParallaxBanner } from 'react-scroll-parallax'
import { overallRatingRestaurant } from '../../utils/overallRatingRestaurant'
import { MapRegionAndPartners } from './map-region-and-partners'
import { OverMap } from './over-map'
import { createClient } from '@/src/lib/supabase/client'
import { css } from '@/styled-system/css'

export function Partners() {
  const [geoJSON, setGeoJSON] = useState<FeatureCollection>()
  const [restaurants, setRestaurants] = useState<{
    [key: string]: string[]
  }>({})

  useEffect(() => {
    async function fetchData() {
      let geojson: FeatureCollection
      const { data } = await createClient()
        .from('restaurants')
        .select(
          `
          *,
          foods ( food_rating ( * ) )
        `
        )

      if (data) {
        const restaurantsByRegion = data.reduce(
          (acc, currentValue) => {
            if (acc[currentValue.place]) {
              acc[currentValue.place] = [
                ...acc[currentValue.place],
                currentValue.name
              ]
              return acc
            }
            return {
              ...acc,
              [currentValue.place]: [currentValue.name]
            }
          },
          {} as {
            [key: string]: string[]
          }
        )
        setRestaurants(
          Object.keys(restaurantsByRegion)
            .sort()
            .reduce(
              (acc, currentValue) => {
                acc[currentValue] = restaurantsByRegion[currentValue].sort()
                return acc
              },
              {} as {
                [key: string]: string[]
              }
            )
        )

        geojson = {
          type: 'FeatureCollection',
          features: []
        }
        data.forEach(feature => {
          const rating = overallRatingRestaurant([...feature.foods])
          const starColor = rating.overallRating
            ? rating.overallRating < 1
              ? '#be123c'
              : rating.overallRating < 2
                ? '#f43f5e'
                : rating.overallRating < 3
                  ? '#f59e0b'
                  : rating.overallRating < 4
                    ? '#10b981'
                    : '#047857'
            : '#78716c'

          geojson.features.push({
            type: 'Feature',
            properties: {
              id: feature.id,
              name: feature.name,
              phone: feature.phone_number,
              starColor,
              image: { src: feature.image, alt: feature.name },
              description: feature.description
            },
            geometry: {
              type: 'Point',
              coordinates: [feature.coordinates.lng, feature.coordinates.lat]
            }
          })
        })
        setGeoJSON(geojson)
      }
    }

    fetchData()
  }, [])

  return (
    <div className={css({ display: 'flex', flexDirection: 'column' })}>
      <div
        className={css({ display: 'flex', position: 'relative', h: 'screen' })}
      >
        <OverMap />
        <ParallaxProvider>
          <div
            className={css({
              display: 'flex',
              position: 'relative',
              h: 'full',
              w: 'full'
            })}
          >
            <div
              className={css({
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%) translateX(5rem)',
                zIndex: '2',
                display: 'none',
                lg: {
                  display: 'flex',
                  transform: 'translateY(-50%) translateX(9rem)'
                }
              })}
            >
              <div className={css({ h: 'full', w: 'full' })}>
                <div
                  className={css({
                    display: 'flex',
                    rounded: 'sm',
                    m: 'auto',
                    h: '96',
                    w: '96',
                    flexDirection: 'column',
                    bg: 'light.gray.100',
                    overflow: 'hidden'
                  })}
                >
                  <p
                    className={css({
                      p: '4',
                      fontSize: 'xl',
                      fontWeight: 'medium',
                      alignSelf: 'center'
                    })}
                  >
                    Regiões e parcerias
                  </p>
                  <div
                    className={css({
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4',
                      h: 'full',
                      pl: '4',
                      pb: '4',
                      overflow: 'auto',
                      scrollbarGutter: 'stable'
                    })}
                  >
                    {Object.entries(restaurants).map(region => {
                      return (
                        <div
                          key={region[0]}
                          className={css({
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4'
                          })}
                        >
                          <p className={css({ fontWeight: 'medium' })}>
                            <mark
                              className={css({
                                display: 'inline-block',
                                lineHeight: '0',
                                pb: '2',
                                bg: 'light.orange.200'
                              })}
                            >
                              {region[0]}
                            </mark>
                          </p>
                          <ul>
                            {region[1].map(restaurant => (
                              <li key={restaurant}>{restaurant}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div
              id="navigation"
              className={css({
                position: 'absolute',
                right: '0',
                zIndex: '10',
                top: 'calc(100vh - 50%)',
                transform: 'translateY(-91px)',
                mr: '4',
                lg: { mr: '10px' }
              })}
            ></div>
            <div
              id="scale"
              className={css({
                position: 'absolute',
                right: '0',
                zIndex: '10',
                top: 'calc(100vh - 50%)',
                transform: 'translateY(4px)',
                mr: '4',
                lg: { mr: '10px' }
              })}
            ></div>
            <div
              id="attribution"
              className={css({
                position: 'absolute',
                right: '0',
                zIndex: '10',
                top: 'calc(100vh - 50%)',
                transform: 'translateY(19px)',
                mr: '1.5',
                lg: { m: '0' }
              })}
            ></div>
            <div
              id="inside-map"
              className={css({
                position: 'absolute',
                right: '0',
                zIndex: '10',
                top: 'calc(100vh - 50%)',
                transform: 'translateY(91px)',
                mr: '44px',
                lg: { mr: '40px' }
              })}
            ></div>

            <ParallaxBanner
              className={css({ h: 'full', w: 'full', bg: 'light.gray.100' })}
              layers={[
                {
                  children: (
                    <div
                      className={css({
                        position: 'relative',
                        w: 'full',
                        h: 'full'
                      })}
                    >
                      {geoJSON && <MapRegionAndPartners geoJSON={geoJSON} />}
                    </div>
                  ),
                  speed: -30
                }
              ]}
            />
          </div>
        </ParallaxProvider>
      </div>

      <div
        className={css({
          display: 'flex',
          p: '4',
          mt: '8',
          '2xs': { mt: '10' },
          sm: { p: '6' },
          lg: { display: 'none' }
        })}
      >
        <div
          className={css({
            display: 'flex',
            w: 'full',
            flexDirection: 'column',
            bg: 'light.gray.100'
          })}
        >
          <p
            className={css({
              mb: '4',
              fontSize: 'xl',
              fontWeight: 'medium',
              alignSelf: 'center'
            })}
          >
            Regiões e parcerias
          </p>
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4',
              pl: '4',
              pb: '4'
            })}
          >
            {Object.entries(restaurants).map(region => {
              return (
                <div
                  key={region[0]}
                  className={css({
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4'
                  })}
                >
                  <p className={css({ fontWeight: 'medium' })}>
                    <mark
                      className={css({
                        display: 'inline-block',
                        lineHeight: '0',
                        pb: '2',
                        bg: 'light.orange.200'
                      })}
                    >
                      {region[0]}
                    </mark>
                  </p>
                  <ul>
                    {region[1].map(restaurant => (
                      <li key={restaurant}>{restaurant}</li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
