import type { NextApiRequest, NextApiResponse } from 'next'
import { TFoodRating, TFoods, TRestaurant, TTag } from '../../types'
import { supabase } from '../../services/supabaseClient'
import { getRouteTimeAndDistance } from '../../utils/directionsMapBox'
import { overallRatingRestaurant } from '../../utils/overallRatingRestaurant'

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
  tag: string[] | undefined
  price: number | undefined
  delivery: 'delivery' | 'pickup'
  sort: 'rating' | 'delivery time' | undefined
  lng: number | undefined
  lat: number | undefined
}

const deliveryFreight = (distance: number) => {
  const freight = 0.12
  return Math.round(distance / 1000) * freight
}

async function dataForPickUp(data: any[], filters: TQueryFilters) {
  let deliveryInfos: { duration: number; distance: number }[] = []

  if (filters.lng && filters.lat) {
    for (let item of data) {
      const itemDeliveryInfo = await getRouteTimeAndDistance(
        { lng: filters.lng, lat: filters.lat },
        { lng: item.coordinates.lng, lat: item.coordinates.lat }
      )
      deliveryInfos.push(itemDeliveryInfo)
    }
  }

  let addRatingInfo: Array<TPickUpData> = data.map((item, index) => {
    const resultRatings = overallRatingRestaurant([...item.foods])
    return {
      ...item,
      foods: [...item.foods],
      rating: resultRatings.overallRating,
      reviews: resultRatings.numberRatings,
      delivery_time: deliveryInfos[index].duration
    }
  })

  let filterByTags: Array<TPickUpData>
  if (filters.tag) {
    filterByTags = addRatingInfo.filter(restaurant => {
      const foodsWithTag = restaurant.foods.filter(food => {
        return filters.tag?.includes(food.tag.name)
      })
      return !!foodsWithTag.length
    })
  } else {
    filterByTags = addRatingInfo
  }

  if (filters.sort) {
    switch (filters.sort) {
      case 'rating':
        filterByTags.sort(function (a, b) {
          if (a.rating === undefined) {
            if (b.rating === undefined) {
              return 0
            } else {
              return 1
            }
          } else {
            if (b.rating === undefined) {
              return -1
            } else {
              if (a.rating > b.rating) {
                return -1
              }
              if (a.rating < b.rating) {
                return 1
              }
            }
          }
          return 0
        })
        break
      default:
        filterByTags.sort(function (a, b) {
          if (a.delivery_time === undefined) {
            if (b.delivery_time === undefined) {
              return 0
            } else {
              return 1
            }
          } else {
            if (b.delivery_time === undefined) {
              return -1
            } else {
              if (a.delivery_time > b.delivery_time) {
                return 1
              }
              if (a.delivery_time < b.delivery_time) {
                return -1
              }
            }
          }
          return 0
        })
    }
  }

  return filterByTags
}

async function dataForDelivery(data: any[], filters: TQueryFilters) {
  let deliveryInfos: { duration: number; distance: number }[] = []

  if (filters.lng && filters.lat) {
    for (let item of data) {
      const itemDeliveryInfo = await getRouteTimeAndDistance(
        { lng: filters.lng, lat: filters.lat },
        { lng: item.coordinates.lng, lat: item.coordinates.lat }
      )
      deliveryInfos.push(itemDeliveryInfo)
    }
  }

  let addInfos: Array<TDeliveryData> = data.map((item, index) => {
    const resultRatings = overallRatingRestaurant([...item.foods])
    return {
      ...item,
      rating: resultRatings.overallRating,
      reviews: resultRatings.numberRatings,
      delivery_time: deliveryInfos[index].duration,
      delivery_price: deliveryFreight(deliveryInfos[index].distance)
    }
  })

  let filterByTags: Array<TDeliveryData> = []
  if (filters.tag) {
    filterByTags = addInfos.filter(restaurant => {
      const foodsWithTag = restaurant.foods.filter(food => {
        return filters.tag?.includes(food.tag.name)
      })
      return !!foodsWithTag.length
    })
  } else {
    filterByTags = addInfos
  }

  let filterByPrices: Array<TDeliveryData>
  if (filters.price !== undefined) {
    filterByPrices = filterByTags.filter(
      item => item.delivery_price <= Number(filters.price)
    )
  } else {
    filterByPrices = filterByTags
  }

  if (filters.sort) {
    switch (filters.sort) {
      case 'rating':
        filterByPrices.sort(function (a, b) {
          if (a.rating === undefined) {
            if (b.rating === undefined) {
              return 0
            } else {
              return 1
            }
          } else {
            if (b.rating === undefined) {
              return -1
            } else {
              if (a.rating > b.rating) {
                return -1
              }
              if (a.rating < b.rating) {
                return 1
              }
            }
          }
          return 0
        })
        break
      default:
        filterByPrices.sort(function (a, b) {
          if (a.delivery_time === undefined) {
            if (b.delivery_time === undefined) {
              return 0
            } else {
              return 1
            }
          } else {
            if (b.delivery_time === undefined) {
              return -1
            } else {
              if (a.delivery_time > b.delivery_time) {
                return 1
              }
              if (a.delivery_time < b.delivery_time) {
                return -1
              }
            }
          }
          return 0
        })
        break
    }
  }

  return filterByPrices
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data, error } = await supabase
    .from('restaurants')
    .select(
      `
        id,
        name,
        coordinates,
        image,
        created_at,
        foods (
          tag ( * ),
          food_rating ( * )
        ),
        place
      `
    )
    .filter('place', 'eq', req.query['place'])
    .order('created_at', { ascending: true })

  if (error) {
    return res.status(400).json(error)
  }

  const parameters = {
    tag:
      typeof req.query['tag[]'] === 'undefined'
        ? undefined
        : typeof req.query['tag[]'] === 'string'
        ? Array.of(req.query['tag[]'])
        : Array.from(req.query['tag[]']),
    price:
      typeof req.query['price[]'] === 'undefined'
        ? undefined
        : Number(req.query['price[]']),
    delivery: req.query['delivery'] as 'delivery' | 'pickup',
    sort: !req.query['sort']
      ? undefined
      : (req.query['sort'] as 'delivery time' | 'rating'),
    lng:
      typeof req.query['lng'] === 'undefined'
        ? undefined
        : Number(req.query['lng']),
    lat:
      typeof req.query['lat'] === 'undefined'
        ? undefined
        : Number(req.query['lat'])
  }

  if (data) {
    let filteredData = []
    if (req.query['delivery'] === 'pickup') {
      filteredData = await dataForPickUp(data, parameters)
    } else {
      filteredData = await dataForDelivery(data, parameters)
    }

    if (!!filteredData.length) {
      return res.status(200).json(filteredData)
    } else {
      return res.status(200).json([])
    }
  } else {
    return res.status(200).json([])
  }
}
