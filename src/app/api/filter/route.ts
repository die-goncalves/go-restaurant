import { NextRequest, NextResponse } from 'next/server'
import { DeliveryMode, SortOption } from '@/src/contexts/filter-context'
import { logger } from '@/src/lib/logger'
import { createClient } from '@/src/lib/supabase/server'
import { Tables } from '@/src/types/supabase'
import { getRoute } from '@/src/utils/directions'
import { parsePoint } from '@/src/utils/parse-point'

const log = logger.child({
  module: 'api',
  route: '/api/filter',
  method: 'GET'
})

const FREIGHT_RATE_PER_METER = 0.12

type StoreBase = Omit<
  Tables<'stores_ratings_summary'>,
  'neighborhood' | 'description' | 'created_at'
>

export type PickUpData = StoreBase & {
  rating: number | null
  reviews: number | null
  delivery_time: number
}

export type DeliveryData = PickUpData & {
  delivery_price: number
}

type QueryFilters = {
  categories: string[]
  priceRange: number | undefined
  deliveryMode: DeliveryMode
  sort: SortOption | undefined
  lng: number | undefined
  lat: number | undefined
}

type RouteInfo = {
  duration: number
  distance: number
}

const deliveryFreight = (distanceInMeters: number) =>
  Math.round(distanceInMeters / 1000) * FREIGHT_RATE_PER_METER

function compareNullable(
  a: number | null,
  b: number | null,
  order: 'asc' | 'desc'
): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  return order === 'desc' ? b - a : a - b
}

function filterByCategories<T extends { categories: string[] | null }>(
  data: T[],
  categories: string[]
): T[] {
  if (!categories.length) return data
  return data.filter(store =>
    store.categories?.some(c => categories.includes(c))
  )
}

function sortData<
  T extends { rating: number | null; delivery_time: number | null }
>(data: T[], sort: SortOption | undefined): T[] {
  if (!sort) return data
  return [...data].sort((a, b) =>
    sort === 'rating'
      ? compareNullable(a.rating, b.rating, 'desc')
      : compareNullable(a.delivery_time, b.delivery_time, 'asc')
  )
}

async function getRouteInfoByStoreId(
  data: StoreBase[],
  filters: QueryFilters
): Promise<Map<StoreBase['id'], RouteInfo>> {
  const result = new Map<StoreBase['id'], RouteInfo>()

  if (!filters.lng || !filters.lat) return result

  await Promise.all(
    data.map(async item => {
      const point = parsePoint(item.coordinates)
      if (!point) return

      const route = await getRoute(
        { lng: filters.lng!, lat: filters.lat! },
        { lng: point.lng, lat: point.lat }
      )

      result.set(item.id, route)
    })
  )

  return result
}

async function dataForPickUp(
  data: StoreBase[],
  filters: QueryFilters
): Promise<PickUpData[]> {
  const routeInfos = await getRouteInfoByStoreId(data, filters)

  const withRouteInfo: PickUpData[] = data.map(item => ({
    ...item,
    rating: item.average_rating,
    reviews: item.total_reviews,
    delivery_time: routeInfos.get(item.id)?.duration ?? 0
  }))

  return sortData(
    filterByCategories(withRouteInfo, filters.categories),
    filters.sort
  )
}

async function dataForDelivery(
  data: StoreBase[],
  filters: QueryFilters
): Promise<DeliveryData[]> {
  const routeInfos = await getRouteInfoByStoreId(data, filters)

  const withRouteInfo: DeliveryData[] = data.map(item => ({
    ...item,
    rating: item.average_rating,
    reviews: item.total_reviews,
    delivery_time: routeInfos.get(item.id)?.duration ?? 0,
    delivery_price: deliveryFreight(routeInfos.get(item.id)?.distance ?? 0)
  }))

  const filteredByCategories = filterByCategories(
    withRouteInfo,
    filters.categories
  )

  const filteredByPrice =
    filters.priceRange != null
      ? filteredByCategories.filter(
          item => item.delivery_price <= filters.priceRange!
        )
      : filteredByCategories

  return sortData(filteredByPrice, filters.sort)
}

export async function GET(request: NextRequest) {
  const reqLog = log.child({ id: crypto.randomUUID() })
  const { searchParams } = request.nextUrl

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('stores_ratings_summary')
    .select(
      'id, name, image_url, coordinates, average_rating, total_reviews, categories'
    )
    .filter('neighborhood', 'eq', searchParams.get('place'))
    .order('created_at', { ascending: true })

  if (error) {
    reqLog.error({ error }, 'Supabase query failed')
    return NextResponse.json({ error }, { status: 500 })
  }
  if (!data?.length) return NextResponse.json([])

  const filters: QueryFilters = {
    categories: searchParams.getAll('categories'),
    priceRange: searchParams.get('priceRange')
      ? Number(searchParams.get('priceRange'))
      : undefined,
    deliveryMode: (searchParams.get('deliveryMode') ??
      'delivery') as DeliveryMode,
    sort: (searchParams.get('sort') ?? undefined) as SortOption | undefined,
    lng: searchParams.get('lng') ? Number(searchParams.get('lng')) : undefined,
    lat: searchParams.get('lat') ? Number(searchParams.get('lat')) : undefined
  }

  try {
    const filteredData =
      filters.deliveryMode === 'pickup'
        ? await dataForPickUp(data, filters)
        : await dataForDelivery(data, filters)

    return NextResponse.json(filteredData)
  } catch (error) {
    reqLog.error({ error }, 'Error processing filter request')
    return NextResponse.json({ error }, { status: 500 })
  }
}
