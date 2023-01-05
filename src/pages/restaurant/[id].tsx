import { useEffect, useMemo, useState } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'
import { setCookie } from 'nookies'
import { WhatsappLogo } from 'phosphor-react'
import { TFoodRating, TFoods, TOperatingHours, TRestaurant } from '../../types'
import { usePosition } from '../../contexts/PositionContext'
import { supabase } from '../../services/supabaseClient'
import { whenOpen } from '../../utils/restaurantOperation'
import { decodeGeohash } from '../../utils/geohash'
import { geographicInformation } from '../../utils/geographicInformation'
import { getRouteTimeAndDistance } from '../../utils/directionsMapBox'
import { Account } from '../../components/Account'
import { Breadcrumb } from '../../components/Breadcrumb'
import { Rating } from '../../components/Rating'
import { TextTag } from '../../components/Tag/TextTag'
import { NonInteractiveDialogMap } from '../../components/NonInteractiveDialogMap'
import { RestaurantOpeningHours } from '../../components/RestaurantOpeningHours'

const DynamicRestaurantSections = dynamic(
  () => import('../../components/RestaurantSections'),
  { ssr: false }
)
const DynamicCart = dynamic(() => import('../../components/Cart'), {
  ssr: false
})
const DynamicRedirectWithDialogMap = dynamic(
  () => import('../../components/RedirectWithDialogMap'),
  { ssr: false }
)

type Restaurant = Omit<TRestaurant, 'created_at' | 'updated_at'> & {
  operating_hours: Array<Omit<TOperatingHours, 'restaurant_id'>>
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
}

type RestaurantProps = {
  restaurant: Restaurant
}

export default function Restaurant({ restaurant }: RestaurantProps) {
  const { state, handleAddPosition } = usePosition()
  const [priceDistanceAndTime, setPriceDistanceAndTime] = useState<{
    price: number | undefined
    distance: number
    time: number
  }>()

  useEffect(() => {
    const deliveryInfo = async () => {
      if (state && state.currentPosition) {
        const result = await getRouteTimeAndDistance(
          {
            lng: state.currentPosition.coordinates.longitude,
            lat: state.currentPosition.coordinates.latitude
          },
          { lng: restaurant.coordinates.lng, lat: restaurant.coordinates.lat }
        )
        setPriceDistanceAndTime({
          price: Math.round(result.distance / 1000) * 0.12,
          distance: result.distance,
          time: result.duration
        })
        setCookie(
          null,
          '@gorestaurant-v0.1.0:shipping',
          JSON.stringify({
            price: (Math.round(result.distance / 1000) * 0.12).toFixed(2),
            distance: (result.distance / 1000).toFixed(2),
            time: (result.duration / 60).toFixed(2),
            user_location: state.currentPosition
          }),
          {
            maxAge: 60 * 60 * 24 * 365,
            path: '/'
          }
        )
      }
    }
    deliveryInfo()
  }, [restaurant.coordinates.lat, restaurant.coordinates.lng, state])

  useEffect(() => {
    async function getPositionCoordinates(geohash: string) {
      const { latitude, longitude } = decodeGeohash(geohash)

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?limit=1&access_token=${process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}`
      )
      const data = await response.json()
      const { granular, place, place_name } = geographicInformation(
        data.features[0]
      )

      handleAddPosition({
        place_name,
        granular,
        geohash,
        place,
        coordinates: { latitude, longitude }
      })
    }
    const geohash = new URLSearchParams(window.location.search).get('geohash')
    if (geohash) getPositionCoordinates(geohash)
  }, [handleAddPosition])

  const setTags = new Set(restaurant.foods.map(f => f.tag)).values()
  const arrayTags = Array.from(setTags)

  const open = useMemo(() => {
    return whenOpen(restaurant.operating_hours, {
      day: new Date().getDay(),
      timer: new Date().toLocaleTimeString()
    })
  }, [restaurant.operating_hours])

  return (
    <div>
      <div className="min-h-screen bg-light-gray-100">
        <header className="flex px-8 py-4 items-center justify-between">
          <NextImage src="/logo.svg" alt="pizza" width="32" height="32" />

          <div className="flex gap-4">
            <DynamicCart />

            <Account />
          </div>
        </header>

        <div className="grid grid-cols-[2fr_1fr] px-8 w-full h-min gap-0">
          <div>
            <Breadcrumb.Root>
              <Breadcrumb.Link isHomePage href="/">
                Página inicial
              </Breadcrumb.Link>
              <Breadcrumb.Link href={`/restaurants?place=${restaurant.place}`}>
                {restaurant.place}
              </Breadcrumb.Link>
              <Breadcrumb.Link href="#" isCurrentPage>
                {restaurant.name}
              </Breadcrumb.Link>
            </Breadcrumb.Root>

            <div className="flex mt-3 items-center gap-2">
              <h1 className="text-3xl font-medium">{restaurant.name}</h1>
              <RestaurantOpeningHours
                operatingHours={restaurant.operating_hours}
                isRestaurantOpen={open}
              />
            </div>

            <div className="flex mt-2 items-center gap-1">
              <Rating foods={restaurant.foods} />
            </div>

            <div className="flex flex-wrap pt-2 gap-2">
              {arrayTags.map(t => (
                <TextTag key={t}>{t}</TextTag>
              ))}
            </div>

            <div className="flex items-center flex-nowrap gap-0.5 pt-2">
              <span>{`${priceDistanceAndTime?.distance.toFixed(
                2
              )} metros de distância de você`}</span>
              <span className="mx-2 w-1 h-1 rounded-full bg-light-gray-200" />
              <span>{`R$${priceDistanceAndTime?.price?.toFixed(
                2
              )} para entrega`}</span>
            </div>

            <div className="pt-2">
              <span>{restaurant.description}</span>
            </div>

            <div className="flex pt-2 items-center gap-2">
              <NonInteractiveDialogMap
                coordinates={restaurant.coordinates}
                address={restaurant.address}
              />
              <span>{restaurant.address}</span>
            </div>

            <div className="flex pt-4">
              <WhatsappLogo className="w-6 h-6 text-green-500" weight="light" />
              <span className="ml-1">{restaurant.phone_number}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex relative h-64 overflow-hidden rounded-t">
              <NextImage
                src={restaurant.image}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
            <DynamicRedirectWithDialogMap
              restaurantId={restaurant.id}
              restaurantPlace={restaurant.place}
              deliveryTime={priceDistanceAndTime?.time}
            />
          </div>
        </div>

        <DynamicRestaurantSections tags={arrayTags} foods={restaurant.foods} />
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  let paths: {
    params: { id: string }
  }[] = []

  const { data, error } = await supabase.from('restaurants').select('*')

  if (data) {
    paths = data.map(restaurant => {
      return {
        params: {
          id: restaurant.id
        }
      }
    })
  }

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params) {
    const { id } = params

    const { data, error } = await supabase
      .from('restaurants')
      .select(
        `
          *,
          foods (
            *,
            food_rating ( * )
          ),
          operating_hours (
            id,
            start_hour,
            end_hour,
            weekday
          )
        `
      )
      .match({ id: id })
      .single()

    if (data) {
      const restaurant = {
        id: data.id,
        name: data.name,
        image: data.image,
        phone_number: data.phone_number,
        address: data.address,
        coordinates: data.coordinates,
        operating_hours: data.operating_hours,
        foods: data.foods.map((food: any) => {
          return {
            id: food.id,
            name: food.name,
            description: food.description,
            image: food.image,
            price: food.price,
            tag: food.tag,
            food_rating: food.food_rating.map((food_rating: any) => ({
              customer_id: food_rating.customer_id,
              rating: food_rating.rating
            }))
          }
        }),
        place: data.place,
        description: data.description
      }

      return {
        props: { restaurant }
      }
    }
  }
  return {
    props: {}
  }
}
