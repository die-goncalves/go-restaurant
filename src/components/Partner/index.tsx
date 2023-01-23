import { useEffect, useState } from 'react'
import { FeatureCollection } from 'geojson'
import { ParallaxProvider, ParallaxBanner } from 'react-scroll-parallax'
import { overallRatingRestaurant } from '../../utils/overallRatingRestaurant'
import { supabase } from '../../services/supabaseClient'
import MapRegionAndPartners from '../../components/Partner/MapRegionAndPartners'

export function Partners() {
  const [geoJSON, setGeoJSON] = useState<FeatureCollection>()
  const [restaurants, setRestaurants] = useState<{
    [key: string]: string[]
  }>({})

  useEffect(() => {
    async function fetchData() {
      let geojson: FeatureCollection
      const { data } = await supabase.from('restaurants').select(
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
    <ParallaxProvider>
      <div className="flex relative h-full w-full">
        <div className="flex absolute top-1/2 -translate-y-1/2 translate-x-48 z-[2]">
          <div className="h-full w-full ">
            <div className="flex rounded m-auto h-96 w-96 flex-col bg-light-gray-100 overflow-hidden">
              <p className="p-4 text-xl font-medium self-center">
                Regiões e parcerias
              </p>
              <div className="flex flex-col gap-4 h-full pl-4 pb-4 overflow-auto scrollbar-gutter-stable">
                {Object.entries(restaurants).map(region => {
                  return (
                    <div key={region[0]} className="flex flex-col gap-4">
                      <p className="font-medium">
                        <mark className="inline-block leading-[0] pb-2 bg-light-orange-200">
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
          className="absolute right-0 top-[343px] z-10 mr-[10px]"
        ></div>
        <div
          id="scale"
          className="absolute right-0 top-[438px] z-10 mr-[10px]"
        ></div>
        <div
          id="attribution"
          className="absolute right-0 top-[453px] z-10 m-0"
        ></div>
        <div
          id="inside-map"
          className="absolute right-0 top-[525px] z-10 mr-[40px]"
        ></div>

        <ParallaxBanner
          className="h-full w-full bg-light-gray-100"
          layers={[
            {
              children: (
                <div className="relative w-full h-full">
                  {geoJSON && <MapRegionAndPartners geoJSON={geoJSON} />}
                </div>
              ),
              speed: -30
            }
          ]}
        />
      </div>
    </ParallaxProvider>
  )
}
