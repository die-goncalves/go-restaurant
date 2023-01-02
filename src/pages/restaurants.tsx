import React, { useEffect, useMemo } from 'react'
import { GetServerSideProps } from 'next'
import NextImage from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { api } from '../services/api'
import { useFilter } from '../contexts/FilterContext'
import { tagListingForFiltering } from '../utils/tags'
import { geographicInformation } from '../utils/geographicInformation'
import { decodeGeohash } from '../utils/geohash'
import { Account } from '../components/Account'
import { Sidebar } from '../components/Sidebar'
import { SelectedTags } from '../components/SelectedTags'
import { RestaurantCard } from '../components/RestaurantCard'
import { Skeleton } from '../components/Skeleton'

type RestaurantsProps = {
  geohash: string
  tags: Array<{
    tag: string
    count: number
  }>
}

export default function Restaurants({ geohash, tags }: RestaurantsProps) {
  const { state, handleAddPosition } = useFilter()

  const { data, error, isLoading, isError, isSuccess } = useQuery(
    [
      'filter',
      {
        tags: state.tags,
        price: state.price,
        delivery: state.delivery,
        sort: state.sort,
        lng: state.currentPosition?.coordinates.longitude,
        lat: state.currentPosition?.coordinates.latitude,
        place: state.currentPosition?.place
      }
    ],
    async () => {
      const { data } = await api.get(`/api/filter`, {
        params: {
          tag: state.tags,
          price: state.price,
          delivery: state.delivery,
          sort: state.sort,
          lng: state.currentPosition?.coordinates.longitude,
          lat: state.currentPosition?.coordinates.latitude,
          place: state.currentPosition?.place
        }
      })
      return data
    },
    {
      staleTime: 24 * 60 * 60
    }
  )

  const filteredData = useMemo(() => {
    if (data) return data
    return []
  }, [data])

  useEffect(() => {
    async function getPositionCoordinates() {
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
    if (geohash) getPositionCoordinates()
  }, [geohash, handleAddPosition])

  return (
    <div className="bg-light-gray-100">
      <header className="flex sticky top-0 px-8 py-4 items-center justify-between bg-light-gray-100/80 backdrop-blur z-10">
        <NextImage src="/logo.svg" alt="pizza" width="32" height="32" />

        <Account />
      </header>

      <div className="flex relative mx-8">
        <Sidebar tags={tags} />

        <main className="min-h-[calc(100vh-4.5rem)] flex flex-1 ml-80 pl-4 flex-col bg-light-gray-100">
          <SelectedTags />

          <div className="w-full">
            {(() => {
              if (isLoading) {
                return (
                  <div className="grid grid-cols-4 gap-8 my-8">
                    {Array.from({ length: 6 }, (item, i) => {
                      return <Skeleton key={i} className="w-full h-52" />
                    })}
                  </div>
                )
              }
              if (isSuccess && filteredData) {
                return (
                  <div className="grid grid-cols-4 gap-8 my-8">
                    {filteredData.length > 0 &&
                      filteredData.map((restaurant: any) => (
                        <RestaurantCard
                          key={restaurant.id}
                          restaurant={restaurant}
                        />
                      ))}
                  </div>
                )
              }
            })()}
          </div>
        </main>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { place } = ctx.query

  const supabase = createServerSupabaseClient(ctx)

  const { data } = await supabase
    .from('restaurants')
    .select('foods ( tag )')
    .filter('place', 'eq', place)

  const tags = data ? tagListingForFiltering(data) : []

  return {
    props: {
      geohash: ctx.query.geohash,
      tags
    }
  }
}