import { useFilter } from '../contexts/FilterContext'
import { FilterTag } from './Tag/FilterTag'

export function SelectedTags() {
  const { state, handleSort, handleTag, handlePrice } = useFilter()

  return (
    <div className="flex flex-col">
      <div className="flex items-center text-2xl mb-4">
        <p>{state.delivery === 'delivery' ? 'Entregas em' : 'Retiradas em'}</p>
        &nbsp;
        <strong>{state.currentPosition?.place}</strong>
      </div>

      <div className="flex flex-wrap gap-2 my-1">
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
