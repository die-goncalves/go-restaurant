import { TTag } from '../types'

export function tagListingForFiltering(
  data:
    | {
        foods:
          | {
              tag: Pick<TTag, 'id' | 'name'>
            }
          | {
              tag: Pick<TTag, 'id' | 'name'>
            }[]
          | null
      }[]
    | null
) {
  if (data)
    return Object.values(
      data
        .flatMap(item => item.foods)
        .reduce((acc, currentValue) => {
          if (currentValue) {
            if (acc[currentValue.tag.id]) {
              console.log(acc[currentValue.tag.id])
              return {
                ...acc,
                [currentValue.tag.id]: {
                  ...acc[currentValue.tag.id],
                  count: acc[currentValue.tag.id].count + 1
                }
              }
            } else {
              return {
                ...acc,
                ...{
                  [currentValue.tag.id]: {
                    id: currentValue.tag.id,
                    name: currentValue.tag.name,
                    count: 1
                  }
                }
              }
            }
          } else return acc
        }, {} as { [key: string]: { id: string; name: string; count: number } })
    ).sort(function (a, b) {
      if (a.name > b.name) return 1
      if (a.name < b.name) return -1
      return 0
    })

  return []
}
