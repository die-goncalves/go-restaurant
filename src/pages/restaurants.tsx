import clsx from 'clsx'
import React, { useEffect, useMemo } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import NextRouter from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { api } from '../services/api'
import { useFilter } from '../contexts/FilterContext'
import { useAuth } from '../contexts/AuthContext'
import { tagListingForFiltering } from '../utils/tags'
import { geographicInformation } from '../utils/geographicInformation'
import { decodeGeohash } from '../utils/geohash'
import { Account } from '../components/Account'
import { Sidebar } from '../components/Sidebar'
import { SelectedTags } from '../components/SelectedTags'
import { RestaurantCard } from '../components/RestaurantCard'
import { Skeleton } from '../components/Skeleton'
import dynamic from 'next/dynamic'
import { SignedUser } from '../components/SignedUser'
import { Logo } from '../components/Logo'

type RestaurantsProps = {
  geohash: string
  tags: Array<{
    id: string
    name: string
    count: number
  }>
}

const DynamicCart = dynamic(() => import('../components/Cart'), {
  ssr: false
})

export default function Restaurants({ geohash, tags }: RestaurantsProps) {
  const { isLoading: isLoadingSession, session } = useAuth()
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
    if (geohash) {
      getPositionCoordinates()
    } else {
      NextRouter.push('/')
    }
  }, [geohash, handleAddPosition])

  return (
    <div className="bg-light-gray-100">
      <Head>
        <title>
          {state.currentPosition
            ? `Restaurantes em ${state.currentPosition?.place} | GoRestaurant`
            : `Restaurantes | GoRestaurant`}
        </title>
      </Head>

      <header
        className={clsx(
          'flex sticky top-0 items-center justify-between bg-light-gray-100/80 backdrop-blur z-10',
          'lg:px-8',
          'sm:px-6',
          'p-4'
        )}
      >
        <Logo />

        <div className="flex gap-4">
          <DynamicCart />

          {isLoadingSession ? (
            <Skeleton className="h-10 w-48" />
          ) : session ? (
            <SignedUser />
          ) : (
            <Account />
          )}
        </div>
      </header>

      <div
        className={clsx(
          'lg:mx-8',
          'sm:flex-row sm:mx-6',
          'flex relative flex-col'
        )}
      >
        <Sidebar tags={tags} />

        <main
          className={clsx(
            'lg:ml-80 lg:pl-4',
            'sm:ml-60 sm:pl-6 sm:pr-0',
            'min-h-[calc(100vh-4.5rem)] flex flex-1 flex-col bg-light-gray-100 px-4'
          )}
        >
          <SelectedTags />

          <div className="w-full">
            {(() => {
              if (isLoading) {
                return (
                  <div
                    className={clsx(
                      '3xl:grid-cols-4 3xl:gap-4',
                      'xl:grid-cols-3 xl:gap-8',
                      'lg:grid-cols-2 lg:my-8',
                      'sm:grid-cols-1 sm:gap-4 sm:my-6',
                      'grid grid-cols-1 gap-4 my-4'
                    )}
                  >
                    {Array.from({ length: 6 }, (item, i) => {
                      return (
                        <Skeleton
                          key={i}
                          className={clsx('xl:h-80', 'w-full h-72')}
                        />
                      )
                    })}
                  </div>
                )
              }
              if (isSuccess && filteredData) {
                return (
                  <div
                    className={clsx(
                      '3xl:grid-cols-4 3xl:gap-4',
                      'xl:grid-cols-3 xl:gap-8',
                      'lg:grid-cols-2 lg:my-8',
                      'sm:grid-cols-1 sm:gap-4 sm:my-6',
                      'grid grid-cols-1 gap-4 my-4'
                    )}
                  >
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

  const supabase = createServerSupabaseClient(ctx, {
    cookieOptions: {
      name: '@gorestaurant-v0.1.0:auth-token',
      domain: 'localhost',
      path: '/',
      sameSite: 'lax',
      secure: false,
      maxAge: 60 * 60 * 24 * 365
    }
  })

  const { data } = await supabase
    .from('restaurants')
    .select('foods ( tag ( * ) )')
    .filter('place', 'eq', place)

  const tags = data ? tagListingForFiltering(data) : []

  return {
    props: {
      geohash: ctx.query.geohash,
      tags
    }
  }
}
