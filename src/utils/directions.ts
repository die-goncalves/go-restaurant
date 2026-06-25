type Coordinates = {
  lng: number
  lat: number
}

async function getRoute(
  startRoute: Coordinates,
  endRoute: Coordinates
): Promise<{
  duration: number
  distance: number
}> {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY
  const refererUrl = process.env.MAPBOX_REFERER_URL

  if (!accessToken) {
    throw new Error('Mapbox access token is not defined')
  }
  if (!refererUrl) {
    throw new Error('Mapbox referer url is not defined')
  }

  const coords = `${startRoute.lng},${startRoute.lat};${endRoute.lng},${endRoute.lat}`
  const baseUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}`

  const params = new URLSearchParams({
    alternatives: 'false',
    geometries: 'geojson',
    steps: 'false',
    access_token: accessToken
  })

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    headers: {
      Referer: refererUrl
    }
  })

  if (!response.ok) {
    throw new Error(
      `Mapbox API error: ${response.status} ${response.statusText} - referer: ${refererUrl}`
    )
  }

  const json = await response.json()

  if (!json.routes?.length) {
    throw new Error('No routes found between the given coordinates')
  }

  const { duration, distance } = json.routes[0]

  return { duration, distance }
}

export { getRoute }
