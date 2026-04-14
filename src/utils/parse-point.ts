export const parsePoint = (pointStr: string | null) => {
  if (!pointStr) return null

  const [latStr, lngStr] = pointStr.replace(/[()]/g, '').split(',')

  const lat = Number(latStr)
  const lng = Number(lngStr)

  if (Number.isNaN(lat) || Number.isNaN(lng)) return null

  return { lat, lng }
}
