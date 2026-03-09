import { useFilter } from '../contexts/filter-context'
import { FilterTag } from './tag/filter-tag'
import { css } from '@/styled-system/css'

export function SelectedTags() {
  const { state, handleSort, handleTag, handlePrice } = useFilter()

  return (
    <div className={css({ display: 'flex', flexDirection: 'column' })}>
      <div
        className={css({
          display: 'none',
          alignItems: 'center',
          fontSize: '2xl',
          mb: '4',
          sm: { display: 'flex' }
        })}
      >
        <p>{state.delivery === 'delivery' ? 'Entregas em' : 'Retiradas em'}</p>
        &nbsp;
        <strong>{state.currentPosition?.place}</strong>
      </div>

      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2',
          my: '1'
        })}
      >
        {state.sort && (
          <FilterTag onClose={() => handleSort('')}>
            {state.sort === 'rating' ? 'Avaliação' : 'Tempo de entrega'}
          </FilterTag>
        )}
        {!!state.price?.length && (
          <FilterTag onClose={() => handlePrice(undefined)}>
            {state.price[0] === 0
              ? 'Entrega grátis'
              : `Até R$${state.price[0]}`}
          </FilterTag>
        )}
        {!!state.tags.length &&
          state.tags.map(tag => (
            <FilterTag key={`filter-tag-${tag}`} onClose={() => handleTag(tag)}>
              {tag}
            </FilterTag>
          ))}
      </div>
    </div>
  )
}
