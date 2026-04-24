'use client'

import { CheckIcon } from '@/src/components/icons/check'
import { CloseIcon } from '@/src/components/icons/close'
import { Chip } from '@/src/components/ui/chip'
import { useFilter } from '@/src/contexts/filter-context'
import { formatNumber } from '@/src/utils/format-number'
import { css } from '@/styled-system/css'

export function FilterChips() {
  const {
    state: filter,
    toggleCategory,
    setPriceRange,
    setSort,
    clearFilters
  } = useFilter()

  const hasFilters = [
    filter.sort,
    filter.priceRange?.length,
    filter.categories.length
  ].some(Boolean)

  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2',
        marginBlock: '1'
      })}
    >
      <Chip.Root asChild variant={hasFilters ? 'outline' : 'subtle'}>
        <button onClick={clearFilters}>
          {!hasFilters && <CheckIcon />}
          <Chip.Label>Tudo</Chip.Label>
        </button>
      </Chip.Root>

      {filter.sort && (
        <Chip.Root>
          <Chip.Label>
            {filter.sort === 'rating' ? 'Avaliação' : 'Tempo de entrega'}
          </Chip.Label>
          <Chip.DeleteTrigger onClick={() => setSort(null)}>
            <CloseIcon />
          </Chip.DeleteTrigger>
        </Chip.Root>
      )}
      {!!filter.priceRange?.length && (
        <Chip.Root>
          <Chip.Label>
            {filter.priceRange[0] === 0
              ? 'Entrega gratuita'
              : `Até ${formatNumber({
                  options: { currency: 'BRL' },
                  numberToBeFormatted: filter.priceRange[0]
                })}`}
          </Chip.Label>
          <Chip.DeleteTrigger onClick={() => setPriceRange(undefined)}>
            <CloseIcon />
          </Chip.DeleteTrigger>
        </Chip.Root>
      )}
      {!!filter.categories.length &&
        filter.categories.map(c => (
          <Chip.Root key={c}>
            <Chip.Label>{c}</Chip.Label>
            <Chip.DeleteTrigger onClick={() => toggleCategory(c)}>
              <CloseIcon />
            </Chip.DeleteTrigger>
          </Chip.Root>
        ))}
    </div>
  )
}
