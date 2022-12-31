export function tagListingForFiltering(
  restaurants: {
    foods:
      | {
          tag: any
        }
      | {
          tag: any
        }[]
      | null
  }[]
) {
  let result: Array<{
    tag: string
    count: number
  }> = []
  const tag_array = restaurants.flatMap(restaurant => {
    const removeDuplicatesInRestaurant = [
      ...new Map(
        restaurant.foods.map<[string, { tag: string }]>(item => {
          return [item.tag, item]
        })
      ).values()
    ]
    return removeDuplicatesInRestaurant
  })
  console.log({ tag_array, restaurants: JSON.stringify(restaurants, null, 2) })

  for (let item of tag_array) {
    if (!item.tag) continue
    if (result.length === 0) {
      result.push({ tag: item.tag, count: 1 })
      continue
    }
    const index = result.findIndex(element => element['tag'] === item.tag)

    if (index !== -1) {
      result[index]['count'] += 1
    } else {
      result.push({ tag: item.tag, count: 1 })
    }
  }

  return result
}
