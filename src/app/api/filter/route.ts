import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/lib/supabase/server'
import { TFoodRating, TFoods, TRestaurant, TTag } from '@/src/types'
import { getRouteTimeAndDistance } from '@/src/utils/directionsMapBox'
import { overallRatingRestaurant } from '@/src/utils/overallRatingRestaurant'
import { parsePoint } from '@/src/utils/parse-point'

type TSupabaseResponseData = Omit<
  TRestaurant,
  'phone_number' | 'address' | 'description' | 'updated_at'
> & {
  foods: Array<
    TFoods & {
      food_rating: Array<TFoodRating>
    } & {
      tag: TTag
    }
  >
}

type TPickUpData = {
  rating: number | undefined
  reviews: number
  delivery_time: number
} & TSupabaseResponseData

type TDeliveryData = {
  rating: number | undefined
  reviews: number
  delivery_time: number
  delivery_price: number
} & TSupabaseResponseData

type TQueryFilters = {
  categories: string[] | undefined
  price: number | undefined
  delivery: 'delivery' | 'pickup'
  sort: 'rating' | 'delivery time' | undefined
  lng: number | undefined
  lat: number | undefined
}

const deliveryFreight = (distance: number) => Math.round(distance / 1000) * 0.12

function compareRating(a: number | undefined, b: number | undefined) {
  if (a === undefined && b === undefined) return 0
  if (a === undefined) return 1
  if (b === undefined) return -1
  return b - a
}

function compareDeliveryTime(a: number | undefined, b: number | undefined) {
  if (a === undefined && b === undefined) return 0
  if (a === undefined) return 1
  if (b === undefined) return -1
  return a - b
}

async function getDeliveryInfos(
  data: any[],
  filters: TQueryFilters
): Promise<{ duration: number; distance: number }[]> {
  if (!filters.lng || !filters.lat) return []

  return Promise.all(
    data.map(item => {
      const { lng, lat } = parsePoint(item.coordinates)

      return getRouteTimeAndDistance(
        { lng: filters.lng!, lat: filters.lat! },
        { lng: lng!, lat: lat! }
      )
    })
  )
}

function filterByTags<T extends { foods: Array<{ tag: { name: string } }> }>(
  data: T[],
  tags: string[] | undefined
): T[] {
  if (tags.length === 0 || tags === undefined) return data
  return data.filter(store =>
    store.categories.some(food => tags.includes(food))
  )
}

function sortData<T extends { rating?: number; delivery_time?: number }>(
  data: T[],
  sort: TQueryFilters['sort']
): T[] {
  if (!sort) return data
  return [...data].sort((a, b) =>
    sort === 'rating'
      ? compareRating(a.rating, b.rating)
      : compareDeliveryTime(a.delivery_time, b.delivery_time)
  )
}

async function dataForPickUp(
  data: any[],
  filters: TQueryFilters
): Promise<TPickUpData[]> {
  const deliveryInfos = await getDeliveryInfos(data, filters)

  const withRating: TPickUpData[] = data.map((item, index) => {
    return {
      ...item,
      rating: item.average_rating,
      reviews: item.total_reviews,
      delivery_time: deliveryInfos[index]?.duration
    }
  })

  return sortData(filterByTags(withRating, filters.categories), filters.sort)
}

async function dataForDelivery(
  data: any[],
  filters: TQueryFilters
): Promise<TDeliveryData[]> {
  const deliveryInfos = await getDeliveryInfos(data, filters)

  const withInfos: TDeliveryData[] = data.map((item, index) => {
    return {
      ...item,
      rating: item.average_rating,
      reviews: item.total_reviews,
      delivery_time: deliveryInfos[index]?.duration,
      delivery_price: deliveryFreight(deliveryInfos[index]?.distance)
    }
  })

  const filteredByTags = filterByTags(withInfos, filters.categories)

  const filteredByPrice =
    filters.price !== undefined
      ? filteredByTags.filter(
          item => item.delivery_price <= Number(filters.price)
        )
      : filteredByTags

  return sortData(filteredByPrice, filters.sort)
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('stores_ratings_summary')
    .select(
      'id, name, image_url, coordinates, average_rating, total_reviews, categories'
    )
    .filter('neighborhood', 'eq', searchParams.get('place'))
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json(error, { status: 400 })
  if (!data) return NextResponse.json([])

  const parameters: TQueryFilters = {
    categories: searchParams.getAll('categories'),
    price: searchParams.get('price')
      ? Number(searchParams.get('price'))
      : undefined,
    delivery: (searchParams.get('delivery') ?? 'delivery') as
      | 'delivery'
      | 'pickup',
    sort: (searchParams.get('sort') ?? undefined) as TQueryFilters['sort'],
    lng: searchParams.get('lng') ? Number(searchParams.get('lng')) : undefined,
    lat: searchParams.get('lat') ? Number(searchParams.get('lat')) : undefined
  }

  const filteredData =
    parameters.delivery === 'pickup'
      ? await dataForPickUp(data, parameters)
      : await dataForDelivery(data, parameters)

  return NextResponse.json(filteredData)
}
