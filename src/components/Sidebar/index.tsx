import clsx from 'clsx'
import { useFilter } from '../../contexts/FilterContext'
import { Accordion } from '../Accordion'
import { Checkbox } from '../Checkbox'
import { DialogMap } from '../DialogMap'
import { RadioGroup } from '../RadioGroup'
import { Slider } from '../Slider'

type SidebarProps = {
  tags: Array<{
    id: string
    name: string
    count: number
  }>
}

export function Sidebar({ tags }: SidebarProps) {
  const {
    handleTag,
    handlePrice,
    handleSort,
    handleDelivery,
    isCheckedTag,
    state
  } = useFilter()

  return (
    <div
      className={clsx(
        'lg:w-80',
        'sm:fixed sm:w-60 sm:shadow-none sm:mb-0',
        'flex flex-col relative bg-light-gray-100 w-full h-full max-h-[calc(100vh-4.5rem)] overflow-auto scrollbar-gutter-stable shadow-lg mb-8'
      )}
    >
      <div>
        <DialogMap />

        <RadioGroup.Root
          defaultValue="delivery"
          value={state.delivery}
          onValueChange={handleDelivery}
        >
          <div className="flex flex-col">
            <RadioGroup.Item value="delivery">Entrega</RadioGroup.Item>
            <RadioGroup.Item value="pickup">Retirada</RadioGroup.Item>
          </div>
        </RadioGroup.Root>
      </div>

      <Accordion.Root>
        <div className="h-0.5 w-full bg-light-gray-200" />
        <Accordion.Item value="order">
          <Accordion.Trigger>Ordenar</Accordion.Trigger>
          <Accordion.Content>
            <RadioGroup.Root value={state.sort} onValueChange={handleSort}>
              <div className="flex flex-col">
                <RadioGroup.Item value="rating">Avaliação</RadioGroup.Item>
                <RadioGroup.Item value="delivery time">
                  Tempo de entrega
                </RadioGroup.Item>
              </div>
            </RadioGroup.Root>
          </Accordion.Content>
        </Accordion.Item>
        {state.delivery === 'delivery' && (
          <>
            <div className="h-0.5 w-full bg-light-gray-200" />
            <Accordion.Item value="price">
              <Accordion.Trigger>Preço para entrega</Accordion.Trigger>
              <Accordion.Content>
                <div className="flex">
                  <Slider value={state.price} onValueChange={handlePrice} />
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </>
        )}
        <div className="h-0.5 w-full bg-light-gray-200" />
        <Accordion.Item value="category">
          <Accordion.Trigger>Categorias</Accordion.Trigger>
          <Accordion.Content>
            <div className="flex flex-col">
              {tags &&
                tags.map(t => (
                  <Checkbox
                    checked={isCheckedTag(t.name)}
                    onChangeChecked={() => handleTag(t.name)}
                    key={`sidebar-checkbox-key-${t.id}`}
                    value={t.name.toLowerCase()}
                    qty={t.count}
                  >
                    {t.name}
                  </Checkbox>
                ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}
